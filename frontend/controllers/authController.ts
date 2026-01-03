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

            const { identifier, password } = result.data;
            const user = await AuthService.login(identifier, password);

            const token = await AuthUtils.createSession({
                userId: user.id,
                role: user.role as "ADMIN" | "HR" | "EMPLOYEE",
                employeeId: user.employeeId,
                companyId: user.companyId,
            });

            return NextResponse.json({
                success: true,
                message: "Login successful",
                role: user.role,
            });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
    }

    static async logout() {
        await AuthUtils.clearSession();
        return NextResponse.json({ success: true, message: "Logged out" });
    }

    static async getMe() {
        try {
            const session = await AuthUtils.getSession();
            if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            // We can return the session directly or fetch fresh user data
            // For efficiency, session data is often enough for auth checks
            return NextResponse.json({
                user: {
                    id: session.userId,
                    role: session.role,
                    employeeId: session.employeeId,
                    companyId: session.companyId
                }
            });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
