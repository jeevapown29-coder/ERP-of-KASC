import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { 
  Bell, AlertTriangle, FileText, Megaphone, CheckCircle, 
  Settings, Users, Sliders, Send, History, RefreshCw, Trash2, Mail, Info
} from 'lucide-react';

interface StudentRosterItem {
  id: string;
  name: string;
  dept: string;
  attendance: number;
  parentEmail: string;
  notifiedCount: number;
}

interface AutoAlertLog {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  attendance: number;
  threshold: number;
  channel: string;
  message: string;
}

const INITIAL_STUDENT_ROSTER: StudentRosterItem[] = [
  { id: 'S1001', name: 'Arun Kumar', dept: 'B.Sc Computer Science', attendance: 92.4, parentEmail: 'arun.parent@gmail.com', notifiedCount: 0 },
  { id: 'S1002', name: 'Divya Bharathi', dept: 'B.Sc Computer Science', attendance: 77.5, parentEmail: 'divya.parent@gmail.com', notifiedCount: 0 },
  { id: 'S1003', name: 'Rajesh Khanna', dept: 'B.Sc Computer Science', attendance: 83.5, parentEmail: 'rajesh.parent@gmail.com', notifiedCount: 1 },
  { id: 'S1004', name: 'John Nyong', dept: 'B.Sc Computer Science', attendance: 88.0, parentEmail: 'johnnyong.parent@gmail.com', notifiedCount: 0 },
  { id: 'S1005', name: 'Arjun Prasad', dept: 'B.Sc Computer Science', attendance: 68.2, parentEmail: 'arjun.parent@gmail.com', notifiedCount: 2 },
  { id: 'S1006', name: 'Priya Dharshini', dept: 'B.Sc Computer Science', attendance: 74.0, parentEmail: 'priya.parent@gmail.com', notifiedCount: 0 },
  { id: 'S1007', name: 'Karthik Raja', dept: 'B.Sc Computer Science', attendance: 62.5, parentEmail: 'karthik.parent@gmail.com', notifiedCount: 3 },
  { id: 'S1008', name: 'Srinivasan M', dept: 'B.Sc Computer Science', attendance: 71.8, parentEmail: 'srini.m@gmail.com', notifiedCount: 1 },
];

