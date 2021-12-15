const ValorNaoSuportado = require("./erros/ValorNaoSuportado");
const jsontoxml = require('jsontoxml');

class Serializador {

    /**
     * Função responsável por montar um json
     * @param {*} dados 
     * @returns 
     */
    json(dados) {
        return JSON.stringify(dados);
    }

    /**
     * Função responsável por montar um xml
     * @param {*} dados 
     * @returns 
     */
    xml(dados) {
        let tag = this.tagSingular;

        /** Responsável por montar o XML corretamente */
        if(Array.isArray(dados)){
            tag = this.tagPlural;
            dados = dados.map((item) => {
                return {
                    [this.tagSingular]: item
                }
            });
        }
        return jsontoxml({ [tag]: dados });
    }
    /**
     * Função para verificar o Accept que chegou na API
     * @param {*} dados 
     * @returns 
     */
    serializar(dados) {
        dados = this.filtrar(dados);

        if (this.contentType === 'application/json') {
            return this.json(dados);
        }

        if (this.contentType === 'application/xml') {
            return this.xml(dados);
        }
        throw new ValorNaoSuportado(this.contentType);
    }

    /**
     * Função para filtrar dados sensiveis para retorno na API
     * @param {} dados 
     * @returns 
     */
    filtrarObjeto(dados) {
        const novoObjeto = {};

        this.camposPublicos.forEach((campo) => {
            if (dados.hasOwnProperty(campo)) {
                novoObjeto[campo] = dados[campo];
            }
        });

        return novoObjeto;
    }

    /**
     * Função para filtrar dados sensiveis para retorno na API
     * @param {*} dados 
     * @returns 
     */
    filtrar(dados) {
        if (Array.isArray(dados)) {
            /** Se existir uma lista, é feita montagem de uma nova lista de acordo com a funcao filtrarObjeto */
            dados = dados.map(item => {
                return this.filtrarObjeto(item)
            });
        } else {
            dados = this.filtrarObjeto(dados);
        }

        return dados;
    }
}

/**
 * Classe que extend do serializador para que possa tratar os campos da api
 */
class SerializadorFornecedor extends Serializador {
    constructor(contentType, camposExtras) {
        super();
        this.contentType = contentType;
        this.camposPublicos = [
            'id',
            'categoria'
        ].concat(camposExtras || []);
        /** Tags para montagem do XML */
        this.tagSingular = 'fornecedor';
        this.tagPlural = 'fornecedores';

    }
}

/**
 * Classe que extend do serializador para que possa tratar os erros da api
 */
class SerializadorErro extends Serializador {
    constructor(contentType, camposExtras) {
        super();
        this.contentType = contentType;
        this.camposPublicos = [
            'id',
            'mensagem'
        ].concat(camposExtras || []);

        /** Tags para montagem do XML */
        this.tagSingular = 'erro';
        this.tagPlural = 'erros';
    }
}

class SerializadorProduto extends Serializador {
    constructor(contentType, camposExtras){
        super();
        this.contentType = contentType;
        this.camposPublicos = [
            'id',
            'titulo'
        ].concat(camposExtras || []);
        this.tagSingular = 'produto';
        this.tagPlural =  'produtos';
    }   
}
module.exports = {
    Serializador: Serializador,
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorErro: SerializadorErro,
    SerializadorProduto: SerializadorProduto,
    formatosAceitos: ['application/json', 'application/xml']
};