import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'teal' | 'rose' | 'amber' | 'indigo' | 'emerald';
  isLoading?: boolean;
  onClick?: () => void;
}

const colorMap = {
  teal: {
    bg: 'bg-teal-50',
    iconBg: 'bg-teal-100 text-teal-700',
    border: 'border-teal-100',
    accent: 'text-teal-700',
  },
  rose: {
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-100 text-rose-700',
    border: 'border-rose-100',
    accent: 'text-rose-700',
  },
  amber: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100 text-amber-700',
    border: 'border-amber-100',
    accent: 'text-amber-700',
  },
  indigo: {
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100 text-indigo-700',
    border: 'border-indigo-100',
    accent: 'text-indigo-700',
  },
  emerald: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-100',
    accent: 'text-emerald-700',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'teal',
  isLoading = false,
  onClick,
}) => {
  const scheme = colorMap[colorScheme] || colorMap.teal;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-teal-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <div className="h-7 w-24 bg-slate-200 rounded-lg animate-pulse my-0.5" />
            ) : (
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
            )}
            {trend && !isLoading && (
              <span
                className={`text-xs font-bold ${
                  trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 pt-0.5">{subtitle}</p>}
        </div>

        <div className={`p-3 rounded-xl ${scheme.iconBg} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
