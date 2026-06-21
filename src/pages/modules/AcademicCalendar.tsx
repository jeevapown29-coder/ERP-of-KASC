import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { jsPDF } from 'jspdf';
import { 
  Calendar as CalendarIcon, Clock, Search, Filter, AlertTriangle, 
  CheckCircle, PlusCircle, Trash2, Download, Bell, BellOff, Info, CalendarDays, MapPin, FileText
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'exam' | 'deadline' | 'holiday' | 'event';
  date: string;
  timeLine?: string;
  courseRelation?: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  venue?: string;
  lastUpdated?: string;
  dayOrder?: string;
  workingDay?: number;
}

const DEFAULT_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'kasc-event-1',
    title: 'Opening for the Academic Year 2026-2027',
    type: 'event',
    date: '2026-06-15',
    timeLine: '09:30 AM onwards',
    courseRelation: 'All UG & PG Courses (Aided & Self-Financed)',
    description: 'Welcome back and central induction ceremony. Briefing on the code of conduct, course curricula, and semester guidelines.',
    priority: 'high',
    venue: 'Main College Grounds / Respective Classrooms',
    dayOrder: 'I',
    workingDay: 1
  },
  {
    id: 'kasc-event-2',
    title: 'Commencement of Regular Syllabus Classes',
    type: 'event',
    date: '2026-06-22',
    timeLine: '08:45 AM - 04:00 PM',
    courseRelation: 'All UG & PG Streams',
    description: 'Regular academic syllabus classes and laboratory sessions commence for all years in full alignment with the odd-semester curriculum.',
    priority: 'high',
    venue: 'Respective Department Classrooms',
    dayOrder: 'I',
    workingDay: 7
  },
  {
    id: 'kasc-event-3',
    title: 'Muharram - Holiday',
    type: 'holiday',
    date: '2026-06-26',
    timeLine: 'Full Day Campus closed',
    courseRelation: 'All Departments / Staff / Students',
    description: 'Academic holiday observed across the institution for Muharram festival.',
    priority: 'medium',
    dayOrder: '-',
    workingDay: undefined
  },
  {
    id: 'kasc-event-4',
    title: 'IQAC Faculty Review & Audit Council',
    type: 'event',
    date: '2026-07-17',
    timeLine: '11:00 AM - 01:30 PM',
    courseRelation: 'Academic Deans, Registrar & IQAC Members',
    description: 'Internal Quality Assurance Cell (IQAC) evaluation on odd semester lesson planning, lab setup compliance, and NAAC dossier progress.',
    priority: 'medium',
    venue: 'Executive Boardroom',
    dayOrder: 'II',
    workingDay: 26
  },
  {
    id: 'kasc-event-5',
    title: 'Last Date for Submission of Question Papers for I CIA Exams',
    type: 'deadline',
    date: '2026-07-29',
    timeLine: 'Before 04:30 PM IST',
    courseRelation: 'All Academic Faculty Members',
    description: 'Cut-off deadline for academic faculty to submit compiled Continuous Internal Assessment (I CIA) question blueprints to the Controller of Examinations.',
    priority: 'high',
    venue: 'Controller of Examinations (COE) Office',
    dayOrder: 'IV',
    workingDay: 34
  },
  {
    id: 'kasc-event-6',
    title: 'Issue of End-Semester Examination (ESE) Applications',
    type: 'deadline',
    date: '2026-07-30',
    timeLine: 'Office Hours',
    courseRelation: 'All Programmes (Except Year I PG Students)',
    description: 'Release of End Semester Examination (ESE) application draft forms on the student portal for verification and enrollment.',
    priority: 'high',
    venue: 'COE Registration Portal / Department Desk',
    dayOrder: 'V',
    workingDay: 35
  },
  {
    id: 'kasc-event-7',
    title: 'Adi Peruku - Regional Festival Holiday',
    type: 'holiday',
    date: '2026-08-03',
    timeLine: 'Full Day Break',
    courseRelation: 'All Campus Sections',
    description: 'Regional festive holiday declared for Aadi Perukku state-wide celebration.',
    priority: 'medium',
    dayOrder: '-',
    workingDay: undefined
  },
  {
    id: 'kasc-event-8',
    title: 'Last Date for Payment of ESE Fee with NO fine',
    type: 'deadline',
    date: '2026-08-07',
    timeLine: 'Accounts Section Closing Hours',
    courseRelation: 'All Registered UG & PG Students (Except I PG)',
    description: 'Final date to deposit the regular End-Semester Examination fees without incurring added penalty / penance fines.',
    priority: 'high',
    venue: 'College Administrative Accounts Desk / Online Gateway',
    dayOrder: 'IV',
    workingDay: 40
  },
  {
    id: 'kasc-event-9',
    title: 'Commencement of I CIA Written Examinations',
    type: 'exam',
    date: '2026-08-10',
    timeLine: '09:30 AM & 01:30 PM session slots',
    courseRelation: 'All Enrolled UG & PG Students',
    description: 'First Continuous Internal Assessment (CIA-I) examinations begin. Written assessments cover Syllabus Unit-I & Unit-II.',
    priority: 'high',
    venue: 'Allotted Department Exam Halls',
    dayOrder: 'VI',
    workingDay: 42
  },
  {
    id: 'kasc-event-10',
    title: 'Independence Day - Festival & Public Holiday',
    type: 'holiday',
    date: '2026-08-15',
    timeLine: '08:00 AM Flag Hoisting',
    courseRelation: 'Mandatory assembly for all staff, NCC/NSS squads & students',
    description: 'Indian Independence Day annual celebrations, parade salute, and meritorious service award citations.',
    priority: 'high',
    venue: 'College Central Quadrangle Ground',
    dayOrder: '-',
    workingDay: undefined
  },
  {
    id: 'kasc-event-11',
    title: 'Last Date for Payment of ESE Fee WITH Penalty Fine',
    type: 'deadline',
    date: '2026-08-20',
    timeLine: 'By 04:30 PM IST',
    courseRelation: 'Late Applicants (Except Year I PG)',
    description: 'Final administrative grace extension to log semester ESE examination fees with late penalty surcharge.',
    priority: 'high',
    venue: 'COE Accounts Portal',
    dayOrder: 'II',
    workingDay: 50
  },
  {
    id: 'kasc-event-12',
    title: 'Onam & Milad-un-Nabi Celebrations - Joint Holidays',
    type: 'holiday',
    date: '2026-08-26',
    timeLine: 'Full Day Campus blockout',
    courseRelation: 'All Academic & Non-Academic Staff',
    description: 'Observance of national Milad-un-Nabi prophet birth anniversary and south-regional Onam harvest harvest celebration.',
    priority: 'medium',
    dayOrder: '-',
    workingDay: undefined
  },
  {
    id: 'kasc-event-13',
    title: 'Krishna Jayanthi - Holiday',
    type: 'holiday',
    date: '2026-09-04',
    timeLine: 'Full Day Rest Break',
    courseRelation: 'All Cadres & Students',
    description: 'Mandatory academic holiday for Krishna Jayanthi festival.',
    priority: 'medium',
    dayOrder: '-',
    workingDay: undefined
  },
  {
    id: 'kasc-event-14',
    title: 'Vinayaka Chathurthi - Holiday',
    type: 'holiday',
    date: '2026-09-14',
    timeLine: 'Full Day Rest Break',
    courseRelation: 'All Departments',
    description: 'National religious holiday in celebration of Vinayaka Chathurthi.',
    priority: 'medium',
    dayOrder: '-',
    workingDay: undefined
  },
  {
    id: 'kasc-event-15',
    title: 'Commencement of End-Semester Practical Examinations',
    type: 'exam',
    date: '2026-09-24',
    timeLine: 'Lab Batch hours (FN / AN)',
    courseRelation: 'All Allied UG & PG Science/Computing Batches',
    description: 'Laboratory assessment schedule, coding/specimen audits, project draft submissions, and external moderator viva-voce assessments.',
    priority: 'high',
    venue: 'Concerned Science & Technical Computer Labs',
    dayOrder: 'II',
    workingDay: 74
  },
  {
    id: 'kasc-event-16',
    title: 'Last Date for Submission of Question Papers for II CIA Exams',
    type: 'deadline',
    date: '2026-09-25',
    timeLine: 'COE Office Closing hours',
    courseRelation: 'All Academic Faculty Members',
    description: 'Deadline for submission of question paper templates for the upcoming Second Cycle Continuous Internal Assessment (II CIA).',
    priority: 'high',
    venue: 'Controller of Examinations Core Desk',
    dayOrder: 'III',
    workingDay: 75
  },
  {
    id: 'kasc-event-17',
    title: 'Gandhi Jayanthi - National Holiday',
    type: 'holiday',
    date: '2026-10-02',
    timeLine: 'Full Day Holiday',
    courseRelation: 'All Campus Sections',
    description: 'National holiday observing Mahatma Gandhi birthday anniversary. Community clean assemblies held prior.',
    priority: 'medium',
    dayOrder: '-',
    workingDay: undefined
  },
  {
    id: 'kasc-event-18',
    title: 'Commencement of II CIA Written Examinations',
    type: 'exam',
    date: '2026-10-08',
    timeLine: 'COE Master Schedule',
    courseRelation: 'All Eligible UG & PG Students',
    description: 'Second mandatory Continuous Internal Assessment (CIA-II) examinations schedule for unit-III, unit-IV, and unit-V.',
    priority: 'high',
    venue: 'Assigned Department Exam Classrooms',
    dayOrder: 'V',
    workingDay: 83
  },
  {
    id: 'kasc-event-19',
    title: 'IQAC Internal Quality Audit and Compliance Check',
    type: 'event',
    date: '2026-10-15',
    timeLine: '02:00 PM onwards',
    courseRelation: 'Academic Auditors & Faculty Advisors',
    description: 'Curriculum coverage audit, practical log reviews, revision class mapping, and student ledger verification ahead of semester logs closure.',
    priority: 'medium',
    venue: 'IQAC Central Conference Room',
    dayOrder: 'V',
    workingDay: 89
  },
  {
    id: 'kasc-event-20',
    title: 'Last Working Day for the Odd Semester (Syllabus Lock)',
    type: 'deadline',
    date: '2026-10-16',
    timeLine: 'Term close at 04:30 PM',
    courseRelation: 'All Students & Faculty Members',
    description: 'Official final instructional day of the semester term. Cumulative academic attendance calculated and submitted to the COE database.',
    priority: 'high',
    venue: 'Department Offices',
    dayOrder: 'VI',
    workingDay: 90
  },
  {
    id: 'kasc-event-21',
    title: 'Ayutha Pooja - Holiday',
    type: 'holiday',
    date: '2026-10-19',
    timeLine: 'Full Day Break',
    courseRelation: 'All Campus Sections',
    description: 'Saraswathi / Ayutha Pooja celebratory college holiday.',
    priority: 'medium',
    dayOrder: '-',
    workingDay: undefined
  },
  {
    id: 'kasc-event-22',
    title: 'Vijaya Dasami - Holiday',
    type: 'holiday',
    date: '2026-10-20',
    timeLine: 'Full Day Break',
    courseRelation: 'All Campus Sections',
    description: 'Vijaya Dasami celebratory holiday. Campus closed.',
    priority: 'medium',
    dayOrder: '-',
    workingDay: undefined
  },
  {
    id: 'kasc-event-23',
    title: 'Commencement of End-Semester (ESE) Theory Written Examinations',
    type: 'exam',
    date: '2026-10-26',
    timeLine: 'FN / AN sessions as scheduled in hall tickets',
    courseRelation: 'All UG & PG Regular & Supplementary Candidates',
    description: 'Main autumn theory examinations administered by the KASC Controller of Examinations for semester credit scoring.',
    priority: 'high',
    venue: 'KASC Central Exam Blocks & Main Annex',
    dayOrder: '-',
    workingDay: undefined
  }
];

