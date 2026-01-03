'use client';

import { useState, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type ComputationType = 'percentage' | 'fixed';

const NUMBER_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const BASIC_SALARY_NAME = 'Basic Salary';
const FIXED_ALLOWANCE_NAME = 'Fixed Allowance';
const HRA_NAME = 'House Rent Allowance';

interface SalaryComponent {
  id: string;
  name: string;
  computationType: ComputationType;
  percentage?: number; // Percentage of wage or percentage of basic (for HRA)
  fixedAmount?: number; // Fixed amount
  baseComponent?: string; // For components like HRA that are % of Basic
  description: string;
  calculatedValue?: number;
}

interface SalaryInfoTabProps {
  initialData?: {
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

const defaultComponents: Omit<SalaryComponent, 'id' | 'calculatedValue'>[] = [
  {
    name: 'Basic Salary',
    computationType: 'percentage',
    percentage: 50,
    description:
      'Define Basic salary from company cost compute it based on monthly Wages',
  },
  {
    name: 'House Rent Allowance',
    computationType: 'percentage',
    percentage: 50,
    baseComponent: 'Basic',
    description: 'HRA provided to employees 50% of the basic salary',
  },
  {
    name: 'Standard Allowance',
    computationType: 'fixed',
    fixedAmount: 4167,
    description:
      'A standard allowance is a predetermined, fixed amount provided to employee as part of their salary',
  },
  {
    name: 'Performance Bonus',
    computationType: 'percentage',
    percentage: 8.33,
    description:
      'Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary',
  },
  {
    name: 'Leave Travel Allowance',
    computationType: 'percentage',
    percentage: 8.33,
    description:
      'LTA is paid by the company to employees to cover their travel expenses. and calculated as a % of the basic salary',
  },
  {
    name: 'Fixed Allowance',
    computationType: 'fixed',
    fixedAmount: 0,
    description:
      'fixed allowance portion of wages is determined after calculating all salary components',
  },
];

export function SalaryInfoTab({ initialData }: SalaryInfoTabProps) {
  const [monthWage, setMonthWage] = useState(initialData?.monthWage ?? 50000);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(
    initialData?.workingDaysPerWeek ?? 5
  );
  const [breakTime, setBreakTime] = useState(initialData?.breakTime ?? 1);
  const [pfRate, setPfRate] = useState(12);
  const [professionalTax, setProfessionalTax] = useState(200);

  const [components, setComponents] = useState<SalaryComponent[]>(() => {
    if (initialData?.salaryComponents) {
      return initialData.salaryComponents.map((comp, idx) => {
        const isStandardAllowance = comp.name === 'Standard Allowance';
        return {
          id: `comp-${idx}`,
          name: comp.name,
          computationType: comp.percentage > 0 ? 'percentage' : 'fixed',
          percentage: comp.percentage > 0 ? comp.percentage : undefined,
          fixedAmount:
            comp.percentage > 0
              ? undefined
              : isStandardAllowance
              ? 4167
              : comp.value,
          baseComponent:
            comp.name === HRA_NAME || comp.name.includes('HRA')
              ? 'Basic'
              : undefined,
          description: comp.description,
        };
      });
    }
    return defaultComponents.map((comp, idx) => ({
      ...comp,
      id: `comp-${idx}`,
      calculatedValue: 0,
    }));
  });

  const yearlyWage = useMemo(() => monthWage * 12, [monthWage]);

  // Calculate component values and extract basicAmount
  const { calculatedComponents, basicAmount } = useMemo(() => {
    const basic = components.find((c) => c.name === BASIC_SALARY_NAME);
    const basicAmount = basic
      ? basic.computationType === 'percentage'
        ? (monthWage * (basic.percentage ?? 0)) / 100
        : basic.fixedAmount ?? 0
      : 0;

    const otherComponents = components
      .filter((c) => c.name !== FIXED_ALLOWANCE_NAME)
      .map((comp) => {
        let value = 0;
        if (comp.computationType === 'percentage') {
          // HRA and any component with baseComponent='Basic' should use basicAmount
          const isBasedOnBasic =
            comp.name === HRA_NAME || comp.baseComponent === 'Basic';
          value = isBasedOnBasic
            ? (basicAmount * (comp.percentage ?? 0)) / 100
            : (monthWage * (comp.percentage ?? 0)) / 100;
        } else {
          // Standard Allowance is always fixed at 4167
          if (comp.name === 'Standard Allowance') {
            value = 4167;
          } else {
            value = comp.fixedAmount ?? 0;
          }
        }
        return { ...comp, calculatedValue: value };
      });

    // Calculate Fixed Allowance (wage - total of all other components)
    const totalOtherComponents = otherComponents.reduce(
      (sum, c) => sum + (c.calculatedValue ?? 0),
      0
    );
    const fixedAllowanceAmount = Math.max(0, monthWage - totalOtherComponents);

    const fixedAllowance = components.find(
      (c) => c.name === FIXED_ALLOWANCE_NAME
    );
    const fixedAllowanceComponent = fixedAllowance
      ? {
          ...fixedAllowance,
          fixedAmount: fixedAllowanceAmount,
          calculatedValue: fixedAllowanceAmount,
        }
      : null;

    // Sort components: Basic Salary first, then others, Fixed Allowance last
    const basicComponent = otherComponents.find(
      (c) => c.name === BASIC_SALARY_NAME
    );
    const sortedComponents = basicComponent
      ? [
          basicComponent,
          ...otherComponents.filter((c) => c.name !== BASIC_SALARY_NAME),
        ]
      : otherComponents;

    return {
      calculatedComponents: fixedAllowanceComponent
        ? [...sortedComponents, fixedAllowanceComponent]
        : sortedComponents,
      basicAmount,
    };
  }, [components, monthWage]);

  // Calculate PF contributions (same formula for both)
  const pfAmount = useMemo(
    () => (basicAmount * pfRate) / 100,
    [basicAmount, pfRate]
  );

  const handleSave = useCallback(() => {
    console.log('Saving salary info', {
      monthWage,
      yearlyWage,
      workingDaysPerWeek,
      breakTime,
      components: calculatedComponents,
      pfRate,
      professionalTax,
    });
  }, [
    monthWage,
    yearlyWage,
    workingDaysPerWeek,
    breakTime,
    calculatedComponents,
    pfRate,
    professionalTax,
  ]);

  const addComponent = useCallback(() => {
    setComponents((prev) => [
      ...prev,
      {
        id: `comp-${Date.now()}`,
        name: '',
        computationType: 'percentage' as const,
        percentage: 0,
        description: '',
        calculatedValue: 0,
      },
    ]);
  }, []);

  // Calculate percentage of wage for display
  const getPercentageOfWage = useCallback(
    (value: number) => (monthWage > 0 ? (value / monthWage) * 100 : 0),
    [monthWage]
  );

  // Format currency helper
  const formatCurrency = useCallback(
    (value: number) => value.toLocaleString('en-IN', NUMBER_FORMAT_OPTIONS),
    []
  );

  return (
    <div className='space-y-6'>
      {/* Wage Information and Working Time */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Wage Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Month Wage
              </label>
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  value={monthWage}
                  onChange={(e) => setMonthWage(Number(e.target.value))}
                  className='flex-1'
                />
                <span className='text-sm text-white/50'>/ Month</span>
              </div>
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Yearly wage
              </label>
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  value={yearlyWage}
                  readOnly
                  className='flex-1 bg-white/5'
                />
                <span className='text-sm text-white/50'>/ Yearly</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Working Days/Time</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                No of working days in a week
              </label>
              <Input
                type='number'
                value={workingDaysPerWeek || ''}
                onChange={(e) => setWorkingDaysPerWeek(Number(e.target.value))}
                placeholder='Not specified'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-white/90 mb-1 block'>
                Break Time
              </label>
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  value={breakTime || ''}
                  onChange={(e) => setBreakTime(Number(e.target.value))}
                  placeholder='Not specified'
                  className='flex-1'
                />
                <span className='text-sm text-white/50'>/hrs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Components and PF/Tax - Two Column Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Left Column - Salary Components */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Salary Components</CardTitle>
              <Button onClick={addComponent} size='sm' variant='outline'>
                <Plus className='mr-2 size-4' />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {calculatedComponents.map((component) => {
              const displayValue = component.calculatedValue || 0;
              const percentage = getPercentageOfWage(displayValue);

              return (
                <div
                  key={component.id}
                  className='border-b border-white/10 pb-4 last:border-0 last:pb-0'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex-1'>
                      <h3 className='font-medium text-white text-base mb-1'>
                        {component.name}
                      </h3>
                    </div>
                    <div className='text-right ml-4'>
                      <p className='font-semibold text-white text-base'>
                        {formatCurrency(displayValue)} ₹ / month
                      </p>
                      <p className='text-xs text-white/50 mt-0.5'>
                        {percentage.toFixed(2)} %
                      </p>
                    </div>
                  </div>
                  <p className='text-xs text-white/70'>
                    {component.description}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right Column - PF Contribution and Tax Deductions */}
        <div className='space-y-6'>
          {/* PF Contribution */}
          <Card>
            <CardHeader>
              <CardTitle>Provident Fund (PF) Contribution</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-white/90 mb-1 block'>
                  PF Rate (%)
                </label>
                <Input
                  type='number'
                  value={pfRate}
                  onChange={(e) => setPfRate(Number(e.target.value))}
                  placeholder='12'
                  className='mb-4'
                />
              </div>

              <div className='space-y-4'>
                {(['Employee', 'Employer'] as const).map((type) => (
                  <div
                    key={type}
                    className={
                      type === 'Employee' ? 'border-b border-white/10 pb-4' : ''
                    }
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <h3 className='font-medium text-white capitalize'>
                        {type}
                      </h3>
                      <div className='text-right'>
                        <p className='font-semibold text-white'>
                          {formatCurrency(pfAmount)} ₹ / month
                        </p>
                        <p className='text-xs text-white/50 mt-0.5'>
                          {pfRate.toFixed(2)} %
                        </p>
                      </div>
                    </div>
                    <p className='text-xs text-white/70'>
                      PF is calculated based on the basic salary
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tax Deductions */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='mb-4'>
                <label className='text-sm font-medium text-white/90 mb-1 block'>
                  Professional Tax (₹/month)
                </label>
                <Input
                  type='number'
                  value={professionalTax}
                  onChange={(e) => setProfessionalTax(Number(e.target.value))}
                  placeholder='200'
                />
              </div>

              <div className='border-t border-white/10 pt-4'>
                <div className='flex items-start justify-between mb-2'>
                  <h3 className='font-medium text-white'>Professional Tax</h3>
                  <p className='font-semibold text-white'>
                    {formatCurrency(professionalTax)} ₹ / month
                  </p>
                </div>
                <p className='text-xs text-white/70'>
                  Professional Tax deducted from the Gross salary
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className='flex justify-end'>
        <Button
          onClick={handleSave}
          className='bg-linear-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 border-0 text-white'
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
