
import { MOCK_MATCHES, MOCK_REGISTRATIONS, MOCK_TOURNAMENTS, MOCK_USERS } from '../constants';
import { Match, MatchStatus, Registration, Tournament, TournamentStatus, User } from '../types';

// Keys for LocalStorage
const KEY_USERS = 'dart_app_users';
const KEY_TOURNAMENTS = 'dart_app_tournaments';
const KEY_MATCHES = 'dart_app_matches';
const KEY_REGISTRATIONS = 'dart_app_registrations';
const KEY_CURRENT_USER = 'dart_app_current_user_id';

// Helper to load or default
const load = <T>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

// Helper to save
const save = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// Initialize State
let users: User[] = load(KEY_USERS, MOCK_USERS);
let tournaments: Tournament[] = load(KEY_TOURNAMENTS, MOCK_TOURNAMENTS);
let matches: Match[] = load(KEY_MATCHES, MOCK_MATCHES);
let registrations: Registration[] = load(KEY_REGISTRATIONS, MOCK_REGISTRATIONS);

// Ensure persistence immediately (for first run)
save(KEY_USERS, users);
save(KEY_TOURNAMENTS, tournaments);
save(KEY_MATCHES, matches);
save(KEY_REGISTRATIONS, registrations);

// --- User Logic ---
export const getAllUsers = () => users;

export const getCurrentUser = (): User => {
  const storedId = localStorage.getItem(KEY_CURRENT_USER);
  const idToFind = storedId || 'u2'; // Default to Bob
  return users.find(u => u.id === idToFind) || users[0]; 
};

export const switchUser = (userId: string) => {
    localStorage.setItem(KEY_CURRENT_USER, userId);
    return users.find(u => u.id === userId) || users[0];
}

export const getUserById = (id: string) => users.find(u => u.id === id);

export const getUserStats = (userId: string) => {
  const userMatches = matches.filter(m => (m.playerAId === userId || m.playerBId === userId) && m.status === MatchStatus.COMPLETED);
  const wins = userMatches.filter(m => m.winnerId === userId).length;
  const losses = userMatches.length - wins;
  
  return {
    gamesPlayed: userMatches.length,
    wins,
    losses,
    winRate: userMatches.length > 0 ? Math.round((wins / userMatches.length) * 100) : 0,
    tournamentWins: 1, // Mocked for now
  };
};

// --- Tournament Logic ---
export const getTournaments = () => tournaments;
export const getTournamentById = (id: string) => tournaments.find(t => t.id === id);

export const addTournament = (newTournament: Tournament) => {
  tournaments = [newTournament, ...tournaments];
  save(KEY_TOURNAMENTS, tournaments);
};

export const updateTournament = (id: string, updates: Partial<Tournament>) => {
  tournaments = tournaments.map(t => t.id === id ? { ...t, ...updates } : t);
  save(KEY_TOURNAMENTS, tournaments);
};

export const registerForTournament = (userId: string, tournamentId: string): boolean => {
  const exists = registrations.find(r => r.userId === userId && r.tournamentId === tournamentId);
  if (exists) return false;

  const newReg: Registration = {
    id: `r${Date.now()}`,
    userId,
    tournamentId,
    registeredAt: new Date().toISOString(),
  };
  registrations = [...registrations, newReg];
  save(KEY_REGISTRATIONS, registrations); // PERSIST
  return true;
};

export const isRegistered = (userId: string, tournamentId: string) => {
  return registrations.some(r => r.userId === userId && r.tournamentId === tournamentId);
};

export const getRegisteredUsersForTournament = (tournamentId: string) => {
  const tournamentRegs = registrations.filter(r => r.tournamentId === tournamentId);
  return tournamentRegs.map(r => {
    const user = users.find(u => u.id === r.userId);
    return {
      regId: r.id,
      registeredAt: r.registeredAt,
      userId: user?.id || 'unknown',
      name: user?.name || '未知使用者',
      email: user?.email || '',
      points: user?.points || 0
    };
  });
};

// --- Match Logic & Trigger ---

export const getMatchesByTournament = (tournamentId: string) => {
  return matches.filter(m => m.tournamentId === tournamentId).sort((a, b) => a.round - b.round);
};

export const updateMatchScore = (matchId: string, scoreA: number, scoreB: number, winnerId: string | null) => {
  const matchIndex = matches.findIndex(m => m.id === matchId);
  if (matchIndex === -1) return;

  const match = matches[matchIndex];
  const newStatus = winnerId ? MatchStatus.COMPLETED : MatchStatus.IN_PROGRESS;

  const updatedMatch = {
    ...match,
    scoreA,
    scoreB,
    winnerId,
    status: newStatus,
  };

  matches[matchIndex] = updatedMatch;
  save(KEY_MATCHES, matches); // PERSIST

  // Trigger: Points System
  if (newStatus === MatchStatus.COMPLETED) {
     if (updatedMatch.playerAId) awardPoints(updatedMatch.playerAId, 1);
     if (updatedMatch.playerBId) awardPoints(updatedMatch.playerBId, 1);
     
     // Bonus points for winner
     if (winnerId) awardPoints(winnerId, 2);

     // Trigger: Bracket Progression
     if (winnerId && updatedMatch.nextMatchId) {
       promoteWinnerToNextMatch(updatedMatch.nextMatchId, winnerId);
     }
  }
};

const awardPoints = (userId: string, amount: number) => {
  users = users.map(u => u.id === userId ? { ...u, points: u.points + amount } : u);
  save(KEY_USERS, users); // PERSIST
};

const promoteWinnerToNextMatch = (nextMatchId: string, winnerId: string) => {
  const nextMatchIndex = matches.findIndex(m => m.id === nextMatchId);
  if (nextMatchIndex === -1) return;

  const nextMatch = matches[nextMatchIndex];
  
  let updates = {};
  if (!nextMatch.playerAId) {
    updates = { playerAId: winnerId };
  } else if (!nextMatch.playerBId) {
    updates = { playerBId: winnerId };
  }

  matches[nextMatchIndex] = { ...nextMatch, ...updates };
  save(KEY_MATCHES, matches); // PERSIST
};
