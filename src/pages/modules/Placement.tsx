import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { 
  Briefcase, Building2, MapPin, Calendar, DollarSign, Search, Plus, 
  Users, CheckCircle, XCircle, Clock, BookOpen, AlertTriangle, 
  ArrowRight, FileText, Check, TrendingUp, Bell, BadgeAlert, 
  Edit2, Trash2, Eye, UserCheck, X, Award, Percent
} from 'lucide-react';

interface JobOpportunity {
  id: string;
  company: string;
  designation: string;
  packageLCR: number; // in LPA (Lakhs Per Annum)
  eligibilityCgpa: number;
  location: string;
  driveDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  status: 'OPEN' | 'CLOSED' | 'ONGOING';
  registeredCount: number;
}

interface PlacementRegister {
  id: string;
  opportunityId: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  studentCgpa: number;
  studentDept: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'TEST_CLEARED' | 'INTERVIEWING' | 'SELECTED' | 'REJECTED';
  appliedAt: string;
}

interface PlacementNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  isImportant: boolean;
}

const SEED_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'opp-1',
    company: 'Tata Consultancy Services (TCS)',
    designation: 'Cognitive Business Analyst / Software Engineer',
    packageLCR: 4.5,
    eligibilityCgpa: 6.5,
    location: 'Coimbatore, TN',
    driveDate: '2026-07-15',
    deadline: '2026-07-05',
    description: 'TCS is hiring for Ninja and Digital streams for various development and analytics profiles. Pre-assessment scores are validated.',
    requirements: ['SQL Query Skills', 'Foundational Java / Python', 'Quantitative Aptitude'],
    status: 'OPEN',
    registeredCount: 38
  },
  {
    id: 'opp-2',
    company: 'Cognizant Technology Solutions',
    designation: 'GenC Developer Assistant / QA Automation Cadet',
    packageLCR: 5.2,
    eligibilityCgpa: 7.0,
    location: 'Chennai / Coimbatore',
    driveDate: '2026-07-22',
    deadline: '2026-07-10',
    description: 'Cognizant campus program recruits multi-skilled computer technicians for AI-driven modern delivery teams.',
    requirements: ['Data Structures & Algorithms', 'Strong English Communication', 'Problem Solving Logic'],
    status: 'OPEN',
    registeredCount: 22
  },
  {
    id: 'opp-3',
    company: 'Zoho Corporation',
    designation: 'Associate Member Technical Staff (MTS)',
    packageLCR: 8.5,
    eligibilityCgpa: 7.5,
    location: 'Tenkasi / Estancia Chennai',
    driveDate: '2026-08-01',
    deadline: '2026-07-28',
    description: 'Build enterprise operating systems of SaaS scaling architectures. High degree of focus on standalone backend builds.',
    requirements: ['Advanced Java backend concepts', 'Relational Database expertise', 'System Core Design'],
    status: 'OPEN',
    registeredCount: 15
  },
  {
    id: 'opp-4',
    company: 'Wipro Technologies',
    designation: 'Elite National Talent Hunt Stream (NLTH)',
    packageLCR: 3.8,
    eligibilityCgpa: 6.0,
    location: 'Bangalore / Coimbatore',
    driveDate: '2026-06-12',
    deadline: '2026-06-03',
    description: 'Consolidated hiring for infrastructure management services and general software development batches.',
    requirements: ['Technical Writing', 'Object Oriented Programming', 'Basic Networking'],
    status: 'CLOSED',
    registeredCount: 84
  }
];

