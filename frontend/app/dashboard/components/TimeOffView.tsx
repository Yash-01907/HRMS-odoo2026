'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Plus, X, Check } from 'lucide-react';

interface TimeOffRequest {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'Paid time Off' | 'Sick time off';
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

export function TimeOffView() {
  const [activeSubTab, setActiveSubTab] = useState('time-off');
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<TimeOffRequest[]>(mockTimeOffRequests);

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

  const filteredRequests = requests.filter((req) =>
    req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter((req) => req.status === 'pending');

  return (
    <div className='w-full'>
      {/* Sub-tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className='mb-6'>
        <TabsList>
          <TabsTrigger value='time-off'>Time Off</TabsTrigger>
          <TabsTrigger value='allocation'>Allocation</TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value='time-off' className='mt-0'>
        {/* Action Bar */}
        <div className='flex items-center gap-4 mb-6'>
          <Button>
            <Plus className='mr-2 size-4' />
            NEW
          </Button>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400' />
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
                <h3 className='text-sm font-medium text-gray-700 mb-2'>
                  Paid time Off
                </h3>
                <p className='text-2xl font-semibold text-gray-900'>
                  24 Days Available
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div>
                <h3 className='text-sm font-medium text-gray-700 mb-2'>
                  Sick time off
                </h3>
                <p className='text-2xl font-semibold text-gray-900'>
                  07 Days Available
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Off Requests Table */}
        <Card>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200 bg-gray-50'>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Start Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      End Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Time off Type
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {pendingRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className='px-6 py-12 text-center text-gray-500'>
                        No pending time-off requests found.
                      </td>
                    </tr>
                  ) : (
                    pendingRequests.map((request) => (
                      <tr key={request.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {request.name}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900'>{request.startDate}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900'>{request.endDate}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <Badge variant='outline' className='text-xs'>
                            {request.type}
                          </Badge>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center gap-2'>
                            <Button
                              size='sm'
                              variant='outline'
                              className='h-7 px-3 text-xs text-red-600 border-red-600 hover:bg-red-50'
                              onClick={() => handleReject(request.id)}
                            >
                              <X className='mr-1 size-3' />
                              Reject
                            </Button>
                            <Button
                              size='sm'
                              variant='default'
                              className='h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white'
                              onClick={() => handleApprove(request.id)}
                            >
                              <Check className='mr-1 size-3' />
                              Approve
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value='allocation' className='mt-0'>
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-gray-500'>Allocation view coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}

