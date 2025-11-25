const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('../../../node_modules/bcryptjs/umd');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017nuvio', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Modelo de Usuário (Schema)
const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Rota de cadastro de usuário
app.post('/api/cadastrar', async (req, res) => {
  const { email, senha } = req.body;

  // Verificar se o email já existe
  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) {
    return res.status(400).json({ message: 'Este email já está cadastrado.' });
  }

  // Criptografar a senha
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  // Criar novo usuário
  const novoUsuario = new Usuario({ email, senha: senhaCriptografada });
  await novoUsuario.save();

  res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

// Rota de login de usuário
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    return res.status(400).json({ message: 'Usuário não encontrado.' });
  }

  // Verificar se a senha é válida
  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(400).json({ message: 'Senha incorreta.' });
  }

  // Gerar JWT (token de autenticação)
  const token = jwt.sign({ id: usuario._id, email: usuario.email }, 'secreta_chave', { expiresIn: '1h' });

  res.json({ message: 'Login realizado com sucesso!', token });
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastro-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const senha = form.senha.value;
    const confirmaSenha = form['confirma-senha'].value;

    if (senha !== confirmaSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.href = 'login.html'; // Redireciona para a tela de login
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
      alert('Erro ao cadastrar usuário.');
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const senha = form.senha.value;

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        localStorage.setItem('token', data.token); // Armazenando o token JWT
        window.location.href = 'PortalArquivo.html'; // Redireciona para a página restrita
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao tentar fazer login.');
    }
  });
});

