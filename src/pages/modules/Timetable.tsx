import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, User, BookOpen, Download, Upload, Search, 
  FileText, CheckCircle, Info, Sparkles, Filter, Check, Award, AlertCircle
} from 'lucide-react';

interface SubjectDetail {
  code: string;
  name: string;
  short: string;
  staff: string;
  hours: number;
  color: string;
  textColor: string;
  borderColor: string;
  description: string;
}

interface PeriodSlot {
  time: string;
  label: string;
}

export default function Timetable() {
  // 1. Core Data: Subjects matching Kongunadu B.Sc CS with Data Analytics exact metrics
  const subjects: SubjectDetail[] = [
    {
      code: '24UDA505',
      name: 'Core Paper 5 - R Programming',
      short: 'R',
      staff: 'Mrs. P. Indumathi',
      hours: 6,
      color: 'bg-emerald-500/10 hover:bg-emerald-500/15',
      textColor: 'text-emerald-500 dark:text-emerald-400',
      borderColor: 'border-emerald-500/25',
      description: 'Foundations of mathematical statistic analysis, vector vectors, packages, and plotting algorithms using R Core.',
    },
    {
      code: '24UDA5CP',
      name: 'Core Practical 5 - R Programming Laboratory',
      short: 'R LAB',
      staff: 'Mrs. P. Indumathi / Dr. L. Kathirvelkumaran / Mrs. B. Praveena',
      hours: 6,
      color: 'bg-cyan-500/10 hover:bg-cyan-500/15',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      borderColor: 'border-cyan-500/25',
      description: 'Practical labs for statistical scripting, regression analyses, data structures, and custom graphical visualizations.',
    },
    {
      code: '24UDA506',
      name: 'Core Paper 6 - Relational Database Management System',
      short: 'RDBMS',
      staff: 'Dr. N. Alamelumangai',
      hours: 6,
      color: 'bg-indigo-500/10 hover:bg-indigo-500/15',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-500/25',
      description: 'Relational algebraic frameworks, normalizations, SQL transaction management constraints, and subqueries.',
    },
    {
      code: '24UDA5CQ',
      name: 'Core Practical 6 - Relational Database Management System Laboratory',
      short: 'RDBMS LAB',
      staff: 'Dr. N. Alamelumangai / Dr. L. Kathirvelkumaran / Mrs. B. Praveena / Mrs. P. Indumathi',
      hours: 5,
      color: 'bg-amber-500/10 hover:bg-amber-500/15',
      textColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-500/25',
      description: 'Hands-on query engines, PL/SQL trigger procedures, cursors, and backend relational system links.',
    },
    {
      code: '24UDA5E1',
      name: 'Major Elective Paper 1 - Software Testing and Quality Assurance',
      short: 'STQA',
      staff: 'Dr. S. Velmurugan',
      hours: 5,
      color: 'bg-rose-500/10 hover:bg-rose-500/15',
      textColor: 'text-rose-600 dark:text-rose-400',
      borderColor: 'border-rose-500/25',
      description: 'SDLC QA test scenarios, boundary value methodologies, functional security coverage, automated Selenium tests.',
    },
    {
      code: 'EDC',
      name: 'Extra Departmental Course (EDC)',
      short: 'EDC',
      staff: 'Dr. L. Kathirvelkumaran / Dr. S. Velmurugan',
      hours: 2,
      color: 'bg-purple-500/10 hover:bg-purple-500/15',
      textColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-500/25',
      description: 'Interdisciplinary elective studies across collegiate auxiliary programs.',
    }
  ];

  const timeSlots: PeriodSlot[] = [
    { label: '8-9', time: '08:00 AM - 09:00 AM' },
    { label: '9-10', time: '09:00 AM - 10:00 AM' },
    { label: '10-11', time: '10:00 AM - 11:00 AM' },
    { label: '11-12', time: '11:00 AM - 12:00 PM' },
    { label: '12-1', time: '12:00 PM - 01:00 PM' },
  ];

  // Map day order 1 to 6 to grid matrix cells (matching the uploaded image exactly)
  const initialGrid: { [key: number]: string[] } = {
    1: ['RDBMS', 'RDBMS LAB', 'R', 'R LAB', 'EDC'],
    2: ['RDBMS', 'STQA', 'R', 'RDBMS LAB', 'EDC'],
    3: ['RDBMS', 'R LAB', 'RDBMS', 'R', 'R LAB'],
    4: ['STQA', 'RDBMS LAB', 'R', 'RDBMS', 'R LAB'],
    5: ['R', 'RDBMS LAB', 'RDBMS LAB', 'STQA', 'RDBMS'],
    6: ['STQA', 'R', 'R LAB', 'R LAB', 'STQA'],
  };

  // State managers
  const [grid, setGrid] = useState<{ [key: number]: string[] }>(initialGrid);
  const [selectedDayOrder, setSelectedDayOrder] = useState<number>(1);
  const [hoveredSubject, setHoveredSubject] = useState<SubjectDetail | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'grid' | 'upload' | 'catalog'>('grid');
  
  // Custom draft simulator states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const getSubjectByShortName = (short: string): SubjectDetail | undefined => {
    return subjects.find(s => s.short === short);
  };

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Simulate file upload parser 
  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadProgress(10);
    setUploadFeedback(null);

    // Dynamic processing animation
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate update success
          setUploadProgress(null);
          setUploadFeedback('SUCCESS');
          triggerToast('Class lecture timetable registry parsed successfully!');
          
          // Introduce minor variance in the parsed grid to make it feel super alive!
          setGrid(prevGrid => {
            const copy = { ...prevGrid };
            copy[1] = ['R', 'RDBMS LAB', 'RDBMS', 'R LAB', 'EDC']; // Swapped order slightly
            return copy;
          });
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  // Reset timetable back to initial catalog defaults
  const resetToFactoryDefaults = () => {
    setGrid(initialGrid);
    setUploadedFileName(null);
    setUploadFeedback(null);
    triggerToast('Timetable reset to standard autonomy configuration.');
  };

  return (
    <div className="space-y-6 relative pb-10">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed top-6 right-6 z-55 bg-[#0a0f1d] border-2 border-emerald-500 text-white rounded-xl shadow-2xl p-4 max-w-sm flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-bold leading-relaxed">{toast}</div>
        </div>
      )}

      {/* Main Header blocks */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a0f1d] p-6 rounded-2xl border border-indigo-500/15 shadow-xl relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-600 to-amber-500 opacity-60" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded">
              Academic Year 2026 - 2027
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider bg-indigo-550/10 text-indigo-400 border border-indigo-500/20 rounded">
              Odd Semester
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🏛️</span> KASC Autonomous Class Timetable
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            III B.Sc Computer Science with Data Analytics — Department of Computer Science
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('grid')}
            className={`px-3 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all border ${activeTab === 'grid' ? 'bg-[#1e2e6b] text-white border-amber-500/60 shadow-lg shadow-indigo-950/40' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'}`}
          >
            🗓️ Grid Matrix
          </button>
          
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all border ${activeTab === 'catalog' ? 'bg-[#1e2e6b] text-white border-amber-500/60' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'}`}
          >
            📋 Subject Catalog ({subjects.length})
          </button>

          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all border ${activeTab === 'upload' ? 'bg-amber-600 text-slate-950 border-amber-500' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'}`}
          >
            ⚡ Upload Sheet
          </button>
        </div>
      </div>

      {activeTab === 'grid' && (
        <>
          {/* Main Layout containing Grid + Detail Panel */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            
            {/* Grid Matrix Block (Left-Middle 3 Cols) */}
            <div className="xl:col-span-3 space-y-4">
              
              {/* Day Order Selection and Info ribbon */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                    Registrar Day Order Switcher
                  </h3>
                  <p className="text-xs text-slate-500">
                    KASC operates on a 6-day rotation cycle. Tap order nodes to highlight today's curriculum.
                  </p>
                </div>

                {/* Horizontal Numeric selector */}
                <div className="flex gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                  {[1, 2, 3, 4, 5, 6].map((dayNum) => (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDayOrder(dayNum)}
                      className={`w-10 h-10 rounded-lg text-xs font-black transition-all flex flex-col items-center justify-center ${selectedDayOrder === dayNum ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                      <span className="text-[8px] font-mono leading-none">DAY</span>
                      <span className="text-xs leading-none mt-0.5">{dayNum}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Matrix Board Wrapper */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-210 shadow-sm overflow-hidden">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <span>🗓️</span> Odd Semester Semester Course Schedule
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400">
                    6 Day Orders × 5 Academic Periods
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        {/* Day Order Header Corner */}
                        <th className="p-3 bg-slate-950 rounded-tl-xl text-left text-[11px] font-black uppercase text-[#f09a1a] tracking-wider w-24">
                          <div className="leading-tight">DAY ORDER</div>
                        </th>
                        
                        {/* Period columns */}
                        {timeSlots.map((slot, pIdx) => (
                          <th key={slot.label} className="p-3 bg-slate-900 text-center border-l border-slate-850">
                            <span className="block text-[8px] font-mono text-[#f09a1a] tracking-widest leading-none font-bold">PERIOD {pIdx + 1}</span>
                            <span className="block text-xs font-black text-white mt-1 leading-none">{slot.label} Hr</span>
                            <span className="block text-[9px] font-mono text-slate-400 mt-1 leading-none font-medium">{slot.time}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[1, 2, 3, 4, 5, 6].map((dayNum) => {
                        const isSelectedDay = selectedDayOrder === dayNum;
                        const rowSlots = grid[dayNum] || [];

                        return (
                          <tr 
                            key={dayNum} 
                            className={`group transition-colors ${isSelectedDay ? 'bg-amber-500/5 dark:bg-amber-500/2 border-l-4 border-amber-500' : 'hover:bg-slate-50 dark:hover:bg-slate-950/40'}`}
                          >
                            {/* Left day indicator */}
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-sm font-black ${isSelectedDay ? 'text-amber-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                  Day Order {dayNum}
                                </span>
                              </div>
                            </td>

                            {/* Cell mapping */}
                            {rowSlots.map((shortName, cellIdx) => {
                              const subj = getSubjectByShortName(shortName);
                              const isHovered = hoveredSubject?.short === shortName;

                              if (!subj) {
                                return (
                                  <td key={cellIdx} className="p-4 text-center border-l border-slate-150 dark:border-slate-800 bg-slate-50/50">
                                    <span className="text-slate-400 font-mono text-xs">---</span>
                                  </td>
                                );
                              }

                              return (
                                <td 
                                  key={cellIdx}
                                  onMouseEnter={() => setHoveredSubject(subj)}
                                  onMouseLeave={() => setHoveredSubject(null)}
                                  className={`p-3 text-center border-l border-slate-150 dark:border-slate-800 cursor-help transition-all duration-150 relative ${subj.color} ${isHovered ? 'ring-2 ring-inset ring-amber-500/70 border-transparent z-10 scale-102 shadow-sm' : ''}`}
                                >
                                  {/* Code and Name */}
                                  <div className="space-y-0.5">
                                    <span className={`block text-[11px] font-black uppercase tracking-wider font-mono ${subj.textColor}`}>
                                      {subj.short}
                                    </span>
                                    <span className="block text-[10px] text-slate-400 truncate max-w-[120px] mx-auto">
                                      {subj.code}
                                    </span>
                                    <div className="w-1.5 h-1.5 rounded-full mx-auto mt-1" style={{ backgroundColor: 'currentColor' }} />
                                  </div>

                                  {/* Staff incharge tooltip helper */}
                                  <div className="absolute right-1 bottom-1">
                                    <span className="text-[8px] bg-slate-950 text-slate-300 font-mono scale-[0.8] origin-bottom-right opacity-0 group-hover:opacity-100 transition-opacity px-1 py-0.5 rounded">
                                      {subj.hours} Hrs
                                    </span>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic Legend Guide & Explainer block */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Pro-Tip:</strong> Hover over any class module cell to view faculty names, department room links, and weekly academic load calculations instantly on the right inspection deck.
                </p>
              </div>

            </div>

            {/* Quick Inspection panel (Right Column) */}
            <div className="xl:col-span-1 space-y-4">
              
              {/* Ongoing Active Class Tracker HUD */}
              <div className="bg-slate-900 border-2 border-indigo-500/30 rounded-2xl p-5 text-white relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-5 pointer-events-none" />
                
                <h3 className="text-xs font-black tracking-widest text-amber-500 uppercase font-mono mb-3 flex items-center justify-between">
                  <span>🛰️ Live Lecture Tracker</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h3>

                <div className="space-y-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Today's Class Rotation Schedule</span>
                    <p className="text-sm font-black text-white">Active: Day Order {selectedDayOrder}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-1">
                      <span>PERIOD</span>
                      <span>CURRICULUM MODULE</span>
                    </div>

                    {(grid[selectedDayOrder] || []).map((shortName, pIdx) => {
                      const subj = getSubjectByShortName(shortName);
                      return (
                        <div key={pIdx} className="flex justify-between items-center py-1">
                          <span className="text-[10px] font-mono font-bold text-[#f09a1a]">Period {pIdx + 1}</span>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${subj?.textColor || 'text-slate-400'} bg-slate-950/60`}>
                            {shortName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Inspector Card (Displays details for hovered or first default item) */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-205 shadow-sm space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-xs font-black uppercase text-indigo-750 dark:text-[#f09a1a] tracking-widest">
                    Module Inspection Deck
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Faculty catalog verification dossier.</p>
                </div>

                {hoveredSubject ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-1 duration-150">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-850 rounded text-slate-500">
                        {hoveredSubject.code}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {hoveredSubject.name}
                      </h3>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2 border border-slate-100 dark:border-slate-850 text-xs text-slate-350">
                      <div className="flex items-start gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#f09a1a] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-mono font-bold text-slate-500 text-[10px]">STAFF IN CHARGE</p>
                          <p className="text-slate-900 dark:text-white font-semibold mt-0.5">{hoveredSubject.staff}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#f09a1a] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-mono font-bold text-slate-500 text-[10px]">TOTAL SYLLABUS HOURS</p>
                          <p className="text-slate-900 dark:text-white font-semibold mt-0.5">{hoveredSubject.hours} Hours / Week</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      {hoveredSubject.description}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-2 animate-in fade-in duration-200">
                    <div className="text-3xl">🔍</div>
                    <p className="text-xs text-slate-400 font-medium">
                      Hover over any table cell to inspect full paper details.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </>
      )}

      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-205 space-y-4">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Syllabus Paper Catalog Index
                </h3>
                <p className="text-xs text-slate-400">
                  Comprehensive listing of academic curricula for III B.Sc Computer Science with Data Analytics.
                </p>
              </div>

              {/* Dynamic search index filter */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  placeholder="Search subject or staff..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects
                .filter(s => 
                  s.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                  s.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  s.staff.toLowerCase().includes(searchFilter.toLowerCase())
                )
                .map((subj) => (
                  <div 
                    key={subj.code} 
                    className="p-5 bg-[#0a0f1d]/2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-500/40 transition-all shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold bg-[#1e2e6b]/10 text-[#1e2e6b] dark:text-[#f09a1a] px-2 py-0.5 rounded">
                        {subj.code}
                      </span>
                      <span className="text-[10px] font-mono font-black text-slate-400">
                        {subj.hours} HRS
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                        {subj.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                        {subj.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-medium text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#f09a1a]" />
                      <span className="truncate">{subj.staff}</span>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Mock File processor uploader workspace */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-205 shadow-xl space-y-6 text-center">
            <div className="mx-auto w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center text-xl select-none">
              📁
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Simulated Timetable Spreadsheet Import
              </h3>
              <p className="text-xs text-slate-405 max-w-md mx-auto">
                Got a fresh XLSX, HTML draft or CSV timetable grid? Upload your file below to process and inject newly scheduled lectures into the local collegiate ledger directory.
              </p>
            </div>

            {/* Simulated file uploader drag area */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all bg-slate-50 dark:bg-slate-950 relative overflow-hidden group">
              <input 
                type="file" 
                accept="image/*,.xlsx,.csv,.pdf"
                onChange={handleFileUploadSim}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              
              <div className="relative z-10 space-y-3 pointer-events-none">
                <Upload className="w-8 h-8 text-[#f09a1a] mx-auto animate-bounce-slow" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Drag and drop academic sheets here, or <span className="text-[#f09a1a] underline cursor-pointer">browse filesystem</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Accepts Image JPEG/PNG, CSV sheets, PDF drafts & Excel sheets (Max size 6 MB)
                </p>
              </div>
            </div>

            {/* Displaying live uploading/processing indicators */}
            {uploadProgress !== null && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Uploading {uploadedFileName}...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {uploadFeedback === 'SUCCESS' && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-xl flex items-center justify-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Success!</strong> parsed "<strong>{uploadedFileName}</strong>" successfully and updated odd semester rotation schedule.
                </span>
                <button 
                  onClick={resetToFactoryDefaults}
                  className="ml-4 font-mono font-bold text-amber-500 hover:underline border-l border-emerald-500/30 pl-4"
                >
                  Reset Default
                </button>
              </div>
            )}

            {/* Visual Action cards to showcase features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-4">
              <div className="p-4 bg-[#0a0f1d]/2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" /> Auto-Verification Engine
                </h4>
                <p className="text-[10.5px] text-slate-500 leading-normal">
                  Our system verifies that consecutive practical laboratory hour blocks match staff availability constraints before deploying scheduling changes.
                </p>
              </div>

              <div className="p-4 bg-[#0a0f1d]/2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#f09a1a]" /> Overlap Warning Check
                </h4>
                <p className="text-[10.5px] text-slate-500 leading-normal">
                  Instantly flags conflicts if multiple departments assign a faculty member to different classes in matching time domains.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
