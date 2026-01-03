'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SkillsSectionProps {
  skills: string[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <p className='text-sm text-gray-500 mb-4'>No skills added yet</p>
            <Button variant='outline' className='gap-2'>
              <Plus className='size-4' />
              Add Skills
            </Button>
          </div>
        ) : (
          <div className='space-y-2'>
            {/* Skills list would go here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

