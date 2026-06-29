import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { KascLogo } from '../KascLogo';
import { 
  LayoutDashboard, Users, Calendar, FileText, 
  CreditCard, Trophy, BookOpen, Home, Bell, Clock, PieChart,
  CalendarDays, UserCheck, User as UserIcon, Award, Briefcase, GraduationCap
} from 'lucide-react';
import { Role } from '../../types';

const allNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: Object.values(Role) },
  { id: 'smart-classroom', label: 'Google Classroom', icon: GraduationCap, path: '/smart-classroom', roles: Object.values(Role) },
  { id: 'profile', label: 'My Profile', icon: UserIcon, path: '/profile', roles: Object.values(Role) },
  { id: 'students', label: 'Student Mgmt', icon: Users, path: '/students', roles: [Role.ADMIN, Role.PRINCIPAL, Role.HOD, Role.FACULTY] },
  { id: 'academic-calendar', label: 'Academic Calendar', icon: CalendarDays, path: '/academic-calendar', roles: Object.values(Role) },
  { id: 'placement', label: 'Placement Cell', icon: Briefcase, path: '/placement', roles: Object.values(Role) },
  { id: 'attendance', label: 'Attendance', icon: UserCheck, path: '/attendance', roles: [Role.ADMIN, Role.HOD, Role.FACULTY, Role.STUDENT, Role.PARENT] },
  { id: 'examination', label: 'Examination Cell', icon: Award, path: '/examination', roles: Object.values(Role) },
  { id: 'timetable', label: 'Timetable', icon: Clock, path: '/timetable', roles: Object.values(Role) },
  { id: 'fees', label: 'Fee Management', icon: CreditCard, path: '/fees', roles: [Role.ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT] },
  { id: 'sports', label: 'Sports Mgmt', icon: Trophy, path: '/sports', roles: [Role.ADMIN, Role.SPORTS_COORDINATOR, Role.STUDENT] },
  { id: 'library', label: 'Library', icon: BookOpen, path: '/library', roles: [Role.ADMIN, Role.LIBRARIAN, Role.STUDENT, Role.FACULTY] },
  { id: 'hostel', label: 'Hostel', icon: Home, path: '/hostel', roles: [Role.ADMIN, Role.HOSTEL_WARDEN, Role.STUDENT] },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications', roles: Object.values(Role) },
  { id: 'reports', label: 'Reports', icon: PieChart, path: '/reports', roles: [Role.ADMIN, Role.PRINCIPAL, Role.HOD] },
  { id: 'certificates', label: 'Certificates', icon: Award, path: '/certificates', roles: Object.values(Role) },
];

export default function Sidebar() {
  const { user } = useAuth();
  
  const navItems = allNavItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="w-64 flex flex-col bg-[#1e2e6b] h-full border-r border-[#1a2759] transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-[#1a2759] bg-[#172352]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0">
             <KascLogo className="w-10 h-10" />
          </div>
          <span className="text-xl font-bold text-white tracking-widest text-sm uppercase">KASC ERP</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            (item as any).isExternal ? (
              <a
                key={item.id}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </a>
            ) : (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-[#f09a1a] text-white shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            )
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-[#1a2759]">
        <div className="bg-white/5 rounded-xl p-4 text-sm text-[#f09a1a]">
          <p className="font-medium text-white mb-1">Need help?</p>
          <p className="opacity-80">Contact IT Support at support@kascerp.edu</p>
        </div>
      </div>
    </div>
  );
}
