import React from 'react';
import { BookOpen, Search, BookMarked } from 'lucide-react';

export default function Library() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Digital Library</h1>
        <p className="text-slate-500 mt-1">Book inventory, issues, returns, and digital catalog.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
               <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search books by title, author, or ISBN..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-indigo-600/50 outline-none" />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', status: 'Available' },
                  { title: 'Clean Code', author: 'Robert C. Martin', status: 'Checked out' },
                  { title: 'Design Patterns', author: 'Erich Gamma', status: 'Available' },
                  { title: 'Operating System Concepts', author: 'Silberschatz', status: 'Available' },
               ].map((book, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4 hover:border-slate-300 transition-colors cursor-pointer group">
                     <div className="w-12 h-16 bg-indigo-50 rounded flex items-center justify-center border border-indigo-100 flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                        <BookOpen className="w-6 h-6 text-indigo-600 opacity-60" />
                     </div>
                     <div>
                        <h4 className="font-semibold text-slate-900 leading-tight mb-1">{book.title}</h4>
                        <p className="text-xs text-slate-500 mb-2">{book.author}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                           book.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>{book.status}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
               <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-indigo-600" /> My Issued Books
               </h3>
               <div className="space-y-4">
                  <div className="p-4 border border-rose-100 bg-rose-50 rounded-xl">
                     <h4 className="font-medium text-slate-900 text-sm">Computer Networks</h4>
                     <p className="text-xs text-rose-600 mt-1 font-medium">Overdue by 2 days! Fine: ₹20</p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-xl">
                     <h4 className="font-medium text-slate-900 text-sm">Machine Learning</h4>
                     <p className="text-xs text-slate-500 mt-1">Due on 20th Oct</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
