import { db } from "../db/connection";

export class ReportsService {
    static async getSummary() {
        const attendance = await db.query(`
      SELECT status, COUNT(*) as count FROM attendance GROUP BY status
    `);

        const leaves = await db.query(`
      SELECT status, COUNT(*) as count FROM leaves GROUP BY status
    `);

        // Total payroll processed this month
        const payroll = await db.query(`
      SELECT SUM(net_salary) as total_payout, COUNT(*) as processed_employees, month
      FROM payroll_records
      GROUP BY month
      ORDER BY month DESC
      LIMIT 1
    `);

        return {
            attendance: attendance.rows,
            leaves: leaves.rows,
            payroll: payroll.rows[0] || null
        };
    }
}
