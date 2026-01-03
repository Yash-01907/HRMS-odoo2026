"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationBar } from "@/app/dashboard/components/NavigationBar";
import { cn } from "@/lib/utils";

// Types
type UserRole = "ADMIN" | "HR" | "EMPLOYEE";

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

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Helper to format time from ISO/Date string to HH:MM
const formatTime = (dateStr?: string) => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (e) {
    return "-";
  }
};

// Helper to calculate duration between two times
const calculateDuration = (startStr?: string, endStr?: string) => {
  if (!startStr || !endStr) return "-";
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return "-";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  } catch (e) {
    return "-";
  }
};

// Components
function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4 rounded-xl border transition-all",
        accent
          ? "bg-gradient-to-br from-blue-500/10 to-violet-500/10 border-blue-500/20"
          : "bg-white/[0.02] border-white/10 hover:border-white/20"
      )}
    >
      <div
        className={cn(
          "p-2.5 rounded-lg",
          accent ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/60"
        )}
      >
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
  onNext,
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
        <span className="text-white font-medium">
          {months[month]} {year}
        </span>
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

function AttendanceTable({
  records,
  showEmployee = false,
}: {
  records: AttendanceRecord[];
  showEmployee?: boolean;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            {showEmployee && (
              <th className="text-left py-4 px-5 text-sm font-medium text-white/70">
                Employee
              </th>
            )}
            <th className="text-left py-4 px-5 text-sm font-medium text-white/70">
              Date
            </th>
            <th className="text-left py-4 px-5 text-sm font-medium text-white/70">
              Check In
            </th>
            <th className="text-left py-4 px-5 text-sm font-medium text-white/70">
              Check Out
            </th>
            <th className="text-left py-4 px-5 text-sm font-medium text-white/70">
              Work Hours
            </th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td
                colSpan={showEmployee ? 5 : 4}
                className="py-8 text-center text-white/40"
              >
                No attendance records found for this period.
              </td>
            </tr>
          ) : (
            records.map((record, index) => (
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
                      <p className="text-white font-medium">
                        {record.employeeName}
                      </p>
                      <p className="text-white/40 text-sm">
                        {record.employeeId}
                      </p>
                    </div>
                  </td>
                )}
                <td className="py-4 px-5 text-white">
                  {formatDate(record.date)}
                </td>
                <td className="py-4 px-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                    {record.checkIn}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium",
                      record.checkOut !== "-"
                        ? "bg-rose-500/10 text-rose-400"
                        : "text-white/20"
                    )}
                  >
                    {record.checkOut}
                  </span>
                </td>
                <td className="py-4 px-5 text-white font-medium">
                  {record.workHours}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search employee..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-64 h-10 pl-10 pr-4 rounded-lg text-sm text-white placeholder-white/40 bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}

