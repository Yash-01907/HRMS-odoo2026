import { NextResponse } from "next/server";
import { AuthService } from "../services/authService";
import { ValidationUtils } from "../lib/validation";
import { AuthUtils } from "../lib/auth";

export class AuthController {
    static async login(req: Request) {
        try {
            const body = await req.json();
            const result = ValidationUtils.loginSchema.safeParse(body);

            if (!result.success) {
                return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
            }

            const { employeeId, email, password } = result.data;
            const user = await AuthService.login(employeeId, email, password);

            const token = await AuthUtils.createSession({
                userId: user.id,
                role: user.role as "ADMIN" | "HR" | "EMPLOYEE",
                employeeId: user.employeeId,
            });

            return NextResponse.json({
                message: "Login successful",
                user,
                // In a real app, don't return token in body if using httpOnly cookie, 
                // but for debugging/non-browser clients it might be useful.
            });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
    }

    static async logout() {
        await AuthUtils.clearSession();
        return NextResponse.json({ message: "Logged out" });
    }
}
