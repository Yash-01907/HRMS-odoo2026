'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  showSalaryInfo?: boolean;
  isEmployee?: boolean;
}

export function ProfileTabs({
  activeTab,
  onTabChange,
  showSalaryInfo = false,
  isEmployee = false,
}: ProfileTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className='mt-6'>
      <TabsList>
        <TabsTrigger value='resume'>Resume</TabsTrigger>
        <TabsTrigger value='private-info'>Private Info</TabsTrigger>
        {showSalaryInfo && (
          <TabsTrigger value='salary-info'>Salary Info</TabsTrigger>
        )}
        {isEmployee && <TabsTrigger value='security'>Security</TabsTrigger>}
      </TabsList>
    </Tabs>
  );
}
