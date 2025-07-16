// CÓDIGO FINAL PARA server.js

const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const livrosDataPath = './livros.json';

const getLivros = () => {
    const data = fs.readFileSync(livrosDataPath, 'utf-8');
    return JSON.parse(data);
};

const saveLivros = (livros) => {
    fs.writeFileSync(livrosDataPath, JSON.stringify(livros, null, 2));
};

// ROTA GET: Obter todos os livros
app.get('/livros', (req, res) => {
    const livros = getLivros();
    res.json(livros);
});

// ROTA GET por ID: Obter um único livro
app.get('/livros/:id', (req, res) => {
    const livros = getLivros();
    const idLivro = parseInt(req.params.id);
    const livro = livros.find(l => l.id === idLivro);

    if (!livro) {
        return res.status(404).json({ message: 'Livro não encontrado' });
    }
    res.json(livro);
});

// ROTA POST: Adicionar um novo livro
app.post('/livros', (req, res) => {
    const livros = getLivros();
    const novoLivro = {
        id: livros.length > 0 ? Math.max(...livros.map(livro => livro.id)) + 1 : 1,
        titulo: req.body.titulo,
        numeroPaginas: req.body.numeroPaginas,
        isbn: req.body.isbn,
        editora: req.body.editora
    };
    livros.push(novoLivro);
    saveLivros(livros);
    res.status(201).json(novoLivro);
});

// ROTA PUT: Atualizar um livro existente
app.put('/livros/:id', (req, res) => {
    const livros = getLivros();
    const idLivro = parseInt(req.params.id);
    const indexLivro = livros.findIndex(livro => livro.id === idLivro);

    if (indexLivro === -1) {
        return res.status(404).json({ message: 'Livro não encontrado' });
    }

    const livroAtualizado = {
        ...livros[indexLivro],
        titulo: req.body.titulo,
        numeroPaginas: req.body.numeroPaginas,
        isbn: req.body.isbn,
        editora: req.body.editora
    };
    livros[indexLivro] = livroAtualizado;
    saveLivros(livros);
    res.json(livroAtualizado);
});

// ROTA DELETE: Deletar um livro
app.delete('/livros/:id', (req, res) => {
    let livros = getLivros();
    const idLivro = parseInt(req.params.id);
    const livrosFiltrados = livros.filter(livro => livro.id !== idLivro);

    if (livros.length === livrosFiltrados.length) {
        return res.status(404).json({ message: 'Livro não encontrado' });
    }
    saveLivros(livrosFiltrados);
    res.status(200).json({ message: 'Livro deletado com sucesso' });
});

app.listen(port, () => {
    console.log(`Servidor do Back-end rodando em http://localhost:${port}`);
});