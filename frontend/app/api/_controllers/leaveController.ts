import { NextResponse } from "next/server";
import { LeaveService } from "../_services/leaveService";
import { AuthUtils } from "../_lib/auth-utils";
import { z } from "zod";

const applyLeaveSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    type: z.enum(["PAID", "SICK", "UNPAID"]),
    reason: z.string().min(1),
});

const updateStatusSchema = z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
    comment: z.string().optional(),
});

export class LeaveController {
    static async apply(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const body = await req.json();
            const result = applyLeaveSchema.safeParse(body);
            if (!result.success) {
                return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
            }

            const leave = await LeaveService.applyLeave(session.userId as number, result.data);
            return NextResponse.json({ message: "Leave applied successfully", data: leave });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async updateStatus(req: Request, { params }: { params: Promise<{ id: string }> }) {
        try {
            const session = await AuthUtils.getSession();
            if (!session || (session.role !== "ADMIN" && session.role !== "HR")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            const { id } = await params;
            const body = await req.json();
            const result = updateStatusSchema.safeParse(body);
            if (!result.success) {
                return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
            }

            const leave = await LeaveService.updateStatus(
                Number(id),
                result.data.status,
                result.data.comment || ""
            );

            if (!leave) {
                return NextResponse.json({ error: "Leave not found" }, { status: 404 });
            }

            return NextResponse.json({ message: "Leave status updated", data: leave });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async getLeaves(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            // Admin/HR sees all, Employee sees own
            if (session.role === "ADMIN" || session.role === "HR") {
                // Could add filters via searchParams
                const leaves = await LeaveService.getLeaves();
                return NextResponse.json(leaves);
            }

            const leaves = await LeaveService.getLeaves(session.userId as number);
            return NextResponse.json(leaves);

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
