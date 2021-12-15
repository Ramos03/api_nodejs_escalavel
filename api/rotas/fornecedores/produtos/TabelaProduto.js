const Modelo = require('./ModeloTabelaProduto');
const instancia = require('../../../database');
const NaoEncontrado = require('../../../erros/NaoEncontrado');


module.exports = {
    listar(idFornecedor) {
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            },
            raw:true
        });
    },
    inserir(dados) {
        return Modelo.create(dados);
    },
    remover(idProduto, idFornecedor) {
        return Modelo.destroy({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        });
    },
    async buscaById(idProduto, idFornecedor) {
        const encontrado = await Modelo.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            },
            raw: true
        });

        if(!encontrado){
            throw new NaoEncontrado('Produto');
        }

        return encontrado;
    },
    async atualizar(dadosProduto, dadosAtualizar){
        return Modelo.update(
            dadosAtualizar,
            {
                where: dadosProduto
            }
        );
    },
    subtrair(idProduto, idFornecedor, campo, quantidade){
        return instancia.transaction(async transacao =>{
            const produto = await Modelo.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            });

            produto[campo] = quantidade;

            await produto.save();

            return produto;
        });
    }
}