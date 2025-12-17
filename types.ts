
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum TournamentStatus {
  OPEN = 'OPEN',         // Registration Open
  CLOSED = 'CLOSED',     // Registration Closed / Preparing
  ONGOING = 'ONGOING',   // Matches happening
  FINISHED = 'FINISHED', // Event done
}

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number; // Loyalty Points
  avatar?: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  location: string;
  format: '501' | 'Cricket' | 'Medley';
  registrationStart: string; // ISO Date
  registrationEnd: string;   // ISO Date
  eventDate: string;         // ISO Date
  status: TournamentStatus;
  maxPlayers: number;
  entryFee: number;
  // New Fields
  prizePool: string;       // e.g. "總獎金 $10,000"
  bracketImageUrl?: string; // URL to the bracket image
  googleFormUrl?: string;   // URL to Google Form
}

export interface Registration {
  id: string;
  userId: string;
  tournamentId: string;
  registeredAt: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number; // 1 = Quarter, 2 = Semi, 3 = Final (simplified)
  playerAId: string | null; // Null if TBD (waiting for previous match)
  playerBId: string | null;
  scoreA: number;
  scoreB: number;
  winnerId: string | null;
  nextMatchId: string | null; // For bracket progression
  status: MatchStatus;
}

// Stats interface for charts
export interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  tournamentWins: number;
  winRate: number;
}
