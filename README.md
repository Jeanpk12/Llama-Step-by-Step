# Projeto: Assistente de Raciocínio Passo a Passo com IA

Este projeto é uma aplicação de servidor que utiliza a API da Groq para criar um assistente de inteligência artificial que analisa e resolve problemas passo a passo, explicando seu raciocínio e explorando possibilidades alternativas. O servidor é construído com **Bun.js** e **Express**, e a lógica principal da interação com a API está no módulo `g1.js`.

## Estrutura do Projeto

O projeto é estruturado da seguinte forma:

- **`g1.js`**: Arquivo que contém a lógica de interação com a API da Groq e a geração de respostas passo a passo.
- **`index.js`**: Servidor Express que expõe uma API REST para receber consultas e retornar respostas do assistente de IA.
- **`public/`**: Pasta que armazena arquivos estáticos (HTML/CSS) que podem ser servidos pelo servidor.

## Pré-requisitos

Para rodar o projeto, você precisa ter:

- **Bun.js** instalado (versão mais recente). Você pode instalá-lo seguindo as instruções em [https://bun.sh/](https://bun.sh/).
- A biblioteca `groq-sdk` instalada. Certifique-se de que todas as dependências necessárias estão presentes.

## Instalação

1. Clone o repositório ou faça o download dos arquivos.
2. No diretório do projeto, execute o comando para instalar as dependências:

   ```bash
    bun install
   ```

3. Verifique se você possui a chave da API da Groq configurada corretamente no arquivo g1.js.

## Estrutura do Código

### `g1.js`

Este arquivo é responsável pela interação direta com a API da Groq, utilizando o modelo llama-3.1-70b-versatile. Aqui está um resumo das funções e sua funcionalidade:

* `makeApiCall`: Esta função faz chamadas à API da Groq para gerar uma resposta com base no contexto das mensagens enviadas. Ela tenta até 3 vezes em caso de erro e retorna um JSON estruturado com as informações solicitadas. A temperatura do modelo é ajustada para 0.4 para garantir um equilíbrio entre criatividade e consistência nas respostas.

* `generateResponse`: Função principal que cria a lógica do assistente de raciocínio passo a passo. Ela começa com um prompt inicial e itera sobre várias etapas, armazenando cada passo em um array. Se a resposta final é atingida, ela a formata adequadamente e a retorna. Esta função também controla o tempo de execução de cada etapa para monitoramento e avaliação do desempenho do assistente.

### `index.js`
Este é o servidor Express que define as rotas e endpoints da API:

**POST** `/generate`: Rota que recebe uma consulta (prompt) em JSON e retorna uma resposta gerada pelo assistente de IA. Ele chama a função generateResponse e responde com um JSON contendo os passos do raciocínio e o tempo total de processamento.

**GET** `/: Rota` que serve um arquivo HTML estático como a interface inicial da aplicação.
Como Executar
Após instalar as dependências e configurar o projeto:

1. Inicie o servidor com o comando:

```bash
bun run index.js
```

O servidor estará rodando em http://localhost:3000.

2. Para gerar uma resposta, envie uma requisição POST para http://localhost:3000/generate com um corpo JSON contendo o prompt:

```javascript
{
    "query": "Descreva o processo de fotossíntese."
}
```

A resposta será um JSON com os passos do raciocínio e o tempo total gasto em cada etapa.

### Observações
Certifique-se de que a chave da API da Groq está corretamente configurada no seu ambiente ou diretamente no arquivo g1.js.
Utilize ferramentas como Postman ou cURL para testar as requisições à API facilmente.