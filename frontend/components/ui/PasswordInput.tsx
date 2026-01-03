"use client";

import { forwardRef, InputHTMLAttributes, useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    error?: string;
    showStrength?: boolean;
}

type StrengthLevel = "weak" | "medium" | "strong";

function getPasswordStrength(password: string): { level: StrengthLevel; width: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { level: "weak", width: "33%", color: "bg-red-500" };
    if (score <= 3) return { level: "medium", width: "66%", color: "bg-yellow-500" };
    return { level: "strong", width: "100%", color: "bg-emerald-500" };
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label = "Password", error, showStrength = false, className, id, onChange, ...props }, ref) => {
        const [isVisible, setIsVisible] = useState(false);
        const [value, setValue] = useState("");
        const generatedId = useId();
        const inputId = id || generatedId;

        const strength = getPasswordStrength(value);

        return (
            <div className="space-y-2">
                <label htmlFor={inputId} className="block text-sm font-medium text-white/70">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        type={isVisible ? "text" : "password"}
                        className={cn(
                            "w-full h-11 px-3 pr-10 rounded-lg text-sm text-white placeholder-white/30",
                            "bg-white/5 border border-white/10",
                            "transition-all duration-200",
                            "focus:outline-none focus:border-white/30 focus:bg-white/[0.07]",
                            error && "border-red-500/50",
                            className
                        )}
                        onChange={(e) => {
                            setValue(e.target.value);
                            onChange?.(e);
                        }}
                        aria-invalid={!!error}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors"
                        aria-label={isVisible ? "Hide password" : "Show password"}
                    >
                        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>

                {/* Password strength bar */}
                {showStrength && value && (
                    <div className="space-y-1.5">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-300", strength.color)}
                                style={{ width: strength.width }}
                            />
                        </div>
                        <p className="text-xs text-white/40 capitalize">{strength.level} password</p>
                    </div>
                )}

                {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
