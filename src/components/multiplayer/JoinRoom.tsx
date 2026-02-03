import { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { NeonInput } from '../ui/NeonInput';
import { useMultiplayerStore } from '../../store/multiplayerStore';

interface JoinRoomProps {
  onJoined: () => void;
  onBack: () => void;
}

export function JoinRoom({ onJoined, onBack }: JoinRoomProps) {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const { joinRoom, connect, roomCode: joinedRoomCode } = useMultiplayerStore();

  // Check for room code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoomCode(roomParam.toUpperCase());
    }
  }, []);

  // Listen for successful join
  useEffect(() => {
    if (joinedRoomCode) {
      onJoined();
    }
  }, [joinedRoomCode, onJoined]);

  const handleJoin = () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    connect();
    joinRoom(roomCode.toUpperCase().trim(), playerName.trim());
  };

  return (
    <GlassCard variant="cyan" padding="lg" className="max-w-lg w-full">
      <div className="text-center mb-8">
        <h2 className="font-cyber text-2xl font-bold tracking-wider mb-2">
          <span className="text-neon-cyan">JOIN</span>
          <span className="text-text-primary"> ROOM</span>
        </h2>
        <p className="text-text-secondary text-sm">
          Enter the room code from your friend
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <NeonInput
          label="Room Code"
          placeholder="Enter 6-letter code..."
          value={roomCode}
          onChange={(e) => {
            setRoomCode(e.target.value.toUpperCase().slice(0, 6));
            setError('');
          }}
          maxLength={6}
        />
      </div>

      <div className="mb-8">
        <NeonInput
          label="Your Name"
          placeholder="Enter your name..."
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            setError('');
          }}
          maxLength={12}
        />
      </div>

      <div className="flex gap-3">
        <NeonButton variant="cyan" fullWidth onClick={handleJoin}>
          Join Room
        </NeonButton>
        <NeonButton variant="cyan" onClick={onBack}>
          Back
        </NeonButton>
      </div>
    </GlassCard>
  );
}

