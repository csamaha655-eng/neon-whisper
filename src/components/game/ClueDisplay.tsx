import { clsx } from 'clsx';

interface ClueDisplayProps {
  clue: string;
  playerName: string;
  isBot: boolean;
  index: number;
}

export function ClueDisplay({ clue, playerName, isBot, index }: ClueDisplayProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg',
        'bg-cyber-dark/40 border border-cyber-light/20',
        'animate-fade-in'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className={clsx(
          'w-2 h-2 rounded-full',
          isBot ? 'bg-neon-purple' : 'bg-neon-cyan'
        )}
      />
      <span className={clsx(
        'text-sm font-cyber',
        isBot ? 'text-text-secondary' : 'text-neon-cyan'
      )}>
        {playerName}:
      </span>
      <span className="text-text-primary font-mono">"{clue}"</span>
    </div>
  );
}

interface ClueHistoryProps {
  clues: Array<{
    clue: string;
    playerName: string;
    isBot: boolean;
  }>;
}

export function ClueHistory({ clues }: ClueHistoryProps) {
  if (clues.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-muted font-cyber text-sm">
          No clues given yet...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
      {clues.map((item, index) => (
        <ClueDisplay
          key={index}
          clue={item.clue}
          playerName={item.playerName}
          isBot={item.isBot}
          index={index}
        />
      ))}
    </div>
  );
}
