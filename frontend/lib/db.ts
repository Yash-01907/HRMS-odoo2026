import { Pool } from 'pg';

// Create a connection pool using environment variables
const pool = new Pool({
 connectionString: process.env.DB_STRING,
});

// Helper function to execute queries with types
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};