import { NextResponse } from "next/server";
import { UserService } from "../services/userService";
import { ValidationUtils } from "../lib/validation";
import { AuthUtils } from "../lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
    address: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().url().optional(),
});

export class UserController {
    static async createEmployee(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session || (session.role !== "ADMIN" && session.role !== "HR")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            const body = await req.json();
            const result = ValidationUtils.createEmployeeSchema.safeParse(body);

            if (!result.success) {
                return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
            }

            const user = await UserService.createEmployee(result.data);

            return NextResponse.json({
                message: "Employee created successfully",
                employeeId: user.employee_id,
                tempPassword: user.tempPassword, // Critical for first login
            });

        } catch (error: any) {
            console.error(error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async getAllEmployees(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session || (session.role !== "ADMIN" && session.role !== "HR")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            const employees = await UserService.getAllEmployees();
            return NextResponse.json(employees);

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async updateProfile(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const body = await req.json();
            const result = updateProfileSchema.safeParse(body);
            if (!result.success) return NextResponse.json({ error: result.error.flatten() }, { status: 400 });

            const updated = await UserService.updateProfile(session.userId, result.data);
            return NextResponse.json({ message: "Profile updated", data: updated });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async getMe(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const user = await UserService.getUserById(session.userId);
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

            return NextResponse.json(user);

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
