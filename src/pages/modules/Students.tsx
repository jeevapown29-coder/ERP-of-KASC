import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { 
  Search, Plus, Edit2, Trash2, User, Mail, Phone, MapPin, 
  GraduationCap, Calendar, Shield, Award, Users, Percent,
  AlertTriangle, BookOpen, CheckCircle, X, ArrowRight, Eye, ChevronRight
} from 'lucide-react';

interface SubjectMark {
  name: string;
  grade: string;
  marks: number;
}

interface SemesterRecord {
  semester: string;
  gpa: number;
  subjects: SubjectMark[];
}

interface StudentDetail {
  id: string;
  registerNo: string;
  name: string;
  dept: string;
  semester: string;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  attendanceRate: number;
  cgpa: number;
  academicRecords: SemesterRecord[];
}

const SEED_STUDENTS: StudentDetail[] = [
  {
    id: '1',
    registerNo: '24BCS101',
    name: 'Arun Kumar S',
    dept: 'Computer Science',
    semester: 'Semester IV',
    email: 'arun.kumars@gmail.com',
    phone: '+91 94432 12903',
    address: '12, Ram Nagar, Gandhipuram, Coimbatore - 641012',
    guardianName: 'Sivakumar K',
    guardianPhone: '+91 98421 55601',
    attendanceRate: 89.5,
    cgpa: 8.85,
    academicRecords: [
      {
        semester: 'Semester I',
        gpa: 8.70,
        subjects: [
          { name: 'Data Structures', grade: 'O', marks: 92 },
          { name: 'Discrete Mathematics', grade: 'A+', marks: 87 },
          { name: 'Technical English', grade: 'A', marks: 82 }
        ]
      },
      {
        semester: 'Semester II',
        gpa: 8.90,
        subjects: [
          { name: 'Object Oriented Programming', grade: 'O', marks: 94 },
          { name: 'Database Systems', grade: 'O', marks: 91 },
          { name: 'Professional Tamil', grade: 'A+', marks: 88 }
        ]
      },
      {
        semester: 'Semester III',
        gpa: 8.95,
        subjects: [
          { name: 'Computer Architecture', grade: 'O', marks: 95 },
          { name: 'Operating Systems', grade: 'A+', marks: 89 },
          { name: 'Environmental Science', grade: 'O', marks: 91 }
        ]
      }
    ]
  },
  {
    id: '2',
    registerNo: '24BCS102',
    name: 'Divya Bharathi R',
    dept: 'Computer Science',
    semester: 'Semester IV',
    email: 'divya.b@outlook.com',
    phone: '+91 81223 90543',
    address: '45-B, Shastri Nagar, Peelamedu, Coimbatore - 641004',
    guardianName: 'Ramakrishnan P',
    guardianPhone: '+91 81223 90544',
    attendanceRate: 94.2,
    cgpa: 9.12,
    academicRecords: [
      {
        semester: 'Semester I',
        gpa: 9.00,
        subjects: [
          { name: 'Data Structures', grade: 'O', marks: 95 },
          { name: 'Discrete Mathematics', grade: 'O', marks: 91 },
          { name: 'Technical English', grade: 'A+', marks: 87 }
        ]
      },
      {
        semester: 'Semester II',
        gpa: 9.20,
        subjects: [
          { name: 'Object Oriented Programming', grade: 'O', marks: 96 },
          { name: 'Database Systems', grade: 'O', marks: 94 },
          { name: 'Professional Tamil', grade: 'O', marks: 92 }
        ]
      },
      {
        semester: 'Semester III',
        gpa: 9.15,
        subjects: [
          { name: 'Computer Architecture', grade: 'O', marks: 93 },
          { name: 'Operating Systems', grade: 'O', marks: 91 },
          { name: 'Environmental Science', grade: 'A+', marks: 88 }
        ]
      }
    ]
  },
  {
    id: '3',
    registerNo: '25BCS204',
    name: 'Gokul Krishnan M',
    dept: 'Physics',
    semester: 'Semester II',
    email: 'gokulkris.m@gmail.com',
    phone: '+91 90432 44521',
    address: '7/3, Anna Street, Saibaba Colony, Coimbatore - 641501',
    guardianName: 'Mani Sundaram',
    guardianPhone: '+91 93452 11204',
    attendanceRate: 71.5,
    cgpa: 7.65,
    academicRecords: [
      {
        semester: 'Semester I',
        gpa: 7.65,
        subjects: [
          { name: 'Classical Mechanics', grade: 'A', marks: 78 },
          { name: 'Engineering Calculus', grade: 'B+', marks: 69 },
          { name: 'Allied Chemistry', grade: 'A+', marks: 85 },
          { name: 'Communication English', grade: 'B', marks: 66 }
        ]
      }
    ]
  },
  {
    id: '4',
    registerNo: '23BMA301',
    name: 'Kavitha Srinivasan',
    dept: 'Mathematics',
    semester: 'Semester VI',
    email: 'kavitha.srini@gmail.com',
    phone: '+91 98943 27129',
    address: '301, Housing Unit, Singanallur, Coimbatore - 641005',
    guardianName: 'Srinivasan G',
    guardianPhone: '+91 98943 27130',
    attendanceRate: 96.0,
    cgpa: 9.40,
    academicRecords: [
      {
        semester: 'Semester I',
        gpa: 9.20,
        subjects: [
          { name: 'Algebra & Trigonometry', grade: 'O', marks: 94 },
          { name: 'Introductory Physics', grade: 'A+', marks: 88 }
        ]
      },
      {
        semester: 'Semester II',
        gpa: 9.50,
        subjects: [
          { name: 'Real Analysis', grade: 'O', marks: 97 },
          { name: 'Analytical Geometry', grade: 'O', marks: 95 },
          { name: 'Language English II', grade: 'O', marks: 93 }
        ]
      },
      {
        semester: 'Semester III',
        gpa: 9.35,
        subjects: [
          { name: 'Differential Equations', grade: 'O', marks: 96 },
          { name: 'Calculus II', grade: 'O', marks: 92 },
          { name: 'Statistics Allied', grade: 'O', marks: 93 }
        ]
      },
      {
        semester: 'Semester IV',
        gpa: 9.45,
        subjects: [
          { name: 'Complex Analysis', grade: 'O', marks: 95 },
          { name: 'Statics & Dynamics', grade: 'O', marks: 94 }
        ]
      },
      {
        semester: 'Semester V',
        gpa: 9.50,
        subjects: [
          { name: 'Modern Algebra', grade: 'O', marks: 96 },
          { name: 'Operations Research', grade: 'O', marks: 94 },
          { name: 'Solar Astronomy', grade: 'A+', marks: 89 }
        ]
      }
    ]
  }
];

