import React from 'react';

export type BadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'purple'
  | 'slate'
  | 'amber';

interface BadgeProps {
  variant?: BadgeVariant;
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
  primary: {
    badge: 'bg-teal-50 text-teal-700 border-teal-200/80',
    dot: 'bg-teal-600',
  },
  success: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-600',
  },
  warning: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
  },
  danger: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-600',
  },
  purple: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
    dot: 'bg-purple-600',
  },
  slate: {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dot: 'bg-amber-600',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  pulse = false,
  children,
  className = '',
}) => {
  const styles = variantStyles[variant] || variantStyles.primary;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles.badge} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${styles.dot} opacity-75`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${styles.dot}`} />
        </span>
      )}
      {children}
    </span>
  );
};
