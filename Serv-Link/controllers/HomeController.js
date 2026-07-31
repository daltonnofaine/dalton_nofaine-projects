const HomeService = require("../services/HomeService");

async function index(req, res) {
  try {
    const [categorias, estatisticas] = await Promise.all([
      HomeService.getCategorias(),
      HomeService.getEstatisticas(),
    ]);

    return res.render("public/index", { categorias, estatisticas });
  } catch (_erro) {
    return res.render("public/index", {
      categorias: [],
      estatisticas: { totalPrestadores: 0, totalServicos: 0, totalConcluidos: 0 },
    });
  }
}

function sobre(req, res) {
  return res.render("public/sobre");
}

function contacto(req, res) {
  return res.render("public/contacto", { enviado: false, erro: null });
}

function enviarContacto(req, res) {
  const { nome, email, mensagem } = req.body;
  if (!nome || !email || !mensagem) {
    return res.render("public/contacto", {
      enviado: false,
      erro: "Preencha nome, email e mensagem.",
    });
  }
  return res.render("public/contacto", { enviado: true, erro: null });
}

// Novo método para a home page de clientes autenticados
function homeCliente(req, res) {
  // A req.session já estará populada pelo AuthController no login/cadastro.
  // E o res.locals.sessao também terá os dados disponíveis.
  // Podemos passar os dados da sessão diretamente para o template.
  return res.render("public/index-cliente", {
    sessao: req.session, // Passa os dados da sessão para o template
    // ... outros dados dinâmicos que possam ser necessários para a home do cliente
  });
}


module.exports = { index, sobre, contacto, enviarContacto, homeCliente };

