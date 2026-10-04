import React, { useMemo } from 'react';
import {
  X,
  Printer,
  Download,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  QrCode,
  Award,
  Clock,
  MapPin,
  Check,
  FileText,
  AlertCircle
} from 'lucide-react';
import { loadExamSchedule, INITIAL_EXAM_SCHEDULE } from '../../lib/timetableData';
import { useToast } from '../../context/ToastContext';
import { printOfficialHallTicket, downloadOfficialHallTicket } from '../../lib/exportFormatHelper';

/**
 * Standard Comprehensive Semester 6 Examination Papers (Combined All Subjects)
 * Combines all core Theory papers, Laboratory Practical/Viva sessions, and Project Defense.
 */
const DEFAULT_COMBINED_PAPERS = [
  {
    paperCode: 'IT-301',
    subjectName: 'Core Java & Object-Oriented Frameworks',
    category: 'Theory Written',
    duration: '3 Hours',
    marks: 100,
    credits: 4.0,
    date: 'Nov 10, 2026',
    day: 'Tuesday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    room: 'Exam Hall A-101',
    seatNo: 'Desk #14 (Block A)',
    invigilator: 'Prof. Krrish Sharma'
  },
  {
    paperCode: 'IT-302',
    subjectName: 'Database Management Systems & Transactions',
    category: 'Theory Written',
    duration: '3 Hours',
    marks: 100,
    credits: 4.0,
    date: 'Nov 13, 2026',
    day: 'Friday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    room: 'Exam Hall A-102',
    seatNo: 'Desk #14 (Block A)',
    invigilator: 'Prof. Anjali Mehta'
  },
  {
    paperCode: 'IT-303',
    subjectName: 'Distributed Systems & Cloud Computing',
    category: 'Theory Written',
    duration: '3 Hours',
    marks: 100,
    credits: 4.0,
    date: 'Nov 17, 2026',
    day: 'Tuesday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    room: 'Exam Hall B-201',
    seatNo: 'Desk #14 (Block B)',
    invigilator: 'Dr. Vivek Joshi'
  },
  {
    paperCode: 'IT-304',
    subjectName: 'Computer Networks & Network Security',
    category: 'Theory Written',
    duration: '3 Hours',
    marks: 100,
    credits: 4.0,
    date: 'Nov 20, 2026',
    day: 'Friday',
    time: '10:00 AM - 01:00 PM',
    shift: 'Morning Shift',
    room: 'Exam Hall B-202',
    seatNo: 'Desk #14 (Block B)',
    invigilator: 'Prof. Neha Gupta'
  },
  {
    paperCode: 'IT-301L',
    subjectName: 'Core Java Programming Laboratory Viva',
    category: 'Practical Lab & Viva',
    duration: '4 Hours',
    marks: 50,
    credits: 1.0,
    date: 'Nov 24, 2026',
    day: 'Tuesday',
    time: '09:00 AM - 01:00 PM',
    shift: 'Practical Batch 1',
    room: 'Computing Lab A-1',
    seatNo: 'Terminal #08 (Lab A-1)',
    invigilator: 'Prof. Krrish Sharma & Ext. Board'
  },
  {
    paperCode: 'IT-302L',
    subjectName: 'DBMS & SQL Performance Laboratory Viva',
    category: 'Practical Lab & Viva',
    duration: '4 Hours',
    marks: 50,
    credits: 1.0,
    date: 'Nov 26, 2026',
    day: 'Thursday',
    time: '01:30 PM - 05:30 PM',
    shift: 'Practical Batch 2',
    room: 'Computing Lab A-2',
    seatNo: 'Terminal #08 (Lab A-2)',
    invigilator: 'Prof. Anjali Mehta & Ext. Board'
  },
  {
    paperCode: 'IT-305',
    subjectName: 'Capstone Project Phase 1 Board Defense',
    category: 'Project Defense',
    duration: 'Full Day',
    marks: 100,
    credits: 3.0,
    date: 'Dec 01, 2026',
    day: 'Tuesday',
    time: '09:30 AM - 04:30 PM',
    shift: 'Board Review Session',
    room: 'Seminar Hall 1',
    seatNo: 'Project Board Panel 2',
    invigilator: 'Department Examination Board'
  }
];

