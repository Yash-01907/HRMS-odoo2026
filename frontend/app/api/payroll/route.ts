import { PayrollController } from "../../../controllers/payrollController";

export async function GET(req: Request) {
    return PayrollController.getPayroll(req);
}
