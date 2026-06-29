import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Legend, PieChart, Cell, Pie
} from 'recharts';
import { 
  TrendingUp, DollarSign, GraduationCap, Calendar, Users, 
  CheckCircle2, AlertCircle, Filter, BarChart3, PieChart as PieIcon, Activity, Percent
} from 'lucide-react';

// Mock Data for Analytics
const departmentData = [
  { dept: 'Computer Science', attendance: 92.4, passRate: 88.5, collectedFee: 4200000, pendingFee: 800000, students: 620 },
  { dept: 'Commerce', attendance: 94.1, passRate: 91.2, collectedFee: 5100000, pendingFee: 450000, students: 850 },
  { dept: 'Management', attendance: 89.8, passRate: 85.0, collectedFee: 3200000, pendingFee: 950000, students: 480 },
  { dept: 'Basic Sciences', attendance: 91.5, passRate: 89.1, collectedFee: 2800000, pendingFee: 500000, students: 390 },
  { dept: 'Humanities', attendance: 93.2, passRate: 92.8, collectedFee: 1800000, pendingFee: 200000, students: 260 },
];

const dailyAttendanceTrend = [
  { day: 'Mon', Aided: 94, SelfFinance: 91, overall: 92.5 },
  { day: 'Tue', Aided: 96, SelfFinance: 93, overall: 94.5 },
  { day: 'Wed', Aided: 91, SelfFinance: 88, overall: 89.5 },
  { day: 'Thu', Aided: 95, SelfFinance: 92, overall: 93.5 },
  { day: 'Fri', Aided: 93, SelfFinance: 90, overall: 91.5 },
];

const examPerformanceTrend = [
  { semester: 'Sem 1', IA1: 72, IA2: 78, EndSem: 81 },
  { semester: 'Sem 2', IA1: 75, IA2: 81, EndSem: 84 },
  { semester: 'Sem 3', IA1: 71, IA2: 79, EndSem: 83 },
  { semester: 'Sem 4', IA1: 78, IA2: 84, EndSem: 87 },
];

const feeStatusDistribution = [
  { name: 'Collected Fees', value: 17100000, color: '#1e2e6b' }, // Theme Navy Blue
  { name: 'Pending Dues', value: 2900000, color: '#f09a1a' },   // Theme Amber Orange
];

