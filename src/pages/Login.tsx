import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { 
  Award, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  CheckCircle, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink, 
  UserCheck, 
  Clock, 
  Building, 
  GraduationCap, 
  ArrowRight,
  Globe,
  Compass,
  FileText,
  BadgeAlert,
  Calendar,
  Lock,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Admin System', role: Role.ADMIN, email: 'admin@kascerp.edu' },
  { id: '2', name: 'Dr. Principal', role: Role.PRINCIPAL, email: 'principal@kascerp.edu' },
  { id: '3', name: 'Dr. Sarah (HOD)', role: Role.HOD, email: 'hod.cs@kascerp.edu' },
  { id: '4', name: 'Prof. Faculty', role: Role.FACULTY, email: 'faculty@kascerp.edu' },
  { id: '5', name: 'John Doe', role: Role.STUDENT, email: 'johndoe@student.kascerp.edu' },
  { id: '6', name: 'Jane Doe', role: Role.PARENT, email: 'janedoe@parent.com' },
  { id: '7', name: 'Mr. Librarian', role: Role.LIBRARIAN, email: 'library@kascerp.edu' },
  { id: '8', name: 'Warden Smith', role: Role.HOSTEL_WARDEN, email: 'warden@kascerp.edu' },
  { id: '9', name: 'Finance Manager', role: Role.ACCOUNTANT, email: 'accounts@kascerp.edu' },
  { id: '10', name: 'Coach Davis', role: Role.SPORTS_COORDINATOR, email: 'sports@kascerp.edu' },
];

