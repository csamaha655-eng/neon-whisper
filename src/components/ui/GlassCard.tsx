import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'cyan' | 'magenta';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
}: GlassCardProps) {
  const baseClasses = 'rounded-xl backdrop-blur-xl transition-all duration-300';

  const variantClasses = {
    default: 'bg-cyber-gray/40 border border-neon-cyan/20',
    dark: 'bg-cyber-dark/60 border border-neon-cyan/15',
    cyan: 'bg-cyber-gray/40 border border-neon-cyan/50 shadow-[0_0_20px_rgba(0,245,255,0.2)]',
    magenta: 'bg-cyber-gray/40 border border-neon-magenta/50 shadow-[0_0_20px_rgba(255,0,255,0.2)]',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  const hoverClasses = hover
    ? 'hover:border-neon-cyan/60 hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] cursor-pointer'
    : '';

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
