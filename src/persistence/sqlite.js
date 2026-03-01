const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const location =
  process.env.SQLITE_DB_LOCATION || path.join(process.cwd(), 'data', 'todo.db');

let db;

function toItem(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    completed: row.completed === 1,
  };
}

function init() {
  const dirName = path.dirname(location);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  return new Promise((acc, rej) => {
    db = new sqlite3.Database(location, (err) => {
      if (err) return rej(err);

      if (process.env.NODE_ENV !== 'test')
        console.log(`Using sqlite database at ${location}`);

      db.run(
        'CREATE TABLE IF NOT EXISTS todo_items (id TEXT PRIMARY KEY, name TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0)',
        (err) => {
          if (err) return rej(err);
          acc();
        },
      );
    });
  });
}

async function teardown() {
  return new Promise((acc, rej) => {
    db.close((err) => {
      if (err) rej(err);
      else acc();
    });
  });
}

async function getItems() {
  return new Promise((acc, rej) => {
    db.all(
      'SELECT id, name, completed FROM todo_items ORDER BY rowid DESC',
      (err, rows) => {
        if (err) return rej(err);
        acc(rows.map(toItem));
      },
    );
  });
}

async function getItem(id) {
  return new Promise((acc, rej) => {
    db.get(
      'SELECT id, name, completed FROM todo_items WHERE id=?',
      [id],
      (err, row) => {
        if (err) return rej(err);
        acc(toItem(row));
      },
    );
  });
}

async function storeItem(item) {
  return new Promise((acc, rej) => {
    db.run(
      'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
      [item.id, item.name, item.completed ? 1 : 0],
      (err) => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

async function updateItem(id, item) {
  return new Promise((acc, rej) => {
    db.run(
      'UPDATE todo_items SET name=?, completed=? WHERE id = ?',
      [item.name, item.completed ? 1 : 0, id],
      (err) => {
        if (err) return rej(err);
        acc();
      },
    );
  });
}

async function removeItem(id) {
  return new Promise((acc, rej) => {
    db.run('DELETE FROM todo_items WHERE id = ?', [id], (err) => {
      if (err) return rej(err);
      acc();
    });
  });
}

module.exports = {
  init,
  teardown,
  getItems,
  getItem,
  storeItem,
  updateItem,
  removeItem,
};
