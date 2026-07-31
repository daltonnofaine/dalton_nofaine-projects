async function guardarNovoServico() {
  const feedback = document.getElementById("novo-servico-feedback");
  const payload = {
    titulo: document.getElementById("ns-titulo")?.value || "",
    descricao: document.getElementById("ns-descricao")?.value || "",
    preco: document.getElementById("ns-preco")?.value || "",
    unidadePreco: document.getElementById("ns-unidade")?.value || "servico",
    categoriaId: document.getElementById("ns-categoria")?.value || "",
  };

  try {
    const resposta = await fetch("/dashboard/api/servicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const resultado = await resposta.json();
    if (!resultado.success) throw new Error(resultado.erro || "Erro ao criar servico.");
    window.location.reload();
  } catch (erro) {
    feedback.style.color = "#c44536";
    feedback.textContent = erro.message;
  }
}

async function toggleServico(servicoId, botao) {
  try {
    const resposta = await fetch(`/dashboard/api/servicos/${servicoId}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    const resultado = await resposta.json();
    if (!resultado.success) throw new Error(resultado.erro || "Erro ao alterar estado.");
    botao.textContent = resultado.novoEstado === "activo" ? "Pausar" : "Activar";
    window.location.reload();
  } catch (erro) {
    alert(erro.message);
  }
}

