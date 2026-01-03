import { db } from "../_lib/db";
import { AuthUtils } from "../_lib/auth-utils";
import { RegisterDTO, LoginDTO, User, Role } from "../_types";

export class AuthService {
  static async register(data: RegisterDTO) {
    const client = await db.getClient();
    try {
      await client.query("BEGIN");

      // 1. Check if user exists
      const existing = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [data.email]
      );
      if (existing.rows.length > 0) {
        throw new Error("User already exists");
      }

      // 2. Get Role ID
      const roleRes = await client.query(
        "SELECT id FROM roles WHERE name = $1",
        [data.role]
      );
      if (roleRes.rows.length === 0) {
        throw new Error("Invalid role");
      }
      const roleId = roleRes.rows[0].id;

      // 3. Hash Password
      const hashedPassword = await AuthUtils.hashPassword(data.password);

      // 4. Create User
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, role_id) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, role_id, created_at`,
        [data.email, hashedPassword, roleId]
      );
      const user = userRes.rows[0];

      // 5. Create basic Profile
      await client.query(
        `INSERT INTO employee_profiles (user_id, first_name, last_name)
         VALUES ($1, $2, $3)`,
        [user.id, data.firstName, data.lastName]
      );

      await client.query("COMMIT");
      return user;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async login(data: LoginDTO) {
    // 1. Find User
    const res = await db.query(
      `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = $1`,
      [data.email]
    );

    if (res.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = res.rows[0];

    // 2. Check Password
    const isValid = await AuthUtils.comparePassword(
      data.password,
      user.password_hash
    );
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    if (!user.is_active) {
      throw new Error("Account is inactive");
    }

    // 3. Remove sensitive data
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}
