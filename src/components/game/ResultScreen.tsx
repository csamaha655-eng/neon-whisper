import { clsx } from 'clsx';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { PlayerCard } from './PlayerCard';
import { useGameStore } from '../../store/gameStore';

interface ResultScreenProps {
  onPlayAgain: () => void;
}

export function ResultScreen({ onPlayAgain }: ResultScreenProps) {
  const winner = useGameStore((state) => state.winner);
  const players = useGameStore((state) => state.players);
  const humanPlayer = useGameStore((state) =>
    state.players.find((p) => p.id === state.humanPlayerId)
  );
  const impostorId = useGameStore((state) => state.impostorId);
  const secretWord = useGameStore((state) => state.secretWord);
  const voteCounts = useGameStore((state) => state.voteCounts);

  const impostor = players.find((p) => p.id === impostorId);
  const humanWon =
    (winner === 'civilians' && humanPlayer?.role === 'civilian') ||
    (winner === 'impostor' && humanPlayer?.role === 'impostor');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-dark/90 backdrop-blur-md overflow-y-auto">
      <div className="max-w-4xl w-full py-8">
        <GlassCard
          variant={humanWon ? 'cyan' : 'magenta'}
          padding="lg"
          className="text-center"
        >
          {/* Result Banner */}
          <div className="mb-8">
            <div
              className={clsx(
                'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl',
                'border-4',
                humanWon
                  ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_40px_rgba(0,245,255,0.5)]'
                  : 'border-neon-magenta bg-neon-magenta/10 shadow-[0_0_40px_rgba(255,0,255,0.5)]'
              )}
            >
              {humanWon ? '🏆' : '💀'}
            </div>

            <h1
              className={clsx(
                'font-cyber text-4xl font-bold uppercase tracking-wider mb-2',
                humanWon ? 'neon-text-cyan' : 'neon-text-magenta'
              )}
            >
              {humanWon ? 'VICTORY' : 'DEFEAT'}
            </h1>

            <p className="text-text-secondary text-lg">
              {winner === 'civilians'
                ? 'The Impostor was identified!'
                : 'The Impostor escaped detection!'}
            </p>
          </div>

          {/* Secret Word Reveal */}
          <div className="mb-8 p-4 bg-cyber-dark/40 rounded-lg border border-cyber-light/30">
            <p className="text-xs text-text-muted uppercase mb-2">
              The Secret Word Was
            </p>
            <p className="text-neon-cyan font-cyber text-2xl font-bold uppercase">
              {secretWord}
            </p>
          </div>

          {/* Impostor Reveal */}
          <div className="mb-8">
            <p className="text-sm text-text-muted uppercase mb-4">
              The Impostor Was
            </p>
            <div className="flex justify-center">
              <div className="inline-block p-4 bg-neon-magenta/10 rounded-xl border border-neon-magenta/50">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{impostor?.avatar}</span>
                  <div className="text-left">
                    <p className="font-cyber text-neon-magenta font-bold">
                      {impostor?.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {impostor?.isBot ? 'Bot' : '(You)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Players with Votes */}
          <div className="mb-8">
            <p className="text-sm text-text-muted uppercase mb-4">
              Vote Results
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  showRole
                  voteCount={voteCounts[player.id] || 0}
                />
              ))}
            </div>
          </div>

          {/* Play Again Button */}
          <NeonButton
            variant={humanWon ? 'cyan' : 'magenta'}
            size="lg"
            onClick={onPlayAgain}
          >
            Play Again
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
}
