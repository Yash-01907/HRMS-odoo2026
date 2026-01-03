import { NextResponse } from "next/server";
import { PayrollService } from "../_services/payrollService";
import { AuthUtils } from "../_lib/auth-utils";
import { z } from "zod";

const salaryStructureSchema = z.object({
    basicSalary: z.number().min(0),
    allowances: z.number().min(0),
    deductions: z.number().min(0),
});

const generatePayrollSchema = z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM
});

export class PayrollController {

    static async getPayroll(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const { searchParams } = new URL(req.url);
            const month = searchParams.get("month") || undefined;
            const userIdParam = searchParams.get("userId");

            if (session.role === "ADMIN" || session.role === "HR") {
                if (userIdParam) {
                    const records = await PayrollService.getPayrollRecords(Number(userIdParam), month);
                    return NextResponse.json(records);
                }
                const records = await PayrollService.getPayrollRecords(undefined, month);
                return NextResponse.json(records);
            }

            // Employee sees own
            const records = await PayrollService.getPayrollRecords(session.userId as number, month);
            return NextResponse.json(records);

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async generate(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session || (session.role !== "ADMIN" && session.role !== "HR")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            const body = await req.json();
            const result = generatePayrollSchema.safeParse(body);
            if (!result.success) {
                return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
            }

            const records = await PayrollService.generatePayroll(result.data.month);
            return NextResponse.json({ message: "Payroll generated", count: records.length, data: records });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async updateStructure(req: Request, { params }: { params: Promise<{ userId: string }> }) {
        try {
            const session = await AuthUtils.getSession();
            if (!session || (session.role !== "ADMIN" && session.role !== "HR")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            const { userId } = await params;
            const body = await req.json();
            const result = salaryStructureSchema.safeParse(body);
            if (!result.success) {
                return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
            }

            const structure = await PayrollService.updateSalaryStructure(Number(userId), result.data);
            return NextResponse.json({ message: "Salary structure updated", data: structure });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async getStructure(req: Request, { params }: { params: Promise<{ userId: string }> }) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const { userId } = await params;
            const id = Number(userId);

            // Users can see their own structure? Requirement says "Read-only salary & payroll view".
            // Assuming users can see their own salary structure.
            if (session.role !== "ADMIN" && session.role !== "HR" && session.userId !== id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }

            const structure = await PayrollService.getSalaryStructure(id);
            return NextResponse.json(structure || { message: "No structure found" });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
