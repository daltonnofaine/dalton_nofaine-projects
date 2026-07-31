const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { requireRole } = require("../../middlewares/roleMiddleware");
const ClienteController = require("../../controllers/ClienteController");
const MensagemService = require("../../services/MensagemService");

const router = express.Router();

router.put(
  "/cliente",
  authMiddleware,
  requireRole("cliente"),
  ClienteController.actualizarPerfil
);

router.get(
  "/notificacoes",
  authMiddleware,
  requireRole("cliente"),
  ClienteController.getNotificacoesJson
);

router.get("/pedidos/:id/mensagens", authMiddleware, async (req, res) => {
  try {
    const mensagens = await MensagemService.listarPorPedido(req.params.id);
    return res.json({ success: true, mensagens });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
});

router.post("/pedidos/:id/mensagens", authMiddleware, async (req, res) => {
  try {
    const mensagem = await MensagemService.enviar(
      req.params.id,
      req.session.userId,
      req.body.conteudo
    );
    return res.status(201).json({ success: true, mensagem });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
});

module.exports = router;
