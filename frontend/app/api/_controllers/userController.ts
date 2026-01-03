import { NextResponse } from "next/server";
import { UserService } from "../_services/userService";
import { AuthUtils } from "../_lib/auth-utils";

export class UserController {
  static async getMe(req: Request) {
    try {
      // Authorization Check
      const session = await AuthUtils.getSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const userId = session.userId as number;
      const profile = await UserService.getProfile(userId);

      if (!profile) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ user: profile });
    } catch (error: any) {
      console.error("GetMe Error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
