const { Router } = require('express');
const { randomUUID } = require('crypto');
const db = require('../persistence');

const router = Router();

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function isValidName(name) {
  return (
    typeof name === 'string' &&
    name.trim().length > 0 &&
    name.trim().length <= 255
  );
}

function isValidCompleted(completed) {
  return typeof completed === 'boolean';
}

router.get('/', async (_, res, next) => {
  try {
    const items = await db.getItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body || {};

    if (!isValidName(name)) {
      throw badRequest(
        'Item name must be a non-empty string up to 255 characters.',
      );
    }

    const item = {
      id: randomUUID(),
      name: name.trim(),
      completed: false,
    };

    await db.storeItem(item);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, completed } = req.body || {};

    if (!id) {
      throw badRequest('Item id is required.');
    }

    if (!isValidName(name)) {
      throw badRequest(
        'Item name must be a non-empty string up to 255 characters.',
      );
    }

    if (!isValidCompleted(completed)) {
      throw badRequest('Item completed must be a boolean.');
    }

    await db.updateItem(id, {
      name: name.trim(),
      completed,
    });

    const updatedItem = await db.getItem(id);
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw badRequest('Item id is required.');
    }

    await db.removeItem(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