const SEED_REGISTERS: PlacementRegister[] = [
  {
    id: 'reg-1',
    opportunityId: 'opp-1',
    studentId: '1',
    studentName: 'Arun Kumar S',
    studentRegNo: '24BCS101',
    studentCgpa: 8.85,
    studentDept: 'Computer Science',
    status: 'APPLIED',
    appliedAt: '2026-06-18T10:30:00Z'
  },
  {
    id: 'reg-2',
    opportunityId: 'opp-1',
    studentId: '2',
    studentName: 'Divya Bharathi R',
    studentRegNo: '24BCS102',
    studentCgpa: 9.12,
    studentDept: 'Computer Science',
    status: 'SHORTLISTED',
    appliedAt: '2026-06-18T11:00:00Z'
  },
  {
    id: 'reg-3',
    opportunityId: 'opp-4',
    studentId: '1',
    studentName: 'Arun Kumar S',
    studentRegNo: '24BCS101',
    studentCgpa: 8.85,
    studentDept: 'Computer Science',
    status: 'SELECTED',
    appliedAt: '2026-06-01T09:12:00Z'
  },
  {
    id: 'reg-4',
    opportunityId: 'opp-4',
    studentId: '4',
    studentName: 'Kavitha Srinivasan',
    studentRegNo: '23BMA301',
    studentCgpa: 9.40,
    studentDept: 'Mathematics',
    status: 'SELECTED',
    appliedAt: '2026-06-01T08:45:00Z'
  }
];

const SEED_NOTIFICATIONS: PlacementNotification[] = [
  {
    id: 'not-1',
    title: 'Resume Verification Deadline',
    message: 'All registered 2026 passing-out students must submit their visual resumes to the Department placement desk for review.',
    date: '2026-06-20',
    isImportant: true
  },
  {
    id: 'not-2',
    title: 'Free Aptitude Training BootCamp',
    message: 'Special quantitative aptitude offline workshop starts next Monday at APJ Abdul Kalam Block Seminar Hall.',
    date: '2026-06-19',
    isImportant: false
  }
];

