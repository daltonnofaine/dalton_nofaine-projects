const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const PrestadorController = require("../controllers/PrestadorController");
const MensagemService = require("../services/MensagemService");

const router = express.Router();

router.get("/", authMiddleware, requireRole("prestador"), PrestadorController.dashboard);
router.get(
  "/servicos",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.servicos
);
router.get(
  "/pedidos",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.pedidos
);
router.get(
  "/pedidos/:id",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.detalhe
);
router.get(
  "/avaliacoes",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.avaliacoes
);
router.get(
  "/definicoes",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.definicoes
);
router.get(
  "/perfil",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.perfil
);

router.post(
  "/api/servicos",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.criarServico
);
router.put(
  "/api/servicos/:id/estado",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.toggleServico
);
router.put(
  "/api/pedidos/:id/estado",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.actualizarEstadoPedido
);
router.put(
  "/api/definicoes",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.guardarDefinicoes
);
router.put(
  "/api/perfil",
  authMiddleware,
  requireRole("prestador"),
  PrestadorController.actualizarPerfil
);

router.get("/api/pedidos/:id/mensagens", authMiddleware, requireRole("prestador"), async (req, res) => {
  try {
    const mensagens = await MensagemService.listarPorPedido(req.params.id);
    return res.json({ success: true, mensagens });
  } catch (erro) {
    return res.status(400).json({ success: false, erro: erro.message });
  }
});

router.post("/api/pedidos/:id/mensagens", authMiddleware, requireRole("prestador"), async (req, res) => {
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
