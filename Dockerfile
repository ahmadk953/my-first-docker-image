# syntax=docker/dockerfile:1
FROM node:20.5.0-alpine
RUN apk add --no-cache python3=3.10.11-r0 g++=12.2.1_git20220924-r4 make=4.3-r1
WORKDIR /app
COPY . .
RUN npm install sqlite3@5.1.6 && npm install --ignore-scripts --production
CMD ["node", "src/index.js"]
EXPOSE 3000

