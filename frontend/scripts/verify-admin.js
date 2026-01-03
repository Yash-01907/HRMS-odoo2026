const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const envLocal = path.resolve(__dirname, "../.env.local");
const envDefault = path.resolve(__dirname, "../.env");
if (fs.existsSync(envLocal)) dotenv.config({ path: envLocal });
else dotenv.config({ path: envDefault });

const pool = new Pool({ connectionString: process.env.DB_STRING });

async function verify() {
    try {
        const res = await pool.query("SELECT email, employee_id FROM users");
        fs.writeFileSync(
            path.resolve(__dirname, "admin-info.json"), 
            JSON.stringify(res.rows, null, 2)
        );
        console.log("Written to admin-info.json");
    } catch(e) {
        fs.writeFileSync(path.resolve(__dirname, "error.txt"), e.toString());
    } finally {
        await pool.end();
    }
}
verify();
