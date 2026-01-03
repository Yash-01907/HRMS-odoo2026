'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CertificationSectionProps {
  certifications: string[];
}

export function CertificationSection({
  certifications,
}: CertificationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certification</CardTitle>
      </CardHeader>
      <CardContent>
        {certifications.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <p className='text-sm text-gray-500 mb-4'>
              No certifications added yet
            </p>
            <Button variant='outline' className='gap-2'>
              <Plus className='size-4' />
              Add Certification
            </Button>
          </div>
        ) : (
          <div className='space-y-2'>
            {/* Certifications list would go here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

