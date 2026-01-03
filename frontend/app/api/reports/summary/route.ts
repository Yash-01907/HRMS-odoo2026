import { ReportsController } from "../../_controllers/reportsController";

export async function GET(req: Request) {
    return ReportsController.getSummary(req);
}
