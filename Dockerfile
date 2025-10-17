FROM node:25.0.0-alpine3.21
WORKDIR /app
COPY src/ src/
COPY package.json .
RUN corepack enable && yarn install --immutable && yarn cache clean
CMD ["yarn", "start"]
EXPOSE 3000
