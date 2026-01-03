'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Plus, Upload, X, Check } from 'lucide-react';

interface TimeOffViewProps {
  isAdmin?: boolean;
}

interface TimeOffRequest {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'Paid time Off' | 'Sick time off' | 'Unpaid Leaves';
  status: 'pending' | 'approved' | 'rejected';
}

const mockTimeOffRequests: TimeOffRequest[] = [
  {
    id: '1',
    name: 'John Doe',
    startDate: '28/10/2025',
    endDate: '28/10/2025',
    type: 'Paid time Off',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Jane Smith',
    startDate: '01/11/2025',
    endDate: '05/11/2025',
    type: 'Sick time off',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    startDate: '10/11/2025',
    endDate: '12/11/2025',
    type: 'Paid time Off',
    status: 'pending',
  },
];

export function TimeOffView({ isAdmin = false }: TimeOffViewProps) {
  const [activeSubTab, setActiveSubTab] = useState('time-off');
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] =
    useState<TimeOffRequest[]>(mockTimeOffRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee: '[Employee]',
    timeOffType: 'Paid time Off',
    startDate: '',
    endDate: '',
    allocation: '',
    attachment: null as File | null,
  });

  const timeOffTypes: TimeOffRequest['type'][] = [
    'Paid time Off',
    'Sick time off',
    'Unpaid Leaves',
  ];

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays.toFixed(2);
  };

  const handleSubmit = () => {
    if (!formData.startDate || !formData.endDate) {
      alert('Please select start and end dates');
      return;
    }

    const newRequest: TimeOffRequest = {
      id: Date.now().toString(),
      name: formData.employee,
      startDate: new Date(formData.startDate).toLocaleDateString('en-GB'),
      endDate: new Date(formData.endDate).toLocaleDateString('en-GB'),
      type: formData.timeOffType as TimeOffRequest['type'],
      status: 'pending',
    };

    setRequests((prev) => [newRequest, ...prev]);
    setIsDialogOpen(false);
    setFormData({
      employee: '[Employee]',
      timeOffType: 'Paid time Off',
      startDate: '',
      endDate: '',
      allocation: '',
      attachment: null,
    });
  };

  const handleDiscard = () => {
    setIsDialogOpen(false);
    setFormData({
      employee: '[Employee]',
      timeOffType: 'Paid time Off',
      startDate: '',
      endDate: '',
      allocation: '',
      attachment: null,
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (updated.startDate && updated.endDate) {
        updated.allocation = calculateDays(updated.startDate, updated.endDate);
      } else {
        updated.allocation = '';
      }
      return updated;
    });
  };

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'approved' as const } : req
      )
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Admin view shows only pending requests, employee view shows all
  const displayRequests = isAdmin
    ? filteredRequests.filter((req) => req.status === 'pending')
    : filteredRequests;

  const getStatusBadge = (status: TimeOffRequest['status']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className='bg-emerald-500/20 text-emerald-400 border-emerald-500/30'>
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className='bg-rose-500/20 text-rose-400 border-rose-500/30'>
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className='bg-amber-500/20 text-amber-400 border-amber-500/30'>
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className='w-full'>
      {/* Sub-tabs */}
      <Tabs
        value={activeSubTab}
        onValueChange={setActiveSubTab}
        className='mb-6'
      >
        <TabsList>
          <TabsTrigger value='time-off'>Time Off</TabsTrigger>
          <TabsTrigger value='allocation'>Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value='time-off' className='mt-0'>
          {/* Action Bar */}
          <div className='flex items-center gap-4 mb-6'>
            {!isAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className='mr-2 size-4' />
                    NEW
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-md'>
                  <DialogHeader>
                    <DialogTitle>Time off Type Request</DialogTitle>
                  </DialogHeader>
                  <div className='space-y-4 py-4'>
                    <div>
                      <label className='text-sm font-medium text-white/90 block mb-1'>
                        Employee
                      </label>
                      <Input
                        value={formData.employee}
                        readOnly
                        className='bg-white/5'
                      />
                    </div>
                    <div>
                      <label className='text-sm font-medium text-white/90 block mb-1'>
                        Time off Type
                      </label>
                      <select
                        value={formData.timeOffType}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            timeOffType: e.target.value,
                          }))
                        }
                        className='w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50'
                      >
                        {timeOffTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-white/90 block mb-1'>
                        Validity Period
                      </label>
                      <div className='grid grid-cols-2 gap-2'>
                        <Input
                          type='date'
                          value={formData.startDate}
                          onChange={(e) =>
                            handleDateChange('startDate', e.target.value)
                          }
                        />
                        <Input
                          type='date'
                          value={formData.endDate}
                          onChange={(e) =>
                            handleDateChange('endDate', e.target.value)
                          }
                          min={formData.startDate}
                        />
                      </div>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-white/90 block mb-1'>
                        Allocation
                      </label>
                      <Input
                        value={
                          formData.allocation
                            ? `${formData.allocation} Days`
                            : '0.00 Days'
                        }
                        readOnly
                        className='bg-white/5'
                      />
                    </div>
                    <div>
                      <label className='text-sm font-medium text-white/90 block mb-1'>
                        Attachment:
                        <span className='text-white/50 text-xs ml-1'>
                          (For sick leave certificate)
                        </span>
                      </label>
                      <div className='relative'>
                        <Input
                          type='file'
                          accept='.pdf,.jpg,.jpeg,.png'
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              attachment: e.target.files?.[0] || null,
                            }))
                          }
                          className='pr-10'
                        />
                        <Upload className='absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-white/40 pointer-events-none' />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className='gap-2'>
                    <Button variant='outline' onClick={handleDiscard}>
                      Discard
                    </Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-white/40' />
              <Input
                type='search'
                placeholder='Searchbar'
                className='pl-10'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <Card>
              <CardContent className='pt-6'>
                <div>
                  <h3 className='text-sm font-medium text-white/70 mb-2'>
                    Paid time Off
                  </h3>
                  <p className='text-2xl font-semibold text-white'>
                    24 Days Available
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div>
                  <h3 className='text-sm font-medium text-white/70 mb-2'>
                    Sick time off
                  </h3>
                  <p className='text-2xl font-semibold text-white'>
                    07 Days Available
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Off Requests Table */}
          <Card className='mb-6'>
            <CardContent className='p-0'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-white/10 bg-white/5'>
                      <th className='px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider'>
                        Name
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider'>
                        Start Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider'>
                        End Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider'>
                        Time off Type
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider'>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-white/10'>
                    {displayRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className='px-6 py-12 text-center text-white/50'
                        >
                          {isAdmin
                            ? 'No pending time-off requests found.'
                            : 'No time-off requests found.'}
                        </td>
                      </tr>
                    ) : (
                      displayRequests.map((request) => (
                        <tr key={request.id} className='hover:bg-white/5'>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm font-medium text-white'>
                              {request.name}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm text-white/90'>
                              {request.startDate}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm text-white/90'>
                              {request.endDate}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <Badge variant='outline' className='text-xs'>
                              {request.type}
                            </Badge>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            {isAdmin ? (
                              <div className='flex items-center gap-2'>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  className='h-7 px-3 text-xs text-rose-400 border-rose-500/50 hover:bg-rose-500/20 hover:border-rose-500/70'
                                  onClick={() => handleReject(request.id)}
                                >
                                  <X className='mr-1 size-3' />
                                  Reject
                                </Button>
                                <Button
                                  size='sm'
                                  variant='default'
                                  className='h-7 px-3 text-xs bg-emerald-500/80 hover:bg-emerald-500 text-white'
                                  onClick={() => handleApprove(request.id)}
                                >
                                  <Check className='mr-1 size-3' />
                                  Approve
                                </Button>
                              </div>
                            ) : (
                              getStatusBadge(request.status)
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* TimeOff Types Info Box - Only for Employee View */}
          {!isAdmin && (
            <Card>
              <CardContent className='pt-6'>
                <h3 className='text-sm font-medium text-white/90 mb-3'>
                  TimeOff Types:
                </h3>
                <ul className='space-y-1 text-sm text-white/70'>
                  <li>- Paid Time off</li>
                  <li>- Sick Leave</li>
                  <li>- Unpaid Leaves</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='allocation' className='mt-0'>
          <Card>
            <CardContent className='py-12 text-center'>
              <p className='text-white/50'>Allocation view coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
