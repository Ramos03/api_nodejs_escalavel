const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor;


roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET')
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
        res.getHeader('Content-Type')
    );

    res.send(serializador.serializar(resultados));
});

module.exports = roteador;