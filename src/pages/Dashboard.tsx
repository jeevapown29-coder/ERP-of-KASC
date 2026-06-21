import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import AISuggestionsModule from '../components/AISuggestionsModule';
import { 
  Users, CheckCircle, Clock, BookOpen, AlertCircle, FileText, Download, CalendarDays 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();

  const handleExport = () => {
    if (!user) return;
    const csvContent = "data:text/csv;charset=utf-8,Name,Role,Status\n" + `${user.name},${user.role},Active`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KASC_${user.role}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-1">Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/academic-calendar"
            className="flex items-center gap-2 px-4 py-2 bg-[#1e2e6b] text-white shadow-sm rounded-xl text-sm font-semibold hover:bg-[#132150] transition-all"
          >
            <CalendarDays className="w-4 h-4 text-[#f09a1a]" />
            Academic Calendar
          </Link>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {user.role === Role.ADMIN && <AdminDashboard />}
      {user.role === Role.STUDENT && <StudentDashboard />}
      {user.role === Role.FACULTY && <FacultyDashboard />}
      {user.role === Role.PRINCIPAL && <PrincipalDashboard />}
      {user.role === Role.HOD && <HODDashboard />}
      {user.role === Role.PARENT && <ParentDashboard />}
      {user.role === Role.LIBRARIAN && <LibrarianDashboard />}
      {user.role === Role.HOSTEL_WARDEN && <WardenDashboard />}
      {user.role === Role.ACCOUNTANT && <AccountantDashboard />}
      {user.role === Role.SPORTS_COORDINATOR && <SportsCoordinatorDashboard />}

      <div className="pt-4">
        <AISuggestionsModule />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#f09a1a]" />
      <div className="flex items-center justify-between mb-4 pl-2">
        <h3 className="font-medium text-slate-500 text-sm uppercase tracking-wider">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-[#1e2e6b]/5 flex items-center justify-center border border-[#1e2e6b]/10 group-hover:bg-[#1e2e6b] group-hover:text-white transition-colors">
          <Icon className="w-5 h-5 text-[#1e2e6b] group-hover:text-white transition-colors" />
        </div>
      </div>
      <div className="flex items-baseline gap-2 pl-2">
        <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
        {trend && <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend}
        </span>}
      </div>
    </div>
  );
}

const attendanceData = [
  { name: 'Mon', value: 92 },
  { name: 'Tue', value: 95 },
  { name: 'Wed', value: 89 },
  { name: 'Thu', value: 94 },
  { name: 'Fri', value: 91 },
];

interface AdmissionApplicant {
  applicationNo: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  course: string;
  marks: string;
  guardian: string;
  status: string;
  appliedAt: string;
}

