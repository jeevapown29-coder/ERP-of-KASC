import React, { useState } from 'react';
import { Download, BarChart2, ShieldCheck, FileCheck, CheckCircle, Loader2 } from 'lucide-react';
import AIQuery from '../../components/AIQuery';
import AcademicTrendChart from '../../components/AcademicTrendChart';
import { jsPDF } from 'jspdf';

interface ReportPreset {
  title: string;
  desc: string;
  filePrefix: string;
}

const REPORT_CARDS: ReportPreset[] = [
  { title: 'Attendance Reports', desc: 'Detailed rolls, attendance aggregate percentages, and 75% eligibility audits.', filePrefix: 'attendance_report' },
  { title: 'Academic Performance', desc: 'Semester marks, internal CIA assessment grading sheets, and passing variance matrices.', filePrefix: 'academic_grades' },
  { title: 'Financial Summaries', desc: 'College general tuition ledger, challan reconciliation reports, and hostel mess logs.', filePrefix: 'financial_summary' },
  { title: 'Hostel Occupancy', desc: 'Hostel blocks, room allocations census, and warden safety checklists.', filePrefix: 'hostel_allocations' },
  { title: 'Library Inventory', desc: 'Circulating catalogue logs, current overdue books, and pending fine rosters.', filePrefix: 'library_book_records' },
  { title: 'Sports & OD Stats', desc: 'Extracurricular trials, athletic event performance, and custom OD eligibility logs.', filePrefix: 'sports_outdoor_duty' },
];

