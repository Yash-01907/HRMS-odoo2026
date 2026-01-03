import { z } from "zod";

export const ValidationUtils = {
    loginSchema: z.object({
        employeeId: z.string().min(1, "Employee ID is required"),
        email: z.string().email("Invalid email"),
        password: z.string().min(1, "Password is required"),
    }),

    createEmployeeSchema: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        joiningDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"), // YYYY-MM-DD
        role: z.enum(["ADMIN", "HR", "EMPLOYEE"]),
        companyId: z.number().optional(), // In multi-tenant, mandatory
    }),
};
