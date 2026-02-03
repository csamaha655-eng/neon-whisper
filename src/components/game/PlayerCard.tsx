import { clsx } from 'clsx';
import type { Player } from '../../store/types';
import { useGameStore } from '../../store/gameStore';

interface PlayerCardProps {
  player: Player;
  isCurrentTurn?: boolean;
  showVoteButton?: boolean;
  onVote?: () => void;
  isVotedFor?: boolean;
  voteCount?: number;
  showRole?: boolean;
}

export function PlayerCard({
  player,
  isCurrentTurn = false,
  showVoteButton = false,
  onVote,
  isVotedFor = false,
  voteCount,
  showRole = false,
}: PlayerCardProps) {
  const impostorId = useGameStore((state) => state.impostorId);
  const isImpostor = player.id === impostorId;

  return (
    <div
      className={clsx(
        'relative p-4 rounded-xl transition-all duration-300',
        'bg-cyber-gray/30 backdrop-blur-sm border',
        isCurrentTurn
          ? 'border-neon-cyan shadow-[0_0_30px_rgba(0,245,255,0.4)] scale-105'
          : 'border-cyber-light/30',
        showVoteButton && 'cursor-pointer hover:border-neon-cyan/50 hover:scale-102',
        isVotedFor && 'border-neon-magenta shadow-[0_0_20px_rgba(255,0,255,0.4)]'
      )}
      onClick={showVoteButton ? onVote : undefined}
    >
      {/* Current turn indicator */}
      {isCurrentTurn && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-neon-cyan/20 border border-neon-cyan rounded-full">
          <span className="text-xs font-cyber text-neon-cyan uppercase tracking-wider">
            Active
          </span>
        </div>
      )}

      {/* Avatar and Name */}
      <div className="flex flex-col items-center gap-3">
        <div
          className={clsx(
            'w-16 h-16 rounded-full flex items-center justify-center text-3xl',
            'bg-cyber-dark/60 border-2',
            isCurrentTurn ? 'border-neon-cyan' : 'border-cyber-light/50',
            showRole && isImpostor && 'border-neon-magenta'
          )}
        >
          {player.avatar}
        </div>

        <div className="text-center">
          <h3
            className={clsx(
              'font-cyber font-bold tracking-wider',
              player.isBot ? 'text-text-secondary' : 'text-neon-cyan',
              showRole && isImpostor && 'text-neon-magenta'
            )}
          >
            {player.name}
          </h3>
          {!player.isBot && (
            <span className="text-xs text-text-muted uppercase">(You)</span>
          )}
          {showRole && (
            <span
              className={clsx(
                'block text-xs font-mono mt-1',
                isImpostor ? 'text-neon-magenta' : 'text-neon-green'
              )}
            >
              {isImpostor ? 'IMPOSTOR' : 'CIVILIAN'}
            </span>
          )}
        </div>
      </div>

      {/* Clues Display */}
      {player.clues.length > 0 && (
        <div className="mt-4 space-y-2">
          {player.clues.map((clue, index) => (
            <div
              key={index}
              className="px-3 py-2 bg-cyber-dark/40 rounded-lg border border-cyber-light/20"
            >
              <span className="text-sm font-mono text-text-primary">
                "{clue}"
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Vote count */}
      {voteCount !== undefined && voteCount > 0 && (
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-neon-magenta flex items-center justify-center">
          <span className="text-sm font-bold text-white">{voteCount}</span>
        </div>
      )}

      {/* Vote button indicator */}
      {showVoteButton && (
        <div className="mt-4 text-center">
          <span className="text-xs text-text-muted uppercase font-cyber">
            Click to vote
          </span>
        </div>
      )}
    </div>
  );
}
