const { Pool } = require("pg");

const proDbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

module.exports = proDbPool;