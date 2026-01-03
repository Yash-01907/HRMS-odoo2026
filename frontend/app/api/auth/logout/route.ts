import { AuthController } from "../../../../controllers/authController";

export async function POST(req: Request) {
    return AuthController.logout();
}
