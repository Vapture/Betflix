import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GlobalStyles from './components/Layout/GlobalStyles';
import Header from './components/Layout/Header';
import styled from 'styled-components';
import AnimatedBackground from './components/Layout/AnimatedBackground';
import BetHistoryModal from './components/User/BetHistoryModal';
import ArchiveModal from './components/User/ArchiveModal';
import { Toaster } from 'react-hot-toast';
import type { Game } from './types';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
`;

function AppContent() {
    const { isAuthenticated } = useAuth();
    const [isBetHistoryOpen, setBetHistoryOpen] = useState(false);
    const [isArchiveOpen, setArchiveOpen] = useState(false);
    const [liveGames, setLiveGames] = useState<Game[]>([]); 
    const [archivedGames, setArchivedGames] = useState<Game[]>([]);

    return (
        <AppContainer>
            <Toaster 
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#1D263B', 
                        color: '#F0F4F8',
                        border: '1px solid var(--border-color)',
                    },
                }}
            />
            <AnimatedBackground />
            <GlobalStyles />
            {isAuthenticated && (
                <Header 
                    onOpenBetHistory={() => setBetHistoryOpen(true)} 
                    onOpenArchive={() => setArchiveOpen(true)}
                    liveGames={liveGames} 
                />
            )}
            <MainContent>
                {isAuthenticated ? (
                    <DashboardPage 
                        liveGames={liveGames} 
                        setLiveGames={setLiveGames} 
                        setArchivedGames={setArchivedGames}
                    />
                ) : (
                    <LoginPage />
                )}
            </MainContent>
            {isAuthenticated && (
                <>
                    <BetHistoryModal 
                        isOpen={isBetHistoryOpen} 
                        onClose={() => setBetHistoryOpen(false)} 
                        liveGames={liveGames}
                    />
                    <ArchiveModal
                        isOpen={isArchiveOpen}
                        onClose={() => setArchiveOpen(false)}
                        archivedGames={archivedGames}
                    />
                </>
            )}
        </AppContainer>
    );
}

function App() {
    return (
        <AppContent />
    );
}

export default App;