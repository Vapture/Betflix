import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { type Bet, type Game } from '../../types';
import { FaTimes, FaArchive, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { glassEffect } from '../Layout/GlobalStyles';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 23, 39, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
  ${glassEffect}
  background: rgba(29, 38, 59, 0.9);
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  flex-shrink: 0;

  h2 {
    color: var(--text-primary);
    margin: 0;
    text-shadow: 0 0 5px var(--primary-cyan);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .close-button {
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    &:hover {
      color: var(--primary-cyan);
      transform: rotate(90deg);
    }
  }
`;

const ArchiveList = styled.div`
  overflow-y: auto;
  padding-right: 15px;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: var(--primary-cyan); border-radius: 3px; }
`;

const ArchivedGameItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--border-color);
`;

const Teams = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: var(--text-primary);
`;

const FinalScore = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  background-color: rgba(0,0,0,0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
`;

const BetSummary = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const BetRow = styled.div<{ $status: Bet['status'] }>`
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    
    .bet-type {
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .outcome {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: ${({ $status }) => $status === 'won' ? 'var(--success-green)' : 'var(--error-red)'};
    }
`;

const NoBetsMessage = styled.p`
    text-align: center;
    font-style: italic;
    padding: 1rem 0;
`;

interface ArchiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    archivedGames: Game[];
}

const ArchiveModal: React.FC<ArchiveModalProps> = ({ isOpen, onClose, archivedGames }) => {
    const { user } = useAuth();
    const [bets, setBets] = useState<Bet[]>([]);

    useEffect(() => {
        if (isOpen && user) {
            const gameIds = archivedGames.map(g => g.id);
            if (gameIds.length === 0) {
                setBets([]);
                return;
            };

            const fetchBets = async () => {
                const query = gameIds.map(id => `gameId=${id}`).join('&');
                try {
                    const response = await api.get<Bet[]>(`/bets?userId=${user.id}&${query}`);
                    setBets(response.data);
                } catch (error) {
                    console.error("Failed to fetch bets for archived games:", error);
                }
            };
            fetchBets();
        }
    }, [isOpen, user, archivedGames]);
    
    return (
        <ModalOverlay $isOpen={isOpen} onClick={onClose}>
            <ModalContent $isOpen={isOpen} onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <h2><FaArchive /> Archived Games</h2>
                    <FaTimes className="close-button" onClick={onClose} />
                </ModalHeader>
                <ArchiveList>
                    {archivedGames.length > 0 ? archivedGames.map(game => {
                        const gameBets = bets.filter(b => b.gameId === game.id);
                        return (
                            <ArchivedGameItem key={game.id}>
                                <GameInfo>
                                    <Teams>{game.homeTeam} vs {game.awayTeam}</Teams>
                                    <FinalScore>{game.liveState?.homeScore} - {game.liveState?.awayScore}</FinalScore>
                                </GameInfo>
                                <BetSummary>
                                    {gameBets.length > 0 ? gameBets.map(bet => (
                                        <BetRow key={bet.id} $status={bet.status}>
                                            <span className='bet-type'>{bet.betType} (Stake: €{bet.stake.toFixed(2)})</span>
                                            <span className='outcome'>
                                                {bet.status === 'won' ? <FaCheckCircle/> : <FaTimesCircle/>}
                                                {bet.status === 'won' ? `Won €${bet.potentialWin.toFixed(2)}` : 'Lost'}
                                            </span>
                                        </BetRow>
                                    )) : <NoBetsMessage>No bets were placed on this game.</NoBetsMessage>}
                                </BetSummary>
                            </ArchivedGameItem>
                        )
                    }) : <NoBetsMessage>No games have been archived yet.</NoBetsMessage>}
                </ArchiveList>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ArchiveModal;