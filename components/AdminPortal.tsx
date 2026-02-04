import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Battery, CheckCircle, MapPin } from 'lucide-react';
import { useStore } from '../store';

const DATA = [
  { name: 'Day 1', waste: 400, recovery: 240 },
  { name: 'Day 5', waste: 300, recovery: 139 },
  { name: 'Day 10', waste: 200, recovery: 980 },
  { name: 'Day 15', waste: 278, recovery: 390 },
  { name: 'Day 20', waste: 189, recovery: 480 },
  { name: 'Day 25', waste: 239, recovery: 380 },
  { name: 'Day 30', waste: 349, recovery: 430 },
];

const Dashboard = () => {
  const bins = useStore(state => state.bins);
  const collectBin = useStore(state => state.collectBin);

  // Predictive Routing Logic: Sort by fill level
  const priorityRoute = [...bins]
    .filter(b => b.fillLevel > 50)
    .sort((a, b) => b.fillLevel - a.fillLevel);

  return (
    <div className="pl-24 pr-8 py-8 min-h-screen bg-slate-950 text-slate-100">
      <header className="flex justify-between items-end mb-12 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Command Center</h1>
          <p className="text-slate-500 font-mono text-sm mt-1">SYSTEM_STATUS: NOMINAL</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
             <div className="text-2xl font-bold text-emerald-400">1,240 kg</div>
             <div className="text-xs text-slate-500 uppercase">Total Collected</div>
          </div>
          <div className="text-right">
             <div className="text-2xl font-bold text-purple-400">98%</div>
             <div className="text-xs text-slate-500 uppercase">Fleet Efficiency</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Chart */}
        <div className="col-span-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Collection Analytics
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="monotone" dataKey="waste" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="recovery" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="col-span-4 space-y-4">
           {/* Predictive Route Card */}
           <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-full">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-400">
               <AlertTriangle size={18} /> Optimized Route
             </h3>
             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
               {priorityRoute.length === 0 && <p className="text-slate-500 text-sm">No critical bins.</p>}
               {priorityRoute.map((bin, i) => (
                 <div key={bin.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="font-mono text-slate-500 text-xs">0{i + 1}</div>
                     <div>
                       <div className="text-sm font-bold text-white">{bin.address}</div>
                       <div className="text-xs text-slate-400">{bin.type} • {bin.fillLevel}% Full</div>
                     </div>
                   </div>
                   <button 
                    onClick={() => collectBin(bin.id)}
                    className="p-2 hover:bg-emerald-500/20 text-emerald-500 rounded-full transition-colors" title="Dispatch Truck">
                     <CheckCircle size={18} />
                   </button>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Fleet Grid */}
        <div className="col-span-12 mt-4">
          <h3 className="text-lg font-bold mb-4">Bin Network Status</h3>
          <div className="grid grid-cols-5 gap-4">
            {bins.map(bin => (
              <div key={bin.id} className="bg-slate-900/30 border border-slate-800 p-4 rounded-xl relative group hover:bg-slate-900 transition-all">
                <div className="flex justify-between items-start mb-2">
                   {bin.type === 'Battery' ? <Battery className="text-purple-500" size={20} /> : <MapPin className="text-emerald-500" size={20} />}
                   <div className={`w-2 h-2 rounded-full ${bin.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                </div>
                <div className="font-mono text-xs text-slate-500 mb-1">{bin.id.toUpperCase()}</div>
                <div className="text-sm font-bold text-slate-200 truncate">{bin.address}</div>
                
                <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${bin.fillLevel > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${bin.fillLevel}%`}}></div>
                </div>
                <div className="mt-1 text-right text-xs font-mono text-slate-400">{bin.fillLevel}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminPortal = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};
