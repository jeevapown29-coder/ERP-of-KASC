import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { Camera, Upload, AlertCircle, CheckCircle, User as UserIcon, Mail, Shield, UserCheck, RefreshCw, X } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [phone, setPhone] = useState(() => localStorage.getItem(`kasc_phone_${user?.id}`) || '');
  const [bio, setBio] = useState(() => localStorage.getItem(`kasc_bio_${user?.id}`) || '');
  const [dept, setDept] = useState(() => localStorage.getItem(`kasc_dept_${user?.id}`) || 'Computer Science');
  
  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Status feedback
  const [successMsg, setSuccessMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync avatar picture
  useEffect(() => {
    if (user) {
      // Save details to localStorage on update
      localStorage.setItem(`kasc_phone_${user.id}`, phone);
      localStorage.setItem(`kasc_bio_${user.id}`, bio);
      localStorage.setItem(`kasc_dept_${user.id}`, dept);
    }
  }, [phone, bio, dept, user?.id]);

  // Handle stream cleanup
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Start back-facing or front-facing camera
  const startCamera = async () => {
    setCameraError('');
    setCameraActive(true);
    try {
      const constraints = {
        video: { width: 320, height: 320, facingMode: "user" }
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(err => {
          console.error("Video play failed:", err);
        });
      }
    } catch (err: any) {
      console.error(err);
      setCameraError('Unable to open camera stream. Please check permissions or upload a file directly.');
      setCameraActive(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Capture frame from active video block
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 300;
        canvas.height = 300;
        
        // Draw centered square frame from video stream
        const size = Math.min(video.videoWidth, video.videoHeight);
        const xOffset = (video.videoWidth - size) / 2;
        const yOffset = (video.videoHeight - size) / 2;
        
        ctx.drawImage(video, xOffset, yOffset, size, size, 0, 0, 300, 300);
        
        // Convert to base64 encoding and set avatar
        const base64Image = canvas.toDataURL('image/jpeg');
        updateUser({ avatar: base64Image });
        
        // Finalize camera status
        stopCamera();
        flashSuccess('Profile picture captured via camera!');
      }
    }
  };

  // Helper trigger message
  const flashSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Process selected file
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files (JPEG, PNG) are permitted.');
      return;
    }
    
    // Max 2MB limit to safeguard localStorage weight
    if (file.size > 2 * 1024 * 1024) {
      alert('Selected image size exceeds the 2MB safeguard limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        updateUser({ avatar: result });
        flashSuccess('Profile photo uploaded and updated successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // File Select handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Drag and Drop helpers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearProfilePicture = () => {
    if (window.confirm('Delete your customized profile picture back to initials?')) {
      updateUser({ avatar: undefined });
      flashSuccess('Profile picture cleared.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <UserIcon className="w-7 h-7 text-[#1e2e6b] dark:text-[#f09a1a]" />
          My Profile & Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal university identity, credentials, and custom profile picture.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs p-4 rounded-xl font-bold flex items-center gap-2 shadow-xs transition-all">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar management block */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center space-y-6 shadow-sm">
          <div className="relative group">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile photo" 
                className="w-36 h-36 rounded-full object-cover border-4 border-white dark:border-slate-800 outline outline-2 outline-[#1e2e6b]/30 shadow-md group-hover:brightness-95 transition-all" 
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-[#1e2e6b]/5 dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#1e2e6b] dark:text-[#f09a1a] text-4xl font-extrabold shadow-sm uppercase select-none">
                {user?.name.charAt(0)}
              </div>
            )}
            
            {user?.avatar && user.role === Role.ADMIN && (
              <button 
                onClick={clearProfilePicture}
                className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-sm hover:scale-105 transition-all"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">{user?.name}</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1e2e6b]/5 dark:bg-[#1e2e6b]/20 border border-[#1e2e6b]/15 text-[#1e2e6b] dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">
              <Shield className="w-3 h-3" />
              {user?.role}
            </span>
          </div>

          {/* Picture upload selector layout */}
          {user?.role === Role.ADMIN ? (
            <div className="w-full space-y-3">
              {/* Camera Switch Panel */}
              {cameraActive ? (
                <div className="bg-slate-100 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 relative overflow-hidden flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-rose-600 rounded-full animate-ping" />
                    Live Camera Feed
                  </span>
                  <div className="w-48 h-48 bg-black rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden relative">
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover scale-x-[-1]" 
                      playsInline 
                      muted 
                    />
                  </div>
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={capturePhoto}
                      className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg text-xs uppercase hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                      Take Photo
                    </button>
                    <button 
                      onClick={stopCamera}
                      className="px-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2 rounded-lg text-xs uppercase hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={startCamera}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs"
                >
                  <Camera className="w-4 h-4 text-[#f09a1a]" />
                  Use Device Camera
                </button>
              )}

              {/* Hidden inputs & drag zones */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-xl p-4 cursor-pointer text-center transition-all ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                }`}
              >
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Drag photo here, or browse</p>
                <p className="text-[9px] text-slate-400 mt-0.5 font-sans">Supports JPG, PNG up to 2MB</p>
              </div>

              {cameraError && (
                <div className="bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[10px] p-2.5 rounded-lg flex items-start gap-1.5 text-left leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1">
              <Shield className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Camera & Photo Restricted</p>
              <p className="text-[10px] text-slate-400 leading-normal">
                Only campus Administrators are authorized to update user security photo records.
              </p>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Right Column: Profile Identity Details form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider border-b border-rose-200/5 pb-2.5">
              Verified University Profile information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Registration/Employee ID</label>
                <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 select-none">
                  KASC-2026-N{user?.id || '99'}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Authenticated Email Address</label>
                <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 select-none truncate">
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Editable profile fields */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Department/Faculty Stream</label>
                <input
                  type="text"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  placeholder="e.g. Computer Science / Business Administration"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-950 dark:text-white rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Mobile Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9443210987"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-950 dark:text-white rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Personal Bio / Specialization Focus</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Briefly describe your research streams, core subjects, or study interest areas..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-950 dark:text-white rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end">
              <button 
                onClick={() => flashSuccess('Your local profile info was saved and locked!')}
                className="bg-[#1e2e6b] hover:bg-[#132150] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </div>

          {/* Academic Integrity Guidelines */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <UserCheck className="w-5 h-5 text-[#f09a1a] shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white uppercase text-[10px]">Academic Credential Shield Active</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Uploading a profile photo is voluntary but highly encouraged to simplify campus checks. Photos containing non-representative content or inappropriate materials are subject to review by the Registrar's board.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
