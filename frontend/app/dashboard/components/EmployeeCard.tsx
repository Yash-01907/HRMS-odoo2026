'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Plane } from 'lucide-react';

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

const StatusIndicator = ({ status }: { status: Employee['status'] }) => {
  switch (status) {
    case 'present':
      return (
        <div className='absolute top-2 right-2 size-3 rounded-full bg-green-500 border-2 border-white' />
      );
    case 'leave':
      return (
        <div className='absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm'>
          <Plane className='size-3 text-blue-500' />
        </div>
      );
    case 'absent':
      return (
        <div className='absolute top-2 right-2 size-3 rounded-full bg-yellow-500 border-2 border-white' />
      );
    default:
      return null;
  }
};

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  return (
    <Card
      className='cursor-pointer hover:shadow-md transition-shadow relative'
      onClick={onClick}
    >
      <StatusIndicator status={employee.status} />
      <CardContent className='flex flex-col items-center justify-center p-6 pt-8'>
        <Avatar className='size-20 mb-4'>
          <AvatarImage src={employee.avatar} alt={employee.name} />
          <AvatarFallback>
            <User className='size-10' />
          </AvatarFallback>
        </Avatar>
        <p className='text-center font-medium text-gray-900'>
          {employee.name}
        </p>
      </CardContent>
    </Card>
  );
}

