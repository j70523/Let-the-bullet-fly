
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTournaments, getMatchesByTournament, registerForTournament, getCurrentUser, isRegistered } from '../services/dataService';
import { Tournament, TournamentStatus } from '../types';
import Bracket from '../components/Bracket';
import { Calendar, MapPin, Users, ChevronRight, CheckCircle, AlertCircle, DollarSign, ExternalLink } from 'lucide-react';

const Tournaments: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');
  const [refreshTick, setRefreshTick] = useState(0); // Used to force re-render
  
  const tournaments = getTournaments();
  const currentUser = getCurrentUser();

  const handleSelect = (id: string) => {
    setSearchParams({ id });
  };

  const handleRegister = (tId: string) => {
    if (!currentUser) return;
    
    const success = registerForTournament(currentUser.id, tId);
    if (success) {
      // Update local state to trigger re-render, so isRegistered check updates instantly
      setRefreshTick(prev => prev + 1); 
    } else {
      alert("報名失敗或已重複報名。");
    }
  };

  // If a tournament is selected, show details
  if (selectedId) {
    const tournament = tournaments.find(t => t.id === selectedId);
    if (!tournament) return <div>找不到賽事</div>;

    // These will be re-evaluated when refreshTick changes
    const matches = getMatchesByTournament(tournament.id);
    const userRegistered = isRegistered(currentUser.id, tournament.id);
    const isRegOpen = tournament.status === TournamentStatus.OPEN;
    const hasGoogleForm = !!tournament.googleFormUrl;

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => setSearchParams({})} className="text-gray-400 hover:text-white mb-6 flex items-center gap-1">
          &larr; 返回列表
        </button>

        <div className="bg-dart-dark rounded-2xl p-8 border border-gray-800 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{tournament.name}</h1>
              <div className="flex flex-wrap gap-4 text-gray-400">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(tournament.eventDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {tournament.location}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 上限 {tournament.maxPlayers} 人</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  tournament.status === TournamentStatus.OPEN ? 'bg-green-900 text-green-300' :
                  tournament.status === TournamentStatus.ONGOING ? 'bg-amber-900 text-amber-300' :
                  'bg-gray-700 text-gray-300'
              }`}>
                {tournament.status}
              </span>

              {/* Action Buttons */}
              {isRegOpen ? (
                  hasGoogleForm ? (
                    <a 
                      href={tournament.googleFormUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-dart-accent hover:bg-red-600 text-white font-bold rounded-lg transition shadow-lg shadow-red-900/20 active:scale-95 flex items-center gap-2"
                    >
                      前往報名 (Google Form) <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    userRegistered ? (
                        <button disabled className="px-6 py-2 bg-gray-700 text-green-400 font-bold rounded-lg flex items-center gap-2 cursor-default border border-green-900/50">
                        <CheckCircle className="w-5 h-5" /> 已報名成功
                        </button>
                    ) : (
                        <button 
                            onClick={() => handleRegister(tournament.id)}
                            className="px-6 py-2 bg-dart-accent hover:bg-red-600 text-white font-bold rounded-lg transition shadow-lg shadow-red-900/20 active:scale-95"
                        >
                            立即報名 (${tournament.entryFee})
                        </button>
                    )
                  )
              ) : (
                <button disabled className="px-6 py-2 bg-gray-800 text-gray-500 font-bold rounded-lg cursor-not-allowed">
                  報名截止
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <h3 className="text-lg font-bold text-white mb-4">賽事詳情</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{tournament.description}</p>
                
                <div className="mt-6 flex items-center gap-2 text-dart-gold border border-dart-gold/20 bg-dart-gold/5 p-3 rounded-lg w-fit">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-bold">獎金池：{tournament.prizePool || '無'}</span>
                </div>
             </div>
             <div>
                <h4 className="text-sm font-bold text-dart-gold uppercase mb-2">賽制</h4>
                <p className="text-gray-300 mb-4 bg-gray-900 p-3 rounded">{tournament.format}</p>
                
                <h4 className="text-sm font-bold text-dart-gold uppercase mb-2">地點</h4>
                <p className="text-gray-300 bg-gray-900 p-3 rounded">{tournament.location}</p>
             </div>
          </div>
        </div>

        {/* Bracket Section */}
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-dart-accent">賽程表 (Bracket)</h2>
            
            {tournament.bracketImageUrl ? (
                <div className="bg-[#1a1a20] p-4 rounded-xl border border-gray-800">
                    <img 
                        src={tournament.bracketImageUrl} 
                        alt="Tournament Bracket" 
                        className="w-full h-auto rounded shadow-lg"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            // You might want to show a fallback message here
                        }}
                    />
                    <p className="text-center text-gray-500 text-sm mt-2">由管理員上傳的外部對戰表</p>
                </div>
            ) : (
                matches.length > 0 ? (
                    <Bracket matches={matches} />
                ) : (
                    <div className="p-8 bg-gray-900/50 rounded-xl border border-dashed border-gray-700 text-center">
                        <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <h3 className="text-lg text-gray-300">賽程表尚未產生</h3>
                        <p className="text-gray-500 text-sm">一旦管理員確認對戰名單，賽程圖表將顯示於此。</p>
                    </div>
                )
            )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">所有賽事</h1>
      
      <div className="grid gap-4">
        {tournaments.map(t => {
           const isReg = isRegistered(currentUser.id, t.id);
           const hasExternalReg = !!t.googleFormUrl;
           
           return (
            <div 
              key={t.id} 
              onClick={() => handleSelect(t.id)}
              className="bg-dart-dark p-6 rounded-xl border border-gray-800 hover:border-dart-gold hover:bg-[#25252b] transition cursor-pointer flex justify-between items-center group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-dart-gold transition">{t.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    t.status === TournamentStatus.ONGOING ? 'border-red-500 text-red-500 animate-pulse' : 'border-gray-600 text-gray-500'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <div className="flex gap-6 text-sm text-gray-400">
                  <span>{new Date(t.eventDate).toLocaleDateString()}</span>
                  <span>{t.format}</span>
                  <span>{t.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {hasExternalReg ? (
                   <div className="text-xs text-dart-accent border border-dart-accent/30 px-2 py-1 rounded">外部報名</div>
                ) : (
                   isReg && <div className="flex items-center gap-1 text-green-500 text-sm font-medium"><CheckCircle className="w-4 h-4" /> 已報名</div>
                )}
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-white" />
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};

export default Tournaments;
