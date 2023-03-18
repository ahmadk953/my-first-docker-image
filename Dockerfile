# syntax=docker/dockerfile:1
FROM node:19.7-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY . .
RUN yarn install --production && yarn cache clean
CMD ["node", "src/index.js"]
EXPOSE 3000
