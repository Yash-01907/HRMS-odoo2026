'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAccessCardType {
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
  card: QuickAccessCardType;
  onLogout?: () => void;
}

export function QuickAccessCard({ card, onLogout }: QuickAccessCardProps) {
  const Icon = card.icon;

  const handleClick = (e: React.MouseEvent) => {
    if (card.action === 'logout' && onLogout) {
      e.preventDefault();
      onLogout();
    }
  };

  return (
    <Link
      href={card.href}
      onClick={handleClick}
      className="group block p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all"
    >
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", card.bgColor)}>
        <Icon className={cn("h-5 w-5", card.color)} />
      </div>
      <h3 className="text-white font-medium mb-1 group-hover:text-white transition-colors">
        {card.title}
      </h3>
      <p className="text-white/50 text-sm">
        {card.description}
      </p>
    </Link>
  );
}
