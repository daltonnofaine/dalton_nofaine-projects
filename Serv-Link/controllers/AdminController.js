const AdminService = require("../services/AdminService");
const { formatarData, formatarPreco } = require("../utils/helpers");

async function sistema(req, res) {
  const metricas = await AdminService.getMetricasGlobais();
  return res.render("admin/sistema", {
    metricas,
    formatarData,
    formatarPreco,
    paginaActiva: "sistema",
  });
}

async function prestadores(req, res) {
  const filtroEstado = req.query.estado || null;
  const prestadores = await AdminService.listarPrestadores(filtroEstado);
  return res.render("admin/prestadores", {
    prestadores,
    filtroEstado,
    formatarData,
    paginaActiva: "prestadores",
  });
}

async function operacoes(req, res) {
  const campanhas = await AdminService.listarCampanhas();
  return res.render("admin/operacoes", {
    campanhas,
    formatarData,
    formatarPreco,
    paginaActiva: "operacoes",
  });
}

async function relatorios(req, res) {
  const kpis = await AdminService.getKPIs();
  return res.render("admin/relatorios", {
    kpis,
    formatarPreco,
    paginaActiva: "relatorios",
  });
}

async function configuracoes(req, res) {
  const configuracoes = await AdminService.getConfiguracoes();
  return res.render("admin/configuracoes", {
    configuracoes,
    paginaActiva: "configuracoes",
  });
}

async function validarPrestador(req, res) {
  try {
    const resultado = await AdminService.validarPrestador(
      req.params.id,
      req.body.decisao,
      req.body.nota,
      req.session.userId
    );
    return res.json({ success: true, ...resultado });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
}

async function actualizarCampanha(req, res) {
  try {
    await AdminService.actualizarCampanha(req.params.id, req.body, req.session.userId);
    return res.json({ success: true, mensagem: "Campanha actualizada." });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
}

async function exportarCSV(req, res) {
  try {
    const csv = await AdminService.exportarPedidosCSV();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="serv-link-pedidos.csv"');
    return res.send("\uFEFF" + csv);
  } catch (erro) {
    return res.status(500).json({ success: false, erro: erro.message });
  }
}

async function actualizarConfiguracao(req, res) {
  try {
    await AdminService.actualizarConfiguracao(
      req.body.chave,
      req.body.valor,
      req.session.userId
    );
    return res.json({ success: true, mensagem: "Configuracao guardada." });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
}

module.exports = {
  sistema,
  prestadores,
  operacoes,
  relatorios,
  configuracoes,
  validarPrestador,
  actualizarCampanha,
  exportarCSV,
  actualizarConfiguracao,
};

