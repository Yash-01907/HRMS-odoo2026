"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedBackground } from "./AnimatedBackground";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.documentElement.classList.add("dark");
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
    };

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    return (
        <div className="relative min-h-screen w-full bg-[#030712]">
            {/* Background */}
            <AnimatedBackground />

            {/* Theme Toggle */}
            <motion.button
                onClick={toggleTheme}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="fixed top-6 right-6 z-50 p-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
                {isDark ? (
                    <Sun className="h-4 w-4 text-white/70" />
                ) : (
                    <Moon className="h-4 w-4 text-white/70" />
                )}
            </motion.button>

            {/* Main Layout */}
            <div className="relative z-10 flex min-h-screen">
                {/* Left Panel - Branding (Desktop only) */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold text-white tracking-tight">Dayflow</span>
                        </div>
                    </motion.div>

                    {/* Center Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-md"
                    >
                        <h1 className="text-4xl xl:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
                            Every workday,
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                                perfectly aligned.
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-white/50 leading-relaxed">
                            Streamline your HR operations with a modern platform built for the way teams work today.
                        </p>

                        {/* Stats */}
                        <div className="mt-12 flex gap-12">
                            {[
                                { value: "10k+", label: "Active users" },
                                { value: "99.9%", label: "Uptime" },
                                { value: "50+", label: "Integrations" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                >
                                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                                    <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm text-white/30"
                    >
                        © 2026 Dayflow Inc. All rights reserved.
                    </motion.div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="w-full max-w-[400px]"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
