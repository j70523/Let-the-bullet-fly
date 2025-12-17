import React from 'react';
import { getCurrentUser, getUserStats } from '../services/dataService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { User, Trophy, Wallet, Medal } from 'lucide-react';

const Profile: React.FC = () => {
  const user = getCurrentUser();
  const stats = getUserStats(user.id);

  const chartData = [
    { name: '勝場', value: stats.wins, color: '#2A9D8F' },
    { name: '敗場', value: stats.losses, color: '#E63946' },
    { name: '總場次', value: stats.gamesPlayed, color: '#FFB703' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-gray-900 to-dart-black rounded-3xl p-8 border border-gray-800 flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <div className="relative">
           <img src={user.avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 border-dart-gold shadow-lg shadow-yellow-900/20" />
           <div className="absolute bottom-0 right-0 bg-dart-dark p-2 rounded-full border border-gray-700">
             <User className="w-5 h-5 text-white" />
           </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-gray-400 mb-4">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <span className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300 border border-gray-700">身分: {user.role}</span>
             <span className="px-3 py-1 bg-dart-gold/10 text-dart-gold rounded text-sm border border-dart-gold/30 font-mono">ID: {user.id}</span>
          </div>
        </div>

        {/* Loyalty Card */}
        <div className="w-full md:w-80 bg-gradient-to-br from-dart-accent to-red-800 rounded-xl p-6 text-white shadow-2xl transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-white/10">
            <Trophy className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-1 opacity-90">會員積點</h3>
            <div className="text-5xl font-extrabold mb-2">{user.points}</div>
            <p className="text-xs opacity-75">透過參加賽事累積點數。</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
             <span className="text-xs font-mono">#### #### 8812</span>
             <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        
        {/* Performance Chart */}
        <div className="bg-dart-dark p-6 rounded-2xl border border-gray-800">
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <Medal className="w-5 h-5 text-dart-gold" /> 表現數據
           </h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={60} />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#1E1E24', borderColor: '#374151', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                 />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Summary Boxes */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-[#151518] p-6 rounded-2xl border border-gray-800 flex flex-col justify-center items-center">
              <span className="text-4xl font-bold text-dart-green mb-1">{stats.winRate}%</span>
              <span className="text-sm text-gray-500 uppercase">勝率</span>
           </div>
           <div className="bg-[#151518] p-6 rounded-2xl border border-gray-800 flex flex-col justify-center items-center">
              <span className="text-4xl font-bold text-dart-gold mb-1">{stats.tournamentWins}</span>
              <span className="text-sm text-gray-500 uppercase">奪冠次數</span>
           </div>
           <div className="bg-[#151518] p-6 rounded-2xl border border-gray-800 flex flex-col justify-center items-center col-span-2">
              <div className="flex gap-4">
                <div className="text-center">
                   <div className="text-2xl font-bold text-white">{stats.gamesPlayed}</div>
                   <div className="text-xs text-gray-500">已賽</div>
                </div>
                <div className="w-px bg-gray-700"></div>
                <div className="text-center">
                   <div className="text-2xl font-bold text-white">{stats.wins}</div>
                   <div className="text-xs text-gray-500">勝</div>
                </div>
                <div className="w-px bg-gray-700"></div>
                <div className="text-center">
                   <div className="text-2xl font-bold text-white">{stats.losses}</div>
                   <div className="text-xs text-gray-500">敗</div>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;