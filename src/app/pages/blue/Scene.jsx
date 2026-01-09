import { Canvas } from '@react-three/fiber'
import { useWebSocketChannel } from './hooks/useWebSocketChannel'
import { useUdpConnection } from './hooks/useUdpConnection'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'

import { SceneContainer } from './components/StyledComponents'
import World from './sceneComponents/World'
import Status from './sceneComponents/ui/Status'
import Logout from './sceneComponents/ui/Logout'

export default function Scene({ token, playerId, onLogout }) {
  useDocumentTitle('Blue')
  const { connected, messages, disconnect } = useWebSocketChannel(token)
  const { connected: udpConnected, snapshot, sendPosition } = useUdpConnection(token, playerId)

  const handlePlayerPositionChange = (position) => {
    const [x, y, z] = position
    sendPosition(x, y, z, 0)
  }

  return (
    <SceneContainer>
      <Status 
        token={token}
        playerId={playerId}
      />
      <Logout 
        token={token}
        onLogout={onLogout}
      />
      
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <World 
          snapshot={snapshot} 
          playerId={playerId} 
          onPlayerPositionChange={handlePlayerPositionChange} 
        />
      </Canvas>
    </SceneContainer>
  )
}
