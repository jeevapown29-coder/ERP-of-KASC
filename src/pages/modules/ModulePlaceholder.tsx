import React from 'react';
import { useLocation } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function ModulePlaceholder() {
  const location = useLocation();
  const moduleName = location.pathname.split('/').filter(Boolean)[0] || 'Module';
  const formattedName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

  return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="text-center p-8 bg-white border border-slate-200 rounded-3xl shadow-sm max-w-md w-full">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          {formattedName} Module
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          This academic operational module is currently under development. Its features will be populated according to the RBAC authorization matrices.
        </p>
        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer">
          Go Back
        </button>
      </div>
    </div>
  );
}
