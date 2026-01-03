import { db } from "../db/connection";

export class LeaveService {
    static async applyLeave(userId: number, data: { startDate: string, endDate: string, type: string, reason: string }) {
        const res = await db.query(
            `INSERT INTO leaves (user_id, start_date, end_date, leave_type, reason, status)
       VALUES ($1, $2, $3, $4, $5, 'PENDING')
       RETURNING *`,
            [userId, data.startDate, data.endDate, data.type, data.reason]
        );
        return res.rows[0];
    }

    static async updateStatus(leaveId: number, status: string, comment: string) {
        const res = await db.query(
            `UPDATE leaves 
       SET status = $1, admin_comment = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
            [status, comment, leaveId]
        );
        return res.rows[0];
    }

    static async getLeaves(userId?: number) {
        let query = `
      SELECT l.*, ep.first_name, ep.last_name, u.employee_id 
      FROM leaves l
      JOIN users u ON l.user_id = u.id
      JOIN employee_profiles ep ON u.id = ep.user_id
    `;
        const params: any[] = [];

        if (userId) {
            query += ` WHERE l.user_id = $1`;
            params.push(userId);
        }

        query += ` ORDER BY l.created_at DESC`;

        const res = await db.query(query, params);
        return res.rows;
    }
}
