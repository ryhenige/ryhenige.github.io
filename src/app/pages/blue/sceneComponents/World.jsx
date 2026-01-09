import { Stars } from '@react-three/drei'
import Player from './Player'

export default function World({ snapshot, playerId, onPlayerPositionChange }) {
  // Extract players from UDP snapshot
  const players = snapshot?.players || [];
  
  // For now, include current player if no server data yet
  if (players.length === 0 && playerId) {
    players.push({
      id: playerId,
      position: [0, 0, 0],
      color: 'blue'
    });
  }

  return (
    <>
      <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade />
      {players.map((player, index) => (
        <Player 
          key={player.id} 
          position={player.position} 
          color={player.color}
          isCurrentPlayer={player.id === playerId}
          onPositionChange={player.id === playerId ? onPlayerPositionChange : () => {}}
        />
      ))}
    </>
  )
}