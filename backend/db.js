// db.js (Database connection setup)
const { Pool } = require('pg');
// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost', // If using local setup
  database: 'Home', // Your PostgreSQL database name
  password: 'Satya@123', // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
