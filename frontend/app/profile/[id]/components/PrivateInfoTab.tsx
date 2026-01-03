'use client';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PrivateInfoTabProps {
  dateOfBirth?: string;
  residingAddress?: string;
  nationality?: string;
  personalEmail?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfJoining?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  panNo?: string;
  uanNo?: string;
  empCode?: string;
}

export function PrivateInfoTab({
  dateOfBirth,
  residingAddress,
  nationality,
  personalEmail,
  gender,
  maritalStatus,
  dateOfJoining,
  accountNumber,
  bankName,
  ifscCode,
  panNo,
  uanNo,
  empCode,
}: PrivateInfoTabProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Left Column - Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Date of Birth
              </label>
              <Input
                type='date'
                value={dateOfBirth || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Residing Address
              </label>
              <Input
                value={residingAddress || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Nationality
              </label>
              <Input
                value={nationality || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Personal Email
              </label>
              <Input
                type='email'
                value={personalEmail || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Gender
              </label>
              <Input
                value={gender || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Marital Status
              </label>
              <Input
                value={maritalStatus || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Date of Joining
              </label>
              <Input
                type='date'
                value={dateOfJoining || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Column - Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Account Number
              </label>
              <Input
                value={accountNumber || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Bank Name
              </label>
              <Input
                value={bankName || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                IFSC Code
              </label>
              <Input
                value={ifscCode || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                PAN NO
              </label>
              <Input value={panNo || ''} readOnly placeholder='Not specified' />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                UAN NO
              </label>
              <Input value={uanNo || ''} readOnly placeholder='Not specified' />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Emp Code
              </label>
              <Input
                value={empCode || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
