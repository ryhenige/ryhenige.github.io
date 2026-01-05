import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import styled from 'styled-components';
import { useWebSocketChannel } from '../../../hooks/useWebSocketChannel';
import { useUdpConnection } from '../../../hooks/useUdpConnection';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { useRef, useEffect } from 'react';

import { SceneContainer } from './components/StyledComponents'

const StatusOverlay = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

function Player({ position, color, isCurrentPlayer, onPositionChange }) {
  const meshRef = useRef();
  const localPositionRef = useRef(position);
  
  // Update local position ref when prop changes
  useEffect(() => {
    localPositionRef.current = position;
  }, [position]);
  
  // Update position when prop changes
  useEffect(() => {
    if (meshRef.current && position) {
      meshRef.current.position.set(...position);
    }
  }, [position]);
  
  // Handle player movement for current player
  const handlePointerMove = (event) => {
    if (!isCurrentPlayer || !meshRef.current) return;
    
    // Movement on X and Y plane (fixed inverted Y)
    const x = (event.clientX / window.innerWidth) * 10 - 5;
    const y = -((event.clientY / window.innerHeight) * 10 - 5); // Inverted Y
    const newPosition = [x, y, 0];
    
    // Update local position immediately for smooth movement
    meshRef.current.position.set(x, y, 0);
    localPositionRef.current = newPosition;
    
    // Send to server
    onPositionChange(newPosition);
  };
  
  useEffect(() => {
    if (isCurrentPlayer) {
      window.addEventListener('pointermove', handlePointerMove);
      return () => window.removeEventListener('pointermove', handlePointerMove);
    }
  }, [isCurrentPlayer, onPositionChange]);

  return (
    <mesh ref={meshRef} position={isCurrentPlayer ? localPositionRef.current : position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={isCurrentPlayer ? 'cyan' : (color || 'blue')} 
      />
    </mesh>
  );
}

function World({ messages, playerId, onPlayerPositionChange }) {
  // Extract players from WebSocket messages
  const players = messages.reduce((acc, message) => {
    if (message.type === 'player_update' || message.type === 'game_state') {
      const serverPlayers = message.players || message.data?.players || [];
      return [...acc, ...serverPlayers];
    }
    return acc;
  }, []);

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
      {players.map((player) => (
        <Player 
          key={player.id} 
          position={player.position} 
          color={player.color}
          isCurrentPlayer={player.id === playerId}
          onPositionChange={player.id === playerId ? onPlayerPositionChange : () => {}}
        />
      ))}
    </>
  );
}

export default function BlueWorld({ token, playerId, onLogout }) {
  useDocumentTitle('Blue');
  const { connected, messages, disconnect } = useWebSocketChannel(token);
  const { connected: udpConnected, sendPosition } = useUdpConnection(token, playerId);

  const handlePlayerPositionChange = (position) => {
    // Send position to UDP server
    const [x, y, z] = position;
    sendPosition(x, y, z, 0); // rotationY = 0 for now
  };

  const handleLogout = () => {
    disconnect();
    onLogout();
  };

  return (
    <SceneContainer>
      <StatusOverlay>
        <div>Player ID: {playerId}</div>
        <div>WS Connected: {connected ? 'Yes' : 'No'}</div>
        <div>UDP Connected: {udpConnected ? 'Yes' : 'No'}</div>
        <div>Messages: {messages.length}</div>
      </StatusOverlay>
      
      <LogoutButton onClick={handleLogout}>
        Logout
      </LogoutButton>
      
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <World 
          messages={messages} 
          playerId={playerId}
          onPlayerPositionChange={handlePlayerPositionChange}
        />
      </Canvas>
    </SceneContainer>
  );
}
