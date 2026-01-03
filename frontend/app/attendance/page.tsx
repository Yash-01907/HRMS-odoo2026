'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationBar } from '@/app/dashboard/components/NavigationBar';
import { cn } from '@/lib/utils';

// Types
type UserRole = 'admin' | 'employee';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
  employeeName?: string;
  employeeId?: string;
}

interface AttendanceStats {
  daysPresent: number;
  leavesCount: number;
  totalWorkingDays: number;
}

// Mock data
const mockEmployeeAttendance: AttendanceRecord[] = [
  { id: '1', date: '2025-10-28', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  { id: '2', date: '2025-10-29', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
  { id: '3', date: '2025-10-30', checkIn: '09:30', checkOut: '18:30', workHours: '09:00', extraHours: '01:00' },
  { id: '4', date: '2025-10-31', checkIn: '10:15', checkOut: '19:30', workHours: '09:15', extraHours: '01:15' },
  { id: '5', date: '2025-11-01', checkIn: '10:00', checkOut: '18:00', workHours: '08:00', extraHours: '00:00' },
];

const mockAdminAttendance: AttendanceRecord[] = [
  { id: '1', date: '2025-10-22', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00', employeeName: 'John Doe', employeeId: 'EMP001' },
  { id: '2', date: '2025-10-22', checkIn: '09:30', checkOut: '18:30', workHours: '09:00', extraHours: '01:00', employeeName: 'Jane Smith', employeeId: 'EMP002' },
  { id: '3', date: '2025-10-22', checkIn: '10:30', checkOut: '19:30', workHours: '09:00', extraHours: '01:00', employeeName: 'Mike Johnson', employeeId: 'EMP003' },
  { id: '4', date: '2025-10-22', checkIn: '09:00', checkOut: '18:00', workHours: '09:00', extraHours: '01:00', employeeName: 'Sarah Williams', employeeId: 'EMP004' },
];

const mockStats: AttendanceStats = {
  daysPresent: 22,
  leavesCount: 2,
  totalWorkingDays: 24,
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Components
function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-4 px-5 py-4 rounded-xl border transition-all",
      accent 
        ? "bg-gradient-to-br from-blue-500/10 to-violet-500/10 border-blue-500/20" 
        : "bg-white/[0.02] border-white/10 hover:border-white/20"
    )}>
      <div className={cn(
        "p-2.5 rounded-lg",
        accent ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/60"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-white">{value}</p>
        <p className="text-sm text-white/50">{label}</p>
      </div>
    </div>
  );
}

function MonthSelector({ 
  month, 
  year, 
  onPrev, 
  onNext 
}: { 
  month: number; 
  year: number; 
  onPrev: () => void; 
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrev}
        className="h-9 w-9 bg-white/5 border-white/10 hover:bg-white/10 text-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg min-w-[160px] justify-center">
        <Calendar className="h-4 w-4 text-white/50" />
        <span className="text-white font-medium">{months[month]} {year}</span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        className="h-9 w-9 bg-white/5 border-white/10 hover:bg-white/10 text-white"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function AttendanceTable({ records, showEmployee = false }: { records: AttendanceRecord[]; showEmployee?: boolean }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            {showEmployee && (
              <th className="text-left py-4 px-5 text-sm font-medium text-white/70">Employee</th>
            )}
            <th className="text-left py-4 px-5 text-sm font-medium text-white/70">Date</th>
            <th className="text-left py-4 px-5 text-sm font-medium text-white/70">Check In</th>
            <th className="text-left py-4 px-5 text-sm font-medium text-white/70">Check Out</th>
            <th className="text-left py-4 px-5 text-sm font-medium text-white/70">Work Hours</th>
            <th className="text-left py-4 px-5 text-sm font-medium text-white/70">Extra Hours</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr 
              key={record.id} 
              className={cn(
                "border-b border-white/5 hover:bg-white/[0.03] transition-colors",
                index === records.length - 1 && "border-b-0"
              )}
            >
              {showEmployee && (
                <td className="py-4 px-5">
                  <div>
                    <p className="text-white font-medium">{record.employeeName}</p>
                    <p className="text-white/40 text-sm">{record.employeeId}</p>
                  </div>
                </td>
              )}
              <td className="py-4 px-5 text-white">{formatDate(record.date)}</td>
              <td className="py-4 px-5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                  {record.checkIn}
                </span>
              </td>
              <td className="py-4 px-5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 text-sm font-medium">
                  {record.checkOut}
                </span>
              </td>
              <td className="py-4 px-5 text-white font-medium">{record.workHours}</td>
              <td className="py-4 px-5">
                <span className={cn(
                  "text-sm font-medium",
                  record.extraHours !== '00:00' ? "text-blue-400" : "text-white/40"
                )}>
                  {record.extraHours !== '00:00' ? `+${record.extraHours}` : '-'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search employee..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-64 h-10 pl-10 pr-4 rounded-lg text-sm text-white placeholder-white/40 bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
      />
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}

// Main Page Component
export default function AttendancePage() {
  // TODO: Get role from auth context
  const [userRole] = useState<UserRole>('employee');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 22)); // October 2025
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInStatus, setCheckInStatus] = useState<'in' | 'out'>('out');

  const isAdmin = userRole === 'admin';

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const filteredAdminRecords = useMemo(() => {
    if (!searchQuery) return mockAdminAttendance;
    return mockAdminAttendance.filter(r => 
      r.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Use shared NavigationBar */}
      <NavigationBar
        isAdmin={isAdmin}
        checkInStatus={checkInStatus}
        onCheckIn={() => setCheckInStatus('in')}
        onCheckOut={() => setCheckInStatus('out')}
        activeTab="attendance"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Attendance</h1>
            <p className="text-white/50 mt-1">
              {isAdmin 
                ? "View and manage employee attendance records" 
                : "Track your attendance and working hours"}
            </p>
          </div>
          <MonthSelector 
            month={currentDate.getMonth()} 
            year={currentDate.getFullYear()}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
          />
        </div>

        {/* Stats (Employee View Only) */}
        {!isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard 
              icon={Calendar} 
              label="Days Present" 
              value={mockStats.daysPresent} 
              accent 
            />
            <StatCard 
              icon={TrendingUp} 
              label="Leaves Taken" 
              value={mockStats.leavesCount} 
            />
            <StatCard 
              icon={Clock} 
              label="Total Working Days" 
              value={mockStats.totalWorkingDays} 
            />
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Users className="h-4 w-4" />
                <span>{filteredAdminRecords.length} employees</span>
              </div>
            </div>
            <p className="text-white/60">
              Showing attendance for <span className="text-white font-medium">October 22, 2025</span>
            </p>
          </div>
        )}

        {/* Table */}
        <AttendanceTable 
          records={isAdmin ? filteredAdminRecords : mockEmployeeAttendance} 
          showEmployee={isAdmin}
        />

        {/* Footer Info */}
        <div className="mt-6 flex items-center justify-between text-sm text-white/40">
          <p>
            {isAdmin 
              ? "Attendance data is updated in real-time" 
              : "Your attendance is recorded automatically when you check in/out"}
          </p>
          <p>Last updated: Just now</p>
        </div>
      </main>
    </div>
  );
}
