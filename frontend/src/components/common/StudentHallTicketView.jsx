import React, { useMemo } from 'react';
import {
  GraduationCap,
  Printer,
  Download,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Award,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { printOfficialHallTicket, downloadOfficialHallTicket } from '../../lib/exportFormatHelper';
import { loadExamSchedule } from '../../lib/timetableData';
import { useToast } from '../../context/ToastContext';

export default function StudentHallTicketView({ student }) {
  const toast = useToast();

  const resolvedStudent = useMemo(() => {
    const s = student || {};
    const roll = s.rollNumber || '101';
    return {
      name: s.name || 'Krrish Sharma',
      rollNumber: roll,
      seatNumber: `2024-IT-${String(roll).padStart(3, '0')}`,
      prn: s.prn || `PRN-2024098${String(roll).padStart(3, '0')}`,
      program: 'B.Tech in Information Technology',
      semester: s.semester || 'Semester 6',
      division: s.division ? `Div ${s.division}` : 'Div A',
      academicYear: '2026–2027',
      center: 'Campus Center #04 (Examination Block A & B)',
      attendancePercentage: s.percentage || s.attendancePercentage || 89.5,
      feeStatus: s.feeStatus || 'paid',
      accountsRef: `AC-992${roll}`,
      avatarUrl: s.avatarUrl || (s.gender === 'Female' ? '/assets/female_student_avatar.jpg' : '/assets/student_avatar.jpg')
    };
  }, [student]);

  const allPapers = useMemo(() => {
    try {
      const stored = loadExamSchedule();
      if (stored && stored.length > 0) {
        return stored.map((p, idx) => ({
          paperCode: p.paperCode,
          subjectName: p.subjectName,
          category: p.examType || (p.paperCode.endsWith('L') ? 'Practical Lab & Viva' : 'Theory Written'),
          duration: p.duration || '3 Hours',
          marks: p.marks || 100,
          credits: p.credits || (p.paperCode.endsWith('L') ? 1.0 : 4.0),
          date: p.date,
          day: p.day,
          time: p.time,
          shift: p.shift,
          room: p.room,
          seatNo: p.seatingBlock || `Desk #${String(idx * 7 + 14)} (Block A)`,
          invigilator: p.invigilator || 'Faculty Invigilator'
        }));
      }
    } catch (e) {
      // fallback
    }

    return [
      { paperCode: 'IT-301', subjectName: 'Core Java & Object-Oriented Frameworks', category: 'Theory Written', duration: '3 Hours', marks: 100, credits: 4.0, date: 'Nov 10, 2026', day: 'Tuesday', time: '10:00 AM - 01:00 PM', shift: 'Morning Shift', room: 'Exam Hall A-101', seatNo: 'Desk #14 (Block A)' },
      { paperCode: 'IT-302', subjectName: 'Database Management Systems & Transactions', category: 'Theory Written', duration: '3 Hours', marks: 100, credits: 4.0, date: 'Nov 13, 2026', day: 'Friday', time: '10:00 AM - 01:00 PM', shift: 'Morning Shift', room: 'Exam Hall A-102', seatNo: 'Desk #14 (Block A)' },
      { paperCode: 'IT-303', subjectName: 'Distributed Systems & Cloud Computing', category: 'Theory Written', duration: '3 Hours', marks: 100, credits: 4.0, date: 'Nov 17, 2026', day: 'Tuesday', time: '10:00 AM - 01:00 PM', shift: 'Morning Shift', room: 'Exam Hall B-201', seatNo: 'Desk #14 (Block B)' },
      { paperCode: 'IT-304', subjectName: 'Computer Networks & Network Security', category: 'Theory Written', duration: '3 Hours', marks: 100, credits: 4.0, date: 'Nov 20, 2026', day: 'Friday', time: '10:00 AM - 01:00 PM', shift: 'Morning Shift', room: 'Exam Hall B-202', seatNo: 'Desk #14 (Block B)' },
      { paperCode: 'IT-301L', subjectName: 'Core Java Programming Laboratory Viva', category: 'Practical Lab & Viva', duration: '4 Hours', marks: 50, credits: 1.0, date: 'Nov 24, 2026', day: 'Tuesday', time: '09:00 AM - 01:00 PM', shift: 'Practical Batch 1', room: 'Computing Lab A-1', seatNo: 'Terminal #08 (Lab A-1)' },
      { paperCode: 'IT-302L', subjectName: 'DBMS & SQL Performance Laboratory Viva', category: 'Practical Lab & Viva', duration: '4 Hours', marks: 50, credits: 1.0, date: 'Nov 26, 2026', day: 'Thursday', time: '01:30 PM - 05:30 PM', shift: 'Practical Batch 2', room: 'Computing Lab A-2', seatNo: 'Terminal #08 (Lab A-2)' },
      { paperCode: 'IT-305', subjectName: 'Capstone Project Phase 1 Board Defense', category: 'Project Defense', duration: 'Full Day', marks: 100, credits: 3.0, date: 'Dec 01, 2026', day: 'Tuesday', time: '09:30 AM - 04:30 PM', shift: 'Board Review', room: 'Seminar Hall 1', seatNo: 'Project Panel 2' }
    ];
  }, []);

  const handlePrint = () => {
    printOfficialHallTicket(resolvedStudent, allPapers);
    if (toast?.info) {
      toast.info('Printing Hall Ticket', 'Prepared official A4 Admit Card for all combined subjects.');
    }
  };

  const handleDownload = () => {
    downloadOfficialHallTicket(resolvedStudent, allPapers);
    if (toast?.success) {
      toast.success('Admit Card Downloaded', `Saved official hall ticket for Roll #${resolvedStudent.rollNumber}.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
      {/* 1. Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '20px 24px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: '12px',
              background: 'rgba(37, 99, 235, 0.25)',
              border: '1px solid rgba(96, 165, 250, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#93c5fd'
            }}
          >
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                End-Semester Examination Admit Card (Hall Ticket)
              </h2>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: '#dcfce7',
                  color: '#15803d'
                }}
              >
                All {allPapers.length} Subjects Combined
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
              Winter 2026 Examination · Verified Autonomous Ledger · All Theory, Practical & Project Papers
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.16s ease'
            }}
            title="Print official standard A4 Admit Card"
          >
            <Printer size={16} />
            <span>Print Combined Hall Ticket</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.16s ease'
            }}
          >
            <Download size={16} />
            <span>Download HTML Admit Card</span>
          </button>
        </div>
      </div>

      {/* 2. The Official A4 Examination Admit Card Paper Sheet Preview */}
      <div
        style={{
          background: '#ffffff',
          border: '1.5px solid #0f172a',
          borderRadius: '14px',
          padding: '32px 36px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Block */}
        <div style={{ textAlign: 'center', borderBottom: '2.5px solid #0f172a', paddingBottom: '14px', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            EduTrack Institute of Technology (Autonomous)
          </h3>
          <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#475569', fontWeight: 700, letterSpacing: '0.04em' }}>
            AFFILIATED TO STATE TECHNOLOGICAL UNIVERSITY · APPROVED BY AICTE & UGC · ACCREDITED NAAC 'A++'
          </p>
          <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>
            Office of the Controller of Examinations · End-Semester Examination Hall Ticket
          </p>
          <div
            style={{
              display: 'inline-block',
              marginTop: '8px',
              padding: '4px 16px',
              background: '#0f172a',
              color: '#ffffff',
              borderRadius: '4px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            Winter 2026 Examination Admit Card · All Subjects Combined
          </div>
        </div>

        {/* Credentials Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 140px',
            gap: '16px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 18px', fontSize: '0.825rem' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Candidate Full Name
              </span>
              <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{resolvedStudent.name}</strong>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Roll Number / Seat Number
              </span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                #{resolvedStudent.rollNumber} · <span style={{ color: '#0f172a' }}>{resolvedStudent.seatNumber}</span>
              </strong>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Degree & Branch
              </span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>{resolvedStudent.program}</span>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Semester & Division
              </span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>{resolvedStudent.semester} ({resolvedStudent.division})</span>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                PRN / Enrolment No
              </span>
              <span style={{ color: '#334155', fontFamily: 'monospace', fontWeight: 600 }}>{resolvedStudent.prn}</span>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Clearance Verification
              </span>
              <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> {resolvedStudent.attendancePercentage}% Attendance (Cleared)
              </span>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Allotted Examination Center & Seating Block
              </span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>
                {resolvedStudent.center} · Desk Block A (Desks 01–60)
              </span>
            </div>
          </div>

          {/* Photo & Barcode Block */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #cbd5e1', paddingLeft: '14px' }}>
            <div style={{ width: 78, height: 88, borderRadius: '6px', border: '1.5px solid #94a3b8', overflow: 'hidden', background: '#e2e8f0', marginBottom: '6px' }}>
              <img src={resolvedStudent.avatarUrl} alt="Candidate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/assets/student_avatar.jpg'; }} />
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '2px' }}>
              |||| | ||||| | |||
            </div>
            <span style={{ fontSize: '0.625rem', color: '#64748b', fontFamily: 'monospace' }}>
              {resolvedStudent.seatNumber}
            </span>
          </div>
        </div>

        {/* Schedule Subheader Bar */}
        <div
          style={{
            background: '#0f172a',
            color: '#ffffff',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}
        >
          <span>Combined Schedule of All {allPapers.length} Registered Examination Papers (Theory, Labs & Defense)</span>
          <span>CBCS Autonomous Scheme 2026</span>
        </div>

        {/* COMBINED SCHEDULE TABLE */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', marginBottom: '16px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', color: '#0f172a', textAlign: 'center', borderBottom: '2px solid #0f172a' }}>
              <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '35px' }}>#</th>
              <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '75px' }}>Code</th>
              <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Course Title</th>
              <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '110px' }}>Category</th>
              <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '90px' }}>Date & Day</th>
              <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '110px' }}>Time Slot</th>
              <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', width: '120px' }}>Venue / Seat</th>
              <th style={{ padding: '8px 8px', border: '1px solid #cbd5e1', width: '70px' }}>Invigilator Sign</th>
            </tr>
          </thead>
          <tbody>
            {allPapers.map((paper, idx) => {
              const isLab = paper.category.toLowerCase().includes('lab') || paper.category.toLowerCase().includes('practical');
              const isProject = paper.category.toLowerCase().includes('project');

              return (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: isLab ? '#ecfdf5' : isProject ? '#fef3c7' : '#eff6ff',
                        color: isLab ? '#047857' : isProject ? '#b45309' : '#1d4ed8',
                        border: `1px solid ${isLab ? '#a7f3d0' : isProject ? '#fde68a' : '#bfdbfe'}`
                      }}
                    >
                      {paper.paperCode}
                    </span>
                  </td>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#0f172a' }}>
                    {paper.subjectName}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#475569' }}>{paper.category}</span>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <strong>{paper.date}</strong>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>({paper.day})</div>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.75rem' }}>
                    {paper.time}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{paper.room}</div>
                    <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>{paper.seatNo}</div>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center', height: '32px' }}>
                    {/* Blank box for invigilator's physical sign during exam */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Directives */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 14px', fontSize: '0.75rem', color: '#475569', lineHeight: 1.4, marginBottom: '18px' }}>
          <strong style={{ color: '#0f172a' }}>Important Candidate Directives:</strong><br />
          1. This authenticated Admit Card is valid for all {allPapers.length} combined registered papers. Candidates must carry this along with their RFID Student Smart Pass.<br />
          2. Reporting time is strictly 30 minutes prior to session commencement. Entry closes 15 minutes after start.<br />
          3. Mobile devices, smartwatches, and programmable calculators are strictly prohibited in the exam block.
        </div>

        {/* Tri-Signature Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px solid #cbd5e1' }}>
          <div style={{ textAlign: 'center', width: '180px' }}>
            <div style={{ width: '100%', height: '36px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
              Candidate Sign in Presence
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Candidate Signature</div>
          </div>

          <div style={{ textAlign: 'center', width: '180px' }}>
            <div style={{ fontFamily: 'Brush Script MT, cursive, serif', fontSize: '1.25rem', color: '#0f172a', marginBottom: '4px' }}>
              Prof. Krrish Sharma
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', borderTop: '1px solid #94a3b8', paddingTop: '3px' }}>
              Faculty Proctor / Class Teacher
            </div>
          </div>

          <div style={{ textAlign: 'center', width: '180px' }}>
            <div style={{ fontFamily: 'Brush Script MT, cursive, serif', fontSize: '1.25rem', color: '#0f172a', marginBottom: '4px' }}>
              Dr. P. R. Deshmukh
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', borderTop: '1px solid #94a3b8', paddingTop: '3px' }}>
              Controller of Examinations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
