'use client';

import { useState, use } from 'react';
import { NavigationBar } from '@/app/dashboard/components/NavigationBar';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileTabs } from './components/ProfileTabs';
import { ResumeTab } from './components/ResumeTab';
import { SalaryInfoTab } from './components/SalaryInfoTab';
import { PrivateInfoTab } from './components/PrivateInfoTab';
import { SecurityTab } from './components/SecurityTab';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileData {
  id: string;
  name: string;
  jobPosition?: string;
  loginId?: string;
  email: string;
  mobile: string;
  company: string;
  department: string;
  manager: string;
  location: string;
  about: string;
  jobLove: string;
  interests: string;
  skills: string[];
  certifications: string[];
  resumeUrl?: string;
  resumeFileName?: string;
  privateInfo?: {
    dateOfBirth?: string;
    residingAddress?: string;
    nationality?: string;
    personalEmail?: string;
    gender?: string;
    maritalStatus?: string;
    dateOfJoining?: string;
  };
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    panNo?: string;
    uanNo?: string;
    empCode?: string;
  };
  salaryInfo?: {
    monthWage: number;
    yearlyWage: number;
    workingDaysPerWeek?: number;
    breakTime?: number;
    salaryComponents: Array<{
      name: string;
      value: number;
      unit: string;
      percentage: number;
      description: string;
    }>;
    pfContributions: Array<{
      type: 'employee' | 'employer';
      value: number;
      unit: string;
      percentage: number;
      description: string;
    }>;
    taxDeductions: Array<{
      name: string;
      value: number;
      unit: string;
      description: string;
    }>;
  };
}

// Mock data - will come from backend
const getProfileData = (id: string, isAdmin: boolean): ProfileData => {
  const baseData = {
    id,
    name: 'My Name',
    email: 'user@company.com',
    mobile: '+1 234 567 8900',
    company: 'Company Name',
    department: 'Engineering',
    manager: 'Manager Name',
    location: 'New York, USA',
    about:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    jobLove:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    interests:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    skills: [],
    certifications: [],
  };

  if (isAdmin) {
    return {
      ...baseData,
      loginId: 'user@company.com',
      privateInfo: {
        dateOfBirth: '1985-05-20',
        residingAddress: '456 Admin Street, City, State, ZIP',
        nationality: 'Indian',
        personalEmail: 'admin.personal@email.com',
        gender: 'Male',
        maritalStatus: 'Married',
        dateOfJoining: '2015-01-01',
      },
      bankDetails: {
        accountNumber: '9876543210',
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0001234',
        panNo: 'FGHIJ5678K',
        uanNo: '987654321098',
        empCode: 'ADM001',
      },
      salaryInfo: {
        monthWage: 50000,
        yearlyWage: 600000,
        workingDaysPerWeek: 5,
        breakTime: 1,
        salaryComponents: [
          {
            name: 'Basic Salary',
            value: 25000.0,
            unit: '₹ / month',
            percentage: 50.0,
            description:
              'Define Basic salary from company cost compute it based on monthly Wages',
          },
          {
            name: 'House Rent Allowance',
            value: 12500.0,
            unit: '₹ / month',
            percentage: 50.0,
            description: 'HRA provided to employees 50% of the basic salary',
          },
          {
            name: 'Standard Allowance',
            value: 4167.0,
            unit: '₹ / month',
            percentage: 16.67,
            description:
              'A standard allowance is a predetermined, fixed amount provided to employee as part of their salary',
          },
          {
            name: 'Performance Bonus',
            value: 2082.5,
            unit: '₹ / month',
            percentage: 8.33,
            description:
              'Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary',
          },
          {
            name: 'Leave Travel Allowance',
            value: 2082.5,
            unit: '₹ / month',
            percentage: 8.33,
            description:
              'LTA is paid by the company to employees to cover their travel expenses. and calculated as a % of the basic salary',
          },
          {
            name: 'Fixed Allowance',
            value: 2918.0,
            unit: '₹ / month',
            percentage: 11.67,
            description:
              'fixed allowance portion of wages is determined after calculating all salary components',
          },
        ],
        pfContributions: [
          {
            type: 'employee',
            value: 3000.0,
            unit: '₹ / month',
            percentage: 12.0,
            description: 'PF is calculated based on the basic salary',
          },
          {
            type: 'employer',
            value: 3000.0,
            unit: '₹ / month',
            percentage: 12.0,
            description: 'PF is calculated based on the basic salary',
          },
        ],
        taxDeductions: [
          {
            name: 'Professional Tax',
            value: 200.0,
            unit: '₹ / month',
            description: 'Professional Tax deducted from the Gross salary',
          },
        ],
      },
    };
  }

  // Employee data
  return {
    ...baseData,
    jobPosition: 'Software Engineer',
    privateInfo: {
      dateOfBirth: '1990-01-15',
      residingAddress: '123 Main Street, City, State, ZIP',
      nationality: 'Indian',
      personalEmail: 'personal@email.com',
      gender: 'Male',
      maritalStatus: 'Single',
      dateOfJoining: '2020-01-01',
    },
    bankDetails: {
      accountNumber: '1234567890',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001234',
      panNo: 'ABCDE1234F',
      uanNo: '123456789012',
      empCode: 'EMP001',
    },
  };
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [checkInStatus] = useState<'in' | 'out'>('out');
  const [activeTab, setActiveTab] = useState('private-info');

  // TODO: Get isAdmin from backend/context/auth
  const isAdmin = true; // Change to true for admin view
  const isEmployee = !isAdmin;

  const profileData = getProfileData(id, isAdmin);

  const handleCheckIn = () => {};
  const handleCheckOut = () => {};

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resume':
        return (
          <ResumeTab
            resumeUrl={profileData.resumeUrl}
            resumeFileName={profileData.resumeFileName}
          />
        );
      case 'private-info':
        return (
          <PrivateInfoTab
            {...profileData.privateInfo}
            {...profileData.bankDetails}
          />
        );
      case 'salary-info':
        if (!isAdmin) {
          return null;
        }
        if (profileData.salaryInfo) {
          return <SalaryInfoTab initialData={profileData.salaryInfo} />;
        }
        return (
          <Card>
            <CardContent className='py-12 text-center'>
              <p className='text-white/50'>
                Salary information is not available.
              </p>
            </CardContent>
          </Card>
        );
      case 'security':
        if (isEmployee) {
          return <SecurityTab />;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen'>
      <NavigationBar
        isAdmin={isAdmin}
        checkInStatus={checkInStatus}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
      />

      <div className='container mx-auto px-6 py-8'>
        <div className='mb-8'>
          <ProfileHeader profileData={profileData} isEmployee={isEmployee} />
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showSalaryInfo={isAdmin}
            isEmployee={isEmployee}
          />
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
}
