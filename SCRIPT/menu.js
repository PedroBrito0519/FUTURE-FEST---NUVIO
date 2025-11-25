// rolagem header
window.addEventListener("scroll", function(){
    let header = document.querySelector('#header')
    header.classList.toggle('rolagem', window.scrollY > 300)
})

// onda

var onda1 = document.getElementById('onda1')
var onda2 = document.getElementById('onda2')
var onda3 = document.getElementById('onda3')
var onda4 = document.getElementById('onda4')

window.addEventListener('scroll', function(){
    var rolagemPos = window.scrollY

    onda1.style.backgroundPositionX = 400 + rolagemPos * 4 + 'px';
    onda2.style.backgroundPositionX = 300 + rolagemPos * -4 + 'px';
    onda3.style.backgroundPositionX = 200 + rolagemPos * 2 + 'px';
    onda4.style.backgroundPositionX = 100 + rolagemPos * -2 + 'px';
})

// Função para ocultar a tela de carregamento após o carregamento da página
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const pageContent = document.getElementById('page-content');
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';  // Esconde a tela de carregamento
        pageContent.style.display = 'block';  // Mostra o conteúdo da página
    }, 1500);  
}
//COOKIES

var msgCookies = document.getElementById('cookies-msg')

function aceito(){
    localStorage.lgpd = 'sim'
    msgCookies.classList.remove('mostrar')
}

if(localStorage.lgpd == 'sim'){
    msgCookies.classList.remove('mostrar')
}else{
    msgCookies.classList.add('mostrar')
}





// Hide sections initially
document.addEventListener('DOMContentLoaded', function() {
    const timeSection = document.getElementById('time');
    const inspSection = document.getElementById('Inspiracao');
    const oferecemosSection = document.getElementById('oferecemos');

    // Set initial display to none
    timeSection.style.display = 'none';
    inspSection.style.display = 'none';
    oferecemosSection.style.display = 'none'; // Inicialmente oculta a seção "oferecemos"
});

// Toggle functionality for the time section
document.getElementById('btn-time').addEventListener('click', function() {
    const timeSection = document.getElementById('time');
    if (timeSection.style.display === 'block') {
        timeSection.style.display = 'none';
    } else {
        timeSection.style.display = 'block';
    }
});

// Toggle functionality for the inspiration section
document.getElementById('inspiracao-btn').addEventListener('click', function() {
    const inspSection = document.getElementById('Inspiracao');
    if (inspSection.style.display === 'none' || inspSection.style.display === '') {
        inspSection.style.display = 'block'; // Open the section
    } else {
        inspSection.style.display = 'none'; // Close the section
    }
});

// Toggle functionality for the "oferecemos" section
document.getElementById('oferecemos-btn').addEventListener('click', function() {
    const oferecemosSection = document.getElementById('oferecemos');
    if (oferecemosSection.style.display === 'none' || oferecemosSection.style.display === '') {
        oferecemosSection.style.display = 'block'; // Open the section
    } else {
        oferecemosSection.style.display = 'none'; // Close the section
    }
});


//ERRO
window.addEventListener('offline', function() {
    window.location.href = 'error.html'; // Redireciona quando estiver offline
});
function reportError() {
           
    alert('Erro reportado com sucesso!'); // Simulação de envio
}



//aparecendo seçao
// Seleciona a seção que queremos monitorar
const section = document.querySelector('.itens-section');

// Configura o IntersectionObserver
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Adiciona a classe 'visible' quando a seção entra na tela
      entry.target.classList.add('visible');
      // Para de observar depois que a animação é acionada
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5 // A seção deve estar 50% visível para disparar a animação
});

// Começa a observar a seção
observer.observe(section);



// Mostra ou esconde o chat quando a bolinha é clicada e exibe as opções iniciais
document.getElementById('chat-button').addEventListener('click', function () {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer.style.display === 'none') {
        chatContainer.style.display = 'block';
        showInitialOpcoes(); // Exibe as opções quando o chat é aberto
    } else {
        chatContainer.style.display = 'none';
    }
});

// Função para exibir opções iniciais assim que o chat é ativado
function showInitialOpcoes() {
    const mensagem = 'Olá! Como posso te ajudar hoje? Clique em uma das opções abaixo:';
    const opcoes = ['📚 Estudos', '🎯 SOBRE', '👥 Nosso time', '📞 Contato'];

    addMessage(mensagem, 'bot');

    opcoes.forEach(option => {
        addOptionButton(option);
    });
}

