import { db } from "../_lib/db";

export class ReportsService {
    static async getAttendanceSummary(date?: string) {
        let query = `
      SELECT status, COUNT(*) as count 
      FROM attendance 
      WHERE 1=1 
    `;
        const params: any[] = [];

        if (date) {
            query += ` AND date = $1`;
            params.push(date);
        }

        query += ` GROUP BY status`;

        const res = await db.query(query, params);
        return res.rows;
    }

    static async getLeaveSummary() {
        const res = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM leaves 
      GROUP BY status
    `);
        return res.rows;
    }

    static async getPayrollSummary(month: string) {
        const res = await db.query(
            `SELECT SUM(net_salary) as total_payout, COUNT(*) as processed_employees 
       FROM payroll_records 
       WHERE month = $1`,
            [month]
        );
        return res.rows[0];
    }

    static async getDashboardStats() {
        const totalEmployees = await db.query("SELECT COUNT(*) FROM users WHERE is_active = TRUE");
        const today = new Date().toISOString().split("T")[0];
        const presentToday = await db.query("SELECT COUNT(*) FROM attendance WHERE date = $1 AND status = 'PRESENT'", [today]);
        const pendingLeaves = await db.query("SELECT COUNT(*) FROM leaves WHERE status = 'PENDING'");

        return {
            totalEmployees: totalEmployees.rows[0].count,
            presentToday: presentToday.rows[0].count,
            pendingLeaves: pendingLeaves.rows[0].count,
        };
    }
}
