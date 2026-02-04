import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import Layout from './components/Layout';
import Home from './pages/Home';
import HowToPlay from './pages/HowToPlay';
import Whitepaper from './pages/Whitepaper';
import Tokenomics from './pages/Tokenomics';
import GamePage from './pages/GamePage';
import './index.css';

const queryClient = new QueryClient();

function App() {
  const [address, setAddress] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const handleConnect = (addr) => {
    setAddress(addr);
    setIsGuest(false);
  };

  const handleStartGame = () => {
    setGameResult(null);
  };

  const handleGuestPlay = () => {
    const guestId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const guestAddress = `guest_${guestId}`;
    setAddress(guestAddress);
    setIsGuest(true);
    if (!playerName.trim()) {
      setPlayerName(`Guest_${guestId}`);
    }
    setGameResult(null);
  };

  const handleExitGame = () => {
    if (isGuest) {
      setAddress(null);
      setIsGuest(false);
    }
  };

  const handleDeath = (data) => {
    console.log('Player died:', data);
    setGameResult({ type: 'death', data });
  };

  const handleCashOut = (data) => {
    console.log('Cash out:', data);
    setGameResult({ type: 'cashout', data });
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Game Page - No Layout wrapper */}
            <Route
              path="/play"
              element={
                <GamePage
                  address={address}
                  playerName={playerName}
                  isGuest={isGuest}
                  onConnect={handleConnect}
                  onDeath={handleDeath}
                  onCashOut={handleCashOut}
                  onExit={handleExitGame}
                />
              }
            />

            {/* Pages with Layout */}
            <Route
              path="/"
              element={
                <Layout onConnect={handleConnect}>
                  <Home
                    address={address}
                    gameResult={gameResult}
                    setGameResult={setGameResult}
                    playerName={playerName}
                    setPlayerName={setPlayerName}
                    onStartGame={handleStartGame}
                    onGuestPlay={handleGuestPlay}
                  />
                </Layout>
              }
            />
            <Route
              path="/how-to-play"
              element={
                <Layout onConnect={handleConnect}>
                  <HowToPlay />
                </Layout>
              }
            />
            <Route
              path="/whitepaper"
              element={
                <Layout onConnect={handleConnect}>
                  <Whitepaper />
                </Layout>
              }
            />
            <Route
              path="/tokenomics"
              element={
                <Layout onConnect={handleConnect}>
                  <Tokenomics />
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
