'use client';

import { useState } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface CreateEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().min(1, 'Phone is required').trim(),
  jobPosition: z.string().min(1, 'Job position is required').trim(),
  dateOfJoining: z.string().min(1, 'Date of joining is required'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

type FormErrors = Partial<Record<keyof EmployeeFormData, string>>;

export function CreateEmployeeModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    phone: '',
    jobPosition: '',
    dateOfJoining: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/employees', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Failed to create employee');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        jobPosition: '',
        dateOfJoining: '',
      });
      setErrors({});

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating employee:', error);
      // TODO: Show error toast/notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        jobPosition: '',
        dateOfJoining: '',
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
          <DialogDescription>
            Add a new employee to the system. A login ID and password will be
            auto-generated.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 py-4'>
          <div>
            <label
              htmlFor='name'
              className='text-sm font-medium text-white/90 block mb-1'
            >
              Full Name <span className='text-red-400'>*</span>
            </label>
            <Input
              id='name'
              type='text'
              placeholder='Enter full name'
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className='text-sm text-red-400 mt-1'>{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='email'
              className='text-sm font-medium text-white/90 block mb-1'
            >
              Email <span className='text-red-400'>*</span>
            </label>
            <Input
              id='email'
              type='email'
              placeholder='employee@company.com'
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className='text-sm text-red-400 mt-1'>{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='phone'
              className='text-sm font-medium text-white/90 block mb-1'
            >
              Phone <span className='text-red-400'>*</span>
            </label>
            <Input
              id='phone'
              type='tel'
              placeholder='+1 (555) 000-0000'
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className='text-sm text-red-400 mt-1'>{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='jobPosition'
              className='text-sm font-medium text-white/90 block mb-1'
            >
              Job Position <span className='text-red-400'>*</span>
            </label>
            <Input
              id='jobPosition'
              type='text'
              placeholder='e.g., Software Engineer'
              value={formData.jobPosition}
              onChange={(e) => handleFieldChange('jobPosition', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.jobPosition && (
              <p className='text-sm text-red-400 mt-1'>{errors.jobPosition}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='dateOfJoining'
              className='text-sm font-medium text-white/90 block mb-1'
            >
              Date of Joining <span className='text-red-400'>*</span>
            </label>
            <Input
              id='dateOfJoining'
              type='date'
              value={formData.dateOfJoining}
              onChange={(e) =>
                handleFieldChange('dateOfJoining', e.target.value)
              }
              disabled={isSubmitting}
            />
            {errors.dateOfJoining && (
              <p className='text-sm text-red-400 mt-1'>
                {errors.dateOfJoining}
              </p>
            )}
          </div>

          <DialogFooter className='gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='border-0 text-white transition-opacity hover:opacity-90'
              style={{
                background:
                  'linear-gradient(to right, var(--accent), var(--secondary))',
              }}
            >
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              {isSubmitting ? 'Creating...' : 'Create Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
