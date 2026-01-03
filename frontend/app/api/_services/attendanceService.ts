import { db } from "../_lib/db";

export class AttendanceService {
    static async checkIn(userId: number) {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        const client = await db.getClient();
        try {
            await client.query("BEGIN");

            // Check if already checked in
            const existing = await client.query(
                "SELECT * FROM attendance WHERE user_id = $1 AND date = $2",
                [userId, today]
            );

            if (existing.rows.length > 0) {
                throw new Error("Already checked in for today");
            }

            const res = await client.query(
                `INSERT INTO attendance (user_id, date, check_in, status)
         VALUES ($1, $2, NOW(), 'PRESENT')
         RETURNING *`,
                [userId, today]
            );

            await client.query("COMMIT");
            return res.rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async checkOut(userId: number) {
        const today = new Date().toISOString().split("T")[0];

        const client = await db.getClient();
        try {
            await client.query("BEGIN");

            const existing = await client.query(
                "SELECT * FROM attendance WHERE user_id = $1 AND date = $2",
                [userId, today]
            );

            if (existing.rows.length === 0) {
                throw new Error("No check-in record found for today");
            }

            if (existing.rows[0].check_out) {
                throw new Error("Already checked out for today");
            }

            const res = await client.query(
                `UPDATE attendance 
         SET check_out = NOW() 
         WHERE user_id = $1 AND date = $2 
         RETURNING *`,
                [userId, today]
            );

            await client.query("COMMIT");
            return res.rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async getMyAttendance(userId: number) {
        const res = await db.query(
            `SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC`,
            [userId]
        );
        return res.rows;
    }

    static async getAllAttendance(date?: string) {
        let query = `
      SELECT a.*, u.email, p.first_name, p.last_name 
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN employee_profiles p ON u.id = p.user_id
    `;
        const params: any[] = [];

        if (date) {
            query += ` WHERE a.date = $1`;
            params.push(date);
        }

        query += ` ORDER BY a.date DESC, p.last_name ASC`;

        const res = await db.query(query, params);
        return res.rows;
    }
}
