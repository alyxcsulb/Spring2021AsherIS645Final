// required module
require('dotenv').config()

// Add database package and connection string (can remove ssl)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});



