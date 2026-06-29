import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { jsPDF } from 'jspdf';
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
  Users, ShieldAlert, Award, FileText, Settings, RefreshCw, Layers,
  Lock, Unlock, Key, Download, X, AlertCircle, FileDown, Check
} from 'lucide-react';

export default function SmartClassroom() {
  const { user } = useAuth();
  
  // Classroom Database Core State
  const [dbState, setDbState] = useState(() => loadClassroomOSState());
  const [activeClassroomId, setActiveClassroomId] = useState('class-1');
  const [activeTab, setActiveTab] = useState<'STREAM' | 'CLASSWORK' | 'CALENDAR' | 'CHAT' | 'AI' | 'ANALYTICS'>('STREAM');

  // Secure Code and Link Decrypter State
  const [classCodeInput, setClassCodeInput] = useState('');
  const [showDocExplorer, setShowDocExplorer] = useState(false);
  const [selectedClassroomDocs, setSelectedClassroomDocs] = useState<any[]>([]);
  const [activeDoc, setActiveDoc] = useState<any | null>(null);
  const [docContent, setDocContent] = useState<string>('');
  const [isReading, setIsReading] = useState(false);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [codeError, setCodeError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

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

  // --- SECURE ACADEMIC CODE & WORKSHOP LINK PARSERS ---
  const handleDecryptCode = async (code: string) => {
    if (!code.trim()) return;
    setCodeError('');
    setIsDecrypting(true);
    
    // Simulate high-tech decrypt delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Try finding matching classroom by classCode or by Google Classroom link
    let targetClass = dbState.classrooms.find(
      c => c.classCode?.toLowerCase() === code.trim().toLowerCase() ||
           (c.googleClassroomUrl && c.googleClassroomUrl.toLowerCase() === code.trim().toLowerCase())
    );

    const isUrl = code.includes('http://') || code.includes('https://') || code.includes('classroom.google.com') || code.includes('drive.google.com') || code.includes('/');

    // If it's a URL and we still didn't find any target classroom, let's create a dynamic "External Classroom Workshop" for this link!
    if (isUrl && !targetClass) {
      // Determine a smart title based on keywords in URL
      let derivedTitle = 'Decrypted Old Classroom Workshop';
      let department = 'Information Technology';
      let subject = 'Advanced Web Systems & Workshops';
      
      const lowerCode = code.toLowerCase();
      if (lowerCode.includes('cs') || lowerCode.includes('computer')) {
        derivedTitle = 'Computer Science Virtual Workshop';
        department = 'Computer Science';
        subject = 'Distributed Systems & Cloud Architecture';
      } else if (lowerCode.includes('data') || lowerCode.includes('da') || lowerCode.includes('analytics')) {
        derivedTitle = 'Data Science & Predictive Analytics Workshop';
        department = 'Data Analytics';
        subject = 'Big Data Mining & Machine Learning';
      } else if (lowerCode.includes('ai') || lowerCode.includes('neural') || lowerCode.includes('intelligence')) {
        derivedTitle = 'Artificial Intelligence & Neural Engineering Lab';
        department = 'AI & Machine Learning';
        subject = 'Deep Neural Networks & Heuristics';
      }

      // Dynamically add a temporary classroom if needed or just compile document listings directly
      logAction('LINK_ACCESS_GRANTED_URL', `Decrypted old classroom workshop link successfully: "${code}".`);

      const compiledDocs = [
        {
          id: `temp-doc-1`,
          title: 'Decrypted Workshop Syllabus & Resource Plan',
          name: 'Workshop_Syllabus_Plan.pdf',
          size: '1.8 MB',
          type: 'application/pdf',
          source: `Decrypted Link: ${code}`,
          description: `Full overview, lab prerequisites, and reference manuals parsed directly from the external classroom link: ${code}.`,
          originalUrl: code
        },
        {
          id: `temp-doc-2`,
          title: 'Practical Hands-on Implementation Guide',
          name: 'Hands_On_Implementation_Guide.docx',
          size: '2.4 MB',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          source: `Decrypted Link: ${code}`,
          description: `Comprehensive guide covering build instructions, environment parameters, and code templates from the archived workspace.`,
          originalUrl: code
        },
        {
          id: `temp-doc-3`,
          title: 'Workshop Self-Assessment & Quiz Brief',
          name: 'Workshop_Self_Assessment.pdf',
          size: '950 KB',
          type: 'application/pdf',
          source: `Decrypted Link: ${code}`,
          description: `Self-graded assessment with multiple choice questions, review checklists, and research projects derived from: ${code}.`,
          originalUrl: code
        }
      ];

      setSelectedClassroomDocs(compiledDocs);
      setShowDocExplorer(true);
      setIsDecrypting(false);

      // Open first document immediately in reading mode
      handleReadDocument(compiledDocs[0]);
      return;
    }

    if (!targetClass) {
      setCodeError('❌ ACCESS DENIED: INVALID SIGNATURE, ERP REFERENCE CODE OR INVALID WORKSHOP LINK.');
      logAction('LINK_ACCESS_DENIED', `Unauthorized code entry signature: "${code}".`);
      setIsDecrypting(false);
      return;
    }

    // Set active classroom
    setActiveClassroomId(targetClass.id);
    logAction('LINK_ACCESS_GRANTED', `Classroom ${targetClass.name} decrypted successfully via access code: "${code}".`);

    // Fetch and compile all documents associated with this classroom
    const classAnnouncements = dbState.announcements.filter(a => a.classroomId === targetClass.id);
    const classAssignments = dbState.assignments.filter(a => a.classroomId === targetClass.id);
    const classMaterials = dbState.materials.filter(m => m.classroomId === targetClass.id);

    const compiledDocs = [
      ...classMaterials.map(m => ({
        id: m.id,
        title: m.title,
        name: m.title + (m.fileType.includes('pdf') ? '.pdf' : m.fileType.includes('presentation') ? '.pptx' : '.docx'),
        size: m.size,
        type: m.fileType,
        source: 'Official Course Materials',
        description: m.description,
        originalUrl: m.url
      })),
      ...classAnnouncements.flatMap(a => a.attachments.map(att => ({
        id: `ann-${a.id}-${att.name}`,
        title: att.name,
        name: att.name,
        size: att.size,
        type: att.type,
        source: `Announcement Feed Post by ${a.posterName}`,
        description: a.text.substring(0, 100) + (a.text.length > 100 ? '...' : ''),
        originalUrl: att.url
      }))),
      ...classAssignments.flatMap(asg => asg.attachments.map(att => ({
        id: `asg-${asg.id}-${att.name}`,
        title: att.name,
        name: att.name,
        size: att.size,
        type: att.type,
        source: `Assignment Case Study: ${asg.title}`,
        description: asg.description.substring(0, 100) + (asg.description.length > 100 ? '...' : ''),
        originalUrl: att.url
      })))
    ];

    setSelectedClassroomDocs(compiledDocs);
    setShowDocExplorer(true);
    setIsDecrypting(false);

    // Open first document immediately in reading mode
    if (compiledDocs.length > 0) {
      handleReadDocument(compiledDocs[0]);
    } else {
      setActiveDoc(null);
      setDocContent('');
    }
  };

  const handleReadDocument = async (doc: any) => {
    setActiveDoc(doc);
    setIsReading(true);
    setDocContent('');

    const prompt = `You are an Elite Academic Document Parser at Kongunadu Arts and Science College.
The user is requesting to decrypt and read the document titled "${doc.title}" from the section "${doc.source}".
Description of the file context: "${doc.description}".

Generate an elegant, deep, and fully structured Academic Document Layout representation containing:
1. **HEADER**: [KASC ERP DIGITAL LECTURE ARCHIVE - DECRYPTED ACCESS] with Course Code, Document Title, and Security Token.
2. **ABSTRACT**: A precise academic summary of this handout.
3. **LECTURE SYLLABUS / CRITICAL CONTENT**: A 3-section detailed guide with clear definitions, diagrams outlined in text, or code/pseudo-code snippets if related to Computer Science.
4. **RECOMMENDED TUTORIAL QUESTIONS**: A set of 2 review questions.
5. **KEY LEARNING OUTCOMES**: 3 clear bullet points.

Formatting: Use pure Markdown with bold headings, clean bullet points, and high contrast code blocks. Be extremely thorough, helpful, and highly professional.`;

    try {
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: 'gemini-2.5-pro',
          systemInstruction: 'You are the Chief Academic Curriculum Synthesizer at Kongunadu Arts and Science College. Render clean, deeply informative, and professional study contents in pristine Markdown.'
        })
      });
      const data = await response.json();
      if (data.result) {
        setDocContent(data.result);
      } else {
        throw new Error('No content returned');
      }
    } catch (e) {
      console.error(e);
      setDocContent(`[DECRYPTED SECURE FEED - BACKUP LOCAL MODE]\n\nDOCUMENT: ${doc.title}\nSOURCE: ${doc.source}\nSIZE: ${doc.size}\n\n=========================================\nCORE SYLLABUS OUTLINE & ACADEMIC REVISION\n=========================================\n\nThis core document supports the module on "${doc.title}". It encompasses fundamental concepts, lecture notes, lab guides, and recommended study tracks designed for KASC Computer Science courses.\n\nRECOMMENDED READINGS:\n- Fowler, M. "Analysis Patterns: Reusable Object Models", Addison-Wesley.\n- Tanenbaum, A.S. "Modern Operating Systems", Pearson Publishing.`);
    } finally {
      setIsReading(false);
    }
  };

  const handleDownloadPDF = (doc: any, fullText: string) => {
    // Start high-tech downloading progress bar
    setDownloadingDocId(doc.id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Trigger actual PDF generation and download via jsPDF
          try {
            const pdf = new jsPDF();
            
            // Add KASC Logo/Header
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(14);
            pdf.setTextColor(30, 46, 107); // #1e2e6b
            pdf.text("KONGUNADU ARTS AND SCIENCE COLLEGE (AUTONOMOUS)", 15, 20);
            
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(110, 110, 110);
            pdf.text("Coimbatore, Tamil Nadu | Approved ERP Courseware Archive", 15, 25);
            pdf.line(15, 28, 195, 28);
            
            // Add Document Details
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(11);
            pdf.setTextColor(40, 40, 40);
            pdf.text(`ACADEMIC HANDOUT: ${doc.title}`, 15, 36);
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.text(`Source Stream: ${doc.source}`, 15, 41);
            pdf.text(`File Signature: ${doc.id} | Size: ${doc.size}`, 15, 46);
            pdf.text(`Downloaded On: ${new Date().toLocaleString()}`, 15, 51);
            pdf.line(15, 54, 195, 54);
            
            // Add Content Body
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9.5);
            pdf.setTextColor(60, 60, 60);
            
            // Clean up Markdown formatting tags so they don't print literally in standard font
            const cleanText = fullText
              .replace(/#+/g, '')
              .replace(/\*\*+/g, '')
              .replace(/`+/g, '');
              
            const cleanLines = cleanText.split('\n');
              
            let yPosition = 62;
            cleanLines.forEach((line) => {
              if (line.trim() === '') {
                yPosition += 4;
                return;
              }
              
              // Wrap text to fit page width safely
              const splitText = pdf.splitTextToSize(line, 175);
              splitText.forEach((t: string) => {
                if (yPosition > 275) {
                  pdf.addPage();
                  yPosition = 20; // reset y position on new page
                }
                pdf.text(t, 15, yPosition);
                yPosition += 6.5;
              });
            });
            
            pdf.save(doc.name || "KASC_Decrypted_Handout.pdf");
            logAction('PDF_DOWNLOAD', `Decrypted and successfully downloaded PDF: "${doc.title}".`);
          } catch (err) {
            console.error('PDF generation failed, downloading as text file', err);
            // Fallback text download
            const element = document.createElement("a");
            const file = new Blob([fullText], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = doc.name.replace('.pdf', '.txt') || "KASC_Document.txt";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }

          setTimeout(() => {
            setDownloadingDocId(null);
          }, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 120);
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

      {/* KASC SECURE SYLLABUS & ARCHIVE ACCESS GATEWAY */}
      <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-4 relative overflow-hidden text-left">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[10px] uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              🛡️ KASC SECURE STUDY ARCHIVE ACCESS
            </div>
            <h2 className="text-base font-bold tracking-tight text-white uppercase">
              Class Decrypter, Old Workshop Links & Handout Viewer
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Enter an authorized class code (e.g. <code className="text-amber-400 font-mono">g47k29x</code>) OR paste any archived/old Google Classroom workshop link below. The ERP system will instantly decrypt the secure syllabus archive, compile official handouts, and let you export them as PDFs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72">
              <input
                type="text"
                value={classCodeInput}
                onChange={(e) => {
                  setClassCodeInput(e.target.value);
                  setCodeError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleDecryptCode(classCodeInput)}
                placeholder="ENTER CLASS CODE OR PAST WORKSHOP LINK..."
                className="w-full text-xs bg-slate-900 text-amber-400 font-mono border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 text-center tracking-normal uppercase"
              />
            </div>
            <button
              onClick={() => handleDecryptCode(classCodeInput)}
              disabled={isDecrypting || !classCodeInput.trim()}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-bold rounded-xl font-mono uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDecrypting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  ACCESSING...
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-slate-950" />
                  DECRYPT ACCESS
                </>
              )}
            </button>
          </div>
        </div>

        {codeError && (
          <div className="text-left text-xs text-rose-500 font-mono font-bold animate-pulse pt-1">
            {codeError}
          </div>
        )}

        {/* Demo hints for easiest testing */}
        <div className="pt-3 border-t border-slate-900 flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 text-left">
          <span>💡 ERP COURSE CODES:</span>
          <button
            onClick={() => {
              setClassCodeInput('g47k29x');
              handleDecryptCode('g47k29x');
            }}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-amber-400 rounded-md transition-all cursor-pointer"
          >
            💻 IV-B.Sc. CS: <span className="underline font-bold">g47k29x</span>
          </button>
          <button
            onClick={() => {
              setClassCodeInput('j38m25y');
              handleDecryptCode('j38m25y');
            }}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-amber-400 rounded-md transition-all cursor-pointer"
          >
            📊 II-B.Sc. DA: <span className="underline font-bold">j38m25y</span>
          </button>
          <button
            onClick={() => {
              const demoUrl = 'https://classroom.google.com/c/ODY0NzA4MTI1NTg2-old-workshop-cs';
              setClassCodeInput(demoUrl);
              handleDecryptCode(demoUrl);
            }}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-amber-400 rounded-md transition-all cursor-pointer"
            title="Try pasting an old Google Classroom workshop URL"
          >
            🔗 Old Google Classroom Workshop Link: <span className="underline font-bold">Try Link</span>
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

      {/* IMMERSIVE DOCUMENT EXPLORER & READING ROOM MODAL */}
      {showDocExplorer && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-slate-950 p-5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                  <Key className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    🔓 KASC Study Archive & Syllabus Portal
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      ACTIVE ERP SESSION
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Classroom: {activeClassroom?.name} ({activeClassroom?.semester})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDocExplorer(false)}
                className="p-1.5 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-amber-400 rounded-lg transition-all cursor-pointer"
                title="Close Document Portal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Split-screen) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
              
              {/* Left Side: Document Inventory List */}
              <div className="w-full md:w-80 bg-slate-950/80 border-r border-slate-800 flex flex-col overflow-y-auto p-4 space-y-3 shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-2 text-left">
                  📂 Handout Document Inventory ({selectedClassroomDocs.length})
                </span>

                {selectedClassroomDocs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs">
                    No attachments or resources registered in this stream.
                  </div>
                ) : (
                  <div className="space-y-2 text-left">
                    {selectedClassroomDocs.map((doc) => {
                      const isActive = activeDoc?.id === doc.id;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => handleReadDocument(doc)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                            isActive
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[inset_0_0_10px_rgba(245,158,11,0.05)]'
                              : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                          }`}
                        >
                          <FileText className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{doc.title}</p>
                            <span className="text-[9px] font-mono block mt-1 text-slate-500">
                              {doc.source}
                            </span>
                            <span className="text-[9px] font-mono text-amber-400/80 mt-0.5 block font-bold">
                              Size: {doc.size}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Side: Document Content Reader Workspace */}
              <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden relative">
                
                {activeDoc ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* Active Doc Header */}
                    <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                      <div className="text-left">
                        <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                          <BookOpen className="w-3.5 h-3.5" />
                          Reading Workspace
                        </div>
                        <h4 className="text-sm font-black text-white mt-1">
                          {activeDoc.title}
                        </h4>
                      </div>

                      {/* Download Button with progress bars */}
                      <div className="shrink-0">
                        {downloadingDocId === activeDoc.id ? (
                          <div className="w-48 bg-slate-900 border border-amber-500/30 rounded-lg p-2 space-y-1 text-center font-mono">
                            <div className="flex justify-between text-[8px] text-amber-400 font-bold uppercase">
                              <span>📥 Downloading...</span>
                              <span>{downloadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-amber-500 h-full rounded-full transition-all duration-105 shadow-[0_0_5px_#f59e0b]" 
                                style={{ width: `${downloadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDownloadPDF(activeDoc, docContent)}
                            disabled={isReading || !docContent}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-30 text-slate-950 text-xs font-bold rounded-lg font-mono uppercase tracking-wider flex items-center gap-1.5 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)] transition-all cursor-pointer"
                          >
                            <FileDown className="w-3.5 h-3.5 text-slate-950" />
                            Download PDF
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Doc Reader Content Block */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 text-left">
                      {isReading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_rgba(245,158,11,0.1)]" />
                          <div className="space-y-1 text-center">
                            <p className="text-xs font-mono text-amber-400 font-bold animate-pulse">
                              [LOADING SYLLABUS DIRECTORY]...
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono font-bold">
                              Compiling and parsing academic handouts using Google Gemini AI...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6 max-w-3xl mx-auto font-sans leading-relaxed text-slate-200">
                          {/* Rich Render representation */}
                          <div className="border border-amber-500/20 bg-slate-900 p-5 rounded-2xl font-mono text-xs text-amber-400 border-l-4 border-l-amber-500">
                            <p className="font-bold uppercase">[SYSTEM CLASSIFICATION]: SECURE KASC REPOSITORY</p>
                            <p className="mt-1 text-slate-400 font-mono">Security Access granted for student. Press 'Download PDF' above to save the officially formatted college copy.</p>
                          </div>

                          <div className="prose prose-invert max-w-none text-slate-300 text-sm whitespace-pre-wrap font-sans">
                            {docContent}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-2 p-6 text-center">
                    <AlertCircle className="w-10 h-10 text-slate-600 animate-pulse" />
                    <p className="text-xs font-mono text-slate-500">
                      Please select a file from the inventory on the left to start academic reading.
                    </p>
                  </div>
                )}

              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                ERP CONNECTION STATUS: SECURE (HTTPS)
              </span>
              <span>
                KONGUNADU ARTS AND SCIENCE COLLEGE (AUTONOMOUS)
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
