const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const Fornecedor = require('./Fornecedor');
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor;

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
        .set('Access-Control-Allow-Headers', 'Content-Type')
        .status(204)
        .end();
});

/**
 * Rota para buscar todos os fornecedores
 */
roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar();

    res.status(200);

    const serializador = new SerializadorFornecedor(
        res.getHeader('Content-Type'),
        ['empresa']
    );

    res.send(serializador.serializar(resultados));
});

/**
 * Rota para inserir um fornecedor
 */
roteador.post('/', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos);

        await fornecedor.criar();

        res.status(201);

        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['empresa']
        );

        res.send(serializador.serializar(fornecedor));

    } catch (erro) {
        next(erro);
    }

});

roteador.options('/:idFornecedor', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
        .set('Access-Control-Allow-Headers', 'Content-Type')
        .status(204)
        .end();
});
/**
 * Rota para buscar um fornecedor
 */
roteador.get('/:idFornecedor', async (req, res, next) => {

    try {
        const id = req.params.idFornecedor;

        const fornecedor = new Fornecedor({ id: id });

        await fornecedor.carregar();

        res.status(200);

        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['empresa', 'email', 'dataCriacao', 'dataAtualizacao']
        );

        res.send(serializador.serializar(fornecedor));

    } catch (erro) {
        next(erro);
    }
});

/**
 * Rota para buscar atualizar um fornecedor
 */
roteador.put('/:idFornecedor', async (req, res, next) => {

    try {
        const id = req.params.idFornecedor;
        const dados = req.body;

        const dadosObj = Object.assign({}, dados, { id: id });

        const fornecedor = new Fornecedor(dadosObj);

        await fornecedor.atualizar();

        res.status(204).end();

    } catch (erro) {
        next(erro);
    }
});

/**
 * Rota para deletar um fornecedor
 */
roteador.delete('/:idFornecedor', async (req, res, next) => {

    try {
        const id = req.params.idFornecedor;

        const fornecedor = new Fornecedor({ id: id });

        await fornecedor.carregar(fornecedor);
        await fornecedor.remover(fornecedor);

        res.status(204).end();
    } catch (erro) {
        next(erro);
    }
});


const roteadorProdutos = require('./produtos');

/** Middleware para verificar o fornecedor */
const verificarFornecedor = async (req, res, next) => {
    try {
        const id = req.params.idFornecedor;
        const fornecedor = new Fornecedor({ id: id });
        await fornecedor.carregar();
        req.fornecedor = fornecedor;

        next();
    } catch (erro) {
        next(erro);
    }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos);


module.exports = roteador;

