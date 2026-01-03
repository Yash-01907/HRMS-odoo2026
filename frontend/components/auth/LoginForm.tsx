'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/FloatingInput';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button, ButtonState } from '@/components/ui/button';
import { RoleSelector } from '@/components/ui/RoleSelector';
import { cn } from '@/lib/utils';

type AuthMode = 'signin' | 'signup';
type Role = 'employee' | 'hr';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role: Role;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'employee',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'At least 8 characters';
    }

    if (mode === 'signup') {
      if (!formData.fullName) {
        newErrors.fullName = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setButtonState('loading');
    await new Promise((r) => setTimeout(r, 1500));
    setButtonState('success');

    setTimeout(() => {
      // Redirect based on role
      console.log('→', formData.role === 'hr' ? '/admin' : '/dashboard');
    }, 800);
  };

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </motion.h1>
        <p className='text-white/50 mt-2 text-sm'>
          {mode === 'signin'
            ? 'Enter your credentials to access your account'
            : 'Get started with Dayflow today'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Sign up: Name field */}
        {mode === 'signup' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              label='Full name'
              type='text'
              placeholder='John Doe'
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              error={errors.fullName}
              autoComplete='name'
            />
          </motion.div>
        )}

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

        <PasswordInput
          label='Password'
          placeholder='••••••••'
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          error={errors.password}
          showStrength={mode === 'signup'}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        />

        {mode === 'signup' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <PasswordInput
              label='Confirm password'
              placeholder='••••••••'
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              autoComplete='new-password'
            />
          </motion.div>
        )}

        <RoleSelector
          value={formData.role}
          onChange={(role) => updateField('role', role)}
        />

        {/* Remember me & Forgot password */}
        {mode === 'signin' && (
          <div className='flex items-center justify-between text-sm'>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <input
                type='checkbox'
                checked={formData.rememberMe}
                onChange={(e) => updateField('rememberMe', e.target.checked)}
                className='sr-only peer'
              />
              <div
                className={cn(
                  'w-4 h-4 rounded border transition-all',
                  formData.rememberMe
                    ? 'bg-white border-white'
                    : 'border-white/20 bg-transparent'
                )}
              >
                {formData.rememberMe && (
                  <svg
                    className='w-4 h-4 text-black'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </div>
              <span className='text-white/50 group-hover:text-white/70 transition-colors'>
                Remember me
              </span>
            </label>
            <button
              type='button'
              className='text-white/50 hover:text-white transition-colors'
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit */}
        <Button type='submit' state={buttonState} className='w-full'>
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </Button>

        {/* Divider */}
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-white/10' />
          </div>
          <div className='relative flex justify-center text-xs'>
            <span className='px-3 bg-[#030712] text-white/40 lg:bg-transparent'>
              or
            </span>
          </div>
        </div>

        {/* Social buttons */}
        <div className='grid grid-cols-2 gap-3'>
          <Button type='button' variant='secondary'>
            <svg className='h-4 w-4 mr-2' viewBox='0 0 24 24'>
              <path
                fill='currentColor'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='currentColor'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='currentColor'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='currentColor'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
            Google
          </Button>
          <Button type='button' variant='secondary'>
            <svg
              className='h-4 w-4 mr-2'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z' />
            </svg>
            Microsoft
          </Button>
        </div>
      </form>

      {/* Toggle mode */}
      <p className='text-center mt-8 text-sm text-white/40'>
        {mode === 'signin' ? 'New to Dayflow? ' : 'Already have an account? '}
        <button
          type='button'
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setErrors({});
            setButtonState('idle');
          }}
          className='text-white hover:underline'
        >
          {mode === 'signin' ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
