const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3003;

const trabalhosPath = path.join(__dirname, 'trabalhos.json');
let trabalhosData = fs.readFileSync(trabalhosPath, 'utf-8');
let trabalhos = JSON.parse(trabalhosData);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'html')));
app.use('/img', express.static(path.join(__dirname, 'img'))); // pode ser usado se houver pasta de imagens

function salvarDados() {
    fs.writeFileSync(trabalhosPath, JSON.stringify(trabalhos, null, 2));
}

function criarCard(trabalho) {
    const imagem = trabalho.url_foto || "https://placehold.co/400x200?text=Sem+Imagem";
    return `
    <div class="card mb-3">
        <img src="${imagem}" class="card-img-top" alt="${trabalho.titulo}" style="max-height: 200px; object-fit: cover;">
        <div class="card-body">
            <h5 class="card-title">${trabalho.titulo}</h5>
            <p class="card-text"><strong>descricao:</strong> ${trabalho.descricao}</p>
            <p class="card-text"><strong>disciplina:</strong> ${trabalho.disciplina}</p>
        </div>
    </div>
    `;
}

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/adicionar-trabalho', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'adicionar.html'));
});

app.post('/adicionar-trabalho', (req, res) => {
    const novotrabalho = req.body;

    if (trabalhos.find(p => p.titulo.toLowerCase() === novotrabalho.titulo.toLowerCase())) {
        return res.send(`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <div class="container mt-4"><div class="card"><div class="card-body">
                <h5 class="card-title">trabalho já existente, não foi possível adicionar novamente.</h5>
                <a href="/index" class="btn btn-primary  mt-3">Página Inicial</a>
            </div></div></div>
        `);
    }

    trabalhos.push(novotrabalho);
    salvarDados();

    res.send(`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <div class="container mt-4"><div class="card"><div class="card-body">
            <h5 class="card-title">trabalho adicionado com sucesso!</h5>
            <a href="/index" class="btn btn-primary mt-3">Página Inicial</a>
        </div></div></div>
    `);
});

app.get('/atualizar-trabalho', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'atualizar.html'));
});

app.post('/atualizar-trabalho', (req, res) => {
    const { titulo, descricao, disciplina, url_foto } = req.body;
    const index = trabalhos.findIndex(p => p.titulo.toLowerCase() === titulo.toLowerCase());

    if (index === -1) {
        return res.send(`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <div class="container mt-4"><div class="card"><div class="card-body">
                <h5 class="card-title">trabalho não encontrado.</h5>
                <a href="/index" class="btn btn-primary mt-3">Página Inicial</a>
            </div></div></div>
        `);
    }

    trabalhos[index].descricao = descricao;
    trabalhos[index].disciplina = disciplina;
    if (url_foto) trabalhos[index].url_foto = url_foto;

    salvarDados();

    res.send(`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <div class="container mt-4"><div class="card"><div class="card-body">
            <h5 class="card-title">trabalho atualizado com sucesso!</h5>
            <a href="/index" class="btn btn-primary mt-3">Página Inicial</a>
        </div></div></div>
    `);
});

app.get('/excluir-trabalho', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'excluir.html'));
});

app.post('/excluir-trabalho', (req, res) => {
    const { titulo } = req.body;
    const index = trabalhos.findIndex(p => p.titulo.toLowerCase() === titulo.toLowerCase());

    if (index === -1) {
        return res.send(`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <div class="container mt-4"><div class="card"><div class="card-body">
                <h5 class="card-title">trabalho não encontrado.</h5>
                <a href="/index" class="btn btn-primary mt-3">Página Inicial</a>
            </div></div></div>
        `);
    }

    trabalhos.splice(index, 1);
    salvarDados();

    res.send(`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <div class="container mt-4"><div class="card"><div class="card-body">
            <h5 class="card-title">O trabalho ${titulo} foi excluído com sucesso.</h5>
            <a href="/index" class="btn btn-primary mt-3">Página Inicial</a>
        </div></div></div>
    `);
});

app.get('/buscar-trabalho', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'buscar.html'));
});

app.post('/buscar-trabalho', (req, res) => {
    const pesquisa = req.body.titulodescricao.toLowerCase();
    let cardsHtml = '';

    trabalhos.forEach(trabalho => {
        if (
            trabalho.titulo.toLowerCase() === pesquisa ||
            trabalho.descricao.toLowerCase() === pesquisa ||
            pesquisa === 'all'
        ) {
            cardsHtml += criarCard(trabalho);
        }
    });

    res.send(`
        <html>
        <head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"></head>
        <body>
            <div class="container mt-4">
                <h1>Resultado da busca</h1>
                ${cardsHtml || '<div class="alert alert-warning">Nenhum trabalho encontrado.</div>'}
                <br><a href="/index" class="btn btn-primary ">Página Inicial</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/index`);
});
