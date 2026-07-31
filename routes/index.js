const express = require("express");
const HomeController = require("../controllers/HomeController");
const ServicoController = require("../controllers/ServicoController");
const authMiddleware = require("../middlewares/authMiddleware"); // Importar middleware de autenticação
const { requireRole } = require("../middlewares/roleMiddleware"); // Importar middleware de role

const router = express.Router();

router.get("/", HomeController.index);
router.get("/sobre", HomeController.sobre);
router.get("/contacto", HomeController.contacto);
router.post("/contacto", HomeController.enviarContacto);
router.get("/prestador/:id/perfil", ServicoController.perfilPublico);

// Rota para a home do cliente autenticado
router.get("/home", authMiddleware, requireRole("cliente"), HomeController.homeCliente);

module.exports = router;
