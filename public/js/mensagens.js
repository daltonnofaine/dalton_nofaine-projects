async function enviarMensagem(pedidoId) {
  const input = document.getElementById("input-mensagem");
  const botao = document.getElementById("btn-enviar-msg");
  const thread = document.getElementById("thread-msgs");

  if (!input || !botao || !thread) return;
  const conteudo = input.value.trim();
  if (!conteudo) return;

  botao.disabled = true;
  botao.textContent = "A enviar...";

  try {
    const resposta = await fetch(`/api/perfil/pedidos/${pedidoId}/mensagens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conteudo }),
    });

    const resultado = await resposta.json();
    if (!resultado.success) throw new Error(resultado.erro || "Falha ao enviar mensagem.");

    const vazio = thread.querySelector(".sem-msgs");
    if (vazio) vazio.remove();

    const bloco = document.createElement("div");
    bloco.style.marginBottom = "12px";
    bloco.innerHTML = `<strong>Tu</strong> - Agora<br /><span>${escapeHtml(conteudo)}</span>`;
    thread.appendChild(bloco);
    input.value = "";
  } catch (erro) {
    alert(erro.message);
  } finally {
    botao.disabled = false;
    botao.textContent = "Enviar";
  }
}

function escapeHtml(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