// Função para lidar com o clique em uma opção
function handleOptionClick(opcaoTexto) {
    addMessage(opcaoTexto, 'user'); // Adiciona a mensagem do usuário

    switch (opcaoTexto) {
        case '📚 Estudos':
            showEstudosOpcoes(); // Exibe as opções de estudos
            break;
        case '🎯 SOBRE':
            showSobreOpcoes(); // Exibe as opções sobre a PORCOINS
            break;
        case '👥 Nosso time':
            showTeamOpcoes(); // Exibe as opções do time
            break;
        case '📞 Contato':
            showContatoOpcoes(); // Exibe as opções de contato
            break;
        default:
            const defaultMessage = 'Desculpe, não entendi sua solicitação.';
            setTimeout(() => addMessage(defaultMessage, 'bot'), 500);
            break;
    }
}

// Função para exibir as opções de estudos
function showEstudosOpcoes() {
    const estudoMessage = 'Escolha uma das opções de estudos:';
    const estudoOpcoes = ['📑 Apostilas', '📚 Cursos disponíveis', '🔗 Links úteis', '🎥 Vídeos extras'];

    addMessage(estudoMessage, 'bot');

    estudoOpcoes.forEach(option => {
        addOptionButton(option);
    });
}

// Função para exibir as opções de "Sobre" a PORCOINS
function showSobreOpcoes() {
    const sobreMessage = 'Escolha uma das opções para saber mais sobre a PORCOINS:';
    const sobreOpcoes = ['🤔 O que é a PORCOINS', '🎯 Qual a missão', '💡 O que oferecemos', '📚 Nossa didática', '📊 O que é educação financeira'];

    addMessage(sobreMessage, 'bot');

    sobreOpcoes.forEach(option => {
        addOptionButton(option);
    });
}

// Função para exibir as opções do time
function showTeamOpcoes() {
    const teamMessage = 'Aqui estão as opções sobre o nosso time:';
    const teamOpcoes = ['👨‍💻 Nosso time', '🔨 O que cada um fez', '🌟 Nossa inspiração'];

    addMessage(teamMessage, 'bot');

    teamOpcoes.forEach(option => {
        addOptionButton(option);
    });
}

// Função para exibir as opções de contato
function showContatoOpcoes() {
    const contatoMessage = 'Escolha uma forma de contato:';
    const contatoOpcoes = ['📧 Email', '💬 WhatsApp', '💻 GitHub', '🖥️ Discord', '⭐ Avaliação do nosso site'];

    addMessage(contatoMessage, 'bot');

    contatoOpcoes.forEach(option => {
        addOptionButton(option);
    });
}

// Funções específicas para cada sub-opção:

// Função para exibir as apostilas
function showApostilas() {
    const apostilasMessage = 'Aqui estão as apostilas disponíveis:';
    const apostilasOpcoes = ['Apostila 1', 'Apostila 2', 'Apostila 3', 'Apostila 4', 'Apostila 5', 'Apostila 6', 'Apostila 7', 'Apostila 8'];

    addMessage(apostilasMessage, 'bot');

    apostilasOpcoes.forEach(option => {
        addOptionButton(option);
    });
}

// Função para exibir os cursos disponíveis
function showCursosDisponiveis() {
    const cursosMessage = 'Aqui estão os cursos disponíveis:';
    const cursosOpcoes = ['Curso 1', 'Curso 2', 'Curso 3', 'Curso 4', 'Curso 5', 'Curso 6', 'Curso 7', 'Curso 8'];

    addMessage(cursosMessage, 'bot');

    cursosOpcoes.forEach(option => {
        addOptionButton(option);
    });
}

// Função para exibir os links úteis
function showLinksUteis() {
    const linksMessage = 'Aqui estão alguns links úteis:';
    const linksOpcoes = ['Link 1', 'Link 2', 'Link 3', 'Link 4', 'Link 5', 'Link 6', 'Link 7', 'Link 8'];

    addMessage(linksMessage, 'bot');

    linksOpcoes.forEach(option => {
        addOptionButton(option);
    });
}

