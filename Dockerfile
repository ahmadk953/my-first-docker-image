# syntax=docker/dockerfile:1
FROM node:19.8-alpine
RUN apk add --no-cache python3=3.11 g++=12.2 make=4.4.1
WORKDIR /app
COPY . .
RUN yarn install --ignore-scripts --production && yarn cache clean
CMD ["node", "src/index.js"]
EXPOSE 3000
