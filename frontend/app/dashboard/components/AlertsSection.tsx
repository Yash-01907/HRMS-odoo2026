'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';

const alerts = [
  {
    type: 'warning' as const,
    title: 'Action Required',
    message: 'Please submit your timesheet for the previous week by Friday.',
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    messageColor: 'text-yellow-700',
  },
  {
    type: 'info' as const,
    title: 'Upcoming Leave',
    message: 'Your leave request for Dec 25-27 is pending approval.',
    icon: Calendar,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    messageColor: 'text-blue-700',
  },
  {
    type: 'success' as const,
    title: 'All Set',
    message: 'Your profile is up to date. No action needed.',
    icon: CheckCircle2,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    messageColor: 'text-green-700',
  },
];

export function AlertsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bell className='size-5' />
          Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div
                key={index}
                className={`p-4 ${alert.bgColor} border ${alert.borderColor} rounded-lg`}
              >
                <div className='flex items-start gap-3'>
                  <Icon className={`size-5 ${alert.iconColor} mt-0.5`} />
                  <div>
                    <p className={`text-sm font-medium ${alert.titleColor}`}>
                      {alert.title}
                    </p>
                    <p className={`text-sm ${alert.messageColor} mt-1`}>
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

