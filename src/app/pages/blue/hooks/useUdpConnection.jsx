import { useState, useEffect, useRef, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';

const SERVER_URL = window.location.hostname.includes("localhost")
  ? "ws://localhost:5022"
  : "wss://blue.fly.dev";

// Global connection cache to prevent duplicate connections
const connectionCache = new Map();

export function useUdpConnection(token, playerId) {
  const [tickNumber, setTickNumber] = useState(0);
  const [snapshot, setSnapshot] = useState(null);
  const lastMessageRef = useRef(null);
  const instanceId = useRef(Math.random().toString(36).substr(2, 9));

  // Create a stable URL that doesn't change on re-renders
  const webSocketUrl = useMemo(() => {
    const url = token && playerId ? `${SERVER_URL}/udp-proxy?playerId=${playerId}` : null
    return url
  }, [token, playerId])

  // Check if we already have a connection for this playerId
  const existingConnection = connectionCache.get(playerId)
  
  // Always create connection if we don't have one, never pass null to close it
  const shouldCreateConnection = webSocketUrl && !existingConnection
  const shouldMaintainConnection = existingConnection && webSocketUrl

  // Use WebSocket for UDP proxy since WebRTC requires complex signaling
  const { sendJsonMessage, lastBinaryMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    shouldCreateConnection ? webSocketUrl : (shouldMaintainConnection ? webSocketUrl : null),
    {
      shouldReconnect: () => true,
      onOpen: () => {
        if (playerId && !connectionCache.has(playerId)) {
          connectionCache.set(playerId, true);
        }
      },
      onClose: () => {
        // Don't immediately remove from cache, let it timeout
        setTimeout(() => {
          if (connectionCache.get(playerId) === true) {
            connectionCache.delete(playerId);
          }
        }, 5000);
      },
      onError: (event) => {
        console.log(`[${instanceId.current}] UDP WebSocket ERROR for playerId:`, playerId, event);
      }
    }
  );

  const connected = readyState === 1;

  // Handle JSON messages (fallback if server sends JSON instead of binary)
  useEffect(() => {
    if (lastMessage !== null) {
      
      // Check if it's a Blob (binary data)
      if (lastMessage.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const data = new Uint8Array(arrayBuffer);
          
          // Process as binary message
          if (data.length > 0) {
            const messageType = data[0];
            const messageData = data.slice(1);
            const json = new TextDecoder().decode(messageData);
                        
            if (messageType === 2) { // Welcome message
              const welcome = JSON.parse(json);
              setTickNumber(welcome.tickNumber);
            } else if (messageType === 3) { // Snapshot message
              const snapshot = JSON.parse(json);
              setTickNumber(snapshot.tickNumber);
              setSnapshot(snapshot);
            }
          }
        };
        reader.readAsArrayBuffer(lastMessage.data);
      } else {
        // Handle as JSON text
        try {
          const data = JSON.parse(lastMessage.data);
          
          if (data.type === 'snapshot') {
            setTickNumber(data.tickNumber);
            setSnapshot(data);
          } else if (data.type === 'welcome') {
            setTickNumber(data.tickNumber);
          }
        } catch (error) {
          console.error('Error parsing JSON message:', error);
        }
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (lastBinaryMessage !== null && lastBinaryMessage !== undefined && lastBinaryMessage !== lastMessageRef.current) {
      lastMessageRef.current = lastBinaryMessage;
      
      try {
        const data = new Uint8Array(lastBinaryMessage);

        if (data.length === 0) {
          return;
        }
        
        const messageType = data[0];
        const messageData = data.slice(1);
        const json = new TextDecoder().decode(messageData);
                
        if (messageType === 2) { // Welcome message
          const welcome = JSON.parse(json);
          setTickNumber(welcome.tickNumber);
        } else if (messageType === 3) { // Snapshot message
          const snapshot = JSON.parse(json);
          setTickNumber(snapshot.tickNumber);
          setSnapshot(snapshot);
        }
      } catch (error) {
        console.error('Error parsing UDP proxy message:', error);
      }
    }
  }, [lastBinaryMessage]);

  useEffect(() => {
    if (connected && token) {
      // Send HELLO message with ticket
      const sendHello = async () => {
        try {
          const response = await fetch(`${window.location.hostname.includes("localhost") ? "http://localhost:5022" : "https://blue.fly.dev"}/api/udp-ticket`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const ticketData = await response.json();
            
            const helloMessage = JSON.stringify({ ticket: ticketData.ticketId });
            const messageBytes = new TextEncoder().encode(helloMessage);
            const packet = new Uint8Array(messageBytes.length + 1);
            packet[0] = 1; // HELLO message type
            packet.set(messageBytes, 1);
            
            // Send binary message
            const websocket = getWebSocket();
            if (websocket && websocket.readyState === WebSocket.OPEN) {
              websocket.send(packet);
              console.log('Sent HELLO via UDP proxy');
            }
          }
        } catch (error) {
          console.error('Error sending HELLO via UDP proxy:', error);
        }
      };

      sendHello();
    }
  }, [connected, token, getWebSocket]);

  const sendPosition = (x, y, z, rotationY) => {
    if (!connected) {
      console.log('UDP proxy not connected, would send position:', { x, y, z, rotationY });
      return;
    }

    try {
      const inputMessage = JSON.stringify({ x, y, z, rotationY });
      
      // Create message with INPUT type prefix (4)
      const messageBytes = new TextEncoder().encode(inputMessage);
      const packet = new Uint8Array(messageBytes.length + 1);
      packet[0] = 4; // INPUT message type
      packet.set(messageBytes, 1);

      // Send binary message
      const websocket = getWebSocket();
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(packet);
        console.log('Sent position via UDP proxy:', { x, y, z, rotationY });
      }
    } catch (error) {
      console.error('Error sending position via UDP proxy:', error);
    }
  };

  const disconnect = () => {
    const websocket = getWebSocket();
    if (websocket) {
      websocket.close();
    }
  };

  return { connected, tickNumber, snapshot, sendPosition, disconnect };
}
