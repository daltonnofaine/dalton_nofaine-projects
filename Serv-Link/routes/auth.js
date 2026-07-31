const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

// Rotas de Login
// GET /auth/login - Exibe a página de login
router.get("/login", AuthController.loginPage);
// POST /auth/login - Processa a tentativa de login do utilizador
router.post("/login", AuthController.login);

// Rotas de Cadastro
// GET /auth/cadastro - Exibe a página de cadastro
router.get("/cadastro", AuthController.cadastroPage);
// POST /auth/cadastro - Processa a criação de uma nova conta (para cliente ou prestador)
router.post("/cadastro", AuthController.cadastro);

// Rota de Logout
// GET /auth/logout - Finaliza a sessão do utilizador
router.get("/logout", AuthController.logout);

module.exports = router;
