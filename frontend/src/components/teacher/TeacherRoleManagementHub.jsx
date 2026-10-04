import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Shield,
  Users,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Plus,
  Send,
  Printer,
  Edit3,
  Phone,
  Mail,
  UserCheck,
  Save,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import {
  getGFMCounselingLogs,
  saveGFMCounselingLogs
} from '../../lib/evaluationsData';

export default function TeacherRoleManagementHub({
  students = [],
  currentFaculty,
  onNavigate
}) {
  const { toast } = useToast();

  // Active Role Sub-Tab: 'class-teacher' | 'gfm'
  const [roleMode, setRoleMode] = useState('class-teacher');

  // GFM Counseling Logs
  const [gfmLogs, setGfmLogs] = useState(getGFMCounselingLogs);
  const [isAddCounselingModalOpen, setIsAddCounselingModalOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [newLog, setNewLog] = useState({
    topic: 'Academic Counseling & Progress Review',
    notes: '',
    actionPlan: 'Regular follow-up scheduled; study material provided.',
    status: 'On Track'
  });

  // Class Teacher Student Statuses
  const [studentStatusMap, setStudentStatusMap] = useState(() => {
    try {
      const saved = localStorage.getItem('edutrack_class_teacher_status');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Division A students (Class Teacher scope - strictly allocated department and division)
  const classTeacherStudents = useMemo(() => {
    const list = students.length > 0 ? students : [
      { rollNumber: 101, name: 'Krrish Sharma', course: 'IT', division: 'A', percentage: 94.2, admissionYear: 2024, prn: 'RBT24IT001' },
      { rollNumber: 102, name: 'Rohan Patel', course: 'IT', division: 'A', percentage: 71.4, admissionYear: 2024, prn: 'RBT24IT002' },
      { rollNumber: 103, name: 'Pooja Nair', course: 'IT', division: 'A', percentage: 95.8, admissionYear: 2024, prn: 'RBT24IT003' },
      { rollNumber: 104, name: 'Meera Iyer', course: 'IT', division: 'A', percentage: 89.1, admissionYear: 2024, prn: 'RBT24IT004' }
    ];
    const targetDiv = currentFaculty?.roles?.classTeacher?.division?.slice(-1) || currentFaculty?.classTeacherDivision || 'A';
    return list.filter((s) => (s.division || 'A') === targetDiv);
  }, [students, currentFaculty]);

  // GFM Mentees (Roll 101 - 120 cohort)
  const gfmCohortMentees = useMemo(() => {
    return classTeacherStudents.filter((s) => s.rollNumber >= 101 && s.rollNumber <= 120);
  }, [classTeacherStudents]);

  // Update status by Class Teacher
  const handleUpdateStatus = (rollNumber, status) => {
    const updated = {
      ...studentStatusMap,
      [rollNumber]: status
    };
    setStudentStatusMap(updated);
    try {
      localStorage.setItem('edutrack_class_teacher_status', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    toast.success('Status Updated', `Roll #${rollNumber} marked as "${status}".`);
  };

  // Add GFM Counseling Entry
  const handleAddCounselingSubmit = (e) => {
    e.preventDefault();
    if (!selectedMentee || !newLog.notes) return;

    const entry = {
      id: Date.now(),
      rollNumber: selectedMentee.rollNumber,
      studentName: selectedMentee.name,
      date: new Date().toISOString().split('T')[0],
      topic: newLog.topic,
      notes: newLog.notes,
      actionPlan: newLog.actionPlan,
      status: newLog.status
    };

    const updated = [entry, ...gfmLogs];
    setGfmLogs(updated);
    saveGFMCounselingLogs(updated);
    setIsAddCounselingModalOpen(false);
    toast.success('Mentorship Logged', `Counseling session recorded for ${selectedMentee.name}.`);
    setNewLog({
      topic: 'Academic Counseling & Progress Review',
      notes: '',
      actionPlan: 'Regular follow-up scheduled; study material provided.',
      status: 'On Track'
    });
  };

  // Print GFM Mentorship Register
  const handlePrintGFMRegister = () => {
    const printWindow = window.open('', '_blank', 'width=950,height=800');
    if (!printWindow) {
      alert('Please allow popups to print the GFM Register.');
      return;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Guardian Faculty Member (GFM) Mentorship Ledger</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #f8fafc; padding: 25px; color: #0f172a; }
    .sheet { max-width: 820px; margin: 0 auto; background: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #cbd5e1; }
    .masthead { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
    .title { font-size: 18px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
    .sub { font-size: 11px; color: #475569; margin-top: 3px; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 11px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px; }
    th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; }
    th { background: #0f172a; color: #fff; font-weight: 700; text-transform: uppercase; font-size: 10px; }
    tr:nth-child(even) { background: #f8fafc; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 35px; border-top: 1px dashed #cbd5e1; padding-top: 15px; font-size: 11px; font-weight: 700; }
    .sign-box { text-align: center; width: 200px; }
    .sign-line { border-top: 1px solid #0f172a; margin-top: 35px; padding-top: 5px; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="masthead">
      <div class="title">EDUTRACK INSTITUTE OF TECHNOLOGY (AUTONOMOUS)</div>
      <div class="sub">Department of Information Technology · Student Mentorship & Guardian Counseling Scheme</div>
      <div style="font-weight: 800; font-size: 12.5px; margin-top: 6px; color: #7c3aed; text-transform: uppercase;">
        OFFICIAL GUARDIAN FACULTY MEMBER (GFM) MENTORSHIP & COUNSELING LEDGER
      </div>
    </div>

    <div class="meta-grid">
      <div><strong>GFM Faculty Mentor:</strong> ${currentFaculty?.name || 'Prof. Krrish Sharma'}</div>
      <div><strong>Mentee Cohort:</strong> ${currentFaculty?.gfmCohort || 'Roll 101 - 120 (Div A)'}</div>
      <div><strong>Total Mentees:</strong> ${gfmCohortMentees.length} Students</div>
      <div><strong>Academic Session:</strong> Spring 2026</div>
      <div><strong>Department:</strong> ${currentFaculty?.department || 'Information Technology'}</div>
      <div><strong>Ledger Status:</strong> ACTIVE & VERIFIED</div>
    </div>

    <h4 style="font-size: 12px; font-weight: 800; margin-bottom: 8px; color: #0f172a; text-transform: uppercase;">
      1. Assigned Mentee Student Roster
    </h4>
    <table>
      <thead>
        <tr>
          <th style="width: 50px; text-align: center;">Roll #</th>
          <th>Unique PRN</th>
          <th>Mentee Name</th>
          <th>Division</th>
          <th style="text-align: center;">Attendance %</th>
          <th>Mentorship Status</th>
        </tr>
      </thead>
      <tbody>
        ${gfmCohortMentees.map(s => `
          <tr>
            <td style="text-align: center; font-weight: 800;">#${s.rollNumber}</td>
            <td style="font-family: monospace; font-weight: 700; color: #1d4ed8;">${s.prn || 'RBT24IT' + String(s.rollNumber).padStart(3, '0')}</td>
            <td style="font-weight: 600;">${s.name}</td>
            <td>Div ${s.division || 'A'}</td>
            <td style="text-align: center; font-weight: 700; color: ${s.percentage >= 75 ? '#059669' : '#dc2626'};">${Number(s.percentage || 75).toFixed(1)}%</td>
            <td style="font-weight: 600; color: #7c3aed;">Active Mentorship</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h4 style="font-size: 12px; font-weight: 800; margin: 16px 0 8px 0; color: #0f172a; text-transform: uppercase;">
      2. Recorded Counseling & Academic Intervention Sessions
    </h4>
    <table>
      <thead>
        <tr>
          <th style="width: 80px;">Date</th>
          <th style="width: 60px; text-align: center;">Roll #</th>
          <th style="width: 130px;">Mentee</th>
          <th>Topic & Counseling Notes</th>
          <th>Prescribed Action Plan</th>
          <th style="width: 85px;">Outcome</th>
        </tr>
      </thead>
      <tbody>
        ${gfmLogs.map(l => `
          <tr>
            <td>${l.date}</td>
            <td style="text-align: center; font-weight: 700;">#${l.rollNumber}</td>
            <td style="font-weight: 600;">${l.studentName}</td>
            <td><strong>${l.topic}:</strong> ${l.notes}</td>
            <td style="font-size: 10px; color: #334155;">${l.actionPlan}</td>
            <td style="font-weight: 700; color: #059669;">${l.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="sign-row">
      <div class="sign-box">
        <div class="sign-line">Guardian Faculty Member (GFM)</div>
      </div>
      <div class="sign-box">
        <div class="sign-line">Class Teacher (Division A)</div>
      </div>
      <div class="sign-box">
        <div class="sign-line">Head of Department (HOD)</div>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div>
      {/* Role Navigation Switcher Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setRoleMode('class-teacher')}
            style={{
              background: roleMode === 'class-teacher' ? '#eff6ff' : '#f8fafc',
              border: roleMode === 'class-teacher' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
              color: roleMode === 'class-teacher' ? '#1d4ed8' : '#64748b',
              borderRadius: '10px',
              padding: '8px 16px',
              fontWeight: 650,
              fontSize: '0.84rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <GraduationCap size={16} />
            <span>Class Teacher Hub · Division {currentFaculty?.classTeacherDivision || 'A'}</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleMode('gfm')}
            style={{
              background: roleMode === 'gfm' ? '#f5f3ff' : '#f8fafc',
              border: roleMode === 'gfm' ? '1px solid #8b5cf6' : '1px solid #e2e8f0',
              color: roleMode === 'gfm' ? '#6d28d9' : '#64748b',
              borderRadius: '10px',
              padding: '8px 16px',
              fontWeight: 650,
              fontSize: '0.84rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Shield size={16} />
            <span>Guardian Faculty Member (GFM) · {currentFaculty?.gfmCohort || 'Roll 101 - 120'}</span>
          </button>
        </div>

        <div>
          {roleMode === 'gfm' && (
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={handlePrintGFMRegister}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={13} />
              <span>Print GFM Mentorship Register</span>
            </button>
          )}
          {roleMode === 'class-teacher' && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => onNavigate && onNavigate('attendance')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Users size={13} />
              <span>Manage Division Attendance</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          VIEW A: CLASS TEACHER HUB (DIVISION A OVERSIGHT)
          ========================================================================= */}
      {roleMode === 'class-teacher' && (
        <>
          <div className="stats-grid" style={{ marginBottom: 16 }}>
            <div className="stat-card">
              <span className="stat-label">Division Students</span>
              <span className="stat-value">{classTeacherStudents.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Average Attendance</span>
              <span className="stat-value" style={{ color: '#059669' }}>
                {(
                  classTeacherStudents.reduce((acc, s) => acc + Number(s.percentage || 75), 0) /
                  (classTeacherStudents.length || 1)
                ).toFixed(1)}%
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Below 75% Attendance</span>
              <span className="stat-value" style={{ color: '#ef4444' }}>
                {classTeacherStudents.filter((s) => s.percentage < 75).length}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Eligible for Promotion</span>
              <span className="stat-value" style={{ color: '#2563eb' }}>
                {classTeacherStudents.filter((s) => s.percentage >= 75).length}
              </span>
            </div>
          </div>

          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Division A Management</h3>
              </div>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th style={{ width: '70px', textAlign: 'center' }}>Roll #</th>
                  <th style={{ width: '130px' }}>Unique PRN</th>
                  <th>Student Name</th>
                  <th>Attendance %</th>
                  <th>Admit Card Status</th>
                  <th>Class Teacher Status Tag</th>
                  <th style={{ textAlign: 'right' }}>Class Teacher Action</th>
                </tr>
              </thead>
              <tbody>
                {classTeacherStudents.map((s) => {
                  const currentStatus = studentStatusMap[s.rollNumber] || (s.percentage >= 75 ? 'Good Standing' : 'Attendance Hold');
                  const isProbation = currentStatus === 'Attendance Hold' || s.percentage < 75;

                  return (
                    <tr key={s.rollNumber}>
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
                      <td>
                        <strong style={{ color: s.percentage >= 75 ? '#059669' : '#dc2626' }}>
                          {Number(s.percentage || 75).toFixed(1)}%
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${s.percentage >= 75 ? 'badge-success' : 'badge-danger'}`}>
                          {s.percentage >= 75 ? '✓ Hall Ticket Cleared' : '⚠️ Gatekeeper Hold'}
                        </span>
                      </td>
                      <td>
                        <select
                          value={currentStatus}
                          onChange={(e) => handleUpdateStatus(s.rollNumber, e.target.value)}
                          className="input-field"
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            color: isProbation ? '#b91c1c' : '#047857',
                            background: isProbation ? '#fef2f2' : '#f0fdf4',
                            border: isProbation ? '1px solid #fca5a5' : '1px solid #bbf7d0'
                          }}
                        >
                          <option value="Good Standing">✓ In Good Standing</option>
                          <option value="Promoted">🌟 Promoted to Sem 7</option>
                          <option value="Attendance Hold">⚠️ Attendance Hold</option>
                          <option value="Academic Probation">❗ Academic Probation</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedMentee(s);
                            setIsAddCounselingModalOpen(true);
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <MessageSquare size={12} />
                          <span>Counseling Log</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW B: GUARDIAN FACULTY MEMBER (GFM) MENTORSHIP HUB
          ========================================================================= */}
      {roleMode === 'gfm' && (
        <>
          <div className="stats-grid" style={{ marginBottom: 16 }}>
            <div className="stat-card" style={{ borderLeft: '4px solid #7c3aed' }}>
              <span className="stat-label">Assigned Mentees</span>
              <span className="stat-value" style={{ color: '#7c3aed' }}>{gfmCohortMentees.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Counseling Sessions</span>
              <span className="stat-value">{gfmLogs.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Remedial Required</span>
              <span className="stat-value" style={{ color: '#ea580c' }}>
                {gfmCohortMentees.filter((s) => s.percentage < 75).length}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Mentorship Compliance</span>
              <span className="stat-value" style={{ color: '#059669' }}>100%</span>
            </div>
          </div>

          {/* Mentee Student Cards & Action */}
          <div className="table-container" style={{ marginBottom: 20 }}>
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">GFM Mentorship Cohort</h3>
              </div>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th style={{ width: '70px', textAlign: 'center' }}>Roll #</th>
                  <th style={{ width: '130px' }}>Unique PRN</th>
                  <th>Mentee Candidate</th>
                  <th>Department & Div</th>
                  <th>Cumulative %</th>
                  <th>Latest GFM Assessment</th>
                  <th style={{ textAlign: 'right' }}>Faculty Action</th>
                </tr>
              </thead>
              <tbody>
                {gfmCohortMentees.map((s) => {
                  const studentLogs = gfmLogs.filter((l) => l.rollNumber === s.rollNumber);
                  const latestLog = studentLogs[0];

                  return (
                    <tr key={s.rollNumber}>
                      <td style={{ textAlign: 'center' }}>
                        <strong style={{ color: '#0f172a' }}>#{s.rollNumber}</strong>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.825rem', color: '#7c3aed', fontWeight: 700 }}>
                          {s.prn || 'RBT24IT' + String(s.rollNumber).padStart(3, '0')}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                      </td>
                      <td>{s.course} (Div {s.division})</td>
                      <td>
                        <strong style={{ color: s.percentage >= 75 ? '#059669' : '#dc2626' }}>
                          {Number(s.percentage || 75).toFixed(1)}%
                        </strong>
                      </td>
                      <td style={{ fontSize: '0.78rem' }}>
                        {latestLog ? (
                          <div>
                            <span style={{ fontWeight: 700, color: '#7c3aed' }}>{latestLog.topic}</span>
                            <div style={{ color: '#64748b' }}>{latestLog.actionPlan}</div>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>Session pending</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-primary btn-sm"
                          onClick={() => {
                            setSelectedMentee(s);
                            setIsAddCounselingModalOpen(true);
                          }}
                          style={{
                            background: '#7c3aed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Plus size={12} />
                          <span>Log Session</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* GFM Counseling Timeline Table */}
          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Counseling Records</h3>
              </div>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th style={{ width: '95px' }}>Date</th>
                  <th style={{ width: '70px', textAlign: 'center' }}>Roll #</th>
                  <th>Mentee Name</th>
                  <th>Topic</th>
                  <th>Counseling Discussion Notes</th>
                  <th>Action Plan & Follow-up</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {gfmLogs.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{l.date}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <strong>#{l.rollNumber}</strong>
                    </td>
                    <td style={{ fontWeight: 600 }}>{l.studentName}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#7c3aed', fontSize: '0.8rem' }}>{l.topic}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#334155' }}>{l.notes}</td>
                    <td style={{ fontSize: '0.78rem', color: '#059669' }}>{l.actionPlan}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Log Counseling Modal */}
      {isAddCounselingModalOpen && selectedMentee && (
        <div className="modal-overlay" onClick={() => setIsAddCounselingModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Record GFM Counseling Session</h3>
              <button className="modal-close-btn" onClick={() => setIsAddCounselingModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddCounselingSubmit}>
              <div className="modal-body">
                <div style={{ marginBottom: 14, background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{selectedMentee.name}</strong>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Roll #{selectedMentee.rollNumber} · PRN: {selectedMentee.prn || 'RBT24IT' + selectedMentee.rollNumber} · Attendance: {selectedMentee.percentage}%
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Counseling Focus / Topic *</label>
                  <select
                    value={newLog.topic}
                    onChange={(e) => setNewLog({ ...newLog, topic: e.target.value })}
                    className="input-field"
                  >
                    <option>Academic Counseling & Progress Review</option>
                    <option>Attendance Shortfall & Make-up Plan</option>
                    <option>Slow Learner Remedial Mentoring</option>
                    <option>Fast Track Research & Paper Guidance</option>
                    <option>Fee Dues Consultation & Parent Contact</option>
                    <option>Personal & Campus Well-being Guidance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Discussion Notes & Observations *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Enter key counseling points discussed..."
                    value={newLog.notes}
                    onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prescribed Action Plan *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saturday tutorial attendance; parent contacted"
                    value={newLog.actionPlan}
                    onChange={(e) => setNewLog({ ...newLog, actionPlan: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mentee Progress Status</label>
                  <select
                    value={newLog.status}
                    onChange={(e) => setNewLog({ ...newLog, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="On Track">On Track / Progressing</option>
                    <option value="Under Mentorship">Under Mentorship</option>
                    <option value="Remedial Action">Remedial Action</option>
                    <option value="Parent Contacted">Parent Contacted</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddCounselingModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ background: '#7c3aed' }}>
                  <span>Commit Mentorship Log</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
