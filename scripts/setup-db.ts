import { Pool } from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(__dirname, "../frontend/.env") });
// Fallback to local if not found in root (adjust path as needed)
if (!process.env.DB_STRING) {
    dotenv.config({ path: path.resolve(__dirname, "../frontend/.env.local") });
}

async function main() {
    if (!process.env.DB_STRING) {
        console.error("Error: DB_STRING is not defined in environment variables.");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DB_STRING,
    });

    try {
        const schemaPath = path.resolve(__dirname, "../frontend/app/api/_db/hrms_schema.sql");
        console.log(`Reading schema from ${schemaPath}...`);
        const schemaSql = fs.readFileSync(schemaPath, "utf-8");

        console.log("Applying schema...");
        await pool.query(schemaSql);
        console.log("Schema applied successfully!");
    } catch (error) {
        console.error("Error applying schema:", error);
    } finally {
        await pool.end();
    }
}

main();
