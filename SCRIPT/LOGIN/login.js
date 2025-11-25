document.addEventListener('DOMContentLoaded', () => {
  // Lógica de login
  const formLogin = document.getElementById('login-form');
  
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = formLogin.email.value.trim(); // Alterado para pegar o campo de email
    const senha = formLogin.senha.value;

    if (!validarEmail(email)) {
      showModal('Por favor, informe um email válido.');
      return;
    }

    if (senha.length < 8) {
      showModal('Senha inválida! A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

    if (!usuarios[email]) {
      showModal('Usuário não encontrado. Por favor, faça o cadastro.');
      return;
    }

    if (usuarios[email].senha !== senha) {
      showModal('Senha incorreta.');
      return;
    }

    showModal('Login realizado com sucesso!');

    setTimeout(() => {
      localStorage.setItem('usuarioLogado', email); // Salva o login
      window.location.href = 'PortalArquivo.html'; // Redireciona para a página restrita
    }, 1500);
  });
});

// Função para exibir o modal de erro
function showModal(message) {
  const modal = document.getElementById('errorModal');
  const messageElement = document.getElementById('error-message');
  messageElement.textContent = message;  // Define a mensagem do erro
  modal.style.display = "block";
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById('errorModal');
  modal.style.display = "none";
}

// Fechar o modal quando o usuário clicar fora dele
window.onclick = function(event) {
  const modal = document.getElementById('errorModal');
  if (event.target === modal) {
    closeModal();
  }
}

// Validação de email
function validarEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
