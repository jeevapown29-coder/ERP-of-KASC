import React from 'react';
import { Trophy, CheckCircle, Clock } from 'lucide-react';

export default function Sports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sports & Extracurriculars</h1>
          <p className="text-slate-500 mt-1">Manage OD workflows and tournament schedules.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-sm font-medium hover:bg-indigo-700 transition-colors">
          Request OD
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
               <Clock className="w-5 h-5 text-indigo-600" /> My OD Requests
            </h2>
            <div className="space-y-4">
               <div className="p-4 border border-slate-200 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h4 className="font-semibold text-slate-900">State Level Baseball Tournament</h4>
                        <span className="text-xs font-medium text-slate-500">12th Oct 2026 - 15th Oct 2026</span>
                     </div>
                     <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg uppercase tracking-wider">In Progress</span>
                  </div>
                  
                  {/* OD Workflow Steps */}
                  <div className="flex items-center justify-between text-xs font-medium mt-4 pt-4 border-t border-slate-100">
                     <div className="flex flex-col items-center gap-1 text-emerald-600 block">
                        <CheckCircle className="w-5 h-5" />
                        <span>Coach</span>
                     </div>
                     <div className="h-0.5 flex-1 bg-emerald-500 mx-2"></div>
                     <div className="flex flex-col items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>HOD</span>
                     </div>
                     <div className="h-0.5 flex-1 bg-slate-200 mx-2"></div>
                     <div className="flex flex-col items-center gap-1 text-slate-400">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                        <span>Principal</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden">
            <Trophy className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white opacity-5" />
            <h2 className="text-lg font-semibold mb-6">Tournament Board</h2>
            <div className="space-y-4 relative z-10">
               {[
                  { name: 'Inter-College Basketball', date: 'Next Week', reg: 'Open' },
                  { name: 'Annual Sports Meet', date: 'Dec 2026', reg: 'Upcoming' }
               ].map((t, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer border border-white/10">
                     <div>
                        <div className="font-medium text-slate-100">{t.name}</div>
                        <div className="text-xs text-slate-300">{t.date}</div>
                     </div>
                     <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/30 text-indigo-200 rounded">
                        {t.reg}
                     </span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
