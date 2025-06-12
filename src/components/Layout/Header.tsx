import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { FaSignOutAlt, FaArchive } from 'react-icons/fa'; 
import UserStats from '../User/UserStats';
import LiveSummary from './LiveSummary';
import { glassEffect } from './GlobalStyles';
import type { Game } from '../../types';

const HeaderWrapper = styled.header`
  ${glassEffect}
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: 20;
  margin: 1rem;
  width: calc(100% - 2rem);
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--text-primary);
  text-shadow: 0 0 10px var(--primary-cyan);
  flex-shrink: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
`;

const ActionButton = styled.div`
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-cyan);
    transform: scale(1.1);
    background-color: rgba(255,255,255,0.1);
  }
`;

interface HeaderProps {
    onOpenBetHistory: () => void;
    onOpenArchive: () => void; 
    liveGames: Game[];
}

const Header: React.FC<HeaderProps> = ({ onOpenBetHistory, onOpenArchive, liveGames }) => {
    const { user, logout } = useAuth();

    return (
        <HeaderWrapper>
            <Logo>Betflix Demo</Logo>
            
            <LiveSummary liveGames={liveGames} />

            {user && (
                <HeaderActions>
                    <UserStats onOpenModal={onOpenBetHistory} />
                    <ActionButton onClick={onOpenArchive} title="Archived Games">
                        <FaArchive />
                    </ActionButton>
                    <ActionButton onClick={logout} title="Logout">
                        <FaSignOutAlt />
                    </ActionButton>
                </HeaderActions>
            )}
        </HeaderWrapper>
    );
};

export default Header;