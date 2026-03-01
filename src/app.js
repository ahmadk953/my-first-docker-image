const express = require('express');
const helmet = require('helmet');
const itemsRouter = require('./routes/items');

function createApp() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
        },
      },
    }),
  );

  app.use(express.json());
  app.use(express.static(`${__dirname}/static`));

  app.use('/items', itemsRouter);

  app.use((_, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((error, _, res, __) => {
    if (error && error.status) {
      return res.status(error.status).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
