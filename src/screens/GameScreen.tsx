import { useGameStore } from '../store/gameStore';
import { useMultiplayerStore } from '../store/multiplayerStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { useMultiplayerSync } from '../hooks/useMultiplayerSync';
import { GameBoard } from '../components/game/GameBoard';
import { RoleReveal } from '../components/game/RoleReveal';
import { ResultScreen } from '../components/game/ResultScreen';

export function GameScreen() {
  const phase = useGameStore((state) => state.phase);
  const showRoleReveal = useGameStore((state) => state.showRoleReveal);
  const dismissRoleReveal = useGameStore((state) => state.dismissRoleReveal);
  const resetGame = useGameStore((state) => state.resetGame);
  
  const { isMultiplayer } = useMultiplayerSync();
  const multiplayerDismissRoleReveal = useMultiplayerStore((state) => state.dismissRoleReveal);
  const multiplayerSubmitClue = useMultiplayerStore((state) => state.submitClue);
  const multiplayerSubmitVote = useMultiplayerStore((state) => state.submitVote);

  const { handleHumanClue, handleHumanVote } = useGameLoop();

  const handlePlayAgain = () => {
    if (isMultiplayer) {
      // In multiplayer, reset goes back to lobby
      useMultiplayerStore.getState().reset();
    } else {
      resetGame();
    }
  };

  const handleDismissRoleReveal = () => {
    if (isMultiplayer) {
      multiplayerDismissRoleReveal();
    } else {
      dismissRoleReveal();
    }
  };

  const handleClue = (clue: string) => {
    if (isMultiplayer) {
      multiplayerSubmitClue(clue);
    } else {
      handleHumanClue(clue);
    }
  };

  const handleVote = (targetId: string) => {
    if (isMultiplayer) {
      multiplayerSubmitVote(targetId);
    } else {
      handleHumanVote(targetId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Role Reveal Modal */}
      {showRoleReveal && <RoleReveal onDismiss={handleDismissRoleReveal} />}

      {/* Result Screen */}
      {phase === 'result' && <ResultScreen onPlayAgain={handlePlayAgain} />}

      {/* Main Game Board */}
      {(phase === 'round1' || phase === 'round2' || phase === 'voting') && (
        <div className="flex-1 py-4">
          <GameBoard onHumanClue={handleClue} onHumanVote={handleVote} />
        </div>
      )}
    </div>
  );
}
