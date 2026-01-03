"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonState = "idle" | "loading" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    state?: ButtonState;
    icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", state = "idle", icon, className, children, disabled, ...props }, ref) => {
        const isDisabled = disabled || state === "loading";

        const variants = {
            primary: "bg-white text-black hover:bg-white/90",
            secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
            ghost: "text-white/70 hover:text-white hover:bg-white/5",
        };

        return (
            <motion.button
                ref={ref}
                whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                className={cn(
                    "relative h-11 px-6 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2",
                    variants[variant],
                    isDisabled && "opacity-50 cursor-not-allowed",
                    className
                )}
                disabled={isDisabled}
                {...props}
            >
                <AnimatePresence mode="wait">
                    {state === "loading" && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </motion.div>
                    )}
                    {state === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-emerald-500 rounded-lg"
                        >
                            <Check className="h-4 w-4 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <span className={cn("flex items-center gap-2", state !== "idle" && "opacity-0")}>
                    {icon}
                    {children}
                </span>
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonState };
