'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
  User,
  Clock,
  Calendar,
  LogOut,
  Bell,
  AlertCircle,
  CheckCircle2,
  CalendarClock,
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
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    href: '/employee/profile',
  },
  {
    id: 'attendance',
    title: 'Attendance',
    description: 'View attendance records',
    icon: Clock,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    href: '/employee/attendance',
  },
  {
    id: 'leave',
    title: 'Leave Requests',
    description: 'Request and manage leaves',
    icon: Calendar,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    href: '/employee/leave',
  },
  {
    id: 'logout',
    title: 'Logout',
    description: 'Sign out of your account',
    icon: LogOut,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    href: '/logout',
    action: 'logout',
  },
] as const;

export function EmployeeView() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Welcome back!
        </h1>
        <p className='text-gray-600'>
          Here&apos;s your dashboard overview and quick actions.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {quickAccessCards.map((card) => (
          <QuickAccessCard
            key={card.id}
            card={card}
            onLogout={handleLogout}
          />
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <RecentActivity />
        <AlertsSection />
      </div>
    </>
  );
}

