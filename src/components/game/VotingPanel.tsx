import { useState } from 'react';
import type { Player } from '../../store/types';
import { PlayerCard } from './PlayerCard';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';

interface VotingPanelProps {
  players: Player[];
  currentPlayerId: string;
  onVote: (targetId: string) => void;
  isProcessing: boolean;
}

export function VotingPanel({
  players,
  currentPlayerId,
  onVote,
  isProcessing,
}: VotingPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const voteablePlayers = players.filter((p) => p.id !== currentPlayerId);

  const handleConfirmVote = () => {
    if (selectedId) {
      onVote(selectedId);
    }
  };

  return (
    <GlassCard variant="cyan" padding="lg" className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="font-cyber text-2xl text-neon-cyan uppercase tracking-wider mb-2">
          Cast Your Vote
        </h2>
        <p className="text-text-secondary text-sm">
          Select who you think is the IMPOSTOR
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {voteablePlayers.map((player) => (
          <div
            key={player.id}
            onClick={() => !isProcessing && setSelectedId(player.id)}
            className="cursor-pointer"
          >
            <PlayerCard
              player={player}
              isVotedFor={selectedId === player.id}
            />
          </div>
        ))}
      </div>

      {selectedId && (
        <div className="flex justify-center">
          <NeonButton
            variant="magenta"
            size="lg"
            onClick={handleConfirmVote}
            disabled={isProcessing}
            loading={isProcessing}
          >
            Confirm Vote for {players.find((p) => p.id === selectedId)?.name}
          </NeonButton>
        </div>
      )}

      {!selectedId && (
        <p className="text-center text-text-muted text-sm font-cyber">
          Select a player to vote
        </p>
      )}
    </GlassCard>
  );
}
