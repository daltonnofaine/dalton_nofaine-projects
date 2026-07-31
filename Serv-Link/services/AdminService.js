const { supabaseAdmin } = require("../config/supabase");

async function getMetricasGlobais() {
  const [
    { count: totalUtilizadores },
    { count: totalPrestadores },
    { count: prestadoresPendentes },
    { count: totalServicos },
    { count: pedidosAbertos },
    { count: pedidosConcluidos },
    { data: actividadeRecente },
  ] = await Promise.all([
    supabaseAdmin.from("utilizadores").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("prestadores")
      .select("*", { count: "exact", head: true })
      .eq("estado_verificacao", "aprovado"),
    supabaseAdmin
      .from("prestadores")
      .select("*", { count: "exact", head: true })
      .eq("estado_verificacao", "pendente"),
    supabaseAdmin.from("servicos").select("*", { count: "exact", head: true }).eq("estado", "activo"),
    supabaseAdmin
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .in("estado", ["pendente", "confirmado", "em_curso"]),
    supabaseAdmin
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .eq("estado", "concluido"),
    supabaseAdmin
      .from("pedidos")
      .select(
        `
        id,estado,criado_em,
        clientes ( utilizadores ( nome ) ),
        prestadores ( utilizadores ( nome ) ),
        servicos ( titulo )
      `
      )
      .order("criado_em", { ascending: false })
      .limit(8),
  ]);

  const totalPedidos = (pedidosAbertos || 0) + (pedidosConcluidos || 0);
  const taxaConclusao = totalPedidos ? Math.round(((pedidosConcluidos || 0) / totalPedidos) * 100) : 0;

  return {
    totalUtilizadores: totalUtilizadores || 0,
    totalPrestadores: totalPrestadores || 0,
    prestadoresPendentes: prestadoresPendentes || 0,
    totalServicos: totalServicos || 0,
    pedidosAbertos: pedidosAbertos || 0,
    pedidosConcluidos: pedidosConcluidos || 0,
    taxaConclusao,
    actividadeRecente: actividadeRecente || [],
  };
}

