document.getElementById("submitBtn").addEventListener("click", async () => {
  const query = document.getElementById("userQuery").value;
  const responseContainer = document.getElementById("responseContainer");
  const timeContainer = document.getElementById("timeContainer");

  // Limpa os containers e exibe o spinner
  responseContainer.innerHTML =
    '<div class="spinner-border text-primary" role="status"><span class="sr-only">Carregando...</span></div>';
  timeContainer.innerHTML = "";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    if (response.ok) {
      responseContainer.innerHTML = ""; // Limpa o conteúdo existente
      data.steps.forEach((step, index) => {
        // Cria uma div para cada resposta
        const responseDiv = document.createElement("div");
        responseDiv.className = "response-card";
        responseDiv.innerHTML = `<strong>${step.title}</strong><p>${step.content}</p>`;
        responseContainer.appendChild(responseDiv);

        // Aplica a animação com atraso para cada div
        setTimeout(() => {
          responseDiv.classList.add("fade-in");
        }, index * 300); // 300ms de atraso entre as divs
      });
      timeContainer.innerHTML = `<strong>Tempo total de pensamento: ${data.totalThinkingTime.toFixed(
        2
      )} segundos</strong>`;
    } else {
      responseContainer.innerHTML = `<p class="text-danger">Erro: ${data.error}</p>`;
    }
  } catch (error) {
    responseContainer.innerHTML = `<p class="text-danger">Erro: Não foi possível conectar ao servidor.</p>`;
  }
});
