const pool = require('../config/db');

const createUser = async ({ name, email, passwordHash }) => {
  const [result] = await pool.query(
    `INSERT INTO User (name, email, passwordHash) VALUES (?, ?, ?)`,
    [name, email, passwordHash]
  );
  return { userID: result.insertId, name, email };
};

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT * FROM User WHERE email = ?`,
    [email]
  );
  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};