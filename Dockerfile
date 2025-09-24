FROM node:20

WORKDIR /app

# instalar dependências
COPY package*.json ./
RUN npm install

# copiar código
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]