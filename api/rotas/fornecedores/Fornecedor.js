const TabelaFornecedor = require('./TabelaFornecedor');
const CampoInvalido = require('../../erros/CampoInvalido');
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos');

class Fornecedor {
    constructor({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
        this.id = id;
        this.empresa = empresa,
        this.email = email;
        this.categoria = categoria;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.versao = versao;
    }

    /**
     * Função responsável por validar e repassar os dados para o insert
     */
    async criar() {
        this.validar();

        const resultado = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        });

        this.id = resultado.id;
        this.dataCriacao = resultado.dataCriacao;
        this.dataAtualizacao = resultado.dataAtualizacao;
        this.versao = resultado.versao;
    }

    /**
     * Função responsável por realizar a busca do fornecedor pelo id
     */
    async carregar() {
        const encontrado = await TabelaFornecedor.buscarById(this.id);

        this.empresa = encontrado.empresa;
        this.email = encontrado.email;
        this.categoria = encontrado.categoria;
        this.dataCriacao = encontrado.dataCriacao;
        this.dataAtualizacao = encontrado.dataAtualizacao;
        this.versao = encontrado.versao;
    }

    /**
     * Função responsável por validar e repassar a atualização do registro específico
     */
    async atualizar() {
        await TabelaFornecedor.buscarById(this.id);

        const campos = ['empresa', 'email', 'categoria'];
        const dadosAtualizar = {};

        campos.forEach((campo) => {
            const valor = this[campo];

            if (typeof valor === 'string' && valor.length > 0) {
                dadosAtualizar[campo] = valor;
            }
        });

        if (Object.keys(dadosAtualizar).length === 0) {
            throw new DadosNaoFornecidos();
        }

        await TabelaFornecedor.atualizar(this.id, dadosAtualizar);
    }

    /** 
     * Função para remover o fornecedor 
     */    
    async remover() {
        return await TabelaFornecedor.remover(this.id);
    }

    /** 
     * Função responsável por validar o cliente 
     */
    validar() {
        const campos = ['empresa', 'email', 'categoria'];

        campos.forEach((campo) => {
            const valor = this[campo];

            if (typeof valor !== 'string' || valor.length == 0) {
                throw new CampoInvalido(campo);
            }
        });
    }
}

module.exports = Fornecedor;