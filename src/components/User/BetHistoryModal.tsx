import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { type Bet, type Game } from '../../types';
import { FaTimes, FaTrashRestore } from 'react-icons/fa';
import { glassEffect } from '../Layout/GlobalStyles';
import ResetConfirmationModal from './ResetConfirmationModal';

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
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
  ${glassEffect}
  background: rgba(29, 38, 59, 0.85);
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  transform: ${props => props.$isOpen ? 'scale(1)' : 'scale(0.95)'};
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: transform 0.3s ease, opacity 0.3s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  flex-shrink: 0;

  h2 {
    color: var(--text-primary);
    margin: 0;
    text-shadow: 0 0 5px var(--primary-cyan);
  }

  .close-button {
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      color: var(--primary-cyan);
      transform: rotate(90deg);
    }
  }
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  padding-right: 10px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--primary-cyan);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;

  th, td {
    padding: 1rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    vertical-align: middle;
    position: relative;
  }

  th {
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    background: rgba(29, 38, 59, 0.85);
    z-index: 2;
  }

  td {
    color: var(--text-primary);
    .details-primary {
      font-weight: 500;
      display: block;
    }
    .details-secondary {
      display: block;
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin-top: 0.2rem;
    }
  }
  
  tbody tr:last-child td {
      border-bottom: none;
  }
`;

const StatusBadge = styled.span<{ $status: Bet['status'] | 'closed' }>`
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  color: #fff;
  text-align: center;
  min-width: 80px;
  display: inline-block;
  text-transform: uppercase;
  background-color: ${({ $status }) => {
    if ($status === 'won') return 'var(--success-green)';
    if ($status === 'lost') return 'var(--error-red)';
    if ($status === 'closed') return 'rgba(107, 114, 128, 0.8)';
    return 'var(--text-secondary)';
  }};
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

const CellOverlay = styled.div<{ $showText?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(16, 23, 39, 0.6);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 1;
  pointer-events: none;
  
  ${props => props.$showText && css`
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    font-weight: 500;
    font-style: italic;
    font-size: 0.9rem;
    text-align: center;
    padding: 0 1rem;
  `}
`;

const TableRow = styled.tr`
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const ModalFooter = styled.div`
  padding-top: 1.5rem;
  margin-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
`;

const ResetButton = styled.button`
  background: transparent;
  border: 1px solid var(--error-red);
  color: var(--error-red);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: rgba(245, 101, 101, 0.1);
    color: #fc8181;
  }
`;

const CenteredMessage = styled.p`
  text-align: center;
  color: var(--text-secondary);
  padding: 3rem 0;
`;

interface BetHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    liveGames: Game[];
}

const BetHistoryModal: React.FC<BetHistoryModalProps> = ({ isOpen, onClose, liveGames }) => {
    const { user, updateBalance } = useAuth();
    const [bets, setBets] = useState<Bet[]>([]);
    const [loading, setLoading] = useState(false);
    const [isResetModalOpen, setResetModalOpen] = useState(false);

    const liveGameIds = useMemo(() => new Set(liveGames.map(g => g.id)), [liveGames]);

    const fetchBets = useCallback(async () => {
        if (user) {
            setLoading(true);
            try {
                const response = await api.get<Bet[]>(`/bets?userId=${user.id}&_sort=timestamp&_order=desc`);
                setBets(response.data);
            } catch (error) {
                console.error("Failed to fetch bet history:", error);
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        if (isOpen) {
            fetchBets();
        }
    }, [isOpen, fetchBets]);

    const handleResetHistory = async () => {
        if (!user) return;
        
        try {
            const deletePromises = bets.map(bet => api.delete(`/bets/${bet.id}`));
            await Promise.all(deletePromises);
            
            await api.patch(`/users/${user.id}`, { balance: 1000 });
            updateBalance(1000);

            setBets([]);
            setResetModalOpen(false);
            onClose();

        } catch (error) {
            console.error("Failed to reset history:", error);
            alert("An error occurred while resetting your history. Please try again.");
        }
    };

    return (
        <>
            <ModalOverlay $isOpen={isOpen} onClick={onClose}>
                <ModalContent $isOpen={isOpen} onClick={e => e.stopPropagation()}>
                    <ModalHeader>
                        <h2>Bet History</h2>
                        <FaTimes className="close-button" onClick={onClose} />
                    </ModalHeader>
                    <TableWrapper>
                        {loading ? (
                            <CenteredMessage>Loading history...</CenteredMessage>
                        ) : bets.length > 0 ? (
                            <StyledTable>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Details</th>
                                        <th>Stake</th>
                                        <th>Odds</th>
                                        <th>Winnings</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bets.map(bet => {
                                        const isStale = bet.status === 'pending' && !liveGameIds.has(bet.gameId);
                                        const displayStatus = isStale ? 'closed' : (bet.status || 'pending');

                                        return (
                                            <TableRow key={bet.id}>
                                                <td>
                                                    {isStale && <CellOverlay />}
                                                    {new Date(bet.timestamp).toLocaleString([], { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td>
                                                    {isStale && <CellOverlay $showText={true}>Bet not settled. The session may have ended.</CellOverlay>}
                                                    <span className="details-primary">{bet.gameDetails}</span>
                                                    <span className="details-secondary">{bet.betType}</span>
                                                </td>
                                                <td>
                                                    {isStale && <CellOverlay />}
                                                    €{bet.stake.toFixed(2)}
                                                </td>
                                                <td>
                                                    {isStale && <CellOverlay />}
                                                    {bet.odds}
                                                </td>
                                                <td>
                                                    {isStale && <CellOverlay />}
                                                    {bet.status === 'won' ? `€${bet.potentialWin.toFixed(2)}` : '-'}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {isStale && <CellOverlay />}
                                                    <StatusBadge $status={displayStatus}>
                                                        {displayStatus}
                                                    </StatusBadge>
                                                </td>
                                            </TableRow>
                                        );
                                    })}
                                </tbody>
                            </StyledTable>
                        ) : (
                            <CenteredMessage>No bets placed yet.</CenteredMessage>
                        )}
                    </TableWrapper>
                    <ModalFooter>
                        <ResetButton onClick={() => setResetModalOpen(true)}>
                            <FaTrashRestore />
                            Reset History & Balance
                        </ResetButton>
                    </ModalFooter>
                </ModalContent>
            </ModalOverlay>

            <ResetConfirmationModal
                isOpen={isResetModalOpen}
                onClose={() => setResetModalOpen(false)}
                onConfirm={handleResetHistory}
            />
        </>
    );
};

export default BetHistoryModal;