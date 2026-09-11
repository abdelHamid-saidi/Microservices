FROM node:22-alpine

RUN apk add --no-cache iputils

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 9001

CMD ["node", "server.js"]
