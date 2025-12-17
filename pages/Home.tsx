import React from 'react';
import { Link } from 'react-router-dom';
import { getTournaments } from '../services/dataService';
import { Calendar, ArrowRight, Star } from 'lucide-react';
import { TournamentStatus } from '../types';

const Home: React.FC = () => {
  const featuredTournament = getTournaments().find(t => t.status === TournamentStatus.ONGOING);
  const upcomingTournaments = getTournaments().filter(t => t.status === TournamentStatus.OPEN);

  return (
    <div className="space-y-12 pb-10">
      
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-dart-black via-gray-900 to-dart-accent opacity-90 z-0"></div>
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533237264985-ee692791555a?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-20 z-0"
        ></div>
        
        <div className="relative z-10 max-w-2xl px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            讓子彈 <span className="text-dart-accent">飛</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            專業飛鏢賽事管理首選平台。
            報名參賽、競技對決，攀登排名巔峰。
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/tournaments" className="px-8 py-3 bg-dart-accent text-white font-bold rounded-full hover:bg-red-600 transition shadow-lg shadow-red-900/50">
              報名賽事
            </Link>
            <Link to="/rules" className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-700 transition border border-gray-600">
              查看規則
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Live Event */}
      {featuredTournament && (
        <section className="px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h2 className="text-xl font-bold text-white">現正熱映</h2>
          </div>
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border-l-4 border-dart-gold flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{featuredTournament.name}</h3>
              <p className="text-gray-400 mb-4">{featuredTournament.description}</p>
              <div className="flex gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(featuredTournament.eventDate).toLocaleDateString()}</span>
                <span className="bg-dart-black px-2 py-0.5 rounded text-dart-gold border border-dart-gold/30">{featuredTournament.format}</span>
              </div>
            </div>
            <Link to={`/tournaments?id=${featuredTournament.id}`} className="mt-4 md:mt-0 flex items-center gap-2 text-dart-gold hover:text-yellow-300 font-semibold">
              查看賽程 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section className="px-4">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-dart-accent" /> 即將到來的賽事
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTournaments.map(t => (
             <div key={t.id} className="bg-dart-dark rounded-xl p-6 border border-gray-800 hover:border-gray-600 transition group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-dart-green bg-green-900/30 px-2 py-1 rounded uppercase">開放報名</span>
                  <span className="text-sm font-mono text-gray-500">{t.format}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-dart-accent transition">{t.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{t.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                   <div className="text-sm text-gray-300">
                     報名費: <span className="text-white font-bold">${t.entryFee}</span>
                   </div>
                   <Link to={`/tournaments?id=${t.id}`} className="text-sm text-dart-accent font-medium hover:underline">詳情</Link>
                </div>
             </div>
          ))}
          {upcomingTournaments.length === 0 && (
             <p className="text-gray-500 italic col-span-full">目前沒有即將到來的賽事。</p>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;