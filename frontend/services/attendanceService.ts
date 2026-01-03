import { db } from "../db/connection";

export class AttendanceService {
    static async checkIn(userId: number) {
        const today = new Date().toISOString().split("T")[0];
        const client = await db.getClient();
        try {
            await client.query("BEGIN");

            const existing = await client.query("SELECT * FROM attendance WHERE user_id = $1 AND date = $2", [userId, today]);
            if (existing.rows.length > 0) throw new Error("Already checked in today");

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

            const existing = await client.query("SELECT * FROM attendance WHERE user_id = $1 AND date = $2", [userId, today]);
            if (existing.rows.length === 0) throw new Error("No check-in found for today");
            if (existing.rows[0].check_out) throw new Error("Already checked out");

            const res = await client.query(
                `UPDATE attendance SET check_out = NOW() WHERE id = $1 RETURNING *`,
                [existing.rows[0].id]
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

    static async getAttendance(userId?: number, date?: string) {
        let query = `
      SELECT a.*, ep.first_name, ep.last_name, u.employee_id 
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      JOIN employee_profiles ep ON u.id = ep.user_id
    `;
        const params: any[] = [];

        if (userId) {
            query += ` WHERE a.user_id = $1`;
            params.push(userId);
        }

        if (date) {
            if (params.length > 0) query += ` AND a.date = $2`;
            else query += ` WHERE a.date = $1`;
            params.push(date);
        }

        query += ` ORDER BY a.date DESC`;
        return (await db.query(query, params)).rows;
    }
}
