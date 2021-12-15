const roteador = require('express').Router({ mergeParams: true });
const Tabela = require('./TabelaProduto');
const Produtos = require('./Produtos');
const Serializador = require('../../../Serializador').SerializadorProduto;


roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
        .set('Access-Control-Allow-Headers', 'Content-Type')
        .status(204)
        .end();
});

roteador.get('/', async (req, res) => {
    const produtos = await Tabela.listar(req.fornecedor.id);

    const serializador = new Serializador(
        res.getHeader('Content-Type')
    );

    res.send(serializador.serializar(produtos));

});

roteador.post('/', async (req, res, next) => {
    try {
        const idFornecedor = req.fornecedor.id;
        const corpo = req.body;
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor });

        const produto = new Produtos(dados);
        await produto.criar();

        const serializador = new Serializador(
            res.getHeader('Content-Type')
        );

        const timestamp = (new Date(produto.dataAtualizacao)).getTime();

        res.set('ETag', produto.versao)
            .set('Last-Modified', timestamp)
            .set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
            .status(201)
            .send(serializador.serializar(produto))

    } catch (erro) {
        next(erro);
    }
});

roteador.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, PUT')
        .set('Access-Control-Allow-Headers', 'Content-Type')
        .status(204)
        .end();
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

roteador.get('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }

        const produto = new Produtos(dados);
        await produto.carregar();

        const serializador = new Serializador(
            res.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        );

        const timestamp = (new Date(produto.dataAtualizacao)).getTime();

        res.set('ETag', produto.versao)
            .set('Last-Modified', timestamp)
            .send(serializador.serializar(produto));

    } catch (erro) {
        next(erro);
    }
});

roteador.head('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }

        const produto = new Produtos(dados);
        await produto.carregar();

        const timestamp = (new Date(produto.dataAtualizacao)).getTime();

        res.set('ETag', produto.versao)
            .set('Last-Modified', timestamp)
            .status(200)
            .end();
            
    } catch (erro) {
        next(erro);
    }
});


roteador.put('/:id', async (req, res, next) => {

    try {
        const dados = Object.assign(
            {},
            req.body,
            {
                id: req.params.id,
                fornecedor: req.fornecedor.id

            }
        );

        const produto = new Produtos(dados);
        await produto.atualizar();
        await produto.carregar();

        const timestamp = (new Date(produto.dataAtualizacao)).getTime();

        res.set('ETag', produto.versao)
            .set('Last-Modified', timestamp)
            .set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
            .status(204)
            .end();

    } catch (erro) {
        next(erro);
    }
});

roteador.options('/:id/diminuir-estoque', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST')
        .set('Access-Control-Allow-Headers', 'Content-Type')
        .status(204)
        .end();
});

roteador.post('/:id/diminuir-estoque', async (req, res, next) => {

    try {
        const produto = new Produtos({
            id: req.params.id,
            fornecedor: req.fornecedor.id
        });

        await produto.carregar();
        produto.estoque = produto.estoque - req.body.quantidade;
    
        await produto.diminuirEstoque();
        await produto.carregar();

        const timestamp = (new Date(produto.dataAtualizacao)).getTime();

        res.set('ETag', produto.versao)
            .set('Last-Modified', timestamp)
            .set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
            .status(204)
            .end();

    } catch (erro) {
        next(erro);
    }


});

module.exports = roteador;