import React from 'react';
import styled from 'styled-components';
import SelectedBetItem from './SelectedBetItem';
import { useAuth } from '../../contexts/AuthContext';
import type { Game, BetConfigMap, ValidationErrorsMap, ValidationError } from '../../types';
import { FaCheck, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const BetSlipWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NoBetsMessage = styled.p`
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem 0;
  font-style: italic;
`;

const BetSlipHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(16, 23, 39, 0.6);
  margin: -1.5rem -1.5rem 1rem -1.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  border-radius: 16px 16px 0 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--text-primary);
  text-shadow: 0 0 5px rgba(0, 224, 255, 0.5);
  margin: 0;
`;

const ClearButton = styled.button`
  background: transparent;
  color: var(--text-secondary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  
  &:hover {
    color: var(--error-red);
    background-color: rgba(245, 101, 101, 0.1);
  }
`;

const TermsContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 0.5rem;
`;

const TermsCheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--text-secondary);
  transition: color 0.2s;
  user-select: none;
  cursor: pointer;
`;

const TermsLink = styled.span`
  color: var(--primary-cyan);
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
`;

const CustomCheckbox = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.$checked ? 'var(--primary-cyan)' : 'var(--border-color)'};
  background: ${props => props.$checked ? 'var(--primary-cyan)' : 'rgba(0,0,0,0.2)'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  
  svg {
    color: #101727;
    visibility: ${props => props.$checked ? 'visible' : 'hidden'};
    transform: ${props => props.$checked ? 'scale(1)' : 'scale(0.5)'};
    transition: all 0.2s ease-in-out;
    font-size: 12px;
  }
`;

const ErrorText = styled.span`
  color: var(--error-red);
  font-size: 0.9rem;
  text-align: center;
  display: block;
  margin-top: 0.5rem;
`;

const SubmitWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SubmitButton = styled.button`
  background: linear-gradient(90deg, var(--primary-cyan) 0%, var(--primary-magenta) 100%);
  background-size: 200% 200%;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px 0 rgba(0, 224, 255, 0.3);

  &:hover:not(:disabled) {
    background-position: 100% 0;
    box-shadow: 0 4px 20px 0 rgba(229, 0, 255, 0.4);
    transform: translateY(-2px);
  }

  &:disabled {
    background: var(--border-color);
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Summary = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 1rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .summary-row {
    display: flex;
    justify-content: space-between;
    .label { color: var(--text-secondary); }
    .value { font-weight: 600; }
  }
`;

interface BetSlipProps {
    selectedGames: Game[];
    betConfigs: BetConfigMap;
    onUpdateBetConfig: (gameId: string, type: string, stake: string | number) => void;
    termsAccepted: boolean;
    onTermsChange: (accepted: boolean) => void;
    onSubmit: () => void;
    onClearSlip: () => void;
    validationErrors: ValidationErrorsMap;
    submitLoading: boolean;
    onOpenTermsModal: () => void;
    onRemoveGame: (gameId: string) => void;
}

const BetSlip: React.FC<BetSlipProps> = ({
    selectedGames,
    betConfigs,
    onUpdateBetConfig,
    termsAccepted,
    onTermsChange,
    onSubmit,
    onClearSlip,
    validationErrors,
    submitLoading,
    onOpenTermsModal,
    onRemoveGame
}) => {
    const { user } = useAuth();
    const hasBets = selectedGames.length > 0;

    const totalStake = selectedGames.reduce((sum, game) => {
        const config = betConfigs[game.id];
        return sum + (config && config.stake ? Number(config.stake) : 0);
    }, 0);
    
    const isBalanceExceeded = user ? totalStake > user.balance : false;

    const handleOpenTerms = (e: React.MouseEvent) => {
        e.preventDefault();
        onOpenTermsModal();
    };

    if (!hasBets) {
        return (
            <>
                <BetSlipHeader>
                    <SectionTitle>Bet Slip</SectionTitle>
                </BetSlipHeader>
                <NoBetsMessage>Select a bet from any match to start.</NoBetsMessage>
            </>
        );
    }

    const totalPotentialWinnings = selectedGames.reduce((sum, game) => {
        const config = betConfigs[game.id];
        if (config && config.stake && config.type) {
            const displayOdds = game.liveState?.currentOdds || game.odds;
            let oddValueStr: string | undefined = '1';

            if (config.type === "Home Win") oddValueStr = displayOdds.home;
            else if (config.type === "Away Win") oddValueStr = displayOdds.away;
            else if (config.type === "Draw") oddValueStr = displayOdds.draw;

            const oddValue = parseFloat(oddValueStr || '1');
            return sum + (Number(config.stake) * oddValue);
        }
        return sum;
    }, 0);

    return (
        <BetSlipWrapper>
            <BetSlipHeader>
                <SectionTitle>Bet Slip</SectionTitle>
                {hasBets && (
                    <ClearButton onClick={onClearSlip}>
                        <FaTrash /> Clear All
                    </ClearButton>
                )}
            </BetSlipHeader>

            <AnimatePresence>
                {selectedGames.map(game => (
                    <motion.div
                        key={game.id}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    >
                        <SelectedBetItem
                            game={game}
                            config={betConfigs[game.id] || { type: '', stake: 0 }}
                            onUpdateConfig={(type, stake) => onUpdateBetConfig(game.id, type, stake)}
                            errors={validationErrors[game.id] as ValidationError}
                            onRemove={() => onRemoveGame(game.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            <TermsContainer>
                <TermsCheckboxWrapper>
                    <HiddenCheckbox
                        checked={termsAccepted}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTermsChange(e.target.checked)}
                    />
                    <CustomCheckbox $checked={termsAccepted}>
                        <FaCheck />
                    </CustomCheckbox>
                    <span>
                        I accept the <TermsLink onClick={handleOpenTerms}>Terms & Conditions</TermsLink>
                    </span>
                </TermsCheckboxWrapper>
                {validationErrors.terms && <ErrorText>{validationErrors.terms}</ErrorText>}
            </TermsContainer>

            <Summary>
                <div className="summary-row">
                    <span className="label">Total Selections:</span>
                    <strong className="value">{selectedGames.length}</strong>
                </div>
                <div className="summary-row" style={{ color: isBalanceExceeded ? 'var(--error-red)' : 'inherit' }}>
                    <span className="label">Total Stake:</span>
                    <strong className="value">€{totalStake.toFixed(2)}</strong>
                </div>
                <div className="summary-row">
                    <span className="label">Potential Winnings:</span>
                    <strong className="value">€{totalPotentialWinnings.toFixed(2)}</strong>
                </div>
            </Summary>

            <SubmitWrapper>
                <SubmitButton 
                    onClick={onSubmit} 
                    disabled={submitLoading || !hasBets || isBalanceExceeded}
                >
                    {submitLoading ? 'Submitting...' : `Place Bets (€${totalStake.toFixed(2)})`}
                </SubmitButton>
            </SubmitWrapper>
        </BetSlipWrapper>
    );
};

export default BetSlip;