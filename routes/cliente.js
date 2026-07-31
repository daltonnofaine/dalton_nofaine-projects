const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const ClienteController = require("../controllers/ClienteController");

const router = express.Router();

router.get("/perfil", authMiddleware, requireRole("cliente"), ClienteController.perfil);
router.get(
  "/notificacoes",
  authMiddleware,
  requireRole("cliente"),
  ClienteController.notificacoes
);

module.exports = router;
