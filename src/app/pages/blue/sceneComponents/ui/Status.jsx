import styled from 'styled-components'
import { useWebSocketChannel } from '../../hooks/useWebSocketChannel'
import { useUdpConnection } from '../../hooks/useUdpConnection'

const StatusOverlay = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
`

export default function Status({ token, playerId }) {
  const { connected, messages } = useWebSocketChannel(token)
  const { connected: udpConnected, snapshot } = useUdpConnection(token, playerId)

  return (
    <StatusOverlay>
    <div>Player ID: {playerId}</div>
    <div>WS Connected: {connected ? 'Yes' : 'No'}</div>
    <div>UDP Connected: {udpConnected ? 'Yes' : 'No'}</div>
    <div>Players: {snapshot?.players?.length > 0 ? snapshot.players.length : (playerId ? 1 : 0)}</div>
    <div>Messages: {messages.length}</div>
    </StatusOverlay>
  )
}
