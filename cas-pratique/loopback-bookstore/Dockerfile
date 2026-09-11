FROM node:22-alpine

RUN apk add --no-cache iputils

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", "."]
