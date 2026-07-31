const ClienteService = require("../services/ClienteService");
const PedidoService = require("../services/PedidoService");
const MensagemService = require("../services/MensagemService");
const { formatarData } = require("../utils/helpers");

function formatarHora(dataString) {
  if (!dataString) return "";
  return new Date(dataString).toLocaleString("pt-MZ");
}

async function perfil(req, res) {
  try {
    const [cliente, pedidos] = await Promise.all([
      ClienteService.getDadosCliente(req.session.userId),
      PedidoService.listarPorCliente(req.session.userId),
    ]);

    return res.render("cliente/perfil", {
      cliente,
      pedidos,
      formatarData,
    });
  } catch (erro) {
    return res.status(500).send(erro.message);
  }
}

async function notificacoes(req, res) {
  try {
    const clienteId = req.session.userId;
    const pedidoId = req.query.pedido || null;
    const notificacoes = await ClienteService.getNotificacoes(clienteId);

    let pedidoActivo = null;
    let mensagens = [];

    if (pedidoId) {
      try {
        [pedidoActivo, mensagens] = await Promise.all([
          PedidoService.getDetalhe(pedidoId, clienteId),
          MensagemService.listarPorPedido(pedidoId),
        ]);
      } catch (_erro) {
        pedidoActivo = null;
        mensagens = [];
      }
    }

    return res.render("cliente/notificacoes", {
      notificacoes,
      pedidoActivo,
      mensagens,
      pedidoIdActivo: pedidoId,
      formatarData,
      formatarHora,
    });
  } catch (erro) {
    return res.status(500).send(erro.message);
  }
}

async function actualizarPerfil(req, res) {
  try {
    await ClienteService.actualizarPerfil(req.session.userId, {
      ...req.body,
      notifEmail: req.body.notifEmail === true || req.body.notifEmail === "true",
    });

    if (req.body.nome) req.session.nome = req.body.nome;
    return res.json({ success: true, mensagem: "Perfil actualizado com sucesso." });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
}

async function getNotificacoesJson(req, res) {
  const total = await ClienteService.contarNaoLidas(req.session.userId);
  return res.json({ success: true, total });
}

module.exports = {
  perfil,
  notificacoes,
  actualizarPerfil,
  getNotificacoesJson,
};

