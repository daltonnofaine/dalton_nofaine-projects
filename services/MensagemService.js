const { supabaseAdmin } = require("../config/supabase");

async function listarPorPedido(pedidoId) {
  const { data, error } = await supabaseAdmin
    .from("mensagens")
    .select(
      `
      id,pedido_id,conteudo,enviado_em,remetente_id,
      utilizadores:remetente_id ( nome,avatar_url,perfil )
    `
    )
    .eq("pedido_id", pedidoId)
    .order("enviado_em", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

async function enviar(pedidoId, remetenteId, conteudo) {
  if (!conteudo || !conteudo.trim()) {
    throw new Error("Mensagem vazia.");
  }

  const { data: pedido, error: e1 } = await supabaseAdmin
    .from("pedidos")
    .select("id,cliente_id,prestador_id")
    .eq("id", pedidoId)
    .single();

  if (e1 || !pedido) throw new Error("Pedido nao encontrado.");
  if (pedido.cliente_id !== remetenteId && pedido.prestador_id !== remetenteId) {
    throw new Error("Sem permissao para este pedido.");
  }

  const { data: mensagem, error } = await supabaseAdmin
    .from("mensagens")
    .insert({
      pedido_id: pedidoId,
      remetente_id: remetenteId,
      conteudo: conteudo.trim(),
    })
    .select(
      `
      id,pedido_id,conteudo,enviado_em,remetente_id,
      utilizadores:remetente_id ( nome,avatar_url,perfil )
    `
    )
    .single();

  if (error || !mensagem) throw new Error(error?.message || "Erro ao enviar mensagem.");

  const destinatarioId =
    remetenteId === pedido.cliente_id ? pedido.prestador_id : pedido.cliente_id;

  await supabaseAdmin.from("notificacoes").insert({
    usuario_id: destinatarioId,
    pedido_id: pedidoId,
    tipo: "nova_mensagem",
    mensagem: "Tem uma nova mensagem na conversa do pedido.",
  });

  return mensagem;
}

module.exports = { listarPorPedido, enviar };

