document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('messages');
    const newChatBtn = document.getElementById('new-chat-btn');
    const botao_abrir = document.getElementById('chat-button');
    const submitBtn = document.getElementById('submit-btn');

    let sessionId = localStorage.getItem('chatSessionId');
    
    const CHAT_ENDPOINT = '/chat'; 

    function renderMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text; 
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; 
        return messageDiv;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        renderMessage(userMessage, 'user');
        userInput.value = '';
        submitBtn.disabled = true; 

        let typingIndicator = renderMessage('Aguardando resposta do Nuvio...', 'ai typing');

        try {
            const response = await fetch(CHAT_ENDPOINT, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    message: userMessage,
                    session_id: sessionId 
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: `Status ${response.status}` }));
                throw new Error(errorData.error || `Erro de servidor: ${response.status}`);
            }

            const data = await response.json();

            if (data.session_id) {
                sessionId = data.session_id;
                localStorage.setItem('chatSessionId', sessionId); 
            }

            // Extrai a resposta corretamente da API:
            let replyText = '';

            if (typeof data.response === 'string') {
                // Verifica se é JSON string dentro da string e tenta fazer parse
                try {
                    const parsed = JSON.parse(data.response);
                    replyText = parsed.reply || data.response;
                } catch {
                    replyText = data.response;
                }
            } else if (data.response && typeof data.response === 'object') {
                if (data.response.reply) {
                    replyText = data.response.reply;
                } else {
                    replyText = JSON.stringify(data.response);
                }
            } else {
                replyText = 'Não consegui entender a resposta da IA.';
            }
            
            messagesContainer.removeChild(typingIndicator);
            renderMessage(replyText, 'ai');

        } catch (error) {
            console.error('Erro no Chat:', error);
            if (typingIndicator.parentNode) {
                messagesContainer.removeChild(typingIndicator);
            }
            renderMessage(`Erro: ${error.message || 'Não foi possível conectar com a IA.'}`, 'error');
        } finally {
            submitBtn.disabled = false; 
        }
    });
    
    botao_abrir.addEventListener('click', () => {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer.style.display === 'block') {
            chatContainer.style.display = 'none';
        } else {
            chatContainer.style.display = 'block';
            localStorage.removeItem('chatSessionId');
            sessionId = null;
            messagesContainer.innerHTML = ''; 
            renderMessage('Iniciamos uma nova sessão de chat. O histórico anterior foi apagado.', 'system');
            userInput.focus();
        }
    });
    
    if(sessionId) {
        renderMessage('Bem-vindo de volta! Sua conversa anterior pode ser retomada.', 'system');
    } else {
        renderMessage('Olá! Sou o Nuvio. Como posso ajudar você hoje?', 'ai');
    }
});
