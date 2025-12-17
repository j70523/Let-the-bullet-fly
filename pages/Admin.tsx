
import React, { useState, useEffect } from 'react';
import { getTournaments, getMatchesByTournament, updateMatchScore, getUserById, getAllUsers, addTournament, updateTournament, getRegisteredUsersForTournament, getTournamentById } from '../services/dataService';
import { MatchStatus, Tournament, TournamentStatus } from '../types';
import { Edit2, Save, X, Activity, Users, Trophy, PlusCircle, ExternalLink, Wallet, FileText, Download, Settings, Image as ImageIcon } from 'lucide-react';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matches' | 'users' | 'create'>('matches');
  const [refreshKey, setRefreshKey] = useState(0); // Forcing re-render after updates
  
  // -- Matches Data --
  const tournaments = getTournaments();
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(tournaments[0]?.id);
  
  const selectedTournament = getTournamentById(selectedTournamentId);
  const matches = getMatchesByTournament(selectedTournamentId);
  const registeredUsers = getRegisteredUsersForTournament(selectedTournamentId);
  
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  // -- Edit Tournament Settings State --
  const [editImgUrl, setEditImgUrl] = useState('');
  const [editStatus, setEditStatus] = useState<TournamentStatus>(TournamentStatus.OPEN);

  useEffect(() => {
    if (selectedTournament) {
        setEditImgUrl(selectedTournament.bracketImageUrl || '');
        setEditStatus(selectedTournament.status);
    }
  }, [selectedTournamentId, selectedTournament]);

  const handleUpdateTournament = () => {
      if (!selectedTournament) return;
      updateTournament(selectedTournament.id, {
          bracketImageUrl: editImgUrl,
          status: editStatus
      });
      alert('賽事設定已更新！');
      setRefreshKey(prev => prev + 1);
  };

  // -- Users Data --
  const allUsers = getAllUsers();

  // -- Create Tournament Form State --
  const [newTournament, setNewTournament] = useState<Partial<Tournament>>({
    name: '',
    description: '',
    location: '',
    format: '501',
    eventDate: '',
    entryFee: 0,
    prizePool: '',
    googleFormUrl: '',
    // maxPlayers removed
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTournament.name || !newTournament.eventDate) return alert('請填寫必填欄位');

    const created: Tournament = {
      id: `t${Date.now()}`,
      name: newTournament.name!,
      description: newTournament.description || '',
      location: newTournament.location || '未定',
      format: newTournament.format as any,
      eventDate: newTournament.eventDate!,
      registrationStart: new Date().toISOString(),
      registrationEnd: newTournament.eventDate!, // Simplified
      status: TournamentStatus.OPEN,
      maxPlayers: 9999, // Practically unlimited
      entryFee: newTournament.entryFee || 0,
      prizePool: newTournament.prizePool || '無',
      googleFormUrl: newTournament.googleFormUrl || '',
      bracketImageUrl: '' // Intentionally empty on create
    };

    addTournament(created);
    alert('賽事建立成功！');
    setNewTournament({
        name: '', description: '', location: '', format: '501', eventDate: '', 
        entryFee: 0, prizePool: '', googleFormUrl: ''
    });
    setActiveTab('matches');
    setSelectedTournamentId(created.id);
  };

  const startEdit = (matchId: string, currentScoreA: number, currentScoreB: number) => {
    setEditingMatchId(matchId);
    setScoreA(currentScoreA);
    setScoreB(currentScoreB);
  };

  const cancelEdit = () => {
    setEditingMatchId(null);
  };

  const saveScore = (matchId: string, playerAId: string | null, playerBId: string | null) => {
    let winnerId = null;
    if (scoreA > scoreB && playerAId) winnerId = playerAId;
    else if (scoreB > scoreA && playerBId) winnerId = playerBId;
    if (scoreA === scoreB) winnerId = null;

    updateMatchScore(matchId, scoreA, scoreB, winnerId);
    setEditingMatchId(null);
    alert(`對戰已更新。${winnerId ? '贏家已產生，點數已發放。' : '比分已更新。'}`);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (registeredUsers.length === 0) return alert('目前無人報名');
    
    // Header
    const headers = ['User ID', '姓名', 'Email', '目前點數', '報名時間'];
    
    // Data rows
    const rows = registeredUsers.map(u => [
        u.userId,
        u.name,
        u.email,
        u.points,
        new Date(u.registeredAt).toLocaleString()
    ]);

    // Combine
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" // Add BOM for Chinese Excel support
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    // Download Hack
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedTournament?.name || 'tournament'}_報名名單.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">管理員儀表板</h1>
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
           <button 
             onClick={() => setActiveTab('matches')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'matches' ? 'bg-dart-accent text-white shadow' : 'text-gray-400 hover:text-white'}`}
           >
             賽程與報名
           </button>
           <button 
             onClick={() => setActiveTab('users')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'users' ? 'bg-dart-accent text-white shadow' : 'text-gray-400 hover:text-white'}`}
           >
             會員列表
           </button>
           <button 
             onClick={() => setActiveTab('create')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${activeTab === 'create' ? 'bg-dart-accent text-white shadow' : 'text-gray-400 hover:text-white'}`}
           >
             <PlusCircle className="w-3 h-3" /> 新增賽事
           </button>
        </div>
      </div>

      {activeTab === 'matches' && (
        <>
          {/* Tournament Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">選擇要管理的賽事</label>
            <select 
              value={selectedTournamentId} 
              onChange={(e) => setSelectedTournamentId(e.target.value)}
              className="w-full md:w-1/3 bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-dart-gold"
            >
              {tournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.status})</option>
              ))}
            </select>
          </div>
          
          {/* Tournament Settings (New Section) */}
          <div className="mb-8 bg-[#1a1a20] rounded-xl border border-gray-800 p-6">
             <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
                 <Settings className="w-5 h-5 text-dart-gold" />
                 <h2 className="text-lg font-bold text-white">賽事設定</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">賽事狀態</label>
                    <select 
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as TournamentStatus)}
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-dart-gold focus:outline-none"
                    >
                        <option value={TournamentStatus.OPEN}>開放報名 (OPEN)</option>
                        <option value={TournamentStatus.CLOSED}>報名截止 (CLOSED)</option>
                        <option value={TournamentStatus.ONGOING}>比賽進行中 (ONGOING)</option>
                        <option value={TournamentStatus.FINISHED}>已結束 (FINISHED)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> 對戰表圖片網址 (Bracket Image)
                    </label>
                    <input 
                        type="url" 
                        placeholder="https://imgur.com/..."
                        value={editImgUrl}
                        onChange={(e) => setEditImgUrl(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-dart-gold focus:outline-none"
                    />
                </div>
                <div className="md:col-span-2 flex justify-end">
                    <button 
                        onClick={handleUpdateTournament}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold rounded shadow transition"
                    >
                        更新設定
                    </button>
                </div>
             </div>
          </div>

          {/* Registration Section */}
          <div className="mb-8 bg-[#1a1a20] rounded-xl border border-gray-800 p-6">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-dart-gold" /> 報名狀況
                </h2>
                {selectedTournament?.googleFormUrl ? (
                    <a href={selectedTournament.googleFormUrl} target="_blank" rel="noreferrer" className="text-dart-accent text-sm flex items-center gap-1 hover:underline">
                        查看外部表單 <ExternalLink className="w-3 h-3" />
                    </a>
                ) : (
                    <button 
                        onClick={handleExportCSV}
                        disabled={registeredUsers.length === 0}
                        className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" /> 匯出名單 (CSV)
                    </button>
                )}
             </div>

             {selectedTournament?.googleFormUrl ? (
                 <div className="bg-gray-900/50 p-4 rounded text-gray-400 text-sm text-center border border-dashed border-gray-700">
                    此賽事使用外部 Google 表單報名，請點擊上方連結查看。
                 </div>
             ) : (
                 <div className="overflow-x-auto">
                    {registeredUsers.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-900 text-gray-500 font-medium">
                                <tr>
                                    <th className="p-3 rounded-l">姓名</th>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3 rounded-r">報名時間</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {registeredUsers.map(r => (
                                    <tr key={r.regId}>
                                        <td className="p-3 text-white font-bold">{r.name}</td>
                                        <td className="p-3 font-mono text-xs">{r.userId}</td>
                                        <td className="p-3">{r.email}</td>
                                        <td className="p-3">{new Date(r.registeredAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-4 text-gray-500">尚無人員報名 (內建系統)。</div>
                    )}
                    <div className="mt-2 text-right text-xs text-gray-500">
                        目前報名人數: {registeredUsers.length} 人 (無上限)
                    </div>
                 </div>
             )}
          </div>

          <div className="bg-dart-dark rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">比分登錄</h2>
              <p className="text-sm text-gray-500">
                  注意：目前系統支援 1v1 比分輸入。若您的賽事為 4人混戰，請參考上方上傳的對戰表圖片為主，
                  此處可用於記錄關鍵對戰或單純作為晉級紀錄。
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-900 uppercase font-medium">
                  <tr>
                    <th className="p-4">輪次</th>
                    <th className="p-4">選手 A</th>
                    <th className="p-4 text-center">比分</th>
                    <th className="p-4">選手 B</th>
                    <th className="p-4">狀態</th>
                    <th className="p-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {matches.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center">本賽事尚未產生對戰組合，請使用圖片對戰表功能。</td></tr>
                  ) : matches.map(match => {
                    const playerA = match.playerAId ? getUserById(match.playerAId) : null;
                    const playerB = match.playerBId ? getUserById(match.playerBId) : null;
                    const isEditing = editingMatchId === match.id;

                    return (
                      <tr key={match.id} className="hover:bg-gray-800/50 transition">
                        <td className="p-4 font-mono">{match.round === 1 ? '準決賽' : '決賽'}</td>
                        <td className={`p-4 ${match.winnerId === match.playerAId ? 'text-dart-gold font-bold' : ''}`}>
                          {playerA ? playerA.name : '待定'}
                        </td>
                        <td className="p-4 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-2">
                              <input 
                                  type="number" 
                                  value={scoreA} 
                                  onChange={(e) => setScoreA(parseInt(e.target.value))}
                                  className="w-12 bg-black text-white text-center border border-gray-600 rounded"
                              />
                              <span>-</span>
                              <input 
                                  type="number" 
                                  value={scoreB} 
                                  onChange={(e) => setScoreB(parseInt(e.target.value))}
                                  className="w-12 bg-black text-white text-center border border-gray-600 rounded"
                              />
                            </div>
                          ) : (
                            <span className="font-mono text-white text-lg">{match.scoreA} - {match.scoreB}</span>
                          )}
                        </td>
                        <td className={`p-4 ${match.winnerId === match.playerBId ? 'text-dart-gold font-bold' : ''}`}>
                          {playerB ? playerB.name : '待定'}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            match.status === MatchStatus.COMPLETED ? 'bg-green-900 text-green-300' :
                            match.status === MatchStatus.IN_PROGRESS ? 'bg-blue-900 text-blue-300' :
                            'bg-gray-700'
                          }`}>
                            {match.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {isEditing ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => saveScore(match.id, match.playerAId, match.playerBId)} className="p-2 bg-green-700 text-white rounded hover:bg-green-600"><Save className="w-4 h-4" /></button>
                              <button onClick={cancelEdit} className="p-2 bg-red-700 text-white rounded hover:bg-red-600"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => startEdit(match.id, match.scoreA, match.scoreB)} 
                              disabled={match.status === MatchStatus.COMPLETED || (!match.playerAId || !match.playerBId)}
                              className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <>
          {/* User Management View */}
          <div className="bg-dart-dark rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">會員列表</h2>
                <p className="text-sm text-gray-500">查看所有註冊會員的資料與點數。</p>
              </div>
              <div className="bg-blue-900/30 px-3 py-1 rounded text-blue-300 text-sm flex items-center gap-2">
                <Users className="w-4 h-4" /> 總人數: {allUsers.length}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {allUsers.map(user => (
                <div key={user.id} className="bg-[#151518] border border-gray-800 rounded-lg p-4 flex items-center gap-4 hover:border-gray-600 transition">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border border-gray-600" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <h3 className="text-white font-bold">{user.name}</h3>
                       <span className={`text-[10px] px-1.5 py-0.5 rounded border ${user.role === 'ADMIN' ? 'border-red-500 text-red-500' : 'border-gray-600 text-gray-500'}`}>{user.role}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                       <span className="text-xs flex items-center gap-1 text-dart-gold"><Wallet className="w-3 h-3" /> {user.points} 點</span>
                       <span className="text-xs flex items-center gap-1 text-gray-400" title="User ID"><div className="w-1 h-1 bg-gray-500 rounded-full"></div> {user.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'create' && (
        <div className="bg-dart-dark rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">建立新賽事</h2>
              <p className="text-sm text-gray-500">填寫下方資訊以發布新的飛鏢賽事。</p>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">賽事名稱 *</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-dart-gold focus:outline-none"
                        value={newTournament.name}
                        onChange={e => setNewTournament({...newTournament, name: e.target.value})}
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">比賽時間 *</label>
                    <input 
                        type="datetime-local" 
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-dart-gold focus:outline-none"
                        value={newTournament.eventDate}
                        onChange={e => setNewTournament({...newTournament, eventDate: e.target.value})}
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">地點</label>
                    <input 
                        type="text" 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-dart-gold focus:outline-none"
                        value={newTournament.location}
                        onChange={e => setNewTournament({...newTournament, location: e.target.value})}
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">賽制</label>
                    <select 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-dart-gold focus:outline-none"
                        value={newTournament.format}
                        onChange={e => setNewTournament({...newTournament, format: e.target.value as any})}
                    >
                        <option value="501">501</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Medley">Medley</option>
                    </select>
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">報名費 ($)</label>
                    <input 
                        type="number" 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-dart-gold focus:outline-none"
                        value={newTournament.entryFee}
                        onChange={e => setNewTournament({...newTournament, entryFee: parseInt(e.target.value)})}
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">總獎金/獎品描述</label>
                    <input 
                        type="text" 
                        placeholder="例：$10,000 + 獎盃"
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-dart-gold focus:outline-none"
                        value={newTournament.prizePool}
                        onChange={e => setNewTournament({...newTournament, prizePool: e.target.value})}
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1">賽事詳情與規則</label>
                    <textarea 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-dart-gold focus:outline-none h-24"
                        value={newTournament.description}
                        onChange={e => setNewTournament({...newTournament, description: e.target.value})}
                    ></textarea>
                </div>
                
                <div className="col-span-2 border-t border-gray-800 pt-4 mt-2">
                    <h3 className="text-white font-bold mb-4">外部連結設定</h3>
                </div>

                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                       Google 表單連結 (選填) <ExternalLink className="w-3 h-3" />
                    </label>
                    <input 
                        type="url" 
                        placeholder="若留空，將使用內建報名系統"
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-dart-gold focus:outline-none"
                        value={newTournament.googleFormUrl}
                        onChange={e => setNewTournament({...newTournament, googleFormUrl: e.target.value})}
                    />
                    <p className="text-[10px] text-gray-500 mt-1">留空此欄位以使用系統內建的名單管理與匯出功能。對戰表圖片可於建立賽事後在「賽程與報名」頁籤中設定。</p>
                </div>

                <div className="col-span-2 flex justify-end mt-4">
                    <button type="submit" className="px-6 py-3 bg-dart-accent hover:bg-red-600 text-white font-bold rounded shadow-lg transition">
                        確認發布賽事
                    </button>
                </div>
            </form>
        </div>
      )}

    </div>
  );
};

export default Admin;
