FROM node:22-alpine
WORKDIR /app
COPY src/ src/
COPY package.json .
RUN corepack enable && yarn install --ignore-scripts --production --omit=dev --build-from-source && yarn cache clean
CMD ["yarn", "start"]
EXPOSE 3000
