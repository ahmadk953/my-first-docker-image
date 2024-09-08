FROM node:22-alpine
WORKDIR /app
ADD src/ src/
ADD package.json .
RUN corepack enable
RUN yarn install --ignore-scripts --production --omit=dev --build-from-source
CMD ["yarn", "start"]
EXPOSE 3000
