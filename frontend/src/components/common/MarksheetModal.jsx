import React from 'react';
import {
  X,
  Printer,
  Download,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  QrCode,
  ShieldCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { printOfficialMarksheet, downloadOfficialMarksheet } from '../../lib/exportFormatHelper';

export default function MarksheetModal({
  isOpen,
  onClose,
  student = {
    name: 'Krrish Sharma',
    rollNumber: 101,
    course: 'IT',
    semester: 'Semester 6',
    division: 'A',
    sgpa: '8.95',
    cgpa: '8.88',
    resultClassification: 'First Class with Distinction',
    totalCredits: 22,
    grades: [
      { code: 'IT-301', name: 'Core Java & OOP Frameworks', credits: 4, internal: 24, endterm: 70, total: 94, grade: 'O', gradePoint: 10 },
      { code: 'IT-302', name: 'Database Management Systems', credits: 4, internal: 22, endterm: 66, total: 88, grade: 'A+', gradePoint: 9 },
      { code: 'IT-303', name: 'Distributed Systems & Cloud', credits: 4, internal: 23, endterm: 68, total: 91, grade: 'O', gradePoint: 10 },
      { code: 'IT-304', name: 'Computer Networks & Security', credits: 4, internal: 20, endterm: 60, total: 80, grade: 'A', gradePoint: 8 },
      { code: 'IT-305', name: 'Capstone Project Phase 1', credits: 6, internal: 28, endterm: 65, total: 93, grade: 'O', gradePoint: 10 }
    ]
  }
}) {
  const toast = useToast();

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    printOfficialMarksheet(student);
    if (toast?.info) {
      toast.info('Marksheet Print View', `Prepared official A4 Grade Transcript for ${student.name}.`);
    }
  };

  const handleDownload = () => {
    downloadOfficialMarksheet(student);
    if (toast?.success) {
      toast.success('Marksheet Downloaded', `Official grade transcript saved for Roll #${student.rollNumber}.`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 135 }}>
      <div
        className="modal-content-card marksheet-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '860px',
          width: '94vw',
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
        {/* Top Actions Bar */}
        <div
          style={{
            padding: '16px 24px',
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
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Official Semester Grade Transcript (Marksheet)
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Issued by Controller of Examinations · {student.semester}
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
              <span>Print Transcript</span>
            </button>

            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={handleDownload}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              style={{ marginLeft: 6 }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Marksheet Sheet */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #0f172a',
              borderRadius: '16px',
              padding: '28px 32px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
              maxWidth: '780px',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            {/* Watermark simulation in background */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                opacity: 0.03,
                fontSize: '5rem',
                fontWeight: 900,
                transform: 'rotate(-25deg)',
                userSelect: 'none'
              }}
            >
              EDUTRACK AUTONOMOUS
            </div>

            {/* University Emblem & Letterhead */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                EDUTRACK INSTITUTE OF TECHNOLOGY
              </h2>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                AN AUTONOMOUS INSTITUTION AFFILIATED TO STATE TECHNOLOGICAL UNIVERSITY
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                Accredited 'A+' Grade by NAAC · Approved by AICTE, New Delhi
              </p>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '10px',
                  padding: '4px 16px',
                  background: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}
              >
                STATEMENT OF SEMESTER GRADES & CREDITS
              </div>
            </div>

            {/* Candidate Metadata Box */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 140px',
                gap: '16px',
                padding: '14px 18px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '0.8125rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Candidate Full Name</span>
                  <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{student.name}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Roll Number / Seat #</span>
                  <strong style={{ color: '#2563eb', fontFamily: 'monospace', fontSize: '0.95rem' }}>#{student.rollNumber}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Degree Program</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>Bachelor of Technology ({student.course})</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Academic Term</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{student.semester} (Division {student.division || 'A'})</span>
                </div>
              </div>

              {/* QR Verification Box */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: '1px solid #e2e8f0',
                  paddingLeft: '12px',
                  textAlign: 'center'
                }}
              >
                <QrCode size={64} color="#0f172a" />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#16a34a', marginTop: '4px' }}>
                  GENUINE RECORD
                </span>
              </div>
            </div>

            {/* Course Grade Table */}
            <div style={{ marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#ffffff', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px', border: '1px solid #0f172a' }}>Code</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #0f172a' }}>Course Title</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #0f172a', textAlign: 'center' }}>Credits</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #0f172a', textAlign: 'center' }}>Internal (30)</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #0f172a', textAlign: 'center' }}>End-Term (70)</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #0f172a', textAlign: 'center' }}>Total (100)</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #0f172a', textAlign: 'center' }}>Grade</th>
                    <th style={{ padding: '8px 10px', border: '1px solid #0f172a', textAlign: 'center' }}>GP</th>
                  </tr>
                </thead>
                <tbody>
                  {(student.grades || []).map((g, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '7px 10px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: 700 }}>
                        {g.code}
                      </td>
                      <td style={{ padding: '7px 10px', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                        {g.name}
                      </td>
                      <td style={{ padding: '7px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                        {g.credits}
                      </td>
                      <td style={{ padding: '7px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                        {g.internal}
                      </td>
                      <td style={{ padding: '7px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                        {g.endterm}
                      </td>
                      <td style={{ padding: '7px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>
                        {g.total}
                      </td>
                      <td style={{ padding: '7px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                        <strong style={{ color: g.grade === 'O' ? '#16a34a' : '#2563eb' }}>{g.grade}</strong>
                      </td>
                      <td style={{ padding: '7px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>
                        {g.gradePoint}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Performance Calculation Summary Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                padding: '14px 16px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                textAlign: 'center',
                marginBottom: '20px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Credits</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{student.totalCredits || 22} Cr</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Semester SGPA</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>{student.sgpa}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Cumulative CGPA</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>{student.cgpa}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Result Classification</span>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{student.resultClassification}</div>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                borderTop: '1px solid #cbd5e1',
                paddingTop: '20px',
                marginTop: '16px'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Date of Result Publication</span>
                <strong style={{ color: '#0f172a', fontSize: '0.8rem' }}>Oct 01, 2026</strong>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    padding: '3px 12px',
                    borderRadius: '4px',
                    border: '1.5px dashed #16a34a',
                    color: '#16a34a',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    marginBottom: '4px'
                  }}
                >
                  OFFICIAL INSTITUTIONAL SEAL
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                  Controller of Examinations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
