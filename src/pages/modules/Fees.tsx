import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { DollarSign, Download, AlertCircle } from 'lucide-react';

export default function Fees() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fee Management</h1>
        <p className="text-slate-500 mt-1">Manage semester fees, status, and generate receipts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-md">
            <h3 className="font-medium text-indigo-100 mb-1">Total Fee Due</h3>
            <div className="text-4xl font-bold mb-4 tracking-tight">₹45,000</div>
            <p className="text-sm text-indigo-200">For Semester 4 (Current)</p>
         </div>
         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
            <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
            <span className="font-semibold text-slate-900">Due Date Approaching</span>
            <span className="text-sm text-slate-500 mt-1">Pay by 15th Aug 2026</span>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Fee History</h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                     <th className="px-6 py-4">Semester</th>
                     <th className="px-6 py-4">Amount</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Receipt</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                  <tr>
                     <td className="px-6 py-4 font-medium text-slate-900">Semester 4</td>
                     <td className="px-6 py-4">₹45,000</td>
                     <td className="px-6 py-4"><span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Pending</span></td>
                     <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 font-medium hover:underline w-full sm:w-auto">Pay Now</button>
                     </td>
                  </tr>
                  <tr>
                     <td className="px-6 py-4 font-medium text-slate-900">Semester 3</td>
                     <td className="px-6 py-4">₹45,000</td>
                     <td className="px-6 py-4"><span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">Paid</span></td>
                     <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors">
                           <Download className="w-4 h-4" /> Download
                        </button>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
