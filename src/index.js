const createApp = require('./app');
const db = require('./persistence');

const port = Number(process.env.PORT) || 3000;
const app = createApp();

let server;

async function start() {
  try {
    await db.init();

    server = app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function gracefulShutdown() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  try {
    await db.teardown();
  } catch {
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);

start();
