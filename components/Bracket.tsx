import React from 'react';
import { Match, MatchStatus } from '../types';
import { getUserById } from '../services/dataService';
import { Trophy } from 'lucide-react';

interface BracketProps {
  matches: Match[];
}

// A simple 2-round bracket visualizer for demo purposes
// In a real app, this would use a recursive tree renderer or d3
const Bracket: React.FC<BracketProps> = ({ matches }) => {
  const round1 = matches.filter(m => m.round === 1);
  const round2 = matches.filter(m => m.round === 2);

  const PlayerSlot = ({ userId, score, isWinner }: { userId: string | null, score: number, isWinner?: boolean }) => {
    const user = userId ? getUserById(userId) : null;
    return (
      <div className={`flex justify-between items-center p-2 border-l-4 ${isWinner ? 'border-dart-gold bg-gray-800' : 'border-gray-600 bg-dart-dark'} mb-1 text-sm`}>
        <span className={isWinner ? 'text-white font-bold' : 'text-gray-400'}>
          {user ? user.name.split(' ')[0] : '待定'}
        </span>
        <span className="font-mono bg-black px-2 py-0.5 rounded text-white">{score}</span>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto p-4 bg-[#1a1a20] rounded-xl border border-gray-800">
      <div className="flex justify-around min-w-[600px]">
        
        {/* Round 1 Column */}
        <div className="flex flex-col justify-around w-64 space-y-8">
          <h3 className="text-center text-dart-green font-mono text-sm mb-4">準決賽 (SEMI-FINALS)</h3>
          {round1.map(match => (
            <div key={match.id} className="relative group">
               <div className="absolute -right-6 top-1/2 w-6 h-0.5 bg-gray-700"></div>
              <PlayerSlot 
                userId={match.playerAId} 
                score={match.scoreA} 
                isWinner={match.winnerId === match.playerAId && match.status === MatchStatus.COMPLETED} 
              />
              <PlayerSlot 
                userId={match.playerBId} 
                score={match.scoreB} 
                isWinner={match.winnerId === match.playerBId && match.status === MatchStatus.COMPLETED} 
              />
               <div className="text-xs text-center mt-1 text-gray-500">
                {match.status === MatchStatus.IN_PROGRESS ? <span className="text-green-500 animate-pulse">進行中 (LIVE)</span> : match.status}
              </div>
            </div>
          ))}
        </div>

        {/* Round 2 Column */}
        <div className="flex flex-col justify-around w-64">
           <h3 className="text-center text-dart-gold font-mono text-sm mb-4">總決賽 (FINALS)</h3>
           {round2.map(match => (
            <div key={match.id} className="relative">
              <div className="absolute -left-6 top-1/2 w-6 h-0.5 bg-gray-700"></div>
              <div className="mb-2 flex justify-center"><Trophy className="w-6 h-6 text-dart-gold mb-2" /></div>
              <PlayerSlot 
                userId={match.playerAId} 
                score={match.scoreA} 
                isWinner={match.winnerId === match.playerAId && match.status === MatchStatus.COMPLETED} 
              />
              <PlayerSlot 
                userId={match.playerBId} 
                score={match.scoreB} 
                isWinner={match.winnerId === match.playerBId && match.status === MatchStatus.COMPLETED} 
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Bracket;