import React from 'react';
import styled from 'styled-components';
import { FaFutbol, FaBasketballBall, FaTableTennis, FaGamepad } from 'react-icons/fa';
import type { Game } from '../../types';
import { glassEffect } from '../Layout/GlobalStyles';

const CardWrapper = styled.div<{ $isSelected: boolean }>`
  ${glassEffect}
  padding: 1.25rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  border: 2px solid ${props => props.$isSelected ? 'var(--primary-cyan)' : 'transparent'};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
    border-color: rgba(0, 224, 255, 0.5);
  }

  ${props => props.$isSelected && `
    box-shadow: 0 0 15px 0 rgba(0, 224, 255, 0.5);
  `}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SportInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;

    svg {
        color: var(--primary-cyan);
        font-size: 1.2rem;
    }
`;

const GameTime = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  background-color: rgba(0,0,0,0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const Teams = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 0.75rem;

  span {
    font-weight: 400;
    color: var(--text-secondary);
    margin: 0 0.5rem;
  }
`;

const OddsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const OddButton = styled.div`
  background-color: rgba(0,0,0,0.2);
  padding: 0.6rem;
  border-radius: 6px;
  text-align: center;
  color: var(--text-primary);
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 224, 255, 0.2);
  }

  .type {
    font-size: 0.8em;
    color: var(--text-secondary);
    display: block;
    margin-bottom: 0.2rem;
  }
  .value {
    font-weight: 600;
  }
`;

const getSportIcon = (sportKey: string): React.ReactNode => {
    const key = sportKey.toLowerCase();
    if (key.includes('soccer') || key.includes('football')) return <FaFutbol />;
    if (key.includes('basketball')) return <FaBasketballBall />;
    if (key.includes('tennis')) return <FaTableTennis />;
    if (key.includes('esports')) return <FaGamepad />;
    return <FaGamepad />;
}

interface GameCardProps {
    game: Game;
    isSelected: boolean;
    onSelect: () => void;
    index?: number;
}

const GameCard: React.FC<GameCardProps> = ({ game, isSelected, onSelect, index }) => {
    const { homeTeam, awayTeam, commenceTime, odds, sportTitle, sportKey } = game;

    const formattedTime = new Date(commenceTime).toLocaleString([], {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <CardWrapper 
            onClick={onSelect} 
            $isSelected={isSelected} 
            style={{ animationDelay: `${(index || 0) * 0.05}s` }}
        >
            <CardHeader>
                <SportInfo>
                    {getSportIcon(sportKey)}
                    <span>{sportTitle}</span>
                </SportInfo>
                <GameTime>{formattedTime}</GameTime>
            </CardHeader>
            <Teams>
                {homeTeam} <span>vs</span> {awayTeam}
            </Teams>
            <OddsGrid>
                <OddButton>
                    <span className="type">Home</span>
                    <span className="value">{odds.home}</span>
                </OddButton>
                {odds.draw && (
                    <OddButton>
                        <span className="type">Draw</span>
                        <span className="value">{odds.draw}</span>
                    </OddButton>
                )}
                {!odds.draw && <div />} 
                <OddButton>
                    <span className="type">Away</span>
                    <span className="value">{odds.away}</span>
                </OddButton>
            </OddsGrid>
        </CardWrapper>
    );
};

export default GameCard;