// Função para exibir os vídeos extras
function showVideosExtras() {
    const videosMessage = 'Aqui estão os vídeos extras:';
    const videosOpcoes = ['Vídeo 1', 'Vídeo 2', 'Vídeo 3', 'Vídeo 4', 'Vídeo 5', 'Vídeo 6', 'Vídeo 7', 'Vídeo 8'];

    addMessage(videosMessage, 'bot');

    videosOpcoes.forEach(option => {
        addOptionButton(option);
    });
}

// Funções sobre a PORCOINS

function showOQueEAPORCOINS() {
    const message = 'A PORCOINS é uma plataforma de educação financeira voltada para quem quer aprender a gerenciar melhor seu dinheiro e alcançar a liberdade financeira.';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

function showQualAMissao() {
    const message = 'Nossa missão é ajudar as pessoas a alcançarem a liberdade financeira, oferecendo materiais didáticos de qualidade e estratégias acessíveis para todos.';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

function showOQueOferecemos() {
    const message = 'Oferecemos cursos, apostilas, vídeos e links úteis para ajudar na educação financeira e na organização financeira pessoal.';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

function showNossaDidatica() {
    const message = 'Nossa didática é prática e focada em resultados, com uma abordagem simples e acessível a todos os níveis de conhecimento.';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

function showOQueEFinanceira() {
    const message = 'Educação financeira é o processo de ensinar as pessoas a tomar decisões financeiras informadas, ajudando a administrar e investir o dinheiro de maneira eficaz.';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

// Funções do time

function showNossoTime() {
    const message = 'Nosso time é formado por especialistas em finanças e educação. Conheça os membros: Gustavo, Felipe, Guilherme, e Pedro.';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

function showOQueCadaUmFez() {
    const message = 'Cada um de nós tem uma história de aprendizado e superação. Vamos te contar o que fizemos até agora!';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

function showNossaInspiracao() {
    const message = 'Nossa inspiração vem das histórias de pessoas que mudaram sua vida financeira com dedicação e educação.';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

// Funções de contato

function showEmail() {
    const message = 'Nosso email é: contato@porcoins.com';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

function showWhatsApp() {
    const message = 'Entre em contato pelo WhatsApp: +55 11 99999-9999';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

function showGitHub() {
    const message = 'Confira nosso GitHub: https://github.com/porcoins';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

function showDiscord() {
    const message = 'Participe do nosso servidor no Discord: https://discord.com/invite/porcoins';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

function showAvaliacao() {
    const message = 'Avalie nosso site e nos dê seu feedback para melhorar: [link para avaliação]';
    setTimeout(() => addMessage(message, 'bot'), 500);
}

// Função para adicionar a mensagem ao chat
function addMessage(message, sender) {
    const chatBox = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Mantém o chat rolado para a última mensagem
}

// Função para adicionar botões de opção no chat
function addOptionButton(optionTexto) {
    const chatBox = document.getElementById('messages');
    const optionElement = document.createElement('div');
    optionElement.className = 'option-button';
    optionElement.textContent = optionTexto;
    optionElement.addEventListener('click', () => handleOptionClick(optionTexto)); // Define o evento de clique para a opção
    chatBox.appendChild(optionElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Mantém o chat rolado para a última mensagem
}

// Função para enviar mensagem com a tecla Enter
document.getElementById('user-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

const lista = document.querySelectorAll('.lista')

function ativaLink(){
    for(let i of lista){
        i.classList.remove('ativo')
    }
    this.classList.add('ativo')
}

for(let i of lista){
    i.addEventListener('click', ativaLink)
}


//proibi passar do 100% width
function limitarLargura() {
    // Obtém a largura da janela
    let larguraTela = window.innerWidth;

    // Seleciona o elemento que você quer limitar
    let conteudo = document.querySelector('.conteudo');

    // Define a largura máxima como a largura da tela
    if (conteudo.offsetWidth > larguraTela) {
        conteudo.style.width = larguraTela + 'px';
    }
}

// Chamando a função sempre que a janela for redimensionada
window.addEventListener('resize', limitarLargura);

// Também chama a função inicialmente, para corrigir no carregamento
window.addEventListener('load', limitarLargura);


///card 3d
VanillaTilt.init(document.querySelectorAll(".cardd"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.5
});



//menu
// Função para abrir/fechar o menu lateral
function toggleMenu() {
    var menuLateral = document.getElementById('menu-lateral');
    menuLateral.classList.toggle('open'); // Alterna a classe 'open' para mostrar/ocultar o menu
}
