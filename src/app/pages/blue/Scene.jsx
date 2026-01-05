import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import styled from 'styled-components';
import { useWebSocketChannel } from '../../../hooks/useWebSocketChannel';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'

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

function World({ messages, playerId }) {
  // Extract players from WebSocket messages
  // This will depend on your server's message format
  const players = messages.reduce((acc, message) => {
    if (message.type === 'player_update' || message.type === 'game_state') {
      // Adjust based on your actual server message format
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
        <mesh key={player.id} position={player.position}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={player.id === playerId ? 'cyan' : (player.color || 'blue')} 
          />
        </mesh>
      ))}
    </>
  );
}

export default function BlueWorld({ token, playerId, onLogout }) {
  useDocumentTitle('Blue');
  const { connected, messages, disconnect } = useWebSocketChannel(token);

  const handleLogout = () => {
    disconnect();
    onLogout();
  };

  return (
    <SceneContainer>
      <StatusOverlay>
        <div>Player ID: {playerId}</div>
        <div>Connected: {connected ? 'Yes' : 'No'}</div>
        <div>Messages: {messages.length}</div>
      </StatusOverlay>
      
      <LogoutButton onClick={handleLogout}>
        Logout
      </LogoutButton>
      
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <World messages={messages} playerId={playerId} />
      </Canvas>
    </SceneContainer>
  );
}
