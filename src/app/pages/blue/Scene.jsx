import { useState } from 'react';
import Login from '../Login';
import BlueWorld from './BlueWorld';

export default function Scene() {
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
    <BlueWorld 
      token={authData.token} 
      playerId={authData.playerId}
      onLogout={handleLogout}
    />
  );
}
