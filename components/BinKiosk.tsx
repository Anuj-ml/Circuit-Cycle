import React, { useState, useEffect } from 'react';
import { QrCode, Mic, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store';

export const BinKiosk = () => {
  const [mode, setMode] = useState<'IDLE' | 'SCAN_QR' | 'DEPOSIT' | 'SUCCESS'>('IDLE');
  const [weight, setWeight] = useState(0);
  const [message, setMessage] = useState("Touch screen or speak 'Start' to begin");
  const addBinItem = useStore(state => state.addBinItem);

  // Simulate Voice Command
  const toggleVoice = () => {
    setMessage("Listening... Say 'Start'");
    setTimeout(() => {
      handleStart();
    }, 1500);
  };

  const handleStart = () => {
    setMode('SCAN_QR');
  };

  const handleScanSuccess = () => {
    setMode('DEPOSIT');
    // Simulate gradual weighing
    let w = 0;
    const interval = setInterval(() => {
      w += 0.05;
      setWeight(parseFloat(w.toFixed(2)));
      if (w >= 0.45) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleFinish = () => {
    setMode('SUCCESS');
    addBinItem(weight, Math.floor(weight * 100)); // Logic hook
    
    // Play sound logic would go here
    
    setTimeout(() => {
      setMode('IDLE');
      setWeight(0);
    }, 5000);
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative font-sans select-none cursor-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black"></div>
      
      {/* Kiosk Frame */}
      <div className="absolute inset-4 border-2 border-emerald-500/30 rounded-3xl pointer-events-none z-50"></div>
      <div className="absolute bottom-8 left-8 text-xs font-mono text-emerald-500/50 z-50">UNIT_ID: BK_402</div>

      {/* --- IDLE MODE --- */}
      {mode === 'IDLE' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse-slow" onClick={handleStart}>
          <div className="w-64 h-64 border-4 border-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-pulse">
             <div className="text-center">
               <div className="text-6xl font-black text-white tracking-tighter">RECYCLE</div>
               <div className="text-xl text-emerald-400 tracking-widest mt-2">HERE</div>
             </div>
          </div>
          <p className="mt-12 text-slate-400 text-lg uppercase tracking-widest animate-bounce">Tap to Start</p>
          
          <button onClick={(e) => { e.stopPropagation(); toggleVoice(); }} className="absolute bottom-16 right-16 p-6 bg-slate-800 rounded-full text-white border border-slate-700 hover:bg-slate-700 transition-colors pointer-events-auto">
            <Mic size={32} />
          </button>
        </div>
      )}

      {/* --- SCAN QR MODE --- */}
      {mode === 'SCAN_QR' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur" onClick={handleScanSuccess}>
          <h2 className="text-3xl text-white font-bold mb-8">Scan App QR Code</h2>
          <div className="p-4 bg-white rounded-xl">
            <QrCode size={200} className="text-black" />
          </div>
          <p className="mt-8 text-slate-500 text-sm">(Tap anywhere to simulate scan)</p>
        </div>
      )}

      {/* --- DEPOSIT MODE --- */}
      {mode === 'DEPOSIT' && (
        <div className="absolute inset-0 flex flex-col items-center p-12">
          <h2 className="text-4xl text-emerald-400 font-bold mb-12">HATCH OPEN</h2>
          
          <div className="flex-1 w-full max-w-2xl flex items-center justify-center relative">
            {/* Weight Gauge */}
            <div className="relative w-80 h-80 rounded-full border-8 border-slate-800 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-t-8 border-emerald-500 rotate-45 transition-transform duration-1000" style={{transform: `rotate(${weight * 360}deg)`}}></div>
               <div className="text-center">
                 <div className="text-8xl font-black text-white tabular-nums">{weight.toFixed(2)}</div>
                 <div className="text-xl text-slate-500 font-mono mt-2">KG DETECTED</div>
               </div>
            </div>
          </div>

          <button onClick={handleFinish} className="w-full max-w-md py-6 bg-emerald-600 text-white text-2xl font-bold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95 transition-transform">
            COMPLETE DEPOSIT
          </button>
        </div>
      )}

      {/* --- SUCCESS MODE --- */}
      {mode === 'SUCCESS' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-900/20">
          <div className="scale-150 mb-8 animate-[bounce_1s_infinite]">
            <Sparkles size={64} className="text-yellow-400" />
          </div>
          <h1 className="text-6xl font-black text-white mb-4 shadow-black drop-shadow-lg">LEVEL UP!</h1>
          <div className="text-3xl text-emerald-400 font-mono">+125 ECO COINS</div>
          <div className="text-xl text-slate-300 font-mono mt-2">0.45kg CO2 Saved</div>
          
          {/* Confetti simulation with CSS dots */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping delay-100"></div>
          <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-yellow-500 rounded-full animate-ping delay-200"></div>
        </div>
      )}
    </div>
  );
};
