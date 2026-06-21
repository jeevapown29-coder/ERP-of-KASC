import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, Bell, User as UserIcon, Sun, Moon, Search, 
  MapPin, Clock, CalendarDays, BookOpen, Shield, ClipboardList
} from 'lucide-react';

interface SearchItem {
  name: string;
  category: 'Pages & Modules' | 'Staff & Students';
  path: string;
  desc: string;
}

const SEARCH_REGISTRY: SearchItem[] = [
  { name: 'Dashboard Home', category: 'Pages & Modules', path: '/', desc: 'Primary stats, analytics overview, research graphs.' },
  { name: 'Student Management', category: 'Pages & Modules', path: '/students', desc: 'Add, view, or search academic student profiles.' },
  { name: 'Academic Calendar', category: 'Pages & Modules', path: '/academic-calendar', desc: 'Semester exams timelines and course deadlines.' },
  { name: 'Attendance Module', category: 'Pages & Modules', path: '/attendance', desc: 'Live sessions codes, aggregates, and monthly trends.' },
  { name: 'Examination & Board Results', category: 'Pages & Modules', path: '/examination', desc: 'Exams grading sheets, results lists, timetables, and hall tickets.' },
  { name: 'Timetable Schedule', category: 'Pages & Modules', path: '/timetable', desc: 'Class streams, daily lectures, and lab hours.' },
  { name: 'Fee Management', category: 'Pages & Modules', path: '/fees', desc: 'Tuition tracking, transactions ledger, and payments.' },
  { name: 'Sports Management', category: 'Pages & Modules', path: '/sports', desc: 'Athletic selection trials and achievements.' },
  { name: 'Library archives', category: 'Pages & Modules', path: '/library', desc: 'Book catalog search, checkouts, and late penalisation fees.' },
  { name: 'Hostel Services', category: 'Pages & Modules', path: '/hostel', desc: 'Warden allotments, mess tokens, and block safety rules.' },
  { name: 'System Notifications', category: 'Pages & Modules', path: '/notifications', desc: 'College general notifications, SMS logs, and notice board.' },
  { name: 'Reports General', category: 'Pages & Modules', path: '/reports', desc: 'Performance tables, audit logs, and exportable PDFs.' },
  { name: 'My Profile & Settings', category: 'Pages & Modules', path: '/profile', desc: 'Secure profile settings and contact detail adjustments.' },
  // User profiles
  { name: 'John Doe', category: 'Staff & Students', path: '/profile', desc: 'CS Student (ID: #1001) - Attendance aggregate: 88%' },
  { name: 'Arun Kumar', category: 'Staff & Students', path: '/students', desc: 'CS Student Record (Aided Batch A) - Marks 485/500' },
  { name: 'Divya Bharathi', category: 'Staff & Students', path: '/students', desc: 'BCA Scholar (Self-Financed) - High marks candidate' },
  { name: 'Rajesh Khanna', category: 'Staff & Students', path: '/students', desc: 'B.Sc. IT Cadet Officer - Attendance rating: 84%' },
  { name: 'Dr. Sarah (HOD)', category: 'Staff & Students', path: '/profile', desc: 'CS Department Academic Head and Counselor' },
  { name: 'Prof. Faculty', category: 'Staff & Students', path: '/profile', desc: 'Instructing Senior Mentor for Web engineering' },
  { name: 'Dr. Principal', category: 'Staff & Students', path: '/profile', desc: 'Vice-Chancellor Principal Oversight Office' }
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme Switching state (light vs dark vs college)
  const [theme, setTheme] = useState(() => localStorage.getItem('kasc_theme') || 'college');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  
  // Real-time Notifications state (loads from localStorage or sets high-fidelity campus alert seeds)
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; desc: string; type: 'exam' | 'payment' | 'deadline' | 'general'; time: string; read: boolean }>>(() => {
    const saved = localStorage.getItem('kasc_realtime_notifs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif-1',
        title: 'End-Semester Exam Tables Published',
        desc: 'Controller of Examinations has published official June/July 2026 scheduling. Hall Ticket clearance active.',
        type: 'exam',
        time: '15 mins ago',
        read: false
      },
      {
        id: 'notif-2',
        title: 'Tuition Fee Payment Deadline',
        desc: 'Please settle Semester IV pending tuition/lab dues to unlock digital examination portals.',
        type: 'payment',
        time: '2 hours ago',
        read: false
      },
      {
        id: 'notif-3',
        title: 'TCS Placement Registration Open',
        desc: 'Direct recruit drive portal open for B.Sc. Comp Science and BCA scholars. Final deadline June 27.',
        type: 'deadline',
        time: '1 day ago',
        read: false
      },
      {
        id: 'notif-4',
        title: 'Academic Calendar Milestone Updated',
        desc: 'General counseling and internal review marks verified on central security registry ledger.',
        type: 'general',
        time: '3 days ago',
        read: true
      }
    ];
  });
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const searchDropdownRef = useRef<HTMLDivElement | null>(null);
  const themeDropdownRef = useRef<HTMLDivElement | null>(null);
  const notifDropdownRef = useRef<HTMLDivElement | null>(null);

  // Synchronise Theme setup state beautifully
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'college');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'college') {
      document.documentElement.classList.add('college');
    }
    localStorage.setItem('kasc_theme', theme);
  }, [theme]);

  // Persist Live Notifications
  useEffect(() => {
    localStorage.setItem('kasc_realtime_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Click outside listener for all custom floating dropdown panels
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeThemeMode = (mode: 'light' | 'dark' | 'college') => {
    setTheme(mode);
    setThemeDropdownOpen(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredSearchResults = searchQuery.trim() === '' 
    ? [] 
    : SEARCH_REGISTRY.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSelectResult = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setSearchFocused(false);
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-205 z-30 shadow-sm relative transition-all duration-200 header">
      
      {/* Search Input block (takes left-middle portion) */}
      <div className="flex-1 max-w-md relative" ref={searchDropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search student records, module names, pages..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchFocused(true);
            }}
            onFocus={() => setSearchFocused(true)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-905 rounded-xl focus:ring-2 focus:ring-[#1e2e6b]/20 focus:border-[#1e2e6b] dark:focus:border-indigo-505 focus:outline-none transition-all placeholder-slate-400"
          />
        </div>

        {/* Global Search Result Dropdown Menu */}
        {searchFocused && (
          <div className="absolute top-12 left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto p-2 space-y-2">
            {searchQuery.trim() === '' ? (
              <div className="p-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                💡 Try searching "Students", "Attendance", "Calendar", "John Doe", "Sarah", or "Library"
              </div>
            ) : filteredSearchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 italic">
                No matching academic records or pages found.
              </div>
            ) : (
              <div>
                {/* Categorize results */}
                {['Pages & Modules', 'Staff & Students'].map(cat => {
                  const items = filteredSearchResults.filter(x => x.category === cat);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="px-3 py-1.5 text-[9px] font-black uppercase text-[#f09a1a]/80 tracking-widest border-b border-slate-100 dark:border-slate-800/80">
                        {cat}
                      </div>
                      {items.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectResult(item.path)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col transition-colors group"
                        >
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1e2e6b] dark:group-hover:text-indigo-400">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal line-clamp-1">
                            {item.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Right User actions, Theme toggler and Notification badge */}
      <div className="flex items-center gap-4">
        
        {/* Real-time Theme Toggle Dropdown */}
        <div className="relative" ref={themeDropdownRef}>
          <button 
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-none relative"
            title="Switch Application Theme"
          >
            {theme === 'light' && <Sun className="w-5 h-5 text-amber-500" />}
            {theme === 'dark' && <Moon className="w-5 h-5 text-indigo-400" />}
            {theme === 'college' && (
              <span className="font-extrabold text-[#f09a1a] text-xs font-mono bg-[#1e2e6b] px-2 py-1 rounded-md border border-[#f09a1a] shadow-xs flex items-center gap-1">
                🏛️ KASC Brand
              </span>
            )}
          </button>

          {themeDropdownOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <h4 className="text-[10px] font-black uppercase text-[#f09a1a] tracking-wider">Select Canvas Theme</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Toggle default aesthetic skins instantly.</p>
              </div>
              
              <button 
                onClick={() => changeThemeMode('light')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${theme === 'light' ? 'bg-[#1e2e6b]/5 text-[#1e2e6b] dark:text-amber-400' : 'text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <span className="flex items-center gap-2">☀️ Normal Light Mode</span>
                {theme === 'light' && <span className="text-[10px] font-bold">✓</span>}
              </button>

              <button 
                onClick={() => changeThemeMode('dark')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${theme === 'dark' ? 'bg-[#1e2e6b]/5 text-[#1e2e6b] dark:text-amber-400' : 'text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <span className="flex items-center gap-2">🌙 Slate Dark Mode</span>
                {theme === 'dark' && <span className="text-[10px] font-bold">✓</span>}
              </button>

              <button 
                onClick={() => changeThemeMode('college')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${theme === 'college' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <span className="flex items-center gap-2">🏛️ College Branding Theme</span>
                {theme === 'college' && <span className="text-[10px] font-bold">Active</span>}
              </button>
            </div>
          )}
        </div>

        {/* Real-time Interactive Notification Dropdown */}
        <div className="relative" ref={notifDropdownRef}>
          <button 
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative block"
            title="Real-time Announcements & Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 rounded-full flex items-center justify-center text-[8px] font-black text-white px-0.5 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 border border-slate-205 rounded-xl shadow-2xl z-50 p-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
              
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-[#1e2e6b] dark:text-[#f09a1a] tracking-wider leading-none">Security Registry Alerts</h4>
                  <p className="text-[9px] text-slate-400 mt-1">Updates regarding schedules & fee dues.</p>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[9px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                  >
                    Mark All Read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-405 italic">
                  No notifications recorded. All clear!
                </div>
              ) : (
                <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer relative group ${notif.read ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 opacity-60' : 'bg-indigo-50/20 dark:bg-slate-950 border-indigo-100/45 dark:border-slate-800'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none ${
                          notif.type === 'exam' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' :
                          notif.type === 'payment' ? 'bg-rose-105 text-rose-800 dark:bg-rose-950/40 dark:text-rose-450' :
                          notif.type === 'deadline' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400' :
                          'bg-slate-100 text-slate-800 dark:bg-slate-950/40 dark:text-slate-400'
                        }`}>
                          {notif.type}
                        </span>
                        
                        <span className="text-[8px] font-mono text-slate-400 shrink-0">{notif.time}</span>
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5 leading-tight">{notif.title}</h5>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal line-clamp-2">{notif.desc}</p>
                      
                      {/* Swipe button */}
                      <button 
                        onClick={(e) => deleteNotification(notif.id, e)}
                        className="absolute right-2 bottom-2 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                        title="Dismiss Notice"
                      >
                        Dismiss ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-850 text-center">
                <Link 
                  to="/notifications" 
                  onClick={() => setNotifDropdownOpen(false)}
                  className="inline-block text-[10px] font-black uppercase text-[#f09a1a] hover:underline"
                >
                  View All Notifications Box
                </Link>
              </div>

            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-slate-201 dark:border-slate-800 pl-4 h-8">
          <Link to="/profile" className="hidden text-right sm:block hover:underline">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase leading-none mt-0.5">{user?.role}</p>
          </Link>
          
          <Link to="/profile" className="focus:outline-none focus:ring-2 focus:ring-[#1e2e6b]/30 rounded-full">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-9 h-9 rounded-full object-cover border border-[#f09a1a]/30 shadow-xs focus:ring" 
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#f09a1a]/10 dark:bg-slate-800 flex items-center justify-center text-[#1e2e6b] dark:text-[#f09a1a] font-black border border-[#f09a1a]/30 dark:border-slate-700 shadow-sm uppercase select-none text-xs">
                {user?.name.charAt(0)}
              </div>
            )}
          </Link>

          <button 
            onClick={logout}
            className="p-2 ml-1 rounded-xl text-slate-400 hover:bg-rose-50 dark:hover:bg-[#ff0000]/10 hover:text-rose-600 transition-colors"
            title="Log Out From ERP Session"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
