# Todo App

A clean, working TODO application built with Express and a simple static frontend.

## Run locally

```bash
yarn install
yarn start
```

Then open http://localhost:3000.

## Run with Docker

```bash
docker build -t my-first-image .
docker run --rm -p 3000:3000 my-first-image
```

## Storage

- Default: SQLite at `./data/todo.db` (relative to the app working directory)
- MySQL is used when `MYSQL_HOST` is set (with optional `*_FILE` secret paths)
