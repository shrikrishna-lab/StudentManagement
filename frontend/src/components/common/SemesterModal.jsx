import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Layers,
  FileText,
  BarChart2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ALL_SEMESTERS_DATA = [
  {
    id: 'Semester 6',
    name: 'Semester 6',
    term: 'Spring 2026',
    status: 'Active (Current)',
    isCurrent: true,
    sgpa: '8.95 (Projected)',
    credits: 22,
    attendance: '89.5%',
    courses: [
      { code: 'IT-301', name: 'Core Java & OOP Frameworks', credits: 4, faculty: 'Prof. Krrish Sharma', grade: 'A+' },
      { code: 'IT-302', name: 'Database Management Systems', credits: 4, faculty: 'Prof. Anjali Mehta', grade: 'A' },
      { code: 'IT-303', name: 'Distributed Systems & Cloud', credits: 4, faculty: 'Dr. Vivek Joshi', grade: 'A+' },
      { code: 'IT-304', name: 'Computer Networks & Security', credits: 4, faculty: 'Prof. Neha Gupta', grade: 'B+' },
      { code: 'IT-305', name: 'Capstone Project Phase 1', credits: 6, faculty: 'Department Board', grade: 'In Progress' }
    ]
  },
  {
    id: 'Semester 5',
    name: 'Semester 5',
    term: 'Fall 2025',
    status: 'Completed',
    isCurrent: false,
    sgpa: '8.82',
    credits: 24,
    attendance: '91.2%',
    courses: [
      { code: 'IT-251', name: 'Software Engineering & Agile', credits: 4, faculty: 'Prof. S. Rao', grade: 'A' },
      { code: 'IT-252', name: 'Web Technologies & REST APIs', credits: 4, faculty: 'Prof. Anjali Mehta', grade: 'A+' },
      { code: 'IT-253', name: 'Microprocessor Architecture', credits: 4, faculty: 'Dr. K. Patel', grade: 'A' },
      { code: 'IT-254', name: 'Formal Language & Automata', credits: 4, faculty: 'Dr. Vivek Joshi', grade: 'B+' },
      { code: 'IT-255', name: 'Web Tech Laboratory', credits: 4, faculty: 'Prof. Neha Gupta', grade: 'O (Outstanding)' },
      { code: 'IT-256', name: 'Mini-Project Evaluation', credits: 4, faculty: 'Department Board', grade: 'A+' }
    ]
  },
  {
    id: 'Semester 4',
    name: 'Semester 4',
    term: 'Spring 2025',
    status: 'Completed',
    isCurrent: false,
    sgpa: '8.65',
    credits: 22,
    attendance: '88.4%',
    courses: [
      { code: 'IT-201', name: 'Operating Systems & Linux Kernel', credits: 4, faculty: 'Prof. Krrish Sharma', grade: 'A' },
      { code: 'IT-202', name: 'Relational Database Concepts', credits: 4, faculty: 'Prof. Anjali Mehta', grade: 'A' },
      { code: 'IT-203', name: 'Computer Networks Fundamentals', credits: 4, faculty: 'Prof. Neha Gupta', grade: 'B+' },
      { code: 'IT-204', name: 'Design & Analysis of Algorithms', credits: 4, faculty: 'Dr. Vivek Joshi', grade: 'A+' },
      { code: 'IT-205', name: 'OS & Algorithms Lab', credits: 6, faculty: 'Prof. Krrish Sharma', grade: 'A+' }
    ]
  },
  {
    id: 'Semester 3',
    name: 'Semester 3',
    term: 'Fall 2024',
    status: 'Completed',
    isCurrent: false,
    sgpa: '8.90',
    credits: 24,
    attendance: '93.0%',
    courses: [
      { code: 'IT-151', name: 'Data Structures with C++', credits: 4, faculty: 'Dr. Vivek Joshi', grade: 'O' },
      { code: 'IT-152', name: 'Object-Oriented Programming', credits: 4, faculty: 'Prof. Krrish Sharma', grade: 'A+' },
      { code: 'IT-153', name: 'Digital Logic & Computer Org', credits: 4, faculty: 'Prof. S. Rao', grade: 'A' },
      { code: 'IT-154', name: 'Discrete Mathematical Structures', credits: 4, faculty: 'Dr. R. Sharma', grade: 'A+' },
      { code: 'IT-155', name: 'Data Structures Lab', credits: 4, faculty: 'Dr. Vivek Joshi', grade: 'O' },
      { code: 'IT-156', name: 'C++ Lab Practice', credits: 4, faculty: 'Prof. Krrish Sharma', grade: 'A+' }
    ]
  },
  {
    id: 'Semester 2',
    name: 'Semester 2',
    term: 'Spring 2024',
    status: 'Completed',
    isCurrent: false,
    sgpa: '9.10',
    credits: 20,
    attendance: '94.5%',
    courses: [
      { code: 'BS-102', name: 'Engineering Mathematics II', credits: 4, faculty: 'Dr. R. Sharma', grade: 'O' },
      { code: 'BS-104', name: 'Engineering Chemistry', credits: 4, faculty: 'Dr. M. Roy', grade: 'A+' },
      { code: 'CS-102', name: 'Programming in Python', credits: 4, faculty: 'Prof. Anjali Mehta', grade: 'O' },
      { code: 'ES-102', name: 'Basic Electronics Engineering', credits: 4, faculty: 'Prof. K. Patel', grade: 'A+' },
      { code: 'ES-104', name: 'Workshop Practices II', credits: 4, faculty: 'Faculty Workshop', grade: 'A' }
    ]
  },
  {
    id: 'Semester 1',
    name: 'Semester 1',
    term: 'Fall 2023',
    status: 'Completed',
    isCurrent: false,
    sgpa: '8.75',
    credits: 20,
    attendance: '92.0%',
    courses: [
      { code: 'BS-101', name: 'Engineering Mathematics I', credits: 4, faculty: 'Dr. R. Sharma', grade: 'A+' },
      { code: 'BS-103', name: 'Applied Engineering Physics', credits: 4, faculty: 'Dr. P. Sen', grade: 'A' },
      { code: 'CS-101', name: 'Problem Solving via C Language', credits: 4, faculty: 'Prof. Krrish Sharma', grade: 'A+' },
      { code: 'ES-101', name: 'Basic Electrical Engineering', credits: 4, faculty: 'Prof. S. Rao', grade: 'B+' },
      { code: 'ES-103', name: 'Engineering Graphics & CAD', credits: 4, faculty: 'Faculty Workshop', grade: 'A' }
    ]
  },
  {
    id: 'Semester 7',
    name: 'Semester 7',
    term: 'Fall 2026',
    status: 'Upcoming',
    isCurrent: false,
    sgpa: '—',
    credits: 24,
    attendance: '—',
    courses: [
      { code: 'IT-401', name: 'Artificial Intelligence & Machine Learning', credits: 4, faculty: 'Department Board', grade: 'Elective Selection Open' },
      { code: 'IT-402', name: 'DevOps & Continuous Deployment', credits: 4, faculty: 'Department Board', grade: 'Registration Pending' },
      { code: 'IT-403', name: 'Big Data Analytics & Spark', credits: 4, faculty: 'Department Board', grade: 'Registration Pending' },
      { code: 'IT-404', name: 'Capstone Project Phase 2', credits: 8, faculty: 'Guide Assigned', grade: 'Pending' }
    ]
  },
  {
    id: 'Semester 8',
    name: 'Semester 8',
    term: 'Spring 2027',
    status: 'Upcoming',
    isCurrent: false,
    sgpa: '—',
    credits: 20,
    attendance: '—',
    courses: [
      { code: 'IT-451', name: 'Full-Time Industry Internship', credits: 14, faculty: 'Industry Mentor', grade: 'Placement Dependent' },
      { code: 'IT-452', name: 'Comprehensive Academic Viva', credits: 6, faculty: 'University Board', grade: 'Pending' }
    ]
  }
];

