const waitPort = require('wait-port');
const fs = require('fs');
const mysql = require('mysql2');

const {
  MYSQL_HOST: HOST,
  MYSQL_HOST_FILE: HOST_FILE,
  MYSQL_USER: USER,
  MYSQL_USER_FILE: USER_FILE,
  MYSQL_PASSWORD: PASSWORD,
  MYSQL_PASSWORD_FILE: PASSWORD_FILE,
  MYSQL_DB: DB,
  MYSQL_DB_FILE: DB_FILE,
} = process.env;

let pool;

function readEnvOrFile(rawValue, valueFile) {
  if (valueFile) {
    return fs.readFileSync(valueFile, 'utf-8').trim();
  }

  return rawValue;
}

function toItem(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    completed: row.completed === 1 || row.completed === true,
  };
}

async function init() {
  const host = readEnvOrFile(HOST, HOST_FILE);
  const user = readEnvOrFile(USER, USER_FILE);
  const password = readEnvOrFile(PASSWORD, PASSWORD_FILE);
  const database = readEnvOrFile(DB, DB_FILE);

  await waitPort({ host, port: 3306 });

  pool = mysql.createPool({
    connectionLimit: 5,
    host,
    user,
    password,
    database,
    charset: 'utf8mb4',
  });

  return new Promise((acc, rej) => {
    pool.query(
      'CREATE TABLE IF NOT EXISTS todo_items (id VARCHAR(36) PRIMARY KEY, name VARCHAR(255) NOT NULL, completed BOOLEAN NOT NULL DEFAULT FALSE) DEFAULT CHARSET utf8mb4',
      (err) => {
        if (err) return rej(err);

        console.log(`Connected to mysql db at host ${host}`);
        acc();
      },
    );
  });
}

async function teardown() {
  return new Promise((acc, rej) => {
    pool.end((err) => {
      if (err) rej(err);
      else acc();
    });
  });
}

async function getItems() {
  return new Promise((acc, rej) => {
    pool.query(
      'SELECT id, name, completed FROM todo_items ORDER BY id DESC',
      (err, rows) => {
        if (err) return rej(err);
        acc(rows.map(toItem));
      },
    );
  });
}

async function getItem(id) {
  return new Promise((acc, rej) => {
    pool.query('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
      if (err) return rej(err);
      acc(toItem(rows[0]));
    });
  });
}

async function storeItem(item) {
  return new Promise((acc, rej) => {
    pool.query(
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
    pool.query(
      'UPDATE todo_items SET name=?, completed=? WHERE id=?',
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
    pool.query('DELETE FROM todo_items WHERE id = ?', [id], (err) => {
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
