import { useGameStore } from '../../store/gameStore';
import { PlayerCard } from './PlayerCard';
import { ClueInput } from './ClueInput';
import { ClueHistory } from './ClueDisplay';
import { VotingPanel } from './VotingPanel';
import { GlassCard } from '../ui/GlassCard';
import { TypingIndicator } from '../ui/LoadingSpinner';

interface GameBoardProps {
  onHumanClue: (clue: string) => void;
  onHumanVote: (targetId: string) => void;
}

export function GameBoard({ onHumanClue, onHumanVote }: GameBoardProps) {
  const phase = useGameStore((state) => state.phase);
  const players = useGameStore((state) => state.players);
  const currentTurnIndex = useGameStore((state) => state.currentTurnIndex);
  const turnOrder = useGameStore((state) => state.turnOrder);
  const humanPlayerId = useGameStore((state) => state.humanPlayerId);
  const isProcessingAI = useGameStore((state) => state.isProcessingAI);
  const currentRound = useGameStore((state) => state.currentRound);
  const secretWord = useGameStore((state) => state.secretWord);
  const humanPlayer = useGameStore((state) =>
    state.players.find((p) => p.id === state.humanPlayerId)
  );

  const currentPlayerId = turnOrder[currentTurnIndex];
  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const isHumanTurn = currentPlayerId === humanPlayerId;
  const isCluePhase = phase === 'round1' || phase === 'round2';
  const isVotingPhase = phase === 'voting';

  // Build clue history
  const clueHistory = players.flatMap((p) =>
    p.clues.map((clue) => ({
      clue,
      playerName: p.name,
      isBot: p.isBot,
    }))
  );

  return (
    <div className="flex flex-col gap-6 p-4 max-w-6xl mx-auto">
      {/* Round Info */}
      {isCluePhase && (
        <div className="text-center">
          <p className="text-text-muted text-sm font-mono">
            Round {currentRound} of 2 • Turn {currentTurnIndex + 1} of {turnOrder.length}
          </p>
          {humanPlayer?.role === 'civilian' && (
            <p className="text-neon-cyan text-sm mt-1">
              Word: <span className="font-bold">{secretWord}</span>
            </p>
          )}
        </div>
      )}

      {/* Players Display */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isCurrentTurn={isCluePhase && player.id === currentPlayerId}
          />
        ))}
      </div>

      {/* Clue History */}
      {isCluePhase && clueHistory.length > 0 && (
        <GlassCard variant="dark" padding="md">
          <h3 className="font-cyber text-sm text-neon-cyan uppercase tracking-wider mb-3">
            Clue History
          </h3>
          <ClueHistory clues={clueHistory} />
        </GlassCard>
      )}

      {/* Current Turn Actions */}
      {isCluePhase && (
        <div className="mt-4">
          {isProcessingAI && currentPlayer ? (
            <div className="flex justify-center">
              <TypingIndicator name={currentPlayer.name} />
            </div>
          ) : isHumanTurn ? (
            <ClueInput onSubmit={onHumanClue} />
          ) : (
            <div className="text-center">
              <p className="text-text-muted font-cyber text-sm">
                Waiting for <span className="text-neon-cyan">{currentPlayer?.name}</span>...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Voting Phase */}
      {isVotingPhase && (
        <VotingPanel
          players={players}
          currentPlayerId={humanPlayerId}
          onVote={onHumanVote}
          isProcessing={isProcessingAI}
        />
      )}
    </div>
  );
}
