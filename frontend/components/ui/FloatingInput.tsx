"use client";

import { forwardRef, InputHTMLAttributes, useState, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className, id, type, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className="space-y-2">
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-white/70"
                >
                    {label}
                </label>
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        type={type}
                        className={cn(
                            "w-full h-11 px-3 rounded-lg text-sm text-white placeholder-white/30",
                            "bg-white/5 border border-white/10",
                            "transition-all duration-200",
                            "focus:outline-none focus:border-white/30 focus:bg-white/[0.07]",
                            error && "border-red-500/50 focus:border-red-500/50",
                            icon && "pl-10",
                            className
                        )}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : undefined}
                        {...props}
                    />
                </div>
                {error && (
                    <p id={`${inputId}-error`} className="text-sm text-red-400" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
