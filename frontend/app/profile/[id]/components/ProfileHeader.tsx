'use client';

import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Pencil } from 'lucide-react';

interface ProfileHeaderProps {
  profileData: {
    name: string;
    jobPosition?: string;
    loginId?: string;
    email: string;
    mobile: string;
    company: string;
    department: string;
    manager: string;
    location: string;
  };
  isEmployee?: boolean;
}

export function ProfileHeader({
  profileData,
  isEmployee = false,
}: ProfileHeaderProps) {
  return (
    <>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>My Profile</h1>

      <div className='flex flex-wrap gap-8 items-start mb-6'>
        <div className='relative'>
          <Avatar className='size-32 border-4 border-white shadow-lg'>
            <AvatarImage src='' alt={profileData.name} />
            <AvatarFallback className='text-2xl'>
              <User className='size-16' />
            </AvatarFallback>
          </Avatar>
          <button className='absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors'>
            <Pencil className='size-4' />
          </button>
        </div>

        <div className='flex-1 min-w-[300px]'>
          <div className='mb-4'>
            <p className='text-2xl font-semibold text-gray-900'>
              {profileData.name}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              {isEmployee && profileData.jobPosition && (
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-1 block'>
                    Job Position
                  </label>
                  <Input value={profileData.jobPosition} readOnly />
                </div>
              )}
              {!isEmployee && profileData.loginId && (
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-1 block'>
                    Login ID
                  </label>
                  <Input value={profileData.loginId} readOnly />
                </div>
              )}
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1 block'>
                  Email
                </label>
                <Input value={profileData.email} readOnly />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1 block'>
                  Mobile
                </label>
                <Input value={profileData.mobile} readOnly />
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1 block'>
                  Company
                </label>
                <Input value={profileData.company} readOnly />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1 block'>
                  Department
                </label>
                <Input value={profileData.department} readOnly />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1 block'>
                  Manager
                </label>
                <Input value={profileData.manager} readOnly />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-1 block'>
                  Location
                </label>
                <Input value={profileData.location} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
