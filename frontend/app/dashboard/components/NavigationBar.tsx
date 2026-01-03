'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Bell, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationBarProps {
  isAdmin: boolean;
  checkInStatus: 'in' | 'out';
  onCheckIn: () => void;
  onCheckOut: () => void;
}

const navItems = [
  { label: 'Employees', href: '/dashboard' },
  { label: 'Attendance', href: '/attendance' },
  { label: 'Time Off', href: '/time-off' },
];

export function NavigationBar({
  isAdmin,
  checkInStatus,
  onCheckIn,
  onCheckOut,
}: NavigationBarProps) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-white/10 bg-white/[0.02] backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">Dayflow</span>
          </Link>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href === '/dashboard' && pathname === '/dashboard');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-all",
                    isActive
                      ? "bg-white text-black"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Check In/Out Button */}
          <Button
            onClick={checkInStatus === 'out' ? onCheckIn : onCheckOut}
            className={cn(
              "relative",
              checkInStatus === 'in'
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            )}
          >
            <div
              className={cn(
                "absolute left-3 w-2 h-2 rounded-full",
                checkInStatus === 'in' ? 'bg-white animate-pulse' : 'bg-white/50'
              )}
            />
            <Clock className="ml-2 mr-2 h-4 w-4" />
            {checkInStatus === 'out' ? 'Check In' : 'Check Out'}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white/70 hover:text-white hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#030712]">
                JD
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[#0f1419] border-white/10 text-white"
            >
              <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer text-rose-400">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
