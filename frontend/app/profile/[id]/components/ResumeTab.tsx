'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';

interface ResumeTabProps {
  resumeUrl?: string;
  resumeFileName?: string;
}

export function ResumeTab({ resumeUrl, resumeFileName }: ResumeTabProps) {
  const handleUpload = () => {
    // Handle resume upload
    console.log('Upload resume');
  };

  const handleDownload = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  const handleDelete = () => {
    // Handle resume deletion
    console.log('Delete resume');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume</CardTitle>
      </CardHeader>
      <CardContent>
        {resumeUrl && resumeFileName ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/[0.02]'>
              <div className='p-3 bg-blue-500/10 rounded-lg'>
                <FileText className='size-6 text-blue-400' />
              </div>
              <div className='flex-1'>
                <p className='font-medium text-white'>{resumeFileName}</p>
                <p className='text-sm text-white/50'>Resume document</p>
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm' onClick={handleDownload}>
                  <Download className='mr-2 size-4' />
                  Download
                </Button>
                <Button variant='outline' size='sm' onClick={handleDelete}>
                  <Trash2 className='mr-2 size-4' />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='p-4 bg-white/5 rounded-full mb-4'>
              <FileText className='size-12 text-white/40' />
            </div>
            <p className='text-sm text-white/50 mb-4'>
              No resume uploaded yet
            </p>
            <Button onClick={handleUpload} className='gap-2'>
              <Upload className='size-4' />
              Upload Resume
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

