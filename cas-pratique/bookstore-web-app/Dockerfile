FROM node:22-alpine

RUN apk add --no-cache iputils

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8082

ENV PORT=8082

CMD ["node", "./bin/www"]
