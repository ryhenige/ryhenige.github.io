import styled from 'styled-components'
import { useWebSocketChannel } from '../../hooks/useWebSocketChannel'


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
`

export default function Logout({token, onLogout }) {
  const { disconnect } = useWebSocketChannel(token)

  const handleLogout = () => {
    disconnect()
    onLogout()
  }

  return (
    <LogoutButton onClick={handleLogout}>
    Logout
    </LogoutButton>
  )
}
