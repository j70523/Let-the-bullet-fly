
import { User, Tournament, Match, Registration, UserRole, TournamentStatus, MatchStatus } from './types';

// Mock Users
export const MOCK_USERS: User[] = [
  { id: 'u1', name: '管理員 Alice', email: 'admin@darts.com', role: UserRole.ADMIN, points: 100, avatar: 'https://picsum.photos/100/100?random=1' },
  { id: 'u2', name: 'Bob "公牛" Smith', email: 'bob@user.com', role: UserRole.USER, points: 50, avatar: 'https://picsum.photos/100/100?random=2' },
  { id: 'u3', name: 'Charlie "結鏢王"', email: 'charlie@user.com', role: UserRole.USER, points: 30, avatar: 'https://picsum.photos/100/100?random=3' },
  { id: 'u4', name: 'Diana "雙倍紅心"', email: 'diana@user.com', role: UserRole.USER, points: 75, avatar: 'https://picsum.photos/100/100?random=4' },
  { id: 'u5', name: 'Evan "老鷹"', email: 'evan@user.com', role: UserRole.USER, points: 10, avatar: 'https://picsum.photos/100/100?random=5' },
];

// Mock Tournaments
export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: '2024 冬季盃',
    description: '終極 501 決戰，高手雲集。',
    location: '市中心 Bullet Bar',
    format: '501',
    registrationStart: '2023-10-01T00:00:00Z',
    registrationEnd: '2023-10-20T23:59:59Z',
    eventDate: '2023-10-25T18:00:00Z',
    status: TournamentStatus.FINISHED,
    maxPlayers: 8,
    entryFee: 500,
    prizePool: '$10,000 + 獎盃',
    googleFormUrl: '',
  },
  {
    id: 't2',
    name: '春季 Cricket 公開賽',
    description: '講究策略的 Cricket 賽制，等你來挑戰。',
    location: '飛鏢競技場',
    format: 'Cricket',
    registrationStart: '2024-03-01T00:00:00Z',
    registrationEnd: '2024-03-15T23:59:59Z',
    eventDate: '2024-03-20T19:00:00Z',
    status: TournamentStatus.ONGOING,
    maxPlayers: 8,
    entryFee: 300,
    prizePool: '$5,000',
    googleFormUrl: 'https://docs.google.com/forms',
  },
  {
    id: 't3',
    name: '夏季大滿貫',
    description: '高額獎金，高強度的 Medley 混合賽制。',
    location: '海濱酒吧',
    format: 'Medley',
    registrationStart: '2024-06-01T00:00:00Z',
    registrationEnd: '2024-06-30T23:59:59Z',
    eventDate: '2024-07-15T18:00:00Z',
    status: TournamentStatus.OPEN,
    maxPlayers: 16,
    entryFee: 1000,
    prizePool: '$30,000 總獎金',
    googleFormUrl: 'https://docs.google.com/forms',
  },
];

// Mock Registrations
export const MOCK_REGISTRATIONS: Registration[] = [
  { id: 'r1', userId: 'u2', tournamentId: 't2', registeredAt: '2024-03-02T10:00:00Z' },
  { id: 'r2', userId: 'u3', tournamentId: 't2', registeredAt: '2024-03-02T11:00:00Z' },
  { id: 'r3', userId: 'u4', tournamentId: 't2', registeredAt: '2024-03-03T09:00:00Z' },
  { id: 'r4', userId: 'u5', tournamentId: 't2', registeredAt: '2024-03-03T14:00:00Z' },
];

// Mock Matches (For Tournament t2 - Ongoing)
// Structure for 4 players (Semifinals -> Finals)
export const MOCK_MATCHES: Match[] = [
  // Round 1 (Semi-Finals)
  {
    id: 'm1',
    tournamentId: 't2',
    round: 1,
    playerAId: 'u2',
    playerBId: 'u3',
    scoreA: 2,
    scoreB: 1,
    winnerId: 'u2',
    nextMatchId: 'm3',
    status: MatchStatus.COMPLETED,
  },
  {
    id: 'm2',
    tournamentId: 't2',
    round: 1,
    playerAId: 'u4',
    playerBId: 'u5',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    nextMatchId: 'm3',
    status: MatchStatus.IN_PROGRESS,
  },
  // Round 2 (Finals)
  {
    id: 'm3',
    tournamentId: 't2',
    round: 2,
    playerAId: 'u2', // Winner of m1
    playerBId: null, // Winner of m2 (TBD)
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    nextMatchId: null,
    status: MatchStatus.SCHEDULED,
  },
];
