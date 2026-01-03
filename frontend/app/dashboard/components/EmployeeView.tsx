'use client';

import Link from 'next/link';
import {
  User,
  Clock,
  Calendar,
  LogOut,
} from 'lucide-react';
import { QuickAccessCard } from './QuickAccessCard';
import { RecentActivity } from './RecentActivity';
import { AlertsSection } from './AlertsSection';

const quickAccessCards = [
  {
    id: 'profile',
    title: 'Profile',
    description: 'View and update your profile',
    icon: User,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    href: '/profile/1',
  },
  {
    id: 'attendance',
    title: 'Attendance',
    description: 'View attendance records',
    icon: Clock,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    href: '/attendance',
  },
  {
    id: 'leave',
    title: 'Leave Requests',
    description: 'Request and manage leaves',
    icon: Calendar,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    href: '/time-off',
  },
  {
    id: 'logout',
    title: 'Logout',
    description: 'Sign out of your account',
    icon: LogOut,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    href: '/',
    action: 'logout',
  },
] as const;

export function EmployeeView() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back!
        </h1>
        <p className="text-white/60">
          Here&apos;s your dashboard overview and quick actions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickAccessCards.map((card) => (
          <QuickAccessCard
            key={card.id}
            card={card}
            onLogout={handleLogout}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <AlertsSection />
      </div>
    </>
  );
}