export default function AcademicCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [reminders, setReminders] = useState<string[]>([]);
  
  // Custom Tab for Calendar: 'view' | 'upload'
  const [activeTab, setActiveTab] = useState<'view' | 'upload'>('view');

  // Admin Create Event Form fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'exam' | 'deadline' | 'holiday' | 'event'>('deadline');
  const [date, setDate] = useState('');
  const [timeLine, setTimeLine] = useState('');
  const [courseRelation, setCourseRelation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [venue, setVenue] = useState('');
  const [dayOrder, setDayOrder] = useState('');
  const [workingDay, setWorkingDay] = useState<number | ''>('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Harvester Upload States
  const [uploaderDragActive, setUploaderDragActive] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [attachedFileSize, setAttachedFileSize] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [extractedEvents, setExtractedEvents] = useState<CalendarEvent[]>([]);

  // Load calendar events
  useEffect(() => {
    const stored = localStorage.getItem('kasc_calendar_events');
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      localStorage.setItem('kasc_calendar_events', JSON.stringify(DEFAULT_CALENDAR_EVENTS));
      setEvents(DEFAULT_CALENDAR_EVENTS);
    }

    const storedReminders = localStorage.getItem('kasc_calendar_reminders');
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
    }
  }, []);

  // Filter events
  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(search.toLowerCase()) || 
                          evt.description.toLowerCase().includes(search.toLowerCase()) ||
                          (evt.courseRelation && evt.courseRelation.toLowerCase().includes(search.toLowerCase())) ||
                          (evt.venue && evt.venue.toLowerCase().includes(search.toLowerCase()));
    
    const matchesType = filterType === 'all' || evt.type === filterType;
    const matchesPriority = priorityFilter === 'all' || evt.priority === priorityFilter;

    return matchesSearch && matchesType && matchesPriority;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Toggle quick local reminder setting
  const toggleReminder = (id: string) => {
    let updated: string[];
    if (reminders.includes(id)) {
      updated = reminders.filter(x => x !== id);
    } else {
      updated = [...reminders, id];
    }
    setReminders(updated);
    localStorage.setItem('kasc_calendar_reminders', JSON.stringify(updated));
  };

  // Drag and Drop process selected files
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setUploaderDragActive(true);
    } else if (e.type === "dragleave") {
      setUploaderDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploaderDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setAttachedFileName(file.name);
    const size = file.size > 1024 * 1024 
      ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' 
      : (file.size / 1024).toFixed(0) + ' KB';
    setAttachedFileSize(size);
  };

  const removeAttachedFile = () => {
    setAttachedFileName(null);
    setAttachedFileSize(null);
    setUploadSuccess(false);
    setExtractedEvents([]);
  };

  // Simulating smart harvesting from uploaded pages
  const runHarvesterEngine = () => {
    if (!attachedFileName) return;
    setUploadingFile(true);
    
    setTimeout(() => {
      setUploadingFile(false);
      setUploadSuccess(true);
      setExtractedEvents(DEFAULT_CALENDAR_EVENTS);
    }, 1800);
  };

  const handleCommitAllImported = () => {
    const currentList = [...events];
    let addedCount = 0;
    DEFAULT_CALENDAR_EVENTS.forEach(ext => {
      if (!currentList.some(e => e.title === ext.title && e.date === ext.date)) {
        currentList.push(ext);
        addedCount++;
      }
    });
    setEvents(currentList);
    localStorage.setItem('kasc_calendar_events', JSON.stringify(currentList));
    alert(`Successfully committed KASC Academic Calendar data! Added ${addedCount} official odd-semester schedule milestones into the core college calendar.`);
    setActiveTab('view');
    removeAttachedFile();
  };

  // Add event handler
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const newEvent: CalendarEvent = {
      id: 'cal-dyn-' + Math.floor(10000 + Math.random() * 90000),
      title,
      type,
      date,
      timeLine: timeLine || 'Full Day / As scheduled',
      courseRelation: courseRelation || 'All Students & Departments',
      description,
      priority,
      venue: venue || 'Main Campus',
      dayOrder: dayOrder || undefined,
      workingDay: workingDay ? Number(workingDay) : undefined,
      lastUpdated: new Date().toLocaleDateString()
    };

    const updated = [...events, newEvent];
    setEvents(updated);
    localStorage.setItem('kasc_calendar_events', JSON.stringify(updated));

    // Reset Form Input states
    setTitle('');
    setDate('');
    setTimeLine('');
    setCourseRelation('');
    setDescription('');
    setVenue('');
    setDayOrder('');
    setWorkingDay('');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  // Delete event handler
  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to retire this event from the master academic calendar?')) {
      const updated = events.filter(evt => evt.id !== id);
      setEvents(updated);
      localStorage.setItem('kasc_calendar_events', JSON.stringify(updated));
    }
  };

  // Reset to original seeds
  const handleResetDefaults = () => {
    if (window.confirm('Reset academic events back to factory system defaults?')) {
      localStorage.setItem('kasc_calendar_events', JSON.stringify(DEFAULT_CALENDAR_EVENTS));
      setEvents(DEFAULT_CALENDAR_EVENTS);
    }
  };

  // Export as CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Title,Type,Scheduled Date,Timeline,Target Audiences,Venue,Priority\n";
    filteredEvents.forEach(evt => {
      csvContent += `"${evt.id}","${evt.title.replace(/"/g, '""')}","${evt.type}","${evt.date}","${(evt.timeLine || '').replace(/"/g, '""')}","${(evt.courseRelation || '').replace(/"/g, '""')}","${(evt.venue || '').replace(/"/g, '""')}","${evt.priority}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "KASC_Academic_Calendar_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as PDF using jsPDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4', // 210mm x 297mm
      });
      
      const width = 210;
      const height = 297;
      
      // Header Banner
      doc.setFillColor(30, 46, 107); // KASC Blue (#1e2e6b)
      doc.rect(0, 0, width, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("KONGUNADU ARTS AND SCIENCE COLLEGE", width / 2, 12, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("COIMBATORE - 641029 | AUTONOMOUS COLLEGE RE-ACCREDITED BY NAAC WITH 'A+' GRADE", width / 2, 18, { align: 'center' });
      
      doc.setTextColor(240, 154, 26); // KASC Gold (#f09a1a)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("OFFICIAL ODD-SEMESTER ACADEMIC CALENDAR 2026-2027", width / 2, 26, { align: 'center' });
      
      // Info section
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(15, 42, width - 15, 42);
      
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(`Generated: ${new Date().toLocaleDateString()} | Total Filtered milestones: ${filteredEvents.length}`, 15, 47);
      
      doc.setLineWidth(0.4);
      doc.line(15, 50, width - 15, 50);
      
      let y = 58;
      
      // Loop over events
      filteredEvents.forEach((evt) => {
        // Page threshold calculation
        if (y > 255) {
          doc.addPage();
          // Draw thin top line for continuity
          doc.setDrawColor(30, 46, 107);
          doc.setLineWidth(1.5);
          doc.line(15, 12, width - 15, 12);
          y = 20;
        }
        
        // Background color block for event row
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y, width - 30, 26, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.rect(15, y, width - 30, 26);
        
        // Category left highlight indicator bar
        let categoryColor = { r: 168, g: 85, b: 247 }; // Purple default
        if (evt.type === 'exam') categoryColor = { r: 30, g: 46, b: 107 };
        else if (evt.type === 'deadline') categoryColor = { r: 240, g: 154, b: 26 };
        else if (evt.type === 'holiday') categoryColor = { r: 16, g: 185, b: 129 };
        
        doc.setFillColor(categoryColor.r, categoryColor.g, categoryColor.b);
        doc.rect(15, y, 2.5, 26, 'F');
        
        // Date Stamp
        doc.setTextColor(30, 46, 107);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text(evt.date, 21, y + 6);
        
        // Type Badge
        doc.setTextColor(100, 110, 130);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        let typeLabel = evt.type.toUpperCase();
        if (evt.workingDay) {
          typeLabel += ` | WD: ${evt.workingDay}`;
        }
        if (evt.dayOrder) {
          typeLabel += ` | DO: ${evt.dayOrder}`;
        }
        doc.text(typeLabel, 21, y + 10.5);
        
        // Priority
        let priorityLabel = `[${evt.priority.toUpperCase()} PRIORITY]`;
        doc.setTextColor(evt.priority === 'high' ? 220 : 100, evt.priority === 'high' ? 38 : 110, evt.priority === 'high' ? 38 : 130);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.text(priorityLabel, 21, y + 15);
        
        // Title Text (Split to multiple lines if needed)
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        const splitTitle = doc.splitTextToSize(evt.title, 115);
        doc.text(splitTitle, 76, y + 6);
        
        // Target Course & Venue details
        doc.setTextColor(110, 110, 110);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const locationText = `Location: ${evt.venue || 'Main Campus'} | Applies for: ${evt.courseRelation || 'All Streams'}`;
        const splitLocation = doc.splitTextToSize(locationText, 115);
        doc.text(splitLocation, 76, y + 13);

        // Timeline
        if (evt.timeLine) {
          doc.setTextColor(130, 110, 60);
          doc.setFont("helvetica", "italic");
          doc.text(`Timeline: ${evt.timeLine}`, 76, y + 20);
        }
        
        y += 29;
      });
      
      // Save
      doc.save("KASC_Academic_Calendar_Term_2026.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Error building layout. Please check input milestones.");
    }
  };

  const getPriorityBadgeColor = (prio: 'low' | 'medium' | 'high') => {
    switch (prio) {
      case 'high': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeBadgeColor = (type: 'exam' | 'deadline' | 'holiday' | 'event') => {
    switch (type) {
      case 'exam': return 'bg-indigo-50 border-indigo-200 text-[#1e2e6b]';
      case 'deadline': return 'bg-amber-100 border-amber-300 text-[#f09a1a]';
      case 'holiday': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'event': return 'bg-purple-50 border-purple-200 text-purple-800';
    }
  };

  const isPrivileged = user?.role === Role.ADMIN || user?.role === Role.PRINCIPAL || user?.role === Role.HOD;

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-[#1e2e6b]" />
            Academic Calendar & Deadlines
          </h1>
          <p className="text-slate-500 mt-1">Real-time scheduling index for continuous examinations, syllabus cycles, and mandatory deadlines.</p>
        </div>
        <div className="flex items-center gap-2">
          {isPrivileged && (
            <button 
              onClick={handleResetDefaults}
              className="px-3.5 py-2 border border-dashed border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
            >
              Reset Default Events
            </button>
          )}
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#f09a1a]" />
            Export (CSV)
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1e2e6b] hover:bg-[#15204d] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-[#f09a1a]" />
            Export (PDF)
          </button>
        </div>
      </div>

      {/* 2. Quick Overcoming Summary Alert Box */}
      <div className="bg-[#1e2e6b]/5 border-l-4 border-[#1e2e6b] p-4 rounded-r-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-[#1e2e6b] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed space-y-1">
          <p className="font-extrabold text-[#1e2e6b] uppercase">Important Academic Mandates</p>
          <p>
            Students must achieve a minimum cumulative attendance rating of <strong className="font-black text-[#f09a1a]">75%</strong> in all registered theory & practical streams to remain eligible for End-Semester examinations. Set visual reminders using the notification bells below to alert your local workspace of upcoming deadlines!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left/Middle Column - List View with filters */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Category Tabs Filter */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                filterType === 'all' 
                  ? 'bg-[#1e2e6b] text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              🗓️ All Calendar
            </button>
            <button
              onClick={() => setFilterType('exam')}
              className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                filterType === 'exam' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-white hover:text-[#1e2e6b]'
              }`}
            >
              📖 Exams ({events.filter(e => e.type === 'exam').length})
            </button>
            <button
              onClick={() => setFilterType('deadline')}
              className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                filterType === 'deadline' 
                  ? 'bg-[#f09a1a] text-slate-950 shadow-sm' 
                  : 'text-slate-600 hover:bg-white hover:text-amber-700'
              }`}
            >
              ⏰ Deadlines ({events.filter(e => e.type === 'deadline').length})
            </button>
            <button
              onClick={() => setFilterType('holiday')}
              className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                filterType === 'holiday' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-white hover:text-emerald-700'
              }`}
            >
              🌴 Holidays ({events.filter(e => e.type === 'holiday').length})
            </button>
            <button
              onClick={() => setFilterType('event')}
              className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                filterType === 'event' 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-white hover:text-purple-700'
              }`}
            >
              🎉 Events ({events.filter(e => e.type === 'event').length})
            </button>
          </div>
          
          {/* Controls: search and filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search events, courses, key terms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none placeholder-slate-400"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <Filter className="w-3.5 h-3.5 text-[#1e2e6b]" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-auto px-2.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1e2e6b]"
              >
                <option value="all">All Event Types</option>
                <option value="exam">📖 Examinations</option>
                <option value="deadline">⏰ Academic Deadlines</option>
                <option value="holiday">🌴 Holidays / Breaks</option>
                <option value="event">🎉 Events & Seminars</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="w-full md:w-auto">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full md:w-auto px-2.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1e2e6b]"
              >
                <option value="all">All Priorities</option>
                <option value="high">🛑 High Priority</option>
                <option value="medium">⚡ Medium Priority</option>
                <option value="low">☕ Low Priority</option>
              </select>
            </div>
          </div>

          {/* Render List View */}
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="bg-white p-12 text-center border border-slate-200 rounded-xl text-slate-400 italic">
                No upcoming calendar milestones found matching your filtering parameters.
              </div>
            ) : (
              filteredEvents.map((evt) => {
                const showsReminder = reminders.includes(evt.id);
                return (
                  <div key={evt.id} className="bg-white border hover:border-slate-300 rounded-xl shadow-xs p-5 transition-all relative overflow-hidden group">
                    {/* Left category highlight bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      evt.type === 'exam' ? 'bg-[#1e2e6b]' :
                      evt.type === 'deadline' ? 'bg-[#f09a1a]' :
                      evt.type === 'holiday' ? 'bg-emerald-500' : 'bg-purple-500'
                    }`} />

                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        
                        {/* Meta Category Row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTypeBadgeColor(evt.type)}`}>
                            {evt.type === 'exam' ? 'Exam' : evt.type === 'deadline' ? 'Deadline' : evt.type === 'holiday' ? 'Holiday' : 'General Event'}
                          </span>
                          
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getPriorityBadgeColor(evt.priority)}`}>
                            {evt.priority} Priority
                          </span>

                          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {evt.date} • {evt.timeLine}
                          </span>
                        </div>

                        {/* Event Title */}
                        <h4 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                          {evt.title}
                        </h4>

                        {/* Event Target Audience */}
                        <p className="text-[11px] font-medium text-slate-400">
                          Target: <strong className="text-slate-600">{evt.courseRelation}</strong>
                        </p>

                        {/* Description */}
                        <p className="text-[11px] leading-relaxed text-slate-600 font-sans max-w-2xl bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                          {evt.description}
                        </p>

                        {/* Venue details */}
                        {evt.venue && (
                          <p className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            Report Venue: <span className="text-[#1e2e6b]">{evt.venue}</span>
                          </p>
                        )}
                      </div>

                      {/* Interactive Buttons: Reminder & Delete */}
                      <div className="flex flex-col items-end gap-2.5 shrink-0">
                        <button
                          onClick={() => toggleReminder(evt.id)}
                          className={`p-2 rounded-lg border transition-all ${
                            showsReminder 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-300 shadow-xs' 
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={showsReminder ? 'Reminder is Active' : 'Set Local Notification'}
                        >
                          {showsReminder ? (
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                              <Bell className="w-3.5 h-3.5" />
                              Remind
                            </div>
                          )}
                        </button>

                        {isPrivileged && (
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="p-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-colors"
                            title="Delete academic entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Section - Admin form or Helper Box */}
        <div className="space-y-4">
          
          {/* Privileged User Form: Add dynamic Academic Calendar item */}
          {isPrivileged ? (
            <div className="bg-white border-t-2 border-[#1e2e6b] border-x border-b border-slate-200 rounded-sm shadow-sm p-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#1e2e6b]" />
                  Publish Academic Milestone
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Role Authorization Granted: {user?.role}</p>
              </div>

              {formSuccess && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-lg font-bold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle className="w-4 h-4" />
                  Milestone broadcasted to list!
                </div>
              )}

              <form onSubmit={handleAddEvent} className="space-y-3">
                {/* Event Title */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Milestone/Event Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. End-Semester Lab Practicals"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none"
                  />
                </div>

                {/* Event Type & Priority */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Type Classification</label>
                    <select
                      value={type}
                      onChange={(e: any) => setType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1e2e6b]"
                    >
                      <option value="exam">Examination</option>
                      <option value="deadline">Deadline</option>
                      <option value="holiday">Holiday</option>
                      <option value="event">College Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Priority Scale</label>
                    <select
                      value={priority}
                      onChange={(e: any) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1e2e6b]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High & Compulsory</option>
                    </select>
                  </div>
                </div>

                {/* Calendar Date & timeline */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1e2e6b]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Daily Timing</label>
                    <input
                      type="text"
                      value={timeLine}
                      onChange={(e) => setTimeLine(e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1e2e6b]"
                    />
                  </div>
                </div>

                {/* Target Audience / stream limit */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Target Department / Aud</label>
                  <input
                    type="text"
                    value={courseRelation}
                    onChange={(e) => setCourseRelation(e.target.value)}
                    placeholder="e.g. B.Sc. IT & BCA Final Years"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none"
                  />
                </div>

                {/* Event Venue */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Report Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. UG Block Floor II / Seminar Hall"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none"
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Special Guidelines / Syllabus</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide syllabi parameters, list record requirements etc."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1e2e6b]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1e2e6b] hover:bg-[#132150] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-[#f09a1a]" />
                  Broadcast Milestone
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white border-t-2 border-[#1e2e6b] border-x border-b border-slate-200 rounded-sm shadow-sm p-4 text-center py-6 text-slate-500">
              <CalendarIcon className="w-8 h-8 text-[#1e2e6b] opacity-60 mx-auto mb-3" />
              <h4 className="font-extrabold text-slate-900 text-xs uppercase mb-1">Milestone Submissions Locked</h4>
              <p className="text-[11px] leading-relaxed max-w-xs mx-auto">
                Only the Principal Office, academic Administrators, and Authorized Department HODs carry system permissions to publish new semester milestones.
              </p>
            </div>
          )}

          {/* Guidelines Box */}
          <div className="bg-[#f09a1a]/5 border border-[#f09a1a]/20 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase">My Calendar Reminders</h4>
            {reminders.length === 0 ? (
              <p className="text-[11px] text-slate-500 font-sans italic leading-relaxed">
                Click "Remind" bell on any calendar event card to save dates to your temporary device shelf.
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-[#f09a1a] uppercase">{reminders.length} Active Reminders Set:</p>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {events.filter(e => reminders.includes(e.id)).map(e => (
                    <div key={e.id} className="text-[11px] bg-white p-1.5 rounded border border-slate-200 flex justify-between items-center text-slate-700">
                      <span className="truncate font-semibold text-slate-800 pr-1">{e.title}</span>
                      <span className="shrink-0 text-[10px] font-mono text-[#1e2e6b] font-bold">{e.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
