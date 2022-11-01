# syntax=docker/dockerfile:1
FROM node:12-alpine
RUN apk add --no-cache python3=3.11.0 g++=12.2 make=4.4
WORKDIR /app
COPY . .
RUN yarn install --production && yarn cache clean
CMD ["node", "src/index.js"]
EXPOSE 3000
