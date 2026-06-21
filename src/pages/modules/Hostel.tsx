import React, { useState } from 'react';
import { Home, Users, CheckCircle, Wrench, Calendar, FileText, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

interface OutpassRequest {
  id: string;
  studentName: string;
  registerNumber: string;
  type: 'Outing' | 'Home';
  leaveDate: string;
  returnDate?: string;
  outTime?: string;
  inTime?: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const MOCK_OUTPASSES: OutpassRequest[] = [
  {
    id: '1',
    studentName: 'Alex Chen',
    registerNumber: 'CS2023001',
    type: 'Home',
    leaveDate: '2023-11-20',
    returnDate: '2023-11-23',
    reason: 'Family function at hometown',
    status: 'Pending'
  },
  {
    id: '2',
    studentName: 'Sarah Smith',
    registerNumber: 'CS2023042',
    type: 'Outing',
    leaveDate: '2023-10-15',
    outTime: '14:00',
    inTime: '18:00',
    reason: 'Medical checkup',
    status: 'Approved'
  }
];

export default function Hostel() {
  const { user } = useAuth();
  const isFaculty = user?.role === Role.FACULTY || user?.role === Role.ADMIN || user?.role === Role.HOD;
  
  const [outpasses, setOutpasses] = useState<OutpassRequest[]>(MOCK_OUTPASSES);

  // Student form state
  const [passType, setPassType] = useState<'Outing' | 'Home'>('Outing');
  const [leaveDate, setLeaveDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [outTime, setOutTime] = useState('');
  const [inTime, setInTime] = useState('');
  const [reason, setReason] = useState('');

  const submitOutpass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDate || !reason) return;
    if (passType === 'Home' && !returnDate) return;
    if (passType === 'Outing' && (!outTime || !inTime)) return;
    
    const newOutpass: OutpassRequest = {
      id: Date.now().toString(),
      studentName: user?.name || 'Current Student',
      registerNumber: user?.id || 'Unknown',
      type: passType,
      leaveDate,
      returnDate: passType === 'Home' ? returnDate : undefined,
      outTime: passType === 'Outing' ? outTime : undefined,
      inTime: passType === 'Outing' ? inTime : undefined,
      reason,
      status: 'Pending'
    };
    
    setOutpasses([newOutpass, ...outpasses]);
    setLeaveDate('');
    setReturnDate('');
    setOutTime('');
    setInTime('');
    setReason('');
    alert('Outpass requested successfully!');
  };

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setOutpasses(outpasses.map(op => 
      op.id === id ? { ...op, status: action } : op
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hostel Management</h1>
        <p className="text-slate-500 mt-1">
          {isFaculty ? "Manage hostel operations, room allocations, and student outpasses." : "Manage your room info, complaints, and outpass requests."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
            { title: 'Room Info', val: 'Block A - 204', icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'Roommates', val: '3 Students', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { title: 'Attendance', val: 'Logged Today', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Complaints', val: '0 Active', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
         ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
               <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-xs text-slate-500 font-medium">{stat.title}</p>
                  <p className="font-semibold text-slate-900">{stat.val}</p>
               </div>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outpass Section */}
        {isFaculty ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">Pending Outpass Requests</h2>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="pb-3 font-medium">Student</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Details</th>
                    <th className="pb-3 font-medium">Reason</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outpasses.map((op) => (
                    <tr key={op.id}>
                      <td className="py-4">
                        <p className="font-medium text-slate-900">{op.studentName}</p>
                        <p className="text-xs text-slate-500">{op.registerNumber}</p>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${op.type === 'Home' ? 'bg-indigo-50 text-indigo-700' : 'bg-fuchsia-50 text-fuchsia-700'}`}>
                           {op.type}
                        </span>
                      </td>
                      <td className="py-4 text-slate-600">
                        {op.type === 'Home' ? (
                           <div className="text-sm">
                             <div className="font-medium">{new Date(op.leaveDate).toLocaleDateString()}</div>
                             <div className="text-xs text-slate-500">to {op.returnDate ? new Date(op.returnDate).toLocaleDateString() : ''}</div>
                           </div>
                        ) : (
                           <div className="text-sm">
                             <div className="font-medium">{new Date(op.leaveDate).toLocaleDateString()}</div>
                             <div className="text-xs text-slate-500">{op.outTime} to {op.inTime}</div>
                           </div>
                        )}
                      </td>
                      <td className="py-4 text-slate-600 truncate max-w-[150px]">{op.reason}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          op.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          op.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {op.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {op.status === 'Pending' ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleAction(op.id, 'Approved')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleAction(op.id, 'Rejected')} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Reject">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {outpasses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">No outpass requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            {/* Student Request Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">Request Outpass</h2>
              </div>
              <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setPassType('Outing')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${passType === 'Outing' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Local Outing
                </button>
                <button 
                  type="button"
                  onClick={() => setPassType('Home')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${passType === 'Home' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Going Home
                </button>
              </div>

              <form onSubmit={submitOutpass} className="space-y-4">
                  {passType === 'Home' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Leave Date</label>
                          <input 
                            type="date" 
                            required
                            value={leaveDate}
                            onChange={(e) => setLeaveDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50" 
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Return Date</label>
                          <input 
                            type="date" 
                            required
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50" 
                          />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Outing Date</label>
                          <input 
                            type="date" 
                            required
                            value={leaveDate}
                            onChange={(e) => setLeaveDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50" 
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Out Time</label>
                            <input 
                              type="time" 
                              required
                              value={outTime}
                              onChange={(e) => setOutTime(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">In Time</label>
                            <input 
                              type="time" 
                              required
                              value={inTime}
                              onChange={(e) => setInTime(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50" 
                            />
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Leave</label>
                    <textarea 
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3} 
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50" 
                      placeholder="Please specify your reason clearly..."
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white rounded-xl shadow-sm text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Submit Request
                  </button>
              </form>
            </div>

            {/* Student Previous Requests */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">My Outpasses</h2>
              <div className="flex-1 overflow-y-auto space-y-3">
                {outpasses.filter(op => op.studentName === (user?.name || 'Current Student') || op.studentName === 'Alex Chen').map((op) => (
                  <div key={op.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${op.type === 'Home' ? 'bg-indigo-50 text-indigo-700' : 'bg-fuchsia-50 text-fuchsia-700'}`}>
                            {op.type}
                          </span>
                        </div>
                        {op.type === 'Home' ? (
                          <p className="text-sm font-medium text-slate-900">{new Date(op.leaveDate).toLocaleDateString()} to {op.returnDate ? new Date(op.returnDate).toLocaleDateString() : ''}</p>
                        ) : (
                          <p className="text-sm font-medium text-slate-900">{new Date(op.leaveDate).toLocaleDateString()} | {op.outTime} - {op.inTime}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">{op.reason}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          op.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          op.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {op.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Maintenance Complaint - Shown for all, moved to bottom */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 col-span-1 lg:col-span-2">
           <div className="flex items-center gap-2 mb-4">
             <Wrench className="w-5 h-5 text-slate-600" />
             <h2 className="text-lg font-semibold text-slate-900">Register a Maintenance Complaint</h2>
           </div>
           
           <form className="space-y-4 max-w-2xl">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Issue Type</label>
                 <select className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/50">
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>Carpentry</option>
                    <option>Other</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                 <textarea rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/50" placeholder="Describe the issue..."></textarea>
              </div>
              <button type="button" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-sm text-sm font-medium hover:bg-slate-800 transition-colors">
                 Submit Complaint
              </button>
           </form>
        </div>
      </div>
    </div>
  );
}
