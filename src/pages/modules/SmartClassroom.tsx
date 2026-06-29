import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { 
  loadClassroomOSState, 
  saveClassroomOSStateDebounced, 
  resetClassroomOSState 
} from '../../lib/classroomPersistence';
import { 
  Classroom, Subject, Announcement, Assignment, Submission, 
  Comment, Attachment, ChatMessage, AuditLog 
} from '../../types/classroom';
import ClassroomStream from '../../components/classroom/ClassroomStream';
import ClassroomClasswork from '../../components/classroom/ClassroomClasswork';
import ClassroomCalendar from '../../components/classroom/ClassroomCalendar';
import ClassroomAnalytics from '../../components/classroom/ClassroomAnalytics';
import ClassroomAIHub from '../../components/classroom/ClassroomAIHub';
import ClassroomChat from '../../components/classroom/ClassroomChat';
import { 
  GraduationCap, Calendar, MessageSquare, Sparkles, TrendingUp, BookOpen, 
  Users, ShieldAlert, Award, FileText, Settings, RefreshCw, Layers 
} from 'lucide-react';

export default function SmartClassroom() {
  const { user } = useAuth();
  
  // Classroom Database Core State
  const [dbState, setDbState] = useState(() => loadClassroomOSState());
  const [activeClassroomId, setActiveClassroomId] = useState('class-1');
  const [activeTab, setActiveTab] = useState<'STREAM' | 'CLASSWORK' | 'CALENDAR' | 'CHAT' | 'AI' | 'ANALYTICS'>('STREAM');

  // Sync state changes with persistence layer
  useEffect(() => {
    saveClassroomOSStateDebounced(dbState);
  }, [dbState]);

  if (!user) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800">Authentication Required</h3>
        <p className="text-slate-400 text-xs mt-1">Please log into the ERP to access the Smart Classroom.</p>
      </div>
    );
  }

  const activeClassroom = dbState.classrooms.find(c => c.id === activeClassroomId) || dbState.classrooms[0];
  if (!activeClassroom) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <Layers className="w-12 h-12 text-[#1e2e6b] mx-auto mb-3" />
        <h3 className="font-bold text-slate-800">No Classrooms Available</h3>
        <p className="text-slate-400 text-xs mt-1">Contact your ERP administrator to register your academic batch.</p>
      </div>
    );
  }

  // Filter classroom-specific variables
  const activeSubjects = dbState.subjects.filter(s => activeClassroom.subjectIds.includes(s.id));
  const activeAnnouncements = dbState.announcements.filter(a => a.classroomId === activeClassroom.id);
  const activeAssignments = dbState.assignments.filter(a => a.classroomId === activeClassroom.id);
  const activeSubmissions = dbState.submissions.filter(s => {
    const asg = dbState.assignments.find(a => a.id === s.assignmentId);
    return asg && asg.classroomId === activeClassroom.id;
  });
  const activeChatGroups = dbState.chatGroups.filter(g => g.classroomId === activeClassroom.id || g.participantIds.includes(user.id));

  // Logger Helper
  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      ip: '192.168.1.1',
      timestamp: new Date().toISOString(),
      details
    };
    setDbState(prev => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs]
    }));
  };

  // --- ACTIONS ---

  // 1. Post announcement
  const handleAddAnnouncement = (text: string, attachments: Attachment[], isPinned: boolean, scheduledAt?: string) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      classroomId: activeClassroom.id,
      posterId: user.id,
      posterName: user.name,
      posterRole: user.role,
      text,
      attachments,
      comments: [],
      likes: [],
      isPinned,
      scheduledAt,
      createdAt: new Date().toISOString()
    };

    setDbState(prev => ({
      ...prev,
      announcements: [newAnn, ...prev.announcements]
    }));

    logAction(
      scheduledAt ? 'SCHEDULE_ANNOUNCEMENT' : 'POST_ANNOUNCEMENT',
      `Posted announcement titled "${text.substring(0, 30)}..." in classroom ${activeClassroom.name}.`
    );
  };

  // 2. Delete announcement
  const handleDeleteAnnouncement = (id: string) => {
    setDbState(prev => ({
      ...prev,
      announcements: prev.announcements.filter(a => a.id !== id)
    }));
    logAction('DELETE_ANNOUNCEMENT', `Deleted announcement ID ${id} in classroom ${activeClassroom.name}.`);
  };

  // 3. Add comment to announcement
  const handleAddComment = (announcementId: string, text: string) => {
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      text,
      posterId: user.id,
      posterName: user.name,
      posterRole: user.role,
      emojiReactions: [],
      createdAt: new Date().toISOString()
    };

    setDbState(prev => ({
      ...prev,
      announcements: prev.announcements.map(ann => {
        if (ann.id === announcementId) {
          return { ...ann, comments: [...ann.comments, newComment] };
        }
        return ann;
      })
    }));

    logAction('POST_COMMENT', `Commented on announcement ID ${announcementId} in classroom ${activeClassroom.name}.`);
  };

  // 4. Toggle like on announcement
  const handleToggleLike = (announcementId: string) => {
    setDbState(prev => ({
      ...prev,
      announcements: prev.announcements.map(ann => {
        if (ann.id === announcementId) {
          const hasLiked = ann.likes.includes(user.id);
          const likes = hasLiked 
            ? ann.likes.filter(id => id !== user.id)
            : [...ann.likes, user.id];
          return { ...ann, likes };
        }
        return ann;
      })
    }));
  };

  // 5. Add/React with emoji to comment
  const handleReactComment = (announcementId: string, commentId: string, emoji: string) => {
    setDbState(prev => ({
      ...prev,
      announcements: prev.announcements.map(ann => {
        if (ann.id === announcementId) {
          return {
            ...ann,
            comments: ann.comments.map(comment => {
              if (comment.id === commentId) {
                // Check if emoji exists
                const existingReactIdx = comment.emojiReactions.findIndex(r => r.emoji === emoji);
                let emojiReactions = [...comment.emojiReactions];

                if (existingReactIdx >= 0) {
                  const react = emojiReactions[existingReactIdx];
                  const hasReacted = react.users.includes(user.id);
                  const users = hasReacted 
                    ? react.users.filter(id => id !== user.id)
                    : [...react.users, user.id];
                  
                  if (users.length === 0) {
                    emojiReactions = emojiReactions.filter(r => r.emoji !== emoji);
                  } else {
                    emojiReactions[existingReactIdx] = {
                      ...react,
                      users,
                      count: users.length
                    };
                  }
                } else {
                  emojiReactions.push({
                    emoji,
                    count: 1,
                    users: [user.id]
                  });
                }

                return { ...comment, emojiReactions };
              }
              return comment;
            })
          };
        }
        return ann;
      })
    }));
  };

  // 6. Create Assignment
  const handleAddAssignment = (assignmentData: Partial<Assignment>) => {
    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      classroomId: activeClassroom.id,
      subjectId: assignmentData.subjectId || 'sub-1',
      title: assignmentData.title || 'Assignment Topic',
      description: assignmentData.description || '',
      type: assignmentData.type || 'ASSIGNMENT',
      dueDate: assignmentData.dueDate || new Date().toISOString(),
      maxMarks: assignmentData.maxMarks || 20,
      rubrics: assignmentData.rubrics || [],
      attachments: assignmentData.attachments || [],
      questions: assignmentData.questions || [],
      createdAt: new Date().toISOString()
    };

    setDbState(prev => ({
      ...prev,
      assignments: [newAsg, ...prev.assignments]
    }));

    logAction('CREATE_ASSIGNMENT', `Created ${newAsg.type} titled "${newAsg.title}" in classroom ${activeClassroom.name}.`);
  };

  // 7. Student Submit Assignment
  const handleAddSubmission = (submissionData: Partial<Submission>) => {
    const newSub: Submission = {
      id: `subm-${Date.now()}`,
      assignmentId: submissionData.assignmentId || '',
      studentId: user.id,
      studentName: user.name,
      registerNo: submissionData.registerNo || '24BCS101',
      text: submissionData.text || '',
      codeSolution: submissionData.codeSolution,
      attachments: submissionData.attachments || [],
      submittedAt: new Date().toISOString(),
      status: submissionData.status || 'SUBMITTED',
      marksObtained: submissionData.marksObtained,
      feedback: submissionData.feedback,
      version: 1
    };

    setDbState(prev => ({
      ...prev,
      submissions: [newSub, ...prev.submissions]
    }));

    logAction('SUBMIT_ASSIGNMENT', `Student ${user.name} submitted assignment ID ${newSub.assignmentId}.`);
  };

  // 8. Grade submission
  const handleGradeSubmission = (submissionId: string, marks: number, feedback: string, rubricScores?: Record<string, number>) => {
    setDbState(prev => ({
      ...prev,
      submissions: prev.submissions.map(sub => {
        if (sub.id === submissionId) {
          return {
            ...sub,
            status: 'GRADED',
            marksObtained: marks,
            feedback,
            rubricScores,
            gradedBy: user.name
          };
        }
        return sub;
      })
    }));

    logAction('GRADE_SUBMISSION', `Faculty ${user.name} graded submission ID ${submissionId} with score ${marks}.`);
  };

  // 9. Send chat message
  const handleSendMessage = (groupId: string, text: string, attachments?: Attachment[]) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatGroupId: groupId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      text,
      attachments,
      createdAt: new Date().toISOString()
    };

    setDbState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMsg]
    }));
  };

  const handleResetDatabase = () => {
    if (confirm('Are you sure you want to reset KASC Classroom State to seed default values?')) {
      const reset = resetClassroomOSState();
      setDbState(reset);
      logAction('DATABASE_RESET', 'Reset KASC Classroom state to seeds.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls: Selector and Reset */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 shadow-lg gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
            <GraduationCap className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="text-sm font-bold tracking-tight">KASC ERP Smart Classroom</h1>
            <p className="text-[10px] text-slate-400 font-mono">Continuous Evaluation & Generative Study Suite</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <select
              value={activeClassroomId}
              onChange={(e) => setActiveClassroomId(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-amber-500 font-bold"
            >
              {dbState.classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleResetDatabase}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition-all flex items-center gap-1.5"
            title="Reset Database to Seed State"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-semibold">Reset Seed State</span>
          </button>
        </div>
      </div>

      {/* Tab Navigations */}
      <div className="flex items-center border-b border-slate-200 overflow-x-auto gap-1 pb-1.5 scrollbar-thin">
        <button
          onClick={() => setActiveTab('STREAM')}
          className={`px-4 py-2 text-xs font-bold transition-all rounded-lg shrink-0 flex items-center gap-1.5 ${
            activeTab === 'STREAM' 
              ? 'bg-[#1e2e6b]/5 text-[#1e2e6b] border-b-2 border-b-[#1e2e6b]' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Classroom Feed
        </button>

        <button
          onClick={() => setActiveTab('CLASSWORK')}
          className={`px-4 py-2 text-xs font-bold transition-all rounded-lg shrink-0 flex items-center gap-1.5 ${
            activeTab === 'CLASSWORK' 
              ? 'bg-[#1e2e6b]/5 text-[#1e2e6b] border-b-2 border-b-[#1e2e6b]' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          Assignments & Quizzes
        </button>

        <button
          onClick={() => setActiveTab('CALENDAR')}
          className={`px-4 py-2 text-xs font-bold transition-all rounded-lg shrink-0 flex items-center gap-1.5 ${
            activeTab === 'CALENDAR' 
              ? 'bg-[#1e2e6b]/5 text-[#1e2e6b] border-b-2 border-b-[#1e2e6b]' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Timetable & Calendar
        </button>

        <button
          onClick={() => setActiveTab('CHAT')}
          className={`px-4 py-2 text-xs font-bold transition-all rounded-lg shrink-0 flex items-center gap-1.5 ${
            activeTab === 'CHAT' 
              ? 'bg-[#1e2e6b]/5 text-[#1e2e6b] border-b-2 border-b-[#1e2e6b]' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Communications Room
        </button>

        <button
          onClick={() => setActiveTab('AI')}
          className={`px-4 py-2 text-xs font-bold transition-all rounded-lg shrink-0 flex items-center gap-1.5 ${
            activeTab === 'AI' 
              ? 'bg-amber-500/10 text-amber-700 border-b-2 border-b-amber-500 font-extrabold' 
              : 'text-slate-500 hover:bg-slate-50 font-bold'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Generative Study AI
        </button>

        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-4 py-2 text-xs font-bold transition-all rounded-lg shrink-0 flex items-center gap-1.5 ${
            activeTab === 'ANALYTICS' 
              ? 'bg-[#1e2e6b]/5 text-[#1e2e6b] border-b-2 border-b-[#1e2e6b]' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Analytics & Logs
        </button>
      </div>

      {/* Main Tab Render Viewports */}
      <div className="min-h-[400px]">
        {activeTab === 'STREAM' && (
          <ClassroomStream
            classroom={activeClassroom}
            subjects={activeSubjects}
            announcements={activeAnnouncements}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onAddComment={handleAddComment}
            onToggleLike={handleToggleLike}
            onReactComment={handleReactComment}
          />
        )}

        {activeTab === 'CLASSWORK' && (
          <ClassroomClasswork
            subjects={activeSubjects}
            assignments={activeAssignments}
            submissions={activeSubmissions}
            onAddAssignment={handleAddAssignment}
            onAddSubmission={handleAddSubmission}
            onGradeSubmission={handleGradeSubmission}
          />
        )}

        {activeTab === 'CALENDAR' && (
          <ClassroomCalendar
            classroom={activeClassroom}
            subjects={activeSubjects}
            assignments={activeAssignments}
          />
        )}

        {activeTab === 'CHAT' && (
          <ClassroomChat
            chatGroups={activeChatGroups}
            chatMessages={dbState.chatMessages}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'AI' && (
          <ClassroomAIHub
            subjects={activeSubjects}
          />
        )}

        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6 text-left">
            <ClassroomAnalytics
              classroom={activeClassroom}
              subjects={activeSubjects}
              assignments={activeAssignments}
              submissions={activeSubmissions}
            />

            {/* Audit Logs Breakdown Panel */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-4 border-b border-slate-50 pb-2">
                Classroom Security Audit Logs
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase">
                      <th className="p-2.5">Timestamp</th>
                      <th className="p-2.5">Action</th>
                      <th className="p-2.5">Operator</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">IP</th>
                      <th className="p-2.5">Transaction Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-600">
                    {dbState.auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-2.5"><span className="bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{log.action}</span></td>
                        <td className="p-2.5 font-bold text-slate-800">{log.userName}</td>
                        <td className="p-2.5 text-[10px] font-bold">{log.userRole}</td>
                        <td className="p-2.5 text-slate-400">{log.ip}</td>
                        <td className="p-2.5 truncate max-w-[200px]" title={log.details}>{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