import { KascLogo } from '../components/KascLogo';
export { KascLogo };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [view, setView] = useState<'login' | 'forgot' | 'first-login' | 'applicant'>('login');
  
  const [selectedRole, setSelectedRole] = useState<Role>(Role.STUDENT);
  const [identifier, setIdentifier] = useState('1001');
  const [password, setPassword] = useState('password123');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Captcha security state
  const [captchaCode, setCaptchaCode] = useState('EESJG');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [isNotARobot, setIsNotARobot] = useState(false);
  const [isVerifyingRobot, setIsVerifyingRobot] = useState(false);

  // New Applicant Form States
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantDob, setApplicantDob] = useState('');
  const [applicantGender, setApplicantGender] = useState('Male');
  const [applicantCategory, setApplicantCategory] = useState<'aided' | 'self'>('aided');
  const [applicantCourse, setApplicantCourse] = useState('B.Sc. Computer Science');
  const [applicantMarks, setApplicantMarks] = useState('');
  const [applicantGuardian, setApplicantGuardian] = useState('');
  const [applicantSubmitted, setApplicantSubmitted] = useState(false);
  const [applicationNo, setApplicationNo] = useState('');

  const generateNewCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setCaptchaError('');
  };

  // Generate randomized captcha code on component mount
  useEffect(() => {
    generateNewCaptcha();
  }, []);

  // Compute / render canvas graphic matching college theme
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background clearing with custom slate shade
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw distractor noise lines 
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 80) + 120}, ${Math.floor(Math.random() * 80) + 120}, ${Math.floor(Math.random() * 80) + 120}, 0.6)`;
      ctx.lineWidth = Math.random() * 1.5 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Add pixelated security dots
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.25)`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Text configuration with custom fonts and alignment
    ctx.font = 'bold 20px "JetBrains Mono", Monk, Courier, monospace';
    ctx.textBaseline = 'middle';

    const charSpacing = canvas.width / (captchaCode.length + 1);
    for (let i = 0; i < captchaCode.length; i++) {
      const char = captchaCode[i];
      // Alternate custom collegiate brand colors (Deep Navy and Amber orange)
      ctx.fillStyle = i % 2 === 0 ? '#1e2e6b' : '#f09a1a';
      
      ctx.save();
      const x = charSpacing * (i + 1) - 4 + (Math.random() * 4 - 2);
      const y = canvas.height / 2 + (Math.random() * 8 - 4);
      ctx.translate(x, y);

      // Apply random rotation angle constraints
      const angle = (Math.random() * 24 - 12) * Math.PI / 180;
      ctx.rotate(angle);

      ctx.fillText(char, -6, 0);
      ctx.restore();
    }
  }, [captchaCode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isNotARobot) {
      setCaptchaError('Anti-robot security check required. Please verify identity.');
      return;
    }
    
    setCaptchaError('');
    
    if (password === 'firstlogin') {
      setView('first-login');
      return;
    }
    
    const user = mockUsers.find(u => u.role === selectedRole);
    if (user) {
      login(user);
      navigate('/');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.role === selectedRole);
    if (user) {
      login(user);
      navigate('/');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset instructions have been sent to your registered email/phone.");
    setView('login');
  };

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appNum = 'KASC-2026-' + Math.floor(10000 + Math.random() * 90000);
    setApplicationNo(appNum);
    setApplicantSubmitted(true);
    
    const newApp = {
      applicationNo: appNum,
      name: applicantName,
      email: applicantEmail,
      phone: applicantPhone,
      dob: applicantDob,
      gender: applicantGender,
      course: applicantCourse,
      marks: applicantMarks,
      guardian: applicantGuardian,
      status: 'PR_VERIFIED_PENDING',
      appliedAt: new Date().toISOString()
    };
    
    const existing = localStorage.getItem('kasc_admissions');
    const list = existing ? JSON.parse(existing) : [];
    list.push(newApp);
    localStorage.setItem('kasc_admissions', JSON.stringify(list));
  };

  const selectDemoUser = (user: typeof mockUsers[0], idVal: string) => {
    setSelectedRole(user.role);
    setIdentifier(idVal);
    setPassword('password123');
    setCaptchaInput(captchaCode); // Auto-fills correct captcha for smooth testing
    setIsNotARobot(true); // Pre-sets robot verification check for demo workflow
    setCaptchaError('');
    setIsDemoDropdownOpen(false);
  };

  const selectedUser = mockUsers.find(u => u.role === selectedRole);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#f09a1a]/20 selection:text-[#1e2e6b] flex flex-col">
      
      {/* 1. Official Top Announcement Banner Removed */}

      {/* 2. Primary Modern Header */}
      <header className="bg-white py-4 px-6 border-b border-slate-200/80 sticky top-0 bg-white/95 backdrop-blur-md z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <KascLogo className="w-16 h-16 sm:w-20 sm:h-20" />
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#111d4d] tracking-tight leading-tight uppercase font-sans">
                KONGUNADU ARTS AND SCIENCE COLLEGE <span className="text-[#f09a1a] font-semibold tracking-normal lowercase italic">(Autonomous)</span>
              </h1>
              <div className="text-[10px] md:text-xs text-slate-500 uppercase space-y-0.5 tracking-wider font-semibold mt-1">
                <p className="flex items-center justify-center sm:justify-start gap-1">
                  <Award className="w-3.5 h-3.5 text-[#f09a1a] inline shrink-0" />
                  <span>Re-accredited by NAAC with 'A+' Grade - 4th Cycle (CGPA 3.64/4)</span>
                </p>
                <p>College of Excellence (UGC) • DBT Star College (DST, Govt of India)</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <div className="text-right">
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Portal Access</p>
              <p className="text-[#13235d] font-extrabold text-sm font-mono">ACADEMIC LEDGER</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1e2e6b]/5 flex items-center justify-center border border-[#1e2e6b]/10">
              <UserCheck className="w-4 h-4 text-[#1e2e6b]" />
            </div>
          </div>
        </div>
      </header>

      {/* 3. Refined academic Hero & Clean Portal Panel */}
      <div className="relative min-h-[540px] bg-slate-900 border-b-4 border-[#f09a1a] overflow-hidden flex items-center justify-center py-10">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-25 mix-blend-overlay" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111c42]/95 via-[#1a2d6c]/85 to-slate-900/90" />
        
        <div className="relative z-10 w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Welcome Column */}
          <div className="lg:col-span-7 text-white text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#f09a1a]/20 text-[#ffb03a] px-3.5 py-1.5 rounded-full font-bold text-xs border border-[#f09a1a]/30">
              <Award className="w-4 h-4" /> GOLDEN JUBILEE HERITAGE • ESTD. 1973
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white uppercase font-sans">
              Gateway to <span className="text-[#f09a1a]">academic excellence</span>
            </h2>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Access the official student ledger, faculty registers, exam grades, attendance logs, and administrative resources dynamically from our unified secure academic station.
            </p>
            
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/8 transition-colors">
                <span className="block text-2xl font-black text-[#f09a1a]">A+</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold block mt-0.5">NAAC Rating</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/8 transition-colors">
                <span className="block text-2xl font-black text-[#f09a1a]">UGC</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold block mt-0.5">Excellence Status</span>
              </div>
              <div className="bg-white/5 border border-white/15 rounded-lg p-3 text-center hover:bg-white/8 transition-colors">
                <span className="block text-2xl font-black text-[#f09a1a]">50+</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold block mt-0.5">Yrs Legacy</span>
              </div>
            </div>
          </div>
          
          {/* Login Col */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white text-slate-800 shadow-xl w-full max-w-sm rounded-xl border border-slate-100 overflow-hidden">
              
              <div className="flex border-b border-slate-150 bg-slate-50/50">
                <button 
                  onClick={() => {
                    setView('login');
                    setApplicantSubmitted(false);
                  }}
                  className={`flex-1 py-2.5 text-[11px] font-bold transition-all uppercase tracking-wider ${view === 'login' ? 'border-b-2 border-[#1e2e6b] text-[#1e2e6b] bg-white font-extrabold' : 'text-slate-400 hover:text-slate-600 bg-slate-50'}`}
                >
                  SECURE SIGN IN
                </button>
                <button 
                  onClick={() => {
                    setView('applicant');
                    setApplicantSubmitted(false);
                  }}
                  className={`flex-1 py-2.5 text-[11px] font-bold transition-all uppercase tracking-wider ${view === 'applicant' ? 'border-b-2 border-[#1e2e6b] text-[#1e2e6b] bg-white font-extrabold' : 'text-slate-400 hover:text-slate-600 bg-slate-50'}`}
                >
                  NEW APPLICANT
                </button>
              </div>
              
              <div className="p-4 md:p-5 space-y-4">
                
                {view === 'login' && (
                  <>
                    <div className="text-center sm:text-left">
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">KASC Student & Staff Portal</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Provide credentials to authenticate your session</p>
                    </div>



                    <form onSubmit={handleLogin} className="space-y-3.5">
                      {/* Role selection */}
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">Authority Role</label>
                        <select 
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value as Role)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:border-[#1e2e6b] focus:outline-none transition-all font-bold"
                        >
                          {Object.values(Role).map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>

                      {/* Register Number / Identification */}
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                          {selectedRole === Role.STUDENT ? 'Student Register No' : 
                           selectedRole === Role.PARENT ? 'Parent Association ID' : 'Employee ID Code'}
                        </label>
                        <input
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:border-[#1e2e6b] focus:outline-none transition-all font-mono"
                          placeholder="Enter your system identifier"
                          required
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Access PIN / Password</label>
                          <button 
                            type="button" 
                            onClick={() => setView('forgot')} 
                            className="text-[9px] font-extrabold text-rose-600 hover:underline hover:text-rose-700 transition-colors uppercase tracking-wider"
                          >
                            Forgot?
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-3 pr-10 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:border-[#1e2e6b] focus:outline-none transition-all font-mono"
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                            title={showPassword ? "Hide PIN" : "Show PIN"}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Captcha Token Section - Upgraded to elegant "I'm not a robot" interactive checkbox validation */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Identity Integrity Check</label>
                        <div id="recaptcha-card" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 flex items-center justify-between select-none shadow-xs">
                          <div className="flex items-center">
                            <button
                              id="recaptcha-checkbox"
                              type="button"
                              onClick={() => {
                                if (isNotARobot) {
                                  setIsNotARobot(false);
                                  return;
                                }
                                setIsVerifyingRobot(true);
                                setTimeout(() => {
                                  setIsVerifyingRobot(false);
                                  setIsNotARobot(true);
                                  setCaptchaError('');
                                }, 600);
                              }}
                              disabled={isVerifyingRobot}
                              className={`w-5 h-5 rounded border flex items-center justify-center transition-all outline-none focus:outline-none ${
                                isNotARobot 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' 
                                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#1e2e6b]'
                              }`}
                              title="Anti-robot human verification"
                            >
                              {isVerifyingRobot ? (
                                <RefreshCw className="w-3 text-[#1e2e6b] dark:text-indigo-400 animate-spin" />
                              ) : isNotARobot ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : null}
                            </button>
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 ml-2.5">
                              I'm not a robot
                            </span>
                          </div>
                          <div className="flex flex-col items-end pr-1 opacity-75">
                            <ShieldCheck className="w-4 h-4 text-[#1e2e6b] dark:text-indigo-400" />
                            <span className="text-[7px] text-slate-400 mt-0.5 tracking-widest font-mono select-none">RECAPTCHA</span>
                          </div>
                        </div>
                        {captchaError && (
                          <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                            <BadgeAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            {captchaError}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#1e2e6b] hover:bg-[#132150] text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition-all text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
                      >
                        <span>Login to Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#f09a1a]" />
                      </button>
                    </form>
                  </>
                )}

                {view === 'applicant' && (
                  <div className="space-y-3">
                    {!applicantSubmitted ? (
                      <>
                        <div className="text-center sm:text-left">
                          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">College Admission 2026</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Submit your preliminary registration details for college admission evaluation.</p>
                        </div>

                        <form onSubmit={handleAdmissionSubmit} className="space-y-3">
                          {/* Full Name */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Full Name of Applicant</label>
                            <input 
                              type="text" 
                              value={applicantName} 
                              onChange={(e) => setApplicantName(e.target.value)} 
                              placeholder="Name as in 12th Marksheet" 
                              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none" 
                              required 
                            />
                          </div>

                          {/* Email & Mobile */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Email ID</label>
                              <input 
                                type="email" 
                                value={applicantEmail} 
                                onChange={(e) => setApplicantEmail(e.target.value)} 
                                placeholder="name@domain.com" 
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none" 
                                required 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Mobile No</label>
                              <input 
                                type="tel" 
                                value={applicantPhone} 
                                onChange={(e) => setApplicantPhone(e.target.value)} 
                                placeholder="+91 XXXXX XXXXX" 
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none" 
                                required 
                              />
                            </div>
                          </div>

                          {/* Guardian Name */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Parent or Guardian Name</label>
                            <input 
                              type="text" 
                              value={applicantGuardian} 
                              onChange={(e) => setApplicantGuardian(e.target.value)} 
                              placeholder="Father/Mother/Guardian" 
                              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none" 
                              required 
                            />
                          </div>

                          {/* DOB & Gender */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Date of Birth</label>
                              <input 
                                type="date" 
                                value={applicantDob} 
                                onChange={(e) => setApplicantDob(e.target.value)} 
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none" 
                                required 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Gender</label>
                              <select 
                                value={applicantGender} 
                                onChange={(e) => setApplicantGender(e.target.value)}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none"
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          {/* Stream Category */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Admission Stream Category</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setApplicantCategory('aided');
                                  setApplicantCourse('B.Sc. Computer Science');
                                }}
                                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${applicantCategory === 'aided' ? 'bg-[#1e2e6b] text-white border-[#1e2e6b]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                              >
                                Govt Aided
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setApplicantCategory('self');
                                  setApplicantCourse('B.Sc. Computer Science (Self-Financed)');
                                }}
                                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${applicantCategory === 'self' ? 'bg-[#1e2e6b] text-white border-[#1e2e6b]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                              >
                                Self-Financed
                              </button>
                            </div>
                          </div>

                          {/* Selected Course selection based on category */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Desired Course Major</label>
                            <select
                              value={applicantCourse}
                              onChange={(e) => setApplicantCourse(e.target.value)}
                              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none font-semibold"
                            >
                              {applicantCategory === 'aided' ? (
                                <>
                                  <option value="B.Sc. Computer Science">B.Sc. Computer Science (Aided)</option>
                                  <option value="B.Sc. Mathematics">B.Sc. Mathematics (Aided)</option>
                                  <option value="B.Sc. Physics">B.Sc. Physics (Aided)</option>
                                  <option value="B.Sc. Chemistry">B.Sc. Chemistry (Aided)</option>
                                  <option value="B.Sc. Botany & Zoology">B.Sc. Botany & Zoology (Aided)</option>
                                  <option value="B.A. English Literature">B.A. English Literature (Aided)</option>
                                  <option value="M.Sc. Mathematics">M.Sc. Mathematics (Aided)</option>
                                  <option value="M.Sc. Physics">M.Sc. Physics (Aided)</option>
                                </>
                              ) : (
                                <>
                                  <option value="B.Sc. Computer Science (Self-Financed)">B.Sc. Computer Science (Unaided)</option>
                                  <option value="BCA (Computer Applications)">BCA (Computer Applications)</option>
                                  <option value="B.Sc. Information Technology">B.Sc. Information Technology (Unaided)</option>
                                  <option value="B.Sc. Computer Technology">B.Sc. Computer Technology (Unaided)</option>
                                  <option value="B.Sc. CS with Data Analytics">B.Sc. CS with Data Analytics</option>
                                  <option value="B.Com. Computer Applications (CA)">B.Com. Computer Applications (CA)</option>
                                  <option value="BBA Computer Applications">BBA Computer Applications</option>
                                  <option value="B.Sc. Biotechnology & Psychology">B.Sc. Biotechnology & Psychology</option>
                                  <option value="M.Sc. Biotechnology & Biochemistry">M.Sc. Biotechnology & Biochemistry</option>
                                  <option value="M.Sc. Chemistry">M.Sc. Chemistry (Unaided)</option>
                                </>
                              )}
                            </select>
                          </div>

                          {/* High School / HSC Marks */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">HSC (12th Grade) or Equivalent Percentage (%)</label>
                            <input 
                              type="number" 
                              max="100" 
                              min="35" 
                              value={applicantMarks} 
                              onChange={(e) => setApplicantMarks(e.target.value)} 
                              placeholder="e.g. 89.5" 
                              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none" 
                              required 
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-[#1e2e6b] hover:bg-[#132150] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 mt-4 shadow-md"
                          >
                            <span>Submit Admission Application</span>
                            <CheckCircle className="w-4 h-4 text-[#f09a1a]" />
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="text-center py-4 space-y-5 animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 m-auto flex items-center justify-center border-4 border-emerald-100 shadow-sm">
                          <CheckCircle className="w-10 h-10 animate-bounce" />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-lg font-black text-slate-900 uppercase">Application Registered!</h4>
                          <p className="text-xs text-slate-500 max-w-xs m-auto">Your draft admission dossier for Kongunadu Arts and Science College has been validated successfully.</p>
                        </div>

                        {/* Slip Receipt Box */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left font-mono text-[11px] space-y-2 relative overflow-hidden text-slate-700">
                          <div className="absolute top-0 right-0 transform rotate-12 translate-x-3 -translate-y-1 text-slate-200 font-bold select-none text-[22px]">
                            KASC
                          </div>
                          <div className="border-b border-dashed border-slate-300 pb-2 text-center">
                            <span className="font-bold text-slate-900">KASC APPLICANT PRE-SLIP</span>
                          </div>
                          <p><span className="text-slate-400">APPLICATION NO:</span> <strong className="text-amber-600 text-sm">{applicationNo}</strong></p>
                          <p><span className="text-slate-400">CANDIDATE:</span> <span className="font-extrabold text-slate-800">{applicantName.toUpperCase()}</span></p>
                          <p><span className="text-slate-400">COURSE MAJOR:</span> <span className="font-semibold text-slate-800">{applicantCourse}</span></p>
                          <p><span className="text-slate-400">STREAM TYPE:</span> <span className="text-slate-800 font-medium uppercase">{applicantCategory === 'aided' ? 'Government Aided' : 'Self-Financed / Unaided'}</span></p>
                          <p><span className="text-slate-400">HSC SCORE:</span> <span className="font-semibold text-slate-800">{applicantMarks}%</span></p>
                          <p><span className="text-slate-400">MOBILE NO:</span> <span className="text-slate-800">{applicantPhone}</span></p>
                          <p><span className="text-slate-400">EMAIL ADDR:</span> <span className="text-slate-800">{applicantEmail}</span></p>
                          <div className="border-t border-dashed border-slate-300 pt-2 text-[9px] text-slate-400 text-center leading-relaxed">
                            A verification email has been sent. Please secure this number for rank list publication procedures.
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setApplicantSubmitted(false);
                              setApplicantName('');
                              setApplicantEmail('');
                              setApplicantPhone('');
                              setApplicantMarks('');
                              setApplicantDob('');
                              setApplicantGuardian('');
                            }}
                            className="flex-1 border border-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-lg hover:bg-slate-50 transition-all font-sans"
                          >
                            New Form Application
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setView('login');
                              setApplicantSubmitted(false);
                            }}
                            className="flex-1 bg-[#1e2e6b] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-[#132150] transition-all font-sans shadow"
                          >
                            Go to Sign In
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {view === 'forgot' && (
                  <div className="space-y-4">
                    <button onClick={() => setView('login')} className="text-xs font-bold text-[#1e2e6b] uppercase hover:underline flex items-center gap-1">&larr; Back to login</button>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Reset Access PIN</h3>
                      <p className="text-xs text-slate-400">Provide registration details to generate temporal passcode.</p>
                    </div>
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-405 mb-1.5">Registered Email or system ID</label>
                        <input type="email" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none" placeholder="faculty@kascerp.edu" required />
                      </div>
                      <button type="submit" className="w-full bg-[#1e2e6b] text-white py-3 text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-opacity-90 transition-all">Submit reset request</button>
                    </form>
                  </div>
                )}

                {view === 'first-login' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Configure Password</h3>
                      <p className="text-xs text-slate-400">Establish your secure access word to complete login procedure.</p>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">New PIN / Password</label>
                        <div className="relative">
                          <input 
                            type={showNewPassword ? "text" : "password"} 
                            value={newPassword} 
                            onChange={e=>setNewPassword(e.target.value)} 
                            className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none font-mono" 
                            required 
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                            title={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Verify Password</label>
                        <div className="relative">
                          <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            value={confirmPassword} 
                            onChange={e=>setConfirmPassword(e.target.value)} 
                            className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none font-mono" 
                            required 
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                            title={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <button type="submit" disabled={!newPassword || newPassword !== confirmPassword} className="w-full bg-[#1e2e6b] text-white py-3 text-xs font-bold rounded-lg uppercase tracking-widest disabled:opacity-50 hover:bg-opacity-95 transition-all">Update & Enter</button>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* 4. Elegant Stat Counters Panel */}
      <div className="bg-white border-y border-slate-150 py-12 relative shrink-0">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-150 text-center">
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#f09a1a]/10 flex items-center justify-center border border-[#f09a1a]/20 mb-3 text-[#d97706]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="text-4xl font-extrabold text-[#111c42] tracking-tight">25</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Undergraduate programs</div>
          </div>
          
          <div className="pt-6 md:pt-0 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#f09a1a]/10 flex items-center justify-center border border-[#f09a1a]/20 mb-3 text-[#d97706]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-4xl font-extrabold text-[#111c42] tracking-tight">14</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Graduate courses</div>
          </div>
          
          <div className="pt-6 md:pt-0 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#f09a1a]/10 flex items-center justify-center border border-[#f09a1a]/20 mb-3 text-[#d97706]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-4xl font-extrabold text-[#111c42] tracking-tight">14</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Research tracks</div>
          </div>
          
          <div className="pt-6 md:pt-0 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#f09a1a]/10 flex items-center justify-center border border-[#f09a1a]/20 mb-3 text-[#d97706]">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-4xl font-extrabold text-[#111c42] tracking-tight">27</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Career certificates</div>
          </div>
          
        </div>
      </div>

      {/* 5. Course Catalog Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#f09a1a] text-xs font-bold uppercase tracking-widest block mb-2 px-3 py-1 bg-[#f09a1a]/10 inline-block rounded-md">
              KONGUNADU CURRICULUM
            </span>
            <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 uppercase">
              Courses Offered - Admission Open
            </h2>
            <p className="text-slate-500 text-xs mt-2 font-medium">Affiliated to Bharathiar University. Highly modern curricula aligned with contemporary global and industrial trends.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Government Aided Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
              <div className="border-b border-slate-100 pb-4">
                <span className="bg-amber-100/65 text-[#d97706] text-[10px] uppercase font-bold py-1 px-2.5 rounded">Category 1</span>
                <h3 className="font-extrabold text-slate-900 text-base uppercase mt-2">Government Aided courses</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-[#1e2e6b] uppercase text-[11px] tracking-wider mb-2.5 bg-slate-50 p-2 rounded-lg border-l-2 border-[#1e2e6b] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> UG Programmes (Bachelor)
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-1.5 font-medium">
                    <p className="flex gap-2 items-start"><span className="text-[#f09a1a]">•</span> B.A. English Literature</p>
                    <p className="flex gap-2 items-start"><span className="text-[#f09a1a]">•</span> B.Sc. Mathematics</p>
                    <p className="flex gap-2 items-start"><span className="text-[#f09a1a]">•</span> B.Sc. Physics</p>
                    <p className="flex gap-2 items-start"><span className="text-[#f09a1a]">•</span> B.Sc. Chemistry</p>
                    <p className="flex gap-2 items-start"><span className="text-[#f09a1a]">•</span> B.Sc. Botany & Zoology</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#1e2e6b] uppercase text-[11px] tracking-wider mb-2.5 bg-slate-50 p-2 rounded-lg border-l-2 border-[#1e2e6b] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> PG Programmes (Master)
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-1.5 font-medium">
                    <p className="flex gap-2 items-start"><span className="text-[#f09a1a]">•</span> M.Sc. Mathematics</p>
                    <p className="flex gap-2 items-start"><span className="text-[#f09a1a]">•</span> M.Sc. Physics</p>
                    <p className="flex gap-2 items-start"><span className="text-[#f09a1a]">•</span> M.Sc. Botany</p>
                    <p className="flex gap-2 items-start"><span className="text-[#f09a1a]">•</span> M.Sc. Zoology</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Self-Financed Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
              <div className="border-b border-slate-100 pb-4">
                <span className="bg-indigo-100/60 text-[#1e2e6b] text-[10px] uppercase font-bold py-1 px-2.5 rounded">Category 2</span>
                <h3 className="font-extrabold text-slate-900 text-base uppercase mt-2">Self-Financed / Unaided</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-[#1e2e6b] uppercase text-[11px] tracking-wider mb-2.5 bg-slate-50 p-2 rounded-lg border-l-2 border-[#1e2e6b] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> Self-Financed UG Degrees
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600 pl-1.5 font-medium max-h-[180px] overflow-y-auto">
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> B.Sc. Computer Science</p>
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> BCA (Computer Applications)</p>
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> B.Sc. Information Technology</p>
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> B.Sc. Computer Technology</p>
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> B.Sc. CS with Data Analytics</p>
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> B.Com. Computer Applications (CA)</p>
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> BBA Computer Applications</p>
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> B.Sc. Biotechnology & Psychology</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#1e2e6b] uppercase text-[11px] tracking-wider mb-2.5 bg-slate-50 p-2 rounded-lg border-l-2 border-[#1e2e6b] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Self-Financed PG Degrees
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600 pl-1.5 font-medium max-h-[110px] overflow-y-auto">
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> M.A. Tamil & English Literature</p>
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> M.Sc. Computer Science</p>
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> M.Sc. Biotechnology & Biochemistry</p>
                    <p className="flex gap-2 items-start"><span className="text-[#1e2e6b]">•</span> M.Sc. Chemistry</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Research & Advanced Programs */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
              <div className="border-b border-slate-100 pb-4">
                <span className="bg-rose-100/60 text-rose-700 text-[10px] uppercase font-bold py-1 px-2.5 rounded">Category 3</span>
                <h3 className="font-extrabold text-slate-900 text-base uppercase mt-2">Research & Certificate Tracks</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-[#f09a1a]/5 p-3 rounded-lg border border-[#f09a1a]/20">
                  <h4 className="font-bold text-[#d97706] uppercase text-[11.5px] mb-2 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 shrink-0" /> Ph.D. Research Programs
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5 text-[10.5px] text-slate-600 font-semibold">
                    <p>• Tamil Lit</p>
                    <p>• English Lit</p>
                    <p>• Mathematics</p>
                    <p>• Physics</p>
                    <p>• Chemistry</p>
                    <p>• Botany & Zoology</p>
                    <p>• Commerce</p>
                    <p>• Biochemistry</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#1e2e6b] uppercase text-[11px] tracking-wider mb-2.5 bg-slate-50 p-2 rounded-lg border-l-2 border-[#1e2e6b] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Career Oriented Courses
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-1.5 font-medium max-h-[140px] overflow-y-auto">
                    <p className="flex gap-2 items-start"><span className="text-amber-500 shrink-0">•</span> PG Diploma in Computer Applications (PGDCA)</p>
                    <p className="flex gap-2 items-start"><span className="text-amber-500 shrink-0">•</span> PG Diploma in Biodiversity & Operations Research</p>
                    <p className="flex gap-2 items-start"><span className="text-amber-500 shrink-0">•</span> Diploma in Agriculture & Ornamental Fish Production</p>
                    <p className="flex gap-2 items-start"><span className="text-amber-500 shrink-0">•</span> Certificates in Ethical Hacking & Full Stack Dev</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 6. High design value About and Holistic wheels */}
      <div className="bg-[#111c42] py-20 text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          
          <div className="flex justify-center">
            <div className="w-60 h-60 md:w-72 md:h-72 rounded-full border-4 border-white/20 relative flex items-center justify-center shrink-0 shadow-xl bg-slate-900/60 backdrop-blur-md">
              <div className="text-center font-black tracking-normal uppercase text-sm leading-tight px-6 select-none">
                HOLISTIC<br/>
                <span className="text-[#f09a1a]">ACADEMICS</span>
              </div>
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-[#f09a1a] text-white rounded-full px-3 py-1.5 text-[9px] font-bold shadow border border-white/20 text-center uppercase">
                EMPOWER
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full px-3 py-1.5 text-[9px] font-bold shadow border border-white/20 text-center uppercase">
                IMBIBE
              </div>
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full px-3 py-1.5 text-[9px] font-bold shadow border border-white/20 text-center uppercase">
                GLOBAL OUTLOOK
              </div>
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full px-3 py-1.5 text-[9px] font-bold shadow border border-white/20 text-center uppercase">
                VALUES
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            <span className="text-[#f09a1a] text-xs font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full">
              Golden Jubilee Heritage Since 1973
            </span>
            <h2 className="text-2xl md:text-3.5xl font-extrabold uppercase border-b-2 border-[#f09a1a]/80 pb-3">
              ABOUT OUR COLLEGE
            </h2>
            <p className="leading-relaxed text-slate-350 text-sm text-justify">
              COIMBATORE, the fast-growing industrial hub of Kongunadu, had a significant demand for qualitative higher education during the early 1970s. This societal requirement was fulfilled on 12th August 1973, the day on which Kongunadu Arts and Science College commenced its educational legacy.
            </p>
            <p className="leading-relaxed text-slate-350 text-xs text-justify">
              Now operating with complete autonomous status, the college has developed into a premium shrine of systematic learning and scientific research. Garnering the top NAAC Grade and distinguished UGC titles, we prepare local students to become global change-makers.
            </p>
          </div>
          
        </div>
      </div>

      {/* 7. Campus Infrastructure */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[#1e2e6b] text-xs font-bold uppercase tracking-widest block mb-1">
              CAMPUS HIGHLIGHTS
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase">
              STUDENT AMENITIES & LIFE
            </h2>
            <div className="w-12 h-1 bg-[#f09a1a] mx-auto mt-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-xl border border-slate-100 hover:border-[#1e2e6b]/20 bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-[#1e2e6b]/5 flex items-center justify-center border border-[#1e2e6b]/10 mb-4 group-hover:bg-[#1e2e6b] group-hover:text-white transition-colors">
                <Compass className="w-5 h-5 text-[#1e2e6b] group-hover:text-white" />
              </div>
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-2">
                Modern Auditorium
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed text-justify">
                Dr. Marappa G Aruchami Auditorium features state-of-the-art centralization, hi-definition sound, and comfortable seating for over 1200+ candidates.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-100 hover:border-[#1e2e6b]/20 bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-[#1e2e6b]/5 flex items-center justify-center border border-[#1e2e6b]/10 mb-4 group-hover:bg-[#1e2e6b] group-hover:text-white transition-colors">
                <Building className="w-5 h-5 text-[#1e2e6b] group-hover:text-white" />
              </div>
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-2">
                Smart Classrooms
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed text-justify">
                Fully equipped electronic units with projectors, sound arrays, and continuous smart connectivity options promoting innovative dual learning.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-100 hover:border-[#1e2e6b]/20 bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-[#1e2e6b]/5 flex items-center justify-center border border-[#1e2e6b]/10 mb-4 group-hover:bg-[#1e2e6b] group-hover:text-white transition-colors">
                <Globe className="w-5 h-5 text-[#1e2e6b] group-hover:text-white" />
              </div>
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-2">
                Conference Halls
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed text-justify">
                Air-conditioned digital spaces seating 200+ members for workshops, active expert discussions, and daily student council sessions.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-100 hover:border-[#1e2e6b]/20 bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-[#1e2e6b]/5 flex items-center justify-center border border-[#1e2e6b]/10 mb-4 group-hover:bg-[#1e2e6b] group-hover:text-white transition-colors">
                <Users className="w-5 h-5 text-[#1e2e6b] group-hover:text-white" />
              </div>
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-2">
                Cozy Hostels
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed text-justify">
                Comfortable residences fitted with clean kitchenettes, study desks, Hygiene Committee audits, and backup high output solar arrays.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 8. Corporate Institutional Footer */}
      <footer className="bg-[#0c1222] text-white shrink-0 pt-16 border-t-2 border-[#f09a1a]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0">
                <KascLogo className="w-10 h-10" />
              </div>
              <div>
                <span className="font-extrabold tracking-tight text-white block text-sm">KASC Portal</span>
                <span className="text-[10px] text-slate-400 block uppercase">Continuous Excellence Since 1973</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              An autonomous higher learning intuition in Tamil Nadu, India. Providing modern education combined with qualitative traditional values.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-[#f09a1a] text-xs uppercase tracking-widest border-l-2 border-[#f09a1a] pl-2">Key Channels</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-[#f09a1a]" /> Admission Portal 2026
              </p>
              <p className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-[#f09a1a]" /> Autonomous Commission Code
              </p>
              <p className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-[#f09a1a]" /> Examination & Results
              </p>
              <p className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-[#f09a1a]" /> UGC COE Disclosures
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-[#f09a1a] text-xs uppercase tracking-widest border-l-2 border-[#f09a1a] pl-2">Get in touch</h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f09a1a] shrink-0" /> 
                <span>+91 422 2642095 / 2642236</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f09a1a] shrink-0" /> 
                <span>info@kongunaducollege.ac.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#f09a1a] shrink-0" /> 
                <span className="hover:underline cursor-pointer">www.kongunaducollege.ac.in</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-[#f09a1a] text-xs uppercase tracking-widest border-l-2 border-[#f09a1a] pl-2">Support Desk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              For security passcodes, employee keys, or student system mapping challenges, coordinate directly with the Computer Science ERP Desk.
            </p>
          </div>

        </div>

        {/* Traditional Slogan Banner Line */}
        <div className="bg-[#f09a1a] py-3 text-center shadow-inner relative z-10">
          <span className="font-black text-slate-950 tracking-[0.15em] text-xs uppercase block">
            "KNOWLEDGE, CULTURE, HARDWORK"
          </span>
        </div>

        <div className="py-6 text-center text-xs text-slate-400 bg-[#070b16] border-t border-white/5 space-y-1">
          <p>© {new Date().getFullYear()} Kongunadu Arts and Science College (Autonomous). All Rights Reserved.</p>
          <p className="text-slate-500 text-[11px]">Developed and maintained by <span className="text-slate-400 font-semibold">Computer Science ERP Desk</span></p>
        </div>
      </footer>

    </div>
  );
}
