import { db } from "../db/connection";
import { HashUtils } from "../lib/hash";

export class AuthService {
    static async login(employeeId: string, email: string, password: string) {
        // Strict 3-field check
        const res = await db.query(
            `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.employee_id = $1 AND u.email = $2`,
            [employeeId, email]
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
            isFirstLogin: user.is_first_login,
        };
    }
}
