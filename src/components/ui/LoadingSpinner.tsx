import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'magenta';
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'cyan',
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const colorClasses = {
    cyan: 'border-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.5)]',
    magenta: 'border-neon-magenta shadow-[0_0_15px_rgba(255,0,255,0.5)]',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={clsx(
          'rounded-full border-4 border-t-transparent animate-spin',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      {text && (
        <p
          className={clsx(
            'font-cyber text-sm uppercase tracking-wider animate-pulse',
            color === 'cyan' ? 'text-neon-cyan' : 'text-neon-magenta'
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}

// Typing indicator variant
export function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-cyber-dark/40 rounded-lg border border-neon-cyan/20">
      <div className="flex gap-1">
        <span
          className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <span className="text-sm text-text-secondary font-cyber">
        <span className="text-neon-cyan">{name}</span> is thinking...
      </span>
    </div>
  );
}
