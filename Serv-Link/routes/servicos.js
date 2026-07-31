const express = require("express");
const ServicoController = require("../controllers/ServicoController");

const router = express.Router();

router.get("/", ServicoController.explorar);
router.get("/:id", ServicoController.detalhe);

module.exports = router;
