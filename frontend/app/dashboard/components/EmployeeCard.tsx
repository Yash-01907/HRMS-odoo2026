'use client';

import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  status: 'present' | 'leave' | 'absent';
  avatar: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
}

const statusConfig = {
  present: { label: 'Present', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  leave: { label: 'On Leave', color: 'bg-amber-500', textColor: 'text-amber-400' },
  absent: { label: 'Absent', color: 'bg-rose-500', textColor: 'text-rose-400' },
};

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const status = statusConfig[employee.status];

  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all text-left flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-medium text-sm">
        {employee.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{employee.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className={cn("w-2 h-2 rounded-full", status.color)} />
          <span className={cn("text-sm", status.textColor)}>{status.label}</span>
        </div>
      </div>
    </button>
  );
}
