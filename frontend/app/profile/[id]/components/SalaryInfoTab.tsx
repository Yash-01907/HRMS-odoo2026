'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

type ComputationType = 'percentage' | 'fixed';

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
  const [monthWage, setMonthWage] = useState(initialData?.monthWage || 50000);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(
    initialData?.workingDaysPerWeek || 5
  );
  const [breakTime, setBreakTime] = useState(initialData?.breakTime || 1);
  const [pfRate, setPfRate] = useState(12);
  const [professionalTax, setProfessionalTax] = useState(200);
  const [components, setComponents] = useState<SalaryComponent[]>(() => {
    if (initialData?.salaryComponents) {
      return initialData.salaryComponents.map((comp, idx) => ({
        id: `comp-${idx}`,
        name: comp.name,
        computationType: comp.percentage > 0 ? 'percentage' : 'fixed',
        percentage: comp.percentage > 0 ? comp.percentage : undefined,
        fixedAmount: comp.percentage > 0 ? undefined : comp.value,
        baseComponent: comp.name.includes('HRA') ? 'Basic' : undefined,
        description: comp.description,
      }));
    }
    return defaultComponents.map((comp, idx) => ({
      ...comp,
      id: `comp-${idx}`,
      calculatedValue: 0,
    }));
  });

  const yearlyWage = useMemo(() => monthWage * 12, [monthWage]);

  // Calculate component values
  const calculatedComponents = useMemo(() => {
    const basic = components.find((c) => c.name === 'Basic Salary');
    const basicAmount = basic
      ? basic.computationType === 'percentage'
        ? (monthWage * (basic.percentage || 0)) / 100
        : basic.fixedAmount || 0
      : 0;

    const otherComponents = components
      .filter((c) => c.name !== 'Fixed Allowance')
      .map((comp) => {
        let value = 0;
        if (comp.computationType === 'percentage') {
          if (comp.baseComponent === 'Basic') {
            // HRA is % of Basic
            value = (basicAmount * (comp.percentage || 0)) / 100;
          } else {
            // Percentage of wage
            value = (monthWage * (comp.percentage || 0)) / 100;
          }
        } else {
          value = comp.fixedAmount || 0;
        }
        return { ...comp, calculatedValue: value };
      });

    // Calculate Fixed Allowance (wage - total of all other components)
    const totalOtherComponents = otherComponents.reduce(
      (sum, c) => sum + (c.calculatedValue || 0),
      0
    );
    const fixedAllowanceAmount = Math.max(0, monthWage - totalOtherComponents);

    const fixedAllowance = components.find((c) => c.name === 'Fixed Allowance');
    const fixedAllowanceComponent = fixedAllowance
      ? {
          ...fixedAllowance,
          fixedAmount: fixedAllowanceAmount,
          calculatedValue: fixedAllowanceAmount,
        }
      : null;

    return fixedAllowanceComponent
      ? [...otherComponents, fixedAllowanceComponent]
      : otherComponents;
  }, [components, monthWage]);

  // Calculate PF contributions
  const basicAmount = useMemo(() => {
    const basic = calculatedComponents.find((c) => c.name === 'Basic Salary');
    return basic?.calculatedValue || 0;
  }, [calculatedComponents]);

  const pfEmployeeAmount = useMemo(
    () => (basicAmount * pfRate) / 100,
    [basicAmount, pfRate]
  );
  const pfEmployerAmount = useMemo(
    () => (basicAmount * pfRate) / 100,
    [basicAmount, pfRate]
  );

  const handleSave = () => {
    // Handle save logic
    console.log('Saving salary info', {
      monthWage,
      yearlyWage,
      workingDaysPerWeek,
      breakTime,
      components: calculatedComponents,
      pfRate,
      professionalTax,
    });
  };

  const updateComponent = (id: string, updates: Partial<SalaryComponent>) => {
    setComponents((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp))
    );
  };

  const addComponent = () => {
    setComponents((prev) => [
      ...prev,
      {
        id: `comp-${Date.now()}`,
        name: '',
        computationType: 'percentage',
        percentage: 0,
        description: '',
        calculatedValue: 0,
      },
    ]);
  };

  const removeComponent = (id: string) => {
    const component = components.find((c) => c.id === id);
    if (component?.name === 'Fixed Allowance') {
      return; // Don't allow removing Fixed Allowance
    }
    setComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  // Calculate percentage of wage for display
  const getPercentageOfWage = (value: number) => {
    return monthWage > 0 ? (value / monthWage) * 100 : 0;
  };

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
          <CardContent className='space-y-6'>
            {calculatedComponents.map((component) => {
              const isFixedAllowance = component.name === 'Fixed Allowance';
              const displayValue = component.calculatedValue || 0;
              const percentage = getPercentageOfWage(displayValue);

              return (
                <div
                  key={component.id}
                  className='border-b last:border-0 pb-4 last:pb-0'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex-1'>
                      <h3 className='font-medium text-white text-base'>
                        {component.name}
                      </h3>
                    </div>
                    <div className='text-right ml-4'>
                      <p className='font-semibold text-white text-base'>
                        ₹
                        {displayValue.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className='text-xs text-white/50 mt-0.5'>
                        {percentage.toFixed(2)} %
                      </p>
                    </div>
                  </div>
                  <p className='text-xs text-white/50 mb-1'>₹ / month</p>
                  <p className='text-xs text-white/70'>
                    {component.description}
                  </p>

                  {/* Edit controls (hidden by default, show on hover or make toggleable) */}
                  <div className='mt-2 pt-2 border-t border-white/10'>
                    <div className='grid grid-cols-2 gap-2 text-xs'>
                      <div>
                        <label className='text-white/70'>Type</label>
                        <select
                          value={component.computationType}
                          onChange={(e) =>
                            updateComponent(component.id, {
                              computationType: e.target
                                .value as ComputationType,
                            })
                          }
                          className='w-full h-7 rounded border border-white/10 px-2 text-xs mt-1'
                          disabled={isFixedAllowance}
                        >
                          <option value='percentage'>Percentage</option>
                          <option value='fixed'>Fixed</option>
                        </select>
                      </div>
                      <div>
                        <label className='text-white/70'>
                          {component.computationType === 'percentage'
                            ? '%'
                            : 'Amount'}
                        </label>
                        {component.computationType === 'percentage' ? (
                          <Input
                            type='number'
                            value={component.percentage || ''}
                            onChange={(e) =>
                              updateComponent(component.id, {
                                percentage: Number(e.target.value),
                              })
                            }
                            className='h-7 text-xs mt-1'
                            disabled={isFixedAllowance}
                          />
                        ) : (
                          <Input
                            type='number'
                            value={component.fixedAmount || ''}
                            onChange={(e) =>
                              updateComponent(component.id, {
                                fixedAmount: Number(e.target.value),
                              })
                            }
                            className='h-7 text-xs mt-1'
                            disabled={isFixedAllowance}
                          />
                        )}
                      </div>
                    </div>
                    {!isFixedAllowance && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => removeComponent(component.id)}
                        className='mt-2 h-7 text-xs text-red-500 hover:text-red-700'
                      >
                        <Trash2 className='mr-1 size-3' />
                        Remove
                      </Button>
                    )}
                  </div>
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
                <div className='border-b pb-4'>
                  <div className='flex items-start justify-between mb-2'>
                    <h3 className='font-medium text-white capitalize'>
                      Employee
                    </h3>
                    <div className='text-right'>
                      <p className='font-semibold text-white'>
                        ₹
                        {pfEmployeeAmount.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className='text-xs text-white/50 mt-0.5'>
                        {pfRate.toFixed(2)} %
                      </p>
                    </div>
                  </div>
                  <p className='text-xs text-white/50 mb-1'>₹ / month</p>
                  <p className='text-xs text-white/70'>
                    PF is calculated based on the basic salary
                  </p>
                </div>

                <div>
                  <div className='flex items-start justify-between mb-2'>
                    <h3 className='font-medium text-white capitalize'>
                      Employer
                    </h3>
                    <div className='text-right'>
                      <p className='font-semibold text-white'>
                        ₹
                        {pfEmployerAmount.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className='text-xs text-white/50 mt-0.5'>
                        {pfRate.toFixed(2)} %
                      </p>
                    </div>
                  </div>
                  <p className='text-xs text-white/50 mb-1'>₹ / month</p>
                  <p className='text-xs text-white/70'>
                    PF is calculated based on the basic salary
                  </p>
                </div>
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

              <div className='border-t pt-4'>
                <div className='flex items-start justify-between mb-2'>
                  <h3 className='font-medium text-white'>
                    Professional Tax
                  </h3>
                  <p className='font-semibold text-white'>
                    ₹
                    {professionalTax.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <p className='text-xs text-white/50 mb-1'>₹ / month</p>
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
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
