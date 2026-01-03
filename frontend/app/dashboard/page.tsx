'use client';

import { useState, useMemo, useCallback } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { AdminView } from './components/AdminView';
import { EmployeeView } from './components/EmployeeView';
import { TimeOffView } from './components/TimeOffView';
import { redirect } from 'next/navigation';

type UserRole = 'admin' | 'employee';
type ActiveTab = 'employees' | 'attendance' | 'timeoff';

export default function DashboardPage() {
  // TODO: Get role from backend/context/auth
  const [userRole] = useState<UserRole>('admin');
  const [checkInStatus, setCheckInStatus] = useState<'in' | 'out'>('out');

  const isAdmin = useMemo(() => userRole === 'admin', [userRole]);

  const [activeTab, setActiveTab] = useState<ActiveTab>(() =>
    userRole === 'admin' ? 'employees' : 'attendance'
  );

  const handleCheckIn = useCallback(() => {
    setCheckInStatus('in');
  }, []);

  const handleCheckOut = useCallback(() => {
    setCheckInStatus('out');
  }, []);

  const handleTabChange = useCallback(
    (tab: ActiveTab) => {
      // Prevent employees from accessing employees tab
      if (!isAdmin && tab === 'employees') {
        return;
      }
      setActiveTab(tab);
    },
    [isAdmin]
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'timeoff':
        return <TimeOffView isAdmin={isAdmin} />;
      case 'attendance':
        redirect('/attendance');
      case 'employees':
      default:
        if (!isAdmin) {
          return <EmployeeView />;
        }
        return <AdminView />;
    }
  };

  return (
    <div className='min-h-screen'>
      <NavigationBar
        isAdmin={isAdmin}
        checkInStatus={checkInStatus}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className='container mx-auto px-6 py-6'>{renderContent()}</div>
    </div>
  );
}
