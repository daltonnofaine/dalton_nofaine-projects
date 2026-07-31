const express = require("express");
const ServicoService = require("../../services/ServicoService");
const { formatarPreco } = require("../../utils/helpers");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filtros = {
      q: req.query.q || "",
      categoria: req.query.categoria || "",
      precoMin: req.query.precoMin || "",
      precoMax: req.query.precoMax || "",
      avaliacao: req.query.avaliacao || "",
      pagina: req.query.pagina || 1,
    };

    const resultado = await ServicoService.listarServicos(filtros);
    const servicos = (resultado.servicos || []).map((s) => ({
      ...s,
      precoFormatado: formatarPreco(s.preco),
      nomePrestador: s.prestadores?.utilizadores?.nome || "",
      avaliacaoMedia: s.prestadores?.avaliacao_media || 0,
      totalAvaliacoes: s.prestadores?.total_avaliacoes || 0,
      cidadePrestador: s.prestadores?.cidade || "",
      categoriaNome: s.categorias?.nome || "",
    }));

    return res.json({
      success: true,
      servicos,
      total: resultado.total,
      pagina: resultado.pagina,
      totalPaginas: resultado.totalPaginas,
    });
  } catch (erro) {
    return res.status(500).json({ success: false, erro: erro.message });
  }
});

module.exports = router;
