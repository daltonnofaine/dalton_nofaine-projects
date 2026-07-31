const { supabase, supabaseAdmin } = require("../config/supabase"); // Assume que o supabaseAdmin está configurado

async function registarCliente(dados) {
  const { nome, apelido, email, telefone, password } = dados; // Removido 'cidade' pois não está na schema detalhada e 'perfil' é inferido
  const nomeCompleto = `${nome} ${apelido}`.trim();

  // Usar Admin para criar a conta. Com email_confirm: true, a conta fica ativa imediatamente.
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, 
    user_metadata: { nome: nomeCompleto, perfil: "cliente" },
  });
  
  if (authError) throw new Error(authError.message);

  const userId = authData?.user?.id;
  if (!userId) throw new Error("Nao foi possivel criar utilizador.");

  // Inserir dados adicionais do utilizador na tabela 'utilizadores'
  const { error: e1 } = await supabaseAdmin.from("utilizadores").insert({
    id: userId,
    nome: nomeCompleto,
    email,
    telefone: telefone || null,
    perfil: "cliente",
    avatar_url: null // Avatar será definido depois, se aplicável
  });
  if (e1) throw new Error(e1.message);

  // Inserir dados específicos do perfil cliente
  // A tabela 'clientes' não tem 'cidade' na schema detalhada do plano principal. Removendo.
  const { error: e2 } = await supabaseAdmin.from("clientes").insert({
    id: userId,
    // cidade: cidade || null, // Removido por não estar na schema detalhada
  });
  if (e2 && e2.code !== '23505') throw new Error(e2.message); // Ignorar erro se a chave primária já existir (caso raro)

  return { id: userId, nome: nomeCompleto, email, perfil: "cliente", avatar_url: null };
}

async function registarPrestador(dados) {
  const {
    nome,
    apelido,
    email,
    telefone,
    categoriaId, // Este é o nome do campo do formulário EJS
    preco,
    experiencia,
    descricao,
    password,
  } = dados;
  const nomeCompleto = `${nome} ${apelido}`.trim();

  // Criar via Admin, com conta ativa imediatamente
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nome: nomeCompleto, perfil: "prestador" },
  });
  
  if (authError) throw new Error(authError.message);

  const userId = authData?.user?.id;
  if (!userId) throw new Error("Nao foi possivel criar utilizador.");

  // Inserir dados adicionais do utilizador
  const { error: e1 } = await supabaseAdmin.from("utilizadores").insert({
    id: userId,
    nome: nomeCompleto,
    email,
    telefone: telefone || null,
    perfil: "prestador",
    avatar_url: null // Avatar será definido depois
  });
  if (e1) throw new Error(e1.message);

  // Inserir dados específicos do prestador, mapeando campos do formulário para a schema da BD
  const { error: e2 } = await supabaseAdmin.from("prestadores").insert({
    id: userId,
    especialidade: categoriaId, // Mapeia categoriaId do formulário para especialidade na BD
    preco_medio: preco ? parseFloat(String(preco).replace(/[^\d.]/g, "")) : null, // Limpa e converte o preço
    anos_experiencia: experiencia || null, // Mapeia experiencia do form para anos_experiencia na BD
    biografia: descricao || null,
    estado_verificacao: "pendente",
    // Nota: Upload de documento não implementado aqui; requer configuração de Multer e Storage
  });
  if (e2) throw new Error(e2.message);

  return { id: userId, nome: nomeCompleto, email, perfil: "prestador", avatar_url: null };
}

async function login(email, password) {
  // 1. Autenticar com Supabase Auth usando cliente público (respeita RLS por padrão)
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (authError) {
    // Mensagem de erro genérica para credenciais incorretas
    if (authError.message.includes("Invalid login credentials")) {
      throw new Error("E-mail ou senha incorretos.");
    }
    // Outros erros de autenticação Supabase
    throw new Error("Ocorreu um erro ao tentar fazer login.");
  }

  const userId = authData?.user?.id;
  if (!userId) throw new Error("Utilizador invalido.");

  // 2. Buscar dados adicionais do utilizador da nossa tabela 'utilizadores'
  // Usar o cliente público 'supabase' para buscar dados, respeitando RLS.
  const { data: utilizador, error: e1 } = await supabase
    .from("utilizadores")
    .select("id,nome,email,perfil,avatar_url,activo") // Selecionar campos relevantes para a sessão
    .eq("id", userId)
    .single();

  if (e1 || !utilizador) throw new Error("Perfil de utilizador nao encontrado.");
  if (!utilizador.activo) throw new Error("A sua conta está inactiva. Por favor, contacte o suporte.");

  // Retornar os dados essenciais para o Controller popular a sessão
  return utilizador;
}

async function logout() {
  // Tenta fazer logout remoto do Supabase Auth
  await supabase.auth.signOut();
}

module.exports = { registarCliente, registarPrestador, login, logout };

