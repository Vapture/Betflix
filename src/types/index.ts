export interface User {
  id: number;
  username: string;
  balance: number;
}

export interface Odds {
  home: string;
  draw?: string;
  away: string;
}

export interface LiveGameEvent {
  time: number; 
  description: string; 
}

export interface LiveGameState {
  currentTime: number;
  homeScore: number;
  awayScore: number;
  status: 'not_started' | 'in_progress' | 'half_time' | 'finished';
  events: LiveGameEvent[];
  currentOdds: Odds; 
}

export interface Game {
  id: string;
  sportKey: string;
  sportTitle: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string; 
  odds: Odds; 
  liveState?: LiveGameState; 
  finishTime?: number;
}

export interface BetConfig {
  type: string;
  stake: number;
  liveOdds?: string;
}

export interface BetConfigMap {
  [gameId: string]: BetConfig;
}

export interface ValidationError {
  type?: string;
  stake?: string;
}

export interface ValidationErrorsMap {
  [key: string]: ValidationError | string | undefined;
  global?: string;
  terms?: string;
}

export interface Bet {
    id?: number;
    gameId: string;
    gameDetails: string;
    betType: string;
    stake: number;
    odds: string;
    potentialWin: number;
    actualWin?: number;
    userId: number;
    timestamp: string;
    isLiveBet?: boolean;
    status?: 'pending' | 'won' | 'lost';
}

export interface BetsSubmissionPayload {
    allBets: Bet[];
    userId: number;
    submissionTime: string;
}