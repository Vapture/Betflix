import React from 'react';
import styled from 'styled-components';
import type { Game, LiveGameState } from '../../types';
import { FaFutbol, FaRegClock, FaBasketballBall, FaTableTennis, FaGamepad } from 'react-icons/fa';
import { glassEffect } from '../Layout/GlobalStyles';

const LiveGameWrapper = styled.div`
  ${glassEffect}
  padding: 1rem;
  min-height: 18rem;
  width: 300px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
`;

const SportTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  svg {
    color: var(--primary-cyan);
  }
`;

const GameStatus = styled.span<{ $status: LiveGameState['status'] }>`
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  color: #fff;
  background-color: ${props => {
    if (props.$status === 'in_progress') return 'var(--success-green)';
    if (props.$status === 'finished') return 'var(--error-red)';
    if (props.$status === 'half_time') return 'var(--primary-magenta)';
    return 'var(--text-secondary)';
  }};
  white-space: nowrap;
`;

const Scoreboard = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1rem 0;
  font-size: 1.5rem;
  font-weight: bold;
`;

const TeamName = styled.span`
  flex: 1;
  text-align: center;
  font-size: 1rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0.25rem;
`;

const Score = styled.span`
  padding: 0 0.5rem;
  color: var(--text-primary);
  white-space: nowrap;
`;

const TimeDisplay = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  svg {
    color: var(--primary-cyan);
  }
`;

const EventList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  height: 5.5rem;
  overflow-y: auto;
  font-size: 0.85rem;
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--primary-cyan);
    border-radius: 2px;
  }

  li {
    padding: 0.25rem 0;
    border-bottom: 1px dashed var(--border-color);
    color: var(--text-secondary);
    &:last-child {
      border-bottom: none;
    }
    .event-time {
        font-weight: 500;
        color: var(--text-primary);
        margin-right: 0.5em;
        display: inline-block;
        width: 25px; 
        text-align: right;
    }
  }
`;

const LiveOddsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
`;

const LiveOddButton = styled.button<{ $selected?: boolean }>`
  background-color: ${props => props.$selected ? 'rgba(0, 224, 255, 0.2)' : 'rgba(0,0,0,0.2)'};
  color: var(--text-primary);
  padding: 0.5rem 0.3rem;
  border-radius: 8px;
  border: 2px solid ${props => props.$selected ? 'var(--primary-cyan)' : 'var(--border-color)'};
  text-align: center;
  font-size: 0.8rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: rgba(0, 224, 255, 0.2);
    border-color: var(--primary-cyan);
    transform: scale(1.05);
  }

  .type {
    font-size: 0.9em;
    color: var(--text-secondary);
    display: block;
    margin-bottom: 0.1rem;
  }
  .value {
    font-weight: 600;
    font-size: 1.1em;
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

interface LiveGameViewProps {
  game: Game;
  onBetLive: (game: Game, betType: 'Home Win' | 'Draw' | 'Away Win', liveOddsValue: string) => void;
  currentBetTypeForThisGame?: string;
}

const LiveGameView: React.FC<LiveGameViewProps> = ({ game, onBetLive, currentBetTypeForThisGame }) => {
  if (!game.liveState) {
    return (
      <LiveGameWrapper>
        <p>Live data not available for this game yet.</p>
      </LiveGameWrapper>
    );
  }

  const { homeTeam, awayTeam, sportTitle, sportKey } = game;
  const { currentTime, homeScore, awayScore, status, events, currentOdds } = game.liveState;

  const getStatusText = (s: LiveGameState['status']): string => {
    switch (s) {
      case 'in_progress': return "In Progress";
      case 'finished': return "Finished";
      case 'half_time': return "Half Time";
      case 'not_started': return "Not Started";
      default: return "Unknown";
    }
  }

  const canBet = status === 'in_progress' || status === 'half_time';

  return (
    <LiveGameWrapper>
      <Header>
        <SportTitle><>{getSportIcon(sportKey)} {sportTitle}</></SportTitle>
        <GameStatus $status={status}>{getStatusText(status)}</GameStatus>
      </Header>
      <Scoreboard>
        <TeamName title={homeTeam}>{homeTeam}</TeamName>
        <Score>{homeScore} - {awayScore}</Score>
        <TeamName title={awayTeam}>{awayTeam}</TeamName>
      </Scoreboard>
      {(status === 'in_progress' || status === 'half_time') && (
        <TimeDisplay>
          <FaRegClock /> {currentTime}'
        </TimeDisplay>
      )}
      
      <EventList>
        {events && events.length > 0 ? (
          events.slice().reverse().map((event, index) => (
            <li key={`${game.id}-event-${events.length - 1 - index}`}>
              <span className="event-time">{event.time}'</span> {event.description}
            </li>
          ))
        ) : (
          <li>No significant events yet.</li>
        )}
      </EventList>

      {currentOdds && (
        <LiveOddsGrid>
          <LiveOddButton 
            onClick={() => onBetLive(game, 'Home Win', currentOdds.home)} 
            disabled={!canBet || !currentOdds.home}
            $selected={currentBetTypeForThisGame === 'Home Win'}
          >
            <span className="type">1 (Home)</span>
            <span className="value">{currentOdds.home || '-'}</span>
          </LiveOddButton>
          
          <LiveOddButton 
            onClick={() => onBetLive(game, 'Draw', currentOdds.draw!)} 
            disabled={!canBet || !currentOdds.draw || !game.odds.draw}
            $selected={currentBetTypeForThisGame === 'Draw'}
            style={{ visibility: game.odds.draw ? 'visible' : 'hidden' }}
          >
            <span className="type">X (Draw)</span>
            <span className="value">{currentOdds.draw || '-'}</span>
          </LiveOddButton>
          
          <LiveOddButton 
            onClick={() => onBetLive(game, 'Away Win', currentOdds.away)} 
            disabled={!canBet || !currentOdds.away}
            $selected={currentBetTypeForThisGame === 'Away Win'}
          >
            <span className="type">2 (Away)</span>
            <span className="value">{currentOdds.away || '-'}</span>
          </LiveOddButton>
        </LiveOddsGrid>
      )}
    </LiveGameWrapper>
  );
};

export default LiveGameView;