import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod"
);

export const AuthUtils = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  async createSession(payload: any) {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(SECRET);

    // Set HTTP-only cookie
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return token;
  },

  async getSession() {
    const token = (await cookies()).get("session")?.value;
    if (!token) return null;

    try {
      const { payload } = await jwtVerify(token, SECRET);
      return payload;
    } catch (e) {
      return null;
    }
  },

  async clearSession() {
    (await cookies()).set("session", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
  },
};
