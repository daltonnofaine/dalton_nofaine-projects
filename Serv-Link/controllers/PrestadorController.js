const PrestadorService = require("../services/PrestadorService");
const PedidoService = require("../services/PedidoService");
const MensagemService = require("../services/MensagemService");
const HomeService = require("../services/HomeService");
const { formatarPreco, formatarData } = require("../utils/helpers");

function formatarHora(dataString) {
  if (!dataString) return "";
  return new Date(dataString).toLocaleString("pt-MZ");
}

async function dashboard(req, res) {
  const metricas = await PrestadorService.getMetricasDashboard(req.session.userId);
  return res.render("prestador/dashboard", {
    metricas,
    formatarPreco,
    formatarData,
    paginaActiva: "visao-geral",
  });
}

async function servicos(req, res) {
  const [servicos, categorias] = await Promise.all([
    PrestadorService.getServicos(req.session.userId),
    HomeService.getCategorias(),
  ]);

  return res.render("prestador/servicos", {
    servicos,
    categorias,
    formatarPreco,
    paginaActiva: "servicos",
  });
}

async function pedidos(req, res) {
  const filtroEstado = req.query.estado || null;
  const pedidos = await PedidoService.listarPorPrestador(req.session.userId, filtroEstado);
  return res.render("prestador/pedidos", {
    pedidos,
    filtroEstado,
    formatarData,
    paginaActiva: "pedidos",
  });
}

async function detalhe(req, res) {
  const [pedido, mensagens] = await Promise.all([
    PedidoService.getDetalhe(req.params.id, req.session.userId),
    MensagemService.listarPorPedido(req.params.id),
  ]);

  return res.render("prestador/requisicao-detalhe", {
    pedido,
    mensagens,
    formatarData,
    formatarHora,
    paginaActiva: "pedidos",
  });
}

async function avaliacoes(req, res) {
  const avaliacoes = await PrestadorService.getAvaliacoes(req.session.userId);
  return res.render("prestador/avaliacoes", {
    avaliacoes,
    formatarData,
    paginaActiva: "avaliacoes",
  });
}

async function definicoes(req, res) {
  const perfil = await PrestadorService.getDadosPerfil(req.session.userId);
  return res.render("prestador/definicoes", {
    perfil,
    paginaActiva: "definicoes",
  });
}

async function perfil(req, res) {
  const prestador = await PrestadorService.getDadosPerfil(req.session.userId);
  return res.render("prestador/perfil", {
    prestador,
    paginaActiva: "perfil",
  });
}

async function criarServico(req, res) {
  try {
    const servico = await PrestadorService.criarServico(req.session.userId, req.body);
    return res.status(201).json({ success: true, servico });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
}

async function toggleServico(req, res) {
  try {
    const resultado = await PrestadorService.toggleEstadoServico(
      req.params.id,
      req.session.userId
    );
    return res.json({ success: true, ...resultado });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
}

async function actualizarEstadoPedido(req, res) {
  try {
    const resultado = await PedidoService.actualizarEstado(
      req.params.id,
      req.body.estado,
      req.session.userId
    );
    return res.json({ success: true, ...resultado });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
}

async function guardarDefinicoes(req, res) {
  try {
    await PrestadorService.guardarDefinicoes(req.session.userId, req.body);
    return res.json({ success: true, mensagem: "Definicoes guardadas." });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
}

async function actualizarPerfil(req, res) {
  try {
    await PrestadorService.actualizarPerfil(req.session.userId, req.body);
    if (req.body.nome) req.session.nome = req.body.nome;
    return res.json({ success: true, mensagem: "Perfil actualizado." });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
}

module.exports = {
  dashboard,
  servicos,
  pedidos,
  detalhe,
  avaliacoes,
  definicoes,
  perfil,
  criarServico,
  toggleServico,
  actualizarEstadoPedido,
  guardarDefinicoes,
  actualizarPerfil,
};

