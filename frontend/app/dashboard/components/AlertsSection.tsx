'use client';

import { AlertCircle, CheckCircle2, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';

const alerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Leave balance low',
    description: 'You have 2 days remaining',
    icon: AlertCircle,
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 2,
    type: 'success',
    title: 'Timesheet approved',
    description: 'December timesheet approved',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 3,
    type: 'info',
    title: 'Upcoming holiday',
    description: 'Office closed on Jan 1st',
    icon: CalendarClock,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
];

export function AlertsSection() {
  return (
    <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
      <h2 className="text-lg font-semibold text-white mb-4">Alerts & Reminders</h2>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/5"
            >
              <div className={cn("p-2 rounded-lg", alert.bgColor)}>
                <Icon className={cn("h-4 w-4", alert.iconColor)} />
              </div>
              <div>
                <p className="text-white font-medium">{alert.title}</p>
                <p className="text-white/50 text-sm">{alert.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
