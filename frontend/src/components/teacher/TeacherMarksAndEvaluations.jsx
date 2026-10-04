import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  BookOpen,
  Award,
  FlaskConical,
  Layers,
  FileSpreadsheet,
  Plus,
  Save,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Search,
  Check,
  X,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import {
  ASSESSMENT_TYPES,
  getEvaluationsStore,
  saveEvaluationsStore,
  calculateGrade,
  printEvaluationMarksLedger,
  exportEvaluationMarksCSV
} from '../../lib/evaluationsData';

export default function TeacherMarksAndEvaluations({ students = [], currentFaculty }) {
  const { toast } = useToast();

  const facultyDeptCode = useMemo(() => {
    const dept = (currentFaculty?.department || 'Information Technology').toLowerCase();
    if (dept.includes('computer')) return 'CS';
    if (dept.includes('electronic') || dept.includes('telecom')) return 'EXTC';
    if (dept.includes('mech')) return 'MECH';
    if (dept.includes('data') || dept.includes('ai')) return 'AIDS';
    return 'IT';
  }, [currentFaculty?.department]);

  const facultyAssignedDivisions = useMemo(() => {
    const divs = new Set();
    const ctDiv = currentFaculty?.roles?.classTeacher?.division || currentFaculty?.classTeacherDivision;
    if (ctDiv && ctDiv !== 'None') {
      const parsed = ctDiv.replace(/[^A-Za-z]/g, '').slice(-1) || 'A';
      divs.add(parsed.toUpperCase());
    }
    if (currentFaculty?.roles?.theorySubjects) {
      currentFaculty.roles.theorySubjects.forEach((s) => {
        if (s.division) divs.add(s.division.toUpperCase());
      });
    }
    if (divs.size === 0) divs.add('A');
    return Array.from(divs);
  }, [currentFaculty]);

  const facultySubjects = useMemo(() => {
    const list = [];
    (currentFaculty?.roles?.theorySubjects || []).forEach((s) => {
      list.push({ code: s.code, name: s.name });
    });
    (currentFaculty?.roles?.practicalLabs || []).forEach((l) => {
      list.push({ code: l.code, name: l.name });
    });
    if (list.length === 0) {
      list.push({ code: 'IT-301', name: 'Core Java & OOP Frameworks' });
      list.push({ code: 'IT-301L', name: 'Advanced Java Programming Lab' });
    }
    return list;
  }, [currentFaculty]);

  const [store, setStore] = useState(getEvaluationsStore);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(() => {
    return store.assessments && store.assessments.length > 0 ? store.assessments[0].id : 'CIE-IT301-01';
  });

  const [assessmentTypeFilter, setAssessmentTypeFilter] = useState('all');
  const [divisionFilter, setDivisionFilter] = useState(() => facultyAssignedDivisions[0] || 'A');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Assessment Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    type: 'cie',
    subjectCode: facultySubjects[0]?.code || 'IT-301',
    subjectName: facultySubjects[0]?.name || 'Core Java & OOP Frameworks',
    division: facultyAssignedDivisions[0] || 'A',
    maxMarks: 30,
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Current active assessment
  const activeAssessment = useMemo(() => {
    return store.assessments.find((a) => a.id === selectedAssessmentId) || store.assessments[0] || {
      id: 'CIE-IT301-01',
      title: 'In-Semester Assessment',
      subjectCode: 'IT-301',
      subjectName: 'Core Java',
      division: 'A',
      maxMarks: 30
    };
  }, [store.assessments, selectedAssessmentId]);

  // Current marks for this assessment
  const currentMarksMap = useMemo(() => {
    return store.marksMatrix[selectedAssessmentId] || {};
  }, [store.marksMatrix, selectedAssessmentId]);

  // Combined student rows with their entered marks (strictly scoped to teacher's department and division)
  const studentRows = useMemo(() => {
    const list = students.length > 0 ? students : [
      { rollNumber: 101, name: 'Krrish Sharma', course: facultyDeptCode, division: facultyAssignedDivisions[0] || 'A', prn: 'RBT24IT001' },
      { rollNumber: 102, name: 'Rohan Patel', course: facultyDeptCode, division: facultyAssignedDivisions[0] || 'A', prn: 'RBT24IT002' },
      { rollNumber: 103, name: 'Pooja Nair', course: facultyDeptCode, division: facultyAssignedDivisions[0] || 'A', prn: 'RBT24IT003' },
      { rollNumber: 104, name: 'Meera Iyer', course: facultyDeptCode, division: facultyAssignedDivisions[0] || 'A', prn: 'RBT24IT004' }
    ];

    return list
      .filter((s) => {
        const studentCourse = (s.course || '').toUpperCase();
        return studentCourse === facultyDeptCode || studentCourse.includes(facultyDeptCode);
      })
      .filter((s) => divisionFilter === 'All' || s.division === divisionFilter)
      .filter((s) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          String(s.rollNumber).includes(q) ||
          (s.prn && s.prn.toLowerCase().includes(q))
        );
      })
      .map((s) => {
        const markEntry = currentMarksMap[s.rollNumber] || {};
        const marks = markEntry.marks !== undefined ? markEntry.marks : Math.round(activeAssessment.maxMarks * 0.75);
        const remarks = markEntry.remarks || 'Standard evaluation recorded.';
        return {
          ...s,
          marks,
          remarks
        };
      });
  }, [students, facultyDeptCode, facultyAssignedDivisions, divisionFilter, searchQuery, currentMarksMap, activeAssessment]);

  // Handle Mark Change
  const handleMarkChange = (rollNumber, val) => {
    const num = val === '' ? 0 : Math.max(0, Math.min(activeAssessment.maxMarks, Number(val) || 0));
    setStore((prev) => {
      const assessmentMarks = { ...(prev.marksMatrix[selectedAssessmentId] || {}) };
      assessmentMarks[rollNumber] = {
        ...(assessmentMarks[rollNumber] || {}),
        marks: num
      };
      const updated = {
        ...prev,
        marksMatrix: {
          ...prev.marksMatrix,
          [selectedAssessmentId]: assessmentMarks
        }
      };
      saveEvaluationsStore(updated);
      return updated;
    });
  };

  // Handle Remark Change
  const handleRemarkChange = (rollNumber, text) => {
    setStore((prev) => {
      const assessmentMarks = { ...(prev.marksMatrix[selectedAssessmentId] || {}) };
      assessmentMarks[rollNumber] = {
        ...(assessmentMarks[rollNumber] || {}),
        remarks: text
      };
      const updated = {
        ...prev,
        marksMatrix: {
          ...prev.marksMatrix,
          [selectedAssessmentId]: assessmentMarks
        }
      };
      saveEvaluationsStore(updated);
      return updated;
    });
  };

  // Bulk Quick-Fill actions
  const handleSetPassing = () => {
    const passingScore = Math.ceil(activeAssessment.maxMarks * 0.4);
    setStore((prev) => {
      const assessmentMarks = { ...(prev.marksMatrix[selectedAssessmentId] || {}) };
      studentRows.forEach((s) => {
        assessmentMarks[s.rollNumber] = {
          ...(assessmentMarks[s.rollNumber] || {}),
          marks: passingScore,
          remarks: 'Assigned standard passing score.'
        };
      });
      const updated = {
        ...prev,
        marksMatrix: {
          ...prev.marksMatrix,
          [selectedAssessmentId]: assessmentMarks
        }
      };
      saveEvaluationsStore(updated);
      return updated;
    });
    toast.info('Passing Score Applied', `All students set to ${passingScore} / ${activeAssessment.maxMarks} pts.`);
  };

  const handleSetDistinction = () => {
    const distScore = Math.round(activeAssessment.maxMarks * 0.85);
    setStore((prev) => {
      const assessmentMarks = { ...(prev.marksMatrix[selectedAssessmentId] || {}) };
      studentRows.forEach((s) => {
        assessmentMarks[s.rollNumber] = {
          ...(assessmentMarks[s.rollNumber] || {}),
          marks: distScore,
          remarks: 'High proficiency demonstrated.'
        };
      });
      const updated = {
        ...prev,
        marksMatrix: {
          ...prev.marksMatrix,
          [selectedAssessmentId]: assessmentMarks
        }
      };
      saveEvaluationsStore(updated);
      return updated;
    });
    toast.success('Distinction Score Applied', `Scores updated to ${distScore} / ${activeAssessment.maxMarks} pts.`);
  };

  const handleSaveAllMarks = () => {
    saveEvaluationsStore(store);
    toast.success(
      'Marks Committed',
      `Saved evaluations for ${studentRows.length} students in "${activeAssessment.title}".`
    );
  };

  // Create new assessment
  const handleCreateAssessmentSubmit = (e) => {
    e.preventDefault();
    if (!newAssessment.title) return;

    const id = `${newAssessment.type.substring(0, 3).toUpperCase()}-${newAssessment.subjectCode}-${Date.now().toString().slice(-4)}`;
    const created = {
      id,
      ...newAssessment,
      evaluator: currentFaculty?.name || 'Prof. Krrish Sharma',
      status: 'Active'
    };

    setStore((prev) => {
      const updated = {
        ...prev,
        assessments: [created, ...prev.assessments]
      };
      saveEvaluationsStore(updated);
      return updated;
    });

    setSelectedAssessmentId(id);
    setIsCreateModalOpen(false);
    toast.success('Assessment Created', `"${newAssessment.title}" created. You can now fill candidate marks.`);
    setNewAssessment({
      title: '',
      type: 'assignment',
      subjectCode: 'IT-301',
      subjectName: 'Core Java & OOP Frameworks',
      division: 'A',
      maxMarks: 25,
      dueDate: new Date().toISOString().split('T')[0]
    });
  };

  // Calculate assessment statistics
  const stats = useMemo(() => {
    if (studentRows.length === 0) return { avg: 0, highest: 0, passPct: 0 };
    const scores = studentRows.map((s) => s.marks);
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = (sum / scores.length).toFixed(1);
    const highest = Math.max(...scores, 0);
    const passed = studentRows.filter((s) => calculateGrade(s.marks, activeAssessment.maxMarks).pct >= 40).length;
    const passPct = Math.round((passed / studentRows.length) * 100);
    return { avg, highest, passPct, total: studentRows.length, passed };
  }, [studentRows, activeAssessment.maxMarks]);

  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleWheelScroll = (e) => {
    if (carouselRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      carouselRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div>
      {/* Assessment Selection Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Assessments
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Horizontal Scroll Navigation Steppers */}
            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', padding: '2px', borderRadius: '8px', gap: '2px' }}>
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                title="Scroll Left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                title="Scroll Right"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={() => setIsCreateModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} />
              <span>New Assessment</span>
            </button>
          </div>
        </div>

        {/* Assessment Pills Selector - Smooth and Clean horizontal scroll */}
        <div
          ref={carouselRef}
          onWheel={handleWheelScroll}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollBehavior: 'smooth'
          }}
        >
          {store.assessments.map((asm) => {
            const isSelected = asm.id === selectedAssessmentId;
            return (
              <button
                key={asm.id}
                type="button"
                onClick={() => setSelectedAssessmentId(asm.id)}
                style={{
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  border: isSelected ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '9px 13px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  flexShrink: 0,
                  minWidth: '220px',
                  boxShadow: isSelected ? '0 1px 3px rgba(37,99,235,0.1)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: isSelected ? '#dbeafe' : '#e2e8f0',
                      color: isSelected ? '#1d4ed8' : '#475569'
                    }}
                  >
                    {asm.type} · Max {asm.maxMarks} pts
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Div {asm.division}</span>
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 650, color: isSelected ? '#1d4ed8' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {asm.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  {asm.subjectCode} · Due {asm.dueDate}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Evaluation Statistics Row */}
      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <span className="stat-label">Evaluated Students</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Score</span>
          <span className="stat-value" style={{ color: '#2563eb' }}>
            {stats.avg} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ {activeAssessment.maxMarks}</span>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Highest Score</span>
          <span className="stat-value" style={{ color: '#059669' }}>
            {stats.highest} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ {activeAssessment.maxMarks}</span>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pass Rate</span>
          <span className="stat-value" style={{ color: stats.passPct >= 75 ? '#059669' : '#ea580c' }}>
            {stats.passPct}%
          </span>
        </div>
      </div>

      {/* Main Interactive Spreadsheet Ledger */}
      <div className="table-container">
        <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 className="table-title">
              {activeAssessment.title} ({activeAssessment.subjectCode})
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 600 }}
            >
              {facultyAssignedDivisions.length > 1 && (
                <option value="All">All Assigned Divisions ({facultyAssignedDivisions.join(', ')})</option>
              )}
              {facultyAssignedDivisions.map((div) => (
                <option key={div} value={div}>Division {div}</option>
              ))}
            </select>

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handleSetPassing}
              title="Set all to 40% passing benchmark"
            >
              <span>Pass Benchmark (40%)</span>
            </button>

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handleSetDistinction}
              title="Set all to 85% distinction"
            >
              <span>Distinction (85%)</span>
            </button>

            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={handleSaveAllMarks}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Save size={13} />
              <span>Save & Commit Marks</span>
            </button>

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => printEvaluationMarksLedger(activeAssessment, studentRows)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Printer size={13} />
              <span>Print Marks Sheet</span>
            </button>

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => exportEvaluationMarksCSV(activeAssessment, studentRows)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              title="Export assessment marks spreadsheet (CSV / Excel)"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ padding: '0 20px 12px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search candidate name or PRN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '30px', fontSize: '0.8rem' }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>
            Tip: Marks are auto-validated against Max Marks ({activeAssessment.maxMarks} pts). Real-time grading applied.
          </span>
        </div>

        {/* Table Horizontal Scroll Container */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
          <table className="clean-table" style={{ minWidth: '950px' }}>
            <thead>
              <tr>
                <th style={{ width: '65px', textAlign: 'center' }}>Roll #</th>
                <th style={{ width: '130px' }}>Unique PRN</th>
                <th>Candidate Name</th>
                <th style={{ width: '70px', textAlign: 'center' }}>Div</th>
                <th style={{ width: '110px', textAlign: 'center' }}>Marks Scored ({activeAssessment.maxMarks})</th>
                <th style={{ width: '75px', textAlign: 'center' }}>Percentage</th>
                <th style={{ width: '70px', textAlign: 'center' }}>Grade</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Result</th>
                <th>Faculty Feedback & Assessment Remarks</th>
              </tr>
            </thead>
            <tbody>
              {studentRows.map((s) => {
                const { grade, status, pct } = calculateGrade(s.marks, activeAssessment.maxMarks);
                const isPassed = pct >= 40;

                return (
                  <tr key={s.rollNumber} style={{ background: !isPassed ? 'rgba(239, 68, 68, 0.02)' : undefined }}>
                    <td style={{ textAlign: 'center' }}>
                      <strong style={{ color: '#0f172a' }}>#{s.rollNumber}</strong>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.825rem', color: '#1d4ed8', fontWeight: 700 }}>
                        {s.prn || 'RBT24IT' + String(s.rollNumber).padStart(3, '0')}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge-neutral">Div {s.division}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="0"
                        max={activeAssessment.maxMarks}
                        value={s.marks}
                        onChange={(e) => handleMarkChange(s.rollNumber, e.target.value)}
                        style={{
                          width: '75px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: isPassed ? '1px solid #cbd5e1' : '1px solid #ef4444',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          color: isPassed ? '#0f172a' : '#ef4444',
                          background: isPassed ? '#ffffff' : '#fef2f2'
                        }}
                      />
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: isPassed ? '#059669' : '#dc2626' }}>
                      {pct}%
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          background: isPassed ? '#ecfdf5' : '#fef2f2',
                          color: isPassed ? '#047857' : '#b91c1c'
                        }}
                      >
                        {grade}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                        {isPassed ? '✓ Passed' : '⚠️ Remedial'}
                      </span>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={s.remarks}
                        onChange={(e) => handleRemarkChange(s.rollNumber, e.target.value)}
                        placeholder="Enter feedback remark..."
                        className="input-field"
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.78rem' }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Assessment Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Course Assessment or Paper</h3>
              <button className="modal-close-btn" onClick={() => setIsCreateModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateAssessmentSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Assessment Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit Test 2: Multithreading & Lambdas"
                    value={newAssessment.title}
                    onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Component Type *</label>
                    <select
                      value={newAssessment.type}
                      onChange={(e) => {
                        const t = ASSESSMENT_TYPES.find((item) => item.id === e.target.value);
                        setNewAssessment({
                          ...newAssessment,
                          type: e.target.value,
                          maxMarks: t ? t.defaultMaxMarks : 25
                        });
                      }}
                      className="input-field"
                    >
                      {ASSESSMENT_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Maximum Marks *</label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      required
                      value={newAssessment.maxMarks}
                      onChange={(e) => setNewAssessment({ ...newAssessment, maxMarks: Number(e.target.value) || 25 })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Course / Subject Code *</label>
                    <select
                      value={newAssessment.subjectCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        const sub = facultySubjects.find((s) => s.code === code);
                        setNewAssessment({
                          ...newAssessment,
                          subjectCode: code,
                          subjectName: sub ? sub.name : 'Core Java & OOP'
                        });
                      }}
                      className="input-field"
                    >
                      {facultySubjects.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.code} ({s.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Division *</label>
                    <select
                      value={newAssessment.division}
                      onChange={(e) => setNewAssessment({ ...newAssessment, division: e.target.value })}
                      className="input-field"
                    >
                      {facultyAssignedDivisions.map((div) => (
                        <option key={div} value={div}>
                          Division {div} (Assigned Class)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Assessment / Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newAssessment.dueDate}
                    onChange={(e) => setNewAssessment({ ...newAssessment, dueDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <span>Publish & Open Marks Sheet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