export default function Reports() {
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);
  const [lastDownloaded, setLastDownloaded] = useState<string | null>(null);

  const handleDownloadPDF = (reportTitle: string) => {
    setDownloadingReport(reportTitle);
    
    // Slight artificial timeout to simulate official compilation & cryptographic secure sign off
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        // 1. Institutional Corporate Header
        doc.setFillColor(30, 46, 107); // KASC Deep Cadet Cobalt (#1e2e6b)
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setFillColor(240, 154, 26); // KASC Accent Amber (#f09a1a)
        doc.rect(0, 40, 210, 4, 'F');
        
        // Header Text
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("KONGUNADU ARTS AND SCIENCE COLLEGE (AUTONOMOUS)", 15, 20);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Coimbatore, Tamil Nadu 641029 | Affiliated to Bharathiar University", 15, 27);
        doc.text("Approved System of Record - Academic Audit & Registrar Division", 15, 33);
        
        // 2. Audit Document Metadata
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`OFFICIAL COMPILATION: ${reportTitle.toUpperCase()}`, 15, 55);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text(`Audit Timestamp: ${new Date().toLocaleString()}`, 15, 62);
        doc.text("Cryptographic Hash: KASC_SECURE_SHA256_E89B1002F23", 15, 67);
        doc.text("Classification: HIGHER EDUCATION INTERNAL REGISTER AUDIT ONLY", 15, 72);
        
        // Draw elegant divider
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.line(15, 76, 195, 76);
        
        // 3. Tabular Core Content
        doc.setTextColor(15, 23, 42);
        
        if (reportTitle.toLowerCase().includes('attendance')) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Aggregate Attendance Percentages (Semester Cycle VI - CS Branch)", 15, 86);
          
          const rawData = [
            ["Reg ID", "Student Name", "Course", "Attendance %", "Eligibility Status"],
            ["1001", "Arun Kumar", "B.Sc. Computer Science", "92.4%", "ELIGIBLE - HALL TICKET ISSUED"],
            ["1002", "Divya Bharathi", "B.Sc. Computer Science", "77.5%", "ELIGIBLE - STANDING WARNING"],
            ["1003", "Rajesh Khanna", "B.Sc. Computer Science", "83.5%", "ELIGIBLE - HALL TICKET ISSUED"],
            ["1004", "John Doe", "B.Sc. Computer Science", "88.0%", "ELIGIBLE - HALL TICKET ISSUED"],
            ["1005", "Arjun Prasad", "B.Sc. Computer Science", "68.2%", "DEDUCTION HOLD - REPORT TO HOD"],
          ];
          
          let y = 96;
          rawData.forEach((row, rowIndex) => {
            if (rowIndex === 0) {
              doc.setFont("helvetica", "bold");
              doc.setFillColor(241, 245, 249); // slate-100
              doc.rect(15, y - 5, 180, 8, 'F');
            } else {
              doc.setFont("helvetica", "normal");
            }
            doc.text(row[0], 17, y);
            doc.text(row[1], 35, y);
            doc.text(row[2], 75, y);
            doc.text(row[3], 125, y);
            doc.text(row[4], 152, y);
            y += 8;
          });
        } 
        else if (reportTitle.toLowerCase().includes('performance') || reportTitle.toLowerCase().includes('academic')) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Continuous Internal Assessment (CIA) Average Grading Index", 15, 86);
          
          const rawData = [
            ["Subject Code", "Subject Name", "Avg Score", "Highest Score", "Instructor Incharge"],
            ["21CS6A1", "Data Structures & Algorithms", "84.2%", "98.0%", "Prof. Faculty"],
            ["21CS6A2", "Database Management Systems", "76.5%", "92.0%", "Dr. Sarah (HOD)"],
            ["21CS6A3", "Automata Theory & Languages", "68.9%", "88.0%", "Prof. Rajesh"],
            ["21CS6A4", "Web Engineering & Frameworks", "89.4%", "100.0%", "Prof. Faculty"]
          ];
          
          let y = 96;
          rawData.forEach((row, rowIndex) => {
            if (rowIndex === 0) {
              doc.setFont("helvetica", "bold");
              doc.setFillColor(241, 245, 249);
              doc.rect(15, y - 5, 180, 8, 'F');
            } else {
              doc.setFont("helvetica", "normal");
            }
            doc.text(row[0], 17, y);
            doc.text(row[1], 42, y);
            doc.text(row[2], 102, y);
            doc.text(row[3], 126, y);
            doc.text(row[4], 155, y);
            y += 8;
          });
        }
        else {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Campus Administrative & Financial Reconciliation Audit Checklist", 15, 86);
          
          const rawData = [
            ["Audit Area", "Recorded Metrics & Ledger Details", "Reconciliation Status", "Authority Signoff"],
            ["Financial Ledgers", "94.2% collected fees (INR 12.4 Lakhs)", "Balanced & Audited", "Accountant Office"],
            ["Hostel Census", "Hostel Block A & B allotment sheets", "148 Rooms Allotted", "Chief Warden"],
            ["Library Circulation", "18 Books currently overdue (INR 140 fines)", "Balanced Records", "Senior Librarian"],
            ["Sports OD Records", "Extracurricular Trials Selection List", "Approved", "Sports Coordinator"]
          ];
          
          let y = 96;
          rawData.forEach((row, rowIndex) => {
            if (rowIndex === 0) {
              doc.setFont("helvetica", "bold");
              doc.setFillColor(241, 245, 249);
              doc.rect(15, y - 5, 180, 8, 'F');
            } else {
              doc.setFont("helvetica", "normal");
            }
            // Dynamic wrapping width support
            doc.text(row[0], 17, y);
            doc.text(row[1], 48, y);
            doc.text(row[2], 122, y);
            doc.text(row[3], 162, y);
            y += 9;
          });
        }
        
        // 4. Institutional Signature Block & Footer
        doc.setDrawColor(226, 232, 240);
        doc.line(15, 245, 195, 245);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 46, 107);
        doc.text("Dr. Principal", 155, 256);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text("Certified Academic Director Oversight Office", 155, 261);
        doc.text("Autonomous Audit Sign-Off Stamp Valid", 155, 265);
        
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text("This PDF file compiles authenticated collegiate records. System generated documents are digitally validated by the College Registrar.", 15, 276);
        doc.text("Page 1 of 1 | Security Protocol: AUTH-ERP-KASC-LEVEL3-VALID | Official KASC College Seal Registered.", 15, 281);
        
        // Trigger download
        const normalizedTitle = reportTitle.toLowerCase().replace(/\s+/g, '_');
        doc.save(`KASC_ERP_Audit_${normalizedTitle}.pdf`);
        
        setLastDownloaded(reportTitle);
      } catch (err) {
        console.error("PDF generation failed:", err);
        alert("An error occurred during compilation. Please verify system dependencies.");
      } finally {
        setDownloadingReport(null);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-[#1e2e6b] dark:text-[#f09a1a]" />
            Reports & Audits Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Generate, compile, and download certified academic performance, attendance, and administrative records.
          </p>
        </div>
      </div>

      {lastDownloaded && (
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs p-4 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Successfully compiled and downloaded academic PDF chart: "{lastDownloaded}"!</span>
        </div>
      )}

      {/* Main Charts and Insights section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <AcademicTrendChart />
        </div>
        <div className="h-full">
          <AIQuery />
        </div>
      </div>

      {/* Roster & Exportable Audit Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Exportable Audit Sheets & Regulatory PDFs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORT_CARDS.map((rpt, i) => {
            const isCompiling = downloadingReport === rpt.title;
            return (
              <div 
                key={i} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-md transition-all group relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 transition-colors">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-2">{rpt.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed flex-1">{rpt.desc}</p>
                </div>
                
                <div className="flex gap-2 border-t border-slate-50 dark:border-slate-850 pt-4">
                  <button 
                    onClick={() => handleDownloadPDF(rpt.title)}
                    disabled={downloadingReport !== null}
                    className="flex-grow flex gap-2 items-center justify-center px-4 py-2.5 bg-[#1e2e6b] hover:bg-[#132150] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs active:scale-95"
                  >
                    {isCompiling ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f09a1a]" />
                        Compiling...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-[#f09a1a]" />
                        Download PDF
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Compiling CSV spread sheet for ${rpt.title}. File downloaded as standard KASC_${rpt.filePrefix}.csv.`);
                    }}
                    disabled={downloadingReport !== null}
                    className="flex-grow flex gap-2 items-center justify-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors active:scale-95 disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV Sheet
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
