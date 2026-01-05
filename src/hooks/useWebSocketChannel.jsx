import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const SERVER_URL = window.location.hostname.includes("localhost")
  ? "ws://localhost:8080/ws"
  : "wss://your-blue-server.fly.dev/ws";

export function useWebSocketChannel(token) {
  const [messages, setMessages] = useState([]);
  const [playerId, setPlayerId] = useState(null);
  const [connected, setConnected] = useState(false);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
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
      } else if (lastJsonMessage.type === "world_update") {
        setMessages((prev) => [...prev, lastJsonMessage]);
      } else if (lastJsonMessage.type === "game_state") {
        setMessages((prev) => [...prev, lastJsonMessage]);
      }
    }
  }, [lastJsonMessage]);

  const sendMessage = (message) => {
    if (connected) {
      sendJsonMessage(message);
    }
  };

  return { messages, sendMessage, playerId, connected, readyState };
}
