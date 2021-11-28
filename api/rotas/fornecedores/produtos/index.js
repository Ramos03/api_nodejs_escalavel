const roteador = require('express').Router({ mergeParams: true });
const Tabela = require('./TabelaProduto');
const Produtos = require('./Produtos');

roteador.get('/', async (req, res) => {
    const produtos = await Tabela.listar(req.fornecedor.id);

    res.json(produtos);

});

roteador.post('/', async (req, res, next) => {
    try {
        const idFornecedor = req.fornecedor.id;
        const corpo = req.body;
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor });

        const produto = new Produtos(dados);
        await produto.criar();

        res.status(201);
        res.send(produto);

    } catch(erro){
        next(erro);
    }
});
 
roteador.delete('/:id', async (req, res) => {
    const dados = {
        id: req.params.id,
        fornecedor: req.fornecedor.id
    }
    const produto = new Produtos(dados);
    await produto.apagar();

    res.status(204).end();
});

module.exports = roteador;