import { z } from "zod";

export const ValidationUtils = {
    loginSchema: z.object({
        identifier: z.string().min(1, "Email or Employee ID is required"),
        password: z.string().min(1, "Password is required"),
    }),

    createEmployeeSchema: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        joiningDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"), // YYYY-MM-DD
        role: z.enum(["ADMIN", "HR", "EMPLOYEE"]),
        companyName: z.string().min(1, "Company Name is required"), // Match by name
    }),
};