export default function Notifications() {
  const { user } = useAuth();
  
  // Stored state
  const [threshold, setThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('kasc_attendance_threshold');
    return saved ? parseInt(saved, 10) : 75;
  });

  const [studentRoster, setStudentRoster] = useState<StudentRosterItem[]>(() => {
    const saved = localStorage.getItem('kasc_attendance_roster');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_ROSTER;
  });

  const [alertLogs, setAlertLogs] = useState<AutoAlertLog[]>(() => {
    const saved = localStorage.getItem('kasc_auto_alerts_log');
    if (saved) return JSON.parse(saved);
    // Initial logs seed
    return [
      {
        id: 'L-101',
        timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString(),
        studentId: 'S1007',
        studentName: 'Karthik Raja',
        attendance: 62.5,
        threshold: 75,
        channel: 'EMAIL & SMS',
        message: 'Alert dispatched: Attendance 62.5% is critically below the 75% HOD threshold. Guardians warned.'
      }
    ];
  });

  // Current selected alerts channel configuration
  const [alertChannel, setAlertChannel] = useState<'Email' | 'SMS' | 'Email + SMS'>('Email + SMS');
  
  // Simulated student state for student role to play with interactive thresholds
  const [simulatedStudentAttendance, setSimulatedStudentAttendance] = useState<number>(73.5);
  
  // Feedback status
  const [notificationMsg, setNotificationMsg] = useState('');
  const [sweepProgress, setSweepProgress] = useState(false);

  // Synchronise state changes to localStorage
  useEffect(() => {
    localStorage.setItem('kasc_attendance_threshold', threshold.toString());
  }, [threshold]);

  useEffect(() => {
    localStorage.setItem('kasc_attendance_roster', JSON.stringify(studentRoster));
  }, [studentRoster]);

  useEffect(() => {
    localStorage.setItem('kasc_auto_alerts_log', JSON.stringify(alertLogs));
  }, [alertLogs]);

  // Handle single student low-attendance alert dispatch simulation
  const dispatchAlertForStudent = (student: StudentRosterItem) => {
    const newLog: AutoAlertLog = {
      id: `L-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toLocaleString(),
      studentId: student.id,
      studentName: student.name,
      attendance: student.attendance,
      threshold: threshold,
      channel: alertChannel,
      message: `System Alert: Attendance rating ${student.attendance}% falls below criteria ${threshold}%. Dispatched warning copy to ${student.parentEmail}.`
    };

    setAlertLogs(prev => [newLog, ...prev]);
    setStudentRoster(prev => prev.map(s => {
      if (s.id === student.id) {
        return { ...s, notifiedCount: s.notifiedCount + 1 };
      }
      return s;
    }));

    flashFeedback(`Attendance warning dispatched to ${student.name} and parent contact!`);
  };

  // Perform full compliance check sweep
  const triggerComplianceSweep = () => {
    setSweepProgress(true);
    setTimeout(() => {
      const atRiskStudents = studentRoster.filter(s => s.attendance < threshold);
      if (atRiskStudents.length === 0) {
        flashFeedback("Sweep complete. No students fall below the set attendance criteria!");
        setSweepProgress(false);
        return;
      }

      const newLogs: AutoAlertLog[] = [];
      const updatedRoster = studentRoster.map(s => {
        if (s.attendance < threshold) {
          newLogs.push({
            id: `L-${Math.floor(10000 + Math.random() * 90000)}`,
            timestamp: new Date().toLocaleString(),
            studentId: s.id,
            studentName: s.name,
            attendance: s.attendance,
            threshold: threshold,
            channel: alertChannel,
            message: `Automated compliance sweep: ${s.name} (${s.attendance}%) found below criteria ${threshold}%. Auto-Warning sent.`
          });
          return { ...s, notifiedCount: s.notifiedCount + 1 };
        }
        return s;
      });

      setAlertLogs(prev => [...newLogs, ...prev]);
      setStudentRoster(updatedRoster);
      flashFeedback(`Compliance check completed! Automated alerts dispatched to ${atRiskStudents.length} under-performing students.`);
      setSweepProgress(false);
    }, 1000);
  };

  const flashFeedback = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const clearAlertLogs = () => {
    setAlertLogs([]);
    setShowClearConfirm(false);
    flashFeedback("Compliance transmission logs cleared.");
  };

  const resetNotifiedCount = () => {
    const resetRoster = studentRoster.map(s => ({ ...s, notifiedCount: 0 }));
    setStudentRoster(resetRoster);
    flashFeedback("All pending student warnings counters reset to zero.");
  };

  // Static Notice Board Items list
  const generalCirculars = [
    { type: 'emergency', title: 'Heavy Rain - College Closed Tomorrow', time: '10 mins ago', desc: 'Due to severe weather warnings in Coimbatore district, the college will remain closed tomorrow.' },
    { type: 'circular', title: 'End Semester Exam Schedule Released', time: '2 hours ago', desc: 'Please check the timetable module for your respective semester schedules and exam dates.' },
    { type: 'announcement', title: 'Annual Cultural Fest - Registrations Open', time: '1 day ago', desc: 'Register for the various events through your student portal before 25th Oct.' },
  ];

  // Check if current student has a virtual low attendance warning
  const isUserStudent = user?.role === Role.STUDENT;
  const isUnderThreshold = simulatedStudentAttendance < threshold;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-[#1e2e6b] dark:text-[#f09a1a]" />
            Notice Board & Alerts Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Check institutional notice circulars and configure automated attendance threshold alert routines.
          </p>
        </div>
      </div>

      {notificationMsg && (
        <div id="alert-toast" className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs p-4 rounded-xl font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* STUDENT ROUTINE: Interactive Simulated Dashboard Alert if under threshold */}
      {isUserStudent && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
            <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-indigo-500" />
              Student Portal - Attendance Monitor Simulator
            </h3>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono px-2 py-1 rounded-md">Logged User Profile</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-850/80 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Simulate Your Attendance Percentage ({simulatedStudentAttendance}%)
              </label>
              <input 
                type="range" 
                min={50} 
                max={100} 
                step={0.5}
                value={simulatedStudentAttendance}
                onChange={(e) => setSimulatedStudentAttendance(parseFloat(e.target.value))}
                className="w-full accent-[#1e2e6b]"
              />
              <p className="text-[10px] text-slate-400">
                Slide the bar to simulate your active attendance and observe how the ERP trigger automatically registers warnings based on the standard University threshold limit.
              </p>
            </div>
            
            <div className="space-y-1 text-center md:text-left md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Standard Alert Criteria Limit</span>
              <span className="text-4xl font-extrabold text-[#1a2f6c] dark:text-indigo-400">{threshold}%</span>
              <span className="block text-[10px] text-slate-400 mt-1">Consequences apply for scores matching below this rating.</span>
            </div>
          </div>

          {isUnderThreshold ? (
            <div className="bg-rose-500/5 border-2 border-rose-500/20 rounded-2xl p-5 flex gap-4 items-start animate-pulse">
              <AlertTriangle className="w-10 h-10 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-rose-600 uppercase tracking-wider">CRITICAL AUTO-ALERT: ATTENDANCE BLOCK STATUS DETECTED</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-sans">
                  Attention <strong>{user?.name || "Student"}</strong>, your current attendance of <strong>{simulatedStudentAttendance}%</strong> falls below the mandatory <strong>{threshold}% Criteria limit</strong>.
                </p>
                <div className="text-[10px] text-slate-500 leading-normal font-mono flex flex-col gap-1 pt-1">
                  <span>• System Action: Mandatory alert dispatched to registered guardian ({user?.email || "guardian@gmail.com"})</span>
                  <span>• Regulatory Penalty: Eligible for exam hall ticket suspension unless remediated internally.</span>
                  <span>• Rescue Action: Consult your CS Department Counselor immediately to request Compensatory Remedial Attendance Credit (CRAC).</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex gap-3 items-center text-xs text-slate-700 dark:text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Your current attendance of <strong>{simulatedStudentAttendance}%</strong> compliant status looks excellent! You are clear from system warnings and eligible for terminal semester exams.</span>
            </div>
          )}
        </div>
      )}

      {/* Grid: Staff Low-Attendance Sweep Dashboard & Notice circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Hand: Auto-Alert Configuration Terminal (Visible primarily for Faculty/HOD/Admin for control, or shown as general info for others with view rights) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#f09a1a]" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Compliance Rule Engine
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#1e2e6b] dark:text-indigo-400 font-bold">KASC-CONFIG-v4.0</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Define the regulatory attendance floor. The ERP system tracks class roll sheets hourly. If any active student falls below this target index, the dispatch engine generates warnings.
            </p>

            <div className="space-y-4 pt-1">
              {/* Threshold Slider control */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-350">
                  <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5" /> Warning Threshold Criteria</span>
                  <span className="text-base text-[#1e2e6b] dark:text-[#f09a1a] font-extrabold">{threshold}%</span>
                </div>
                <input 
                  type="range" 
                  min={60} 
                  max={90} 
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
                  className="w-full accent-[#1e2e6b]"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>60% (Minimum)</span>
                  <span>75% (Standard University Norm)</span>
                  <span>90% (Strict High Criteria)</span>
                </div>
              </div>

              {/* Alert Channel Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Dispatch Alert Channel</label>
                  <select
                    value={alertChannel}
                    onChange={(e) => setAlertChannel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Email">Email Warnings Only</option>
                    <option value="SMS">SMS Cellular Route</option>
                    <option value="Email + SMS">Combined (Email + SMS Gateway)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Administrative Controls</label>
                  <button
                    onClick={triggerComplianceSweep}
                    disabled={sweepProgress}
                    className="w-full py-2 bg-[#1e2e6b] hover:bg-[#132150] disabled:bg-slate-300 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {sweepProgress ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Sweeping database...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#f09a1a] shrink-0" />
                        Run Auto-Sweep Sweep
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* At-Risk Student Monitoring list */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-rose-500 shrink-0" />
                  Students Under Attendance Mark ({studentRoster.filter(s => s.attendance < threshold).length})
                </span>
                
                <button 
                  onClick={resetNotifiedCount}
                  className="text-[9px] font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  Reset Warnings Counters
                </button>
              </div>

              <div className="border border-slate-100 dark:border-slate-850 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-850 max-h-60 overflow-y-auto pr-0.5">
                {studentRoster.map((student) => {
                  const hasWarningState = student.attendance < threshold;
                  return (
                    <div 
                      key={student.id} 
                      className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        hasWarningState 
                          ? 'bg-rose-500/5 hover:bg-rose-500/10' 
                          : 'bg-white hover:bg-slate-50 dark:bg-slate-900'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{student.name}</h4>
                          <span className={`px-1.5 py-0.5 text-[8px] font-mono rounded font-bold ${hasWarningState ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200' : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200'}`}>
                            {student.attendance}%
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-sans leading-normal">
                          ID: {student.id} | Parent Email: <span className="font-mono">{student.parentEmail}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {student.notifiedCount > 0 && (
                          <span className="text-[9px] bg-amber-100/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200/50 font-bold px-2 py-0.5 rounded-lg font-sans">
                            {student.notifiedCount} Dispatched
                          </span>
                        )}
                        <button
                          onClick={() => dispatchAlertForStudent(student)}
                          className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg border tracking-wider transition-all shadow-2xs ${
                            hasWarningState 
                              ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-900' 
                              : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Manual Warn
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Hand: Notice Board Circulars & Dispatch Warning Logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* NOTICE BOARD CIRCULARS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-[#1e2e6b] dark:text-[#f09a1a]" />
                Notice Board Circulars
              </h2>
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-0.5">
              {generalCirculars.map((n, i) => (
                <div key={i} className={`p-4 rounded-xl border flex gap-3 transition-transform hover:-translate-y-0.5 duration-200 ${
                  n.type === 'emergency' 
                    ? 'bg-rose-500/5 border-rose-200/50 dark:border-rose-950' 
                    : 'bg-slate-50/50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-850'
                }`}>
                  <div className="shrink-0 mt-0.5">
                    {n.type === 'emergency' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                    {n.type === 'circular' && <FileText className="w-5 h-5 text-indigo-500" />}
                    {n.type === 'announcement' && <Megaphone className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                        {n.title}
                      </h4>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 font-sans">
                      {n.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPLIANCE WARNING DISPATCH HISTORIC LOGS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest flex items-center gap-1.5">
                <History className="w-4 h-4 text-indigo-500" />
                Historic Auto-Alert Dispatch Logs
              </h2>
              {alertLogs.length > 0 && (
                <div className="flex items-center gap-2">
                  {!showClearConfirm ? (
                    <button 
                      onClick={() => setShowClearConfirm(true)}
                      className="text-[9px] font-bold text-rose-500 hover:opacity-80 flex items-center gap-0.5 shadow-none pb-0.5"
                      title="Clear Logs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded px-1.5 py-0.5 text-[9px]">
                      <span className="text-rose-700 dark:text-rose-300 font-bold">Clear?</span>
                      <button 
                        onClick={clearAlertLogs}
                        className="font-bold text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Yes
                      </button>
                      <span className="text-slate-300">|</span>
                      <button 
                        onClick={() => setShowClearConfirm(false)}
                        className="font-bold text-slate-500 hover:underline"
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-0.5">
              {alertLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 italic">
                  No auto-warnings dispatched recently.
                </div>
              ) : (
                alertLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1.5 leading-relaxed">
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                      <span>Ref: {log.id}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 font-sans">
                      Recipient ID: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{log.studentId} ({log.studentName})</span>
                    </p>
                    
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {log.message}
                    </p>

                    <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800/80 pt-1 text-[8px] font-black uppercase font-mono">
                      <span className="text-amber-500">Gateway: {log.channel}</span>
                      <span className="text-slate-400">Trigger: &lt; {log.threshold}% Criteria</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-indigo-500/5 rounded-xl border border-indigo-500/10 p-3 flex gap-2 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 font-sans">
              <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                <strong>System Cron Service Active:</strong> Real-time compliance sweep schedules execute daily at 11:59 PM to flag student roster balances under the configured benchmark.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
