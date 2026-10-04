import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Percent,
  Download,
  Eye,
  Award,
  GraduationCap,
  Sparkles,
  Users,
  Check,
  X,
  XCircle,
  Lock,
  FileCheck,
  Settings,
  RotateCcw
} from 'lucide-react';
import {
  getStudentsClearance,
  saveStudentsClearance,
  toggleStudentHallTicket,
  toggleStudentMarksheet,
  toggleStudentFeeStatus,
  grantCondonationWaiver,
  getClearanceSettings,
  saveClearanceSettings
} from '../../lib/clearanceData';
import HallTicketModal from './HallTicketModal';
import MarksheetModal from './MarksheetModal';
import { useToast } from '../../context/ToastContext';

export default function StudentClearanceManager({ className = '', initialFilter = 'all' }) {
  const toast = useToast();
  const [students, setStudents] = useState(getStudentsClearance);
  const [settings, setSettings] = useState(getClearanceSettings);

  // Selected student for live preview
  const [previewStudentForHallTicket, setPreviewStudentForHallTicket] = useState(null);
  const [previewStudentForMarksheet, setPreviewStudentForMarksheet] = useState(null);

  // Filter query / subtab
  const [filterType, setFilterType] = useState(initialFilter); // 'all' | 'hallticket-withheld' | 'fee-pending' | 'marksheet-withheld'

  useEffect(() => {
    const handleUpdate = () => {
      setStudents(getStudentsClearance());
    };
    window.addEventListener('edutrack_clearance_updated', handleUpdate);
    return () => window.removeEventListener('edutrack_clearance_updated', handleUpdate);
  }, []);

  const handleToggleFee = (rollNumber) => {
    const updated = toggleStudentFeeStatus(rollNumber);
    setStudents(updated);
    const s = updated.find((item) => item.rollNumber === rollNumber);
    if (toast) {
      if (s.feeStatus === 'paid') {
        toast.success('Fee Cleared', `Marked fee as PAID in full for ${s.name} (Roll #${s.rollNumber}).`);
      } else {
        toast.warning('Fee Dues Added', `Marked tuition fee dues pending (₹28,500) for ${s.name}.`);
      }
    }
  };

  const handleToggleCondonation = (rollNumber) => {
    const updated = grantCondonationWaiver(rollNumber);
    setStudents(updated);
    const s = updated.find((item) => item.rollNumber === rollNumber);
    if (toast) {
      if (s.condonationGranted) {
        toast.success('Condonation Granted', `Authorized HOD medical condonation waiver for ${s.name}.`);
      } else {
        toast.info('Condonation Revoked', `Revoked condonation waiver for ${s.name}.`);
      }
    }
  };

  const handleToggleHallTicket = (rollNumber) => {
    const updated = toggleStudentHallTicket(rollNumber);
    setStudents(updated);
    const s = updated.find((item) => item.rollNumber === rollNumber);
    if (toast) {
      if (s.hallTicketStatus === 'issued') {
        toast.success('Hall Ticket Released', `Admit card issued for ${s.name} (Roll #${s.rollNumber}).`);
      } else {
        toast.warning('Hall Ticket Withheld', `Admit card blocked for ${s.name}.`);
      }
    }
  };

  const handleToggleMarksheet = (rollNumber) => {
    const updated = toggleStudentMarksheet(rollNumber);
    setStudents(updated);
    const s = updated.find((item) => item.rollNumber === rollNumber);
    if (toast) {
      if (s.marksheetStatus === 'released') {
        toast.success('Marksheet Released', `Official Semester 6 Marksheet released for ${s.name}.`);
      } else {
        toast.warning('Marksheet Withheld', `Marksheet retracted and withheld for ${s.name}.`);
      }
    }
  };

  const handleBulkReleaseHallTickets = () => {
    const updated = students.map((s) => ({
      ...s,
      hallTicketStatus: 'issued',
      hallTicketWithheldReason: ''
    }));
    saveStudentsClearance(updated);
    setStudents(updated);
    if (toast) toast.success('Bulk Release Complete', 'All student Hall Tickets have been released.');
  };

  const handleBulkReleaseMarksheets = () => {
    const updated = students.map((s) => ({
      ...s,
      marksheetStatus: 'released',
      marksheetWithheldReason: ''
    }));
    saveStudentsClearance(updated);
    setStudents(updated);
    if (toast) toast.success('Bulk Release Complete', 'All student Marksheets have been released live.');
  };

  const filteredStudents = students.filter((s) => {
    if (filterType === 'hallticket-withheld') return s.hallTicketStatus === 'withheld';
    if (filterType === 'marksheet-withheld') return s.marksheetStatus === 'withheld';
    if (filterType === 'fee-pending') return s.feeStatus === 'pending';
    return true;
  });

  const totalIssuedHall = students.filter((s) => s.hallTicketStatus === 'issued').length;
  const totalReleasedMarksheet = students.filter((s) => s.marksheetStatus === 'released').length;
  const totalFeePending = students.filter((s) => s.feeStatus === 'pending').length;
  const totalAttDefaulters = students.filter((s) => s.attendance < 75 && !s.condonationGranted).length;

  return (
    <div className={`student-clearance-manager ${className}`}>
      {/* Overview Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <span className="stat-label">Total Students</span>
          <span className="stat-value">{students.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Hall Tickets Issued</span>
          <span className="stat-value" style={{ color: totalIssuedHall === students.length ? '#16a34a' : '#2563eb' }}>
            {totalIssuedHall} / {students.length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Marksheets Released</span>
          <span className="stat-value" style={{ color: totalReleasedMarksheet === students.length ? '#16a34a' : '#d97706' }}>
            {totalReleasedMarksheet} / {students.length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending Clearances</span>
          <span className="stat-value" style={{ color: totalFeePending > 0 ? '#dc2626' : '#16a34a' }}>
            {totalFeePending + totalAttDefaulters}
          </span>
        </div>
      </div>

      {/* Control Action Bar */}
      <div
        style={{
          padding: '14px 20px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { id: 'all', label: `All (${students.length})` },
            { id: 'fee-pending', label: `Fee Dues (${totalFeePending})` },
            { id: 'hallticket-withheld', label: `Hall Ticket Blocked (${students.length - totalIssuedHall})` },
            { id: 'marksheet-withheld', label: `Marksheet Withheld (${students.length - totalReleasedMarksheet})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: filterType === tab.id ? 600 : 500,
                background: filterType === tab.id ? '#0f172a' : '#f1f5f9',
                color: filterType === tab.id ? '#ffffff' : '#475569',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={handleBulkReleaseHallTickets}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <GraduationCap size={13} />
            <span>Release Hall Tickets</span>
          </button>

          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={handleBulkReleaseMarksheets}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Award size={13} />
            <span>Release Marksheets</span>
          </button>
        </div>
      </div>

      {/* Clearance Table */}
      <div className="table-container" style={{ background: '#ffffff', borderRadius: 16 }}>
        <div className="table-header-bar">
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              Clearance & Hall Tickets
            </h4>
          </div>
        </div>

        <table className="clean-table">
          <thead>
            <tr>
              <th>Candidate Info</th>
              <th>Attendance Status</th>
              <th>Fee Clearance</th>
              <th>Hall Ticket (Admit Card)</th>
              <th>Official Marksheet</th>
              <th style={{ textAlign: 'right' }}>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => {
              const isFeePaid = s.feeStatus === 'paid';
              const isAttCleared = s.attendance >= 75 || s.condonationGranted;
              const isHallIssued = s.hallTicketStatus === 'issued';
              const isMarksheetReleased = s.marksheetStatus === 'released';

              // Generate candidate initials
              const initials = (s.name || 'Student')
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <tr key={s.rollNumber}>
                  {/* Candidate Info */}
                  <td>
                    <div className="clearance-student-cell">
                      <div className="clearance-student-avatar">{initials}</div>
                      <div>
                        <div className="clearance-student-name">{s.name}</div>
                        <div className="clearance-student-meta">
                          Roll #{s.rollNumber} · {s.course} (Div {s.division})
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Attendance Status */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontWeight: 750,
                          fontSize: '0.925rem',
                          color: s.attendance < 75 ? '#dc2626' : '#16a34a'
                        }}
                      >
                        {s.attendance}%
                      </span>
                      {s.condonationGranted ? (
                        <span className="badge badge-warning" title="Waiver granted by Admin">
                          Waiver Granted
                        </span>
                      ) : s.attendance < 75 ? (
                        <span className="badge badge-danger">
                          Defaulter &lt;75%
                        </span>
                      ) : (
                        <span className="badge badge-success">Cleared</span>
                      )}
                    </div>
                    {s.attendance < 75 && (
                      <button
                        type="button"
                        onClick={() => handleToggleCondonation(s.rollNumber)}
                        className="clearance-action-pill-btn"
                        title="Toggle medical condonation attendance waiver"
                      >
                        <Sparkles size={11} />
                        <span>{s.condonationGranted ? 'Revoke Waiver' : 'Grant Medical Waiver'}</span>
                      </button>
                    )}
                  </td>

                  {/* Fee Clearance */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isFeePaid ? (
                        <span className="badge badge-success">Paid · ₹0 Due</span>
                      ) : (
                        <span className="badge badge-danger">
                          Due: ₹{s.feeAmountDue.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFee(s.rollNumber)}
                      className={`clearance-action-pill-btn ${isFeePaid ? 'fee-unpay' : 'fee-pay'}`}
                      title={isFeePaid ? 'Mark student as having outstanding dues' : 'Clear all pending tuition fees'}
                    >
                      <CreditCard size={11} />
                      <span>{isFeePaid ? 'Mark as Unpaid' : 'Clear & Mark Paid'}</span>
                    </button>
                  </td>

                  {/* Hall Ticket Status (Segmented Switch) */}
                  <td>
                    <div className="segmented-status-toggle">
                      <button
                        type="button"
                        className={`seg-btn ${isHallIssued ? 'active-success' : ''}`}
                        onClick={() => !isHallIssued && handleToggleHallTicket(s.rollNumber)}
                        title="Authorize and issue examination hall ticket"
                      >
                        <CheckCircle2 size={12} />
                        <span>Issued</span>
                      </button>
                      <button
                        type="button"
                        className={`seg-btn ${!isHallIssued ? 'active-danger' : ''}`}
                        onClick={() => isHallIssued && handleToggleHallTicket(s.rollNumber)}
                        title="Withhold examination hall ticket"
                      >
                        <XCircle size={12} />
                        <span>Withheld</span>
                      </button>
                    </div>

                    {s.hallTicketWithheldReason && !isHallIssued && (
                      <div className="clearance-sub-hint text-danger" title={s.hallTicketWithheldReason}>
                        <AlertTriangle size={11} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.6875rem' }}>{s.hallTicketWithheldReason}</span>
                      </div>
                    )}
                  </td>

                  {/* Official Marksheet Status (Segmented Switch) */}
                  <td>
                    <div className="segmented-status-toggle">
                      <button
                        type="button"
                        className={`seg-btn ${isMarksheetReleased ? 'active-primary' : ''}`}
                        onClick={() => !isMarksheetReleased && handleToggleMarksheet(s.rollNumber)}
                        title="Publish and release official semester marksheet transcript"
                      >
                        <CheckCircle2 size={12} />
                        <span>Released</span>
                      </button>
                      <button
                        type="button"
                        className={`seg-btn ${!isMarksheetReleased ? 'active-warning' : ''}`}
                        onClick={() => isMarksheetReleased && handleToggleMarksheet(s.rollNumber)}
                        title="Withhold official semester marksheet transcript"
                      >
                        <Lock size={12} />
                        <span>Withheld</span>
                      </button>
                    </div>
                    <div className="clearance-sub-hint text-muted">
                      <span>SGPA: {s.sgpa} · CGPA: {s.cgpa}</span>
                    </div>
                  </td>

                  {/* Actions: Previews */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        className="clearance-preview-btn admit"
                        onClick={() => setPreviewStudentForHallTicket(s)}
                        title="Preview & print candidate admit card"
                      >
                        <GraduationCap size={13} />
                        <span>Admit Card</span>
                      </button>

                      <button
                        type="button"
                        className="clearance-preview-btn marksheet"
                        onClick={() => setPreviewStudentForMarksheet(s)}
                        title="Preview & print official semester marksheet transcript"
                      >
                        <Award size={13} />
                        <span>Marksheet</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Hall Ticket Preview Modal */}
      {previewStudentForHallTicket && (
        <HallTicketModal
          isOpen={Boolean(previewStudentForHallTicket)}
          onClose={() => setPreviewStudentForHallTicket(null)}
          student={previewStudentForHallTicket}
          studentInfo={{
            name: previewStudentForHallTicket.name,
            rollNumber: previewStudentForHallTicket.rollNumber,
            prn: previewStudentForHallTicket.prn || `PRN-2024098${previewStudentForHallTicket.rollNumber}`,
            program: previewStudentForHallTicket.course ? `B.Tech ${previewStudentForHallTicket.course}` : 'B.Tech Information Technology',
            semester: previewStudentForHallTicket.semester || 'Semester 6',
            division: previewStudentForHallTicket.division || 'A',
            center: 'Campus Center #04 (Examination Block A)',
            avatarUrl: previewStudentForHallTicket.avatarUrl,
            gender: previewStudentForHallTicket.gender,
            attendance: previewStudentForHallTicket.attendancePercentage || previewStudentForHallTicket.attendance,
            feeStatus: previewStudentForHallTicket.feeStatus || 'paid'
          }}
        />
      )}

      {/* Marksheet Preview Modal */}
      {previewStudentForMarksheet && (
        <MarksheetModal
          isOpen={Boolean(previewStudentForMarksheet)}
          onClose={() => setPreviewStudentForMarksheet(null)}
          student={previewStudentForMarksheet}
        />
      )}
    </div>
  );
}
