FROM node:22-alpine

RUN apk add --no-cache iputils

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001

ENV HOST=0.0.0.0
ENV PORT=3001

CMD ["node", "."]
