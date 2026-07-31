const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { requireRole } = require("../../middlewares/roleMiddleware");
const PedidoService = require("../../services/PedidoService");

const router = express.Router();

router.post("/", authMiddleware, requireRole("cliente"), async (req, res) => {
  try {
    const { servicoId, nomeCliente, telefone, local, periodo, urgencia, descricao } =
      req.body;

    if (!servicoId || !nomeCliente || !telefone || !local) {
      return res.status(400).json({
        success: false,
        erro: "Preencha os campos obrigatorios do pedido.",
      });
    }

    const pedido = await PedidoService.criarPedido(
      { servicoId, nomeCliente, telefone, local, periodo, urgencia, descricao },
      req.session.userId
    );

    return res.status(201).json({
      success: true,
      pedidoId: pedido.id,
      estado: pedido.estado,
      mensagem: "Pedido enviado com sucesso.",
    });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
});

module.exports = router;
