// const { Pool } = require("pg");

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// pool.on("connect", () => {
//   console.log("Connected to PostgreSQL");
// });

// pool.on("error", (err) => {
//   console.error("Unexpected DB error", err);
//   process.exit(1);
// });

// module.exports = pool;



const { Pool } = require("pg");

const pools = {
  free: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5, // limit free users
  }),

  pro: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),

  enterprise: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
  }),
};

const getPoolByTier = (tier) => {
  if (!pools[tier]) {
    throw new Error("Invalid tenant tier");
  }
  return pools[tier];
};

module.exports = { getPoolByTier };