function AdminDashboard() {
  const [admissions, setAdmissions] = useState<AdmissionApplicant[]>([]);

  useEffect(() => {
    const existing = localStorage.getItem('kasc_admissions');
    if (existing) {
      setAdmissions(JSON.parse(existing));
    } else {
      // Seed with some nice sample data so it's not empty, but can be cleared / appended to
      const seeds: AdmissionApplicant[] = [
        {
          applicationNo: 'KASC-2026-78421',
          name: 'Arun Kumar S',
          email: 'arunkumar78@gmail.com',
          phone: '+91 98451 22354',
          dob: '2008-05-14',
          gender: 'Male',
          course: 'B.Sc. Computer Science (Aided)',
          marks: '92.4',
          guardian: 'Sivakumar K',
          status: 'PR_VERIFIED_PENDING',
          appliedAt: new Date(Date.now() - 3600000 * 48).toISOString()
        },
        {
          applicationNo: 'KASC-2026-10552',
          name: 'Divya Bharathi R',
          email: 'divya.b@outlook.com',
          phone: '+91 81223 90543',
          dob: '2008-09-22',
          gender: 'Female',
          course: 'B.Sc. CS with Data Analytics',
          marks: '89.5',
          guardian: 'Ramakrishnan P',
          status: 'PR_VERIFIED_PENDING',
          appliedAt: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];
      localStorage.setItem('kasc_admissions', JSON.stringify(seeds));
      setAdmissions(seeds);
    }
  }, []);

  const handleApprove = (appNo: string) => {
    const updated = admissions.map(app => {
      if (app.applicationNo === appNo) {
        return { ...app, status: 'APPROVED' };
      }
      return app;
    });
    localStorage.setItem('kasc_admissions', JSON.stringify(updated));
    setAdmissions(updated);
  };

  const handleReject = (appNo: string) => {
    const updated = admissions.map(app => {
      if (app.applicationNo === appNo) {
        return { ...app, status: 'REJECTED' };
      }
      return app;
    });
    localStorage.setItem('kasc_admissions', JSON.stringify(updated));
    setAdmissions(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="4,250" icon={Users} trend="+12 this month" />
        <StatCard title="Total Faculty" value="312" icon={BookOpen} trend="+2 this month" />
        <StatCard title="Average Attendance" value="92.4%" icon={CheckCircle} trend="-0.5%" />
        <StatCard title="Admissions Submitted" value={admissions.length.toString()} icon={FileText} trend="HSC Stream" />
      </div>

      {/* Admissions Management Panel */}
      <div className="bg-white rounded-sm border-t-2 border-[#1e2e6b] border-x border-b border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f09a1a]" />
              Admission Registration Dashboard 2026
            </h3>
            <p className="text-xs text-slate-500 mt-1">Real-time incoming college applications submitted via the portal.</p>
          </div>
          <span className="bg-[#1e2e6b]/5 text-[#1e2e6b] border border-[#1e2e6b]/10 px-3 py-1 rounded-full text-[11px] font-bold">
            {admissions.filter(a => a.status === 'PR_VERIFIED_PENDING').length} Pending Review
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-3">Application No</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Course / stream</th>
                <th className="p-3 text-center">HSC Mark %</th>
                <th className="p-3">Guardian</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {admissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic font-medium">
                    No applications registered yet. Submit a new form from college login stage!
                  </td>
                </tr>
              ) : (
                admissions.map(app => (
                  <tr key={app.applicationNo} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#1e2e6b]">{app.applicationNo}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-bold text-slate-800">{app.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{app.email} • {app.phone}</p>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{app.course}</td>
                    <td className="p-3 text-center font-extrabold text-amber-600 bg-amber-500/5">{app.marks}%</td>
                    <td className="p-3 text-slate-500">{app.guardian}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                        app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {app.status === 'PR_VERIFIED_PENDING' ? 'PENDING' : app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {app.status === 'PR_VERIFIED_PENDING' ? (
                        <>
                          <button
                            onClick={() => handleReject(app.applicationNo)}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-2 py-1 rounded text-[10px] font-semibold transition-all border border-rose-200"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(app.applicationNo)}
                            className="bg-emerald-600 text-white hover:bg-emerald-700 px-2.5 py-1 rounded text-[10px] font-semibold transition-all shadow-xs"
                          >
                            Approve
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold italic">PROCESSED</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-sm border-t-2 border-[#1e2e6b] border-x border-b border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Weekly Attendance Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#1e2e6b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border-t-2 border-[#f09a1a] border-x border-b border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Recent Alerts</h3>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">Automated Maintenance Alert</h4>
                  <p className="text-xs text-slate-500 mt-1">Hostel Block B requires water tank inspection. Reported 2 hours ago.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="My Attendance" value="88.5%" icon={CheckCircle} trend="Requires 75%" />
        <StatCard title="Upcoming Exams" value="2" icon={FileText} trend="In 14 days" />
        <StatCard title="Pending Assignments" value="3" icon={Clock} trend="Due this week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-sm border-t-2 border-[#1e2e6b] border-x border-b border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Today's Classes</h3>
          <div className="space-y-4">
            {[
              { time: '09:00 AM', subject: 'Data Structures', room: 'Lab 4' },
              { time: '11:15 AM', subject: 'Discrete Mathematics', room: 'Hall 201' },
              { time: '02:00 PM', subject: 'Web Technologies', room: 'Lab 2' },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="w-16 text-center text-xs font-bold text-[#1e2e6b] bg-[#1e2e6b]/10 py-1.5 rounded">
                    {c.time.split(' ')[0]}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{c.subject}</h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {c.room}
                    </span>
                  </div>
                </div>
                <button className="text-sm border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-white bg-slate-50 font-medium">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border-t-2 border-[#f09a1a] border-x border-b border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Academic Performance</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { sem: 'Sem 1', cgpa: 8.2 },
                { sem: 'Sem 2', cgpa: 8.5 },
                { sem: 'Sem 3', cgpa: 8.3 },
                { sem: 'Sem 4', cgpa: 8.7 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="sem" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="cgpa" stroke="#f09a1a" strokeWidth={3} dot={{r: 4, fill: '#f09a1a', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacultyDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Classes Today" value="4" icon={BookOpen} />
        <StatCard title="Pending Evaluations" value="42" icon={FileText} trend="Assignments" />
        <StatCard title="OD Requests" value="5" icon={AlertCircle} trend="Requires Approval" />
      </div>

      <div className="bg-white p-6 rounded-sm border-t-2 border-[#1e2e6b] border-x border-b border-slate-200 shadow-sm">
         <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">My Schedule</h3>
         <div className="space-y-4">
            {[
              { time: '09:00 AM', subject: 'Data Structures - Section A', status: 'Upcoming' },
              { time: '11:15 AM', subject: 'Data Structures - Section B', status: 'Upcoming' },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="w-20 text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 py-1.5 rounded">
                    {c.time}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{c.subject}</h4>
                    <span className="text-xs text-slate-500 mt-1 block">Log Attendance actively</span>
                  </div>
                </div>
                <button className="text-sm bg-[#1e2e6b] text-white px-4 py-2 rounded hover:bg-opacity-90 font-medium shadow-sm transition-all">
                  Mark Attendance
                </button>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

function PrincipalDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Enrollment" value="4,250" icon={Users} trend="+50 this year" />
        <StatCard title="Faculty Count" value="312" icon={BookOpen} trend="98% present" />
        <StatCard title="Overall Attendance" value="92.4%" icon={CheckCircle} />
        <StatCard title="OD Requests" value="12" icon={AlertCircle} trend="Requires Final Approval" />
      </div>
      <div className="bg-white p-6 rounded-sm border-t-2 border-[#f09a1a] border-x border-b border-slate-200 shadow-sm text-center py-12">
         <h3 className="text-xl font-bold tracking-widest text-[#1e2e6b] uppercase mb-2">Principal Command Center</h3>
         <p className="text-slate-500">Overview of all departmental analytics, academic performance summaries, and final authority approvals.</p>
      </div>
    </div>
  );
}

function HODDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Dept Students" value="450" icon={Users} />
        <StatCard title="Dept Attendance" value="91.2%" icon={CheckCircle} />
        <StatCard title="Pending Approvals" value="8" icon={AlertCircle} trend="Leave / OD" />
      </div>
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm text-center py-12 border-t-2 border-[#1e2e6b]">
         <h3 className="text-xl font-bold tracking-widest text-[#1e2e6b] uppercase mb-2">Department Overview</h3>
         <p className="text-slate-500">Monitor faculty workload, department-specific attendance logs, and internal assessment standings.</p>
      </div>
    </div>
  );
}

function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Ward Attendance" value="88.5%" icon={CheckCircle} trend="Satisfactory" />
        <StatCard title="Upcoming Fees" value="₹45k" icon={FileText} trend="Due next month" />
        <StatCard title="Latest Result" value="8.5 GPA" icon={BookOpen} trend="Sem 3" />
      </div>
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm text-center py-12 border-t-2 border-[#1e2e6b]">
         <h3 className="text-xl font-bold tracking-widest text-[#1e2e6b] uppercase mb-2">Parent Portal connected to John Doe</h3>
         <p className="text-slate-500">Track your ward's daily attendance, academic progress, and manage semester fee payments securely.</p>
      </div>
    </div>
  );
}

function LibrarianDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Books" value="12,500" icon={BookOpen} />
        <StatCard title="Currently Issued" value="450" icon={Users} />
        <StatCard title="Overdue Fines" value="₹2,400" icon={AlertCircle} trend="Uncollected" />
      </div>
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm text-center py-12 border-t-2 border-[#1e2e6b]">
         <h3 className="text-xl font-bold tracking-widest text-[#1e2e6b] uppercase mb-2">Library Operations</h3>
         <p className="text-slate-500">Manage book inventory, scan codes for issues/returns, and oversee digital catalog access.</p>
      </div>
    </div>
  );
}

function WardenDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Rooms Occupied" value="280/300" icon={CheckCircle} />
        <StatCard title="Present Today" value="820" icon={Users} trend="Hostel Attendance" />
        <StatCard title="Open Complaints" value="5" icon={AlertCircle} trend="Maintenance" />
      </div>
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm text-center py-12 border-t-2 border-[#1e2e6b]">
         <h3 className="text-xl font-bold tracking-widest text-[#1e2e6b] uppercase mb-2">Hostel Administration</h3>
         <p className="text-slate-500">Review nightly attendance, resolve structural complaints, and allocate rooms to new admissions.</p>
      </div>
    </div>
  );
}

function AccountantDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Fees Collected" value="₹12.5M" icon={CheckCircle} trend="Sem 4" />
        <StatCard title="Pending Dues" value="₹1.2M" icon={AlertCircle} trend="Across all depts" />
        <StatCard title="Receipts Gen" value="340" icon={FileText} trend="Today" />
      </div>
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm text-center py-12 border-t-2 border-[#1e2e6b]">
         <h3 className="text-xl font-bold tracking-widest text-[#1e2e6b] uppercase mb-2">Financial Desk</h3>
         <p className="text-slate-500">Reconcile fee payments, track defaulters, and generate consolidated end-of-day financial reports.</p>
      </div>
    </div>
  );
}

function SportsCoordinatorDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Tourneys" value="3" icon={AlertCircle} />
        <StatCard title="OD Requests" value="24" icon={CheckCircle} trend="Pending Review" />
        <StatCard title="Total Medals" value="18" icon={Users} trend="This academic year" />
      </div>
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm text-center py-12 border-t-2 border-[#1e2e6b]">
         <h3 className="text-xl font-bold tracking-widest text-[#1e2e6b] uppercase mb-2">Sports & Athletics Setup</h3>
         <p className="text-slate-500">Manage ongoing tournament registrations, approve On-Duty requests (Step 1), and track college achievements.</p>
      </div>
    </div>
  );
}
