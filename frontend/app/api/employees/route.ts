import { UserController } from "../../../controllers/userController";

export async function POST(req: Request) {
    return UserController.createEmployee(req);
}

export async function GET(req: Request) {
    return UserController.getAllEmployees(req);
}
