import React from 'react';
import {
  X,
  AlertTriangle,
  CreditCard,
  Percent,
  Building2,
  FileText,
  ShieldAlert,
  Phone,
  Mail,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ClearanceBlockedModal({
  isOpen,
  onClose,
  type = 'hallticket', // 'hallticket' | 'marksheet'
  studentClearance = {
    name: 'Rohan Patel',
    rollNumber: 103,
    attendance: 71.4,
    feeStatus: 'pending',
    feeAmountDue: 28500,
    hallTicketWithheldReason: 'Attendance 71.4% (< 75%) and pending tuition dues of ₹28,500.',
    marksheetWithheldReason: 'Accounts fee clearance pending (₹28,500).'
  }
}) {
  const toast = useToast();

  if (!isOpen || !studentClearance) return null;

  const isFeePending = studentClearance.feeStatus === 'pending';
  const isAttendanceShortage = studentClearance.attendance < 75 && !studentClearance.condonationGranted;

  const handleRequestReview = () => {
    onClose();
    if (toast) {
      toast.info(
        'Clearance Review Requested',
        `An expedited review request for Roll #${studentClearance.rollNumber} has been submitted to Accounts & Examination Cell.`
      );
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 140 }}>
      <div
        className="modal-content-card clearance-blocked-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '92vw',
          background: '#ffffff',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)'
        }}
      >
        {/* Modal Header Bar */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #fee2e2',
            background: '#fff5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626'
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#991b1b' }}>
                {type === 'hallticket' ? 'Hall Ticket Withheld' : 'Marksheet Withheld'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#b91c1c' }}>
                Institutional Clearance Required · Roll #{studentClearance.rollNumber}
              </span>
            </div>
          </div>

          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', maxHeight: '72vh', overflowY: 'auto' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>
            Your official{' '}
            <strong>{type === 'hallticket' ? 'Examination Admit Card (Hall Ticket)' : 'Semester Marksheet Transcript'}</strong>{' '}
            cannot be generated at this time because institutional clearance criteria have not been satisfied.
          </p>

          {/* Clearance Checklist Status Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {/* 1. Fee Clearance Status */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                border: isFeePending ? '1.5px solid #fecaca' : '1px solid #bbf7d0',
                background: isFeePending ? '#fef2f2' : '#f0fdf4',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CreditCard size={18} color={isFeePending ? '#dc2626' : '#16a34a'} style={{ marginTop: 2 }} />
                <div>
                  <strong style={{ fontSize: '0.85rem', color: isFeePending ? '#991b1b' : '#166534', display: 'block' }}>
                    Tuition & Laboratory Fee Clearance
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: isFeePending ? '#b91c1c' : '#15803d' }}>
                    {isFeePending
                      ? `Outstanding Dues: ₹${studentClearance.feeAmountDue.toLocaleString()} (Pending Payment)`
                      : 'Fee Cleared in Full · Zero Outstanding Dues'}
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: isFeePending ? '#fee2e2' : '#dcfce7',
                  color: isFeePending ? '#991b1b' : '#15803d'
                }}
              >
                {isFeePending ? 'Pending' : 'Cleared'}
              </span>
            </div>

            {/* 2. Attendance Threshold Status */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                border: isAttendanceShortage ? '1.5px solid #fecaca' : '1px solid #bbf7d0',
                background: isAttendanceShortage ? '#fef2f2' : '#f0fdf4',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Percent size={18} color={isAttendanceShortage ? '#dc2626' : '#16a34a'} style={{ marginTop: 2 }} />
                <div>
                  <strong style={{ fontSize: '0.85rem', color: isAttendanceShortage ? '#991b1b' : '#166534', display: 'block' }}>
                    Mandatory 75% Attendance Regulation
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: isAttendanceShortage ? '#b91c1c' : '#15803d' }}>
                    {isAttendanceShortage
                      ? `Current: ${studentClearance.attendance}% (Shortage: ${(75 - studentClearance.attendance).toFixed(1)}% below minimum requirement)`
                      : `Current: ${studentClearance.attendance}% · Attendance Cleared`}
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: isAttendanceShortage ? '#fee2e2' : '#dcfce7',
                  color: isAttendanceShortage ? '#991b1b' : '#15803d'
                }}
              >
                {isAttendanceShortage ? 'Defaulter' : 'Cleared'}
              </span>
            </div>
          </div>

          {/* Action Instructions */}
          <div
            style={{
              padding: '14px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.8rem',
              color: '#475569',
              lineHeight: 1.5,
              marginBottom: '20px'
            }}
          >
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              How to Obtain Clearance:
            </strong>
            {isFeePending && (
              <div style={{ marginBottom: 4 }}>
                1. <strong>Accounts Office (Counter #2)</strong>: Clear semester dues via online portal or physical demand draft to receive instant digital clearance.
              </div>
            )}
            {isAttendanceShortage && (
              <div>
                2. <strong>HOD / Academic Proctor</strong>: Submit documented medical leaves (Form SOP-ACAD-03) or university duty certificates to request an authorized condonation waiver.
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary btn-sm" onClick={onClose}>
              Dismiss
            </button>
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={handleRequestReview}
            >
              Request Admin Condonation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
