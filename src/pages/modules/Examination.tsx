import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { 
  FileText, Calendar, Award, UserCheck, Shield, ChevronRight, Check,
  Search, Plus, RefreshCw, Printer, Download, Eye, Edit3, Trash2, 
  Settings, Users, BookOpen, Clock, AlertTriangle, Play, HelpCircle,
  FileSpreadsheet, Sparkles, Filter, CheckCircle2, ChevronDown
} from 'lucide-react';

interface ExamSchedule {
  id: string;
  courseCode: string;
  courseName: string;
  department: string;
  semester: number;
  date: string;
  session: 'FN' | 'AN'; // FN: 10:00 AM - 01:00 PM, AN: 02:00 PM - 05:00 PM
  venue: string;
  hallNo: string;
}

interface StudentExamMark {
  id: string;
  studentRegNo: string;
  studentName: string;
  department: string;
  semester: number;
  courseCode: string;
  courseName: string;
  ciaMarks: number; // Cumulative Internal Assessment (Max 25)
  eseMarks: number; // End Semester Exam (Max 75)
  totalMarks: number; // Max 100
  grade: string;
  status: 'PASS' | 'RA' | 'ABSENT'; // RA: Re-appearance (fail)
}

interface HallTicket {
  registerNo: string;
  studentName: string;
  courseName: string;
  department: string;
  semester: number;
  isReleased: boolean;
  exams: {
    courseCode: string;
    courseName: string;
    date: string;
    session: 'FN' | 'AN';
    hallNo: string;
    isApproved: boolean;
  }[];
}

const SEED_SCHEDULES: ExamSchedule[] = [
  {
    id: 'sch-1',
    courseCode: '24BCS401',
    courseName: 'Design and Analysis of Algorithms',
    department: 'Computer Science',
    semester: 4,
    date: '2026-06-25',
    session: 'FN',
    venue: 'Main Block - III Floor',
    hallNo: 'MB - 302'
  },
  {
    id: 'sch-2',
    courseCode: '24BCS402',
    courseName: 'Advanced Web Engineering',
    department: 'Computer Science',
    semester: 4,
    date: '2026-06-27',
    session: 'FN',
    venue: 'Main Block - III Floor',
    hallNo: 'MB - 304'
  },
  {
    id: 'sch-3',
    courseCode: '24BCS403',
    courseName: 'Relational Database Systems',
    department: 'Computer Science',
    semester: 4,
    date: '2026-06-30',
    session: 'FN',
    venue: 'PG Block - II Floor',
    hallNo: 'PG - 208'
  },
  {
    id: 'sch-4',
    courseCode: '24BCA404',
    courseName: 'Artificial Intelligence & Neural Nets',
    department: 'Computer Science',
    semester: 4,
    date: '2026-07-02',
    session: 'AN',
    venue: 'APJ Block - I Floor',
    hallNo: 'APJ - 105'
  }
];

const SEED_MARKS: StudentExamMark[] = [
  {
    id: 'mrk-1',
    studentRegNo: '24BCS101',
    studentName: 'Arun Kumar S',
    department: 'Computer Science',
    semester: 4,
    courseCode: '24BCS401',
    courseName: 'Design and Analysis of Algorithms',
    ciaMarks: 22,
    eseMarks: 61,
    totalMarks: 83,
    grade: 'A+',
    status: 'PASS'
  },
  {
    id: 'mrk-2',
    studentRegNo: '24BCI104',
    studentName: 'Divya Bharathi R',
    department: 'Computer Science',
    semester: 4,
    courseCode: '24BCS401',
    courseName: 'Design and Analysis of Algorithms',
    ciaMarks: 24,
    eseMarks: 67,
    totalMarks: 91,
    grade: 'O',
    status: 'PASS'
  },
  {
    id: 'mrk-3',
    studentRegNo: '24BCS101',
    studentName: 'Arun Kumar S',
    department: 'Computer Science',
    semester: 4,
    courseCode: '24BCS402',
    courseName: 'Advanced Web Engineering',
    ciaMarks: 21,
    eseMarks: 58,
    totalMarks: 79,
    grade: 'A',
    status: 'PASS'
  },
  {
    id: 'mrk-4',
    studentRegNo: '24BIT112',
    studentName: 'Rajesh Khanna',
    department: 'Computer Science',
    semester: 4,
    courseCode: '24BCS401',
    courseName: 'Design and Analysis of Algorithms',
    ciaMarks: 18,
    eseMarks: 45,
    totalMarks: 63,
    grade: 'B+',
    status: 'PASS'
  },
  {
    id: 'mrk-5',
    studentRegNo: '24BCS101',
    studentName: 'Arun Kumar S',
    department: 'Computer Science',
    semester: 4,
    courseCode: '24BCS403',
    courseName: 'Relational Database Systems',
    ciaMarks: 19,
    eseMarks: 30, // Failing ESE (less than 38/75)
    totalMarks: 49,
    grade: 'RA',
    status: 'RA'
  }
];

