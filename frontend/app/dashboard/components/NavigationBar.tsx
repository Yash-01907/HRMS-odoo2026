'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, LogOut, Bell, CheckCircle2 } from 'lucide-react';

type ActiveTab = 'employees' | 'attendance' | 'timeoff';

interface NavigationBarProps {
  isAdmin: boolean;
  checkInStatus: 'in' | 'out';
  onCheckIn: () => void;
  onCheckOut: () => void;
  activeTab?: ActiveTab;
  onTabChange?: (tab: ActiveTab) => void;
}

export function NavigationBar({
  isAdmin,
  checkInStatus,
  onCheckIn,
  onCheckOut,
  activeTab = 'employees',
  onTabChange,
}: NavigationBarProps) {
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value as ActiveTab);
    }
  };

  return (
    <nav className='bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-8'>
          <div className='text-xl font-bold text-gray-900'>Company Logo</div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className='w-auto'>
            <TabsList>
              {isAdmin && <TabsTrigger value='employees'>Employees</TabsTrigger>}
              <TabsTrigger value='attendance'>Attendance</TabsTrigger>
              <TabsTrigger value='timeoff'>Time Off</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className='flex items-center gap-4'>
          <Button
            onClick={checkInStatus === 'out' ? onCheckIn : onCheckOut}
            variant={checkInStatus === 'in' ? 'outline' : 'default'}
            className='relative pl-8'
          >
            <div
              className={`absolute left-2 size-2 rounded-full border-2 border-white ${
                checkInStatus === 'in' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <CheckCircle2 className='mr-2 size-4' />
            {checkInStatus === 'out' ? 'Check IN →' : 'Check OUT →'}
          </Button>

          {!isAdmin && (
            <Button variant='ghost' size='icon' className='relative'>
              <Bell className='size-5' />
              <span className='absolute top-1 right-1 size-2 rounded-full bg-red-500' />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
                <Avatar className='size-10 cursor-pointer'>
                  <AvatarImage src='' alt='User' />
                  <AvatarFallback>
                    <User className='size-5' />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem>
                <User className='mr-2 size-4' />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className='mr-2 size-4' />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
