import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaWallet } from 'react-icons/fa';

const UserStatsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: rgba(0,0,0,0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid var(--border-color);

  &:hover {
    background-color: rgba(0, 224, 255, 0.1);
    border-color: var(--primary-cyan);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  font-weight: 500;

  svg {
    color: var(--primary-cyan);
    font-size: 1.2rem;
  }
`;

const BalanceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;

  svg {
    color: #FFD700;
  }
`;

interface UserStatsProps {
    onOpenModal: () => void;
}

const UserStats: React.FC<UserStatsProps> = ({ onOpenModal }) => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <UserStatsWrapper onClick={onOpenModal}>
            <UserInfo>
                <FaUserCircle />
                <span>{user.username}</span>
            </UserInfo>
            <BalanceDisplay>
                <FaWallet />
                <span>${user.balance.toFixed(2)}</span>
            </BalanceDisplay>
        </UserStatsWrapper>
    );
};

export default UserStats;