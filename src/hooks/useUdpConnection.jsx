import { useState, useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';

const SERVER_URL = window.location.hostname.includes("localhost")
  ? "ws://localhost:5022"
  : "wss://blue.fly.dev";

export function useUdpConnection(token, playerId) {
  const [tickNumber, setTickNumber] = useState(0);
  const lastMessageRef = useRef(null);

  // Use WebSocket for UDP proxy since WebRTC requires complex signaling
  const { sendJsonMessage, lastBinaryMessage, readyState, getWebSocket } = useWebSocket(
    token && playerId ? `${SERVER_URL}/udp-proxy?playerId=${playerId}` : null,
    {
      shouldReconnect: () => true,
    }
  );

  const connected = readyState === 1;

  useEffect(() => {
    if (lastBinaryMessage !== null && lastBinaryMessage !== lastMessageRef.current) {
      lastMessageRef.current = lastBinaryMessage;
      
      try {
        const data = new Uint8Array(lastBinaryMessage);
        if (data.length === 0) return;

        const messageType = data[0];
        const messageData = data.slice(1);
        const json = new TextDecoder().decode(messageData);
        
        if (messageType === 2) { // Welcome message
          const welcome = JSON.parse(json);
          setTickNumber(welcome.tickNumber);
          console.log('Received welcome via UDP proxy:', welcome);
        } else if (messageType === 3) { // Snapshot message
          const snapshot = JSON.parse(json);
          setTickNumber(snapshot.tickNumber);
          console.log('Received snapshot via UDP proxy:', snapshot);
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

  return { connected, tickNumber, sendPosition };
}
