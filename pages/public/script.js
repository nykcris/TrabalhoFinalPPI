document.getElementById("chat-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const message = document.getElementById("message").value;

    if (!username || !message) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch("/batepapo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: username, message }),
        });

        if (response.ok) {
            console.log("Mensagem enviada com sucesso.");
            document.getElementById("message").value = ""; // Limpar o campo de mensagem
            carregarMensagens(); // Atualizar mensagens no chat
        } else {
            console.error("Erro ao enviar mensagem:", await response.text());
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
});

// Função para carregar mensagens do servidor
async function carregarMensagens() {
    try {
        const response = await fetch("/mensagens");
        if (response.ok) {
            const mensagens = await response.json();
            const chatBox = document.getElementById("chat-box");
            chatBox.innerHTML = mensagens
                .map(
                    (msg) => `
                        <div class="message user">
                            <strong>${msg.user}</strong>: ${msg.message}
                            <span style="font-size: small; color: gray;">(${msg.hora})</span>
                        </div>`
                )
                .join("");
        } else {
            console.error("Erro ao carregar mensagens:", response.statusText);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}

// Carregar mensagens ao abrir a página
carregarMensagens();
