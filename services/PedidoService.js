const { supabaseAdmin } = require("../config/supabase");

async function criarPedido(dados, clienteId) {
  const {
    servicoId,
    nomeCliente,
    telefone,
    local,
    periodo,
    urgencia,
    descricao,
  } = dados;

  const { data: servico, error: erroServico } = await supabaseAdmin
    .from("servicos")
    .select("id,titulo,preco,total_pedidos,prestador_id,estado")
    .eq("id", servicoId)
    .single();

  if (erroServico || !servico || servico.estado !== "activo") {
    throw new Error("Servico nao encontrado ou indisponivel.");
  }

  const { data: pedido, error } = await supabaseAdmin
    .from("pedidos")
    .insert({
      cliente_id: clienteId,
      servico_id: servico.id,
      prestador_id: servico.prestador_id,
      nome_cliente: nomeCliente,
      telefone_cliente: telefone,
      local_servico: local,
      periodo: periodo || "Qualquer",
      urgencia: urgencia || "Normal",
      descricao: descricao || null,
      valor: servico.preco,
      estado: "pendente",
    })
    .select("id,estado")
    .single();

  if (error || !pedido) {
    throw new Error(error?.message || "Nao foi possivel criar o pedido.");
  }

  await supabaseAdmin
    .from("notificacoes")
    .insert({
      usuario_id: servico.prestador_id,
      pedido_id: pedido.id,
      tipo: "novo_pedido",
      mensagem: `Novo pedido para o servico "${servico.titulo}".`,
    });

  await supabaseAdmin
    .from("servicos")
    .update({ total_pedidos: (servico.total_pedidos || 0) + 1 })
    .eq("id", servico.id);

  return pedido;
}

async function listarPorCliente(clienteId) {
  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .select(
      `
      id,estado,criado_em,valor,urgencia,cliente_id,prestador_id,
      servicos ( id,titulo,categorias ( nome ) ),
      prestadores ( utilizadores ( nome,avatar_url ) )
    `
    )
    .eq("cliente_id", clienteId)
    .order("criado_em", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

async function getDetalhe(pedidoId, userId) {
  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .select(
      `
      id,estado,criado_em,valor,urgencia,cliente_id,prestador_id,nome_cliente,telefone_cliente,local_servico,periodo,descricao,
      servicos ( id,titulo,preco,unidade_preco ),
      clientes ( id,utilizadores ( nome,avatar_url,telefone ) ),
      prestadores ( id,utilizadores ( nome,avatar_url,telefone ) )
    `
    )
    .eq("id", pedidoId)
    .single();

  if (error || !data) throw new Error("Pedido nao encontrado.");
  if (data.cliente_id !== userId && data.prestador_id !== userId) {
    throw new Error("Sem permissao para ver este pedido.");
  }

  return data;
}

async function listarPorPrestador(prestadorId, filtroEstado = null) {
  let query = supabaseAdmin
    .from("pedidos")
    .select(
      `
      id,estado,criado_em,valor,urgencia,cliente_id,prestador_id,nome_cliente,telefone_cliente,local_servico,descricao,
      servicos ( id,titulo ),
      clientes ( utilizadores ( nome,avatar_url ) )
    `
    )
    .eq("prestador_id", prestadorId)
    .order("criado_em", { ascending: false });

  if (filtroEstado) {
    query = query.eq("estado", filtroEstado);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

async function actualizarEstado(pedidoId, novoEstado, prestadorId) {
  const validos = ["confirmado", "em_curso", "concluido", "cancelado"];
  if (!validos.includes(novoEstado)) {
    throw new Error("Estado invalido.");
  }

  const { data: pedido, error: e1 } = await supabaseAdmin
    .from("pedidos")
    .select("id,cliente_id,prestador_id")
    .eq("id", pedidoId)
    .eq("prestador_id", prestadorId)
    .single();

  if (e1 || !pedido) throw new Error("Pedido nao encontrado.");

  const { error } = await supabaseAdmin
    .from("pedidos")
    .update({
      estado: novoEstado,
      actualizado_em: new Date().toISOString(),
    })
    .eq("id", pedidoId);

  if (error) throw new Error(error.message);

  await supabaseAdmin.from("notificacoes").insert({
    usuario_id: pedido.cliente_id,
    pedido_id: pedidoId,
    tipo: `pedido_${novoEstado}`,
    mensagem: `O estado do teu pedido foi actualizado para ${novoEstado}.`,
  });

  return { pedidoId, novoEstado };
}

module.exports = {
  criarPedido,
  listarPorCliente,
  listarPorPrestador,
  getDetalhe,
  actualizarEstado,
};
