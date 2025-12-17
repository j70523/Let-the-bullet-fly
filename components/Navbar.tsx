import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Target, Trophy, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { getAllUsers } from '../services/dataService';
import { UserRole, User } from '../types';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (userId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onSwitchUser }) => {
  const location = useLocation();
  const allUsers = getAllUsers();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path ? "text-dart-gold" : "text-gray-400 hover:text-white";

  const handleSwitch = (userId: string) => {
    onSwitchUser(userId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-dart-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-dart-accent p-1.5 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-wider hidden md:block">
                讓子彈飛
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={`${isActive('/')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>
                首頁
              </Link>
              <Link to="/tournaments" className={`${isActive('/tournaments')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>
                賽事列表
              </Link>
              <Link to="/rules" className={`${isActive('/rules')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>
                規則說明
              </Link>
              {currentUser.role === UserRole.ADMIN && (
                <Link to="/admin" className={`${isActive('/admin')} px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 transition-colors`}>
                  管理後台
                </Link>
              )}
            </div>
          </div>

          {/* User Profile & Switcher */}
          <div className="flex items-center gap-4 relative">
             <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 transition"
                >
                  <img src={currentUser.avatar} className="w-6 h-6 rounded-full" alt="avatar" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-white leading-none">{currentUser.name}</span>
                    <span className="text-[10px] text-gray-500 leading-none mt-0.5">{currentUser.role === UserRole.ADMIN ? '管理員' : '會員'}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-[#1a1a20] rounded-xl shadow-2xl border border-gray-700 py-2 overflow-hidden z-50">
                      <div className="px-4 py-2 border-b border-gray-800">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">切換使用者 (模擬登入)</p>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {allUsers.map(u => (
                          <button
                            key={u.id}
                            onClick={() => handleSwitch(u.id)}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition ${u.id === currentUser.id ? 'bg-gray-800/50' : ''}`}
                          >
                            <img src={u.avatar} className="w-8 h-8 rounded-full border border-gray-600" alt="" />
                            <div>
                              <div className={`text-sm font-medium ${u.id === currentUser.id ? 'text-dart-gold' : 'text-gray-300'}`}>
                                {u.name}
                              </div>
                              <div className="text-xs text-gray-500">{u.role}</div>
                            </div>
                            {u.id === currentUser.id && <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
             </div>

             {/* Profile Link */}
             <Link to="/profile" className="p-2 bg-dart-dark rounded-full hover:bg-gray-700 transition hidden md:block" title="個人檔案">
                <UserIcon className="h-5 w-5 text-dart-gold" />
             </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="md:hidden flex justify-around bg-dart-dark py-2 border-t border-gray-800">
        <Link to="/tournaments"><Trophy className="h-5 w-5 text-gray-400" /></Link>
        <Link to="/"><Target className="h-5 w-5 text-dart-accent" /></Link>
        <Link to="/profile"><UserIcon className="h-5 w-5 text-gray-400" /></Link>
      </div>
    </nav>
  );
};

export default Navbar;