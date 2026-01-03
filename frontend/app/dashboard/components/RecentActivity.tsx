'use client';

import { Clock, Calendar, FileCheck } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'checkin',
    title: 'Checked in',
    time: '9:00 AM',
    date: 'Today',
    icon: Clock,
  },
  {
    id: 2,
    type: 'leave',
    title: 'Leave approved',
    time: '2:30 PM',
    date: 'Yesterday',
    icon: Calendar,
  },
  {
    id: 3,
    type: 'document',
    title: 'Document submitted',
    time: '11:00 AM',
    date: 'Dec 28',
    icon: FileCheck,
  },
];

export function RecentActivity() {
  return (
    <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/5">
                <Icon className="h-4 w-4 text-white/60" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.title}</p>
                <p className="text-white/50 text-sm">{activity.time} • {activity.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
