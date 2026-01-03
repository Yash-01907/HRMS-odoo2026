import { NextResponse } from "next/server";
import { ReportsService } from "../services/reportsService";
import { AuthUtils } from "../lib/auth";

export class ReportsController {
    static async getSummary(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session || (session.role !== "ADMIN" && session.role !== "HR")) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

            const data = await ReportsService.getSummary();
            return NextResponse.json(data);

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
