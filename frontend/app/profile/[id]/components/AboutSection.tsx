'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AboutSectionProps {
  about: string;
  jobLove: string;
  interests: string;
}

export function AboutSection({
  about,
  jobLove,
  interests,
}: AboutSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div>
          <h3 className='text-sm font-semibold text-gray-900 mb-2'>About</h3>
          <p className='text-sm text-gray-600 leading-relaxed'>{about}</p>
        </div>
        <div>
          <h3 className='text-sm font-semibold text-gray-900 mb-2'>
            What I love about my job
          </h3>
          <p className='text-sm text-gray-600 leading-relaxed'>{jobLove}</p>
        </div>
        <div>
          <h3 className='text-sm font-semibold text-gray-900 mb-2'>
            My interests and hobbies
          </h3>
          <p className='text-sm text-gray-600 leading-relaxed'>{interests}</p>
        </div>
      </CardContent>
    </Card>
  );
}

