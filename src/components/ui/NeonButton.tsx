import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'cyan' | 'magenta' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export function NeonButton({
  children,
  variant = 'cyan',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  disabled,
  ...props
}: NeonButtonProps) {
  const baseClasses = `
    relative font-cyber font-semibold uppercase tracking-wider
    rounded-lg transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-dark
  `;

  const variantClasses = {
    cyan: `
      bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/50
      hover:bg-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(0,245,255,0.5)]
      focus:ring-neon-cyan/50
      active:scale-95
    `,
    magenta: `
      bg-neon-magenta/10 text-neon-magenta border border-neon-magenta/50
      hover:bg-neon-magenta/20 hover:border-neon-magenta hover:shadow-[0_0_30px_rgba(255,0,255,0.5)]
      focus:ring-neon-magenta/50
      active:scale-95
    `,
    ghost: `
      bg-transparent text-text-secondary border border-cyber-light
      hover:text-neon-cyan hover:border-neon-cyan/50
      focus:ring-neon-cyan/30
    `,
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
