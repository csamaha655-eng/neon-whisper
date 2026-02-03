import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'cyan' | 'magenta';
}

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ label, error, variant = 'cyan', className, ...props }, ref) => {
    const colorClasses = {
      cyan: {
        border: 'border-neon-cyan/30 focus:border-neon-cyan',
        ring: 'focus:ring-neon-cyan/30',
        label: 'text-neon-cyan',
      },
      magenta: {
        border: 'border-neon-magenta/30 focus:border-neon-magenta',
        ring: 'focus:ring-neon-magenta/30',
        label: 'text-neon-magenta',
      },
    };

    const colors = colorClasses[variant];

    return (
      <div className="w-full">
        {label && (
          <label
            className={clsx(
              'block text-sm font-cyber font-medium mb-2 uppercase tracking-wider',
              colors.label
            )}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 rounded-lg',
            'bg-cyber-dark/80 text-text-primary placeholder-text-muted',
            'border transition-all duration-300',
            colors.border,
            'focus:outline-none focus:ring-2',
            colors.ring,
            'focus:shadow-[0_0_20px_rgba(0,245,255,0.2)]',
            'font-cyber',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400 font-mono">{error}</p>
        )}
      </div>
    );
  }
);

NeonInput.displayName = 'NeonInput';
