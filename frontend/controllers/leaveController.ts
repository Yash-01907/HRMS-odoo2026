import { NextResponse } from "next/server";
import { LeaveService } from "../services/leaveService";
import { AuthUtils } from "../lib/auth";
import { z } from "zod";

const applySchema = z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    type: z.enum(["PAID", "SICK", "UNPAID"]),
    reason: z.string().min(1),
});

const statusSchema = z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
    comment: z.string().optional(),
});

export class LeaveController {

    static async apply(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const body = await req.json();
            const result = applySchema.safeParse(body);
            if (!result.success) return NextResponse.json({ error: result.error.flatten() }, { status: 400 });

            const leave = await LeaveService.applyLeave(session.userId, result.data);
            return NextResponse.json({ message: "Leave Applied", data: leave });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async updateStatus(req: Request, { params }: { params: Promise<{ id: string }> }) {
        try {
            const session = await AuthUtils.getSession();
            if (!session || (session.role !== "ADMIN" && session.role !== "HR")) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

            const { id } = await params;
            const body = await req.json();
            const result = statusSchema.safeParse(body);
            if (!result.success) return NextResponse.json({ error: result.error.flatten() }, { status: 400 });

            const leave = await LeaveService.updateStatus(Number(id), result.data.status, result.data.comment || "");
            return NextResponse.json({ message: "Status Updated", data: leave });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async getLeaves(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            if (session.role === "ADMIN" || session.role === "HR") {
                return NextResponse.json(await LeaveService.getLeaves());
            }
            return NextResponse.json(await LeaveService.getLeaves(session.userId));

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
