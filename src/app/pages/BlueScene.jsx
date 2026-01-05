import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import styled from 'styled-components';
import { useWebSocketChannel } from '../../hooks/useWebSocketChannel';

const SceneContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000;
`;

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

function World() {
  return (
    <>
      <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </>
  );
}

export default function BlueScene({ token, playerId }) {
  const { connected, messages } = useWebSocketChannel(token);

  return (
    <SceneContainer>
      <StatusOverlay>
        <div>Player ID: {playerId}</div>
        <div>Connected: {connected ? 'Yes' : 'No'}</div>
        <div>Messages: {messages.length}</div>
      </StatusOverlay>
      
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <World />
      </Canvas>
    </SceneContainer>
  );
}
