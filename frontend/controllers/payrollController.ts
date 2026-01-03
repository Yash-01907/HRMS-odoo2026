import { NextResponse } from "next/server";
import { PayrollService } from "../services/payrollService";
import { AuthUtils } from "../lib/auth";
import { z } from "zod";

const structureSchema = z.object({
    basic: z.number().min(0),
    hra: z.number().min(0),
    standardAllowance: z.number().min(0),
    performanceBonus: z.number().min(0),
    lta: z.number().min(0),
    pf: z.number().min(0),
    profTax: z.number().min(0),
    otherDeductions: z.number().min(0),
});

const generateSchema = z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM"),
});

export class PayrollController {

    static async updateStructure(req: Request, { params }: { params: Promise<{ userId: string }> }) {
        try {
            const session = await AuthUtils.getSession();
            if (!session || (session.role !== "ADMIN" && session.role !== "HR")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            const { userId } = await params;
            const body = await req.json();
            const result = structureSchema.safeParse(body);

            if (!result.success) {
                return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
            }

            const struct = await PayrollService.upsertSalaryStructure(Number(userId), result.data);
            return NextResponse.json({ message: "Structure updated", data: struct });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async getStructure(req: Request, { params }: { params: Promise<{ userId: string }> }) {
        try {
            const session = await AuthUtils.getSession();
            if (!session || (session.role !== "ADMIN" && session.role !== "HR")) {
                // Technically employees can see their own, but this is an admin "Manage Structure" endpoint
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            const { userId } = await params;
            const struct = await PayrollService.getSalaryStructure(Number(userId));
            return NextResponse.json(struct || { message: "No structure defined" });

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
            const result = generateSchema.safeParse(body);
            if (!result.success) return NextResponse.json({ error: "Invalid month format" }, { status: 400 });

            const records = await PayrollService.generatePayroll(result.data.month);
            return NextResponse.json({ message: "Payroll Generated", count: records.length, data: records });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async getPayroll(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const { searchParams } = new URL(req.url);
            const month = searchParams.get("month") || undefined;

            if (session.role === "ADMIN" || session.role === "HR") {
                const records = await PayrollService.getPayroll(undefined, month);
                return NextResponse.json(records);
            }

            // Employee View
            const records = await PayrollService.getPayroll(session.userId, month);
            return NextResponse.json(records);

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
