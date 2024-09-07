FROM node:22.8.0-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY . .
RUN corepack enable
RUN yarn add sqlite3@5.1.7 --ignore-scripts --production --omit=dev && yarn install --ignore-scripts --production --omit=dev
CMD ["node", "src/index.js"]
EXPOSE 3000
