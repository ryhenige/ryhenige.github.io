import { useState, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";

const SERVER_URL = window.location.hostname.includes("localhost")
  ? "ws://localhost:5022/ws"
  : "wss://your-blue-server.fly.dev/ws";

export function useWebSocketChannel(token) {
  const [messages, setMessages] = useState([]);
  const [playerId, setPlayerId] = useState(null);
  const [connected, setConnected] = useState(false);
  const lastGameStateRef = useRef(null);

  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(
    token ? `${SERVER_URL}?token=${token}` : null,
    {
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    setConnected(readyState === 1);
  }, [readyState]);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      if (lastJsonMessage.type === "player_assigned") {
        setPlayerId(lastJsonMessage.playerId);
      } else if (lastJsonMessage.type === "game_state") {
        // Only update if game state actually changed
        const currentGameState = JSON.stringify(lastJsonMessage.players);
        if (lastGameStateRef.current !== currentGameState) {
          lastGameStateRef.current = currentGameState;
          setMessages([lastJsonMessage]); // Keep only latest state
        }
      }
    }
  }, [lastJsonMessage]);

  const sendMessage = (message) => {
    if (connected) {
      sendJsonMessage(message);
    }
  };

  const disconnect = () => {
    const websocket = getWebSocket();
    if (websocket) {
      websocket.close();
    }
  };

  return { messages, sendMessage, playerId, connected, readyState, disconnect };
}
