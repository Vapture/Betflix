import React from 'react';
import styled, { css } from 'styled-components';
import type { Bet } from '../../types';

const PanelWrapper = styled.div`
  color: var(--text-primary);
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 3fr 1.5fr 1fr 1fr 1.2fr 1.2fr;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 1200px) {
    grid-template-columns: 2fr 3fr 1.5fr 1fr 1.2fr;
    & > .col-odds, & > .col-date {
      display: none;
    }
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0;
    align-items: stretch;
  }
`;

const HeaderRow = styled(HistoryGrid)`
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--border-color-opaque);
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BetRow = styled(HistoryGrid)`
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.95rem;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    gap: 0.75rem;
  }
`;

const Cell = styled.div`
    &.mobile-label {
        display: none;
        font-weight: 600;
        color: var(--text-secondary);
    }

    @media (max-width: 768px) {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &.mobile-label {
            display: inline;
        }

        & > .mobile-value {
           text-align: right;
        }
    }
`;

const StatusBadge = styled.span<{ $status: Bet['status'] }>`
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: center;
  text-transform: capitalize;

  ${({ $status }) => {
    if ($status === 'won') return css`background-color: rgba(16, 185, 129, 0.2); color: var(--success-green);`;
    if ($status === 'lost') return css`background-color: rgba(239, 68, 68, 0.2); color: var(--error-red);`;
    return css`background-color: rgba(156, 163, 175, 0.2); color: var(--text-secondary);`;
  }}
`;

const WinningsAmount = styled.span<{ $status: Bet['status'] }>`
    font-weight: 600;
    color: ${({ $status }) => {
      if ($status === 'won') return 'var(--success-green)';
      if ($status === 'lost') return 'var(--error-red)';
      return 'var(--text-secondary)';
    }};
`;

const NoBetsMessage = styled.p`
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem 0;
`;

interface BetHistoryPanelProps {
  bets: Bet[];
}

const BetHistoryPanel: React.FC<BetHistoryPanelProps> = ({ bets }) => {
  if (bets.length === 0) {
    return <NoBetsMessage>You have not placed any bets yet.</NoBetsMessage>;
  }

  const formatWinnings = (bet: Bet) => {
    switch (bet.status) {
      case 'won':
        return `+€${(bet.actualWin || bet.potentialWin).toFixed(2)}`;
      case 'lost':
        return `-€${bet.stake.toFixed(2)}`;
      case 'pending':
      default:
        return `€${bet.potentialWin.toFixed(2)}`;
    }
  };

  return (
    <PanelWrapper>
      <HeaderRow>
        <div className="col-date">Date</div>
        <div>Game Details</div>
        <div>Bet</div>
        <div className="col-odds">Odds</div>
        <div>Stake</div>
        <div>Status</div>
        <div>Winnings</div>
      </HeaderRow>
      <div>
        {bets.map(bet => (
          <BetRow key={bet.id}>
            <Cell className="col-date">
                <span className="mobile-value">
                    {new Date(bet.timestamp).toLocaleDateString()}
                </span>
            </Cell>
            <Cell>
                <span className="mobile-label">Game: </span>
                <span className="mobile-value">{bet.gameDetails}</span>
            </Cell>
            <Cell>
                <span className="mobile-label">Bet: </span>
                <span className="mobile-value">{bet.betType}</span>
            </Cell>
            <Cell className="col-odds">
                <span className="mobile-value">{bet.odds}</span>
            </Cell>
            <Cell>
                <span className="mobile-label">Stake: </span>
                <span className="mobile-value">€{bet.stake.toFixed(2)}</span>
            </Cell>
            <Cell>
                <span className="mobile-label">Status: </span>
                <span className="mobile-value"><StatusBadge $status={bet.status}>{bet.status}</StatusBadge></span>
            </Cell>
            <Cell>
                <span className="mobile-label">Winnings: </span>
                <WinningsAmount $status={bet.status} className="mobile-value">{formatWinnings(bet)}</WinningsAmount>
            </Cell>
          </BetRow>
        ))}
      </div>
    </PanelWrapper>
  );
};

export default BetHistoryPanel;