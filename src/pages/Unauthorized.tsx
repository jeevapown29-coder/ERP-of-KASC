import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, ArrowLeft, Home, UserCheck } from 'lucide-react';

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-slate-800">
      <div className="w-full max-w-md bg-white rounded-lg border-t-4 border-rose-600 border-x border-b border-slate-200 shadow-lg p-8 text-center space-y-6">
        
        {/* Security Alert Badge */}
        <div className="mx-auto w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-9 h-9" />
        </div>

        {/* Notice Info */}
        <div className="space-y-2">
          <span className="text-[10px] font-black tracking-widest text-rose-600 bg-rose-55 rounded px-2.5 py-1 uppercase">
            Security Clearance Restricted
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Access Denied</h1>
          <p className="text-slate-500 text-xs leading-relaxed">
            Your current account credentials lack permission clearances required to enter this module of the KASC ERP Portal.
          </p>
        </div>

        {/* Current Credentials Debug Block */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left text-xs space-y-2 font-semibold">
          <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200 pb-1.5 mb-1">
            <span>Authentication Holder</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <UserCheck className="w-3 h-3" /> Secure Session
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Name:</span>
            <span className="text-slate-800 font-extrabold">{user?.name || 'Guest Cadet'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Role Code:</span>
            <span className="text-rose-600 font-mono font-black uppercase text-[10px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
              {user?.role || 'Unassigned'}
            </span>
          </div>
        </div>

        {/* Helpful actions */}
        <div className="flex flex-col gap-2 pt-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1e2e6b] hover:bg-[#132150] text-[#f09a1a] hover:text-white rounded-lg shadow-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <p className="text-[10px] text-slate-405 italic">
            Confused? Please contact your HOD or administrative desk to update your ERP Security role indexes.
          </p>
        </div>

      </div>
    </div>
  );
}
