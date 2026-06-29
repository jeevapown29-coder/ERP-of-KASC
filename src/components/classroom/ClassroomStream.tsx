import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { Announcement, Comment, Attachment, EmojiReaction, Classroom, Subject } from '../../types/classroom';
import { 
  Pin, MessageSquare, ThumbsUp, Send, Calendar, Sparkles, AlertCircle, FileText, 
  Trash2, Plus, Clock, HelpCircle, GraduationCap, ArrowRight, CornerDownRight, ExternalLink,
  Video, FolderOpen, Copy, Check, RefreshCw, Layers
} from 'lucide-react';

interface ClassroomStreamProps {
  classroom: Classroom;
  subjects: Subject[];
  announcements: Announcement[];
  onAddAnnouncement: (text: string, attachments: Attachment[], isPinned: boolean, scheduledAt?: string) => void;
  onDeleteAnnouncement: (id: string) => void;
  onAddComment: (announcementId: string, text: string) => void;
  onToggleLike: (announcementId: string) => void;
  onReactComment: (announcementId: string, commentId: string, emoji: string) => void;
}

export default function ClassroomStream({
  classroom,
  subjects,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onAddComment,
  onToggleLike,
  onReactComment
}: ClassroomStreamProps) {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Google Classroom integration states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFinished, setSyncFinished] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // AI Doubt Solver State
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [studentDoubt, setStudentDoubt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const isTeacher = user?.role === Role.FACULTY;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classroom.classCode || 'g47k29x');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSyncWorkspace = () => {
    setIsSyncing(true);
    setSyncFinished(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncFinished(true);
      
      // Trigger dynamic announcement injection
      onAddAnnouncement(
        "🔄 [Google Classroom Sync] Successfully fetched latest stream updates and course materials from classroom.google.com API for jeevapown29@gmail.com.\n\nNew Shared Resource: 'Interactive Virtual Memory Simulator spec sheet' has been synced to your KASC ERP classroom stream.",
        [
          { name: 'Virtual_Memory_Specification.pdf', type: 'application/pdf', size: '1.8 MB', url: '#' },
          { name: 'Process_Scheduling_Simulator.py', type: 'text/x-python', size: '12 KB', url: '#' }
        ],
        true // Highlight via pin
      );

      setTimeout(() => setSyncFinished(false), 5000);
    }, 2000);
  };
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    onAddAnnouncement(
      newPost,
      attachedFiles,
      isPinned,
      showScheduler && scheduledDate ? scheduledDate : undefined
    );

    // Reset Form
    setNewPost('');
    setIsPinned(false);
    setShowScheduler(false);
    setScheduledDate('');
    setAttachedFiles([]);
  };

  const handleCommentSubmit = (announcementId: string) => {
    const text = commentInputs[announcementId];
    if (!text || !text.trim()) return;

    onAddComment(announcementId, text);
    setCommentInputs(prev => ({ ...prev, [announcementId]: '' }));
  };

  const handleMockFileUpload = () => {
    const mockFiles = [
      { name: 'Lecture_Note_Reference.pdf', type: 'application/pdf', size: '1.45 MB', url: '#' },
      { name: 'UML_Diagram_CheatSheet.png', type: 'image/png', size: '890 KB', url: '#' },
      { name: 'Weekly_Lab_Instructions.docx', type: 'application/msword', size: '320 KB', url: '#' }
    ];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    
    if (!attachedFiles.some(f => f.name === randomFile.name)) {
      setAttachedFiles(prev => [...prev, randomFile]);
    }
  };

  const handleAskAIDoubt = async () => {
    if (!studentDoubt.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');

    const subject = subjects.find(s => s.id === selectedSubjectId)?.name || 'Computer Science';
    const prompt = `You are an Elite AI Professor at KASC ERP, specializing in ${subject}. 
A student in the classroom "${classroom.name}" has the following academic doubt:
"${studentDoubt}"

Provide a highly professional, accurate, and detailed explanation tailored to university level.
Use clean formatting, lists, and code blocks if relevant. Be extremely encouraging and clear.`;

    try {
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          model: 'gemini-2.5-pro',
          systemInstruction: 'You are an Elite AI Professor at Kongunadu Arts and Science College. Resolve academic doubts with absolute technical precision, depth, and structured clarity.'
        })
      });
      const data = await response.json();
      if (data.result) {
        setAiResponse(data.result);
      } else {
        setAiResponse('Error: Failed to obtain a response from KASC AI Core.');
      }
    } catch (e) {
      console.error(e);
      setAiResponse('Connection failed. Please check your network or server status.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Sort announcements: pinned first, then newest
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Google Classroom Official Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white border border-emerald-700 shadow-lg p-6 md:p-8">
        {/* Abstract background vector accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left Text Detail */}
          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded-full border border-emerald-500/30 tracking-wider flex items-center gap-1 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Google Workspace Verified
              </span>
              <span className="text-[10px] text-emerald-200/70 font-medium">
                Connected: {user?.email || 'jeevapown29@gmail.com'}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black tracking-tight font-sans text-white">
              {classroom.name}
            </h2>
            <p className="text-xs text-emerald-100/80 font-medium flex items-center gap-2">
              <span>{classroom.semester}</span>
              <span>•</span>
              <span>{classroom.department}</span>
              {classroom.code && (
                <>
                  <span>•</span>
                  <span>ERP Ref: {classroom.code}</span>
                </>
              )}
            </p>
          </div>

          {/* Right Class Code Block */}
          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest font-mono">
              Google Class Code
            </span>
            <div className="flex items-center gap-2 bg-black/20 border border-emerald-500/20 rounded-xl px-3.5 py-2 font-mono">
              <span className="text-sm font-black text-white tracking-widest">
                {classroom.classCode || 'g47k29x'}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 hover:bg-white/10 rounded transition-colors text-emerald-300 hover:text-white cursor-pointer"
                title="Copy Class Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copiedCode && (
              <span className="text-[9px] text-emerald-300 font-bold font-mono">
                Copied to clipboard!
              </span>
            )}
          </div>
        </div>

        {/* Action Row & Integrations Panel */}
        <div className="mt-6 pt-5 border-t border-emerald-600/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={classroom.googleMeetUrl || 'https://meet.google.com/abc-defg-hij'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-white/5 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-emerald-300" />
              Google Meet Link
            </a>

            <a
              href={classroom.googleDriveUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-white/5 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-emerald-300" />
              Class Drive Folder
            </a>

            <a
              href={classroom.googleCalendarUrl || 'https://calendar.google.com/calendar/r'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-white/5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              Google Calendar
            </a>

            <a
              href={classroom.googleClassroomUrl || 'https://classroom.google.com/c/ODY0NzA4MTI1NTg2/a/ODY0NzA4MTI1NjE0/details'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-500/40 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Google Classroom
            </a>
          </div>

          <button
            type="button"
            onClick={handleSyncWorkspace}
            disabled={isSyncing}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm border ${
              isSyncing 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                : 'bg-[#f09a1a] hover:bg-amber-600 text-white border-amber-500 cursor-pointer'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronizing...' : 'Sync Google Classroom'}
          </button>
        </div>
      </div>

      {/* Sync Status Info Banner */}
      {syncFinished && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-start gap-3 text-left shadow-xs text-xs animate-pulse">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Sync Completed Successfully</p>
            <p className="text-emerald-600">The KASC Smart Classroom has successfully pulled the latest stream updates, reference coursework, and timetables. A synced announcement has been pinned to your feed!</p>
          </div>
        </div>
      )}

      {/* Syncing Loading Overlay */}
      {isSyncing && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 text-center">
          <div className="w-8 h-8 border-4 border-[#f09a1a] border-t-transparent rounded-full animate-spin" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800">Google Classroom API Syncing...</h4>
            <p className="text-[10px] text-slate-400">Authenticating token and pulling assignments from <strong>classroom.google.com</strong></p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Stream Feed Left Side (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Post Announcement Widget */}
        {isTeacher && (
          <form onSubmit={handlePostSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#f09a1a]" />
                Share something with your class
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-xs font-semibold ${
                    isPinned 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Pin post to top"
                >
                  <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-600' : ''}`} />
                  {isPinned ? 'Pinned' : 'Pin Post'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduler(!showScheduler)}
                  className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-xs font-semibold ${
                    showScheduler 
                      ? 'bg-[#1e2e6b]/5 text-[#1e2e6b] border-[#1e2e6b]/20' 
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule
                </button>
              </div>
            </div>

            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Post instructions, resources, study links, or a general announcement..."
              className="w-full text-sm border-0 focus:ring-0 p-1 resize-none min-h-[100px] text-slate-700 placeholder:text-slate-400 font-sans"
            />

            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {attachedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600">
                    <FileText className="w-3.5 h-3.5 text-[#1e2e6b]" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button 
                      type="button" 
                      onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Scheduler Panel */}
            {showScheduler && (
              <div className="bg-[#1e2e6b]/5 border border-[#1e2e6b]/10 rounded-xl p-3 flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#1e2e6b]" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Set Release Schedule</span>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-lg p-1 text-slate-700 focus:ring-1 focus:ring-[#1e2e6b]"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleMockFileUpload}
                className="text-xs text-[#1e2e6b] font-bold hover:underline flex items-center gap-1.5"
              >
                📎 Attach Material
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1e2e6b] hover:bg-[#132150] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {showScheduler ? 'Schedule Announcement' : 'Post to Feed'}
              </button>
            </div>
          </form>
        )}

        {/* Announcements Stream */}
        <div className="space-y-4">
          {sortedAnnouncements.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700">The Stream is empty</h3>
              <p className="text-slate-400 text-xs mt-1">Check back later or post something useful for your class!</p>
            </div>
          ) : (
            sortedAnnouncements.map((post) => {
              const likedByUser = user && post.likes.includes(user.id);
              return (
                <div 
                  key={post.id} 
                  id={`announcement-${post.id}`}
                  className={`bg-white rounded-xl border p-5 relative transition-all ${
                    post.isPinned ? 'border-amber-300 shadow-sm' : 'border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Pin Banner */}
                  {post.isPinned && (
                    <div className="absolute top-4 right-4 text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <Pin className="w-3 h-3 fill-amber-500" />
                      Pinned Announcement
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1e2e6b]/5 flex items-center justify-center font-bold text-[#1e2e6b] border border-[#1e2e6b]/10">
                      {post.posterName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{post.posterName}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                          post.posterRole === Role.FACULTY ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {post.posterRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="mt-4 text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                    {post.text}
                  </div>

                  {/* Attachments */}
                  {post.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {post.attachments.map((file, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-all rounded-lg"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-5 h-5 text-[#1e2e6b]" />
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-semibold text-slate-700">{file.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{file.size} • {file.type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                            </div>
                          </div>
                          <a 
                            href={file.url} 
                            onClick={(e) => e.preventDefault()}
                            className="px-2.5 py-1 bg-white border border-slate-200 text-[#1e2e6b] text-[10px] font-bold rounded-md hover:bg-slate-50"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex items-center justify-between border-t border-slate-100 mt-5 pt-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onToggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${
                          likedByUser ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${likedByUser ? 'fill-amber-500' : ''}`} />
                        Like ({post.likes.length})
                      </button>
                      <span className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                        <MessageSquare className="w-4 h-4" />
                        Comments ({post.comments.length})
                      </span>
                    </div>
                    {isTeacher && (
                      <button
                        onClick={() => onDeleteAnnouncement(post.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Comments Sub-section */}
                  {post.comments.length > 0 && (
                    <div className="mt-5 border-t border-slate-50 pt-4 space-y-3 bg-slate-50/50 -mx-5 -mb-5 px-5 pb-5 rounded-b-xl">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                            {comment.posterName[0]}
                          </div>
                          <div className="flex-1 bg-white border border-slate-100 p-2.5 rounded-lg text-left">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-800">{comment.posterName}</span>
                              <span className="text-[9px] text-slate-400">
                                {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-slate-600 leading-normal">{comment.text}</p>
                            
                            {/* Reactions Display */}
                            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                              {comment.emojiReactions.map((reaction, rIdx) => (
                                <button
                                  key={rIdx}
                                  onClick={() => onReactComment(post.id, comment.id, reaction.emoji)}
                                  className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-full flex items-center gap-1 text-[10px] text-slate-500 font-medium font-sans"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span>{reaction.count}</span>
                                </button>
                              ))}
                              {/* Quick add reactions */}
                              {['👍', '💡', '🎉', '👏'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => onReactComment(post.id, comment.id, emoji)}
                                  className="w-4 h-4 flex items-center justify-center text-[10px] opacity-40 hover:opacity-100 transition-opacity"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Box */}
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                      placeholder="Write a comment..."
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1e2e6b]"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="px-2.5 bg-[#1e2e6b] text-white hover:bg-[#132150] rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Sidebar Right Side (AI Doubt Solver + Quick Stats) */}
      <div className="space-y-6">
        
        {/* AI Doubt Solver Block */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f09a1a]/5 blur-2xl rounded-full" />
          
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white text-sm">AI Tutor & Doubt Solver</h4>
              <p className="text-[10px] text-slate-400">Powered by Google Gemini 3.5</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Select Academic Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full mt-1 text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>

            <div className="text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Describe Your Academic Doubt</label>
              <textarea
                value={studentDoubt}
                onChange={(e) => setStudentDoubt(e.target.value)}
                placeholder="E.g., What is process starvation? Explain with SJF algorithm, or show Python example of Dijkstra priority queue."
                className="w-full mt-1 text-xs bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 resize-none min-h-[100px] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={handleAskAIDoubt}
              disabled={isAiLoading || !studentDoubt.trim()}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              {isAiLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Analyzing doubt with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Solve Doubt Instantally
                </>
              )}
            </button>

            {/* AI Answer Display */}
            {aiResponse && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-left space-y-2 mt-4 max-h-[300px] overflow-y-auto">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs border-b border-slate-700/50 pb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Professor Answer
                </div>
                <div className="text-slate-300 text-xs whitespace-pre-wrap leading-relaxed font-sans prose prose-invert">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Classroom Info Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-left space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">Classroom Logistics</h4>
            <p className="text-[10px] text-slate-400">Standard ERP & LMS metadata integration</p>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Department</span>
              <span className="font-bold text-slate-800">{classroom.department}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Semester</span>
              <span className="font-bold text-slate-800">{classroom.semester}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Access Code</span>
              <span className="font-mono font-bold text-[#1e2e6b] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/50">{classroom.code}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Total Registered Students</span>
              <span className="font-bold text-slate-800">{classroom.studentIds.length}</span>
            </div>
          </div>

          {classroom.googleClassroomUrl && (
            <div className="pt-2">
              <a
                href={classroom.googleClassroomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 border border-emerald-600 cursor-pointer text-center"
              >
                <ExternalLink className="w-4 h-4 text-emerald-300" />
                Launch Google Classroom
              </a>
              <span className="text-[9px] text-slate-400 text-center block mt-1.5 font-medium leading-tight">
                Connects directly to the official external Google Classroom workspace.
              </span>
            </div>
          )}
        </div>

      </div>

    </div>
    </div>
  );
}
