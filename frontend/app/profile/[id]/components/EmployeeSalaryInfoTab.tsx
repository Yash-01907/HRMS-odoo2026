'use client';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmployeeSalaryInfoTabProps {
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  panNo?: string;
  uanNo?: string;
  empCode?: string;
}

export function EmployeeSalaryInfoTab({
  accountNumber,
  bankName,
  ifscCode,
  panNo,
  uanNo,
  empCode,
}: EmployeeSalaryInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-1 block'>
                Account Number
              </label>
              <Input
                value={accountNumber || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-1 block'>
                Bank Name
              </label>
              <Input
                value={bankName || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-1 block'>
                IFSC Code
              </label>
              <Input
                value={ifscCode || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-1 block'>
                PAN NO
              </label>
              <Input
                value={panNo || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-1 block'>
                UAN NO
              </label>
              <Input
                value={uanNo || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-1 block'>
                Emp Code
              </label>
              <Input
                value={empCode || ''}
                readOnly
                placeholder='Not specified'
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

