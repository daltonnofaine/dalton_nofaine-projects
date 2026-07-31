async function validarPrestador(prestadorId, decisao) {
  const nota = document.getElementById(`nota-${prestadorId}`)?.value || "";
  const feedback = document.getElementById("admin-feedback");

  try {
    const resposta = await fetch(`/admin/api/prestadores/${prestadorId}/validar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decisao, nota }),
    });
    const resultado = await resposta.json();
    if (!resultado.success) throw new Error(resultado.erro || "Erro ao validar prestador.");
    feedback.style.color = "green";
    feedback.textContent = `Prestador actualizado para ${decisao}.`;
    window.location.reload();
  } catch (erro) {
    feedback.style.color = "#c44536";
    feedback.textContent = erro.message;
  }
}

async function actualizarCampanha(campanhaId, dados) {
  const feedback = document.getElementById("operacoes-feedback");
  try {
    const resposta = await fetch(`/admin/api/campanhas/${campanhaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const resultado = await resposta.json();
    if (!resultado.success) throw new Error(resultado.erro || "Erro ao actualizar campanha.");
    feedback.style.color = "green";
    feedback.textContent = resultado.mensagem;
    window.location.reload();
  } catch (erro) {
    feedback.style.color = "#c44536";
    feedback.textContent = erro.message;
  }
}

function confirmarPagamento(campanhaId) {
  return actualizarCampanha(campanhaId, { estadoPagamento: "confirmado" });
}

function activarCampanha(campanhaId) {
  const hoje = new Date().toISOString().split("T")[0];
  const fim = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  return actualizarCampanha(campanhaId, {
    estadoCampanha: "activa",
    dataInicio: hoje,
    dataFim: fim,
  });
}

function expirarCampanha(campanhaId) {
  return actualizarCampanha(campanhaId, { estadoCampanha: "expirada" });
}

async function toggleConfig(chave, valor) {
  const feedback = document.getElementById("config-feedback");
  try {
    const resposta = await fetch("/admin/api/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chave, valor }),
    });
    const resultado = await resposta.json();
    if (!resultado.success) throw new Error(resultado.erro || "Erro ao guardar configuracao.");
    feedback.style.color = "green";
    feedback.textContent = resultado.mensagem;
  } catch (erro) {
    feedback.style.color = "#c44536";
    feedback.textContent = erro.message;
  }
}

