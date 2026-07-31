const AuthService = require("../services/AuthService");
const { supabase } = require("../config/supabase");

// Função auxiliar para redirecionar o utilizador com base no seu perfil.
// Confia que req.session já foi populada pelo handler antes de ser chamada.
function redirigirPorPerfil(req, res, perfil) {
  // Verificação de segurança: garante que req e req.session estão disponíveis.
  // Se 'req' for undefined neste ponto, o erro "req is not defined" seria desencadeado.
  // Mas como 'req' é passado como argumento, ele deve estar definido.
  if (!req || !req.session) {
    console.error("Erro Crítico de Segurança: req ou req.session não estão definidos no contexto de redirecionamento!");
    // Em caso de erro, redireciona para login ou retorna erro interno.
    return res.status(500).render('auth/login', { erro: "Erro interno do servidor: Sessão não disponível." });
  }

  // Redireciona o utilizador para a página apropriada com base no seu perfil.
  if (perfil === "prestador") {
    return res.redirect("/prestador"); 
  } else if (perfil === "admin") {
    return res.redirect("/admin/sistema"); 
  } else { // Cliente ou perfil padrão
    return res.redirect("/home"); 
  }
}

// Rota GET /auth/login: Exibe a página de login. Se o utilizador já estiver logado, redireciona-o.
function loginPage(req, res) {
  if (req.session.userId) {
    // Usa o perfil já armazenado na sessão para redirecionar.
    return redirigirPorPerfil(req, res, req.session.perfil);
  }
  return res.render("auth/login", { erro: null });
}

// Rota GET /auth/cadastro: Exibe a página de cadastro. Se o utilizador já estiver logado, redireciona-o.
function cadastroPage(req, res) {
  if (req.session.userId) {
    // Usa o perfil já armazenado na sessão para redirecionar.
    return redirigirPorPerfil(req, res, req.session.perfil);
  }
  return res.render("auth/cadastro", { erro: null });
}

// Rota POST /auth/login: Processa a tentativa de login do utilizador.
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("auth/login", { erro: "Preencha o e-mail e a senha." });
    }

    const utilizador = await AuthService.login(email, password);

    // Popula a sessão com os dados do utilizador autenticado.
    req.session.userId = utilizador.id;
    req.session.nome = utilizador.nome;
    req.session.perfil = utilizador.perfil;
    req.session.email = utilizador.email;
    req.session.avatarUrl = utilizador.avatar_url;

    // Redireciona para a página apropriada com base no perfil do utilizador.
    return redirigirPorPerfil(req, res, utilizador.perfil);
  } catch (erro) {
    console.error("Erro no login:", erro.message); 
    return res.render("auth/login", { erro: erro.message });
  }
}

// Rota POST /auth/cadastro: Processa a criação de uma nova conta.
async function cadastro(req, res) {
  try {
    const { perfil, nome, apelido, email, telefone, password, confirmar_password, categoriaId, preco, experiencia, descricao } = req.body;
    
    if (!perfil || !nome || !apelido || !email || !password) {
      return res.render("auth/cadastro", { erro: "Preencha os campos obrigatórios (Perfil, Nome, Apelido, E-mail, Senha)." });
    }
    
    if (password !== confirmar_password) {
      return res.render("auth/cadastro", { erro: "As senhas não coincidem." });
    }

    let utilizadorCriado; 

    if (perfil === "prestador") {
      if (!categoriaId || !preco || !experiencia) {
         return res.render("auth/cadastro", { erro: "Para se cadastrar como Prestador, preencha todos os campos profissionais (Categoria, Preço Médio, Anos de Experiência)." });
      }
      utilizadorCriado = await AuthService.registarPrestador(req.body);
    } else if (perfil === "cliente") {
      utilizadorCriado = await AuthService.registarCliente(req.body);
    } else {
      return res.render("auth/cadastro", { erro: "Perfil de utilizador inválido." });
    }

    // Popula a sessão com os dados do utilizador recém-criado.
    req.session.userId = utilizadorCriado.id;
    req.session.nome = utilizadorCriado.nome;
    req.session.perfil = utilizadorCriado.perfil;
    req.session.email = utilizadorCriado.email;
    req.session.avatarUrl = utilizadorCriado.avatar_url;

    // Redireciona para a página apropriada com base no perfil do utilizador recém-criado.
    return redirigirPorPerfil(req, res, utilizadorCriado.perfil);
  } catch (erro) {
    console.error("Erro no cadastro:", erro.message); 
    // O erro "A user with this email address has already been registered" virá daqui.
    // Se for um erro de email duplicado, podemos formatar a mensagem.
    if (erro.message.includes("duplicate key value violates unique constraint")) { 
        return res.render("auth/cadastro", { erro: "Este endereço de e-mail já está registado. Por favor, use outro ou faça login." });
    }
    // Outros erros genéricos
    return res.render("auth/cadastro", { erro: erro.message || "Ocorreu um erro ao processar o seu cadastro. Tente novamente mais tarde." });
  }
}

// Rota GET /auth/logout: Finaliza a sessão do utilizador.
async function logout(req, res) {
  try {
    await AuthService.logout();
  } catch (_erro) {
    console.warn("Erro ao fazer logout remoto do Supabase, mas sessão local será destruída.");
  } finally {
    req.session.destroy(() => res.redirect("/"));
  }
}

module.exports = {
  loginPage,
  cadastroPage,
  login,
  cadastro,
  logout,
};
