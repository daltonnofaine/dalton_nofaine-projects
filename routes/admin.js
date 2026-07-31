const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const AdminController = require("../controllers/AdminController");

const router = express.Router();

router.get("/sistema", authMiddleware, requireRole("admin"), AdminController.sistema);
router.get(
  "/prestadores",
  authMiddleware,
  requireRole("admin"),
  AdminController.prestadores
);
router.get(
  "/operacoes",
  authMiddleware,
  requireRole("admin"),
  AdminController.operacoes
);
router.get(
  "/relatorios",
  authMiddleware,
  requireRole("admin"),
  AdminController.relatorios
);
router.get(
  "/configuracoes",
  authMiddleware,
  requireRole("admin"),
  AdminController.configuracoes
);

router.put(
  "/api/prestadores/:id/validar",
  authMiddleware,
  requireRole("admin"),
  AdminController.validarPrestador
);
router.put(
  "/api/campanhas/:id",
  authMiddleware,
  requireRole("admin"),
  AdminController.actualizarCampanha
);
router.get(
  "/api/relatorios/exportar",
  authMiddleware,
  requireRole("admin"),
  AdminController.exportarCSV
);
router.put(
  "/api/configuracoes",
  authMiddleware,
  requireRole("admin"),
  AdminController.actualizarConfiguracao
);

module.exports = router;
