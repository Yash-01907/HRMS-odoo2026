'use client';

import { useState, useMemo, useCallback } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { AdminView } from './components/AdminView';
import { EmployeeView } from './components/EmployeeView';
import { TimeOffView } from './components/TimeOffView';

type UserRole = 'admin' | 'employee';
type ActiveTab = 'employees' | 'attendance' | 'timeoff';

export default function DashboardPage() {
  // TODO: Get role from backend/context/auth
  const [userRole] = useState<UserRole>('admin');
  const [checkInStatus, setCheckInStatus] = useState<'in' | 'out'>('out');
  const [activeTab, setActiveTab] = useState<ActiveTab>('employees');

  const isAdmin = useMemo(() => userRole === 'admin', [userRole]);

  const handleCheckIn = useCallback(() => {
    setCheckInStatus('in');
  }, []);

  const handleCheckOut = useCallback(() => {
    setCheckInStatus('out');
  }, []);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
  }, []);

  const renderContent = () => {
    if (!isAdmin) {
      return <EmployeeView />;
    }

    switch (activeTab) {
      case 'timeoff':
        return <TimeOffView />;
      case 'attendance':
        return (
          <div className='text-center py-12'>
            <p className='text-gray-500'>Attendance view coming soon...</p>
          </div>
        );
      case 'employees':
      default:
        return <AdminView />;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <NavigationBar
        isAdmin={isAdmin}
        checkInStatus={checkInStatus}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className='container mx-auto px-6 py-6'>
        {renderContent()}
      </div>
    </div>
  );
}
