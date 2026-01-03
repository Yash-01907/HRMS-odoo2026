import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "strict_secret_for_evaluation"
);

export interface SessionPayload {
    userId: number;
    role: "ADMIN" | "HR" | "EMPLOYEE";
    employeeId: string;
    companyId: number;
    [key: string]: any;
}

export const AuthUtils = {
    async createSession(payload: SessionPayload) {
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("8h")
            .sign(SECRET);

        (await cookies()).set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 8 * 60 * 60,
        });
        return token;
    },

    async getSession(): Promise<SessionPayload | null> {
        const token = (await cookies()).get("session")?.value;
        if (!token) return null;
        try {
            const { payload } = await jwtVerify(token, SECRET);
            return payload as unknown as SessionPayload;
        } catch {
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
