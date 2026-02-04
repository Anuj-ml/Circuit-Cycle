import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { User, Map, BarChart3, Settings, Scan, Trash2, Truck, ShieldAlert } from 'lucide-react';
import { UserPortal } from './components/UserPortal';
import { BinKiosk } from './components/BinKiosk';
import { AdminPortal } from './components/AdminPortal';
import { useStore } from './store';

// Helper for navigation based on role (User, Admin, Kiosk)
const NavBar = () => {
  const location = useLocation();
  const isUserRoute = location.pathname.startsWith('/user');
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Don't show nav on kiosk or root selection
  if (location.pathname === '/' || location.pathname.startsWith('/bin')) return null;

  if (isUserRoute) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex justify-around items-center z-50 px-4 glass-panel">
        <NavLink to="/user/map" icon={<Map size={20} />} label="Map" active={location.pathname === '/user/map'} />
        <NavLink to="/user/scan" icon={<Scan size={24} />} label="SCAN" active={location.pathname === '/user/scan'} isFab />
        <NavLink to="/user/profile" icon={<User size={20} />} label="Profile" active={location.pathname === '/user/profile'} />
      </nav>
    );
  }

  if (isAdminRoute) {
    return (
      <nav className="fixed top-0 left-0 bottom-0 w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 z-50">
        <div className="mb-8 text-emerald-500 font-bold text-xl">CC</div>
        <div className="flex flex-col gap-6">
          <NavLink to="/admin/dashboard" icon={<BarChart3 size={24} />} label="" active={location.pathname === '/admin/dashboard'} />
          <NavLink to="/admin/fleet" icon={<Truck size={24} />} label="" active={location.pathname === '/admin/fleet'} />
          <NavLink to="/admin/alerts" icon={<ShieldAlert size={24} />} label="" active={location.pathname === '/admin/alerts'} />
        </div>
        <div className="mt-auto">
          <NavLink to="/" icon={<Settings size={24} />} label="" active={false} />
        </div>
      </nav>
    );
  }

  return null;
};

const NavLink = ({ to, icon, label, active, isFab = false }: { to: string, icon: React.ReactNode, label: string, active: boolean, isFab?: boolean }) => (
  <Link to={to} className={`flex flex-col items-center justify-center transition-all duration-300 ${active ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>
    <div className={`${isFab ? 'bg-emerald-600 p-3 rounded-full text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] -mt-8 border-4 border-slate-950 hover:scale-110 active:scale-95 transition-transform' : ''}`}>
      {icon}
    </div>
    {label && <span className={`text-xs mt-1 font-mono ${isFab ? 'mb-1' : ''}`}>{label}</span>}
  </Link>
);

const RoleSelection = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 p-6">
    <div className="max-w-md w-full text-center space-y-8">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500 tracking-tighter">
        CIRCUIT<span className="text-white">CYCLE</span>
      </h1>
      <p className="text-slate-400 font-mono">Select Interface Mode</p>
      
      <div className="grid gap-4">
        <Link to="/user/map" className="group relative p-6 border border-slate-800 rounded-xl hover:border-emerald-500/50 bg-slate-900/50 transition-all hover:bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-slate-100">User Portal</h3>
              <p className="text-sm text-slate-400">Recycle, Scan, Earn</p>
            </div>
          </div>
        </Link>

        <Link to="/bin" className="group relative p-6 border border-slate-800 rounded-xl hover:border-purple-500/50 bg-slate-900/50 transition-all hover:bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
              <Trash2 size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-slate-100">Smart Bin Kiosk</h3>
              <p className="text-sm text-slate-400">Tablet Interface</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/dashboard" className="group relative p-6 border border-slate-800 rounded-xl hover:border-blue-500/50 bg-slate-900/50 transition-all hover:bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-slate-100">Admin Command</h3>
              <p className="text-sm text-slate-400">Fleet & Analytics</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          
          {/* User Routes */}
          <Route path="/user/*" element={<UserPortal />} />
          
          {/* Bin Kiosk Route - Standalone */}
          <Route path="/bin" element={<BinKiosk />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminPortal />} />
        </Routes>
        <NavBar />
      </div>
    </HashRouter>
  );
};

export default App;