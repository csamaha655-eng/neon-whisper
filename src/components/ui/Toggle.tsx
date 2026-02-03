import { clsx } from 'clsx';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleProps) {
  return (
    <div className="flex items-start gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full',
          'border-2 transition-all duration-300 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-2 focus:ring-offset-cyber-dark',
          checked
            ? 'bg-neon-cyan/20 border-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.4)]'
            : 'bg-cyber-dark border-cyber-light',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={clsx(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full',
            'shadow-lg ring-0 transition-all duration-300 ease-in-out mt-0.5',
            checked
              ? 'translate-x-7 bg-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.8)]'
              : 'translate-x-0.5 bg-text-muted'
          )}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-cyber font-medium text-text-primary uppercase tracking-wider">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-text-secondary mt-1">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
