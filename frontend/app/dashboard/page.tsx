'use client';

import { useState, useMemo, useCallback } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { AdminView } from './components/AdminView';
import { EmployeeView } from './components/EmployeeView';

type UserRole = 'admin' | 'employee';

export default function DashboardPage() {
  // TODO: Get role from backend/context/auth
  const [userRole] = useState<UserRole>('employee');
  const [checkInStatus, setCheckInStatus] = useState<'in' | 'out'>('out');

  const isAdmin = useMemo(() => userRole === 'admin', [userRole]);

  const handleCheckIn = useCallback(() => {
    setCheckInStatus('in');
  }, []);

  const handleCheckOut = useCallback(() => {
    setCheckInStatus('out');
  }, []);

  return (
    <div className="min-h-screen bg-[#030712]">
      <NavigationBar
        isAdmin={isAdmin}
        checkInStatus={checkInStatus}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
      />

      <div className="container mx-auto px-6 py-8">
        {isAdmin ? <AdminView /> : <EmployeeView />}
      </div>
    </div>
  );
}
