import pkg from "pg";
/*
 * Postgres connection method: using POOL - better performance & concurrent queries
 */

const { Pool } = pkg;

// create the POOL object :
// open connection to use and reuse when needed
//  - since conecting to DB is expensive.
export const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// connection check function
export const connectPostgres = async () => {
  try {
    const client = await pgPool.connect(); // check if client exist
    console.log("PostgreSQL connected");
    client.release(); // if exist --> connection stablised - now release the client
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    process.exit(1); // early exit - avoid zombie state (state without database access)
  }
};
