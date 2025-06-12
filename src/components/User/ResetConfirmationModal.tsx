import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';
import { glassEffect } from '../Layout/GlobalStyles';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 23, 39, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
  ${glassEffect}
  background: rgba(40, 20, 30, 0.9);
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  text-align: center;
  border-top: 4px solid var(--error-red);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease;
`;

const IconWrapper = styled.div`
  color: var(--error-red);
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
`;

const Message = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  min-width: 120px;
`;

const ConfirmButton = styled(Button)`
    background-color: var(--error-red);
    color: white;
    &:hover {
        background-color: #c53030;
    }
`;

const CancelButton = styled(Button)`
    background-color: var(--border-color);
    color: var(--text-primary);
    &:hover {
        background-color: rgba(255,255,255,0.2);
    }
`;

interface ResetConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <ModalOverlay $isOpen={isOpen} onClick={onClose}>
            <ModalContent $isOpen={isOpen} onClick={e => e.stopPropagation()}>
                <IconWrapper>
                    <FaExclamationTriangle />
                </IconWrapper>
                <Title>Are you sure?</Title>
                <Message>
                    This will delete all your bet history and reset your balance to the initial €1000. This action cannot be undone.
                </Message>
                <ButtonGroup>
                    <CancelButton onClick={onClose}>Cancel</CancelButton>
                    <ConfirmButton onClick={onConfirm}>Confirm Reset</ConfirmButton>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ResetConfirmationModal;