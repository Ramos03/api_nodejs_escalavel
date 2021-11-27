const Modelo = require('./ModeloTabelaFornecedor');
const NaoEncontrado = require('../../erros/NaoEncontrado');

module.exports = {
    /** Função para buscar todos fornecedores */
    listar() {
        return Modelo.findAll({ raw: true });
    },
    /** Função para inserir novo fornecedor */
    inserir(fornecedor) {
        return Modelo.create(fornecedor);
    },
    /** Função para buscar o fornecedor especifico */
    async buscarById(id) {
        const encontrado = await Modelo.findOne({
            where: {
                id: id
            }
        });

        if (!encontrado) {
            throw new NaoEncontrado();
        }

        return encontrado;
    },
    /** Função responsável por realizar atualização do fornecedor especifico */
    async atualizar(id, dadosAtualizar) {
        return Modelo.update(
            dadosAtualizar,
            {
                where: { id: id}
            }
        )
    },
    /** Função responsável por remover um fornecedor */
    async remover(id){
        return Modelo.destroy({
            where: { id: id}
        });
    }
}