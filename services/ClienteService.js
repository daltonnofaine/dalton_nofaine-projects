const { supabaseAdmin } = require("../config/supabase");

async function getDadosCliente(clienteId) {
  const { data, error } = await supabaseAdmin
    .from("utilizadores")
    .select("id,nome,email,telefone,avatar_url,clientes ( cidade,biografia,notif_email )")
    .eq("id", clienteId)
    .single();

  if (error || !data) throw new Error("Perfil de cliente nao encontrado.");
  return data;
}

async function actualizarPerfil(clienteId, dados) {
  const { nome, telefone, cidade, biografia, notifEmail } = dados;

  const { error: e1 } = await supabaseAdmin
    .from("utilizadores")
    .update({
      nome: nome || undefined,
      telefone: telefone || undefined,
      actualizado_em: new Date().toISOString(),
    })
    .eq("id", clienteId);

  if (e1) throw new Error(e1.message);

  const { error: e2 } = await supabaseAdmin
    .from("clientes")
    .update({
      cidade: cidade || undefined,
      biografia: biografia || undefined,
      notif_email: notifEmail,
    })
    .eq("id", clienteId);

  if (e2) throw new Error(e2.message);
  return { success: true };
}

async function getNotificacoes(clienteId) {
  const { data, error } = await supabaseAdmin
    .from("notificacoes")
    .select(
      `
      id,pedido_id,tipo,mensagem,lida,criado_em,
      pedidos (
        id,estado,
        servicos ( titulo ),
        prestadores ( utilizadores ( nome,avatar_url ) )
      )
    `
    )
    .eq("usuario_id", clienteId)
    .order("criado_em", { ascending: false })
    .limit(30);

  if (error) throw new Error(error.message);
  return data || [];
}

async function contarNaoLidas(clienteId) {
  const { count, error } = await supabaseAdmin
    .from("notificacoes")
    .select("*", { count: "exact", head: true })
    .eq("usuario_id", clienteId)
    .eq("lida", false);

  if (error) return 0;
  return count || 0;
}

async function marcarComoLida(notificacaoId, clienteId) {
  const { error } = await supabaseAdmin
    .from("notificacoes")
    .update({ lida: true })
    .eq("id", notificacaoId)
    .eq("usuario_id", clienteId);

  if (error) throw new Error(error.message);
  return { success: true };
}

module.exports = {
  getDadosCliente,
  actualizarPerfil,
  getNotificacoes,
  contarNaoLidas,
  marcarComoLida,
};