export default function HallTicketModal({
  isOpen = true,
  onClose,
  examSchedule,
  studentInfo,
  student
}) {
  const toast = useToast();

  if (isOpen === false) return null;

  // Resolve Student Information from either student or studentInfo prop
  const resolvedStudent = useMemo(() => {
    const s = student || studentInfo || {};
    const roll = s.rollNumber || '101';
    const rawCourse = s.course || s.program || 'IT';
    const fullProgram = rawCourse.toLowerCase().includes('b.tech')
      ? rawCourse
      : `B.Tech in ${rawCourse === 'IT' ? 'Information Technology' : rawCourse === 'CS' ? 'Computer Science' : rawCourse}`;

    return {
      name: s.name || 'Krrish Sharma',
      rollNumber: roll,
      seatNumber: `2024-IT-${String(roll).padStart(3, '0')}`,
      prn: s.prn || `PRN-2024098${String(roll).padStart(3, '0')}`,
      program: fullProgram,
      semester: s.semester || 'Semester 6',
      division: s.division ? `Div ${s.division}` : 'Div A',
      academicYear: '2026–2027',
      center: s.center || 'Campus Center #04 (Examination Block A & B)',
      attendancePercentage: s.percentage || s.attendance || 89.5,
      feeStatus: s.feeStatus || 'paid',
      accountsRef: `AC-992${roll}`,
      avatarUrl: s.avatarUrl || (s.gender === 'Female' ? '/assets/female_student_avatar.jpg' : '/assets/student_avatar.jpg')
    };
  }, [student, studentInfo]);

  // Resolve combined examination schedule
  const allPapers = useMemo(() => {
    if (examSchedule && Array.isArray(examSchedule) && examSchedule.length > 0) {
      return examSchedule.map((p, idx) => ({
        paperCode: p.paperCode || `IT-30${idx + 1}`,
        subjectName: p.subjectName || p.name || 'Academic Subject',
        category: p.examType || (p.paperCode && p.paperCode.endsWith('L') ? 'Practical Lab & Viva' : 'Theory Written'),
        duration: p.duration || (p.paperCode && p.paperCode.endsWith('L') ? '4 Hours' : '3 Hours'),
        marks: p.marks || 100,
        credits: p.credits || (p.paperCode && p.paperCode.endsWith('L') ? 1.0 : 4.0),
        date: p.date || 'Nov 15, 2026',
        day: p.day || 'Monday',
        time: p.time || '10:00 AM - 01:00 PM',
        shift: p.shift || 'Morning Shift',
        room: p.room || 'Exam Hall A-101',
        seatNo: p.seatingBlock || `Desk #${String(idx * 7 + 14)} (Block A)`,
        invigilator: p.invigilator || 'Faculty Invigilator'
      }));
    }

    try {
      const stored = loadExamSchedule();
      if (stored && stored.length > 0) {
        return stored.map((p, idx) => ({
          paperCode: p.paperCode,
          subjectName: p.subjectName,
          category: p.examType || (p.paperCode.endsWith('L') ? 'Practical Lab & Viva' : 'Theory Written'),
          duration: p.duration || '3 Hours',
          marks: p.marks || 100,
          credits: p.paperCode.endsWith('L') ? 1.0 : 4.0,
          date: p.date,
          day: p.day,
          time: p.time,
          shift: p.shift || 'Morning Shift',
          room: p.room,
          seatNo: p.seatingBlock,
          invigilator: p.invigilator
        }));
      }
    } catch (e) {
      // Fallback to default comprehensive list
    }

    return DEFAULT_COMBINED_PAPERS;
  }, [examSchedule]);

  const totalCredits = allPapers.reduce((sum, p) => sum + (Number(p.credits) || 0), 0);
  const theoryCount = allPapers.filter((p) => p.category.toLowerCase().includes('theory')).length;
  const labCount = allPapers.filter((p) => p.category.toLowerCase().includes('practical') || p.category.toLowerCase().includes('lab')).length;
  const projectCount = allPapers.filter((p) => p.category.toLowerCase().includes('project') || p.category.toLowerCase().includes('defense')).length;

  const handlePrint = () => {
    printOfficialHallTicket(resolvedStudent, allPapers);
    if (toast?.info) {
      toast.info('Combined Admit Card Print View', `Preparing official A4 Admit Card for all ${allPapers.length} combined subjects.`);
    }
  };

  const handleDownload = () => {
    downloadOfficialHallTicket(resolvedStudent, allPapers);
    if (toast?.success) {
      toast.success(
        'Official Admit Card Downloaded',
        `Downloaded verified format with all ${allPapers.length} combined subjects.`
      );
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 135 }}>
      <div
        className="modal-content-card hall-ticket-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '920px',
          width: '95vw',
          maxHeight: '92vh',
          background: '#ffffff',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)'
        }}
      >
        {/* Top Modal Control Bar */}
        <div
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb'
              }}
            >
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  Official Examination Admit Card
                </h3>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: '#dcfce7',
                    color: '#15803d'
                  }}
                >
                  All {allPapers.length} Subjects Combined
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Winter 2026 End-Semester Examination · Verified Autonomous Hall Ticket
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handlePrint}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={handleDownload}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Download Admit Card</span>
            </button>

            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              style={{ marginLeft: 4 }}
              aria-label="Close Hall Ticket Modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Admit Card Sheet */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #0f172a',
              borderRadius: '14px',
              padding: '24px 28px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
              maxWidth: '840px',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            {/* Watermark Emblem in Background */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.03,
                pointerEvents: 'none',
                zIndex: 0
              }}
            >
              <GraduationCap size={400} />
            </div>

            {/* University Institutional Header */}
            <div
              style={{
                textAlign: 'center',
                borderBottom: '2px solid #0f172a',
                paddingBottom: '14px',
                marginBottom: '16px',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: 4 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                >
                  <GraduationCap size={20} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  EDUTRACK INSTITUTE OF TECHNOLOGY
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', fontWeight: 600, letterSpacing: '0.04em' }}>
                AN AUTONOMOUS INSTITUTION AFFILIATED TO STATE UNIVERSITY · ACCREDITED NAAC GRADE A++
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                OFFICE OF THE CONTROLLER OF EXAMINATIONS · ACADEMIC SESSION 2026–2027
              </p>

              <div
                style={{
                  display: 'inline-block',
                  marginTop: '10px',
                  padding: '4px 16px',
                  background: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em'
                }}
              >
                END-SEMESTER EXAMINATION HALL TICKET (ADMIT CARD) · WINTER 2026
              </div>
            </div>

            {/* Candidate Credentials & Barcode Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 160px',
                gap: '16px',
                padding: '14px 18px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                marginBottom: '16px',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 18px', fontSize: '0.8125rem' }}>
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
                    {resolvedStudent.rollNumber} · <span style={{ color: '#0f172a' }}>{resolvedStudent.seatNumber}</span>
                  </strong>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                    Program & Department
                  </span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{resolvedStudent.program}</span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                    Semester & Division
                  </span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>
                    {resolvedStudent.semester} ({resolvedStudent.division})
                  </span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                    PRN / Permanent Registration No
                  </span>
                  <span style={{ color: '#334155', fontFamily: 'monospace', fontWeight: 600 }}>
                    {resolvedStudent.prn}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                    Clearance Verification
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle2 size={13} /> {Number(resolvedStudent.attendancePercentage).toFixed(1)}% Attendance (Cleared)
                    </span>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                    Allotted Examination Center & Block
                  </span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>
                    {resolvedStudent.center} · Desk Block A (01–60)
                  </span>
                </div>
              </div>

              {/* Photo Box + Barcode Strip */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: '1px solid #cbd5e1',
                  paddingLeft: '14px',
                  textAlign: 'center'
                }}
              >
                {/* Candidate Photo Box */}
                <div
                  style={{
                    width: 76,
                    height: 84,
                    background: '#e2e8f0',
                    border: '1.5px solid #94a3b8',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '6px',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={resolvedStudent.avatarUrl || '/assets/student_avatar.jpg'}
                    alt="Candidate"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569' }}>
                    PHOTO VERIFIED
                  </span>
                </div>

                {/* Anti-Counterfeit Barcode */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      letterSpacing: '2px',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      color: '#0f172a'
                    }}
                  >
                    ||| | |||| | ||| || |||
                  </div>
                  <span style={{ fontSize: '0.6rem', color: '#64748b', fontFamily: 'monospace' }}>
                    {resolvedStudent.seatNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Registered Examination Papers Summary Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '8px 14px',
                background: '#0f172a',
                color: '#ffffff',
                borderRadius: '8px',
                marginBottom: '12px',
                fontSize: '0.78rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={15} style={{ color: '#60a5fa' }} />
                <span style={{ fontWeight: 700 }}>
                  Combined Examination Roster ({allPapers.length} Registered Papers)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1' }}>
                <span>Theory: <strong style={{ color: '#ffffff' }}>{theoryCount}</strong></span>
                <span>•</span>
                <span>Labs/Viva: <strong style={{ color: '#ffffff' }}>{labCount}</strong></span>
                <span>•</span>
                <span>Project: <strong style={{ color: '#ffffff' }}>{projectCount}</strong></span>
                <span>•</span>
                <span>Total Credits: <strong style={{ color: '#93c5fd' }}>{totalCredits.toFixed(1)}</strong></span>
              </div>
            </div>

            {/* COMBINED ALL SUBJECTS SCHEDULE TABLE */}
            <div style={{ marginBottom: '16px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#0f172a', textAlign: 'left', borderBottom: '2px solid #0f172a' }}>
                    <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Code</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Course Title</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Category & Shift</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Date & Day</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Time Slot</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Venue & Seat</th>
                    <th style={{ padding: '8px 8px', border: '1px solid #cbd5e1', textAlign: 'center', width: '70px' }}>Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {allPapers.map((paper, idx) => {
                    const isLab = paper.category.toLowerCase().includes('lab') || paper.category.toLowerCase().includes('practical');
                    const isProject = paper.category.toLowerCase().includes('project');

                    return (
                      <tr
                        key={idx}
                        style={{
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom: '1px solid #e2e8f0'
                        }}
                      >
                        {/* Paper Code */}
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>
                          <span
                            style={{
                              display: 'inline-block',
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

                        {/* Subject Title */}
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#0f172a' }}>
                          <div>{paper.subjectName}</div>
                          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                            {paper.credits} Credits · Max {paper.marks} Marks
                          </span>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontWeight: 600, color: '#334155' }}>{paper.category}</div>
                          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>{paper.duration}</span>
                        </td>

                        {/* Date & Day */}
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                          <strong style={{ color: '#0f172a' }}>{paper.date}</strong>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>{paper.day}</span>
                        </td>

                        {/* Time Slot */}
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{paper.time}</span>
                          <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748b' }}>{paper.shift}</span>
                        </td>

                        {/* Venue & Seat */}
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{paper.room}</div>
                          <span style={{ fontSize: '0.6875rem', color: '#2563eb', fontWeight: 600 }}>{paper.seatNo}</span>
                        </td>

                        {/* Invigilator Sign */}
                        <td style={{ padding: '8px 8px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#cbd5e1' }}>
                          ________
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Candidate Rules & Instructions Strip */}
            <div
              style={{
                fontSize: '0.7rem',
                color: '#475569',
                lineHeight: 1.5,
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px'
              }}
            >
              <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <AlertCircle size={13} color="#2563eb" />
                MANDATORY EXAMINATION REGULATIONS (ORDINANCE 14-B):
              </strong>
              1. <strong>Reporting:</strong> Candidates must occupy their allotted seats 20 minutes prior to paper commencement. Entry is barred after 15 minutes of scheduled time.
              <br />
              2. <strong>Identity:</strong> Produce this Hall Ticket alongside your Institutional RFID Smartcard at the entrance security checkpoint.
              <br />
              3. <strong>Prohibited Items:</strong> Mobile phones, smartwatches, programmable calculators, wireless earphones, and loose papers are strictly forbidden on the exam floor.
            </div>

            {/* Official Institutional Signature & Seal Block */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px',
                paddingTop: '12px',
                borderTop: '2px solid #0f172a',
                textAlign: 'center',
                alignItems: 'flex-end',
                fontSize: '0.75rem'
              }}
            >
              {/* Candidate Signature */}
              <div>
                <div style={{ height: '36px', borderBottom: '1px dashed #94a3b8', margin: '0 auto 6px auto', width: '80%' }} />
                <span style={{ fontWeight: 600, color: '#334155' }}>Candidate Signature</span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b' }}>
                  (To be signed in presence of Invigilator)
                </span>
              </div>

              {/* Institutional QR & Digital Ledger Seal */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px'
                  }}
                >
                  <QrCode size={38} color="#0f172a" />
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#16a34a' }}>
                  AUTONOMOUS VERIFIED
                </span>
                <span style={{ fontSize: '0.6rem', color: '#64748b' }}>
                  Ledger Hash: #{resolvedStudent.accountsRef}
                </span>
              </div>

              {/* Controller of Examinations */}
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    fontFamily: 'serif',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#1e3a8a',
                    marginBottom: '2px'
                  }}
                >
                  Dr. K. R. Raman
                </div>
                <div style={{ height: '1px', background: '#94a3b8', margin: '0 auto 6px auto', width: '80%' }} />
                <strong style={{ color: '#0f172a', display: 'block' }}>Controller of Examinations</strong>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  EduTrack Autonomous Board
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
