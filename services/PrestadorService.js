const { supabaseAdmin } = require("../config/supabase");

async function getMetricasDashboard(prestadorId) {
  const [
    { count: pedidosPendentes },
    { count: pedidosConcluidos },
    { data: receitaData },
    { data: prestador },
    { data: pedidosRecentes },
  ] = await Promise.all([
    supabaseAdmin
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .eq("prestador_id", prestadorId)
      .eq("estado", "pendente"),
    supabaseAdmin
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .eq("prestador_id", prestadorId)
      .eq("estado", "concluido"),
    supabaseAdmin
      .from("pedidos")
      .select("valor")
      .eq("prestador_id", prestadorId)
      .eq("estado", "concluido"),
    supabaseAdmin
      .from("prestadores")
      .select("avaliacao_media,total_avaliacoes,visualizacoes,total_pedidos")
      .eq("id", prestadorId)
      .single(),
    supabaseAdmin
      .from("pedidos")
      .select("id,estado,criado_em,urgencia,nome_cliente,servicos ( titulo )")
      .eq("prestador_id", prestadorId)
      .order("criado_em", { ascending: false })
      .limit(5),
  ]);

  const receitaTotal = (receitaData || []).reduce((acc, item) => acc + Number(item.valor || 0), 0);

  return {
    pedidosPendentes: pedidosPendentes || 0,
    pedidosConcluidos: pedidosConcluidos || 0,
    receitaTotal,
    avaliacaoMedia: prestador?.avaliacao_media || 0,
    totalAvaliacoes: prestador?.total_avaliacoes || 0,
    visualizacoes: prestador?.visualizacoes || 0,
    totalPedidos: prestador?.total_pedidos || 0,
    pedidosRecentes: pedidosRecentes || [],
  };
}

async function getServicos(prestadorId) {
  const { data, error } = await supabaseAdmin
    .from("servicos")
    .select("id,titulo,descricao,preco,unidade_preco,estado,total_pedidos,categorias(nome)")
    .eq("prestador_id", prestadorId)
    .order("criado_em", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

async function criarServico(prestadorId, dados) {
  const { titulo, descricao, preco, unidadePreco, categoriaId } = dados;
  if (!titulo) throw new Error("Titulo e obrigatorio.");

  const { data, error } = await supabaseAdmin
    .from("servicos")
    .insert({
      prestador_id: prestadorId,
      titulo,
      descricao: descricao || null,
      preco: preco ? parseFloat(preco) : null,
      unidade_preco: unidadePreco || "servico",
      categoria_id: categoriaId ? parseInt(categoriaId, 10) : null,
      estado: "activo",
    })
    .select("id,titulo,estado")
    .single();

  if (error || !data) throw new Error(error?.message || "Erro ao criar servico.");
  return data;
}

async function toggleEstadoServico(servicoId, prestadorId) {
  const { data: servico, error: e1 } = await supabaseAdmin
    .from("servicos")
    .select("id,estado")
    .eq("id", servicoId)
    .eq("prestador_id", prestadorId)
    .single();

  if (e1 || !servico) throw new Error("Servico nao encontrado.");

  const novoEstado = servico.estado === "activo" ? "pausado" : "activo";

  const { error } = await supabaseAdmin
    .from("servicos")
    .update({ estado: novoEstado, actualizado_em: new Date().toISOString() })
    .eq("id", servicoId);

  if (error) throw new Error(error.message);
  return { servicoId, novoEstado };
}

async function getAvaliacoes(prestadorId) {
  const { data, error } = await supabaseAdmin
    .from("avaliacoes")
    .select(
      `
      id,pontuacao,comentario,criado_em,
      pedidos ( id,servicos ( titulo ) ),
      clientes ( utilizadores ( nome,avatar_url ) )
    `
    )
    .eq("prestador_id", prestadorId)
    .order("criado_em", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

async function getDadosPerfil(prestadorId) {
  const { data, error } = await supabaseAdmin
    .from("utilizadores")
    .select(
      `
      id,nome,email,telefone,avatar_url,
      prestadores (
        biografia,especialidade,anos_experiencia,cidade,preco_medio,disponivel,
        perfil_publico_activo,receber_pedidos,notif_email,estado_verificacao,
        avaliacao_media,total_avaliacoes,total_pedidos
      )
    `
    )
    .eq("id", prestadorId)
    .single();

  if (error || !data) throw new Error("Perfil do prestador nao encontrado.");
  return data;
}

async function actualizarPerfil(prestadorId, dados) {
  const { nome, telefone, especialidade, cidade, anosExp, precoMedio, biografia } = dados;

  const { error: e1 } = await supabaseAdmin
    .from("utilizadores")
    .update({
      nome: nome || undefined,
      telefone: telefone || undefined,
      actualizado_em: new Date().toISOString(),
    })
    .eq("id", prestadorId);
  if (e1) throw new Error(e1.message);

  const { error: e2 } = await supabaseAdmin
    .from("prestadores")
    .update({
      especialidade: especialidade || undefined,
      cidade: cidade || undefined,
      anos_experiencia: anosExp || undefined,
      preco_medio: precoMedio ? parseFloat(precoMedio) : null,
      biografia: biografia || undefined,
      actualizado_em: new Date().toISOString(),
    })
    .eq("id", prestadorId);
  if (e2) throw new Error(e2.message);

  return { success: true };
}

async function guardarDefinicoes(prestadorId, dados) {
  const { disponivel, perfilPublico, receberPedidos, notifEmail } = dados;
  const { error } = await supabaseAdmin
    .from("prestadores")
    .update({
      disponivel: Boolean(disponivel),
      perfil_publico_activo: Boolean(perfilPublico),
      receber_pedidos: Boolean(receberPedidos),
      notif_email: Boolean(notifEmail),
      actualizado_em: new Date().toISOString(),
    })
    .eq("id", prestadorId);

  if (error) throw new Error(error.message);
  return { success: true };
}

module.exports = {
  getMetricasDashboard,
  getServicos,
  criarServico,
  toggleEstadoServico,
  getAvaliacoes,
  getDadosPerfil,
  actualizarPerfil,
  guardarDefinicoes,
};

