import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import GameList from '../components/Games/GameList';
import BetSlip from '../components/BetSlip/BetSlip';
import GameToolbar from '../components/Games/GameToolbar';
import LiveGameView from '../components/LiveView/LiveGameView';
import TermsModal from '../components/User/TermsModal';
import SubmissionSuccessModal from '../components/BetSlip/SubmissionSuccessModal';
import { toast } from 'react-hot-toast';
import type { Game, Bet, BetConfigMap, ValidationErrorsMap, LiveGameState, Odds, ValidationError } from '../types';
import { glassEffect } from '../components/Layout/GlobalStyles';

const DashboardLayout = styled.div`
  display: grid;
  grid-template-areas: 
    "live betslip"
    "main betslip";
  grid-template-columns: minmax(0, 3fr) minmax(350px, 1.5fr); 
  grid-template-rows: auto 1fr; 
  gap: 1.5rem;
  padding: 0 1.5rem 1.5rem 1.5rem;

  @media (max-width: 1024px) {
    grid-template-areas: 
      "live"
      "main"
      "betslip";
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
`;

const SectionContainer = styled.div`
  ${glassEffect}
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
`;

const MainContent = styled(SectionContainer)`
  grid-area: main;
  animation-delay: 0.1s;
`;

const LiveGamesSection = styled(SectionContainer)`
  grid-area: live;
`;

const GameListWrapper = styled.div`
    flex-grow: 1;
`;

const BetSlipContainer = styled.div`
  grid-area: betslip;
  background-color: rgba(44, 53, 72, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  padding: 1.5rem;
  align-self: flex-start;
  min-width: 320px; 
  position: sticky;
  top: calc(var(--header-height) + 1.5rem); 
  max-height: calc(100vh - (var(--header-height) + 3rem));
  overflow-y: auto;
  z-index: 10;
  animation: fadeInUp 0.5s ease-out 0.2s forwards;
  opacity: 0;
  border-radius: 16px;

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

   @media (max-width: 1024px) {
    position: static;
    max-height: none;
    align-self: stretch;
  }
`;

const SectionHeader = styled.div`
  background: rgba(16, 23, 39, 0.6); 
  margin: -1.5rem -1.5rem 1rem -1.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  border-radius: 16px 16px 0 0; 
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 0;
  text-shadow: 0 0 5px rgba(0, 224, 255, 0.5);
`;

const LoadingMessage = styled.p`
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
`;

const GlobalError = styled.div`
    background-color: rgba(245, 101, 101, 0.1);
    border: 1px solid var(--error-red);
    color: var(--error-red);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
    margin-bottom: 1rem;
    animation: fadeInUp 0.3s;
`;

const LiveGamesContentContainer = styled.div`
  display: flex; 
  flex-wrap: wrap; 
  justify-content: center;
  gap: 1rem;
`;

const LiveGamesPlaceholder = styled.p`
  color: var(--text-secondary);
  width: 100%;
  text-align: center;
  padding: 2rem;
`;

const MAX_IMMEDIATE_LIVE_GAMES = 3;
const SIMULATION_INTERVAL = 1500;
const GAME_DURATION = 90;
const ARCHIVE_DELAY = 10000;

