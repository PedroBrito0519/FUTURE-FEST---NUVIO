// ===================== CONFIG =====================
const MODEL_IMAGE = "https://cdn.jsdelivr.net/gh/google/generative-ai/images/gemini-icon.png";

let initialShown = false; // evita duplicar opções iniciais

// ===================== ABRIR / FECHAR CHAT =====================
document.getElementById('chat-button').addEventListener('click', () => {
    const chat = document.getElementById('chat-container');
    const closeBtn = document.getElementById('close-chat-button');

    if (chat.style.display === '' || chat.style.display === 'none') {
        chat.style.display = 'block';
        closeBtn.style.display = 'inline-block';

        if (!initialShown) {
            showInitialOptions();
            initialShown = true;
        }
    } else {
        chat.style.display = 'none';
        closeBtn.style.display = 'none';
    }
});

document.getElementById("close-chat-button").addEventListener("click", () => {
    document.getElementById("chat-container").style.display = "none";
});

// ===================== MENSAGENS =====================
function addMessage(text, sender) {
    const box = document.getElementById("messages");

    const div = document.createElement("div");
    div.className = sender === "user" ? "user-message" : "bot-message";
    div.textContent = text;

    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function addOptionButton(text) {
    const box = document.getElementById("messages");

    const btn = document.createElement("div");
    btn.className = "option-button";
    btn.textContent = text;

    btn.addEventListener("click", () => handleOptionClick(text));

    box.appendChild(btn);
    box.scrollTop = box.scrollHeight;
}

function addModelAvatar() {
    const box = document.getElementById('messages');

    const img = document.createElement('img');
    img.src = MODEL_IMAGE;
    img.style.width = "40px";
    img.style.borderRadius = "50%";
    img.style.marginBottom = "5px";

    box.appendChild(img);
}

// ===================== OPÇÕES INICIAIS =====================
function showInitialOptions() {
    addMessage("Olá! Sou o Nuvy Bot 🤖 Como posso te ajudar hoje? Escolha uma das áreas abaixo:", "bot");

    ["🗂️ Armazenamento de Arquivos", "📅 Organização de Rotina", "💎 Planos", "📞 Contato"]
        .forEach(opt => addOptionButton(opt));
}

// ===================== RESPOSTAS =====================
function handleOptionClick(text) {

    addMessage(text, "user");

    switch (text) {
        case "🗂️ Armazenamento de Arquivos": return addMessage("📁 O Nuvio permite armazenar arquivos com segurança na nuvem.", "bot");

        case "📅 Organização de Rotina": return addMessage("🧩 Crie tarefas, prioridades e gerencie sua rotina.", "bot");

        case "💎 Planos":
            addMessage("Escolha um plano:", "bot");
            ["💠 Plano Grátis", "🥈 Plano Prata", "💎 Plano Diamante"].forEach(o => addOptionButton(o));
            return;

        case "📞 Contato":
            addMessage("Selecione uma forma de contato:", "bot");
            ["📧 Email", "📞 Telefone"].forEach(o => addOptionButton(o));
            return;

        case "📧 Email": return addMessage("📧 contato@nuvio.com.br", "bot");
        case "📞 Telefone": return addMessage("📞 (11) 94315-7970", "bot");

        case "💠 Plano Grátis": return addMessage("💠 1GB de armazenamento e notas ilimitadas.", "bot");
        case "🥈 Plano Prata": return addMessage("🥈 100GB + colaboração.", "bot");
        case "💎 Plano Diamante": return addMessage("💎 Armazenamento ilimitado + suporte 24/7.", "bot");
    }

    handleGeminiResponse(text);
}

// ===================== API GEMINI =====================
async function handleGeminiResponse(userText) {
    addModelAvatar();

    try {
        const response = await fetch("http://localhost:3000/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText })
        });

        const data = await response.json();

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Desculpe, não consegui entender.";

        addMessage(reply, "bot");
    } catch (err) {
        addMessage("⚠️ Erro ao conectar ao servidor Gemini.", "bot");
    }
}

// ===================== INPUT DO USUÁRIO =====================
document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();

    if (text === "") return;

    addMessage(text, "user");
    input.value = "";
    handleGeminiResponse(text);
}

// ===================== RESET =====================
document.getElementById("restart-button").addEventListener("click", () => {
    document.getElementById("messages").innerHTML = "";
    showInitialOptions();
});
