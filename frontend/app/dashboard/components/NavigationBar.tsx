"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, LogOut, Bell, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ActiveTab = "employees" | "attendance" | "timeoff";

interface NavigationBarProps {
  isAdmin: boolean;
  checkInStatus: "in" | "out";
  onCheckIn: () => void;
  onCheckOut: () => void;
  activeTab?: ActiveTab;
  onTabChange?: (tab: ActiveTab) => void;
}

export function NavigationBar({
  isAdmin,
  checkInStatus,
  onCheckIn,
  onCheckOut,
  activeTab = "employees",
  onTabChange,
}: NavigationBarProps) {
  const handleTabChange = (value: string) => {
    // Navigate to appropriate page based on tab
    if (value === "employees") {
      window.location.href = "/dashboard";
    } else if (value === "attendance") {
      window.location.href = "/attendance";
    } else if (value === "timeoff") {
      // If we're already on dashboard, just change the tab state
      if (onTabChange) {
        onTabChange(value as ActiveTab);
      } else {
        // Navigate to dashboard with timeoff tab
        window.location.href = "/dashboard?tab=timeoff";
      }
    }
  };

  return (
    <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white">Dayflow</span>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-auto"
          >
            <TabsList className="bg-white/5 border border-white/10">
              {isAdmin && (
                <TabsTrigger
                  value="employees"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                >
                  Employees
                </TabsTrigger>
              )}
              <TabsTrigger
                value="attendance"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
              >
                Attendance
              </TabsTrigger>
              <TabsTrigger
                value="timeoff"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
              >
                Time Off
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={checkInStatus === "out" ? onCheckIn : onCheckOut}
            variant={checkInStatus === "in" ? "outline" : "default"}
            className="relative pl-8 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 border-0"
          >
            <div
              className={`absolute left-2 size-2 rounded-full border-2 border-white ${
                checkInStatus === "in" ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            <CheckCircle2 className="mr-2 size-4" />
            {checkInStatus === "out" ? "Check IN →" : "Check OUT →"}
          </Button>

          {!isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-white/10 text-white/70 hover:text-white"
            >
              <Bell className="size-5" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-rose-500" />
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-blue-500/50">
                <Avatar className="size-10 cursor-pointer border border-white/20">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                    <User className="size-5" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white/10 backdrop-blur-md border border-white/20"
            >
              <DropdownMenuItem
                className="text-white focus:bg-white/10 focus:text-white cursor-pointer"
                onClick={() => (window.location.href = "/profile/1")}
              >
                <User className="mr-2 size-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="text-white focus:bg-white/10 focus:text-white cursor-pointer text-rose-400"
                onClick={() => (window.location.href = "/")}
              >
                <LogOut className="mr-2 size-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