export default function SemesterModal({
  isOpen,
  onClose,
  currentSemester = 'Semester 6',
  onSelectSemester
}) {
  const toast = useToast();
  const [selectedSemId, setSelectedSemId] = useState(currentSemester);

  if (!isOpen) return null;

  const activeSemData = ALL_SEMESTERS_DATA.find((s) => s.id === selectedSemId) || ALL_SEMESTERS_DATA[0];

  const handleApplySemester = (sem) => {
    setSelectedSemId(sem.id);
    if (onSelectSemester) {
      onSelectSemester(sem.id);
    }
    if (toast) {
      toast.success(
        'Active Semester Updated',
        `Switched portal context to ${sem.name} (${sem.term}).`
      );
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 120 }}>
      <div
        className="modal-content-card semester-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1120px',
          width: '95vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.35)'
        }}
      >
        {/* Modal Top Bar */}
        <div className="modal-header-bar" style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb'
              }}
            >
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                Academic Semesters & Progress Tracker
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Bachelor of Technology (IT) · 8-Semester Curriculum Records
              </span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Main Content: Split Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', flex: 1, overflow: 'hidden' }}>
          {/* Left: Semester List */}
          <div
            style={{
              borderRight: '1px solid #f1f5f9',
              background: '#f8fafc',
              overflowY: 'auto',
              padding: '12px'
            }}
          >
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', padding: '6px 8px 10px', letterSpacing: '0.06em' }}>
              Select Academic Semester
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {ALL_SEMESTERS_DATA.map((sem) => {
                const isSelected = sem.id === selectedSemId;
                const isCurrentActive = sem.id === currentSemester;

                return (
                  <button
                    key={sem.id}
                    type="button"
                    onClick={() => handleApplySemester(sem)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: isSelected ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid transparent',
                      background: isSelected ? '#ffffff' : 'transparent',
                      boxShadow: isSelected ? '0 2px 6px rgba(15, 23, 42, 0.05)' : 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 600, color: isSelected ? '#2563eb' : '#0f172a' }}>
                          {sem.name}
                        </span>
                        {isCurrentActive && (
                          <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: 9999, background: '#dcfce7', color: '#16a34a', fontWeight: 700 }}>
                            Current
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: 2 }}>
                        {sem.term} · {sem.status}
                      </span>
                    </div>

                    <ChevronRight size={14} color={isSelected ? '#2563eb' : '#cbd5e1'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Semester View */}
          <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                    {activeSemData.name} Overview
                  </h4>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: activeSemData.status.includes('Active') ? '#dbeafe' : activeSemData.status === 'Completed' ? '#dcfce7' : '#f1f5f9',
                      color: activeSemData.status.includes('Active') ? '#1d4ed8' : activeSemData.status === 'Completed' ? '#15803d' : '#64748b'
                    }}
                  >
                    {activeSemData.status}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Session Term: {activeSemData.term}
                </span>
              </div>

              {activeSemData.id !== currentSemester && (
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={() => handleApplySemester(activeSemData)}
                >
                  Set as Active View
                </button>
              )}
            </div>

            {/* Quick Stat Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Semester SGPA</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{activeSemData.sgpa}</span>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Total Credits</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb' }}>{activeSemData.credits} Credits</span>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Recorded Attendance</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>{activeSemData.attendance}</span>
              </div>
            </div>

            {/* Course Table */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  Enrolled Subjects & Modules ({activeSemData.courses.length})
                </h5>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                  Showing Theory Classes & Practical Labs
                </span>
              </div>
              <div style={{ borderRadius: 14, border: '1px solid #e2e8f0', overflowX: 'auto', background: '#ffffff', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
                <table className="clean-table" style={{ margin: 0, minWidth: '660px', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '90px' }}>Code</th>
                      <th>Subject / Module & Lab Type</th>
                      <th>Faculty</th>
                      <th style={{ width: '100px' }}>Credits</th>
                      <th style={{ textAlign: 'right', width: '130px' }}>Grade / Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSemData.courses.map((c) => (
                      <tr key={c.code}>
                        <td><code style={{ fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '3px 7px', borderRadius: 6 }}>{c.code}</code></td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }}>
                              📚 Theory
                            </span>
                            {c.credits >= 4 && (
                              <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: '#ecfdf5', color: '#059669', fontWeight: 700 }}>
                                🔬 Practical Lab
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ color: '#475569', fontWeight: 500 }}>{c.faculty}</td>
                        <td><strong style={{ color: '#0f172a' }}>{c.credits} Cr</strong></td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`badge ${c.grade.startsWith('O') || c.grade.startsWith('A') ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.8rem', padding: '3px 9px' }}>
                            {c.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-actions-footer" style={{ padding: '12px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Viewing academic record verified by Registrar & Controller of Examinations.
          </span>
          <button type="button" className="btn-secondary btn-sm" onClick={onClose}>
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