const calculateDynamicOdds = (originalOdds: Odds, liveState: LiveGameState): Odds => {
    const { homeScore, awayScore, currentTime } = liveState;
    let newHomeOdd = parseFloat(originalOdds.home);
    let newAwayOdd = parseFloat(originalOdds.away);
    let newDrawOdd = originalOdds.draw ? parseFloat(originalOdds.draw) : undefined;
    const timeProgress = currentTime / GAME_DURATION; 
    const scoreDiff = homeScore - awayScore;
    if (scoreDiff > 0) {
        newHomeOdd = Math.max(1.01, newHomeOdd * (1 - 0.1 * scoreDiff) - timeProgress * 0.5); 
        newAwayOdd = Math.max(1.01, newAwayOdd * (1 + 0.1 * scoreDiff) + timeProgress * 0.5);
        if (newDrawOdd) newDrawOdd = Math.max(1.01, newDrawOdd * (1 + 0.05 * scoreDiff) + timeProgress * 0.2);
    } else if (scoreDiff < 0) {
        newAwayOdd = Math.max(1.01, newAwayOdd * (1 - 0.1 * Math.abs(scoreDiff)) - timeProgress * 0.5);
        newHomeOdd = Math.max(1.01, newHomeOdd * (1 + 0.1 * Math.abs(scoreDiff)) + timeProgress * 0.5);
        if (newDrawOdd) newDrawOdd = Math.max(1.01, newDrawOdd * (1 + 0.05 * Math.abs(scoreDiff)) + timeProgress * 0.2);
    } else {
        if (newDrawOdd) newDrawOdd = Math.max(1.01, newDrawOdd * (1 - 0.1 * timeProgress));
    }
    newHomeOdd *= (1 + (Math.random() - 0.5) * 0.05);
    newAwayOdd *= (1 + (Math.random() - 0.5) * 0.05);
    if (newDrawOdd) newDrawOdd *= (1 + (Math.random() - 0.5) * 0.05);
    const sumInvOdds = (1 / newHomeOdd) + (1 / newAwayOdd) + (newDrawOdd ? (1 / newDrawOdd) : 0);
    const marginFactor = sumInvOdds > 0 ? 1.05 / sumInvOdds : 1; 
    newHomeOdd = Math.max(1.01, Math.min(newHomeOdd * marginFactor, 50.0));
    newAwayOdd = Math.max(1.01, Math.min(newAwayOdd * marginFactor, 50.0));
    if (newDrawOdd !== undefined) {
        newDrawOdd = Math.max(1.01, Math.min(newDrawOdd * marginFactor, 30.0));
    }
    return {
        home: newHomeOdd.toFixed(2),
        away: newAwayOdd.toFixed(2),
        draw: newDrawOdd ? newDrawOdd.toFixed(2) : undefined,
    };
};

