# Use uma imagem leve do Node.js para a construção da aplicação
FROM node:20-alpine AS builder

# Diretório de trabalho para o builder
WORKDIR /usr/src/app

# Copie apenas os arquivos necessários para instalar dependências
COPY package*.json ./

# Instale dependências
RUN npm install --production

# Copie o código-fonte para o builder
COPY . .

# Compile a aplicação para produção
RUN npm run build

# Segunda etapa: Usar Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copie os arquivos de build do builder para o diretório padrão do Nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Exponha a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]