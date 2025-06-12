import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import { glassEffect } from '../Layout/GlobalStyles';
import type { Bet } from '../../types';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 23, 39, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div<{ isOpen: boolean }>`
  ${glassEffect}
  background: rgba(29, 38, 59, 0.95);
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transform: ${props => (props.isOpen ? 'scale(1)' : 'scale(0.95)')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;

  h2 {
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    svg {
        color: var(--success-green);
    }
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

const BetList = styled.div`
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 1.5rem;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: var(--primary-cyan); border-radius: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
`;

const BetItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  .details {
    font-weight: 500;
  }
  .info {
    display: flex;
    justify-content: space-between;
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }
`;

const Summary = styled.div`
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
  text-align: right;
  font-size: 1.1rem;
  .label {
    color: var(--text-secondary);
  }
  .amount {
    font-weight: 600;
    color: var(--text-primary);
    margin-left: 1rem;
  }
`;

interface SubmissionSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: { totalStake: number; bets: Omit<Bet, 'id'>[] } | null;
}

const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({ isOpen, onClose, data }) => {
    if (!data) return null;

    return (
        <ModalOverlay isOpen={isOpen} onClick={onClose}>
            <ModalContent isOpen={isOpen} onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <h2><FaCheckCircle />Bets Placed Successfully</h2>
                    <FaTimes className="close-button" onClick={onClose} />
                </ModalHeader>
                <BetList>
                    {data.bets.map((bet, index) => (
                        <BetItem key={index}>
                            <div className="details">{bet.gameDetails}</div>
                            <div className="info">
                                <span>{bet.betType} @ {bet.odds}</span>
                                <span>Stake: €{bet.stake.toFixed(2)}</span>
                            </div>
                        </BetItem>
                    ))}
                </BetList>
                <Summary>
                    <span className="label">Total Stake:</span>
                    <span className="amount">€{data.totalStake.toFixed(2)}</span>
                </Summary>
            </ModalContent>
        </ModalOverlay>
    );
};

export default SubmissionSuccessModal;