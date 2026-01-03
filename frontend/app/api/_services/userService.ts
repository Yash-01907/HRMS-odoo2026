import { db } from "../_lib/db";

export class UserService {
  static async getProfile(userId: number) {
    const res = await db.query(
      `SELECT 
        u.id as user_id, 
        u.email, 
        r.name as role,
        p.first_name,
        p.last_name,
        p.phone,
        p.department,
        p.designation,
        p.joining_date
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN employee_profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (res.rows.length === 0) return null;
    return res.rows[0];
  }
}
