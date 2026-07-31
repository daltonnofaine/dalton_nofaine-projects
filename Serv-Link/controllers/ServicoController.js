const ServicoService = require("../services/ServicoService");
const HomeService = require("../services/HomeService");
const { formatarPreco, formatarData } = require("../utils/helpers");

async function explorar(req, res) {
  try {
    const filtros = {
      q: req.query.q || "",
      categoria: req.query.categoria || "",
      precoMin: req.query.precoMin || "",
      precoMax: req.query.precoMax || "",
      avaliacao: req.query.avaliacao || "",
      pagina: req.query.pagina || 1,
    };

    const [resultado, categorias] = await Promise.all([
      ServicoService.listarServicos(filtros),
      HomeService.getCategorias(),
    ]);

    return res.render("servicos/explorar", {
      servicos: resultado.servicos,
      total: resultado.total,
      pagina: resultado.pagina,
      totalPaginas: resultado.totalPaginas,
      categorias,
      filtros,
      formatarPreco,
    });
  } catch (_erro) {
    return res.render("servicos/explorar", {
      servicos: [],
      total: 0,
      pagina: 1,
      totalPaginas: 1,
      categorias: [],
      filtros: {},
      formatarPreco,
    });
  }
}

async function detalhe(req, res) {
  try {
    const servicoId = req.params.id;
    const [servico, avaliacoes] = await Promise.all([
      ServicoService.getDetalhe(servicoId),
      ServicoService.getAvaliacoes(servicoId),
    ]);

    return res.render("servicos/detalhe", {
      servico,
      avaliacoes,
      formatarPreco,
      formatarData,
    });
  } catch (_erro) {
    return res.status(404).send("Servico nao encontrado.");
  }
}

async function perfilPublico(req, res) {
  try {
    const prestadorId = req.params.id;
    const [prestador, servicos] = await Promise.all([
      ServicoService.getPrestadorPublico(prestadorId),
      ServicoService.getServicosPorPrestador(prestadorId),
    ]);

    return res.render("prestador/perfil-publico", {
      prestador,
      servicos,
      formatarPreco,
    });
  } catch (_erro) {
    return res.status(404).send("Perfil de prestador nao encontrado.");
  }
}

module.exports = { explorar, detalhe, perfilPublico };

