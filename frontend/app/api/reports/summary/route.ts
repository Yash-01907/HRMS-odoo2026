import { ReportsController } from "../../../../controllers/reportsController";

export async function GET(req: Request) {
    return ReportsController.getSummary(req);
}
