import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import Rules from './pages/Rules';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { getCurrentUser, switchUser } from './services/dataService';
import { UserRole } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const handleUserSwitch = (userId: string) => {
    switchUser(userId); // Updates localStorage
    setCurrentUser(getCurrentUser()); // Updates React State
  };

  return (
    <Router>
      <div className="min-h-screen bg-dart-black text-gray-200 font-sans selection:bg-dart-accent selection:text-white">
        {/* Pass the switcher handler to Navbar */}
        <Navbar 
          currentUser={currentUser} 
          onSwitchUser={handleUserSwitch} 
        />
        
        {/* Use key={currentUser.id} to force all pages to re-mount when user changes. 
            This ensures they fetch fresh data (permissions, profile, etc.) without a browser reload. */}
        <main className="container mx-auto" key={currentUser.id}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/profile" element={<Profile />} />
            <Route 
              path="/admin" 
              element={currentUser.role === UserRole.ADMIN ? <Admin /> : <Navigate to="/" replace />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-gray-800 mt-20 py-8 text-center text-gray-600 text-sm">
          <p>&copy; 2024 讓子彈飛. 版權所有.</p>
          <p className="mt-2 text-xs">專業飛鏢賽事管理系統</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;