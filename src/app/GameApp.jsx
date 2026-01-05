import { useState } from 'react';
import Login from './pages/Login';
import BlueScene from './pages/BlueScene';

export default function GameApp() {
  const [authData, setAuthData] = useState(null);

  const handleLoginSuccess = (data) => {
    setAuthData(data);
  };

  const handleLogout = () => {
    setAuthData(null);
  };

  if (!authData) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BlueScene 
      token={authData.token} 
      playerId={authData.playerId}
      onLogout={handleLogout}
    />
  );
}
