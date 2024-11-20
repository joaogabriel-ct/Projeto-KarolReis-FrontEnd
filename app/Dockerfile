# Use uma imagem Node.js como base
FROM node:18

# Diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo de dependências para o contêiner
COPY package.json package-lock.json ./

# Instale as dependências com npm
RUN npm install

# Copie o restante do código para dentro do contêiner
COPY . .

# Execute o build da aplicação Next.js
RUN npm run build

# Exponha a porta 3000
EXPOSE 3000

# Comando para iniciar o servidor no modo produção
CMD ["npm", "run","start"]
