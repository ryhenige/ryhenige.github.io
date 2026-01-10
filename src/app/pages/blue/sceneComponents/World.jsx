import { useMemo } from 'react'
import { Stars } from '@react-three/drei'
import Player from './Player'

export default function World({ snapshot = [], playerId, onPlayerPositionChange }) {

  const players = useMemo(() => snapshot?.players || [], [snapshot])
  // console.log(players)
  
  return (
    <>
      <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade />
      {players?.map((player, index) => {
        const isCurrent = player.id === playerId;
        
        return (
          <Player 
            key={player.id} 
            position={player.position} 
            color={player.color}
            isCurrentPlayer={isCurrent}
            onPositionChange={isCurrent ? onPlayerPositionChange : () => {}}
          />
        );
      })}
    </>
  )
}