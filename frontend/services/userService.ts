import { db } from "../db/connection";
import { HashUtils } from "../lib/hash";

export class UserService {
    private static async generateEmployeeId(firstName: string, lastName: string, companyCode: string = "OD"): Promise<string> {
        const fn = firstName.substring(0, 2).toUpperCase();
        const ln = lastName.substring(0, 2).toUpperCase();
        const year = new Date().getFullYear().toString();

        // Get count for this year to generate serial
        // Note: In high concurrency, this needs a better locking mechanism or sequence. 
        // For this project, SELECT COUNT is acceptable or we could use a sequence per year.
        // Let's use a regex check on employee_id to find the last one for this pattern.
        const pattern = `${companyCode}${fn}${ln}${year}%`;

        const res = await db.query(
            "SELECT count(*) as count FROM users WHERE employee_id LIKE $1",
            [pattern]
        );

        const count = parseInt(res.rows[0].count || "0") + 1;
        const serial = count.toString().padStart(4, "0");

        return `${companyCode}${fn}${ln}${year}${serial}`;
    }

    static async createEmployee(data: {
        firstName: string;
        lastName: string;
        email: string;
        joiningDate: string;
        role: string;
        companyId?: number;
    }) {
        const client = await db.getClient();
        try {
            await client.query("BEGIN");

            // 1. Generate ID
            // Defaulting company code to OD for now, in real app fetch from companies table
            const companyRes = await client.query("SELECT code FROM companies LIMIT 1");
            const companyCode = companyRes.rows[0]?.code || "OD";
            const companyId = data.companyId || (await client.query("SELECT id FROM companies LIMIT 1")).rows[0].id;

            const employeeId = await this.generateEmployeeId(data.firstName, data.lastName, companyCode);

            // 2. Generate Temp Password (random 8 chars)
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await HashUtils.hash(tempPassword);

            // 3. Get Role ID
            const roleRes = await client.query("SELECT id FROM roles WHERE name = $1", [data.role]);
            const roleId = roleRes.rows[0]?.id;
            if (!roleId) throw new Error("Invalid Role");

            // 4. Insert User
            // Note: is_first_login defaults to true in schema
            const userRes = await client.query(
                `INSERT INTO users (employee_id, email, password_hash, role_id, company_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, employee_id, email`,
                [employeeId, data.email, hashedPassword, roleId, companyId]
            );
            const user = userRes.rows[0];

            // 5. Insert Profile
            await client.query(
                `INSERT INTO employee_profiles (user_id, first_name, last_name, joining_date)
         VALUES ($1, $2, $3, $4)`,
                [user.id, data.firstName, data.lastName, data.joiningDate]
            );

            await client.query("COMMIT");

            return {
                ...user,
                tempPassword, // Return this so Admin can share it with employee
            };
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async updateProfile(userId: number, data: { address?: string, phone?: string, avatar?: string }) {
        // Only allow updating specific fields
        const res = await db.query(
            `UPDATE employee_profiles 
       SET address = COALESCE($2, address),
           phone = COALESCE($3, phone),
           avatar_url = COALESCE($4, avatar_url),
           updated_at = NOW()
       WHERE user_id = $1
       RETURNING *`,
            [userId, data.address, data.phone, data.avatar]
        );
        return res.rows[0];
    }

    static async getAllEmployees() {
        const res = await db.query(`
      SELECT u.id, u.employee_id, u.email, u.role_id, ep.first_name, ep.last_name, ep.designation, r.name as role_name
      FROM users u
      JOIN employee_profiles ep ON u.id = ep.user_id
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `);
        return res.rows;
    }

    static async getUserById(userId: number) {
        const res = await db.query(`
      SELECT u.id, u.employee_id, u.email, u.role_id, ep.first_name, ep.last_name, ep.designation, ep.phone, ep.address, ep.avatar_url, ep.joining_date, r.name as role_name
      FROM users u
      JOIN employee_profiles ep ON u.id = ep.user_id
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
    `, [userId]);
        return res.rows[0];
    }
}
