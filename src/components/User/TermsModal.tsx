import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { glassEffect } from '../Layout/GlobalStyles';

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
  z-index: 1000;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div<{ isOpen: boolean }>`
  ${glassEffect}
  background: rgba(29, 38, 59, 0.9);
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
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
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem; 
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

const TermsContentWrapper = styled.div`
  overflow-y: auto;
  padding-right: 15px;
  color: var(--text-secondary);
  line-height: 1.7;

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

  h3 {
    color: var(--text-primary);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    &:first-child {
      margin-top: 0;
    }
  }

  p {
    margin-bottom: 1rem;
  }
`;

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
    return (
        <ModalOverlay isOpen={isOpen} onClick={onClose}>
            <ModalContent isOpen={isOpen} onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <h2>Terms & Conditions</h2>
                    <FaTimes className="close-button" onClick={onClose} />
                </ModalHeader>
                <TermsContentWrapper>
                    <h3>1. General Provisions</h3>
                    <p>
                        By creating an account and placing bets on Betflix, you confirm that you are at least 18 years old and legally able to enter into binding contracts. You also agree to abide by all the rules, terms, and conditions set forth herein. It is your responsibility to ensure that your participation is legal in your jurisdiction.
                    </p>

                    <h3>2. Account Responsibility</h3>
                    <p>
                        You are solely responsible for the security and confidentiality of your account information, including your username and password. Any activity conducted through your account will be considered valid. You must notify us immediately of any unauthorized use of your account.
                    </p>

                    <h3>3. Betting Rules</h3>
                    <p>
                        All bets are placed at your own risk and discretion. Once a bet is confirmed, it cannot be cancelled or changed. We reserve the right to void any bet in case of obvious errors, such as incorrect odds or technical issues. The maximum stake per bet is €9,000,000. All winnings will be credited to your account balance.
                    </p>

                    <h3>4. Deposits & Withdrawals</h3>
                    <p>
                        Funds deposited into your account must be used for betting activities. We are not a financial institution. Withdrawals will be processed to the same payment method used for the deposit, where possible. We may require identity verification before processing withdrawals to comply with anti-money laundering regulations.
                    </p>

                    <h3>5. Limitation of Liability</h3>
                    <p>
                        Betflix is provided "as is". We are not liable for any direct, indirect, or consequential loss or damage arising from your use of our services, including losses from betting. We do not guarantee the uninterrupted availability of our services.
                    </p>
                </TermsContentWrapper>
            </ModalContent>
        </ModalOverlay>
    );
};

export default TermsModal;