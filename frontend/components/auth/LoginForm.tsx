'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, Check, Upload } from 'lucide-react';
import { Input } from '@/components/ui/FloatingInput';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AuthMode = 'signin' | 'signup';
type FormState = 'idle' | 'loading' | 'success';

interface FormData {
  loginId: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  companyLogo: File | null;
}

interface FormErrors {
  loginId?: string;
  password?: string;
  confirmPassword?: string;
  companyName?: string;
  name?: string;
  email?: string;
  phone?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState<FormData>({
    loginId: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    name: '',
    email: '',
    phone: '',
    companyLogo: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (mode === 'signin') {
      if (!formData.loginId) {
        newErrors.loginId = 'Login ID/Email is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    } else {
      // Sign up validation
      if (!formData.companyName) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Enter a valid email';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'At least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof FormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField('companyLogo', file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (mode === 'signup') {
      // Sign up is handled by admin - show info message
      setErrors({ loginId: 'Sign up is handled by HR/Admin. Please contact your administrator.' });
      return;
    }

    setFormState('loading');

    try {
      // Determine if loginId is an email or employee ID
      const isEmail = emailRegex.test(formData.loginId);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: isEmail ? formData.loginId : formData.loginId,
          email: formData.loginId,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setFormState('success');

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);

    } catch (error: any) {
      setFormState('idle');
      setErrors({ password: error.message || 'Invalid credentials' });
    }
  };

  return (
    <div className='lg:bg-white/[0.03] lg:border lg:border-white/10 lg:rounded-2xl lg:p-8 lg:backdrop-blur-sm'>
      {/* Mobile Logo */}
      <div className='lg:hidden mb-10 text-center'>
        <div className='inline-flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center'>
            <svg
              className='w-4 h-4 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <span className='text-xl font-semibold text-white'>Dayflow</span>
        </div>
      </div>

      {/* Header */}
      <div className='mb-8'>
        <motion.h1
          key={mode}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className='text-2xl font-semibold text-white'
        >
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </motion.h1>
        <p className='text-white/50 mt-2 text-sm'>
          {mode === 'signin'
            ? 'Enter your credentials to access your account'
            : 'Create your company account to get started'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-5'>
        {mode === 'signin' ? (
          // Sign In Form
          <>
            <Input
              label='Login ID / Email'
              type='text'
              placeholder='Enter your login ID or email'
              value={formData.loginId}
              onChange={(e) => updateField('loginId', e.target.value)}
              error={errors.loginId}
              icon={<Mail className='h-4 w-4' />}
              autoComplete='username'
            />

            <PasswordInput
              label='Password'
              placeholder='••••••••'
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={errors.password}
              showStrength={false}
              autoComplete='current-password'
            />
          </>
        ) : (
          // Sign Up Form
          <>
            {/* Company Name with Logo Upload */}
            <div className='space-y-2'>
              <label className='text-sm text-white/70'>Company Name</label>
              <div className='flex gap-3'>
                <input
                  type='text'
                  placeholder='Enter company name'
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className={cn(
                    'flex-1 h-11 px-4 rounded-lg text-sm text-white placeholder-white/40 bg-white/5 border transition-colors',
                    errors.companyName
                      ? 'border-rose-500/50'
                      : 'border-white/10 focus:border-white/30',
                    'focus:outline-none'
                  )}
                />
                <label className='relative'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleLogoUpload}
                    className='sr-only'
                  />
                  <div className='h-11 w-11 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center cursor-pointer hover:bg-blue-500/30 transition-colors'>
                    <Upload className='h-4 w-4 text-blue-400' />
                  </div>
                </label>
              </div>
              {errors.companyName && (
                <p className='text-rose-400 text-xs mt-1'>
                  {errors.companyName}
                </p>
              )}
              {formData.companyLogo && (
                <p className='text-white/40 text-xs'>
                  Logo: {formData.companyLogo.name}
                </p>
              )}
            </div>

            <Input
              label='Name'
              type='text'
              placeholder='Enter your full name'
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
              autoComplete='name'
            />

            <Input
              label='Email'
              type='email'
              placeholder='you@company.com'
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={errors.email}
              icon={<Mail className='h-4 w-4' />}
              autoComplete='email'
            />

            <Input
              label='Phone'
              type='tel'
              placeholder='+1 (555) 000-0000'
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              error={errors.phone}
              autoComplete='tel'
            />

            <PasswordInput
              label='Password'
              placeholder='••••••••'
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={errors.password}
              showStrength={true}
              autoComplete='new-password'
            />

            <PasswordInput
              label='Confirm Password'
              placeholder='••••••••'
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              showStrength={false}
              autoComplete='new-password'
            />
          </>
        )}

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={formState !== 'idle'}
          className={cn(
            'w-full h-11 relative',
            formState === 'success' && 'bg-emerald-500 hover:bg-emerald-500'
          )}
        >
          {formState === 'loading' && (
            <Loader2 className='h-4 w-4 animate-spin absolute' />
          )}
          {formState === 'success' && <Check className='h-4 w-4 absolute' />}
          <span className={cn(formState !== 'idle' && 'opacity-0')}>
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </span>
        </Button>
      </form>

      {/* Toggle mode */}
      <p className='text-center mt-8 text-sm text-white/40'>
        {mode === 'signin'
          ? "Don't have an account? "
          : 'Already have an account? '}
        <button
          type='button'
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setErrors({});
            setFormState('idle');
          }}
          className='text-white hover:underline'
        >
          {mode === 'signin' ? 'Sign Up' : 'Sign In'}
        </button>
      </p>

      {/* Note for Sign Up */}
      {mode === 'signup' && (
        <div className='mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20'>
          <p className='text-blue-400 text-xs leading-relaxed'>
            <strong>Note:</strong> Normal users cannot register. When an HR
            officer or Admin creates a new employee, a Login ID will be
            generated automatically and a password will be auto-generated for
            first-time login. Users can then change their password.
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
