const { supabase } = require("../config/supabase");

async function listarServicos(filtros = {}) {
  const {
    q = "",
    categoria = "",
    precoMin = "",
    precoMax = "",
    avaliacao = "",
    pagina = 1,
  } = filtros;

  const itensPorPagina = 12;
  const page = Number.isNaN(parseInt(pagina, 10)) ? 1 : parseInt(pagina, 10);
  const offset = (page - 1) * itensPorPagina;

  let query = supabase
    .from("servicos")
    .select(
      `
      id,titulo,descricao,preco,unidade_preco,estado,total_pedidos,categoria_id,prestador_id,
      prestadores ( id,avaliacao_media,total_avaliacoes,cidade,disponivel,estado_verificacao,utilizadores ( nome,avatar_url ) ),
      categorias ( id,nome,icone_url )
    `,
      { count: "exact" }
    )
    .eq("estado", "activo");

  if (q && q.trim()) {
    query = query.or(`titulo.ilike.%${q.trim()}%,descricao.ilike.%${q.trim()}%`);
  }
  if (categoria) query = query.eq("categoria_id", parseInt(categoria, 10));
  if (precoMin) query = query.gte("preco", parseFloat(precoMin));
  if (precoMax) query = query.lte("preco", parseFloat(precoMax));

  query = query.range(offset, offset + itensPorPagina - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  let servicos = data || [];
  if (avaliacao) {
    const min = parseFloat(avaliacao);
    servicos = servicos.filter((s) => (s.prestadores?.avaliacao_media || 0) >= min);
  }

  return {
    servicos,
    total: count || 0,
    pagina: page,
    totalPaginas: Math.max(1, Math.ceil((count || 0) / itensPorPagina)),
  };
}

async function getDetalhe(servicoId) {
  const { data, error } = await supabase
    .from("servicos")
    .select(
      `
      id,titulo,descricao,preco,unidade_preco,estado,total_pedidos,criado_em,
      prestadores (
        id,biografia,especialidade,anos_experiencia,cidade,avaliacao_media,total_avaliacoes,total_pedidos,disponivel,estado_verificacao,
        utilizadores ( id,nome,avatar_url,telefone )
      ),
      categorias ( id,nome,icone_url )
    `
    )
    .eq("id", servicoId)
    .eq("estado", "activo")
    .single();

  if (error || !data) throw new Error("Servico nao encontrado.");
  return data;
}

async function getAvaliacoes(servicoId) {
  const { data: servico, error: e1 } = await supabase
    .from("servicos")
    .select("prestador_id")
    .eq("id", servicoId)
    .single();
  if (e1 || !servico) return [];

  const { data, error } = await supabase
    .from("avaliacoes")
    .select(
      `
      id,pontuacao,comentario,criado_em,
      clientes ( utilizadores ( nome,avatar_url ) )
    `
    )
    .eq("prestador_id", servico.prestador_id)
    .order("criado_em", { ascending: false })
    .limit(5);
  if (error) return [];
  return data || [];
}

async function getPrestadorPublico(prestadorId) {
  const { data, error } = await supabase
    .from("prestadores")
    .select(
      `
      id,biografia,especialidade,anos_experiencia,cidade,avaliacao_media,total_avaliacoes,total_pedidos,disponivel,estado_verificacao,
      utilizadores ( id,nome,avatar_url,telefone )
    `
    )
    .eq("id", prestadorId)
    .eq("estado_verificacao", "aprovado")
    .eq("perfil_publico_activo", true)
    .single();
  if (error || !data) throw new Error("Prestador nao encontrado.");
  return data;
}

async function getServicosPorPrestador(prestadorId) {
  const { data, error } = await supabase
    .from("servicos")
    .select("id,titulo,preco,unidade_preco,total_pedidos,categorias(nome)")
    .eq("prestador_id", prestadorId)
    .eq("estado", "activo")
    .order("criado_em", { ascending: false });
  if (error) return [];
  return data || [];
}

module.exports = {
  listarServicos,
  getDetalhe,
  getAvaliacoes,
  getPrestadorPublico,
  getServicosPorPrestador,
};

