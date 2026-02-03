import { useGameStore } from '../../store/gameStore';

export function Header() {
  const phase = useGameStore((state) => state.phase);
  const currentRound = useGameStore((state) => state.currentRound);
  const currentTurnIndex = useGameStore((state) => state.currentTurnIndex);
  const turnOrder = useGameStore((state) => state.turnOrder);
  const players = useGameStore((state) => state.players);

  const getPhaseText = () => {
    switch (phase) {
      case 'setup':
        return 'SYSTEM INITIALIZATION';
      case 'roleReveal':
        return 'ROLE ASSIGNMENT';
      case 'round1':
      case 'round2':
        return `TRANSMISSION ROUND ${currentRound}`;
      case 'voting':
        return 'THREAT DETECTION';
      case 'result':
        return 'MISSION COMPLETE';
      default:
        return 'NEON WHISPER';
    }
  };

  const getCurrentPlayerName = () => {
    if (phase !== 'round1' && phase !== 'round2') return null;
    const currentPlayerId = turnOrder[currentTurnIndex];
    const currentPlayer = players.find((p) => p.id === currentPlayerId);
    return currentPlayer?.name || null;
  };

  const playerName = getCurrentPlayerName();

  return (
    <header className="relative z-10 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_rgba(0,245,255,0.8)]" />
          <h1 className="font-cyber text-xl font-bold tracking-wider">
            <span className="text-neon-cyan">NEON</span>
            <span className="text-text-primary"> WHISPER</span>
          </h1>
        </div>

        {/* Phase indicator */}
        <div className="flex items-center gap-4">
          {playerName && (
            <div className="text-sm text-text-secondary font-mono">
              Current: <span className="text-neon-cyan">{playerName}</span>
            </div>
          )}
          <div className="px-4 py-2 rounded-lg bg-cyber-dark/60 border border-neon-cyan/30">
            <span className="font-cyber text-sm text-neon-cyan uppercase tracking-wider">
              {getPhaseText()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
