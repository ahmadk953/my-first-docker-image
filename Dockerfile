# syntax=docker/dockerfile:1
FROM node:20.8.0-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY . .
RUN npm install sqlite3@5.1.6 && npm install --ignore-scripts --production
CMD ["node", "src/index.js"]
EXPOSE 3000

