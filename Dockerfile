# Use uma imagem oficial do Node.js como base.
# A versão 'alpine' é super leve, ótima para produção.
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner..
WORKDIR /usr/src/app

# Copia os arquivos de dependências primeiro para aproveitar o cache do Docker.
COPY package*.json ./

# Instala as dependências da aplicação.
RUN npm install

# Copia o resto do código da sua aplicação para o diretório de trabalho.
COPY . .

# Expõe a porta 5000 para que possamos acessá-la de fora do contêiner.
EXPOSE 5000

# O comando que será executado quando o contêiner iniciar.
CMD [ "node", "api.js" ]
