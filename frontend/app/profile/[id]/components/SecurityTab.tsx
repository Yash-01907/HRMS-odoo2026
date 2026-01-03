'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function SecurityTab() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = () => {
    // Handle password change
    console.log('Change password');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Lock className='size-5' />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4 max-w-md'>
          <div>
            <label className='text-sm font-medium text-gray-700 mb-1 block'>
              Current Password
            </label>
            <div className='relative'>
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder='Enter current password'
              />
              <button
                type='button'
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showCurrentPassword ? (
                  <EyeOff className='size-4' />
                ) : (
                  <Eye className='size-4' />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700 mb-1 block'>
              New Password
            </label>
            <div className='relative'>
              <Input
                type={showNewPassword ? 'text' : 'password'}
                placeholder='Enter new password'
              />
              <button
                type='button'
                onClick={() => setShowNewPassword(!showNewPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showNewPassword ? (
                  <EyeOff className='size-4' />
                ) : (
                  <Eye className='size-4' />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700 mb-1 block'>
              Confirm New Password
            </label>
            <div className='relative'>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm new password'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showConfirmPassword ? (
                  <EyeOff className='size-4' />
                ) : (
                  <Eye className='size-4' />
                )}
              </button>
            </div>
          </div>

          <Button onClick={handlePasswordChange} className='w-full'>
            Update Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

