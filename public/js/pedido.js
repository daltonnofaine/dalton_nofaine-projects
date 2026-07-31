document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-pedido");
  if (!form) return;

  const botao = document.getElementById("btn-pedido");
  const feedback = document.getElementById("pedido-feedback");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    botao.disabled = true;
    botao.textContent = "A enviar...";
    feedback.textContent = "";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const resposta = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resultado = await resposta.json();
      if (!resultado.success) {
        throw new Error(resultado.erro || "Falha ao enviar pedido.");
      }

      feedback.style.color = "green";
      feedback.textContent = resultado.mensagem;
      form.reset();
    } catch (erro) {
      feedback.style.color = "#c44536";
      feedback.textContent = erro.message;
    } finally {
      botao.disabled = false;
      botao.textContent = "Enviar pedido";
    }
  });
});

