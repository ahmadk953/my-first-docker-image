FROM node:bookworm-slim
WORKDIR /app
COPY src/ src/
COPY package.json .
RUN corepack enable && yarn install --immutable && yarn cache clean
CMD ["yarn", "start"]
EXPOSE 3000
