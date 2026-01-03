'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface QuickAccessCardData {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  href: string;
  action?: string;
}

interface QuickAccessCardProps {
  card: QuickAccessCardData;
  onLogout: () => void;
}

export function QuickAccessCard({ card, onLogout }: QuickAccessCardProps) {
  const Icon = card.icon;
  const isLogout = card.action === 'logout';

  const cardContent = (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow py-0 ${
        isLogout ? 'hover:border-red-300' : ''
      }`}
    >
      <CardContent className='p-6'>
        <div className={`inline-flex p-3 rounded-lg mb-4 ${card.bgColor}`}>
          <Icon className={`size-6 ${card.color}`} />
        </div>
        <CardTitle className='text-lg mb-2'>{card.title}</CardTitle>
        <p className='text-sm text-gray-600'>{card.description}</p>
      </CardContent>
    </Card>
  );

  if (isLogout) {
    return (
      <button onClick={onLogout} className='text-left'>
        {cardContent}
      </button>
    );
  }

  return <Link href={card.href}>{cardContent}</Link>;
}

