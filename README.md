# API_NODEJS_RESTFUL

### 💻 Sobre o projeto

API_NODEJS_RESTFUL é um projeto que foi realizado ao longo do curso Rest com NodeJS: Crie uma API REST padronizada e escalável da alura.

O projeto baseia-se na criação de uma API de fornecedores de um petshop.

### Pré-requisitos

Antes de começar, é preciso ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [MySQL](https://www.mysql.com/) ou através de container MySQL [DOCKER](https://hub.docker.com/_/mysql) e [INSOMNIA](https://insomnia.rest/download).

Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### Exemplo de consumo da Endpoint /api/fornecedores
```bash
{
	"empresa": "",
	"email": "",
	"categoria": ""
}

```

### Exemplo de consumo da Endpoint /api/fornecedores/:idFornecedor/produtos
```bash
{
	"titulo": "",
	"preco": 0,
	"estoque": 0
}
```
### 🎲 Rodando a aplicação

```bash
# Clone este repositório
$ git clone https://github.com/Ramos03/api_nodejs_escalavel

# Instale as dependências
$ yarn      #yarn
$ npm i     #npm

# Execute a aplicação
$ yarn start    #yarn
$ npm start     #npm

# O servidor inciará na porta:3000 - acesse http://localhost:3000 

```