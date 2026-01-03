import { db } from "../db/connection";

export class PayrollService {
    static async upsertSalaryStructure(userId: number, components: {
        basic: number,
        hra: number,
        standardAllowance: number,
        performanceBonus: number,
        lta: number,
        pf: number,
        profTax: number,
        otherDeductions: number
    }) {
        // Validation: Total check could be added here if there was a "Total Wage" field
        // For now we trust the inputs but ensure they are numbers

        // Note: Database uses `salary_structures` table based on new schema
        const res = await db.query(
            `INSERT INTO salary_structures 
         (user_id, basic_salary, hra, standard_allowance, performance_bonus, lta, pf, prof_tax, other_deductions, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         basic_salary = EXCLUDED.basic_salary,
         hra = EXCLUDED.hra,
         standard_allowance = EXCLUDED.standard_allowance,
         performance_bonus = EXCLUDED.performance_bonus,
         lta = EXCLUDED.lta,
         pf = EXCLUDED.pf,
         prof_tax = EXCLUDED.prof_tax,
         other_deductions = EXCLUDED.other_deductions,
         updated_at = NOW()
       RETURNING *`,
            [
                userId,
                components.basic,
                components.hra,
                components.standardAllowance,
                components.performanceBonus,
                components.lta,
                components.pf,
                components.profTax,
                components.otherDeductions
            ]
        );
        return res.rows[0];
    }

    static async getSalaryStructure(userId: number) {
        const res = await db.query(
            "SELECT * FROM salary_structures WHERE user_id = $1",
            [userId]
        );
        return res.rows[0];
    }

    static async generatePayroll(month: string) {
        const client = await db.getClient();
        try {
            await client.query("BEGIN");

            // 1. Get all active users with salary structure
            const usersRes = await client.query(`
        SELECT u.id, ss.*
        FROM users u
        JOIN salary_structures ss ON u.id = ss.user_id
        WHERE u.is_active = TRUE
      `);

            const results = [];

            for (const row of usersRes.rows) {
                const basic = parseFloat(row.basic_salary);
                const hra = parseFloat(row.hra);
                const da = parseFloat(row.standard_allowance);
                const bonus = parseFloat(row.performance_bonus);
                const lta = parseFloat(row.lta);

                const pf = parseFloat(row.pf);
                const tax = parseFloat(row.prof_tax);
                const other = parseFloat(row.other_deductions);

                const totalAllowances = hra + da + bonus + lta;
                const totalDeductions = pf + tax + other;
                const netSalary = basic + totalAllowances - totalDeductions;

                // Insert into payroll_records
                const ins = await client.query(
                    `INSERT INTO payroll_records 
            (user_id, month, basic_salary, total_allowances, total_deductions, net_salary)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id, month)
            DO UPDATE SET
              basic_salary = EXCLUDED.basic_salary,
              total_allowances = EXCLUDED.total_allowances,
              total_deductions = EXCLUDED.total_deductions,
              net_salary = EXCLUDED.net_salary,
              generated_at = NOW()
            RETURNING *`,
                    [row.user_id, month, basic, totalAllowances, totalDeductions, netSalary]
                );
                results.push(ins.rows[0]);
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

    static async getPayroll(userId?: number, month?: string) {
        let query = `
      SELECT pr.*, ep.first_name, ep.last_name, u.employee_id
      FROM payroll_records pr
      JOIN users u ON pr.user_id = u.id
      JOIN employee_profiles ep ON u.id = ep.user_id
    `;
        const params: any[] = [];

        // Simple filter building
        if (userId) {
            query += ` WHERE pr.user_id = $1`;
            params.push(userId);
        }

        if (month) {
            if (params.length > 0) query += ` AND pr.month = $${params.length + 1}`;
            else query += ` WHERE pr.month = $1`;
            params.push(month);
        }

        query += ` ORDER BY pr.month DESC`;

        const res = await db.query(query, params);
        return res.rows;
    }
}
