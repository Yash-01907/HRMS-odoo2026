import { UserController } from "../../../../controllers/userController";

export async function PUT(req: Request) {
    return UserController.updateProfile(req);
}
