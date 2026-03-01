FROM node:22-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends python3 make g++ \
	&& rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN corepack enable \
	&& yarn install --frozen-lockfile --production=true \
	&& yarn cache clean

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY src ./src

EXPOSE 3000
CMD ["node", "src/index.js"]
