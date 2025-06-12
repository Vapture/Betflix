import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaTrophy, FaRegFrown } from 'react-icons/fa';
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
  z-index: 1100;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div<{ isOpen: boolean; status: 'won' | 'lost' }>`
  ${glassEffect}
  background: rgba(29, 38, 59, 0.95);
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transform: ${props => (props.isOpen ? 'scale(1)' : 'scale(0.95)')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease;
  border-top: 5px solid ${props => props.status === 'won' ? 'var(--success-green)' : 'var(--error-red)'};
`;

const CloseButton = styled(FaTimes)`
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      color: var(--primary-cyan);
      transform: rotate(90deg);
    }
`;

const IconWrapper = styled.div<{ status: 'won' | 'lost' }>`
    font-size: 4rem;
    margin-bottom: 1.5rem;
    color: ${props => props.status === 'won' ? 'var(--success-green)' : 'var(--error-red)'};
    text-shadow: 0 0 20px ${props => props.status === 'won' ? 'rgba(72, 187, 120, 0.5)' : 'rgba(245, 101, 101, 0.5)'};
`;

const Title = styled.h2`
  font-size: 2rem;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

const Amount = styled.p<{ status: 'won' | 'lost' }>`
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: ${props => props.status === 'won' ? 'var(--success-green)' : 'var(--error-red)'};
`;

const BetDetails = styled.div`
    font-size: 0.9rem;
    color: var(--text-secondary);
    .game {
        font-weight: 500;
        color: var(--text-primary);
    }
`;

interface BetResolutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: { status: 'won' | 'lost'; bet: Bet } | null;
}

const BetResolutionModal: React.FC<BetResolutionModalProps> = ({ isOpen, onClose, result }) => {
    if (!result) return null;

    const { status, bet } = result;
    const isWin = status === 'won';

    return (
        <ModalOverlay isOpen={isOpen} onClick={onClose}>
            <ModalContent isOpen={isOpen} status={status} onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose}/>
                <IconWrapper status={status}>
                    {isWin ? <FaTrophy /> : <FaRegFrown />}
                </IconWrapper>
                <Title>{isWin ? "You Won!" : "Unlucky!"}</Title>
                <Amount status={status}>
                    {isWin ? `+ €${bet.potentialWin.toFixed(2)}` : `- €${bet.stake.toFixed(2)}`}
                </Amount>
                <BetDetails>
                    Your bet on <span className="game">{bet.betType}</span> for the match "{bet.gameDetails}" has been settled.
                </BetDetails>
            </ModalContent>
        </ModalOverlay>
    );
};

export default BetResolutionModal;