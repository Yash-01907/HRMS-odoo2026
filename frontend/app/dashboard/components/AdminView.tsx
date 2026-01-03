'use client';

import { Button } from '@/components/ui/button';
import { Search, Plus, Settings } from 'lucide-react';
import { EmployeeCard } from './EmployeeCard';

const employees = [
  { id: 1, name: 'John Doe', status: 'present', avatar: '' },
  { id: 2, name: 'Jane Smith', status: 'leave', avatar: '' },
  { id: 3, name: 'Mike Johnson', status: 'absent', avatar: '' },
  { id: 4, name: 'Sarah Williams', status: 'present', avatar: '' },
  { id: 5, name: 'David Brown', status: 'present', avatar: '' },
  { id: 6, name: 'Emily Davis', status: 'leave', avatar: '' },
  { id: 7, name: 'Chris Wilson', status: 'present', avatar: '' },
  { id: 8, name: 'Amy Martinez', status: 'absent', avatar: '' },
  { id: 9, name: 'Ryan Anderson', status: 'present', avatar: '' },
] as const;

export function AdminView() {
  const handleEmployeeClick = (id: number) => {
    console.log(`Opening employee ${id}`);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <Button className="bg-white text-black hover:bg-white/90">
          <Plus className="mr-2 h-4 w-4" />
          NEW
        </Button>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="search"
            placeholder="Search employees..."
            className="w-full h-10 pl-10 pr-4 rounded-lg text-sm text-white placeholder-white/40 bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onClick={() => handleEmployeeClick(employee.id)}
          />
        ))}
      </div>

      <div className="mt-6">
        <a
          href="#"
          className="inline-flex items-center text-sm text-white/50 hover:text-white transition-colors"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </a>
      </div>
    </div>
  );
}