interface DashboardPageProps {
    liveGames: Game[];
    setLiveGames: React.Dispatch<React.SetStateAction<Game[]>>;
    setArchivedGames: React.Dispatch<React.SetStateAction<Game[]>>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ liveGames, setLiveGames, setArchivedGames }) => {
    const { user, updateBalance } = useAuth();
    const [allGames, setAllGames] = useState<Game[]>([]);
    const [selectedGamesForSlip, setSelectedGamesForSlip] = useState<Game[]>([]);
    const [betConfigs, setBetConfigs] = useState<BetConfigMap>({});
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrorsMap>({});
    const gameEngineIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [selectedSport, setSelectedSport] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date_asc');
    const [isTermsModalOpen, setTermsModalOpen] = useState(false);
    const [submissionSuccessData, setSubmissionSuccessData] = useState<{ totalStake: number; bets: Omit<Bet, 'id'>[] } | null>(null);

    const handleClearSlip = () => {
        setSelectedGamesForSlip([]);
        setBetConfigs({});
        setValidationErrors({});
        setTermsAccepted(false);
    };

    const handleRemoveGameFromSlip = (gameId: string) => {
        setSelectedGamesForSlip(prev => prev.filter(g => g.id !== gameId));
        setBetConfigs(prev => {
            const newConfigs = { ...prev };
            delete newConfigs[gameId];
            return newConfigs;
        });
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[gameId];
            return newErrors;
        });
    };
    
    const resolveBetsForFinishedGame = useCallback(async (finishedGame: Game) => {
        if (!user || !finishedGame.liveState) return;
        const { homeScore, awayScore } = finishedGame.liveState;
        let result: 'Home Win' | 'Draw' | 'Away Win';
        if (homeScore > awayScore) result = 'Home Win';
        else if (awayScore > homeScore) result = 'Away Win';
        else result = 'Draw';
        try {
            const response = await api.get<Bet[]>(`/bets?userId=${user.id}&status=pending&gameId=${finishedGame.id}`);
            const pendingBets = response.data;
            for (const bet of pendingBets) {
                if (!bet.id) continue;
                const hasWon = bet.betType === result;
                const newStatus = hasWon ? 'won' : 'lost';
                await api.patch(`/bets/${bet.id}`, { status: newStatus });
                
                if (hasWon) {
                    toast.success(
                        () => (
                            <span><b>You Won!</b><br />Bet on {bet.gameDetails} won you €{bet.potentialWin.toFixed(2)}!</span>
                        ), { duration: 6000 }
                    );
                    if (user) updateBalance(user.balance + bet.potentialWin);
                } else {
                     toast.error(
                        () => (
                            <span><b>Unlucky!</b><br />Bet on {bet.gameDetails} was lost.</span>
                        ), { duration: 6000 }
                    );
                }
            }
        } catch (error) {
            console.error("Failed to resolve bets for game:", error);
        }
    }, [user, updateBalance]);

    const resolveBetsRef = useRef(resolveBetsForFinishedGame);
    useEffect(() => {
        resolveBetsRef.current = resolveBetsForFinishedGame;
    }, [resolveBetsForFinishedGame]);
    
    const initializeLiveState = (game: Game): Game => ({
        ...game,
        liveState: {
            currentTime: 0, 
            homeScore: 0, 
            awayScore: 0, 
            status: 'not_started', 
            events: [],
            currentOdds: { ...game.odds }
        }
    });

    useEffect(() => {
        const fetchGamesData = async () => {
            try {
                setLoading(true);
                const response = await api.get<Game[]>('/games');
                
                const now = new Date();
                const processedGames = response.data.map((game, index) => {
                    if (index < MAX_IMMEDIATE_LIVE_GAMES) {
                        const newTime = new Date(now.getTime() + (index + 1) * 2000 + 1000);
                        return { ...game, commenceTime: newTime.toISOString() };
                    }
                    const futureOffset = (MAX_IMMEDIATE_LIVE_GAMES * 5000) + (index * 30 + Math.random() * 60) * 1000;
                    const newTime = new Date(now.getTime() + futureOffset);
                    return { ...game, commenceTime: newTime.toISOString() };
                });

                setAllGames(processedGames);
            } catch (err) { 
                console.error("Failed to fetch games:", err); 
                setError('Failed to load games.'); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchGamesData();
    }, []);

    useEffect(() => {
        const gameEngine = () => {
            setLiveGames(prevLiveGames => {
                const now = new Date();
                
                const liveGameIds = new Set(prevLiveGames.map(g => g.id));
                const preMatchGames = allGames.filter(g => !liveGameIds.has(g.id));

                const gamesToStart = preMatchGames.filter(
                    game => new Date(game.commenceTime) <= now
                );

                const gamesToArchive: Game[] = [];
                const updatedGamesFromLive = prevLiveGames.map(game => {
                    if (!game.liveState) return game;

                    if (game.liveState.status === 'finished') {
                        if (!game.finishTime) game.finishTime = Date.now();
                        if (Date.now() - game.finishTime > ARCHIVE_DELAY) {
                            gamesToArchive.push(game);
                            return null;
                        }
                        return game;
                    }

                    const newLiveState = { ...game.liveState, events: [...game.liveState.events] };

                    if (newLiveState.status === 'not_started') {
                        newLiveState.status = 'in_progress';
                        newLiveState.events.push({ time: 0, description: "Match Started!" });
                    }
                    else if (newLiveState.status === 'in_progress') {
                        newLiveState.currentTime += 1;
                        if (newLiveState.currentTime === 45 && !newLiveState.events.some(e => e.description.includes("Half Time"))) {
                            newLiveState.status = 'half_time';
                            newLiveState.events.push({ time: 45, description: "Half Time" });
                        }
                        if (Math.random() < 0.05) {
                            const eventTime = newLiveState.currentTime;
                            if (Math.random() < 0.7) {
                                const scorerIsHome = Math.random() < 0.5;
                                if (scorerIsHome) { newLiveState.homeScore++; newLiveState.events.push({ time: eventTime, description: `Goal! ${game.homeTeam}` }); }
                                else { newLiveState.awayScore++; newLiveState.events.push({ time: eventTime, description: `Goal! ${game.awayTeam}` }); }
                            } else { newLiveState.events.push({ time: eventTime, description: `Chance` }); }
                        }
                        if (newLiveState.currentTime >= GAME_DURATION + (Math.random() * 5)) {
                            newLiveState.status = 'finished';
                            newLiveState.events.push({ time: newLiveState.currentTime, description: "Full Time!" });
                            resolveBetsRef.current({ ...game, liveState: newLiveState });
                        }
                    } else if (newLiveState.status === 'half_time') {
                        if (newLiveState.currentTime < 45 + 2) { newLiveState.currentTime += 1; }
                        else {
                            newLiveState.status = 'in_progress';
                            newLiveState.events.push({ time: 46, description: "Second Half!" });
                        }
                    }

                    if (newLiveState.status === 'in_progress' || newLiveState.status === 'half_time') {
                        newLiveState.currentOdds = calculateDynamicOdds(game.odds, newLiveState);
                    }
                    
                    return { ...game, liveState: newLiveState };
                }).filter((g): g is Game => g !== null);

                if (gamesToArchive.length > 0) {
                    setArchivedGames(prevArchived => {
                        const archivedIds = new Set(prevArchived.map(g => g.id));
                        const newUniqueGames = gamesToArchive.filter(g => !archivedIds.has(g.id));
                        return [...prevArchived, ...newUniqueGames];
                    });
                }
                
                if (gamesToStart.length > 0) {
                    const newLiveGames = gamesToStart.map(initializeLiveState);
                    const currentLiveIds = new Set(updatedGamesFromLive.map(g => g.id));
                    const filteredNewGames = newLiveGames.filter(g => !currentLiveIds.has(g.id));
                    updatedGamesFromLive.push(...filteredNewGames);
                }

                return updatedGamesFromLive;
            });
        };

        gameEngineIntervalRef.current = setInterval(gameEngine, SIMULATION_INTERVAL);
        return () => {
            if (gameEngineIntervalRef.current) clearInterval(gameEngineIntervalRef.current);
        };
    }, [allGames, setLiveGames, setArchivedGames]);
    
    useEffect(() => {
        setSelectedGamesForSlip(prevSlip =>
            prevSlip.map(slipGame => {
                const correspondingLiveGame = liveGames.find(lg => lg.id === slipGame.id);
                return correspondingLiveGame || slipGame;
            })
        );
    }, [liveGames]);

    const handleBetLive = (gameToAdd: Game, betType: 'Home Win' | 'Draw' | 'Away Win', liveOddsValue: string) => {
        if (!gameToAdd.liveState || (gameToAdd.liveState.status !== 'in_progress' && gameToAdd.liveState.status !== 'half_time')) {
            alert("Cannot place a live bet on a game that is not in progress or at half time.");
            return;
        }
    
        const isAlreadySelected = betConfigs[gameToAdd.id]?.type === betType;
    
        if (isAlreadySelected) {
            handleRemoveGameFromSlip(gameToAdd.id);
        } else {
            setSelectedGamesForSlip((prevSlipGames) => {
                const existingGameIndex = prevSlipGames.findIndex((sg) => sg.id === gameToAdd.id);
                if (existingGameIndex > -1) {
                    const updatedGames = [...prevSlipGames];
                    updatedGames[existingGameIndex] = { ...gameToAdd };
                    return updatedGames;
                } else {
                    return [...prevSlipGames, { ...gameToAdd }];
                }
            });
    
            setBetConfigs(prev => ({
                ...prev,
                [gameToAdd.id]: { 
                    type: betType, 
                    stake: prev[gameToAdd.id]?.stake || 1, 
                    liveOdds: liveOddsValue 
                }
            }));

             setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[gameToAdd.id];
                return newErrors;
            });
        }
    };

    const toggleGameSelection = (game: Game) => {
        const isGameLive = liveGames.some(lg => lg.id === game.id);
        if (isGameLive) {
            alert("This game is live or has finished. Please check the Live Games or Archive section.");
            return;
        }
        setSelectedGamesForSlip((prev) => {
            const isSelected = prev.find((g) => g.id === game.id);
            if (isSelected) {
                return prev.filter((g) => g.id !== game.id);
            }
            return [...prev, game];
        });
        setBetConfigs((prev) => {
            const newConfigs = { ...prev };
            if (prev[game.id]) delete newConfigs[game.id];
            return newConfigs;
        });
        setValidationErrors((prev) => ({ ...prev, global: undefined, [game.id]: undefined }));
    };

    const updateBetConfig = (gameId: string, type: string, stakeInput: string | number) => {
        const stakeAsNumber = typeof stakeInput === 'string' ? parseFloat(stakeInput) : stakeInput;
        const finalStake = isNaN(stakeAsNumber) ? 0 : stakeAsNumber;

        setBetConfigs((prev) => ({
            ...prev,
            [gameId]: { ...(prev[gameId] || {}), type, stake: finalStake },
        }));
        setValidationErrors((prev) => ({ ...prev, [gameId]: undefined, global: undefined }));
    };

    const validateBets = (): boolean => {
        const errors: ValidationErrorsMap = {};
        let isValid = true;
        setValidationErrors({});

        if (selectedGamesForSlip.length === 0) {
            errors.global = 'At least one game must be selected.';
            isValid = false;
        }

        const finishedGamesInSlip = selectedGamesForSlip.filter(
            sg => sg.liveState?.status === 'finished'
        );

        if (finishedGamesInSlip.length > 0) {
            errors.global = "One or more selected games have finished. Please remove them.";
            isValid = false;
        }
        
        let totalStake = 0;
        selectedGamesForSlip.forEach((gameOnSlip) => {
            const config = betConfigs[gameOnSlip.id];
            const gameErrors: ValidationError = {};
            if (!config || !config.type) { gameErrors.type = 'Bet type required.'; isValid = false; }
            if (!config || isNaN(config.stake) || config.stake <= 0 || config.stake > 9000000) { 
                gameErrors.stake = 'Stake must be a positive number up to €9,000,000.';
                isValid = false; 
            }
            else { totalStake += config.stake; }
            if (Object.keys(gameErrors).length > 0) errors[gameOnSlip.id] = gameErrors;
        });

        if (!termsAccepted) { errors.terms = 'Accept T&C.'; isValid = false; }
        
        if (user && totalStake > user.balance) {
            errors.global = `Insufficient funds. Stake €${totalStake.toFixed(2)} > Balance €${user.balance.toFixed(2)}.`;
            isValid = false;
        }
        
        setValidationErrors(errors);
        return isValid;
    };

    const handleSubmitBets = async () => {
        if (!validateBets() || !user) return;
        setSubmitLoading(true);
        try {
            const betsToSubmit: Omit<Bet, 'id'>[] = selectedGamesForSlip.map(gameOnSlip => {
                const config = betConfigs[gameOnSlip.id];
                const displayOdds = gameOnSlip.liveState?.currentOdds || gameOnSlip.odds;
                let oddValueStr: string | undefined = '1';

                if (config.type === "Home Win") oddValueStr = displayOdds.home;
                else if (config.type === "Away Win") oddValueStr = displayOdds.away;
                else if (config.type === "Draw") oddValueStr = displayOdds.draw;
                
                return {
                    gameId: gameOnSlip.id,
                    gameDetails: `${gameOnSlip.homeTeam} vs ${gameOnSlip.awayTeam}`,
                    betType: config.type,
                    stake: config.stake,
                    odds: oddValueStr || '1',
                    potentialWin: config.stake * parseFloat(oddValueStr || '1'),
                    userId: user.id,
                    timestamp: new Date().toISOString(),
                    isLiveBet: !!gameOnSlip.liveState,
                    status: 'pending'
                };
            });
            const submissionPromises = betsToSubmit.map(bet => api.post('/bets', bet));
            await Promise.all(submissionPromises);
            
            const totalStake = betsToSubmit.reduce((sum, bet) => sum + bet.stake, 0);
            updateBalance(user.balance - totalStake);
            
            setSubmissionSuccessData({ totalStake, bets: betsToSubmit });
            handleClearSlip();
        } catch (err) {
            console.error("Submit bets error:", err);
            setError('Bet submission failed.');
        } finally {
            setSubmitLoading(false);
        }
    };
    
    const gamesForList = useMemo(() => {
        const liveGameIds = new Set(liveGames.map(g => g.id));
        const preMatchGames = allGames.filter(g => !liveGameIds.has(g.id));
        
        let sortedGames = [...preMatchGames];

        sortedGames.sort((a, b) => {
            switch (sortBy) {
                case 'date_desc':
                    return new Date(b.commenceTime).getTime() - new Date(a.commenceTime).getTime();
                case 'odds_asc':
                    return parseFloat(a.odds.home) - parseFloat(b.odds.home);
                case 'odds_desc':
                    return parseFloat(b.odds.home) - parseFloat(a.odds.home);
                case 'date_asc':
                default:
                    return new Date(a.commenceTime).getTime() - new Date(b.commenceTime).getTime();
            }
        });

        if (selectedSport !== 'all') {
            sortedGames = sortedGames.filter(g => g.sportKey === selectedSport);
        }

        if (searchTerm.trim() !== '') {
            sortedGames = sortedGames.filter(g => 
                g.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) || 
                g.awayTeam.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return sortedGames;
    }, [allGames, liveGames, selectedSport, searchTerm, sortBy]);
    
    if (loading) return <LoadingMessage>Loading games...</LoadingMessage>;
    const uniqueSports = ['all', ...new Set(allGames.map(g => g.sportKey).filter(Boolean))];

    return (
        <DashboardLayout>
            <LiveGamesSection>
                <SectionHeader>
                    <SectionTitle>Live Games</SectionTitle>
                </SectionHeader>
                <LiveGamesContentContainer>
                    {liveGames.length > 0 ? (
                        liveGames.map((game) => (
                            <LiveGameView 
                                key={`${game.id}-live`} 
                                game={game} 
                                onBetLive={handleBetLive}
                                currentBetTypeForThisGame={betConfigs[game.id]?.type}
                            />
                        ))
                    ) : (
                        <LiveGamesPlaceholder>No live games currently. Waiting for matches to start...</LiveGamesPlaceholder>
                    )}
                </LiveGamesContentContainer>
            </LiveGamesSection>

            <MainContent>
                <SectionHeader>
                    <SectionTitle>Available Games (Pre-Match)</SectionTitle>
                </SectionHeader>
                <GameToolbar 
                    sports={uniqueSports}
                    selectedSport={selectedSport}
                    onFilterChange={setSelectedSport}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
                {error && !submitLoading && <GlobalError>{error}</GlobalError>}
                <GameListWrapper>
                    <GameList
                        games={gamesForList}
                        selectedGames={selectedGamesForSlip}
                        onGameSelect={toggleGameSelection}
                    />
                </GameListWrapper>
            </MainContent>
            
            <BetSlipContainer>
                {validationErrors.global && typeof validationErrors.global === 'string' && (
                    <GlobalError>{validationErrors.global}</GlobalError>
                )}
                <BetSlip
                    selectedGames={selectedGamesForSlip}
                    betConfigs={betConfigs}
                    onUpdateBetConfig={updateBetConfig}
                    termsAccepted={termsAccepted}
                    onTermsChange={setTermsAccepted}
                    onSubmit={handleSubmitBets}
                    onClearSlip={handleClearSlip}
                    validationErrors={validationErrors}
                    submitLoading={submitLoading}
                    onOpenTermsModal={() => setTermsModalOpen(true)}
                    onRemoveGame={handleRemoveGameFromSlip}
                />
            </BetSlipContainer>

            <TermsModal 
                isOpen={isTermsModalOpen} 
                onClose={() => setTermsModalOpen(false)} 
            />
            <SubmissionSuccessModal
                isOpen={submissionSuccessData !== null}
                onClose={() => setSubmissionSuccessData(null)}
                data={submissionSuccessData}
            />
        </DashboardLayout>
    );
};

export default DashboardPage;