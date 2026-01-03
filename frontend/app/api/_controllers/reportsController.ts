import { NextResponse } from "next/server";
import { ReportsService } from "../_services/reportsService";
import { AuthUtils } from "../_lib/auth-utils";

export class ReportsController {
    static async getSummary(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session || (session.role !== "ADMIN" && session.role !== "HR")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            const { searchParams } = new URL(req.url);
            const date = searchParams.get("date") || undefined;
            const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);

            const [attendance, leaves, payroll, stats] = await Promise.all([
                ReportsService.getAttendanceSummary(date),
                ReportsService.getLeaveSummary(),
                ReportsService.getPayrollSummary(month),
                ReportsService.getDashboardStats(),
            ]);

            return NextResponse.json({
                attendance,
                leaves,
                payroll,
                stats
            });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
