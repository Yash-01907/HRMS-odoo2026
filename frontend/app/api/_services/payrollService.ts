import { db } from "../_lib/db";

export class PayrollService {
    static async getSalaryStructure(userId: number) {
        const res = await db.query(
            "SELECT * FROM salary_structure WHERE user_id = $1",
            [userId]
        );
        return res.rows[0];
    }

    static async updateSalaryStructure(userId: number, data: { basicSalary: number, allowances: number, deductions: number }) {
        const res = await db.query(
            `INSERT INTO salary_structure (user_id, basic_salary, allowances, deductions, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         basic_salary = EXCLUDED.basic_salary,
         allowances = EXCLUDED.allowances,
         deductions = EXCLUDED.deductions,
         updated_at = NOW()
       RETURNING *`,
            [userId, data.basicSalary, data.allowances, data.deductions]
        );
        return res.rows[0];
    }

    static async getPayrollRecords(userId?: number, month?: string) {
        let query = `
      SELECT pr.*, u.email, p.first_name, p.last_name 
      FROM payroll_records pr
      JOIN users u ON pr.user_id = u.id
      LEFT JOIN employee_profiles p ON u.id = p.user_id
    `;
        const params: any[] = [];

        if (userId) {
            query += ` WHERE pr.user_id = $1`;
            params.push(userId);
        }

        if (month) {
            if (params.length > 0) {
                query += ` AND pr.month = $2`;
            } else {
                query += ` WHERE pr.month = $1`;
            }
            params.push(month);
        }

        query += ` ORDER BY pr.month DESC, pr.generated_at DESC`;

        const res = await db.query(query, params);
        return res.rows;
    }

    // Generate payroll for all active users for a given month
    static async generatePayroll(month: string) {
        // 1. Get all active users with salary structure
        // (In real app, we might calculate based on attendance days, but here we assume fixed or simple calculation)
        // Let's implement a simple calculation: Net = Basic + Allowances - Deductions
        // We could check attendance but "Payroll: Read-only salary & payroll view" is the requirement.
        // "Payroll -> Read-only salary & payroll view" doesn't explicitly ask for auto-calculation based on attendance days,
        // but usually it does. The constraint says "Efficient queries, No duplicated logic".
        // I will stick to structure based generation for simplicity unless strictly required to link attendance.
        // Requirement says "Manage payroll & salary structure".

        // Let's do a simple generation based on salary structure.

        const client = await db.getClient();
        try {
            await client.query("BEGIN");

            const usersRes = await client.query(`
        SELECT u.id, ss.basic_salary, ss.allowances, ss.deductions
        FROM users u
        JOIN salary_structure ss ON u.id = ss.user_id
        WHERE u.is_active = TRUE
      `);

            const users = usersRes.rows;
            const results = [];

            for (const user of users) {
                const basic = parseFloat(user.basic_salary);
                const allowances = parseFloat(user.allowances || 0);
                const deductions = parseFloat(user.deductions || 0);
                const net = basic + allowances - deductions;

                const res = await client.query(
                    `INSERT INTO payroll_records (user_id, month, basic_salary, total_allowances, total_deductions, net_salary)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (user_id, month) 
           DO UPDATE SET 
             basic_salary = EXCLUDED.basic_salary,
             total_allowances = EXCLUDED.total_allowances,
             total_deductions = EXCLUDED.total_deductions,
             net_salary = EXCLUDED.net_salary,
             generated_at = NOW()
           RETURNING *`,
                    [user.id, month, basic, allowances, deductions, net]
                );
                results.push(res.rows[0]);
            }

            await client.query("COMMIT");
            return results;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }
}
