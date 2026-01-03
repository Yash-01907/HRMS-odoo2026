const { Pool } = require('pg');
require('dotenv').config({ path: '../.env.local' });

const pool = new Pool({
  connectionString: process.env.DB_STRING,
});

async function checkUsers() {
  try {
    const res = await pool.query('SELECT * FROM users');
    console.log('Users found:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkUsers();
