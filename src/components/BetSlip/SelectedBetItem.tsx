import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import type { Game, BetConfig as BetConfigTypeFromTypes, ValidationError } from '../../types';
import { FaTimes } from 'react-icons/fa';

interface BetConfig extends BetConfigTypeFromTypes {
  liveOdds?: string; 
}

const ItemWrapper = styled.div<{ $isFinished?: boolean }>`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  animation: fadeInUp 0.3s ease-out forwards;
  position: relative;

  ${props => props.$isFinished && css`
    opacity: 0.6;
  `}
`;

const RemoveButton = styled.button`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
    border-radius: 50%;
    z-index: 6;
    
    &:hover {
        color: var(--error-red);
        background-color: rgba(245, 101, 101, 0.1);
    }
`;

const FinishedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 23, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1rem;
  border-radius: 12px;
  z-index: 5;
  backdrop-filter: blur(2px);
  cursor: not-allowed;
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1rem;

  .teams {
    font-weight: 600;
    padding-right: 1.5rem;
  }
  .sport {
    font-size: 0.8em;
    color: var(--text-secondary);
    display: block;
    margin-top: 0.25rem;
  }
  .live-bet-indicator {
    display: inline-block;
    font-size: 0.8em;
    color: var(--success-green);
    font-weight: bold;
    border: 1px solid var(--success-green);
    padding: 0.2em 0.4em;
    border-radius: 4px;
  }
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.75rem;
  align-items: center;

   @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledFormControl = css`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;
  appearance: none;
  -webkit-appearance: none;

  &:hover {
    border-color: rgba(0, 224, 255, 0.5);
  }

  &:focus {
    outline: none;
  }
`;

const Select = styled.select<{ $hasError?: boolean; disabled?: boolean }>`
  ${StyledFormControl}
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding-right: 2.5rem;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  ${StyledFormControl}
  
  border-color: ${props => props.$hasError ? 'var(--error-red)' : 'var(--border-color)'};

  &:focus {
     border-color: ${props => props.$hasError ? 'var(--error-red)' : 'var(--primary-cyan)'};
     box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(245, 101, 101, 0.3)' : 'rgba(0, 224, 255, 0.3)'};
  }

  &[type=number]::-webkit-inner-spin-button, 
  &[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    margin: 0; 
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const DropdownArrow = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--text-secondary);
  transition: all 0.2s ease;
`;

const ErrorText = styled.span`
  color: var(--error-red);
  font-size: 0.8rem;
  display: block;
  margin-top: 0.4rem;
  padding-left: 0.2rem;
`;

const BalanceTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--error-red);
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  margin-bottom: 8px;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: var(--error-red) transparent transparent transparent;
  }
`;

interface SelectedBetItemProps {
    game: Game;
    config: BetConfig;
    onUpdateConfig: (type: string, stake: string | number) => void;
    errors?: ValidationError;
    onRemove: () => void;
}

const SelectedBetItem: React.FC<SelectedBetItemProps> = ({ game, config, onUpdateConfig, errors, onRemove }) => {
    const { homeTeam, awayTeam, sportTitle } = game;
    const { user } = useAuth();
    const [isOverBalance, setIsOverBalance] = useState(false);
    
    const displayOdds = game.liveState?.currentOdds || game.odds;
    const isLiveBet = !!config.liveOdds;
    const isGameFinished = game.liveState?.status === 'finished';

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        const currentStake = config.stake > 0 ? config.stake : 1;
        onUpdateConfig(newType, currentStake);
        setIsOverBalance(false);
    };

    const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const stakeValue = e.target.value;

        if (stakeValue === '' || /^[0-9]*\.?[0-9]*$/.test(stakeValue)) {
            if (user && user.balance) {
                const stakeNumber = parseFloat(stakeValue);
                if (!isNaN(stakeNumber) && stakeNumber > user.balance) {
                    setIsOverBalance(true);
                } else {
                    setIsOverBalance(false);
                }
            }
            onUpdateConfig(config.type || '', stakeValue === '' ? 0 : stakeValue);
        }
    };
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };
    
    const getOptionText = (betType: 'Home Win' | 'Draw' | 'Away Win', oddValue?: string) => {
        return `${betType.split(' ')[0]} (${oddValue || '-'})`;
    };
    
    const getCurrentLiveOdd = () => {
        if (!config || !displayOdds) return '-';
        if (config.type === 'Home Win') return displayOdds.home;
        if (config.type === 'Away Win') return displayOdds.away;
        if (config.type === 'Draw') return displayOdds.draw;
        return '-';
    };

    const hasStakeError = !!(errors && errors.stake) || isOverBalance;

    return (
        <ItemWrapper $isFinished={isGameFinished}>
            <RemoveButton onClick={onRemove} title="Remove Bet">
                <FaTimes />
            </RemoveButton>
            {isGameFinished && <FinishedOverlay>Match Finished</FinishedOverlay>}
            <GameInfo>
                <div className="teams">{homeTeam} vs {awayTeam}</div>
                {isLiveBet && <span className="live-bet-indicator">LIVE @ {getCurrentLiveOdd()}</span>}
                <div className="sport">{sportTitle}</div>
            </GameInfo>
            <ControlsGrid>
                <div>
                    <InputWrapper>
                        <Select
                            value={config.type || ''}
                            onChange={handleTypeChange}
                            $hasError={!!(errors && errors.type)}
                            disabled={isLiveBet}
                        >
                          {isLiveBet ? (
                            <option value={config.type}>{getOptionText(config.type as 'Home Win' | 'Draw' | 'Away Win', getCurrentLiveOdd())}</option>
                          ) : (
                            <>
                              <option value="">Select Bet Type</option>
                              <option value="Home Win">{getOptionText("Home Win", displayOdds.home)}</option>
                              {displayOdds.draw && <option value="Draw">{getOptionText("Draw", displayOdds.draw)}</option>}
                              <option value="Away Win">{getOptionText("Away Win", displayOdds.away)}</option>
                            </>
                          )}
                        </Select>
                        <DropdownArrow />
                    </InputWrapper>
                    {errors && errors.type && <ErrorText>{errors.type}</ErrorText>}
                </div>
                <div>
                    <InputWrapper>
                        {isOverBalance && (
                            <BalanceTooltip>
                                Exceeds your balance of €{user?.balance.toFixed(2)}
                            </BalanceTooltip>
                        )}
                        <Input
                            type="number"
                            placeholder="Stake (€)"
                            value={config.stake > 0 ? config.stake : ''}
                            onChange={handleStakeChange}
                            onFocus={handleFocus}
                            min="1"
                            max="9000000"
                            step="0.01"
                            $hasError={hasStakeError}
                        />
                    </InputWrapper>
                    {errors && errors.stake && !isOverBalance && <ErrorText>{errors.stake}</ErrorText>}
                </div>
            </ControlsGrid>
        </ItemWrapper>
    );
};

export default SelectedBetItem;