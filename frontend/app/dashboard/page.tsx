"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { NavigationBar } from "./components/NavigationBar";
import { AdminView } from "./components/AdminView";
import { EmployeeView } from "./components/EmployeeView";
import { TimeOffView } from "./components/TimeOffView";
import { redirect } from "next/navigation";
import {
  checkIn as apiCheckIn,
  checkOut as apiCheckOut,
} from "@/lib/api/attendance";

type UserRole = "ADMIN" | "HR" | "EMPLOYEE";
type ActiveTab = "employees" | "attendance" | "timeoff";

interface UserData {
  id: number;
  employeeId: string;
  email: string;
  role: UserRole;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkInStatus, setCheckInStatus] = useState<"in" | "out">("out");
  const [checkInLoading, setCheckInLoading] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/users/me");
        if (!response.ok) {
          // Not logged in, redirect to login
          window.location.href = "/";
          return;
        }
        const data = await response.json();
        // Map API response to expected format
        setUserData({
          id: data.id,
          employeeId: data.employee_id,
          email: data.email,
          role: data.role_name as UserRole, // API returns role_name
        });

        // Check today's attendance status
        const attendanceRes = await fetch("/api/attendance?today=true");
        if (attendanceRes.ok) {
          const attendance = await attendanceRes.json();
          if (
            attendance.length > 0 &&
            attendance[0].checkIn &&
            !attendance[0].checkOut
          ) {
            setCheckInStatus("in");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const isAdmin = useMemo(
    () => userData?.role === "ADMIN" || userData?.role === "HR",
    [userData]
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("employees");

  // Update default tab when user data loads or check URL param
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "timeoff") {
      setActiveTab("timeoff");
    } else if (userData) {
      setActiveTab(isAdmin ? "employees" : "attendance");
    }
  }, [userData, isAdmin, searchParams]);

  const handleCheckIn = useCallback(async () => {
    if (checkInLoading) return;
    setCheckInLoading(true);
    try {
      await apiCheckIn();
      setCheckInStatus("in");
    } catch (error: any) {
      console.error("Check-in failed:", error.message);
      alert(error.message || "Check-in failed");
    } finally {
      setCheckInLoading(false);
    }
  }, [checkInLoading]);

  const handleCheckOut = useCallback(async () => {
    if (checkInLoading) return;
    setCheckInLoading(true);
    try {
      await apiCheckOut();
      setCheckInStatus("out");
    } catch (error: any) {
      console.error("Check-out failed:", error.message);
      alert(error.message || "Check-out failed");
    } finally {
      setCheckInLoading(false);
    }
  }, [checkInLoading]);

  const handleTabChange = useCallback(
    (tab: ActiveTab) => {
      if (!isAdmin && tab === "employees") {
        return;
      }
      setActiveTab(tab);
    },
    [isAdmin]
  );

  const renderContent = () => {
    switch (activeTab) {
      case "timeoff":
        return <TimeOffView isAdmin={isAdmin} />;
      case "attendance":
        redirect("/attendance");
      case "employees":
      default:
        if (!isAdmin) {
          return <EmployeeView />;
        }
        return <AdminView />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavigationBar
        isAdmin={isAdmin}
        checkInStatus={checkInStatus}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="container mx-auto px-6 py-6">{renderContent()}</div>
    </div>
  );
}
