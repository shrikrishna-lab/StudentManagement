import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Save,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Sparkles,
  BookOpen,
  ArrowRight,
  Check,
  FileCode,
  Archive,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import {
  getAssignmentMarksStore,
  saveAssignmentMarksStore,
  calculateAssignmentGrade,
  exportAssignmentMarksCSV
} from '../../lib/assignmentMarksData';

export default function TeacherAssignmentGrading({
  assignments = [],
  selectedAssignmentId,
  onSelectAssignment,
  students = [],
  currentFaculty
}) {
  const { toast } = useToast();
  const tableScrollRef = useRef(null);

  // Active assignment
  const activeAssignment = useMemo(() => {
    if (!assignments || assignments.length === 0) {
      return {
        id: 1,
        title: 'JDBC Student Management Project',
        subject: 'Core Java (IT-301)',
        deadline: '2026-10-08',
        totalMarks: 20,
        submissionsCount: 8,
        totalStudents: 10,
        status: 'Active'
      };
    }
    return assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];
  }, [assignments, selectedAssignmentId]);

  // Assignment submissions store
  const [store, setStore] = useState(getAssignmentMarksStore);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [divisionFilter, setDivisionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Deliverable view modal
  const [previewSubmission, setPreviewSubmission] = useState(null);

  const facultyDeptCode = useMemo(() => {
    const dept = (currentFaculty?.department || 'Information Technology').toLowerCase();
    if (dept.includes('computer')) return 'CS';
    if (dept.includes('electronic') || dept.includes('telecom')) return 'EXTC';
    if (dept.includes('mech')) return 'MECH';
    return 'IT';
  }, [currentFaculty?.department]);

  // Fallback student roster strictly scoped to faculty department
  const defaultStudents = useMemo(() => [
    { rollNumber: 101, name: 'Krrish Sharma', course: facultyDeptCode, division: 'A', prn: `RBT24${facultyDeptCode}001` },
    { rollNumber: 102, name: 'Rohan Patel', course: facultyDeptCode, division: 'A', prn: `RBT24${facultyDeptCode}002` },
    { rollNumber: 103, name: 'Pooja Nair', course: facultyDeptCode, division: 'A', prn: `RBT24${facultyDeptCode}003` },
    { rollNumber: 104, name: 'Meera Iyer', course: facultyDeptCode, division: 'A', prn: `RBT24${facultyDeptCode}004` }
  ], [facultyDeptCode]);

  const rosterStudents = useMemo(() => {
    const raw = students.length > 0 ? students : defaultStudents;
    return raw.filter((s) => {
      const c = (s.course || '').toUpperCase();
      return c === facultyDeptCode || c.includes(facultyDeptCode);
    });
  }, [students, defaultStudents, facultyDeptCode]);

  // Active assignment submissions map
  const activeSubmissions = store[activeAssignment.id] || {};

  // Compute student rows
  const studentRows = useMemo(() => {
    return rosterStudents.map((s) => {
      const sub = activeSubmissions[s.rollNumber] || {
        submitted: false,
        submissionDate: null,
        fileName: null,
        fileSize: null,
        marks: 0,
        remarks: 'Not submitted yet.',
        status: 'Not Submitted'
      };
      return {
        ...s,
        ...sub
      };
    });
  }, [rosterStudents, activeSubmissions]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return studentRows
      .filter((s) => {
        if (divisionFilter === 'All') return true;
        return s.division === divisionFilter;
      })
      .filter((s) => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'submitted') return s.submitted;
        if (statusFilter === 'graded') return s.status === 'Graded';
        if (statusFilter === 'pending') return s.submitted && s.status !== 'Graded';
        if (statusFilter === 'not_submitted') return !s.submitted;
        return true;
      })
      .filter((s) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          String(s.rollNumber).includes(q) ||
          (s.prn && s.prn.toLowerCase().includes(q))
        );
      });
  }, [studentRows, divisionFilter, statusFilter, searchQuery]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = studentRows.length;
    const submittedCount = studentRows.filter((s) => s.submitted).length;
    const gradedCount = studentRows.filter((s) => s.status === 'Graded').length;
    const marksList = studentRows.filter((s) => s.submitted).map((s) => s.marks);
    const avgMarks =
      marksList.length > 0 ? (marksList.reduce((a, b) => a + b, 0) / marksList.length).toFixed(1) : '0';
    const passThreshold = Math.ceil(activeAssignment.totalMarks * 0.4);
    const passCount = marksList.filter((m) => m >= passThreshold).length;
    const passRate = marksList.length > 0 ? Math.round((passCount / marksList.length) * 100) : 0;

    return {
      total,
      submittedCount,
      gradedCount,
      avgMarks,
      passRate
    };
  }, [studentRows, activeAssignment.totalMarks]);

  // Handle Mark Change
  const handleMarkChange = (rollNumber, val) => {
    const num = val === '' ? 0 : Math.max(0, Math.min(activeAssignment.totalMarks, Number(val) || 0));
    setStore((prev) => {
      const assignmentMap = { ...(prev[activeAssignment.id] || {}) };
      const current = assignmentMap[rollNumber] || {};
      assignmentMap[rollNumber] = {
        ...current,
        marks: num,
        status: 'Graded'
      };
      const updated = {
        ...prev,
        [activeAssignment.id]: assignmentMap
      };
      saveAssignmentMarksStore(updated);
      return updated;
    });
  };

  // Handle Remark Change
  const handleRemarkChange = (rollNumber, text) => {
    setStore((prev) => {
      const assignmentMap = { ...(prev[activeAssignment.id] || {}) };
      const current = assignmentMap[rollNumber] || {};
      assignmentMap[rollNumber] = {
        ...current,
        remarks: text
      };
      const updated = {
        ...prev,
        [activeAssignment.id]: assignmentMap
      };
      saveAssignmentMarksStore(updated);
      return updated;
    });
  };

  // Quick fill actions
  const handleSetPassingBenchmark = () => {
    const passingScore = Math.ceil(activeAssignment.totalMarks * 0.4);
    setStore((prev) => {
      const assignmentMap = { ...(prev[activeAssignment.id] || {}) };
      studentRows.forEach((s) => {
        if (s.submitted) {
          const current = assignmentMap[s.rollNumber] || {};
          assignmentMap[s.rollNumber] = {
            ...current,
            marks: passingScore,
            status: 'Graded',
            remarks: current.remarks || 'Standard pass benchmark awarded.'
          };
        }
      });
      const updated = { ...prev, [activeAssignment.id]: assignmentMap };
      saveAssignmentMarksStore(updated);
      return updated;
    });
    toast.success('Pass Benchmark Assigned', `Set ${passingScore} pts (40%) for all submitted students.`);
  };

  const handleSetFullMarks = () => {
    setStore((prev) => {
      const assignmentMap = { ...(prev[activeAssignment.id] || {}) };
      studentRows.forEach((s) => {
        if (s.submitted) {
          const current = assignmentMap[s.rollNumber] || {};
          assignmentMap[s.rollNumber] = {
            ...current,
            marks: activeAssignment.totalMarks,
            status: 'Graded',
            remarks: current.remarks || 'Full score awarded for complete submission.'
          };
        }
      });
      const updated = { ...prev, [activeAssignment.id]: assignmentMap };
      saveAssignmentMarksStore(updated);
      return updated;
    });
    toast.success('Full Marks Assigned', `Set ${activeAssignment.totalMarks} pts for all submitted students.`);
  };

  const handleSaveMarks = () => {
    saveAssignmentMarksStore(store);
    toast.success(
      'Assignment Marks Published',
      `Grading recorded and synchronized for "${activeAssignment.title}".`
    );
  };

  // Horizontal scroll helpers
  const handleScroll = (offset) => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {/* Section Header Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 16
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Assignment Grading
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '3px 0 0 0' }}>
              {activeAssignment.title} · {activeAssignment.subject} (Max {activeAssignment.totalMarks} pts)
            </p>
          </div>

          {/* Assignment Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                background: '#f1f5f9',
                padding: '3px',
                borderRadius: '8px',
                gap: '2px'
              }}
            >
              {assignments.map((asm) => {
                const isActive = asm.id === activeAssignment.id;
                return (
                  <button
                    key={asm.id}
                    type="button"
                    onClick={() => onSelectAssignment && onSelectAssignment(asm.id)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? 600 : 500,
                      borderRadius: '6px',
                      border: 'none',
                      background: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? '#0f172a' : '#64748b',
                      boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {asm.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-grid" style={{ marginBottom: 0 }}>
          <div className="stat-card" style={{ padding: '14px 16px' }}>
            <span className="stat-label">Enrolled</span>
            <span className="stat-value" style={{ fontSize: '1.35rem' }}>{stats.total}</span>
          </div>

          <div className="stat-card" style={{ padding: '14px 16px' }}>
            <span className="stat-label">Submitted</span>
            <span className="stat-value" style={{ fontSize: '1.35rem', color: '#2563eb' }}>
              {stats.submittedCount}
            </span>
          </div>

          <div className="stat-card" style={{ padding: '14px 16px' }}>
            <span className="stat-label">Graded</span>
            <span className="stat-value" style={{ fontSize: '1.35rem', color: '#059669' }}>
              {stats.gradedCount}
            </span>
          </div>

          <div className="stat-card" style={{ padding: '14px 16px' }}>
            <span className="stat-label">Average</span>
            <span className="stat-value" style={{ fontSize: '1.35rem', color: '#0f172a' }}>
              {stats.avgMarks} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ {activeAssignment.totalMarks}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="table-container">
        {/* Toolbar & Filters */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          {/* Status Filter Tabs */}
          <div
            style={{
              display: 'inline-flex',
              background: '#f1f5f9',
              padding: '3px',
              borderRadius: '8px',
              gap: '2px'
            }}
          >
            {[
              { id: 'all', label: 'All', count: studentRows.length },
              { id: 'submitted', label: 'Submitted', count: stats.submittedCount },
              { id: 'graded', label: 'Graded', count: stats.gradedCount },
              { id: 'pending', label: 'Pending', count: stats.submittedCount - stats.gradedCount },
              { id: 'not_submitted', label: 'Not Submitted', count: stats.total - stats.submittedCount }
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.76rem',
                    fontWeight: isActive ? 600 : 500,
                    borderRadius: '6px',
                    border: 'none',
                    background: isActive ? '#ffffff' : 'transparent',
                    color: isActive ? '#0f172a' : '#64748b',
                    boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: isActive ? '#f1f5f9' : '#e2e8f0',
                      color: isActive ? '#0f172a' : '#64748b'
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Division */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                type="text"
                placeholder="Search candidate or PRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: 32,
                  paddingLeft: 30,
                  paddingRight: 10,
                  fontSize: '0.78rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  width: '210px'
                }}
              />
            </div>

            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              style={{
                height: 32,
                fontSize: '0.78rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '0 8px',
                background: '#ffffff',
                color: '#334155'
              }}
            >
              <option value="All">All Divisions</option>
              <option value="A">Division A</option>
              <option value="B">Division B</option>
              <option value="C">Division C</option>
            </select>
          </div>
        </div>

        {/* Quick Fill & Bulk Bar */}
        <div
          style={{
            padding: '10px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Quick Fill:</span>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handleSetPassingBenchmark}
              style={{ fontSize: '0.74rem', padding: '4px 9px' }}
            >
              Pass Benchmark (40%)
            </button>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handleSetFullMarks}
              style={{ fontSize: '0.74rem', padding: '4px 9px' }}
            >
              Full Marks (100%)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Horizontal Scroll Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}>
              <button
                type="button"
                onClick={() => handleScroll(-250)}
                style={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  color: '#475569'
                }}
                title="Scroll Left"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll(250)}
                style={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  color: '#475569'
                }}
                title="Scroll Right"
              >
                <ChevronRight size={13} />
              </button>
            </div>

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => exportAssignmentMarksCSV(activeAssignment, filteredRows)}
              style={{ fontSize: '0.75rem', gap: 5 }}
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={handleSaveMarks}
              style={{ fontSize: '0.75rem', gap: 5 }}
            >
              <Save size={13} />
              <span>Save & Publish Marks</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Table Wrapper */}
        <div
          ref={tableScrollRef}
          style={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            width: '100%'
          }}
        >
          <table className="clean-table" style={{ minWidth: '980px', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Roll & PRN</th>
                <th style={{ width: '160px' }}>Student Name</th>
                <th style={{ width: '70px' }}>Division</th>
                <th style={{ width: '200px' }}>Submission Deliverable</th>
                <th style={{ width: '120px' }}>Marks Award</th>
                <th style={{ width: '80px' }}>Grade</th>
                <th style={{ minWidth: '220px' }}>Teacher Remarks & Feedback</th>
                <th style={{ width: '110px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                    No student submissions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map((s) => {
                  const gradeInfo = calculateAssignmentGrade(s.marks, activeAssignment.totalMarks);
                  const isUngraded = s.submitted && s.status !== 'Graded';

                  return (
                    <tr key={s.rollNumber}>
                      {/* Roll & PRN */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>
                          #{s.rollNumber}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                          {s.prn || 'N/A'}
                        </div>
                      </td>

                      {/* Name */}
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{s.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{s.course} Department</div>
                      </td>

                      {/* Division */}
                      <td>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: '#475569'
                          }}
                        >
                          Div {s.division}
                        </span>
                      </td>

                      {/* Deliverable / File */}
                      <td>
                        {s.submitted ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {s.fileName && s.fileName.endsWith('.zip') ? (
                                <Archive size={14} style={{ color: '#2563eb', flexShrink: 0 }} />
                              ) : (
                                <FileCode size={14} style={{ color: '#059669', flexShrink: 0 }} />
                              )}
                              <span
                                onClick={() => setPreviewSubmission(s)}
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  color: '#2563eb',
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '150px'
                                }}
                                title="Click to view submission deliverable"
                              >
                                {s.fileName || 'Assignment_Submission.zip'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                              {s.fileSize || '2.4 MB'} · {s.submissionDate || 'Submitted'}
                            </div>
                          </div>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              color: '#94a3b8',
                              fontStyle: 'italic',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <Clock size={12} /> Pending Submission
                          </span>
                        )}
                      </td>

                      {/* Marks Input */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="number"
                            min="0"
                            max={activeAssignment.totalMarks}
                            disabled={!s.submitted}
                            value={s.marks}
                            onChange={(e) => handleMarkChange(s.rollNumber, e.target.value)}
                            style={{
                              width: '54px',
                              height: '32px',
                              textAlign: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              border: !s.submitted
                                ? '1px solid #e2e8f0'
                                : isUngraded
                                ? '1px solid #f59e0b'
                                : '1px solid #cbd5e1',
                              borderRadius: '6px',
                              background: !s.submitted ? '#f8fafc' : '#ffffff',
                              color: '#0f172a'
                            }}
                          />
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            / {activeAssignment.totalMarks}
                          </span>
                        </div>
                      </td>

                      {/* Grade Badge */}
                      <td>
                        {s.submitted ? (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: gradeInfo.bg,
                              color: gradeInfo.color
                            }}
                          >
                            {gradeInfo.grade}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>—</span>
                        )}
                      </td>

                      {/* Remarks & Feedback Input */}
                      <td>
                        <input
                          type="text"
                          placeholder={s.submitted ? 'Enter student feedback...' : 'Awaiting submission'}
                          disabled={!s.submitted}
                          value={s.remarks || ''}
                          onChange={(e) => handleRemarkChange(s.rollNumber, e.target.value)}
                          style={{
                            width: '100%',
                            height: '32px',
                            padding: '0 8px',
                            fontSize: '0.76rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            background: !s.submitted ? '#f8fafc' : '#ffffff',
                            color: '#334155'
                          }}
                        />
                      </td>

                      {/* Status */}
                      <td style={{ textAlign: 'right' }}>
                        {s.submitted ? (
                          s.status === 'Graded' ? (
                            <span
                              className="badge badge-success"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            >
                              <CheckCircle2 size={11} /> Graded
                            </span>
                          ) : (
                            <span
                              className="badge badge-warning"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            >
                              <AlertTriangle size={11} /> Needs Grade
                            </span>
                          )
                        ) : (
                          <span className="badge badge-neutral" style={{ color: '#94a3b8' }}>
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Deliverable Review Modal */}
      {previewSubmission && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Student Deliverable Submission</h3>
                <span className="modal-subtitle">
                  {previewSubmission.name} (#{previewSubmission.rollNumber}) · PRN: {previewSubmission.prn}
                </span>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setPreviewSubmission(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '14px 16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Archive size={24} style={{ color: '#2563eb' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 650, color: '#0f172a' }}>
                      {previewSubmission.fileName || 'Assignment_Submission.zip'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Size: {previewSubmission.fileSize || '2.4 MB'} · Submitted on {previewSubmission.submissionDate}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    Award Marks (Out of {activeAssignment.totalMarks})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={activeAssignment.totalMarks}
                    value={previewSubmission.marks}
                    onChange={(e) => {
                      handleMarkChange(previewSubmission.rollNumber, e.target.value);
                      setPreviewSubmission((prev) => ({
                        ...prev,
                        marks: Number(e.target.value) || 0
                      }));
                    }}
                    className="input-field"
                    style={{ fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Calculated Grade</label>
                  <div
                    style={{
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontWeight: 700,
                      color: calculateAssignmentGrade(previewSubmission.marks, activeAssignment.totalMarks).color
                    }}
                  >
                    {calculateAssignmentGrade(previewSubmission.marks, activeAssignment.totalMarks).label}
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  Evaluation Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  value={previewSubmission.remarks || ''}
                  onChange={(e) => {
                    handleRemarkChange(previewSubmission.rollNumber, e.target.value);
                    setPreviewSubmission((prev) => ({
                      ...prev,
                      remarks: e.target.value
                    }));
                  }}
                  className="input-field"
                  placeholder="Provide constructive feedback for student..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  toast.info('File Download', `Downloading ${previewSubmission.fileName}...`);
                }}
                style={{ gap: 6 }}
              >
                <Download size={13} />
                <span>Download Archive</span>
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  handleMarkChange(previewSubmission.rollNumber, previewSubmission.marks);
                  setPreviewSubmission(null);
                  toast.success(
                    'Marks Recorded',
                    `Recorded ${previewSubmission.marks}/${activeAssignment.totalMarks} pts for ${previewSubmission.name}.`
                  );
                }}
              >
                <span>Confirm & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
