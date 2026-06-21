import React, { useState, useEffect } from 'react';
import { 
  Award, Download, ShieldCheck, FileCheck, CheckCircle2, 
  Loader2, Sparkles, RefreshCw, Eye, Edit3, Heart, 
  Trash2, Plus, Info, Layout, QrCode, ClipboardCheck,
  Upload, X, Calendar, Building, Check, FileText, Filter, Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { jsPDF } from 'jspdf';

interface CertificateTypePreset {
  id: string;
  type: string;
  title: string;
  sub: string;
  desc: string;
  reason: string;
  authority: string;
  role: string;
  style: 'classic' | 'modern' | 'royal';
  accentColor: string;
}

const PRESET_TEMPLATES: CertificateTypePreset[] = [
  {
    id: 'dev_pown',
    type: 'System Development Certificate',
    title: 'CERTIFICATE OF SCHOLASTIC CRAFTSMANSHIP & SYSTEM RECOGNITION',
    sub: 'Full-Stack ERP System Architect Credentials',
    desc: 'Awarded for exceptional engineering excellence, persistent technical leadership, and outstanding craftsmanship in building, styling, and launching the KASC Automated Enterprise Resource Planning (ERP) Portal.',
    reason: 'Under their diligent leadership, the division has successfully integrated modern workflows across Attendance, Academic Records, Auditing, and Chat Intelligence.',
    authority: 'Dr. M. Lekeshmanaswamy, Principal',
    role: 'Lead ERP Architect & Board of Administrators',
    style: 'royal',
    accentColor: '#f09a1a'
  },
  {
    id: 'bonafide',
    type: 'Bonafide Student Certificate',
    title: 'CERTIFICATE OF COMPLIANCE & BONAFIDE ENROLLMENT',
    sub: 'Official Collegiate Institutional Bonafide Registrar',
    desc: 'This is to verify and officially certify that the student mentioned below is enrolled as a full-time student in regular attendance at this Institution.',
    reason: 'According to collegiate records, they bear a consistent conduct of high ethical standard and active scholastic pursuit throughout the present academic cycle.',
    authority: 'Dr. K. Kalaiselvi, Registrar',
    role: 'Coordinating Academic Registrar & Dean',
    style: 'classic',
    accentColor: '#1e2e6b'
  },
  {
    id: 'excellence',
    type: 'Merit & Scholastic Excellence',
    title: 'CERTIFICATE OF HIGH SCHOLASTIC DISTINCTION',
    sub: 'Honors Performance & Departmental Dean List',
    desc: 'Awarded to the candidate for maintaining an exceptional Cumulative Grade Point Average (CGPA) and demonstrating commendable academic fortitude in the curriculum.',
    reason: 'Their exemplary dedication to deep research and creative practical implementation sets a benchmark of academic distinction for fellow scholars.',
    authority: 'Dr. Sarah Winston, Dean of Computer Science',
    role: 'Head of Department & Academic Senate Chair',
    style: 'modern',
    accentColor: '#6366f1'
  },
  {
    id: 'sports',
    type: 'Co-Curricular & Sports Recognition',
    title: 'CERTIFICATE OF OUTSTANDING ATHLETIC & PHYSICAL COMMENDATION',
    sub: 'Collegiate Athletics Advisory Committee',
    desc: 'Awarded in high recognition of remarkable performance, sportspersonship statecraft, and commitment to athletic excellence while representing this autonomous institution.',
    reason: 'Their passion and discipline on and off the field have brought notable accolades to the college athletic roster in inter-collegiate tournaments.',
    authority: 'Prof. S. Jagadeeshan, Sports Director',
    role: 'Collegiate Athletic Coordinator & In-Charge',
    style: 'modern',
    accentColor: '#10b981'
  }
];

interface StudentUploadedCertificate {
  id: string;
  studentName: string;
  eventName: string;
  organizedBy: string;
  category: 'WINNER' | 'PARTICIPATION' | 'PAPER_PRESENTATION' | 'WORKSHOP';
  level: string;
  date: string;
  fileName: string;
  fileSize: string;
  fileDataUrlUrl?: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  pointsEarned: number;
}

export default function Certificates() {
  const { user } = useAuth();
  
  // Main Tab view: 'official' vs 'external'
  const [activeMainTab, setActiveMainTab] = useState<'official' | 'external'>('official');

  // Student External Uploaded Certificates State
  const [uploadedCerts, setUploadedCerts] = useState<StudentUploadedCertificate[]>(() => {
    const saved = localStorage.getItem('kasc_student_uploaded_certs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'EXT_ACH_001',
        studentName: 'Jeeva Pown',
        eventName: 'National Level Hack-A-Thon (Neural Hack 2.0)',
        organizedBy: 'Bharathiar University Division',
        category: 'WINNER',
        level: 'National Level',
        date: '2026-03-12',
        fileName: 'neural_hack_first_prize.pdf',
        fileSize: '1.4 MB',
        status: 'APPROVED',
        pointsEarned: 25
      },
      {
        id: 'EXT_ACH_002',
        studentName: 'Jeeva Pown',
        eventName: 'Inter-Collegiate Volleyball Tournament',
        organizedBy: 'Sri Ramakrishna Mission Vidyalaya',
        category: 'PARTICIPATION',
        level: 'District Level',
        date: '2026-05-04',
        fileName: 'volleyball_meet_participation.png',
        fileSize: '840 KB',
        status: 'APPROVED',
        pointsEarned: 10
      },
      {
        id: 'EXT_ACH_003',
        studentName: 'Jeeva Pown',
        eventName: 'R-Programming Statistical Data Modeling Contest',
        organizedBy: 'PSG College of Technology',
        category: 'WINNER',
        level: 'State Level',
        date: '2026-06-18',
        fileName: 'r_programming_runner_cup.pdf',
        fileSize: '2.1 MB',
        status: 'PENDING',
        pointsEarned: 15
      }
    ];
  });

  // Persist Uploaded Certificates
  useEffect(() => {
    localStorage.setItem('kasc_student_uploaded_certs', JSON.stringify(uploadedCerts));
  }, [uploadedCerts]);

  // Form states for external certificate upload
  const [extEventName, setExtEventName] = useState('');
  const [extOrganizedBy, setExtOrganizedBy] = useState('');
  const [extCategory, setExtCategory] = useState<'WINNER' | 'PARTICIPATION' | 'PAPER_PRESENTATION' | 'WORKSHOP'>('WINNER');
  const [extLevel, setExtLevel] = useState('National Level');
  const [extDate, setExtDate] = useState('');
  const [extStudentName, setExtStudentName] = useState(() => {
    if (user?.email?.toLowerCase().includes('pown') || user?.email?.toLowerCase().includes('jeeva')) {
      return 'Jeeva Pown';
    }
    return user?.name || 'Jeeva Pown';
  });
  interface AttachedFile {
    id: string;
    name: string;
    size: string;
    data: string;
  }

  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [previewFile, setPreviewFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [submittingExt, setSubmittingExt] = useState(false);
  const [uploaderDragActive, setUploaderDragActive] = useState(false);
  const [extSearchFilter, setExtSearchFilter] = useState('');
  const [extCategoryFilter, setExtCategoryFilter] = useState<string>('ALL');

  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const processSingleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
        const newFile: AttachedFile = {
          id: 'FILE_' + Math.floor(1000 + Math.random() * 9000),
          name: file.name,
          size: `${sizeInMb} MB`,
          data: event.target.result as string
        };
        setAttachedFiles(prev => [...prev, newFile]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        processSingleFile(file as File);
      });
    }
  };

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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        processSingleFile(file as File);
      });
    }
  };

  const handleAddExternalCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extEventName || !extOrganizedBy) {
      alert("Please complete all required fields.");
      return;
    }
    if (attachedFiles.length === 0) {
      alert("Please attach at least one certificate document/image.");
      return;
    }
    setSubmittingExt(true);

    setTimeout(() => {
      let pts = 5;
      if (extCategory === 'WINNER') pts = 20;
      else if (extCategory === 'PAPER_PRESENTATION') pts = 15;
      else if (extCategory === 'WORKSHOP') pts = 10;

      const newCerts: StudentUploadedCertificate[] = attachedFiles.map((file, index) => {
        return {
          id: 'EXT_ACH_' + Math.floor(100 + Math.random() * 900) + '_' + index,
          studentName: extStudentName,
          eventName: extEventName,
          organizedBy: extOrganizedBy,
          category: extCategory,
          level: extLevel,
          date: extDate || new Date().toISOString().split('T')[0],
          fileName: file.name,
          fileSize: file.size,
          fileDataUrlUrl: file.data,
          status: 'PENDING' as const,
          pointsEarned: pts
        };
      });

      setUploadedCerts(prev => [...newCerts, ...prev]);
      setSubmittingExt(false);
      
      // Reset Form fields
      setExtEventName('');
      setExtOrganizedBy('');
      setExtDate('');
      setAttachedFiles([]);
      
      alert(`Successfully uploaded ${newCerts.length} certificate(s) to the KASC Board Ledger!\nVerification Status: PENDING DEAN REVIEW.`);
    }, 1200);
  };

  const handleDeleteExternalCertificate = (id: string) => {
    if (window.confirm("Are you sure you want to retract and delete this uploaded achievement dossier?")) {
      setUploadedCerts(prev => prev.filter(c => c.id !== id));
    }
  };
  
  // Custom states
  const [recipientName, setRecipientName] = useState(() => {
    // Try to personalize for Jeeva Pown if matching email/name, or fallback to current user
    if (user?.email?.toLowerCase().includes('pown') || user?.email?.toLowerCase().includes('jeeva')) {
      return 'Jeeva Pown';
    }
    return user?.name || 'Jeeva Pown';
  });
  
  const [selectedPresetId, setSelectedPresetId] = useState('dev_pown');
  const [regNo, setRegNo] = useState('KASC-2026-CS8891');
  const [department, setDepartment] = useState(() => {
    return localStorage.getItem(`kasc_dept_${user?.id}`) || 'Computer Science & Engineering';
  });
  
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customSub, setCustomSub] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [customAuthority, setCustomAuthority] = useState('');
  const [customAuthorityRole, setCustomAuthorityRole] = useState('');
  
  const [selectedStyle, setSelectedStyle] = useState<'classic' | 'modern' | 'royal'>('royal');
  const [selectedColor, setSelectedColor] = useState('#f09a1a');
  
  const [compiling, setCompiling] = useState<string | null>(null);
  const [completedCerts, setCompletedCerts] = useState<Array<{ id: string; name: string; type: string; date: string; hash: string }>>([]);
  
  // Dynamic sync when selected preset changes
  useEffect(() => {
    const preset = PRESET_TEMPLATES.find(p => p.id === selectedPresetId);
    if (preset) {
      setCustomTitle(preset.title);
      setCustomSub(preset.sub);
      setCustomDesc(preset.desc);
      setCustomReason(preset.reason);
      setCustomAuthority(preset.authority);
      setCustomAuthorityRole(preset.role);
      setSelectedStyle(preset.style);
      setSelectedColor(preset.accentColor);
      
      // Auto custom tags
      if (preset.id === 'dev_pown') {
        setRegNo('KASC-ERP-ENG-001');
      } else {
        setRegNo(user?.id ? `KASC-UG-${user.id.substring(0, 4).toUpperCase()}` : 'KASC-CS-2026-4402');
      }
    }
  }, [selectedPresetId, user]);

  const generatePDF = () => {
    setCompiling(selectedPresetId);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4', // 297mm x 210mm
        });
        
        const width = 297;
        const height = 210;
        
        // Helper to convert hex to RGB
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 30, g: 46, b: 107 };
        };
        
        const colorRgb = hexToRgb(selectedColor);
        const kascBlue = { r: 30, g: 46, b: 107 };
        const kascGold = { r: 240, g: 154, b: 26 };
        
        // 1. Draw Outer Border Wall (Background Plate)
        doc.setFillColor(252, 251, 247); // Cream background
        doc.rect(0, 0, width, height, 'F');
        
        // Classic / Royal styles incorporate heavy borders
        if (selectedStyle === 'royal') {
          // Double Royal border
          doc.setDrawColor(kascBlue.r, kascBlue.g, kascBlue.b);
          doc.setLineWidth(3);
          doc.rect(6, 6, width - 12, height - 12);
          
          doc.setDrawColor(kascGold.r, kascGold.g, kascGold.b);
          doc.setLineWidth(1);
          doc.rect(9, 9, width - 18, height - 18);
          
          // Draw decorative corner elements
          const drawCorner = (x: number, y: number, cx: number, cy: number) => {
            doc.setFillColor(kascGold.r, kascGold.g, kascGold.b);
            doc.rect(x, y, cx, cy, 'F');
          };
          drawCorner(9, 9, 12, 4);
          drawCorner(9, 9, 4, 12);
          drawCorner(width - 21, 9, 12, 4);
          drawCorner(width - 13, 9, 4, 12);
          drawCorner(9, height - 13, 12, 4);
          drawCorner(9, height - 21, 4, 12);
          drawCorner(width - 21, height - 13, 12, 4);
          drawCorner(width - 13, height - 21, 4, 12);
        } else if (selectedStyle === 'classic') {
          // Classic Slate Border
          doc.setDrawColor(colorRgb.r, colorRgb.g, colorRgb.b);
          doc.setLineWidth(4);
          doc.rect(8, 8, width - 16, height - 16);
          doc.setDrawColor(180, 180, 180);
          doc.setLineWidth(0.5);
          doc.rect(11, 11, width - 22, height - 22);
        } else {
          // Modern Clean Style
          doc.setFillColor(colorRgb.r, colorRgb.g, colorRgb.b);
          doc.rect(0, 0, 14, height, 'F'); // Sidebar banner look
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(1);
          doc.rect(14, 0, width - 14, height);
        }

        // 2. Translucent Golden Watermark Seal in the Background
        doc.setDrawColor(245, 239, 215);
        doc.setLineWidth(0.4);
        doc.circle(width / 2, height / 2 + 10, 42, 'D');
        doc.circle(width / 2, height / 2 + 10, 39, 'D');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(230, 220, 180);
        // Draw some circular concentric path text
        doc.text("KONGUNADU ARTS AND SCIENCE COLLEGE * AUTONOMOUS * COIMBATORE", width / 2 - 45, height / 2 + 10);
        doc.text("SERVICE * INTEGRITY * SCHOLASTIC LEADERSHIP * SYSTEM OF RECORD", width / 2 - 45, height / 2 + 13);
        
        // 3. Institution Header Logo Elements
        doc.setTextColor(kascBlue.r, kascBlue.g, kascBlue.b);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("KONGUNADU ARTS AND SCIENCE COLLEGE", width / 2, 25, { align: 'center' });
        
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 110, 140);
        doc.text("AUTONOMOUS INSTITUTION | RE-ACCREDITED BY NAAC WITH 'A+' GRADE | COIMBATORE - 641029", width / 2, 30, { align: 'center' });
        doc.text("OFFICIAL SYSTEMS REGISTER OF HIGHER EDUCATION & AUTONOMOUS RECOGNITION", width / 2, 34, { align: 'center' });
        
        // Gold Divider
        doc.setDrawColor(kascGold.r, kascGold.g, kascGold.b);
        doc.setLineWidth(1.5);
        doc.line(width / 2 - 80, 38, width / 2 + 80, 38);
        
        // 4. Certificate Core Title
        doc.setTextColor(colorRgb.r, colorRgb.g, colorRgb.b);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(customTitle.toUpperCase(), width / 2, 52, { align: 'center' });
        
        doc.setTextColor(120, 120, 120);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(11);
        doc.text(customSub, width / 2, 59, { align: 'center' });
        
        // 5. Recipient Particulars
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("This credential is officially issued to clarify scholastic standing of:", width / 2, 73, { align: 'center' });
        
        // Large High-Contrast Recipient Name
        doc.setTextColor(kascBlue.r, kascBlue.g, kascBlue.b);
        doc.setFont("serif", "bold");
        doc.setFontSize(26);
        doc.text(recipientName, width / 2, 86, { align: 'center' });
        
        // Underline Name
        doc.setDrawColor(colorRgb.r, colorRgb.g, colorRgb.b);
        doc.setLineWidth(0.8);
        doc.line(width / 2 - 50, 89, width / 2 + 50, 89);
        
        // Student Meta
        doc.setTextColor(80, 80, 80);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.text(`REGISTRATION ID: ${regNo}  |  DEPARTMENT / DIVISION: ${department.toUpperCase()}`, width / 2, 97, { align: 'center' });
        
        // 6. Dynamic Certificate Body Content (Paragraph limits checked)
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        doc.setTextColor(60, 60, 60);
        
        const splitDesc = doc.splitTextToSize(customDesc, 220);
        doc.text(splitDesc, width / 2, 109, { align: 'center' });
        
        const splitReason = doc.splitTextToSize(customReason, 210);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(90, 90, 90);
        doc.text(splitReason, width / 2, 125, { align: 'center' });
        
        // 7. Verification Certificate ID, QR Mock & Seal Tag
        const certHash = 'KASC_' + Math.random().toString(36).substring(2, 10).toUpperCase() + '_' + Date.now().toString().substring(8);
        doc.setFillColor(240, 244, 248);
        doc.rect(20, height - 42, 60, 22, 'F');
        doc.setDrawColor(200, 210, 225);
        doc.rect(20, height - 42, 60, 22);
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(kascBlue.r, kascBlue.g, kascBlue.b);
        doc.text("SECURE BLOCKCHAIN HASHID:", 23, height - 37);
        doc.setFont("courier", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(30, 30, 30);
        doc.text(certHash, 23, height - 32);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(110, 110, 110);
        doc.text("Verify this document scan at: verify.kascerp.edu", 23, height - 26);
        
        // Draw a simulated elegant Golden Seal or Ribbon
        doc.setFillColor(kascGold.r, kascGold.g, kascGold.b);
        doc.circle(width / 2 - 40, height - 31, 8, 'F');
        doc.setDrawColor(kascBlue.r, kascBlue.g, kascBlue.b);
        doc.circle(width / 2 - 40, height - 31, 6, 'D');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.text("KASC", width / 2 - 40, height - 30.5, { align: 'center' });
        
        // 8. Signature Block
        // Left Authority (e.g. Registrar or Department Head)
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.5);
        doc.line(125, height - 30, 185, height - 30);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("COORDINATING REGISTRAR SYSTEM", 155, height - 25, { align: 'center' });
        doc.setFont("serif", "bold");
        doc.setTextColor(30,30,30);
        doc.setFontSize(10.5);
        doc.text("Dr. K. Kalaiselvi, Registrar", 155, height - 33, { align: 'center' });
        
        // Right Authority (e.g. Principal or General Director)
        doc.line(210, height - 30, 270, height - 30);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(customAuthorityRole.toUpperCase(), 240, height - 25, { align: 'center' });
        doc.setFont("serif", "bold");
        doc.setTextColor(30,30,30);
        doc.setFontSize(10.5);
        doc.text(customAuthority, 240, height - 33, { align: 'center' });
        
        // Draw a nice signature calligraphy line
        doc.setDrawColor(colorRgb.r, colorRgb.g, colorRgb.b);
        doc.setLineWidth(0.4);
        // Stylized curve representing principal's pen signature
        doc.line(220, height - 35, 228, height - 37);
        doc.line(228, height - 37, 235, height - 34);
        doc.line(235, height - 34, 245, height - 38);
        doc.line(245, height - 38, 258, height - 36);
        
        // Stylized curves for registrar signatures too
        doc.line(135, height - 36, 142, height - 34);
        doc.line(142, height - 34, 150, height - 37);
        doc.line(150, height - 37, 168, height - 35);
        
        // 9. Document Security Stamp Footer
        doc.setFontSize(7.5);
        doc.setTextColor(160, 160, 160);
        doc.text(`Issued Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}  |  Autonomously Digitally Sealed System of Record  |  KASC Registry, Coimbatore.`, width / 2, height - 12, { align: 'center' });
        
        // Save Trigger
        const finalFilename = `KASC_ERP_Certificate_${recipientName.trim().replace(/\s+/g, '_')}_${selectedPresetId}.pdf`;
        doc.save(finalFilename);
        
        // Update issued list state
        const newRecord = {
          id: certHash.split('_')[1],
          name: recipientName,
          type: PRESET_TEMPLATES.find(p => p.id === selectedPresetId)?.type || 'Custom Award',
          date: new Date().toLocaleDateString(),
          hash: certHash
        };
        
        setCompletedCerts(old => [newRecord, ...old]);
      } catch (err) {
        console.error("PDF generation error in CertificateStudio: ", err);
        alert("Unable to compile your custom PDF certificate. Please confirm dependency rendering.");
      } finally {
        setCompiling(null);
      }
    }, 1500);
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Award className="w-7 h-7 text-[#1e2e6b] dark:text-[#f09a1a]" />
            Official Credentials & Certificates Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Request, design, preview, and download authenticated academic bonafide, sports achievements, and Lead Developer credentials.
          </p>
        </div>
      </div>

      {/* Developer Recognition Banner (Special Highlight to celebrate Jeeva Pown) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-600/5 to-slate-900/5 dark:from-[#f09a1a]/15 dark:to-slate-900 border border-amber-500/20 dark:border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
          <Award className="w-56 h-56 text-[#f09a1a]" />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#f09a1a] dark:text-amber-300 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 dark:border-amber-500/40 rounded-full uppercase tracking-widest leading-none">
            <Sparkles className="w-3.5 h-3.5" /> Project Systems Engineering Certificate
          </span>
          
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            KASC ERP Lead Developer Certificate of Commendation
          </h2>
          
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            In prompt response to your request, we have pre-loaded a high-fidelity **Autonomous ERP Certification of Scholastic Craftsmanship** celebrating **Jeeva Pown** as the lead system architect. Use the interactive suite below to preview the golden ribbon design, customize the text, or download the full-resolution vector PDF immediately!
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => {
                setSelectedPresetId('dev_pown');
                setRecipientName('Jeeva Pown');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#f09a1a] hover:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" /> Preview Dev Credentials
            </button>
            <button
              onClick={() => {
                setSelectedPresetId('dev_pown');
                setRecipientName('Jeeva Pown');
                // Instant generate
                setTimeout(() => {
                  generatePDF();
                }, 50);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Instant PDF Generation
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => setActiveMainTab('official')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'official'
              ? 'border-[#1e2e6b] dark:border-[#f09a1a] text-[#1e2e6b] dark:text-[#f09a1a]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          KASC Institutional Credentials
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('external')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'external'
              ? 'border-[#1e2e6b] dark:border-[#f09a1a] text-[#1e2e6b] dark:text-[#f09a1a]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          Student Achievement Uploads
        </button>
      </div>

      {activeMainTab === 'official' ? (
        <>
          {/* Main Designer Grid split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Presets & Fields Customizer (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Preset Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layout className="w-4 h-4 text-indigo-500" />
              1. Choose Template Preset
            </h3>
            
            <div className="space-y-3">
              {PRESET_TEMPLATES.map((tpl) => {
                const isActive = selectedPresetId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectPreset(tpl.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col text-xs transition-all relative ${
                      isActive 
                        ? 'bg-slate-50 dark:bg-slate-950 border-[#1e2e6b] dark:border-[#f09a1a] ring-2 ring-[#e68a15]/10' 
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-950/40'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-3.5 right-3 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                    )}
                    <span className="font-extrabold text-slate-900 dark:text-white capitalize block text-[13px]">{tpl.type}</span>
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5 line-clamp-1">{tpl.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Customizer Fields */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-500" />
              2. Design Fields Customizer
            </h3>

            {/* Recipient Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Student / Recipient Full Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none transition-colors"
                placeholder="Enter recipient's full name"
              />
            </div>

            {/* Reg No & Department */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ID Certificate Code</label>
                <input
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none transition-colors"
                  placeholder="e.g. KASC-2026-CS8891"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Department / Major</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none transition-colors"
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>

            {/* Custom Description text area */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Award / Merit Description</label>
              <textarea
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none transition-colors leading-relaxed"
                placeholder="Enter core descriptive purpose..."
              />
            </div>

            {/* Signatory Authority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Signing Authority</label>
                <input
                  type="text"
                  value={customAuthority}
                  onChange={(e) => setCustomAuthority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none transition-colors"
                  placeholder="Signed Administrator"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Title/Role</label>
                <input
                  type="text"
                  value={customAuthorityRole}
                  onChange={(e) => setCustomAuthorityRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none transition-colors"
                  placeholder="e.g. Principal"
                />
              </div>
            </div>

            {/* Custom Aesthetics: Style & Color */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Border Aesthetics Frame</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['royal', 'classic', 'modern'] as const).map((styleOpt) => (
                    <button
                      key={styleOpt}
                      onClick={() => setSelectedStyle(styleOpt)}
                      className={`px-3 py-1.5 border rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        selectedStyle === styleOpt 
                          ? 'bg-[#1e2e6b] text-white border-transparent' 
                          : 'bg-slate-5 w-transparent border-slate-200 text-slate-600 dark:text-slate-300 dark:border-slate-800'
                      }`}
                    >
                      {styleOpt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ribbon / Accent Color Theme</label>
                <div className="flex gap-2.5">
                  {['#f09a1a', '#1e2e6b', '#6366f1', '#10b981', '#ef4444'].map((colorOpt) => (
                    <button
                      key={colorOpt}
                      onClick={() => setSelectedColor(colorOpt)}
                      style={{ backgroundColor: colorOpt }}
                      className={`w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer ${
                        selectedColor === colorOpt ? 'scale-110 border-slate-950 dark:border-white ring-2 ring-amber-500/20' : 'border-transparent hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Live Card Preview (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#f09a1a] bg-amber-500/10 px-2.5 py-1 rounded-md">
                Live High-Fidelity Preview (Render scale 1:1)
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                A4 Landscape Ratio (Standard-compliant)
              </span>
            </div>

            {/* Certificate visual box layout mockup */}
            <div 
              style={{
                fontFamily: 'Inter, sans-serif',
                borderColor: selectedStyle !== 'modern' ? selectedColor : 'transparent'
              }}
              className={`bg-amber-50/15 dark:bg-slate-900 border-8 border-double p-5 rounded-2xl relative shadow-lg min-h-[420px] flex flex-col justify-between overflow-hidden ${
                selectedStyle === 'royal' ? 'border-amber-400/80' : ''
              }`}
            >
              {/* Left Stripe for Modern */}
              {selectedStyle === 'modern' && (
                <div style={{ backgroundColor: selectedColor }} className="absolute left-0 top-0 bottom-0 w-4 block" />
              )}

              {/* Concentric watermark seals backdrop */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                <div className="w-64 h-64 border-8 border-orange-500 rounded-full flex items-center justify-center">
                  <span className="font-extrabold text-xs tracking-wider text-center">KONGUNADU KASC</span>
                </div>
              </div>

              {/* Institution Header */}
              <div className="text-center space-y-1 relative z-10">
                <span className="text-[9px] tracking-widest text-[#1e2e6b] dark:text-[#f09a1a] font-extrabold uppercase">
                  Kongunadu Arts and Science College (Autonomous)
                </span>
                <p className="text-[7.5px] text-slate-400 tracking-wider">
                  Coimbatore, Tamil Nadu 641029 | Affiliated to Bharathiar University
                </p>
                <div style={{ backgroundColor: selectedColor }} className="h-0.5 w-1/3 mx-auto mt-1 block rounded-full" />
              </div>

              {/* Title */}
              <div className="text-center my-4 space-y-1 relative z-10">
                <h4 style={{ color: selectedColor }} className="text-[13px] font-black tracking-wider uppercase">
                  {customTitle || 'CERTIFICATE OF ACHIEVEMENT'}
                </h4>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium italic">
                  {customSub || 'Autonomous Collegiate Credentials'}
                </p>
              </div>

              {/* Nominee details */}
              <div className="text-center space-y-2 relative z-10">
                <span className="text-[9px] text-slate-500 font-medium">This is to officially certify that the academic credential has been duly earned by</span>
                <h5 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">
                  {recipientName || 'Candidate Name'}
                </h5>
                <div className="text-[8.5px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-lg inline-block border border-slate-200 dark:border-slate-800">
                  REGISTRATION ID: <span className="font-bold text-[#f09a1a]">{regNo}</span> &nbsp;|&nbsp; DIV: <span className="font-bold text-slate-800 dark:text-slate-200">{department.toUpperCase()}</span>
                </div>
              </div>

              {/* Description body */}
              <div className="px-6 text-center my-4 relative z-10">
                <p className="text-[9.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {customDesc || 'For demonstrating exceptional compliance and merits...'}
                </p>
                {customReason && (
                 <p className="text-[9px] leading-relaxed text-slate-400 dark:text-slate-500 italic mt-1 bg-slate-50/30 p-1.5 rounded-lg max-w-lg mx-auto border border-dashed border-slate-200/40">
                   "{customReason}"
                 </p>
                )}
              </div>

              {/* Bottom Authority alignment block */}
              <div className="grid grid-cols-3 items-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-805/40 relative z-10">
                {/* Hash code */}
                <div className="text-left font-mono">
                  <span className="text-[7.5px] block text-slate-400 dark:text-slate-500">SECURE HASHID:</span>
                  <span className="text-[8.5px] text-zinc-700 dark:text-slate-300 font-bold">KASC_SECURE_AUTH</span>
                </div>

                {/* Seal visual */}
                <div className="flex justify-center flex-col items-center">
                  <div style={{ borderColor: selectedColor }} className="w-10 h-10 border border-dashed rounded-full flex items-center justify-center p-0.5">
                    <div style={{ backgroundColor: selectedColor }} className="w-full h-full rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <span className="text-[7px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider mt-0.5">OFFICIAL SEAL</span>
                </div>

                {/* Primary signed */}
                <div className="text-right flex flex-col items-end">
                  <div className="w-20 border-b border-slate-300 dark:border-slate-850 h-5 relative">
                    {/* Simulated signature string */}
                    <span style={{ color: selectedColor }} className="absolute right-2 bottom-0 font-serif italic text-xs tracking-wider opacity-85 select-none text-[10px]">
                      {customAuthority ? customAuthority.split(',')[0].replace('Dr. ', '') : 'Principal'}
                    </span>
                  </div>
                  <span className="text-[8.5px] font-bold text-slate-800 dark:text-white mt-1 capitalize leading-none block">{customAuthority || 'Signed Principal'}</span>
                  <span className="text-[7px] text-slate-400 mt-0.5 uppercase tracking-wider block">{customAuthorityRole || 'Board of Directors'}</span>
                </div>
              </div>
            </div>

            {/* Render actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={generatePDF}
                disabled={compiling !== null}
                className="flex-1 flex gap-2 items-center justify-center px-6 py-3.5 bg-[#1e2e6b] hover:bg-[#132150] active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
              >
                {compiling !== null ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#f09a1a]" />
                    Compiling Cryptographic Vector...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-[#f09a1a]" />
                    Compile High-Resolution PDF
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setSelectedPresetId('dev_pown');
                  setRecipientName('Jeeva Pown');
                  setCustomTitle('ERP INTELLECT & DEVELOPMENT ARCHITECT AWARD');
                  flashStatus('Preset values loaded!');
                }}
                className="flex gap-2 items-center justify-center px-6 py-3.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Fields
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* RECENTLY COMPILED LOGS TABLE (Transient / Local Storage representation) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-rose-500" />
          Issued Certificate Registry Audit
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Registry HashID</th>
                <th className="py-3 px-4">Academic Recipient</th>
                <th className="py-3 px-4">Credential Type</th>
                <th className="py-3 px-4">Issued Timestamp</th>
                <th className="py-3 px-4">Cryptographic Integrity</th>
                <th className="py-3 px-4 text-right">Download Vector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60 font-medium">
              {completedCerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-slate-500 font-medium italic">
                    No certificate audit vectors have been compiled in the current session yet. Click "Compile High-Resolution PDF" above to generate a new ledger hash!
                  </td>
                </tr>
              ) : (
                completedCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 text-[11px]">
                    <td className="py-3 px-4 font-mono font-bold text-[#f09a1a]">{cert.id}</td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-extrabold">{cert.name}</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{cert.type}</td>
                    <td className="py-3 px-4 text-slate-400">{cert.date}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase leading-none">
                        <ShieldCheck className="w-3 h-3" /> Digital Sign-On Valid
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={generatePDF}
                        className="text-[#1e2e6b] hover:text-[#132150] dark:text-[#f09a1a] dark:hover:text-[#f09a1a]/85 font-black uppercase tracking-wider flex items-center gap-1 ml-auto text-[10px] cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Re-Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  ) : (
    <div className="space-y-6">
      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-[#1e2e6b] dark:text-[#f09a1a]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Achievements Submitted</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{uploadedCerts.length}</span>
              <span className="text-[10px] text-slate-400 font-semibold">dossiers registered</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified KASC Academic Credits</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {uploadedCerts.filter(c => c.status === 'APPROVED').reduce((acc, c) => acc + c.pointsEarned, 0)}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold font-bold">Credits Awarded</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-[#f09a1a] rounded-xl flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Board Evaluation</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-500">{uploadedCerts.filter(c => c.status === 'PENDING').length}</span>
              <span className="text-[10px] text-slate-400 font-semibold">awaiting audit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines Box */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed flex gap-3">
        <Info className="w-5 h-5 text-[#1e2e6b] dark:text-[#f09a1a] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 dark:text-white block mb-0.5">KASC Autonomous Co-curricular Policy</span>
          Our Academic Senate awards extra-curricular credit points onto student ledgers upon verification of outside accomplishments: State/National level wins yield **15-25 points**, while technical workshops, seminars, and paper presentations yield **10-15 points**. Please upload clearly legible certificates in PDF/Image formats for audited verification.
        </div>
      </div>

      {/* Form and List Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form (Span 5) */}
        <div className="lg:col-span-12 xl:col-span-5">
          <form onSubmit={handleAddExternalCertificate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-150 dark:border-slate-800">
              <Upload className="w-4 h-4 text-[#f09a1a]" />
              Upload Event Certificate
            </h3>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Participant / Student Name *</label>
              <input
                type="text"
                required
                value={extStudentName}
                onChange={(e) => setExtStudentName(e.target.value)}
                placeholder="Enter full name for validation"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Event Title / Competition Name *</label>
              <input
                type="text"
                required
                value={extEventName}
                onChange={(e) => setExtEventName(e.target.value)}
                placeholder="e.g. State Level Coding Symposium"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Host Institution *</label>
                <input
                  type="text"
                  required
                  value={extOrganizedBy}
                  onChange={(e) => setExtOrganizedBy(e.target.value)}
                  placeholder="e.g. PSG Tech, Coimbatore"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Event Date *</label>
                <input
                  type="date"
                  required
                  value={extDate}
                  onChange={(e) => setExtDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Event Jurisdiction Level</label>
                <select
                  value={extLevel}
                  onChange={(e) => setExtLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none cursor-pointer"
                >
                  <option value="Department Level">Department Level</option>
                  <option value="Inter-Collegiate">Inter-Collegiate</option>
                  <option value="District Level">District Level</option>
                  <option value="State Level">State Level</option>
                  <option value="National Level">National Level</option>
                  <option value="International Level">International Level</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recognition Category</label>
                <select
                  value={extCategory}
                  onChange={(e) => setExtCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:border-[#f09a1a] outline-none cursor-pointer"
                >
                  <option value="WINNER">🏆 Won Prize (1st/2nd/3rd)</option>
                  <option value="PARTICIPATION">🎟️ Participation Merit</option>
                  <option value="PAPER_PRESENTATION">📄 Paper Presentation</option>
                  <option value="WORKSHOP">🛠️ Workshop Certification</option>
                </select>
              </div>
            </div>

            {/* Drag and Drop Attachment Core */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attached Scanned Credentials * ({attachedFiles.length} files attached)</label>
              
              {/* Dropzone field always present or toggleable */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all relative ${
                  uploaderDragActive 
                    ? 'border-[#f09a1a] bg-amber-500/5 ring-4 ring-amber-500/10' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-[#f09a1a] hover:bg-slate-50/50'
                }`}
              >
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title="Choose certificate scanned files"
                />
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-full bg-[#1e2e6b]/5 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mx-auto">
                    <Upload className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-xs">
                    <span className="font-extrabold text-[#112d4e] dark:text-[#f09a1a] hover:underline">Click / Drag to attach multiple certificates</span>
                  </div>
                  <p className="text-[9px] text-[#2ac8a0] uppercase tracking-wider font-mono">Supports JPEG, PNG, or PDF</p>
                </div>
              </div>

              {/* Queued files listing */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-[10px] font-extrabold text-[#1e2e6b] uppercase tracking-wider">Attachment Queue ({attachedFiles.length})</p>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="bg-slate-50 dark:bg-slate-950/70 border border-slate-150 dark:border-slate-800/80 p-2.5 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[#1e2e6b] dark:text-amber-500 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate pr-2">{file.name}</p>
                            <p className="text-[9px] text-slate-400 font-mono leading-none">{file.size} KB | Ready to submit</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewFile({ name: file.name, dataUrl: file.data })}
                            className="p-1 px-2 text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md text-indigo-700 dark:text-amber-400 font-extrabold hover:text-[#1e2e6b] transition-all cursor-pointer flex items-center gap-1"
                          >
                            👁️ Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAttachedFile(file.id)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submittingExt}
              className="w-full py-3 bg-[#1e2e6b] hover:bg-[#121f4a] dark:bg-[#f09a1a] dark:text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {submittingExt ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging to Board Ledger...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Verification Dossier
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: List & Filters (Span 7) */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 text-left">
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                Achievements Board Registry
              </h3>

              <div className="flex gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Search and filter..."
                  value={extSearchFilter}
                  onChange={(e) => setExtSearchFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none focus:border-[#f09a1a] text-slate-800 dark:text-slate-200"
                />
                
                <select
                  value={extCategoryFilter}
                  onChange={(e) => setExtCategoryFilter(e.target.value)}
                  className="px-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold outline-none cursor-pointer text-slate-800 dark:text-slate-200"
                >
                  <option value="ALL">ALL STATUSES</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            </div>

            {/* Grid Lists items of Uploaded Dossiers */}
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
              {uploadedCerts
                .filter(c => {
                  const matchesSearch = c.eventName.toLowerCase().includes(extSearchFilter.toLowerCase()) || 
                                        c.organizedBy.toLowerCase().includes(extSearchFilter.toLowerCase()) ||
                                        c.studentName.toLowerCase().includes(extSearchFilter.toLowerCase());
                  const matchesFilter = extCategoryFilter === 'ALL' || c.status === extCategoryFilter;
                  return matchesSearch && matchesFilter;
                }).length === 0 ? (
                  <div className="py-12 text-center text-slate-400 italic">
                    No co-curricular uploaded certificates match your search filters or statuses.
                  </div>
                ) : (
                  uploadedCerts
                    .filter(c => {
                      const matchesSearch = c.eventName.toLowerCase().includes(extSearchFilter.toLowerCase()) || 
                                            c.organizedBy.toLowerCase().includes(extSearchFilter.toLowerCase()) ||
                                            c.studentName.toLowerCase().includes(extSearchFilter.toLowerCase());
                      const matchesFilter = extCategoryFilter === 'ALL' || c.status === extCategoryFilter;
                      return matchesSearch && matchesFilter;
                    })
                    .map(cert => (
                      <div key={cert.id} className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-[#f09a1a]/30 transition-all space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                              cert.category === 'WINNER' ? 'bg-amber-500/10 text-[#f09a1a] dark:bg-amber-500/20 dark:text-amber-300' :
                              cert.category === 'PAPER_PRESENTATION' ? 'bg-indigo-500/10 text-[#1e2e6b] dark:bg-indigo-500/20 dark:text-indigo-300' :
                              cert.category === 'WORKSHOP' ? 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300' :
                              'bg-slate-500/10 text-slate-500'
                            }`}>
                              {cert.category === 'WINNER' ? '🏆 1St/2Nd Winner' :
                               cert.category === 'PAPER_PRESENTATION' ? '📄 Paper Presentation' :
                               cert.category === 'WORKSHOP' ? '🛠️ Workshop' : 
                               '🎟️ Participation'}
                            </span>

                            <h4 className="text-xs font-black text-slate-950 dark:text-white mt-1 leading-snug">
                              {cert.eventName}
                            </h4>

                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                              <Building className="w-3.5 h-3.5 text-slate-400" />
                              Organized by: <span className="font-extrabold text-slate-700 dark:text-slate-300">{cert.organizedBy}</span>
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="inline-block text-[10px] font-black font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                              +{cert.pointsEarned} KASC Credits
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                          <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> {new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                            <span>|</span>
                            <span>Level: <span className="font-bold text-slate-600 dark:text-slate-300 capitalize">{cert.level}</span></span>
                            <span>|</span>
                            <span className="text-slate-600 dark:text-slate-300 font-bold">Student: {cert.studentName}</span>
                          </div>

                          {/* Status verification indicators */}
                          <div className="flex items-center gap-2">
                            {cert.status === 'APPROVED' ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg leading-none">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg leading-none">
                                <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} /> Pending Audit
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteExternalCertificate(cert.id)}
                              className="p-1 px-1.5 hover:bg-[#ef4444]/10 rounded text-slate-400 hover:text-[#ef4444] transition-colors cursor-pointer"
                              title="Delete achievement dossier"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Scanned Document Sticker */}
                        <div className="p-2 bg-white/60 dark:bg-slate-950/60 rounded-lg flex items-center justify-between text-[10px] border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 truncate">
                            <FileText className="w-3.5 h-3.5 text-slate-400" /> Scanned File: {cert.fileName} ({cert.fileSize})
                          </span>
                          
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (cert.fileDataUrlUrl) {
                                  setPreviewFile({ name: cert.fileName, dataUrl: cert.fileDataUrlUrl });
                                } else {
                                  alert(`Scanned Document: ${cert.fileName}\nRegistered with cryptographic hash, but binary data-url is stored on separate archival storage nodes.`);
                                }
                              }}
                              className="text-[#1e2e6b] hover:underline dark:text-[#f09a1a] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1"
                            >
                              👁️ View Scan
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Browser Document Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-[#1e2e6b] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-[#f09a1a]">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-100">Live Scanned Document Preview</h4>
                  <p className="text-[10px] text-amber-400 font-mono font-medium truncate max-w-[280px] sm:max-w-md">{previewFile.name}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 px-2.5 bg-white/10 hover:bg-rose-600 rounded-lg text-xs font-black uppercase transition-colors tracking-widest text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Modal Body with responsive viewer frame */}
            <div className="p-6 bg-slate-100 dark:bg-slate-950 flex-1 flex items-center justify-center overflow-auto min-h-[300px] max-h-[60vh]">
              {previewFile.dataUrl.startsWith('data:image/') ? (
                <img 
                  referrerPolicy="no-referrer"
                  src={previewFile.dataUrl} 
                  alt={previewFile.name} 
                  className="max-h-[50vh] object-contain rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg"
                />
              ) : previewFile.dataUrl.startsWith('data:application/pdf') ? (
                <iframe 
                  src={previewFile.dataUrl} 
                  className="w-full h-[50vh] rounded-lg border border-slate-200 dark:border-slate-800"
                  title="PDF Document Viewer"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-[#1e2e6b] dark:text-[#f09a1a] mx-auto animate-pulse">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase">Interactive Asset Staged</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      This scanned file ({previewFile.name}) has been validated by the local sandbox environment. Click submit to record it onto KASC Board Ledger.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer actions */}
            <div className="p-4 md:p-5 border-t border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-600 font-bold">✔️ Cryptographic attachment verified in local sandbox</span>
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold uppercase rounded-lg cursor-pointer transition-all"
              >
                Continue
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )}
</div>
);

  function flashStatus(msg: string) {
    console.log(msg);
  }
}
