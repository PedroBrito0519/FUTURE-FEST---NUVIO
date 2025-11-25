import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch"; // npm install node-fetch@3
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "ASSETS")));
app.use(express.static(path.join(__dirname, "CSS")));
app.use(express.static(path.join(__dirname, "SCRIPT")));
app.use(express.static(path.join(__dirname, "bootstrap-5.1.3-dist")));

// ----- CONFIGURAÇÃO GEMINI -----
const GEMINI_API_KEY = "AIzaSyCS24jpEO8fVF8GPZ97x6SC6Q8YVkI5xlE"; // Coloque sua chave aqui
const MODEL_NAME = "gemini-2.5-flash";
const SYSTEM_PROMPT = "Seu nome é FlashBot e você é um assistente virtual prestativo e conciso. Seu objetivo é responder a perguntas de forma amigável.";

const activeChats = {};

// ----- ROTAS -----
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

// Rota de chat com sessão
app.post("/chat", async (req, res) => {
  const { message: userMessage, session_id: currentSessionId } = req.body;

  if (!userMessage || userMessage.trim() === "") {
    return res.status(400).json({ error: "Mensagem inválida." });
  }

  let newSessionId = currentSessionId;

  try {
    // Inicia histórico da sessão se não existir
    if (!currentSessionId || !activeChats[currentSessionId]) {
      newSessionId = uuidv4();
      activeChats[newSessionId] = [{ role: "system", content: SYSTEM_PROMPT }];
      console.log(`Nova sessão de chat criada: ${newSessionId}`);
    }

    // Adiciona mensagem do usuário ao histórico
    activeChats[newSessionId].push({ role: "user", content: userMessage });

    // Chamada à API REST do Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateText?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: activeChats[newSessionId].map(msg => `${msg.role}: ${msg.content}`).join("\n"),
          maxOutputTokens: 300
        }),
      }
    );

    const data = await response.json();

    const replyText =
      data?.candidates?.[0]?.content?.[0]?.text ||
      "Não consegui entender, tente novamente.";

    // Adiciona resposta da IA ao histórico
    activeChats[newSessionId].push({ role: "assistant", content: replyText });

    res.json({
      reply: replyText,
      session_id: newSessionId,
    });
  } catch (error) {
    console.error("Erro ao acessar Gemini:", error);
    res.status(500).json({ reply: "Falha ao conectar ao Gemini." });
  }
});

// ----- SERVIDOR -----
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
