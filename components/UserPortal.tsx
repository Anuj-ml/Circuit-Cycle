import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { MapPin, Navigation, Zap, Battery, Smartphone, Award, Trophy, Wallet, Crosshair, ChevronUp, AlertCircle, Wrench, ArrowRight, User } from 'lucide-react';
import { useStore } from '../store';
import { POTENTIAL_SCANS } from '../constants';
import { ScannedItem } from '../types';

// --- SUB-COMPONENTS ---

// 1. Map View
const MapView = () => {
  const bins = useStore(state => state.bins);
  const activeBinId = useStore(state => state.activeBinId);
  const setActiveBin = useStore(state => state.setActiveBin);
  const [filter, setFilter] = useState<'All' | 'Battery' | 'Mobile'>('All');

  const filteredBins = filter === 'All' ? bins : bins.filter(b => b.type === filter || b.type === 'General');

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-950">
      {/* Filters */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Battery', 'Mobile'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold border backdrop-blur-md transition-all ${
              filter === f 
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
              : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-emerald-500/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Simulated Map */}
      <div className="w-full h-full relative grid grid-cols-6 grid-rows-6 gap-[1px] bg-slate-900/50 opacity-100" style={{backgroundImage: 'radial-gradient(circle at center, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
        {/* Decorative Map Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
           <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
             <path d="M 0 100 H 1000 M 0 300 H 1000 M 0 500 H 1000" stroke="#34d399" strokeWidth="0.5" fill="none" />
             <path d="M 100 0 V 1000 M 300 0 V 1000 M 500 0 V 1000" stroke="#34d399" strokeWidth="0.5" fill="none" />
           </svg>
        </div>

        {/* Bin Markers */}
        {filteredBins.map((bin) => (
          <div
            key={bin.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer group"
            style={{
              // Pseudo-random positioning based on ID logic for consistency without real map lib
              left: `${(Math.abs(bin.lng) % 0.1) * 800}%`,
              top: `${(bin.lat % 0.1) * 800}%` 
            }}
            onClick={() => setActiveBin(bin.id)}
          >
            <div className={`relative p-2 rounded-full border-2 ${bin.fillLevel > 80 ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-emerald-500/20 border-emerald-500 text-emerald-500'} hover:scale-125 transition-transform`}>
              {bin.type === 'Battery' ? <Battery size={20} /> : <Smartphone size={20} />}
              {/* Pulse Effect */}
              <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${bin.fillLevel > 80 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            </div>
            {/* Tooltip Label */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-xs px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {bin.address}
            </div>
          </div>
        ))}
        
        {/* User Location */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
           <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse"></div>
           <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Bin Detail Drawer */}
      {activeBinId && (
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Crowd Meter Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-[10px] font-bold border border-yellow-500/20">
              <AlertCircle size={10} /> BUSY AREA
            </div>

            <button onClick={() => setActiveBin(null)} className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-700 rounded-full"></button>

            <div className="mt-2">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                {bins.find(b => b.id === activeBinId)?.address}
                <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">0.4mi</span>
              </h3>
              <p className="text-slate-400 text-sm mt-1 mb-4">Accepts: {bins.find(b => b.id === activeBinId)?.type}</p>
              
              {/* Fill Level Meter */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                   <span className="text-slate-500 font-mono">CAPACITY</span>
                   <span className={bins.find(b => b.id === activeBinId)!.fillLevel > 80 ? 'text-red-400' : 'text-emerald-400'}>
                     {bins.find(b => b.id === activeBinId)?.fillLevel}%
                   </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${bins.find(b => b.id === activeBinId)!.fillLevel > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{width: `${bins.find(b => b.id === activeBinId)?.fillLevel}%`}}
                  ></div>
                </div>
              </div>

              <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                <Navigation size={18} /> NAVIGATE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. AR Scanner
const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScannedItem | null>(null);
  const [step, setStep] = useState<'camera' | 'analyzing' | 'result'>('camera');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (step === 'camera') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera error", err));
    }
    return () => {
      // Cleanup stream
    };
  }, [step]);

  const handleScan = () => {
    setScanning(true);
    setStep('analyzing');
    setTimeout(() => {
      setScanning(false);
      setResult(POTENTIAL_SCANS[Math.floor(Math.random() * POTENTIAL_SCANS.length)]);
      setStep('result');
    }, 2500);
  };

  const reset = () => {
    setResult(null);
    setStep('camera');
  };

  return (
    <div className="h-[calc(100vh-64px)] relative bg-black overflow-hidden flex flex-col">
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
           <div className="text-xs font-mono text-emerald-500/70 border border-emerald-500/30 p-2 rounded bg-black/50 backdrop-blur">
             SYS.READY<br/>CAM.01_ACTIVE
           </div>
           <div className="text-right text-xs font-mono text-emerald-500/70">
             GRID_REF: 45.22.91<br/>LIGHT_LVL: 82%
           </div>
        </div>
        
        {/* Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-emerald-500/30 rounded-lg">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
          {scanning && (
            <div className="absolute left-0 right-0 h-0.5 bg-emerald-400/80 shadow-[0_0_10px_#34d399] animate-scan-line"></div>
          )}
        </div>

        <div className="text-center mb-16 pointer-events-auto">
          {step === 'camera' && (
             <button onClick={handleScan} className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-500/20 active:bg-emerald-500/50 transition-all">
               <div className="w-12 h-12 bg-emerald-500 rounded-full"></div>
             </button>
          )}
        </div>
      </div>

      {/* Video Feed */}
      {step !== 'result' && (
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-80" />
      )}

      {/* Analysis Overlay */}
      {step === 'analyzing' && (
        <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center">
          <div className="text-emerald-400 font-mono text-lg animate-pulse">ANALYZING GEOMETRY...</div>
          <div className="w-64 h-2 bg-slate-800 rounded mt-4 overflow-hidden">
            <div className="h-full bg-emerald-500 animate-[width_2s_ease-in-out]"></div>
          </div>
          <div className="mt-2 text-xs font-mono text-emerald-600">MATCHING PATTERNS: 98%</div>
        </div>
      )}

      {/* Result Modal */}
      {step === 'result' && result && (
        <div className="absolute inset-0 bg-slate-900 z-30 flex flex-col p-6 animate-[fadeIn_0.5s_ease-out]">
          <div className="flex-1 flex flex-col items-center pt-12">
            <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.3)] mb-6">
               {result.category === 'Phone' ? <Smartphone size={48} className="text-purple-400" /> : <Battery size={48} className="text-purple-400" />}
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-1">{result.name}</h2>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${result.condition === 'Good' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-orange-500 text-orange-500 bg-orange-500/10'}`}>
              CONDITION: {result.condition.toUpperCase()}
            </div>

            {result.repairable && (
              <div className="mt-8 w-full bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                 <div className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                   <Wrench size={18} /> REPAIR OPPORTUNITY
                 </div>
                 <p className="text-sm text-blue-200 mb-3">This item looks fixable! Consider repairing it to save more CO2.</p>
                 <div className="space-y-2">
                   {result.repairShops?.map((shop, i) => (
                     <div key={i} className="flex justify-between items-center bg-slate-900/50 p-2 rounded text-sm">
                       <span>{shop}</span>
                       <ArrowRight size={14} className="text-blue-400" />
                     </div>
                   ))}
                 </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              <div className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700">
                <div className="text-xs text-slate-400 font-mono">EST. VALUE</div>
                <div className="text-2xl font-bold text-yellow-400">{result.estimatedValue} <span className="text-xs">EC</span></div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700">
                <div className="text-xs text-slate-400 font-mono">CO2 SAVED</div>
                <div className="text-2xl font-bold text-emerald-400">{result.carbonValue}g</div>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3 pb-8">
             {result.repairable && (
               <button className="w-full py-4 bg-slate-800 text-slate-300 font-bold rounded-lg border border-slate-700" onClick={reset}>
                 Find Repair Shop
               </button>
             )}
             <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-900/20" onClick={reset}>
               ADD TO WALLET
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. User Profile & Leaderboard
const UserProfile = () => {
  const user = useStore(state => state.user);
  const leaderboard = useStore(state => state.leaderboard);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 p-4 overflow-y-auto pb-24">
       {/* User Header */}
       <div className="flex items-center gap-4 mb-8 pt-4">
         <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-purple-600 p-[2px]">
           <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
             <User size={32} className="text-slate-300" />
           </div>
         </div>
         <div>
           <h1 className="text-2xl font-bold text-white">{user.name}</h1>
           <div className="flex items-center gap-2 text-sm text-purple-400 font-mono">
             <Trophy size={14} /> {user.rank}
           </div>
         </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur">
            <div className="flex justify-between items-start mb-2">
               <Wallet className="text-yellow-500" size={20} />
               <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 rounded">ECO</span>
            </div>
            <div className="text-2xl font-bold text-white">{user.credits}</div>
            <div className="text-xs text-slate-500">Balance</div>
         </div>
         <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur">
            <div className="flex justify-between items-start mb-2">
               <Award className="text-emerald-500" size={20} />
               <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 rounded">CO2</span>
            </div>
            <div className="text-2xl font-bold text-white">{user.carbonSaved}kg</div>
            <div className="text-xs text-slate-500">Total Saved</div>
         </div>
       </div>

       {/* Neighborhood Wars */}
       <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden mb-8">
         <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
           <h3 className="font-bold text-white flex items-center gap-2">
             <Crosshair size={18} className="text-red-500" /> NEIGHBORHOOD WARS
           </h3>
           <span className="text-xs font-mono text-red-400 animate-pulse">LIVE</span>
         </div>
         <div className="p-4 space-y-4">
           {leaderboard.map((entry, idx) => (
             <div key={idx} className="flex items-center gap-4">
               <div className={`font-mono font-bold w-6 text-center ${idx === 0 ? 'text-yellow-400' : 'text-slate-500'}`}>#{idx + 1}</div>
               <div className="flex-1">
                 <div className="flex justify-between text-sm mb-1">
                   <span className={entry.neighborhood === user.neighborhood ? 'text-emerald-400 font-bold' : 'text-slate-300'}>{entry.neighborhood}</span>
                   <span className="font-mono text-slate-400">{entry.score}kg</span>
                 </div>
                 <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                   <div className={`h-full ${idx === 0 ? 'bg-gradient-to-r from-yellow-500 to-red-500' : 'bg-slate-600'} rounded-full`} style={{width: `${(entry.score / 15000) * 100}%`}}></div>
                 </div>
               </div>
               <div className="text-xs">
                 {entry.trend === 'up' && <ChevronUp size={16} className="text-emerald-500" />}
                 {entry.trend === 'down' && <ChevronUp size={16} className="text-red-500 rotate-180" />}
                 {entry.trend === 'stable' && <div className="w-2 h-2 rounded-full bg-slate-600 ml-1"></div>}
               </div>
             </div>
           ))}
         </div>
       </div>
    </div>
  );
};

export const UserPortal = () => {
  return (
    <Routes>
      <Route path="map" element={<MapView />} />
      <Route path="scan" element={<Scanner />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path="*" element={<Navigate to="map" replace />} />
    </Routes>
  );
};