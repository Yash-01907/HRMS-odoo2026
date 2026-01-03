import { db } from "../db/connection";
import { HashUtils } from "../lib/hash";

export class AuthService {
    static async login(identifier: string, password: string) {
        // Flexible check: Email OR EmployeeID
        const res = await db.query(
            `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = $1 OR u.employee_id = $1`,
            [identifier]
        );

        if (res.rows.length === 0) {
            throw new Error("Invalid Credentials");
        }

        const user = res.rows[0];

        const isValid = await HashUtils.compare(password, user.password_hash);
        if (!isValid) {
            throw new Error("Invalid Credentials");
        }

        if (!user.is_active) {
            throw new Error("Account is inactive");
        }

        return {
            id: user.id,
            employeeId: user.employee_id,
            email: user.email,
            role: user.role_name,
            companyId: user.company_id,
        };
    }
}