export default function Examination() {
  const { user } = useAuth();
  
  // Persistence Loading State Hook
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [examMarks, setExamMarks] = useState<StudentExamMark[]>([]);
  const [printFeedback, setPrintFeedback] = useState<string | null>(null);

  // Safely engineered custom feedback states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const triggerToast = (msg: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(current => current?.message === msg ? null : current);
    }, 4000);
  };

  // Active Main Tabs: schedules | hallticket | marks-results | faculty-entry | stats-analysis
  const [activeTab, setActiveTab] = useState<'schedules' | 'hallticket' | 'marks-results' | 'faculty-entry' | 'stats-analysis'>('schedules');

  // Input States for Scheduling
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editScheduleId, setEditScheduleId] = useState<string | null>(null);
  const [schCourseCode, setSchCourseCode] = useState('');
  const [schCourseName, setSchCourseName] = useState('');
  const [schDept, setSchDept] = useState('');
  const [schSem, setSchSem] = useState(4);
  const [schDate, setSchDate] = useState('');
  const [schSession, setSchSession] = useState<'FN' | 'AN'>('FN');
  const [schVenue, setSchVenue] = useState('');
  const [schHallNo, setSchHallNo] = useState('');

  // Input States for Grade Reporting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemFilter, setSelectedSemFilter] = useState<number | 'ALL'>('ALL');
  
  // Faculty Grade Entry states
  const [selectedClass, setSelectedClass] = useState('B.Sc. CS - II Year');
  const [selectedCourseEntry, setSelectedCourseEntry] = useState('24BCS401');
  const [studentSearchEntry, setStudentSearchEntry] = useState('');

  // Mock Students listing to assign marks to:
  const targetStudentsForMarkUpload = [
    { regNo: '24BCS101', name: 'Arun Kumar S', dept: 'Computer Science' },
    { regNo: '24BCI104', name: 'Divya Bharathi R', dept: 'Computer Science' },
    { regNo: '24BIT112', name: 'Rajesh Khanna', dept: 'Computer Science' },
    { regNo: '24BCS105', name: 'Meenakshi Sundaram', dept: 'Computer Science' }
  ];

  // Selected Entry Buffer
  const [markUploadValues, setMarkUploadValues] = useState<{ [regNo: string]: { cia: number; ese: number } }>({});

  useEffect(() => {
    const savedSchedules = localStorage.getItem('kasc_exam_schedules');
    const savedMarks = localStorage.getItem('kasc_exam_marks');

    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    } else {
      localStorage.setItem('kasc_exam_schedules', JSON.stringify(SEED_SCHEDULES));
      setSchedules(SEED_SCHEDULES);
    }

    if (savedMarks) {
      setExamMarks(JSON.parse(savedMarks));
    } else {
      localStorage.setItem('kasc_exam_marks', JSON.stringify(SEED_MARKS));
      setExamMarks(SEED_MARKS);
    }

    // Populate Grade Input buffer
    const initialBuffer: typeof markUploadValues = {};
    targetStudentsForMarkUpload.forEach(s => {
      // Look up existing mark if any
      const existing = SEED_MARKS.find(m => m.studentRegNo === s.regNo && m.courseCode === '24BCS401');
      initialBuffer[s.regNo] = {
        cia: existing ? existing.ciaMarks : 20,
        ese: existing ? existing.eseMarks : 45
      };
    });
    setMarkUploadValues(initialBuffer);
  }, []);

  const saveSchedulesToStorage = (updated: ExamSchedule[]) => {
    setSchedules(updated);
    localStorage.setItem('kasc_exam_schedules', JSON.stringify(updated));
  };

  const saveMarksToStorage = (updated: StudentExamMark[]) => {
    setExamMarks(updated);
    localStorage.setItem('kasc_exam_marks', JSON.stringify(updated));
  };

  // Helper check for Admin/Faculty Clearance
  const isOfficer = 
    user?.role === Role.ADMIN || 
    user?.role === Role.PRINCIPAL || 
    user?.role === Role.HOD || 
    user?.role === Role.FACULTY;

  // Local student context
  const mockStudentReg = '24BCS101'; // Defaulting to Student Arun Kumar ID
  const mockStudentName = user?.name || 'Arun Kumar S';
  const mockStudentDept = 'Computer Science';
  const mockStudentSem = 4;

  // Grade point calculations index
  const getGradeFromMarks = (total: number, EseMarks: number) => {
    if (EseMarks < 38) return 'RA'; // Failing criterion of 50% in ESE (38 out of 75)
    if (total >= 90) return 'O';
    if (total >= 80) return 'A+';
    if (total >= 70) return 'A';
    if (total >= 60) return 'B+';
    if (total >= 50) return 'B';
    return 'RA';
  };

  // Actions
  const handleCreateOrEditSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schCourseCode || !schCourseName || !schVenue || !schHallNo) {
      triggerToast('Examination blueprint metrics remain incomplete.', 'danger');
      return;
    }

    if (editScheduleId) {
      const updated = schedules.map(s => {
        if (s.id === editScheduleId) {
          return {
            ...s,
            courseCode: schCourseCode,
            courseName: schCourseName,
            department: schDept || 'Computer Science',
            semester: Number(schSem),
            date: schDate,
            session: schSession,
            venue: schVenue,
            hallNo: schHallNo
          };
        }
        return s;
      });
      saveSchedulesToStorage(updated);
      setEditScheduleId(null);
      triggerToast('Examination timetable entry modified successfully.', 'success');
    } else {
      const newSch: ExamSchedule = {
        id: `sch-${Date.now()}`,
        courseCode: schCourseCode,
        courseName: schCourseName,
        department: schDept || 'Computer Science',
        semester: Number(schSem),
        date: schDate || '2026-06-25',
        session: schSession,
        venue: schVenue,
        hallNo: schHallNo
      };
      saveSchedulesToStorage([...schedules, newSch]);
      triggerToast('New exam date added to timetables.', 'success');
    }

    // Reset Form
    setSchCourseCode('');
    setSchCourseName('');
    setSchDate('');
    setSchVenue('');
    setSchHallNo('');
    setShowScheduleForm(false);
  };

  const handleEditScheduleState = (s: ExamSchedule) => {
    setEditScheduleId(s.id);
    setSchCourseCode(s.courseCode);
    setSchCourseName(s.courseName);
    setSchDept(s.department);
    setSchSem(s.semester);
    setSchDate(s.date);
    setSchSession(s.session);
    setSchVenue(s.venue);
    setSchHallNo(s.hallNo);
    setShowScheduleForm(true);
  };

  const handleDeleteSchedule = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    saveSchedulesToStorage(updated);
    triggerToast('Exam schedule successfully removed from college registry.', 'info');
    setDeleteTargetId(null);
  };

  // Faculty marks submission
  const handleMarksBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Look up course template name
    const foundSched = schedules.find(s => s.courseCode === selectedCourseEntry);
    const textCourseName = foundSched ? foundSched.courseName : 'Advanced Web Engineering';

    const currentMarkRecords = [...examMarks];

    Object.keys(markUploadValues).forEach(reg => {
      const values = markUploadValues[reg];
      const cia = Number(values.cia) || 0;
      const ese = Number(values.ese) || 0;
      const total = cia + ese;
      const grade = getGradeFromMarks(total, ese);
      const passState = grade !== 'RA' ? 'PASS' : 'RA';

      const foundStud = targetStudentsForMarkUpload.find(t => t.regNo === reg);
      const studentNameVal = foundStud ? foundStud.name : 'Unknown Cadet';

      // Check if mark already exists for student + course
      const matchIdx = currentMarkRecords.findIndex(m => m.studentRegNo === reg && m.courseCode === selectedCourseEntry);
      
      const newEntry: StudentExamMark = {
        id: `mrk-${Date.now()}-${reg}`,
        studentRegNo: reg,
        studentName: studentNameVal,
        department: mockStudentDept,
        semester: 4,
        courseCode: selectedCourseEntry,
        courseName: textCourseName,
        ciaMarks: cia,
        eseMarks: ese,
        totalMarks: total,
        grade: grade,
        status: passState as any
      };

      if (matchIdx !== -1) {
        currentMarkRecords[matchIdx] = newEntry;
      } else {
        currentMarkRecords.push(newEntry);
      }
    });

    saveMarksToStorage(currentMarkRecords);
    triggerToast('Unified mark grades published to central security ledger successfully.', 'success');
  };

  const handleMarkEntryChange = (reg: string, field: 'cia' | 'ese', value: string) => {
    const numeric = Math.min(field === 'cia' ? 25 : 75, Math.max(0, parseInt(value) || 0));
    setMarkUploadValues(prev => ({
      ...prev,
      [reg]: {
        ...prev[reg],
        [field]: numeric
      }
    }));
  };

  // Print Hall ticket simulation trigger
  const handlePrintHallTicket = () => {
    setPrintFeedback('Initiating print sequences... Contacting College Mainframe Printer.');
    setTimeout(() => {
      setPrintFeedback('SUCCESS: Hall Ticket generated. Security Hash: CO-KASC-039X1. Exported PDF containing examination registration tokens.');
      window.print();
    }, 1200);
  };

  // Filter schedules and results
  const filteredSchedules = schedules.filter(s => {
    const combinedStr = `${s.courseCode} ${s.courseName} ${s.venue} ${s.hallNo}`.toLowerCase();
    return combinedStr.includes(searchTerm.toLowerCase());
  });

  const filteredStudentMarks = examMarks.filter(m => {
    const isMatchedStudent = user?.role === Role.STUDENT ? m.studentRegNo === mockStudentReg : true;
    const matchesSearch = m.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSem = selectedSemFilter === 'ALL' || m.semester === selectedSemFilter;
    
    return isMatchedStudent && matchesSearch && matchesSem;
  });

  // Calculate Overall Academic Department analytics (Pass percentage, CGPA, total fails/passes)
  const totalSubmissions = examMarks.length;
  const totalPass = examMarks.filter(m => m.status === 'PASS').length;
  const pass_percentage = totalSubmissions ? ((totalPass / totalSubmissions) * 100).toFixed(1) : '100.0';
  const testClearAverage = totalSubmissions ? (examMarks.reduce((sum, current) => sum + current.totalMarks, 0) / totalSubmissions).toFixed(1) : '0';

  return (
    <div className="space-y-6 relative">
      
      {/* State-derived Toast Alert banner */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 shadow-2xl rounded-lg p-4 max-w-sm flex items-start gap-3 bg-[#0a0f1d] border border-indigo-505/20 text-white animate-in slide-in-from-top-4 duration-300">
          <div className="mt-0.5">
            {toast.type === 'success' && <div className="p-1.5 bg-emerald-500/10 rounded"><Award className="w-4 h-4 text-emerald-400" /></div>}
            {toast.type === 'danger' && <div className="p-1.5 bg-rose-500/10 rounded"><Award className="w-4 h-4 text-rose-400" /></div>}
            {toast.type === 'info' && <div className="p-1.5 bg-sky-505/10 rounded"><Award className="w-4 h-4 text-sky-400" /></div>}
          </div>
          <div className="flex-1">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#f09a1a]">Registry Notice</h5>
            <p className="text-slate-300 text-[11px] mt-0.5 font-medium leading-relaxed">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white text-xs ml-2 font-bold px-1 select-none">✕</button>
        </div>
      )}

      {/* Central Notification Board banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a0f1d] p-5 rounded-sm border border-indigo-500/10 shadow-lg">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#f09a1a] bg-[#f09a1a]/10 px-2.5 py-1 rounded-sm uppercase">
            Controller of Examinations Office (COE)
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1.5">
            Examination Management Module
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Review certified semesters results, schedules schedules, print exam hall tickets, and digitize CIA gradings.
          </p>
        </div>
        
        {isOfficer && (
          <button 
            onClick={() => {
              setEditScheduleId(null);
              setSchCourseCode('');
              setSchCourseName('');
              setSchVenue('');
              setSchHallNo('');
              setShowScheduleForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e2e6b] hover:bg-[#132150] text-[#f09a1a] hover:text-white rounded-lg shadow-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-[#f09a1a]/30"
          >
            <Plus className="w-4 h-4" />
            Add Exam Schedule
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#1e2e6b]" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Exams Scheduled</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">{schedules.length} Papers</span>
            <span className="text-[9px] text-[#1e2e6b] font-bold">End Semester Timetable</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-[#1e2e6b]" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-emerald-500" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Dept Pass Rating</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">{pass_percentage}%</span>
            <span className="text-[9px] text-emerald-600 font-bold block">Consolidated results</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-amber-500" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Class Mean Marks</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">{testClearAverage} / 100</span>
            <span className="text-[9px] text-amber-600 font-bold">Aggregate theory scale</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-indigo-500" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Hall Ticket State</span>
            <span className="text-2xl font-black text-[#1e2e6b] tracking-tight block mt-1">Released</span>
            <span className="text-[9px] text-indigo-650 font-bold">Approved by Dean</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 text-indigo-500" />
          </div>
        </div>

      </div>

      {/* Module Hub Navigation Tabs */}
      <div className="bg-white rounded-sm border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50">
          
          <button 
            onClick={() => { setActiveTab('schedules'); }}
            className={`p-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'schedules' ? 'border-[#1e2e6b] text-[#1e2e6b] bg-white font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Exam Schedules
          </button>

          <button 
            onClick={() => { setActiveTab('hallticket'); }}
            className={`p-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'hallticket' ? 'border-[#1e2e6b] text-[#1e2e6b] bg-white font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            My Hall Ticket
          </button>

          <button 
            onClick={() => { setActiveTab('marks-results'); }}
            className={`p-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'marks-results' ? 'border-[#1e2e6b] text-[#1e2e6b] bg-white font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Internal Marks & ESE Results
          </button>

          {isOfficer && (
            <button 
              onClick={() => { setActiveTab('faculty-entry'); }}
              className={`p-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'faculty-entry' ? 'border-amber-500 text-amber-600 bg-white font-black' : 'border-transparent text-slate-505 hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-500" />
              Upload & Grade Assessments
            </button>
          )}

          {isOfficer && (
            <button 
              onClick={() => { setActiveTab('stats-analysis'); }}
              className={`p-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'stats-analysis' ? 'border-indigo-505 text-indigo-600 bg-white font-black' : 'border-transparent text-slate-505 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-550 animate-pulse" />
              Department Statistics
            </button>
          )}

        </div>

        {/* Dynamic Display Content Area based on Tab Selector */}
        <div className="p-6">
          
          {/* TAB 1: SCHEDULES TIMETABLE */}
          {activeTab === 'schedules' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full block animate-pulse" />
                  <span className="text-xs font-bold text-slate-650 uppercase">June / July 2026 End-Semester Examinations Draft Timetable</span>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search schedules..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-205 rounded">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-[#1e2e6b]/5 text-[#1e2e6b] font-bold text-xs">
                    <tr>
                      <th className="p-4">Course Descriptor</th>
                      <th className="p-4">Semester</th>
                      <th className="p-4">Faculty HOD</th>
                      <th className="p-4">Session & Clock</th>
                      <th className="p-4">Venue Hall Allocation</th>
                      {isOfficer && <th className="p-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredSchedules.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                          No scheduled examinations index match selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredSchedules.map((sch) => (
                        <tr key={sch.id} className="hover:bg-slate-50/55 transition-colors">
                          <td className="p-4 font-extrabold text-[#1e2e6b]">
                            <div>{sch.courseName}</div>
                            <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-50 p-0.5 px-1 rounded border border-slate-150 inline-block mt-0.5">
                              {sch.courseCode}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-700">Sem {sch.semester}</td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-600 block">{sch.department}</span>
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest block mt-0.5">KASC Aided Stream</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-700 block">{sch.date}</span>
                            <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              sch.session === 'FN' ? 'bg-[#1e2e6b]/10 text-[#1e2e6b]' : 'bg-amber-50 text-amber-800'
                            }`}>
                              {sch.session === 'FN' ? 'FN (10:00 AM - 01:00 PM)' : 'AN (02:00 PM - 05:00 PM)'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-850 block">{sch.hallNo}</span>
                            <span className="text-[10px] text-slate-400 block">{sch.venue}</span>
                          </td>
                          {isOfficer && (
                            <td className="p-4 text-right space-x-1">
                              <button 
                                onClick={() => handleEditScheduleState(sch)}
                                className="p-1 px-2 hover:bg-slate-100 text-[#1e2e6b] border border-slate-250 rounded inline-flex items-center gap-1 font-bold text-[10px]"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteSchedule(sch.id)}
                                className="p-1 px-2 hover:bg-rose-50 text-rose-600 border border-slate-250 rounded inline-flex items-center gap-1 font-bold text-[10px]"
                              >
                                <Trash2 className="w-3 h-3" /> Del
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Strict guidelines for candidates */}
              <div className="p-4 bg-amber-500/5 rounded-sm border border-amber-399/10 space-y-2 mt-4">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 ">
                  <AlertTriangle className="w-4 h-4 text-[#f09a1a] " />
                  Statutory Directives for Students
                </h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Candidates are mandated to enter exam rooms with officially authorized printed <strong>Hall Tickets</strong>, College ID Card badges, and correct writing assets. Digital wearables, smart calculators, and supplementary booklets are strictly prohibited inside the examinations perimeter. Clear active dues before June 23, 2026.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: MY HALL TICKET (DYNAMIC DIGITAL PREVIEW) */}
          {activeTab === 'hallticket' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 border border-slate-200">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Download Consolidated Hall Ticket</h3>
                  <p className="text-slate-400 text-[10.5px]">Hall ticker is automatically approved and generated by the Academic Affairs Controller.</p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrintHallTicket}
                    className="flex items-center gap-1.5 px-4.5 py-2 bg-[#1e2e6b] text-white hover:bg-opacity-90 rounded font-black uppercase text-[10px] tracking-wider transition-all duration-150 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    Print Hall Ticket
                  </button>
                </div>
              </div>

              {printFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 font-bold rounded text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{printFeedback}</span>
                </div>
              )}

              {/* High-fidelity printed design template preview */}
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 relative max-w-2xl mx-auto space-y-6 text-slate-800 select-none">
                
                {/* College Emblem & Header */}
                <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5">
                  <h2 className="text-sm font-black tracking-wider uppercase text-slate-900">KONGUNADU ARTS AND SCIENCE COLLEGE (AUTONOMOUS)</h2>
                  <p className="text-[10px] font-bold text-slate-550 leading-relaxed uppercase">GNANAMBAL ARANGAM ROAD, COIMBATORE - 641 029, TAMIL NADU</p>
                  <p className="text-xs font-black text-[#1e2e6b] tracking-wider uppercase bg-[#1e2e6b]/5 px-2 py-0.5 inline-block rounded">
                    End-Semester examinations HALL TICKET - june / july 2026
                  </p>
                </div>

                {/* Student Credentials Deck grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Candidate Name</span>
                    <strong className="text-slate-900 text-[11px] uppercase">{mockStudentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Register No</span>
                    <strong className="text-slate-900 text-[11px] font-mono tracking-wider">{mockStudentReg}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Department Degree</span>
                    <strong className="text-slate-900 text-[11px] uppercase">B.Sc. Computer Science</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Semester Block</span>
                    <strong className="text-slate-900 text-[11px]">IV Semester - UG</strong>
                  </div>
                </div>

                {/* Exam allocations Table */}
                <div className="space-y-3">
                  <p className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wider text-left border-b border-slate-200 pb-1.5">Registered Courses Hall Schedule</p>
                  
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[9px] tracking-wider">
                      <tr>
                        <th className="p-2 border border-slate-205">Course Token</th>
                        <th className="p-2 border border-slate-205">Registered Course Title</th>
                        <th className="p-2 border border-slate-205">Date of Exam</th>
                        <th className="p-2 border border-slate-205">Shift Session</th>
                        <th className="p-2 border border-slate-205">Hall Seat</th>
                        <th className="p-2 border border-slate-205">Examiner sign</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {schedules.map((sch) => (
                        <tr key={sch.id} className="text-[10.5px]">
                          <td className="p-2 border border-slate-150 font-mono font-bold text-slate-800">{sch.courseCode}</td>
                          <td className="p-2 border border-slate-150 font-extrabold text-slate-900">{sch.courseName}</td>
                          <td className="p-2 border border-slate-150 font-semibold font-mono">{sch.date}</td>
                          <td className="p-2 border border-slate-150 font-bold text-indigo-700">{sch.session}</td>
                          <td className="p-2 border border-slate-150 font-bold text-slate-800">{sch.hallNo}</td>
                          <td className="p-2 border border-slate-150 text-slate-300 italic text-center">Approved</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Verification QR Signature blocks */}
                <div className="pt-8 grid grid-cols-2 text-center text-[10px]">
                  <div className="flex flex-col items-center justify-end space-y-1">
                    <span className="w-24 border-t border-slate-900 mx-auto" />
                    <span className="font-black text-slate-905 uppercase text-[9px]">Candidate Signature</span>
                  </div>
                  <div className="flex flex-col items-center justify-end space-y-1">
                    <span className="text-emerald-700 font-mono font-black text-xs block mb-1">COE SIGNATURE VERIFIED</span>
                    <span className="w-24 border-t border-slate-900 mx-auto" />
                    <span className="font-black text-slate-905 uppercase text-[9px]">Controller of Examinations</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: INTERNAL MARKS & SEMESTER RESULTS */}
          {activeTab === 'marks-results' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 border border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Filing Semester:</span>
                  <select
                    value={selectedSemFilter}
                    onChange={(e) => setSelectedSemFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                    className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded font-bold outline-none text-slate-700 hover:border-slate-350 cursor-pointer"
                  >
                    <option value="ALL">All Semesters</option>
                    <option value="4">Semester 4 (Active)</option>
                    <option value="3">Semester 3</option>
                    <option value="2">Semester 2</option>
                    <option value="1">Semester 1</option>
                  </select>
                </div>

                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search by course code or title..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-505"
                  />
                </div>
              </div>

              {/* Results spreadsheet block */}
              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left text-xs text-slate-650">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-505 font-bold">
                    <tr>
                      <th className="p-4">Student Candidate</th>
                      <th className="p-4">Course Token</th>
                      <th className="p-4">Semester Code</th>
                      <th className="p-4 text-center">CIA Marks (Max 25)</th>
                      <th className="p-4 text-center">ESE Marks (Max 75)</th>
                      <th className="p-4 text-center">Cumulative (Max 100)</th>
                      <th className="p-4 text-center">Mark Grade Letter</th>
                      <th className="p-4 text-center">Academic Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredStudentMarks.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-slate-400 italic">
                          No assessment or result files found in archives.
                        </td>
                      </tr>
                    ) : (
                      filteredStudentMarks.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-bold text-slate-800">
                            <div>{rec.studentName}</div>
                            <span className="text-[10px] text-slate-450 font-bold block">{rec.studentRegNo}</span>
                          </td>
                          <td className="p-4 text-[#1e2e6b] font-extrabold">
                            <div>{rec.courseName}</div>
                            <span className="text-[10px] font-mono font-bold bg-[#1e2e6b]/5 p-0.5 px-1.5 rounded border border-[#1e2e6b]/10 inline-block mt-0.5">
                              {rec.courseCode}
                            </span>
                          </td>
                          <td className="p-4 font-bold">Sem {rec.semester}</td>
                          <td className="p-4 text-center font-mono font-black text-slate-700">{rec.ciaMarks} / 25</td>
                          <td className="p-4 text-center font-mono font-black text-slate-700">{rec.eseMarks} / 75</td>
                          <td className="p-4 text-center font-mono font-black text-slate-900 text-xs bg-slate-50/50">{rec.totalMarks} / 100</td>
                          <td className="p-4 text-center font-mono font-black text-xs text-indigo-700">{rec.grade}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block px-2.5 py-1 text-[10px] uppercase font-black font-mono rounded-lg ${
                              rec.status === 'PASS' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse'
                            }`}>
                              {rec.status === 'PASS' ? 'PASS' : 'RE-APPEAR'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: FACULTY GRADE UPLOADER */}
          {activeTab === 'faculty-entry' && isOfficer && (
            <div className="space-y-6">
              
              <div className="p-5 bg-[#1e2e6b]/5 rounded-sm border border-[#1e2e6b]/20 text-slate-800 space-y-4">
                
                <form onSubmit={handleMarksBatchSubmit} className="space-y-4">
                  
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-[#1e2e6b] block" />
                    <h3 className="font-extrabold text-slate-999 text-sm uppercase tracking-wider">Unified CIA & End-Semester Marks Entry Panel</h3>
                  </div>

                  {/* Dropdowns logic */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div>
                      <label className="block text-slate-500 uppercase font-black tracking-widest text-[9px] mb-1">Target Student Batch</label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded font-semibold outline-none text-slate-700"
                      >
                        <option value="B.Sc. CS - II Year">B.Sc. Computer Science - II Year</option>
                        <option value="BCA - II Year">BCA - II Year</option>
                        <option value="B.Sc. IT - III Year">B.Sc. Information Technology - III Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 uppercase font-black tracking-widest text-[9px] mb-1">Assigned Subject Code</label>
                      <select
                        value={selectedCourseEntry}
                        onChange={(e) => {
                          setSelectedCourseEntry(e.target.value);
                          // Repopulate buffer
                          const initialBuffer: typeof markUploadValues = {};
                          targetStudentsForMarkUpload.forEach(s => {
                            const existing = examMarks.find(m => m.studentRegNo === s.regNo && m.courseCode === e.target.value);
                            initialBuffer[s.regNo] = {
                              cia: existing ? existing.ciaMarks : 20,
                              ese: existing ? existing.eseMarks : 45
                            };
                          });
                          setMarkUploadValues(initialBuffer);
                        }}
                        className="w-full bg-white border border-slate-205 text-xs px-2.5 py-1.5 rounded font-semibold outline-none text-slate-700"
                      >
                        {schedules.map(s => (
                          <option key={s.id} value={s.courseCode}>{s.courseCode} - {s.courseName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 uppercase font-black tracking-widest text-[9px] mb-1.5">Fast Filter Student</label>
                      <input 
                        type="text"
                        placeholder="Type registers or name..."
                        value={studentSearchEntry}
                        onChange={(e) => setStudentSearchEntry(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded font-semibold placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-350"
                      />
                    </div>

                  </div>

                  {/* Grading table list input */}
                  <div className="bg-white rounded border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase text-[9px]">
                        <tr>
                          <th className="p-3">Reference ID</th>
                          <th className="p-3">Student Fullname</th>
                          <th className="p-3 text-center">CIA Internal Ledger (Max 25)</th>
                          <th className="p-3 text-center">ESE Semester Board (Max 75)</th>
                          <th className="p-3 text-center">Calculated Total (Max 100)</th>
                          <th className="p-3 text-center">Est. Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {targetStudentsForMarkUpload
                          .filter(s => s.name.toLowerCase().includes(studentSearchEntry.toLowerCase()) || s.regNo.toLowerCase().includes(studentSearchEntry.toLowerCase()))
                          .map((student) => {
                            const values = markUploadValues[student.regNo] || { cia: 20, ese: 45 };
                            const sumTotal = Number(values.cia) + Number(values.ese);
                            const gradeLetter = getGradeFromMarks(sumTotal, values.ese);

                            return (
                              <tr key={student.regNo} className="hover:bg-slate-50/50">
                                
                                <td className="p-3 font-mono font-bold text-slate-700">{student.regNo}</td>
                                <td className="p-3 font-extrabold text-slate-900">{student.name}</td>
                                
                                <td className="p-3 text-center">
                                  <input 
                                    type="number"
                                    max={25}
                                    min={0}
                                    value={values.cia}
                                    onChange={(e) => handleMarkEntryChange(student.regNo, 'cia', e.target.value)}
                                    className="w-20 text-center font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-1 rounded"
                                  />
                                </td>

                                <td className="p-3 text-center">
                                  <input 
                                    type="number"
                                    max={75}
                                    min={0}
                                    value={values.ese}
                                    onChange={(e) => handleMarkEntryChange(student.regNo, 'ese', e.target.value)}
                                    className="w-20 text-center font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-1 rounded"
                                  />
                                </td>

                                <td className="p-3 text-center font-mono font-black text-slate-900 text-xs">
                                  {sumTotal} / 100
                                </td>

                                <td className="p-3 text-center">
                                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black uppercase font-mono rounded ${
                                    gradeLetter === 'RA' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-800'
                                  }`}>
                                    {gradeLetter}
                                  </span>
                                </td>

                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-705 text-white shadow-md font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-emerald-700 cursor-pointer"
                    >
                      Publish Marks Board
                    </button>
                  </div>

                </form>

              </div>

            </div>
          )}

          {/* TAB 5: DEPARTMENT EXAM STATISTICS & PERFORMANCE ANALYSIS */}
          {activeTab === 'stats-analysis' && isOfficer && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual block 1: Batch Pass breakdown */}
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-850 text-xs uppercase tracking-wider border-b border-slate-200 pb-2">Academic Standing Percentage</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                        <span>Design & Analysis of Algorithms</span>
                        <span className="font-mono text-emerald-600 font-extrabold">100.0% Pass</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                        <span>Advanced Web Engineering</span>
                        <span className="font-mono text-emerald-600 font-extrabold">100.0% Pass</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                        <span>Relational Database Systems</span>
                        <span className="font-mono text-rose-600 font-extrabold">0.0% Pass (Awaiting review)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '0%' }} />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Info block 2: Grading parameters scale rules */}
                <div className="bg-amber-500/5 p-5 rounded-lg border border-amber-399/10 space-y-3 shrink-0">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Autonomous Grading scale directives
                  </h4>
                  
                  <div className="divide-y divide-slate-150 text-slate-600 text-[10.5px]">
                    <div className="flex justify-between py-1.5 first:pt-0">
                      <span>Excellent O Grade</span>
                      <strong className="font-mono">90 - 100 Marks (10.0 GP)</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Exceptional A+ Grade</span>
                      <strong className="font-mono">80 - 89 Marks (9.0 GP)</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Highly Commendable A Grade</span>
                      <strong className="font-mono">70 - 79 Marks (8.0 GP)</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Compulsory ESE minimum criteria</span>
                      <strong className="font-mono text-rose-650">Min 38/75 End-Semester Marks</strong>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* MODAL OVERLAY: ADD / MODIFY TIMETABLE EVENT FOR ADMINISTRATIVE OFFICERS */}
      {showScheduleForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setShowScheduleForm(false)} />
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden z-10 border border-slate-250 animate-in zoom-in-95 duration-150">
            
            <div className="bg-[#1e2e6b] text-white p-4 px-6 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {editScheduleId ? 'Edit Exam Timetable Paper' : 'Schedule New Board Exam'}
                </h3>
                <p className="text-[10px] text-slate-200 mt-0.5">Introduce scheduled sessions into the June/July 2026 Board Registry.</p>
              </div>
              <button onClick={() => setShowScheduleForm(false)} className="text-white hover:text-amber-400">
                <Trash2 className="w-5 h-5 rotate-45 transform" /> {/* Acts as close icon representation */}
              </button>
            </div>

            <form onSubmit={handleCreateOrEditSchedule} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 uppercase font-black tracking-widest text-[9px] mb-1">Subject Code *</label>
                  <input 
                    type="text"
                    required
                    value={schCourseCode}
                    onChange={(e) => setSchCourseCode(e.target.value)}
                    placeholder="e.g. 24BCS401"
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 rounded font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase font-black tracking-widest text-[9px] mb-1">Exam Semester Block</label>
                  <input 
                    type="number"
                    required
                    value={schSem}
                    onChange={(e) => setSchSem(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 rounded font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase font-black tracking-widest text-[9px] mb-1">Subject Description title *</label>
                <input 
                  type="text"
                  required
                  value={schCourseName}
                  onChange={(e) => setSchCourseName(e.target.value)}
                  placeholder="e.g. Analysis of Algorithms"
                  className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 rounded font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 uppercase font-black tracking-widest text-[9px] mb-1">Shift session</label>
                  <select 
                    value={schSession}
                    onChange={(e) => setSchSession(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 rounded font-bold text-slate-800"
                  >
                    <option value="FN">ForeNoon Board (FN)</option>
                    <option value="AN">AfterNoon Board (AN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 uppercase font-black tracking-widest text-[9px] mb-1">Assigned Exam Date</label>
                  <input 
                    type="date"
                    required
                    value={schDate}
                    onChange={(e) => setSchDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 rounded font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 uppercase font-black tracking-widest text-[9px] mb-1">Building Venue Block *</label>
                  <input 
                    type="text"
                    required
                    value={schVenue}
                    onChange={(e) => setSchVenue(e.target.value)}
                    placeholder="e.g. PG Block"
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 rounded font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase font-black tracking-widest text-[9px] mb-1">Hall Alloc Register *</label>
                  <input 
                    type="text"
                    required
                    value={schHallNo}
                    onChange={(e) => setSchHallNo(e.target.value)}
                    placeholder="e.g. PG-102"
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 rounded font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowScheduleForm(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-500 rounded font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-[#1e2e6b] text-white hover:bg-opacity-95 font-bold text-xs uppercase rounded"
                >
                  {editScheduleId ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