async function listarPrestadores(filtroEstado = null) {
  let query = supabaseAdmin
    .from("prestadores")
    .select(
      `
      id,estado_verificacao,nota_risco,avaliacao_media,total_avaliacoes,total_pedidos,criado_em,especialidade,
      utilizadores ( id,nome,email,telefone,avatar_url,criado_em )
    `
    )
    .order("criado_em", { ascending: false });

  if (filtroEstado) query = query.eq("estado_verificacao", filtroEstado);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

async function validarPrestador(prestadorId, decisao, nota, adminId) {
  const validos = ["aprovado", "rejeitado", "suspenso", "pendente"];
  if (!validos.includes(decisao)) throw new Error("Decisao invalida.");

  const { error } = await supabaseAdmin
    .from("prestadores")
    .update({
      estado_verificacao: decisao,
      nota_risco: nota || null,
      actualizado_em: new Date().toISOString(),
    })
    .eq("id", prestadorId);

  if (error) throw new Error(error.message);

  await supabaseAdmin
    .from("utilizadores")
    .update({ activo: decisao !== "rejeitado" && decisao !== "suspenso" ? true : false })
    .eq("id", prestadorId);

  await supabaseAdmin.from("auditoria").insert({
    admin_id: adminId,
    accao: `validacao_prestador_${decisao}`,
    entidade_tipo: "prestador",
    entidade_id: prestadorId,
    detalhes: { decisao, nota: nota || null },
  });

  await supabaseAdmin.from("notificacoes").insert({
    usuario_id: prestadorId,
    tipo: `conta_${decisao}`,
    mensagem: `O estado da tua conta foi actualizado para ${decisao}.`,
  });

  return { prestadorId, decisao };
}

async function listarCampanhas() {
  const { data, error } = await supabaseAdmin
    .from("campanhas")
    .select(
      `
      id,plano,estado_pagamento,estado_campanha,data_inicio,data_fim,valor_pago,criado_em,
      prestadores ( utilizadores ( nome ) )
    `
    )
    .order("criado_em", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

async function actualizarCampanha(campanhaId, dados, adminId) {
  const { estadoPagamento, estadoCampanha, dataInicio, dataFim } = dados;
  const { error } = await supabaseAdmin
    .from("campanhas")
    .update({
      estado_pagamento: estadoPagamento || undefined,
      estado_campanha: estadoCampanha || undefined,
      data_inicio: dataInicio || undefined,
      data_fim: dataFim || undefined,
    })
    .eq("id", campanhaId);

  if (error) throw new Error(error.message);

  await supabaseAdmin.from("auditoria").insert({
    admin_id: adminId,
    accao: "actualizacao_campanha",
    entidade_tipo: "campanha",
    entidade_id: campanhaId,
    detalhes: dados,
  });

  return { success: true };
}

async function getKPIs() {
  const [{ data: pedidos }, { data: concluidos }, { data: topCategorias }, { data: avaliacoes }] =
    await Promise.all([
      supabaseAdmin.from("pedidos").select("estado"),
      supabaseAdmin.from("pedidos").select("valor").eq("estado", "concluido"),
      supabaseAdmin.from("servicos").select("categorias(nome)").eq("estado", "activo"),
      supabaseAdmin.from("avaliacoes").select("pontuacao"),
    ]);

  const contagens = { pendente: 0, confirmado: 0, em_curso: 0, concluido: 0, cancelado: 0 };
  (pedidos || []).forEach((p) => {
    if (contagens[p.estado] !== undefined) contagens[p.estado] += 1;
  });

  const receitaTotal = (concluidos || []).reduce((acc, item) => acc + Number(item.valor || 0), 0);

  const mapaCategorias = {};
  (topCategorias || []).forEach((item) => {
    const nome = item.categorias?.nome || "Sem categoria";
    mapaCategorias[nome] = (mapaCategorias[nome] || 0) + 1;
  });

  const topCat = Object.entries(mapaCategorias)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nome, total]) => ({ nome, total }));

  const mediaGlobal =
    avaliacoes && avaliacoes.length
      ? (
          avaliacoes.reduce((acc, item) => acc + Number(item.pontuacao || 0), 0) /
          avaliacoes.length
        ).toFixed(1)
      : 0;

  return {
    contagens,
    receitaTotal,
    topCat,
    mediaGlobal,
    totalAvaliacoes: avaliacoes?.length || 0,
  };
}

async function exportarPedidosCSV() {
  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .select(
      `
      id,estado,valor,urgencia,criado_em,nome_cliente,local_servico,
      servicos ( titulo ),
      prestadores ( utilizadores ( nome ) )
    `
    )
    .order("criado_em", { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);

  const linhas = [
    ["ID", "Estado", "Valor", "Urgencia", "Cliente", "Prestador", "Servico", "Local", "Data"],
  ];

  (data || []).forEach((p) => {
    linhas.push([
      p.id.substring(0, 8),
      p.estado,
      p.valor || 0,
      p.urgencia || "Normal",
      p.nome_cliente || "",
      p.prestadores?.utilizadores?.nome || "",
      p.servicos?.titulo || "",
      p.local_servico || "",
      new Date(p.criado_em).toLocaleDateString("pt-MZ"),
    ]);
  });

  return linhas.map((l) => l.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
}

async function getConfiguracoes() {
  const { data, error } = await supabaseAdmin
    .from("configuracoes")
    .select("*")
    .order("chave", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

async function actualizarConfiguracao(chave, valor, adminId) {
  const { error } = await supabaseAdmin
    .from("configuracoes")
    .update({
      valor: Boolean(valor),
      actualizado_em: new Date().toISOString(),
    })
    .eq("chave", chave);

  if (error) throw new Error(error.message);

  await supabaseAdmin.from("auditoria").insert({
    admin_id: adminId,
    accao: "alteracao_configuracao",
    entidade_tipo: "configuracao",
    detalhes: { chave, valor },
  });

  return { success: true };
}

module.exports = {
  getMetricasGlobais,
  listarPrestadores,
  validarPrestador,
  listarCampanhas,
  actualizarCampanha,
  getKPIs,
  exportarPedidosCSV,
  getConfiguracoes,
  actualizarConfiguracao,
};

