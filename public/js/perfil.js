async function guardarPerfil() {
  const feedback = document.getElementById("perfil-feedback");
  const botao = document.getElementById("btn-guardar-perfil");

  botao.disabled = true;
  botao.textContent = "A guardar...";
  feedback.textContent = "";

  const payload = {
    nome: document.getElementById("perfil-nome")?.value || "",
    telefone: document.getElementById("perfil-telefone")?.value || "",
    cidade: document.getElementById("perfil-cidade")?.value || "",
    biografia: document.getElementById("perfil-biografia")?.value || "",
    notifEmail: document.getElementById("perfil-notif-email")?.checked || false,
  };

  try {
    const resposta = await fetch("/api/perfil/cliente", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const resultado = await resposta.json();
    if (!resultado.success) throw new Error(resultado.erro || "Erro ao guardar perfil.");

    feedback.style.color = "green";
    feedback.textContent = resultado.mensagem;
  } catch (erro) {
    feedback.style.color = "#c44536";
    feedback.textContent = erro.message;
  } finally {
    botao.disabled = false;
    botao.textContent = "Guardar";
  }
}

