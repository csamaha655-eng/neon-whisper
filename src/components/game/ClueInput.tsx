import type { FormEvent } from 'react';
import { useState } from 'react';
import { NeonInput } from '../ui/NeonInput';
import { NeonButton } from '../ui/NeonButton';
import { validateClue } from '../../lib/utils/gameUtils';
import { useGameStore } from '../../store/gameStore';

interface ClueInputProps {
  onSubmit: (clue: string) => void;
}

export function ClueInput({ onSubmit }: ClueInputProps) {
  const [clue, setClue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const secretWord = useGameStore((state) => state.secretWord);
  const humanPlayer = useGameStore((state) =>
    state.players.find((p) => p.id === state.humanPlayerId)
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validation = validateClue(clue, secretWord);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError(undefined);
    onSubmit(clue.trim().toLowerCase());
    setClue('');
  };

  const isImpostor = humanPlayer?.role === 'impostor';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="text-center mb-4">
          <h3 className="font-cyber text-lg text-neon-cyan uppercase tracking-wider mb-2">
            Your Turn
          </h3>
          {isImpostor ? (
            <p className="text-sm text-neon-magenta">
              You are the IMPOSTOR - blend in!
            </p>
          ) : (
            <p className="text-sm text-text-secondary">
              Give a clue for: <span className="text-neon-cyan font-bold">{secretWord}</span>
            </p>
          )}
        </div>

        <NeonInput
          type="text"
          placeholder="Enter one word..."
          value={clue}
          onChange={(e) => {
            setClue(e.target.value);
            setError(undefined);
          }}
          error={error}
          maxLength={20}
          autoFocus
          autoComplete="off"
        />

        <div className="flex gap-3">
          <NeonButton
            type="submit"
            variant="cyan"
            fullWidth
            disabled={!clue.trim()}
          >
            Submit Clue
          </NeonButton>
        </div>

        <p className="text-xs text-text-muted text-center">
          Enter a single word that relates to{' '}
          {isImpostor ? 'the theme' : 'the secret word'}
        </p>
      </div>
    </form>
  );
}