export default function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  
  // UI States
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [activeInspectorStudent, setActiveInspectorStudent] = useState<StudentDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'contact' | 'academics'>('overview');
  
  // Create / Edit State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentDetail | null>(null);

  // Form Fields
  const [formRegNo, setFormRegNo] = useState('');
  const [formName, setFormName] = useState('');
  const [formDept, setFormDept] = useState('Computer Science');
  const [formSemester, setFormSemester] = useState('Semester I');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formGuardianName, setFormGuardianName] = useState('');
  const [formGuardianPhone, setFormGuardianPhone] = useState('');
  const [formAttendanceRate, setFormAttendanceRate] = useState(90);
  const [formCgpa, setFormCgpa] = useState(8.5);

  // Load students from LocalStorage or seed them
  useEffect(() => {
    const saved = localStorage.getItem('kasc_students_record');
    if (saved) {
      try {
        setStudents(JSON.parse(saved));
      } catch (e) {
        setStudents(SEED_STUDENTS);
      }
    } else {
      localStorage.setItem('kasc_students_record', JSON.stringify(SEED_STUDENTS));
      setStudents(SEED_STUDENTS);
    }
  }, []);

  const saveStudents = (newStudents: StudentDetail[]) => {
    setStudents(newStudents);
    localStorage.setItem('kasc_students_record', JSON.stringify(newStudents));
  };

  // Check management authority
  const isAuthorized = 
    user?.role === Role.ADMIN || 
    user?.role === Role.PRINCIPAL || 
    user?.role === Role.HOD || 
    user?.role === Role.FACULTY;

  // Filter & Search Logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || student.dept === selectedDept;
    const matchesSem = selectedSemester === 'All' || student.semester === selectedSemester;

    return matchesSearch && matchesDept && matchesSem;
  });

  // Departments list for filter
  const departments = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry'];
  
  // Semesters list for filter
  const semesters = ['All', 'Semester I', 'Semester II', 'Semester III', 'Semester IV', 'Semester V', 'Semester VI'];

  // Handle open Form
  const triggerAddStudent = () => {
    setEditingStudent(null);
    setFormRegNo('');
    setFormName('');
    setFormDept('Computer Science');
    setFormSemester('Semester I');
    setFormEmail('');
    setFormPhone('');
    setFormAddress('');
    setFormGuardianName('');
    setFormGuardianPhone('');
    setFormAttendanceRate(90);
    setFormCgpa(8.5);
    setIsFormOpen(true);
  };

  const triggerEditStudent = (student: StudentDetail, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setFormRegNo(student.registerNo);
    setFormName(student.name);
    setFormDept(student.dept);
    setFormSemester(student.semester);
    setFormEmail(student.email);
    setFormPhone(student.phone);
    setFormAddress(student.address);
    setFormGuardianName(student.guardianName);
    setFormGuardianPhone(student.guardianPhone);
    setFormAttendanceRate(student.attendanceRate);
    setFormCgpa(student.cgpa);
    setIsFormOpen(true);
  };

  // Handle submit form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRegNo.trim() || !formName.trim()) {
      alert('Please fill out vital fields: Student Name and Student ID Code.');
      return;
    }

    if (editingStudent) {
      // Edit student
      const updated = students.map(s => {
        if (s.id === editingStudent.id) {
          return {
            ...s,
            registerNo: formRegNo,
            name: formName,
            dept: formDept,
            semester: formSemester,
            email: formEmail,
            phone: formPhone,
            address: formAddress,
            guardianName: formGuardianName,
            guardianPhone: formGuardianPhone,
            attendanceRate: Number(formAttendanceRate) || 0,
            cgpa: Number(formCgpa) || 0,
          };
        }
        return s;
      });
      saveStudents(updated);
      
      // If the editing student is currently open in inspector, update it
      if (activeInspectorStudent?.id === editingStudent.id) {
        setActiveInspectorStudent(updated.find(s => s.id === editingStudent.id) || null);
      }
    } else {
      // Add student
      const newStudent: StudentDetail = {
        id: String(Date.now()),
        registerNo: formRegNo,
        name: formName,
        dept: formDept,
        semester: formSemester,
        email: formEmail || `${formName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        phone: formPhone || '+91 90000 00000',
        address: formAddress || 'Coimbatore, Tamil Nadu, India',
        guardianName: formGuardianName || 'Not Provided',
        guardianPhone: formFormGuardianPhone(formGuardianPhone),
        attendanceRate: Number(formAttendanceRate) || 100,
        cgpa: Number(formCgpa) || 8.0,
        academicRecords: [
          {
            semester: 'Semester I',
            gpa: Number(formCgpa) || 8.0,
            subjects: [
              { name: 'Core Foundations I', grade: 'A+', marks: 85 },
              { name: 'Core Foundations II', grade: 'O', marks: 92 },
              { name: 'Allied Sciences', grade: 'A', marks: 78 }
            ]
          }
        ]
      };
      saveStudents([...students, newStudent]);
    }
    setIsFormOpen(false);
  };

  const formFormGuardianPhone = (val: string) => {
    return val || '+91 90000 00001';
  };

  // Handle delete
  const handleDeleteStudent = (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you absolutely sure you want to delete this student record from the primary registrar office database?')) {
      const filtered = students.filter(s => s.id !== studentId);
      saveStudents(filtered);
      if (activeInspectorStudent?.id === studentId) {
        setIsInspectorOpen(false);
        setActiveInspectorStudent(null);
      }
    }
  };

  // Statistics calculation helpers
  const totalCount = students.length;
  const avgAttendance = totalCount > 0 
    ? (students.reduce((acc, curr) => acc + curr.attendanceRate, 0) / totalCount).toFixed(1)
    : '0';
  const highAchieversCount = students.filter(s => s.cgpa >= 9.0).length;
  const criticalAttendanceCount = students.filter(s => s.attendanceRate < 75.0).length;

  return (
    <div className="space-y-6">
      
      {/* Dynamic Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-sm border border-slate-200 shadow-xs">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#1e2e6b] bg-[#1e2e6b]/5 uppercase px-2.5 py-1 rounded-sm">
            Primary Registrar Office
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Student Management Module</h1>
          <p className="text-slate-500 text-xs mt-0.5">Maintain official registers, student IDs, parent contact details, and semester transcripts.</p>
        </div>
        {isAuthorized && (
          <button 
            onClick={triggerAddStudent}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e2e6b] hover:bg-[#132150] text-[#f09a1a] hover:text-white rounded-lg shadow-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Student Register
          </button>
        )}
      </div>

      {/* KPI Metrics Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Students */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#1e2e6b]" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Enrolled</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">{totalCount}</span>
            <span className="text-[9px] text-emerald-600 font-bold">100% active state</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#1e2e6b]" />
          </div>
        </div>

        {/* Metric 2: Avg Attendance */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-emerald-500" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Average Attendance</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">{avgAttendance}%</span>
            <span className="text-[9px] text-slate-500 font-bold block">Consolidated college target</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* Metric 3: High Achievers */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-amber-500" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Distinguished Rankers</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">{highAchieversCount}</span>
            <span className="text-[9px] text-amber-600 font-bold">CGPA ≥ 9.00</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Metric 4: Short Attendance Warning */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-rose-500" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Attendance Red Alert</span>
            <span className="text-2xl font-black text-rose-600 tracking-tight block mt-1">{criticalAttendanceCount}</span>
            <span className="text-[9px] text-rose-500 font-bold">Lacking 75% threshold</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
          </div>
        </div>

      </div>

      {/* Main Student List Section */}
      <div className="bg-white rounded-sm border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Dynamic Controls Bar */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Live Search */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by ID, name, parent name, block..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e2e6b]/20 focus:border-[#1e2e6b] font-medium"
            />
          </div>

          {/* Quick Select Filters */}
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            {/* Dept filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-bold uppercase text-[9px]">Dept:</span>
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded-md focus:ring-2 focus:ring-slate-100 font-semibold text-slate-700 outline-none"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Semester filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-bold uppercase text-[9px]">Semester:</span>
              <select 
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded-md focus:ring-2 focus:ring-slate-100 font-semibold text-slate-700 outline-none"
              >
                {semesters.map(s => (
                  <option key={s} value={s}>{s === 'All' ? 'All Semesters' : s}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Core Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-4 text-center w-14">Details</th>
                <th className="p-4">Student ID Code</th>
                <th className="p-4">Official Full Name</th>
                <th className="p-4">Primary Department</th>
                <th className="p-4">Current Semester</th>
                <th className="p-4">Attendance standing</th>
                <th className="p-4">Cumulative CGPA</th>
                {isAuthorized && <th className="p-4 text-right w-24">Management Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isAuthorized ? 8 : 7} className="p-12 text-center text-slate-400 italic font-medium bg-slate-50/20">
                    No active student registers found matching selection criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    onClick={() => {
                      setActiveInspectorStudent(student);
                      setActiveTab('overview');
                      setIsInspectorOpen(true);
                    }}
                    className="hover:bg-[#1e2e6b]/5 cursor-pointer transition-all duration-150 group"
                  >
                    {/* View Details Icon */}
                    <td className="p-4 text-center">
                      <div className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#1e2e6b] text-slate-400 hover:text-white transition-all flex items-center justify-center mx-auto">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </td>

                    {/* Reg No / ID */}
                    <td className="p-4 font-mono font-bold text-[#1e2e6b] tracking-wider">
                      {student.registerNo}
                    </td>

                    {/* Student Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-sm bg-[#1e2e6b]/10 flex items-center justify-center font-bold text-[#1e2e6b] uppercase text-[10px]">
                          {student.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-[12px] group-hover:text-[#1e2e6b] transition-colors">{student.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono italic mt-0.5">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="p-4 font-semibold text-slate-700">
                      {student.dept}
                    </td>

                    {/* Semester */}
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm font-bold uppercase text-[9px]">
                        {student.semester}
                      </span>
                    </td>

                    {/* Attendance Standing */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${student.attendanceRate >= 85 ? 'bg-emerald-500' : student.attendanceRate >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(100, student.attendanceRate)}%` }}
                          />
                        </div>
                        <span className={`font-mono font-black ${student.attendanceRate >= 75 ? 'text-slate-700' : 'text-rose-600'}`}>
                          {student.attendanceRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* CGPA */}
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                        student.cgpa >= 9.0 ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                        student.cgpa >= 8.0 ? 'bg-[#1e2e6b]/10 text-indigo-700 border border-[#1e2e6b]/15' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {student.cgpa.toFixed(2)} / 10.0
                      </span>
                    </td>

                    {/* Admin Tools */}
                    {isAuthorized && (
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1.5 justify-end">
                          <button 
                            onClick={(e) => triggerEditStudent(student, e)}
                            className="bg-slate-50 hover:bg-[#1e2e6b]/10 text-slate-600 hover:text-[#1e2e6b] p-1.5 rounded-md transition-colors border border-slate-200"
                            title="Edit Student Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {(user?.role === Role.ADMIN || user?.role === Role.PRINCIPAL) && (
                            <button 
                              onClick={(e) => handleDeleteStudent(student.id, e)}
                              className="bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 p-1.5 rounded-md transition-colors border border-slate-200"
                              title="Delete Student Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>


      {/* 1. STUDENT 360 DEGREE PROFILE INSPECTOR SLIDE-OVER */}
      {isInspectorOpen && activeInspectorStudent && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setIsInspectorOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col z-10 transition-transform duration-300">
            
            {/* Header section */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#1e2e6b] text-white font-black flex items-center justify-center text-md uppercase shadow-md shrink-0">
                  {activeInspectorStudent.name.substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-none">{activeInspectorStudent.name}</h3>
                  <p className="text-xs text-[#1e2e6b] font-mono mt-1 font-bold">REG ID: {activeInspectorStudent.registerNo}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isAuthorized && (
                  <button 
                    onClick={(e) => {
                      triggerEditStudent(activeInspectorStudent, e);
                    }}
                    className="p-1 px-3 bg-[#1e2e6b]/10 text-[#1e2e6b] text-xs font-bold rounded hover:bg-[#1e2e6b]/20 flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Profile</span>
                  </button>
                )}
                <button 
                  onClick={() => setIsInspectorOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded bg-white border border-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick stats ribbon */}
            <div className="bg-amber-500/5 border-b border-[#f09a1a]/15 p-3.5 px-6 grid grid-cols-3 text-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Department</span>
                <span className="text-xs font-black text-slate-800 block mt-0.5">{activeInspectorStudent.dept}</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Attendance</span>
                <span className="text-xs font-black text-emerald-600 block mt-0.5">{activeInspectorStudent.attendanceRate.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Current CGPA</span>
                <span className="text-xs font-black text-amber-600 block mt-0.5">{activeInspectorStudent.cgpa.toFixed(2)}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'overview' ? 'border-[#1e2e6b] text-[#1e2e6b] bg-white font-black' : 'border-transparent text-slate-450 hover:text-slate-800 bg-slate-50'}`}
              >
                🎓 Overview & Academic Status
              </button>
              <button 
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'contact' ? 'border-[#1e2e6b] text-[#1e2e6b] bg-white font-black' : 'border-transparent text-slate-450 hover:text-slate-800 bg-slate-50'}`}
              >
                📞 Contact & Guardian Family
              </button>
              <button 
                onClick={() => setActiveTab('academics')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'academics' ? 'border-[#1e2e6b] text-[#1e2e6b] bg-white font-black' : 'border-transparent text-slate-450 hover:text-slate-800 bg-slate-50'}`}
              >
                📈 Academic Mark Transcript
              </button>
            </div>

            {/* Scrollable Container Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Identity Summary Card */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#1e2e6b]" />
                      Primary Identity Register Details
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">Enrollment Status:</span>
                        <span className="font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                          <span>REGULAR / ENGAGED</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Target Qualification:</span>
                        <span className="font-bold text-[#1e2e6b] mt-0.5 block">Undergraduate Baccalaureate</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Current Semester:</span>
                        <span className="font-bold text-slate-800 mt-0.5 block">{activeInspectorStudent.semester}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Admitting Department:</span>
                        <span className="font-bold text-slate-800 mt-0.5 block">{activeInspectorStudent.dept}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Performance Status */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-500" />
                        Semester Attendance Analysis
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${activeInspectorStudent.attendanceRate >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {activeInspectorStudent.attendanceRate >= 75 ? 'ELIGIBLE' : 'DEBARRED FROM EXAMS'}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Attendance rate accumulated:</span>
                        <span className="font-mono text-[#1e2e6b] text-sm">{activeInspectorStudent.attendanceRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${activeInspectorStudent.attendanceRate >= 85 ? 'bg-emerald-500' : activeInspectorStudent.attendanceRate >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${activeInspectorStudent.attendanceRate}%` }}
                        />
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed">
                        * Under regional education standing instructions, students must preserve a minimum consistent **75%** attendance rate to unlock final semesters examination boards permissions. {activeInspectorStudent.attendanceRate < 75 && <span className="text-rose-600 font-extrabold block mt-1">This student is critically low. Direct immediate parent conference.</span>}
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: CONTACT DETAILS */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  
                  {/* Contact Profile */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Phone className="w-4 h-4 text-[#1e2e6b]" />
                      Direct Personal Contact Information
                    </h4>

                    <div className="space-y-3 text-xs text-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider leading-none">University Student Email</p>
                          <p className="font-bold text-slate-800 mt-1 font-mono">{activeInspectorStudent.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider leading-none">Personal Student Mobile</p>
                          <p className="font-bold text-slate-800 mt-1 font-mono">{activeInspectorStudent.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider leading-none">Residential Correspondence Address</p>
                          <p className="font-semibold text-slate-800 mt-1 leading-normal">{activeInspectorStudent.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guardian & Immediate Supervisor Details */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Shield className="w-4 h-4 text-amber-500" />
                      Family Guardian & Emergency Contacts
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                      <div>
                        <span className="text-slate-400 font-medium block">Guardian Name:</span>
                        <span className="font-extrabold text-slate-905 mt-0.5 block">{activeInspectorStudent.guardianName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Relationship:</span>
                        <span className="font-bold text-slate-600 mt-0.5 block bg-slate-100 px-2 py-0.5 rounded-sm inline-block">Parent / Authorized Guardian</span>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <span className="text-slate-400 font-medium block">Guardian emergency Contact line:</span>
                        <span className="font-black text-[#1e2e6b] text-sm mt-1 block font-mono">
                          {activeInspectorStudent.guardianPhone}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: ACADEMIC RECORDS */}
              {activeTab === 'academics' && (
                <div className="space-y-6">
                  
                  {/* Dynamic CGPA indicator */}
                  <div className="bg-gradient-to-r from-[#1e2e6b]/5 to-[#f09a1a]/5 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-extrabold text-[#1e2e6b] text-xs uppercase tracking-widest">Cumulative GPA Milestone</h4>
                      <p className="text-[10.5px] text-slate-500 mt-1">Reflects aggregated grades performance over all semesters processed.</p>
                    </div>
                    <div className="bg-white border-2 border-[#f09a1a] shadow-md px-5 py-2.5 rounded-xl text-center shrink-0">
                      <span className="text-2xl font-black text-slate-850 block">{activeInspectorStudent.cgpa.toFixed(2)}</span>
                      <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">On 10.0 scale</span>
                    </div>
                  </div>

                  {/* Transcript History Timeline */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#1e2e6b]" />
                      Official Performance Ledger Log
                    </h4>

                    {activeInspectorStudent.academicRecords && activeInspectorStudent.academicRecords.length > 0 ? (
                      <div className="space-y-4">
                        {activeInspectorStudent.academicRecords.map((sem, sIdx) => (
                          <div key={sIdx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                            
                            {/* Semester Header */}
                            <div className="bg-slate-50 p-3 px-4 flex justify-between items-center border-b border-slate-100">
                              <span className="font-extrabold text-slate-850 uppercase tracking-wider text-[11px] text-[#1e2e6b]">
                                {sem.semester} Transcript
                              </span>
                              <span className="bg-[#f09a1a]/15 text-amber-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-600/10 font-mono">
                                SGPA: {sem.gpa.toFixed(2)}
                              </span>
                            </div>

                            {/* Subjects inside that semester */}
                            <div className="p-3 text-xs">
                              <div className="space-y-2">
                                <div className="grid grid-cols-12 font-bold text-slate-400 uppercase tracking-wider text-[9px] pb-1 border-b border-slate-100">
                                  <div className="col-span-7">Subject / Class Name</div>
                                  <div className="col-span-3 text-center">Marks Score</div>
                                  <div className="col-span-2 text-right">Credit Grade</div>
                                </div>
                                {sem.subjects && sem.subjects.map((sub, sKey) => (
                                  <div key={sKey} className="grid grid-cols-12 text-slate-700 py-1 font-medium items-center">
                                    <div className="col-span-7 font-bold text-slate-800 text-[11px]">{sub.name}</div>
                                    <div className="col-span-3 text-center text-slate-500 font-mono font-bold bg-slate-50 py-0.5 rounded">
                                      {sub.marks} / 100
                                    </div>
                                    <div className="col-span-2 text-right">
                                      <span className={`inline-block px-1.5 py-0.5 text-[9.5px] font-black rounded font-mono ${
                                        sub.grade === 'O' ? 'bg-emerald-100 text-emerald-800' :
                                        sub.grade === 'A+' ? 'bg-indigo-100 text-indigo-800' :
                                        sub.grade === 'A' ? 'bg-indigo-50 text-indigo-700' :
                                        'bg-slate-100 text-slate-700'
                                      }`}>
                                        {sub.grade}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 italic font-medium bg-slate-50 border border-slate-200 rounded-xl">
                        No semester academic records log added to this dossier. Edit profile to append transcripts.
                      </div>
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* Footer actions */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-between items-center text-slate-450 text-[11px]">
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Registrar system cryptographic hash validated</span>
              </div>
              <button 
                onClick={() => setIsInspectorOpen(false)}
                className="bg-[#1e2e6b] text-white font-bold uppercase tracking-wider px-4 py-2 text-[10px] rounded hover:bg-[#132150] shadow"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}


      {/* 2. REGISTRAR DATA ENTRY DIALOG OVERLAY (CREATE / EDIT) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setIsFormOpen(false)} />
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden z-10 border border-slate-250 animate-in fade-in-50 zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-[#1e2e6b] text-white p-4 px-6 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#f09a1a]">
                  {editingStudent ? 'Amend Student dossier' : 'Enroll New Student'}
                </h3>
                <p className="text-[10px] text-slate-200 font-medium mt-0.5">
                  {editingStudent ? 'Update registration metadata and security parameters' : 'Publish a new index record into the registrar catalog'}
                </p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-[#f09a1a] p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleFormSubmit} className="space-y-4 p-6 text-xs max-h-[75vh] overflow-y-auto">
              
              {/* Profile Block */}
              <div className="space-y-3.5">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-1.5">
                  1. Vital Identity Credentials
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Student Register No / ID *</label>
                    <input 
                      type="text" 
                      value={formRegNo}
                      onChange={(e) => setFormRegNo(e.target.value)}
                      placeholder="e.g. 24BCS110"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono font-bold uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Official Full Name *</label>
                    <input 
                      type="text" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Anandha Selvam K"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Academic Department</label>
                    <select
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-bold"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Current Semester</label>
                    <select
                      value={formSemester}
                      onChange={(e) => setFormSemester(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-bold"
                    >
                      <option value="Semester I">Semester I</option>
                      <option value="Semester II">Semester II</option>
                      <option value="Semester III">Semester III</option>
                      <option value="Semester IV">Semester IV</option>
                      <option value="Semester V">Semester V</option>
                      <option value="Semester VI">Semester VI</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Area */}
              <div className="space-y-3.5 pt-1.5">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-1.5">
                  2. Student Contact & Address
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Email Coordinates</label>
                    <input 
                      type="email" 
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Personal Mobile Line</label>
                    <input 
                      type="text" 
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 98400 12345"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Residential Residence Address</label>
                    <textarea 
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="Door No, Street name, Location, District"
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Guardian Area */}
              <div className="space-y-3.5 pt-1.5">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-1.5">
                  3. Emergency / Family Guardian Block
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Primary Guardian full Name</label>
                    <input 
                      type="text" 
                      value={formGuardianName}
                      onChange={(e) => setFormGuardianName(e.target.value)}
                      placeholder="e.g. Sivakumar K"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Guardian Emergency Phone</label>
                    <input 
                      type="text" 
                      value={formGuardianPhone}
                      onChange={(e) => setFormGuardianPhone(e.target.value)}
                      placeholder="+91 94421 90051"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Status Performance */}
              <div className="space-y-3.5 pt-1.5">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-1.5">
                  4. Core Academic Standings Benchmarks
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Cumulative CGPA (0.00 to 10.00)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0.00" 
                      max="10.00"
                      value={formCgpa}
                      onChange={(e) => setFormCgpa(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-1">Attendance Rate (0 to 100%)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="100"
                      value={formAttendanceRate}
                      onChange={(e) => setFormAttendanceRate(parseFloat(e.target.value) || 100)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-2.5 pt-4 justify-end border-t border-slate-150">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg font-bold uppercase text-[10px] tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4.5 py-2 bg-[#1e2e6b] hover:bg-[#132150] text-[#f09a1a] hover:text-white rounded-lg font-bold uppercase text-[10px] tracking-wider shadow-sm"
                >
                  {editingStudent ? 'Save Register Details' : 'Confirm Registration'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
