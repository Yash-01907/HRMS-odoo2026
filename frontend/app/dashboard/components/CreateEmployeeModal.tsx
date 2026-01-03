"use client";

import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Building2,
  Shield,
} from "lucide-react";

interface CreateEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  role: z.enum(["ADMIN", "HR", "EMPLOYEE"]),
  companyName: z.string().min(1, "Company name is required"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

type FormErrors = Partial<Record<keyof EmployeeFormData, string>>;

const roles = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "HR", label: "HR" },
  { value: "ADMIN", label: "Admin" },
] as const;

export function CreateEmployeeModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    dateOfJoining: "",
    role: "EMPLOYEE",
    companyName: "Dayflow",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    employeeId: string;
    tempPassword: string;
  } | null>(null);

  const validateForm = (): boolean => {
    const result = employeeSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof EmployeeFormData;
        if (field) {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleFieldChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessInfo(null);

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          joiningDate: formData.dateOfJoining,
          role: formData.role,
          companyName: formData.companyName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.fieldErrors?.email?.[0] ||
            data.error ||
            "Failed to create employee"
        );
      }

      // Show success with generated credentials
      setSuccessInfo({
        employeeId: data.employeeId,
        tempPassword: data.tempPassword,
      });
    } catch (error: any) {
      console.error("Error creating employee:", error);
      setErrors({ email: error.message || "Failed to create employee" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        dateOfJoining: "",
        role: "EMPLOYEE",
        companyName: "Dayflow",
      });
      setErrors({});
      setSuccessInfo(null);
      onOpenChange(false);
    }
  };

  const handleDone = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      designation: "",
      department: "",
      dateOfJoining: "",
      role: "EMPLOYEE",
      companyName: "Dayflow",
    });
    setErrors({});
    setSuccessInfo(null);
    onSuccess?.();
    onOpenChange(false);
  };

  // Success state view
  if (successInfo) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-emerald-400 flex items-center gap-2">
              <div className="p-2 rounded-full bg-emerald-500/20">
                <User className="h-5 w-5" />
              </div>
              Employee Created Successfully!
            </DialogTitle>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <p className="text-white/70 text-sm">
              The employee account has been created. Please share these
              credentials with the employee:
            </p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-sm">Employee ID:</span>
                <span className="text-white font-mono font-semibold">
                  {successInfo.employeeId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-sm">
                  Temporary Password:
                </span>
                <span className="text-white font-mono font-semibold">
                  {successInfo.tempPassword}
                </span>
              </div>
            </div>

            <p className="text-amber-400/80 text-xs">
              ⚠️ The employee should change their password after first login.
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={handleDone}
              className="w-full border-0 text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20">
              <User className="h-5 w-5 text-blue-400" />
            </div>
            Create New Employee
          </DialogTitle>
          <DialogDescription>
            Add a new employee to the system. Login credentials will be
            auto-generated.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-white/90 block mb-1"
              >
                First Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="pl-10"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>
              {errors.firstName && (
                <p className="text-sm text-red-400 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-white/90 block mb-1"
              >
                Last Name <span className="text-red-400">*</span>
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-sm text-red-400 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-white/90 block mb-1"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                id="email"
                type="email"
                placeholder="employee@company.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="text-sm font-medium text-white/90 block mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="pl-10"
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Department and Designation Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="department"
                className="text-sm font-medium text-white/90 block mb-1"
              >
                Department
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="department"
                  type="text"
                  placeholder="Engineering"
                  className="pl-10"
                  value={formData.department}
                  onChange={(e) =>
                    handleFieldChange("department", e.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="designation"
                className="text-sm font-medium text-white/90 block mb-1"
              >
                Designation
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="designation"
                  type="text"
                  placeholder="Software Engineer"
                  className="pl-10"
                  value={formData.designation}
                  onChange={(e) =>
                    handleFieldChange("designation", e.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Date of Joining and Role Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dateOfJoining"
                className="text-sm font-medium text-white/90 block mb-1"
              >
                Date of Joining <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="dateOfJoining"
                  type="date"
                  className="pl-10"
                  value={formData.dateOfJoining}
                  onChange={(e) =>
                    handleFieldChange("dateOfJoining", e.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>
              {errors.dateOfJoining && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.dateOfJoining}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="text-sm font-medium text-white/90 block mb-1"
              >
                Role <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 z-10" />
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleFieldChange("role", e.target.value)}
                  disabled={isSubmitting}
                  className="flex h-9 w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {roles.map((role) => (
                    <option
                      key={role.value}
                      value={role.value}
                      className="bg-[#1a1a2e] text-white"
                    >
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <label
              htmlFor="companyName"
              className="text-sm font-medium text-white/90 block mb-1"
            >
              Company <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                id="companyName"
                type="text"
                placeholder="Company name"
                className="pl-10"
                value={formData.companyName}
                onChange={(e) =>
                  handleFieldChange("companyName", e.target.value)
                }
                disabled={isSubmitting}
              />
            </div>
            {errors.companyName && (
              <p className="text-sm text-red-400 mt-1">{errors.companyName}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="border-0 text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Creating..." : "Create Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