export default function Placement() {
  const { user } = useAuth();
  
  // Storage keys matching persistence rules
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [registers, setRegisters] = useState<PlacementRegister[]>([]);
  const [notifications, setNotifications] = useState<PlacementNotification[]>([]);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'OPEN' | 'CLOSED' | 'ONGOING'>('ALL');
  
  // Interactive Dialog UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<JobOpportunity | null>(null);
  
  // Job Form fields
  const [formCompany, setFormCompany] = useState('');
  const [formDesignation, setFormDesignation] = useState('');
  const [formPackage, setFormPackage] = useState(4.0);
  const [formCgpaTarget, setFormCgpaTarget] = useState(6.0);
  const [formLocation, setFormLocation] = useState('');
  const [formDriveDate, setFormDriveDate] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formReqStr, setFormReqStr] = useState('');

  // Detailed inspectors
  const [selectedOpp, setSelectedOpp] = useState<JobOpportunity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'details' | 'candidates'>('details');

  // Load persistence states
  useEffect(() => {
    const savedOpps = localStorage.getItem('kasc_placement_opportunities');
    const savedRegs = localStorage.getItem('kasc_placement_registers');
    const savedNots = localStorage.getItem('kasc_placement_notifs');
    
    if (savedOpps) {
      setOpportunities(JSON.parse(savedOpps));
    } else {
      localStorage.setItem('kasc_placement_opportunities', JSON.stringify(SEED_OPPORTUNITIES));
      setOpportunities(SEED_OPPORTUNITIES);
    }

    if (savedRegs) {
      setRegisters(JSON.parse(savedRegs));
    } else {
      localStorage.setItem('kasc_placement_registers', JSON.stringify(SEED_REGISTERS));
      setRegisters(SEED_REGISTERS);
    }

    if (savedNots) {
      setNotifications(JSON.parse(savedNots));
    } else {
      localStorage.setItem('kasc_placement_notifs', JSON.stringify(SEED_NOTIFICATIONS));
      setNotifications(SEED_NOTIFICATIONS);
    }
  }, []);

  const saveOpps = (data: JobOpportunity[]) => {
    setOpportunities(data);
    localStorage.setItem('kasc_placement_opportunities', JSON.stringify(data));
  };

  const saveRegs = (data: PlacementRegister[]) => {
    setRegisters(data);
    localStorage.setItem('kasc_placement_registers', JSON.stringify(data));
  };

  const saveNots = (data: PlacementNotification[]) => {
    setNotifications(data);
    localStorage.setItem('kasc_placement_notifs', JSON.stringify(data));
  };

  // Check roles: Admins, HOD, and placement coordinators/faculty can manage jobs & candidates
  const isOfficer = 
    user?.role === Role.ADMIN || 
    user?.role === Role.PRINCIPAL || 
    user?.role === Role.HOD || 
    user?.role === Role.FACULTY;

  // Simulate active student context for registration checks
  const currentStudentId = user?.role === Role.STUDENT ? '1' : 'guest-stu'; 
  const currentStudentName = user?.name || 'Guest Cadet';
  const currentStudentRegNo = user?.role === Role.STUDENT ? '24BCS101' : 'REG-GUEST';
  const currentStudentCgpa = 8.85; // Simulated verified CGPA matching Arun Kumar
  const currentStudentDept = 'Computer Science';

  // Handles quick submission of recruitment registration by a Student
  const registerStudentDrive = (opportunity: JobOpportunity) => {
    if (user?.role !== Role.STUDENT) {
      alert('Simulation Desk: Please authenticate as a Student Role to sign register files for drives.');
      return;
    }

    // CGPA verification check
    if (currentStudentCgpa < opportunity.eligibilityCgpa) {
      alert(`Access Restricted! This company drive eligibility threshold is ${opportunity.eligibilityCgpa.toFixed(2)} CGPA, whereas your consolidated record is ${currentStudentCgpa.toFixed(2)} CGPA.`);
      return;
    }

    // Check if duplicate entry
    const isAlreadyRegistered = registers.some(r => r.opportunityId === opportunity.id && r.studentId === currentStudentId);
    if (isAlreadyRegistered) {
      alert('Registry Confirmed: You have already submitted your candidate dossier to this recruiter.');
      return;
    }

    const newRegister: PlacementRegister = {
      id: `reg-${Date.now()}`,
      opportunityId: opportunity.id,
      studentId: currentStudentId,
      studentName: currentStudentName,
      studentRegNo: currentStudentRegNo,
      studentCgpa: currentStudentCgpa,
      studentDept: currentStudentDept,
      status: 'APPLIED',
      appliedAt: new Date().toISOString()
    };

    const newRegs = [...registers, newRegister];
    saveRegs(newRegs);

    // Update opportunity registration counters
    const updatedOpps = opportunities.map(o => {
      if (o.id === opportunity.id) {
        return { ...o, registeredCount: o.registeredCount + 1 };
      }
      return o;
    });
    saveOpps(updatedOpps);

    // Update local selected target
    if (selectedOpp?.id === opportunity.id) {
      setSelectedOpp({ ...selectedOpp, registeredCount: selectedOpp.registeredCount + 1 });
    }

    alert(`Drive Registry Success! Welcome to ${opportunity.company} campus drive.`);
  };

  // Filter logic
  const filteredOpps = opportunities.filter(o => {
    const matchesSearch = o.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.designation.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Placement metrics calculation
  const totalOffersCount = registers.filter(r => r.status === 'SELECTED').length;
  const interviewingCount = registers.filter(r => r.status === 'INTERVIEWING').length;

  const triggerAddOpportunity = () => {
    setEditingOpportunity(null);
    setFormCompany('');
    setFormDesignation('');
    setFormPackage(4.5);
    setFormCgpaTarget(6.0);
    setFormLocation('Coimbatore, TN');
    setFormDriveDate('2026-07-30');
    setFormDeadline('2026-07-25');
    setFormDesc('');
    setFormReqStr('');
    setIsFormOpen(true);
  };

  const triggerEditOpportunity = (opp: JobOpportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOpportunity(opp);
    setFormCompany(opp.company);
    setFormDesignation(opp.designation);
    setFormPackage(opp.packageLCR);
    setFormCgpaTarget(opp.eligibilityCgpa);
    setFormLocation(opp.location);
    setFormDriveDate(opp.driveDate);
    setFormDeadline(opp.deadline);
    setFormDesc(opp.description);
    setFormReqStr(opp.requirements.join(', '));
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim() || !formDesignation.trim()) {
      alert('Company Name and Designation correspond to mandatory catalog indexes.');
      return;
    }

    const requirementsArr = formReqStr
      ? formReqStr.split(',').map(s => s.trim()).filter(Boolean)
      : ['Foundational General Aptitude', 'Communication Skill'];

    if (editingOpportunity) {
      const updatedList = opportunities.map(o => {
        if (o.id === editingOpportunity.id) {
          return {
            ...o,
            company: formCompany,
            designation: formDesignation,
            packageLCR: Number(formPackage) || 3.0,
            eligibilityCgpa: Number(formCgpaTarget) || 6.0,
            location: formLocation,
            driveDate: formDriveDate,
            deadline: formDeadline,
            description: formDesc,
            requirements: requirementsArr
          };
        }
        return o;
      });
      saveOpps(updatedList);
    } else {
      const newOpp: JobOpportunity = {
        id: `opp-${Date.now()}`,
        company: formCompany,
        designation: formDesignation,
        packageLCR: Number(formPackage) || 3.0,
        eligibilityCgpa: Number(formCgpaTarget) || 6.0,
        location: formLocation,
        driveDate: formDriveDate,
        deadline: formDeadline,
        description: formDesc || 'Consolidated recruitment drive for KASC Engineering and Applied Sciences departments.',
        requirements: requirementsArr,
        status: 'OPEN',
        registeredCount: 0
      };
      saveOpps([...opportunities, newOpp]);
    }

    setIsFormOpen(false);
  };

  const handleDeleteOpportunity = (oppId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this company recruitment posting? Corresponding applicant entries will remain in history logs.')) {
      const updated = opportunities.filter(o => o.id !== oppId);
      saveOpps(updated);
      if (selectedOpp?.id === oppId) {
        setIsDetailOpen(false);
      }
    }
  };

  const updateCandidateStatus = (regId: string, statusVal: 'APPLIED' | 'SHORTLISTED' | 'TEST_CLEARED' | 'INTERVIEWING' | 'SELECTED' | 'REJECTED') => {
    const updated = registers.map(r => {
      if (r.id === regId) {
        return { ...r, status: statusVal };
      }
      return r;
    });
    saveRegs(updated);
    alert(`Status updated to ${statusVal} successfully!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-sm border border-slate-200 shadow-xs">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#1e2e6b] bg-[#1e2e6b]/5 uppercase px-2.5 py-1 rounded-sm">
            KASC Training & Placement Cell (CRD-UNIT)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Placement Management Module</h1>
          <p className="text-slate-500 text-xs mt-0.5">Register for corporate recruiters, download evaluation kits, and monitor eligibility credentials dynamically.</p>
        </div>
        {isOfficer && (
          <button 
            onClick={triggerAddOpportunity}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e2e6b] hover:bg-[#132150] text-[#f09a1a] hover:text-white rounded-lg shadow-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Post New Opportunity
          </button>
        )}
      </div>

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Postings */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#1e2e6b]" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Drives</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">
              {opportunities.filter(o => o.status === 'OPEN').length}
            </span>
            <span className="text-[9px] text-[#1e2e6b] font-bold">Ongoing schedules</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-[#1e2e6b]" />
          </div>
        </div>

        {/* KPI 2: Placed Cadets */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-emerald-500" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Placed</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">{totalOffersCount}</span>
            <span className="text-[9px] text-emerald-600 font-bold block">Consolidated offer letters</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* KPI 3: In Assessment */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-amber-500" />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">In Assessment</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">{interviewingCount + registers.filter(r => r.status === 'SHORTLISTED').length}</span>
            <span className="text-[9px] text-amber-600 font-bold">Awaiting evaluation round</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* KPI 4: Top Package CTC */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-indigo-505" style={{ backgroundColor: '#f09a1a' }} />
          <div className="pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">High CTC Package</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">
              {opportunities.length ? Math.max(...opportunities.map(o => o.packageLCR)).toFixed(1) : '0.0'} LPA
            </span>
            <span className="text-[9px] text-indigo-650 font-bold">Highest salary index</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: OPPORTUNITIES DIRECTORY & REGISTERS (SPAN 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main List Widget Container */}
          <div className="bg-white rounded-sm border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Control Bar */}
            <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search recruiters or skills..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 bg-white text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e2e6b]/20 font-semibold"
                />
              </div>

              <div className="flex gap-2 text-xs font-semibold items-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Filing:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-300 outline-none text-slate-700"
                >
                  <option value="ALL">All States</option>
                  <option value="OPEN">Open Openings</option>
                  <option value="CLOSED">Closed Drives</option>
                  <option value="ONGOING">Ongoing Assessments</option>
                </select>
              </div>

            </div>

            {/* List block */}
            <div className="divide-y divide-slate-150">
              {filteredOpps.length === 0 ? (
                <div className="p-12 text-center text-slate-400 italic">
                  No recruitment posting match selected parameters.
                </div>
              ) : (
                filteredOpps.map((opp) => {
                  const hasApplied = registers.some(r => r.opportunityId === opp.id && r.studentId === currentStudentId);
                  const isEligible = currentStudentCgpa >= opp.eligibilityCgpa;
                  
                  return (
                    <div 
                      key={opp.id} 
                      onClick={() => {
                        setSelectedOpp(opp);
                        setActiveInspectorTab('details');
                        setIsDetailOpen(true);
                      }}
                      className="p-5 hover:bg-slate-50 transition-all cursor-pointer group"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        
                        <div className="space-y-2">
                          
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 bg-[#1e2e6b]/10 text-[#1e2e6b] rounded flex items-center justify-center font-bold">
                              <Building2 className="w-4 h-4" />
                            </span>
                            <div>
                              <p className="font-extrabold text-slate-900 group-hover:text-[#1e2e6b] transition-colors">{opp.company}</p>
                              <p className="text-slate-500 font-bold text-xs">{opp.designation}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 pt-1">
                            <span className="flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <strong className="text-slate-700 font-mono font-black">{opp.packageLCR.toFixed(2)} LPA</strong>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{opp.location}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Cut-off: <strong className="font-mono">{opp.eligibilityCgpa.toFixed(1)} CGPA</strong></span>
                            </span>
                          </div>

                        </div>

                        <div className="flex items-center gap-3.5 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
                          
                          <div className="text-left sm:text-right hidden sm:block">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Drive Date</span>
                            <span className="text-slate-700 font-bold font-mono text-xs">{opp.driveDate}</span>
                          </div>

                          {opp.status === 'CLOSED' ? (
                            <span className="bg-slate-100 text-slate-400 border border-slate-200 text-[10px] font-black uppercase px-2 py-1 rounded">
                              Registration Closed
                            </span>
                          ) : hasApplied ? (
                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" />
                              Applied
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                registerStudentDrive(opp);
                              }}
                              className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all duration-150 relative overflow-hidden ${
                                isEligible 
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                                  : 'bg-rose-50 border border-rose-200 text-rose-600 cursor-not-allowed'
                              }`}
                              title={isEligible ? 'Sign Up for Drive' : 'CGPA Criteria Unmet'}
                            >
                              {isEligible ? 'Register Drive' : 'Lacking CGPA'}
                            </button>
                          )}

                          {isOfficer && (
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={(e) => triggerEditOpportunity(opp, e)}
                                className="p-1 text-slate-400 hover:text-[#1e2e6b] border border-slate-200 rounded"
                                title="Edit Opening"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={(e) => handleDeleteOpportunity(opp.id, e)}
                                className="p-1 text-slate-400 hover:text-rose-600 border border-slate-200 rounded"
                                title="Delete Posting"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Student Dossier Status Tracker Widget */}
          {user?.role === Role.STUDENT && (
            <div className="bg-amber-500/5 p-5 rounded-sm border border-[#f09a1a]/20 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Your Local Placement Dossier</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">Below are your simulated application stages. Keep profiles updated.</p>
                </div>
              </div>

              {/* Status table */}
              <div className="bg-white rounded border border-slate-250/70 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                    <tr>
                      <th className="p-3">Recruiter</th>
                      <th className="p-3">Role Designation</th>
                      <th className="p-3">Package Offered</th>
                      <th className="p-3">Current Gateway Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {registers.filter(r => r.studentId === currentStudentId).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                          You have not registered for any placement drives yet. Use the green "Register Drive" filters above.
                        </td>
                      </tr>
                    ) : (
                      registers.filter(r => r.studentId === currentStudentId).map((reg) => {
                        const opp = opportunities.find(o => o.id === reg.opportunityId);
                        return (
                          <tr key={reg.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-extrabold text-[#1e2e6b]">{opp?.company || 'N/A'}</td>
                            <td className="p-3 font-semibold text-slate-700">{opp?.designation || 'N/A'}</td>
                            <td className="p-3 font-mono font-bold text-slate-800">{opp?.packageLCR.toFixed(1)} LPA</td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-mono font-black rounded ${
                                reg.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800' :
                                reg.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                                reg.status === 'INTERVIEWING' ? 'bg-indigo-100 text-indigo-800 animate-pulse' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: NOTIFICATIONS & LIVE PLACEMENT FEEDS (SPAN 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Placement Notice Hub */}
          <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
            
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1e2e6b]" />
                Announcements Board (Cell)
              </h3>
              <span className="bg-[#1e2e6b]/5 text-[#1e2e6b] font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                Live
              </span>
            </div>

            <div className="p-4 divide-y divide-slate-150 space-y-3.5">
              {notifications.map((not) => (
                <div key={not.id} className="pt-3.5 first:pt-0 space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-extrabold text-slate-800 text-xs leading-snug">{not.title}</p>
                    {not.isImportant && (
                      <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm shrink-0">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{not.message}</p>
                  <p className="text-[10px] text-slate-400 font-mono italic">{not.date}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Preparation Resource Links */}
          <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-4 space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Practice Kits & resources
            </h3>

            <div className="space-y-3">
              {[
                { title: 'TCS NQT Prep Kit 2026', desc: 'Mock logic, quantitative reasoning tests with detailed answer blueprints.', format: 'PDF (2.8 MB)' },
                { title: 'Resume Checklist / Standards', desc: 'Pre-approved formatting instructions for Kongunadu campus placements.', format: 'DOCX (1.2 MB)' },
                { title: 'Core Subjects Crash Guide', desc: 'OOPS, Database Queries, Operating Systems fundamental transcripts.', format: 'Interactive' }
              ].map((res, idx) => (
                <div key={idx} className="p-3 border border-slate-100 rounded-lg hover:border-[#1e2e6b]/20 transition-all flex justify-between items-center bg-slate-50/50">
                  <div className="space-y-0.5 pr-2">
                    <p className="font-extrabold text-slate-800 text-xs">{res.title}</p>
                    <p className="text-slate-400 text-[10.5px] leading-snug">{res.desc}</p>
                  </div>
                  <span className="text-[9px] bg-[#1e2e6b]/10 text-[#1e2e6b] font-bold px-1.5 py-0.5 rounded uppercase font-mono shrink-0">
                    Get
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Mock CV status */}
          <div className="bg-[#1e2e6b] text-white p-5 rounded-sm shadow-md space-y-4">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              CRD-UNIT Readiness Checklist
            </h3>
            
            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">✓</span>
                <span>CGPA Verified (Arun Kumar: 8.85)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">✓</span>
                <span>Aptitude Bootcamp Attendance (Passed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">✓</span>
                <span>Mock Interview Round 1 (Completed)</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed italic">
              * Verification flags are managed directly by placement officers. If flags are unchecked, coordinate with administrative desk.
            </p>
          </div>

        </div>

      </div>


      {/* 360 COMPANY OPPORTUNITY DETAILS & CANDIDATE REGISTRY MODAL */}
      {isDetailOpen && selectedOpp && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setIsDetailOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col z-10 transition-transform duration-300 animate-in slide-in-from-right">
            
            {/* Header section */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-[#1e2e6b] text-white rounded flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">{selectedOpp.company}</h3>
                  <p className="text-xs text-slate-500 font-bold">{selectedOpp.designation} • {selectedOpp.location}</p>
                </div>
              </div>

              <button 
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded bg-white border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick stats panel */}
            <div className="bg-[#1e2e6b] text-white p-3 px-6 grid grid-cols-3 text-center text-xs">
              <div className="border-r border-white/10">
                <span className="text-[9px] uppercase font-bold text-slate-300 block tracking-widest">Offered CTC</span>
                <span className="text-md font-black text-[#f09a1a] block mt-0.5">{selectedOpp.packageLCR.toFixed(1)} LPA</span>
              </div>
              <div className="border-r border-white/10">
                <span className="text-[9px] uppercase font-bold text-slate-300 block tracking-widest">Eligibility cut-off</span>
                <span className="text-md font-black text-slate-200 block mt-0.5">{selectedOpp.eligibilityCgpa.toFixed(1)} CGPA</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-300 block tracking-widest">Registrations</span>
                <span className="text-md font-black text-emerald-400 block mt-0.5">{selectedOpp.registeredCount} Students</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setActiveInspectorTab('details')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeInspectorTab === 'details' ? 'border-[#1e2e6b] text-[#1e2e6b] bg-white font-black' : 'border-transparent text-slate-450 hover:text-slate-800 bg-slate-50'}`}
              >
                💼 Job Details & Briefing
              </button>
              <button 
                onClick={() => setActiveInspectorTab('candidates')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeInspectorTab === 'candidates' ? 'border-[#1e2e6b] text-[#1e2e6b] bg-white font-black' : 'border-transparent text-slate-450 hover:text-slate-800 bg-slate-50'}`}
              >
                🎓 Candidate Registrations ({registers.filter(r => r.opportunityId === selectedOpp.id).length})
              </button>
            </div>

            {/* Scrollable Container Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: JOB DETAILS */}
              {activeInspectorTab === 'details' && (
                <div className="space-y-5 text-xs">
                  
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-800 text-xs upper-case tracking-wider uppercase">Designation Description</h4>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      {selectedOpp.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Required Skills & Capabilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedOpp.requirements.map((req, ridx) => (
                        <div key={ridx} className="flex items-center gap-2 p-2 px-3 bg-white border border-slate-200 rounded-lg">
                          <span className="w-1.5 h-1.5 bg-[#f09a1a] rounded-full shrink-0" />
                          <span className="text-slate-700 font-semibold">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-500/5 p-4 rounded-xl border border-[#f09a1a]/20 space-y-3">
                    <h4 className="font-extrabold text-amber-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Strict drive Guidelines
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Only candidates retaining verified academic clear standing on Drive Day will be allowed inside presentation halls. Latecomers lack credentials validation and will face immediate disqualification.
                    </p>
                  </div>

                </div>
              )}

              {/* TAB 2: CANDIDATE REGISTRATIONS (Placement officer / HOD view with editing rights) */}
              {activeInspectorTab === 'candidates' && (
                <div className="space-y-4 text-xs">
                  
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-150">
                    <span className="font-extrabold text-slate-700">Recruitment Candidate Directory</span>
                    <span className="bg-[#1e2e6b] text-white font-mono text-[10px] px-2.5 py-0.5 rounded font-bold">
                      {registers.filter(r => r.opportunityId === selectedOpp.id).length} Enrolled
                    </span>
                  </div>

                  <div className="space-y-3">
                    {registers.filter(r => r.opportunityId === selectedOpp.id).length === 0 ? (
                      <p className="text-slate-400 italic text-center py-10">No students registered to this drive yet.</p>
                    ) : (
                      registers.filter(r => r.opportunityId === selectedOpp.id).map((reg) => (
                        <div key={reg.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-800 text-[13px]">{reg.studentName}</span>
                              <span className="text-[10px] text-slate-405 italic bg-slate-50 px-1.5 py-0.5 rounded border border-slate-150">{reg.studentDept}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-mono">
                              <span>ID: <strong>{reg.studentRegNo}</strong></span>
                              <span>•</span>
                              <span>CGPA: <strong>{reg.studentCgpa.toFixed(2)}</strong></span>
                            </div>
                          </div>

                          {/* Candidate Selection Authority */}
                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                            {isOfficer ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 uppercase font-black">Rank:</span>
                                <select
                                  value={reg.status}
                                  onChange={(e) => updateCandidateStatus(reg.id, e.target.value as any)}
                                  className="bg-slate-50 border border-slate-200 text-[11px] px-2 py-1 rounded font-bold outline-none text-slate-700"
                                >
                                  <option value="APPLIED">Applied</option>
                                  <option value="SHORTLISTED">Shortlisted</option>
                                  <option value="TEST_CLEARED">Test Cleared</option>
                                  <option value="INTERVIEWING">Interviewing</option>
                                  <option value="SELECTED">Selected</option>
                                  <option value="REJECTED">Rejected</option>
                                </select>
                              </div>
                            ) : (
                              <span className={`inline-block px-2.5 py-1 text-[10px] uppercase font-mono font-black rounded-sm ${
                                reg.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800' :
                                reg.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                                'bg-slate-150 text-slate-650'
                              }`}>
                                {reg.status}
                              </span>
                            )}
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="bg-slate-55 border-t border-slate-200 p-4 px-6 flex justify-between items-center text-slate-450 text-[11px] bg-slate-50">
              <span className="font-mono">CRD-POSTING-SECURE-HASH</span>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="bg-[#1e2e6b] text-white font-bold uppercase tracking-wider px-4 py-2 text-[10px] rounded hover:bg-[#132150]"
              >
                Close Listing
              </button>
            </div>

          </div>
        </div>
      )}


      {/* FORM OVERLAY (ADD / EDIT RECRUITMENT POSTING) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setIsFormOpen(false)} />
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden z-10 border border-slate-250 animate-in zoom-in-95 duration-150">
            
            <div className="bg-[#1e2e6b] text-white p-4 px-6 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {editingOpportunity ? 'Edit Placement Opportunity' : 'Post Placement Opportunity'}
                </h3>
                <p className="text-[10px] text-slate-200 mt-0.5">Publish drive specs and cut-offs for upcoming recruiter companies.</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-white hover:text-amber-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 uppercase font-black tracking-wider text-[9px] mb-1">Company Recruiter *</label>
                  <input 
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase font-black tracking-wider text-[9px] mb-1">Designation Position *</label>
                  <input 
                    type="text"
                    required
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    placeholder="e.g. AWS Cadet Associate"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 uppercase font-black tracking-wider text-[9px] mb-1">Package LPA (CTC) *</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    value={formPackage}
                    onChange={(e) => setFormPackage(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase font-black tracking-wider text-[9px] mb-1">Cut-Off GPA (0-10) *</label>
                  <input 
                    type="number"
                    step="0.05"
                    max="10"
                    required
                    value={formCgpaTarget}
                    onChange={(e) => setFormCgpaTarget(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-slate-500 uppercase font-black tracking-wider text-[9px] mb-1">Location</label>
                  <input 
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-slate-500 uppercase font-black tracking-wider text-[9px] mb-1">Drive Date</label>
                  <input 
                    type="date"
                    value={formDriveDate}
                    onChange={(e) => setFormDriveDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-slate-500 uppercase font-black tracking-wider text-[9px] mb-1">Filing Deadline</label>
                  <input 
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase font-black tracking-wider text-[9px] mb-1">Recruitment Description</label>
                <textarea 
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Summarize key responsibilities, training streams, and selection benchmarks."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase font-black tracking-wider text-[9px] mb-1">Required Skills (Comma separated)</label>
                <input 
                  type="text"
                  value={formReqStr}
                  onChange={(e) => setFormReqStr(e.target.value)}
                  placeholder="Java backend, SQL Queries, React basics"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 bg-slate-100 font-bold uppercase rounded-sm tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1e2e6b] text-white font-extrabold uppercase rounded-sm text-[#f09a1a] hover:text-white hover:bg-[#132150] tracking-wider shadow"
                >
                  Save Posting
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
