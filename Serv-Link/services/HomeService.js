const { supabase } = require("../config/supabase");

async function getCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("id,nome,icone_url")
    .eq("activa", true)
    .order("nome", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

async function getEstatisticas() {
  const [{ count: totalPrestadores }, { count: totalServicos }, { count: totalConcluidos }] =
    await Promise.all([
      supabase
        .from("prestadores")
        .select("*", { count: "exact", head: true })
        .eq("estado_verificacao", "aprovado"),
      supabase
        .from("servicos")
        .select("*", { count: "exact", head: true })
        .eq("estado", "activo"),
      supabase
        .from("pedidos")
        .select("*", { count: "exact", head: true })
        .eq("estado", "concluido"),
    ]);

  return {
    totalPrestadores: totalPrestadores || 0,
    totalServicos: totalServicos || 0,
    totalConcluidos: totalConcluidos || 0,
  };
}

module.exports = { getCategorias, getEstatisticas };

