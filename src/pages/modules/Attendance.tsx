import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { 
  CheckCircle, Radio, Play, StopCircle, Check, 
  TrendingUp, Calendar, CalendarDays, BookOpen, Clock, AlertTriangle, UserCheck,
  Download, Loader2, Fingerprint, Cpu, Wifi, Zap, Shield, Video
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ReferenceLine, Legend 
} from 'recharts';
import { jsPDF } from 'jspdf';

const ATTENDANCE_TREND_DATA = [
  { month: 'Dec 2025', percentage: 91.5, required: 75 },
  { month: 'Jan 2026', percentage: 93.8, required: 75 },
  { month: 'Feb 2026', percentage: 89.2, required: 75 },
  { month: 'Mar 2026', percentage: 94.1, required: 75 },
  { month: 'Apr 2026', percentage: 83.5, required: 75 },
  { month: 'May 2026', percentage: 92.4, required: 75 },
];

export default function Attendance() {
  const { user } = useAuth();
  
  const isFaculty = user?.role === Role.FACULTY || user?.role === Role.ADMIN || user?.role === Role.HOD;
  
  // Faculty State
  const [activeSessionCode, setActiveSessionCode] = useState<string | null>(null);
  
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // High-Fidelity Biometric Simulation States
  const [bioStatus, setBioStatus] = useState<'IDLE' | 'CONNECTED' | 'SCANNING' | 'ANALYZING' | 'AUTHENTICATED' | 'DENIED'>('CONNECTED');
  const [bioMethod, setBioMethod] = useState<'FINGER' | 'FACE'>('FINGER');
  const [bioLog, setBioLog] = useState<Array<{ id: string; name: string; role: string; time: string; method: string; outcome: string }>>([
    { id: 'b-99', name: 'Dr. Sarah (CS HOD)', role: 'FACULTY', time: '09:12:15 AM', method: 'Face Recognition', outcome: 'SUCCESS' },
    { id: 'b-98', name: 'Arun Kumar', role: 'STUDENT', time: '09:27:44 AM', method: 'Fingerprint Scan', outcome: 'SUCCESS' },
    { id: 'b-97', name: 'Rajesh Khanna', role: 'STUDENT', time: '10:05:01 AM', method: 'Fingerprint Scan', outcome: 'SUCCESS' }
  ]);
  const [activeBioUser, setActiveBioUser] = useState<{ name: string; role: string; reg: string; group: string; accuracy: number } | null>(null);

  const triggerBiometricSimulationScan = () => {
    if (bioStatus !== 'CONNECTED' && bioStatus !== 'IDLE') return;
    
    setBioStatus('SCANNING');
    setActiveBioUser(null);

    // Audio tone mock
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      osc.start();
      setTimeout(() => osc.stop(), 80);
    } catch (e) {
      // AudioContext unavailable in sandboxed frames
    }

    // Step 1: Scan animation delays
    setTimeout(() => {
      setBioStatus('ANALYZING');
      
      // Step 2: Database matching lookup simulation
      setTimeout(() => {
        const potentialProfiles = [
          { name: 'Dr. Sarah', role: 'FACULTY', reg: 'FAC-CYBER-88', group: 'CS Department HOD', accuracy: 99.4 },
          { name: 'John Doe', role: 'STUDENT', reg: 'REG-1004', group: 'Sec VI - CS Aided', accuracy: 98.7 },
          { name: 'Arun Kumar', role: 'STUDENT', reg: 'REG-1001', group: 'Sec VI - CS Aided', accuracy: 97.2 },
          { name: 'Dr. Principal', role: 'ADMIN', reg: 'ADM-CYBER-01', group: 'Executive Chancellor Office', accuracy: 99.9 }
        ];
        
        const chosen = potentialProfiles[Math.floor(Math.random() * potentialProfiles.length)];
        setActiveBioUser(chosen);
        setBioStatus('AUTHENTICATED');

        // Success terminal sound
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscNode = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscNode.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscNode.frequency.setValueAtTime(1200, audioCtx.currentTime);
          gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
          oscNode.start();
          setTimeout(() => oscNode.stop(), 150);
        } catch(e) {}

        // Add to historical logging registry
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        setBioLog(prev => [
          {
            id: `b-${Date.now()}`,
            name: chosen.name,
            role: chosen.role,
            time: timeStr,
            method: bioMethod === 'FINGER' ? 'Fingerprint Scanner' : 'Face recognition V4',
            outcome: 'SUCCESS'
          },
          ...prev
        ]);

        // Return device back to listening/connected state
        setTimeout(() => {
          setBioStatus('CONNECTED');
        }, 3200);

      }, 1400);
    }, 1500);
  };

  const handleExportPDF = (type: 'class-wide' | 'individual') => {
    setIsExporting(type);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        // 1. Institutional Corporate Header
        doc.setFillColor(30, 46, 107); // KASC Deep Cadet Cobalt (#1e2e6b)
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setFillColor(240, 154, 26); // KASC Accent Amber (#f09a1a)
        doc.rect(0, 40, 210, 4, 'F');
        
        // Header Text
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("KONGUNADU ARTS AND SCIENCE COLLEGE (AUTONOMOUS)", 15, 20);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Coimbatore, Tamil Nadu 641029 | Affiliated to Bharathiar University", 15, 27);
        doc.text("Approved System of Record - Academic Audit & Registrar Division", 15, 33);
        
        // 2. Audit Document Metadata
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        
        if (type === 'class-wide') {
          doc.text("OFFICIAL REPORT: CLASS-WIDE MONTHLY ATTENDANCE TRENDS", 15, 55);
        } else {
          doc.text("OFFICIAL REPORT: INDIVIDUAL COHORT ATTENDANCE DIRECTORY", 15, 55);
        }
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text(`Report Compiled: ${new Date().toLocaleString()}`, 15, 62);
        doc.text("Cryptographic Hash: KASC_ATTEND_SHA256_F98A77123BC", 15, 67);
        doc.text("Classification: HIGHER EDUCATION INTERNAL REGISTER AUDIT ONLY", 15, 72);
        
        // Draw elegant divider
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.line(15, 76, 195, 76);
        
        // 3. Tabular Core Content
        doc.setTextColor(15, 23, 42);
        
        if (type === 'class-wide') {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Month-on-Month Aggregate Attendance (Semester Cycle VI - CS Department)", 15, 86);
          
          const trendHeader = ["Month Period", "Class Attendance Average", "Required Mandate", "Safety Deviation Status"];
          const trendRows = [
            ["Dec 2025", "91.5%", "75.0%", "COMPLIANT (+16.5%)"],
            ["Jan 2026", "93.8%", "75.0%", "COMPLIANT (+18.8%)"],
            ["Feb 2026", "89.2%", "75.0%", "COMPLIANT (+14.2%)"],
            ["Mar 2026", "94.1%", "75.0%", "COMPLIANT (+19.1%)"],
            ["Apr 2026", "83.5%", "75.0%", "COMPLIANT (+8.5%)"],
            ["May 2026", "92.4%", "75.0%", "COMPLIANT (+17.4%)"],
          ];
          
          let y = 96;
          // Render Table Header
          doc.setFont("helvetica", "bold");
          doc.setFillColor(241, 245, 249); // slate-100
          doc.rect(15, y - 5, 180, 8, 'F');
          doc.text(trendHeader[0], 17, y);
          doc.text(trendHeader[1], 55, y);
          doc.text(trendHeader[2], 102, y);
          doc.text(trendHeader[3], 145, y);
          y += 9;
          
          // Render Table Rows
          doc.setFont("helvetica", "normal");
          trendRows.forEach(row => {
            doc.text(row[0], 17, y);
            doc.text(row[1], 55, y);
            doc.text(row[2], 102, y);
            doc.text(row[3], 145, y);
            y += 8;
          });
          
          doc.setFont("helvetica", "bold");
          doc.text("Class-wide Attendance Insights:", 15, y + 6);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.text("1. Overall aggregate class-wide attendance stands at 90.75%, safely above university limits.", 15, y + 13);
          doc.text("2. April 2026 marked the lowest session percentage (83.5%) due to external academic symposium assignments.", 15, y + 19);
          doc.text("3. General counseling sessions scheduled for students displaying inconsistent high deviation curves.", 15, y + 25);
        } else {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Student Cohort Specific Monthly Attendance Breakdown", 15, 86);
          
          const studentHeader = ["Reg ID", "Student Name", "Course Block", "Attendance Rank", "Examination Status"];
          const studentRows = [
            ["1001", "Arun Kumar", "B.Sc. Comp Science", "92.4%", "ACTIVE - HALL TICKET UNLOCKED"],
            ["1002", "Divya Bharathi", "B.Sc. Comp Science", "77.5%", "ACTIVE - WARNING THRESHOLD CRITICAL"],
            ["1003", "Rajesh Khanna", "B.Sc. Comp Science", "83.5%", "ACTIVE - HALL TICKET UNLOCKED"],
            ["1004", "John Doe", "B.Sc. Comp Science", "88.0%", "ACTIVE - HALL TICKET UNLOCKED"],
            ["1005", "Arjun Prasad", "B.Sc. Comp Science", "68.2%", "HOLD - REPORT FOR CONDONATION REMEDY"],
          ];
          
          let y = 96;
          // Render Table Header
          doc.setFont("helvetica", "bold");
          doc.setFillColor(241, 245, 249); // slate-100
          doc.rect(15, y - 5, 180, 8, 'F');
          doc.text(studentHeader[0], 17, y);
          doc.text(studentHeader[1], 35, y);
          doc.text(studentHeader[2], 75, y);
          doc.text(studentHeader[3], 118, y);
          doc.text(studentHeader[4], 148, y);
          y += 9;
          
          // Render Table Rows
          doc.setFont("helvetica", "normal");
          studentRows.forEach(row => {
            doc.text(row[0], 17, y);
            doc.text(row[1], 35, y);
            doc.text(row[2], 75, y);
            doc.text(row[3], 118, y);
            if (row[4].startsWith("HOLD")) {
              doc.setFont("helvetica", "bold");
            }
            doc.text(row[4], 148, y);
            doc.setFont("helvetica", "normal");
            y += 8;
          });
          
          doc.setFont("helvetica", "bold");
          doc.text("Mandatory Administrative Policy Summary:", 15, y + 6);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.text("• Core Regulation: Minimum 75% attendance overall is required across all major subjects.", 15, y + 13);
          doc.text("• Deficiency Remedial: Scores between 65-74% must file an official Condonation Form with Medical certificate verification.", 15, y + 19);
          doc.text("• Below 65%: Mandatory repeat semester unless special permission granted by College Academic Dean Office.", 15, y + 25);
        }
        
        // 4. Institutional Signature Block & Footer
        doc.setDrawColor(226, 232, 240);
        doc.line(15, 245, 195, 245);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 46, 107);
        doc.text("Dr. Sarah", 15, 256);
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "normal");
        doc.text("Head of Department (HOD) - CS Div.", 15, 261);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 46, 107);
        doc.text("Dr. Principal", 155, 256);
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "normal");
        doc.text("Authorized Executive Seal Valid", 155, 261);
        
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text("This document is compiled using certified KASC ERP rosters and is cryptographically validated.", 15, 276);
        doc.text("Page 1 of 1 | Audit ID: ERP-ATTEND-SECURE-L3 | Kongunadu Arts and Science College (Autonomous).", 15, 281);
        
        // Trigger download
        const filename = type === 'class-wide' ? 'KASC_Class_Attendance_Trends.pdf' : 'KASC_Individual_Attendance_Roster.pdf';
        doc.save(filename);
      } catch (err) {
        console.error("Failed to generate Attendance PDF:", err);
        alert("An error occurred during compiling. Verify system resources.");
      } finally {
        setIsExporting(null);
      }
    }, 1000);
  };

  useEffect(() => {
    const savedCode = localStorage.getItem('active_attendance_session');
    if (savedCode) {
      setActiveSessionCode(savedCode);
    }
  }, []);

  const handleStartSession = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setActiveSessionCode(newCode);
    localStorage.setItem('active_attendance_session', newCode);
  };

  const handleStopSession = () => {
    setActiveSessionCode(null);
    localStorage.removeItem('active_attendance_session');
  };

  const handleMarkStudentAttendance = () => {
    const savedCode = localStorage.getItem('active_attendance_session');
    if (savedCode && studentCodeInput === savedCode) {
      setAttendanceMarked(true);
      setOtpError('');
      setStudentCodeInput('');
      setTimeout(() => setAttendanceMarked(false), 5000); // Reset after 5s
    } else {
      setOtpError("The OTP pin entered is invalid or expired. Check with your lecturer.");
      setTimeout(() => setOtpError(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-[#1e2e6b] dark:text-[#f09a1a]" />
            Attendance Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {isFaculty ? "Manage, track, and audit physical & digital classroom attendance registries." : "View your attendance status, subject metrics, and mark active live sessions."}
          </p>
        </div>
      </div>

      {/* 2. Interactive Session Banner */}
      {isFaculty && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-blue-100 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <Radio className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Live OTP Attendance Session</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 max-w-xl leading-relaxed">
            Generate a timed, secure 4-digit code. Students currently logged into their self-service portal can mark themselves as present instantly.
          </p>
          
          {!activeSessionCode ? (
            <button 
              onClick={handleStartSession}
              className="px-5 py-2.5 bg-indigo-600 dark:bg-indigo-600 text-white font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xs active:scale-95"
            >
              <Play className="w-4 h-4 text-[#f09a1a]" />
              Initialize Live Broadcast
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
               <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-xl border border-indigo-200 dark:border-indigo-900 shadow-sm inline-flex flex-col items-center shrink-0">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1.5">Active Session PIN</span>
                  <span className="text-4xl font-extrabold tracking-widest text-slate-900 dark:text-white">{activeSessionCode}</span>
               </div>
               <div className="flex-1 space-y-2">
                 <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                   <Clock className="w-4 h-4" /> Live Broadcasting Session Active
                 </p>
                 <button 
                  onClick={handleStopSession}
                  className="px-4 py-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95"
                 >
                   <StopCircle className="w-4 h-4" />
                   Terminate Session
                 </button>
               </div>
            </div>
          )}
        </div>
      )}

      {user?.role === Role.STUDENT && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-emerald-100 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <Radio className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active OTP Check-In</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 max-w-xl leading-relaxed">
            Enter the active 4-digit code broadcasted by your lecturer to register your presence for the current period.
          </p>
          
          {attendanceMarked ? (
             <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-950/20 px-4 py-3 border border-emerald-200 dark:border-emerald-900 rounded-xl shadow-xs max-w-md animate-fade-in">
               <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
               <span className="text-xs font-bold">Attendance successfully registered in the KASC master roster!</span>
             </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3 max-w-sm">
                <input 
                  type="text" 
                  placeholder="Enter 4-Digit OTP" 
                  maxLength={4}
                  value={studentCodeInput}
                  onChange={(e) => setStudentCodeInput(e.target.value)}
                  className="flex-grow px-4 py-2.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-center text-lg font-black tracking-widest font-mono"
                />
                <button 
                  onClick={handleMarkStudentAttendance}
                  disabled={studentCodeInput.length !== 4}
                  className="px-6 py-2.5 bg-emerald-600 dark:bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-xs active:scale-95"
                >
                  <Check className="w-4 h-4 text-[#f09a1a] shrink-0" />
                  Submit
                </button>
              </div>
              {otpError && (
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-semibold bg-rose-50 dark:bg-rose-950/25 px-3 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl max-w-sm animate-fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}



      {/* 3. Trend Chart Section incorporating Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Monthly Trend Graph using Recharts */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
             <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-emerald-500" />
                   Monthly Attendance trends
                </h3>
                <p className="text-[11px] text-slate-400">Month-on-month comparison with regulatory 75% HOD threshold.</p>
             </div>
             {isFaculty && (
               <div className="flex items-center gap-1.5 shrink-0">
                 <button
                   onClick={() => handleExportPDF('class-wide')}
                   disabled={isExporting !== null}
                   className="px-2.5 py-1.5 bg-[#1e2e6b] hover:bg-[#132150] disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                   title="Export Class-wide Trends PDF Report"
                 >
                   {isExporting === 'class-wide' ? (
                     <>
                       <Loader2 className="w-3 h-3 animate-spin text-[#f09a1a]" />
                       Processing...
                     </>
                   ) : (
                     <>
                       <Download className="w-3 h-3 text-[#f09a1a]" />
                       Class PDF
                     </>
                   )}
                 </button>
                 <button
                   onClick={() => handleExportPDF('individual')}
                   disabled={isExporting !== null}
                   className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-45 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold rounded-lg text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                   title="Export Individual Student Roster PDF Report"
                 >
                   {isExporting === 'individual' ? (
                     <>
                       <Loader2 className="w-3 h-3 animate-spin" />
                       Processing...
                     </>
                   ) : (
                     <>
                       <Download className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                       Roster PDF
                     </>
                   )}
                 </button>
               </div>
             )}
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTENDANCE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e2e6b" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#1e2e6b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="opacity-40" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }} 
                  stroke="#94a3b8" 
                />
                <YAxis 
                  domain={[60, 100]} 
                  tick={{ fontSize: 10 }} 
                  stroke="#94a3b8" 
                  unit="%" 
                />
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '11px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rbg(0,0,0,0.08)',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1'
                  }} 
                />
                <ReferenceLine y={75} stroke="#f09a1a" strokeDasharray="5 5" label={{ value: '75% Mandate', fill: '#f09a1a', fontSize: 10, position: 'top' }} />
                <Area 
                  type="monotone" 
                  dataKey="percentage" 
                  name="Aggregate Attendance"
                  stroke="#1e2e6b" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorPercentage)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
             <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Highest Month</span>
                <p className="text-sm font-black text-[#1e2e6b] dark:text-indigo-400">94.1% (Mar)</p>
             </div>
             <div className="space-y-1 border-x border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Lowest Month</span>
                <p className="text-sm font-black text-rose-600">83.5% (Apr)</p>
             </div>
             <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Aggregates Variance</span>
                <p className="text-sm font-black text-emerald-500">+17.4% Above Limit</p>
             </div>
          </div>
        </div>

        {/* Right Detail Block - Attendance Overview or Manual entry */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          {isFaculty ? (
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
                   <CalendarDays className="w-4 h-4 text-[#1e2e6b] dark:text-[#f09a1a]" />
                   Manual Class Entry
                </h2>
                <span className="text-[10px] font-mono text-[#f09a1a] font-bold">Data Structures (A)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                 Review daily absentees and toggle presence manually. Click changes will write immediately to university ledger records.
              </p>
              
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                 {[
                   { id: '1001', name: 'Arun Kumar', dept: 'B.Sc Computer Science' },
                   { id: '1002', name: 'Divya Bharathi', dept: 'B.Sc Computer Science' },
                   { id: '1003', name: 'Rajesh Khanna', dept: 'B.Sc Computer Science' }
                 ].map(student => (
                   <div key={student.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-200 transition-colors flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{student.name}</h4>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">Reg: {student.id}</span>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                         <button className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[10px] uppercase rounded transition-colors">Present</button>
                         <button className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-[10px] uppercase rounded transition-colors">Absent</button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
                     <CalendarDays className="w-4 h-4 text-[#1e2e6b]" />
                     Individual Aggregates
                  </h2>
               </div>

               <div className="flex items-center gap-6">
                 <div className="w-24 h-24 rounded-full border-8 border-emerald-500 flex items-center justify-center shrink-0">
                   <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">88.5%</span>
                 </div>
                 <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">Overall Rating</h3>
                    <p className="text-[11px] leading-relaxed text-slate-500">You are safe! Attendance must remain over 75% to prevent Hall Ticket deduction holds.</p>
                 </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Subject Breakdown</h4>
                  
                  <div className="space-y-3">
                     {[
                       { title: 'Data Structures & Algorithms', pct: 92 },
                       { title: 'Database management System', pct: 79 },
                       { title: 'Automata Theory & Computability', pct: 85 },
                       { title: 'Discrete Mathematical Structures', pct: 72, low: true }
                     ].map((item, id) => (
                       <div key={id} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-350">
                            <span className="truncate pr-1">{item.title}</span>
                            <span className={`font-bold ${item.low ? 'text-rose-600' : 'text-emerald-600'}`}>{item.pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-1.5">
                             <div className={`h-1.5 rounded-full ${item.low ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${item.pct}%` }} />
                          </div>
                          {item.low && (
                             <p className="text-[9px] font-bold text-rose-500 flex items-center gap-1 pt-0.5 animate-pulse">
                               <AlertTriangle className="w-3.5 h-3.5" /> Warning: Below 75% criteria limit
                             </p>
                          )}
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
