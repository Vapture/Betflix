import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import type { Game } from '../../types';

const blink = keyframes`
  50% {
    opacity: 0.5;
  }
`;

const SummaryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-grow: 1;
  min-width: 0;
  overflow: hidden;
`;

const GameSummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  white-space: nowrap;
`;

const StatusIndicator = styled.div<{ $status: 'not_started' | 'in_progress' | 'half_time' | 'finished' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $status }) => {
    if ($status === 'in_progress') return 'var(--success-green)';
    if ($status === 'half_time') return '#FFD700';
    return 'var(--text-secondary)';
  }};
  
  ${({ $status }) => 
    $status === 'in_progress' && 
    css`
      animation: ${blink} 1.5s infinite;
    `}
`;

const TeamName = styled.span`
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Score = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0.2rem;
`;

interface LiveSummaryProps {
    liveGames: Game[];
}

const LiveSummary: React.FC<LiveSummaryProps> = ({ liveGames }) => {
    if (!liveGames || liveGames.length === 0) {
        return null;
    }

    return (
        <SummaryWrapper>
            {liveGames.map(game => (
                game.liveState && (
                    <GameSummaryItem key={game.id}>
                        <StatusIndicator $status={game.liveState.status} />
                        <TeamName title={game.homeTeam}>{game.homeTeam}</TeamName>
                        <Score>{game.liveState.homeScore} - {game.liveState.awayScore}</Score>
                        <TeamName title={game.awayTeam}>{game.awayTeam}</TeamName>
                    </GameSummaryItem>
                )
            ))}
        </SummaryWrapper>
    );
};

export default LiveSummary;