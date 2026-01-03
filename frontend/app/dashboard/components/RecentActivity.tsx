'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: LucideIcon;
  color: string;
  status?: 'pending' | 'approved';
}

const recentActivities: Activity[] = [
  {
    id: 1,
    type: 'attendance',
    message: 'Checked in at 9:15 AM',
    time: '2 hours ago',
    icon: CheckCircle2,
    color: 'text-green-500',
  },
  {
    id: 2,
    type: 'leave',
    message: 'Leave request submitted for Dec 25-27',
    time: '1 day ago',
    icon: Calendar,
    color: 'text-blue-500',
    status: 'pending',
  },
  {
    id: 3,
    type: 'alert',
    message: 'Reminder: Submit timesheet for this week',
    time: '2 days ago',
    icon: AlertCircle,
    color: 'text-yellow-500',
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <CalendarClock className='size-5' />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className='flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0'
              >
                <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
                  <Icon className='size-4' />
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-900'>
                    {activity.message}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>{activity.time}</p>
                  {activity.status && (
                    <span
                      className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
                        activity.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