export default function DashboardAnalytics() {
  const [activeTab, setActiveTab] = useState<'all' | 'attendance' | 'exams' | 'fees'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');

  // Filter department statistics based on selected dropdown
  const filteredDeptData = selectedDept === 'All Departments' 
    ? departmentData 
    : departmentData.filter(d => d.dept === selectedDept);

  const totalCollected = departmentData.reduce((acc, curr) => acc + curr.collectedFee, 0);
  const totalPending = departmentData.reduce((acc, curr) => acc + curr.pendingFee, 0);
  const totalTarget = totalCollected + totalPending;
  const collectionPercentage = ((totalCollected / totalTarget) * 100).toFixed(1);

  const averageAttendance = (departmentData.reduce((acc, curr) => acc + curr.attendance, 0) / departmentData.length).toFixed(1);
  const averagePassRate = (departmentData.reduce((acc, curr) => acc + curr.passRate, 0) / departmentData.length).toFixed(1);

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#1e2e6b]/10 text-[#1e2e6b] rounded-lg">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              College Performance & Operations Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time interactive graphs visualizing key educational performance indexes and fee compliance.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Tab Selectors */}
          <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 shadow-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'all' 
                  ? 'bg-[#1e2e6b] text-white' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'attendance' 
                  ? 'bg-[#1e2e6b] text-white' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'exams' 
                  ? 'bg-[#1e2e6b] text-white' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Exam Pass Rates
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'fees' 
                  ? 'bg-[#1e2e6b] text-white' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Fee Receipts
            </button>
          </div>

          {/* Department Dropdown Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent border-none focus:outline-hidden cursor-pointer"
            >
              <option value="All Departments">All Departments</option>
              {departmentData.map(d => (
                <option key={d.dept} value={d.dept}>{d.dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average Attendance</p>
            <p className="text-xl font-black text-slate-800">{averageAttendance}%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Exam Pass Rate</p>
            <p className="text-xl font-black text-slate-800">{averagePassRate}%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Fee Receipts</p>
            <p className="text-xl font-black text-slate-800">₹{(totalCollected / 1000000).toFixed(1)}M</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fee Collection Ratio</p>
            <p className="text-xl font-black text-slate-800">{collectionPercentage}%</p>
          </div>
        </div>
      </div>

      {/* Warning/Insight Banner if selected department attendance is low */}
      {selectedDept !== 'All Departments' && (departmentData.find(d => d.dept === selectedDept)?.attendance ?? 100) < 91 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#f09a1a] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Low Attendance Threshold Alert</h4>
            <p className="text-xs text-slate-600 mt-1">
              The attendance rate for <strong>{selectedDept}</strong> ({departmentData.find(d => d.dept === selectedDept)?.attendance}%) is currently below the target threshold of 91%. Academic coordinators are advised to send automated alerts to parents.
            </p>
          </div>
        </div>
      )}

      {/* Main Charts Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. ATTENDANCE RATE OVERVIEWS */}
        {(activeTab === 'all' || activeTab === 'attendance') && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1e2e6b]" />
                    Weekly Attendance Trends
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dual-stream comparison (Aided vs Self-Financing %)</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold font-mono">
                  Target: 75% Min
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyAttendanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAided" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e2e6b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#1e2e6b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSelf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f09a1a" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f09a1a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', pt: 10 }} />
                    <Area type="monotone" name="Aided Stream" dataKey="Aided" stroke="#1e2e6b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAided)" />
                    <Area type="monotone" name="Self-Finance" dataKey="SelfFinance" stroke="#f09a1a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSelf)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-500">
              <span>Overall campus presence average holds healthy at <strong>92.0%</strong></span>
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Compliance
              </span>
            </div>
          </div>
        )}

        {/* 2. EXAM PERFORMANCE OVERVIEW */}
        {(activeTab === 'all' || activeTab === 'exams') && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f09a1a]" />
                    Semester-Wise Grade Progress
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Average score percentage of major college exams</p>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold">
                  UG & PG
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={examPerformanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="semester" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', pt: 10 }} />
                    <Line type="monotone" name="Internal Assess 1" dataKey="IA1" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Internal Assess 2" dataKey="IA2" stroke="#f09a1a" strokeWidth={2} />
                    <Line type="monotone" name="Semester Final Exam" dataKey="EndSem" stroke="#1e2e6b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-500">
              <span>Noticeable <strong>+6% grade increase</strong> in Sem 4 final examinations</span>
              <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                <GraduationCap className="w-3.5 h-3.5" /> High Accomplishment
              </span>
            </div>
          </div>
        )}

        {/* 3. FEE COLLECTION BY DEPARTMENT (BARS) */}
        {(activeTab === 'all' || activeTab === 'fees') && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    Fee Breakdown by department
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Fees collected vs outstanding balances per department (INR)</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                  Active Academic Year
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredDeptData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="dept" tick={{ fontSize: 9, fontWeight: 500, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend iconType="square" wrapperStyle={{ fontSize: '11px', pt: 10 }} />
                    <Bar name="Collected Fees" dataKey="collectedFee" fill="#1e2e6b" stackId="fee" radius={[0, 0, 0, 0]} />
                    <Bar name="Pending Balance" dataKey="pendingFee" fill="#f09a1a" stackId="fee" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-500">
              <span>Overall campus pending collections are well under <strong>15% limit</strong></span>
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Accuracy
              </span>
            </div>
          </div>
        )}

        {/* 4. TOTAL FEE STATUS SPLIT (PIE) */}
        {(activeTab === 'all' || activeTab === 'fees') && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Total Collection Compliance Ratio
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Graphical distribution of campus ledger balances</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                  Total Ledger: ₹20M
                </span>
              </div>

              <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="h-48 w-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={feeStatusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {feeStatusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-800">{collectionPercentage}%</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Paid Rate</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 justify-center text-xs">
                  {feeStatusDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="font-semibold text-slate-700">{item.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">₹{item.value.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-500">
              <span>Audited financial standings verified by KASC treasury system.</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