// Main Page Component
export default function AttendancePage() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role: UserRole;
  } | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Default to current date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInStatus, setCheckInStatus] = useState<"in" | "out">("out");

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "HR";

  // 1. Fetch User Session
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          // Map backend roles to frontend types (ensure uppercase)
          setCurrentUser({
            id: data.user.id,
            role: data.user.role as UserRole,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
    fetchUser();
  }, []);

  // 2. Fetch Attendance Data
  const fetchAttendance = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch("/api/attendance");
      if (res.ok) {
        const data: any[] = await res.json();

        // Transform data
        const mappedRecords: AttendanceRecord[] = data.map((item) => {
          const checkInTime = formatTime(item.check_in);
          const checkOutTime = formatTime(item.check_out);
          const workHours = calculateDuration(item.check_in, item.check_out);

          return {
            id: item.id.toString(),
            date: item.date, // "YYYY-MM-DD" or ISO string
            checkIn: checkInTime,
            checkOut: checkOutTime,
            workHours: workHours,
            extraHours: "-", // Not calculated yet
            employeeName: `${item.first_name} ${item.last_name}`,
            employeeId: item.employee_id,
          };
        });

        // Sort by date desc
        mappedRecords.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setRecords(mappedRecords);

        // Determine check-in status for TODAY (using local date to match backend)
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

        console.log("Today (local):", todayStr);
        console.log("Current user ID:", currentUser.id);
        console.log("Attendance data sample:", data[0]);

        // Robust check for current user's record today
        const myTodayRecord = data.find((item: any) => {
          // PostgreSQL DATE type comes back as a timestamp at midnight UTC
          // e.g., "2026-01-02T18:30:00.000Z" which is Jan 3 00:00 in IST
          // We MUST parse as Date and extract LOCAL date to match todayStr
          let recordDateStr = "";

          const dateVal = item.date;
          // Always parse as Date to get correct local date
          const d = new Date(dateVal);
          if (!isNaN(d.getTime())) {
            // Extract LOCAL date parts (not UTC) - this handles timezone correctly
            recordDateStr = `${d.getFullYear()}-${String(
              d.getMonth() + 1
            ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          }

          console.log(
            `Record: user_id=${item.user_id}, raw_date=${dateVal}, parsed_local=${recordDateStr}, check_out=${item.check_out}`
          );

          return (
            String(item.user_id) === String(currentUser.id) &&
            recordDateStr === todayStr
          );
        });

        console.log("My today record:", myTodayRecord);

        if (myTodayRecord) {
          if (!myTodayRecord.check_out) {
            setCheckInStatus("in");
          } else {
            setCheckInStatus("out");
          }
        } else {
          setCheckInStatus("out");
        }
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, currentDate]); // Reload if user or date changes (though currently API doesn't filter by date in this call)

  const handleCreateCheckIn = async () => {
    try {
      const res = await fetch("/api/attendance/check-in", { method: "POST" });
      if (res.ok) {
        setCheckInStatus("in");
        fetchAttendance();
      } else {
        const err = await res.json();
        alert(err.error || "Check-in failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCheckOut = async () => {
    try {
      const res = await fetch("/api/attendance/check-out", { method: "POST" });
      if (res.ok) {
        setCheckInStatus("out");
        fetchAttendance();
      } else {
        const err = await res.json();
        alert(err.error || "Check-out failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Filter records by selected month/year locally since API returns recent ones (or we can update API)
  // For now, let's filter client side
  const currentMonthRecords = useMemo(() => {
    return records.filter((r) => {
      const d = new Date(r.date);
      return (
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [records, currentDate]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return currentMonthRecords;
    return currentMonthRecords.filter(
      (r) =>
        r.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, currentMonthRecords]);

  // Calculate stats from current month records (for current user only ideally, but let's show agg for admin or user)
  // If admin, these stats might be "global" or "average", but usually stats are personal.
  // Let's calculate stats for the *User* view. If Admin view, maybe hiding stats or showing total present today is better.
  const stats: AttendanceStats = useMemo(() => {
    // Only calculate for the user's own records if possible, but here we have mixed list for Admin.
    // For simple Employee view, `records` only contains theirs.

    // Let's filter records that belong to current user if we want personal stats
    const myRecords = isAdmin
      ? records.filter((r) => {
          /* We don't have user_id in mapped record easily, let's skip strict personal stats for admin for now or assume dashboard does it */ return true;
        })
      : records;

    const present = myRecords.length;
    // Simple naive calc for leaves/working days
    // Assume 22 working days in a month roughly
    // Leaves = working days passed - present
    // accurate calc requires knowing holidays/total working days
    // For now, we count present

    return {
      daysPresent: present,
      leavesCount: 0, // Placeholder
      totalWorkingDays: 0, // Placeholder
    };
  }, [records, isAdmin]);

  return (
    <div className="min-h-screen">
      {/* Use shared NavigationBar */}
      <NavigationBar
        isAdmin={isAdmin}
        checkInStatus={checkInStatus}
        onCheckIn={handleCreateCheckIn}
        onCheckOut={handleCreateCheckOut}
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

        {/* Stats (Employee View Only) - Hiding for Admin for now to avoid confusion with mixed data */}
        {!isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={Calendar}
              label="Days Present"
              value={stats.daysPresent}
              accent
            />
            {/* 
            <StatCard
              icon={TrendingUp}
              label="Leaves Taken"
              value={stats.leavesCount}
            />
            <StatCard
              icon={Clock}
              label="Total Working Days"
              value={stats.totalWorkingDays}
            /> 
            */}
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Users className="h-4 w-4" />
                <span>{filteredRecords.length} records</span>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <AttendanceTable records={filteredRecords} showEmployee={isAdmin} />

        {/* Footer Info */}
        <div className="mt-6 flex items-center justify-between text-sm text-white/40">
          <p>
            {isAdmin
              ? "Attendance data is updated in real-time"
              : "Your attendance is recorded automatically when you check in/out"}
          </p>
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </main>
    </div>
  );
}
