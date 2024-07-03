# syntax=docker/dockerfile:1
FROM node:22.4.0-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY . .
RUN npm install sqlite3@5.1.7 --ignore-scripts --production --omit=dev && npm install --ignore-scripts --production --omit=dev
CMD ["node", "src/index.js"]
EXPOSE 3000
