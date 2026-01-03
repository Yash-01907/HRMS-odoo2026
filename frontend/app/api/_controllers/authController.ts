import { NextResponse } from "next/server";
import { AuthService } from "../_services/authService";
import { AuthUtils } from "../_lib/auth-utils";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "HR", "EMPLOYEE"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class AuthController {
  static async register(req: Request) {
    try {
      const body = await req.json();

      // Input Validation
      const result = registerSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error.flatten() },
          { status: 400 }
        );
      }

      const user = await AuthService.register(result.data);

      // Auto-login (optional, but requested in flow usually)??
      // User requirements: "Register", "Login".
      // Let's just return success for now.

      return NextResponse.json(
        { message: "User registered successfully", user },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Register Error:", error);
      const status = error.message === "User already exists" ? 409 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
  }

  static async login(req: Request) {
    try {
      const body = await req.json();

      // Input Validation
      const result = loginSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error.flatten() },
          { status: 400 }
        );
      }

      const user = await AuthService.login(result.data);

      // Create Session
      const token = await AuthUtils.createSession({
        userId: user.id,
        role: user.role_name,
        email: user.email,
      });

      return NextResponse.json(
        { message: "Login successful", user },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Login Error:", error);
      const status = error.message === "Invalid credentials" ? 401 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
  }

  static async logout() {
    await AuthUtils.clearSession();
    return NextResponse.json({ message: "Logged out" });
  }
}
