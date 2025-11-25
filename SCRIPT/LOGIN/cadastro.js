document.addEventListener('DOMContentLoaded', () => {
  // Lógica de cadastro
  const formCadastro = document.getElementById('cadastro-form');
  
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = formCadastro.email.value.trim();
    const senha = formCadastro.senha.value;
    const confirmaSenha = formCadastro['confirma-senha'].value;

    if (!validarEmail(email)) {
      showModal('Por favor, informe um email válido.');
      return;
    }

  if (!validarSenha(senha)) {
      showModal('Senha inválida! A senha deve conter:\n- No mínimo 8 caracteres\n- Letras maiúsculas\n- Letras minúsculas\n- Números\n- Caracteres especiais');
      return;
    }

    if (senha !== confirmaSenha) {
      showModal('As senhas não coincidem.');
      return;
    }

    // Simulação de cadastro: salvar dados localmente
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

    if (usuarios[email]) {
      showModal('Este email já está cadastrado.');
      return;
    }

    usuarios[email] = { senha };
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    showModal('Cadastro realizado com sucesso! Agora você pode fazer login.');

    setTimeout(() => {
      window.location.href = 'login.html'; // Redireciona para a tela de login após o modal
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

// Validação de senha
function validarSenha(senha) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(senha);
}
