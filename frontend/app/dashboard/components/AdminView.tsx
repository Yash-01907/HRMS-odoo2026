"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Plus, Settings, Loader2 } from "lucide-react";
import { EmployeeCard } from "./EmployeeCard";
import { CreateEmployeeModal } from "./CreateEmployeeModal";

interface Employee {
  id: number;
  employee_id: string;
  email: string;
  first_name: string;
  last_name: string;
  designation?: string;
  role_name: string;
}

export function AdminView() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeClick = (id: number) => {
    router.push(`/profile/${id}`);
  };

  const handleCreateSuccess = () => {
    fetchEmployees(); // Refresh employee list
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      `${emp.first_name} ${emp.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-linear-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 border-0 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          NEW
        </Button>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="search"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg text-sm text-white placeholder-white/40 bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-12 text-white/50">
          {searchQuery
            ? "No employees match your search."
            : "No employees found. Create your first employee!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={{
                id: employee.id,
                name: `${employee.first_name} ${employee.last_name}`,
                status: "present", // TODO: Fetch actual status from attendance
                avatar: "",
              }}
              onClick={() => handleEmployeeClick(employee.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-6">
        <a
          href="#"
          className="inline-flex items-center text-sm text-white/50 hover:text-white transition-colors"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </a>
      </div>

      <CreateEmployeeModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
