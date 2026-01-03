"use client";

import { cn } from "@/lib/utils";

type Role = "employee" | "hr";

interface RoleSelectorProps {
    value: Role;
    onChange: (role: Role) => void;
}

const roles = [
    { id: "employee" as Role, label: "Employee" },
    { id: "hr" as Role, label: "HR Officer" },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">
                Sign in as
            </label>
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                {roles.map((role) => {
                    const isSelected = value === role.id;
                    return (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => onChange(role.id)}
                            className={cn(
                                "flex-1 h-9 rounded-md text-sm font-medium transition-all duration-200",
                                isSelected
                                    ? "bg-white text-black"
                                    : "text-white/50 hover:text-white/70"
                            )}
                            aria-pressed={isSelected}
                        >
                            {role.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
