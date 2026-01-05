import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'

import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { SceneContainer } from './components/StyledComponents'

export default function Scene () {
  useDocumentTitle('Blue')
  return (
    <SceneContainer>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <OrbitControls />
      </Canvas>
    </SceneContainer>
  )
}