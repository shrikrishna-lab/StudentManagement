import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Eye,
  EyeOff,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  AlertTriangle,
  Lock,
  KeyRound,
  FileText,
  Calendar,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import {
  getPasswordChangeRequests,
  approvePasswordChangeRequest,
  rejectPasswordChangeRequest,
  clearCompletedRequests,
  getAllRegisteredCredentials
} from '../../lib/authCredentialsService';
import { useToast } from '../../context/ToastContext';

export default function AdminSecurityApprovals() {
  const { toast } = useToast?.() || {};

  const [requests, setRequests] = useState(getPasswordChangeRequests);
  const [totalCredentials, setTotalCredentials] = useState(0);
  const [statusFilter, setStatusFilter] = useState('Pending'); // 'Pending', 'Approved', 'Rejected', 'All'
  const [roleFilter, setRoleFilter] = useState('All'); // 'All', 'student', 'teacher'
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState({});

  // Reject modal state
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const refreshRequests = async (showToast = false) => {
    let loaded = false;
    try {
      const res = await fetch('http://localhost:5000/api/security/requests');
      if (res.ok) {
        const dbList = await res.json();
        if (Array.isArray(dbList) && dbList.length > 0) {
          setRequests(dbList);
          setTotalCredentials(getAllRegisteredCredentials().length);
          loaded = true;
          if (showToast && toast?.info) {
            toast.info('Approvals Refreshed', `Synchronized ${dbList.length} security requests from MySQL.`);
          }
        }
      }
    } catch (e) {}

    if (!loaded) {
      const list = getPasswordChangeRequests();
      setRequests(list);
      setTotalCredentials(getAllRegisteredCredentials().length);
      if (showToast && toast?.info) {
        toast.info('Approvals Refreshed', `Synchronized ${list.length} security requests.`);
      }
    }
  };

  useEffect(() => {
    refreshRequests(false);

    const handleReqUpdate = () => {
      refreshRequests(false);
    };

    window.addEventListener('edutrack_password_requests_updated', handleReqUpdate);
    window.addEventListener('edutrack_realtime_event', (e) => {
      if (e.detail && typeof e.detail.event === 'string' && e.detail.event.startsWith('SECURITY_REQUEST_')) {
        refreshRequests(false);
      }
    });

    return () => {
      window.removeEventListener('edutrack_password_requests_updated', handleReqUpdate);
    };
  }, []);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Status filter
      if (statusFilter !== 'All' && (r.status || '').toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      // Role filter
      if (roleFilter !== 'All' && (r.role || '').toLowerCase() !== roleFilter.toLowerCase()) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (r.userName || '').toLowerCase().includes(q);
        const loginMatch = (r.loginId || '').toLowerCase().includes(q);
        const emailMatch = (r.email || '').toLowerCase().includes(q);
        const deptMatch = (r.department || '').toLowerCase().includes(q);
        if (!nameMatch && !loginMatch && !emailMatch && !deptMatch) {
          return false;
        }
      }
      return true;
    });
  }, [requests, statusFilter, roleFilter, searchQuery]);

  // Statistics
  const kpis = useMemo(() => {
    const pending = requests.filter((r) => (r.status || '').toLowerCase() === 'pending').length;
    const approved = requests.filter((r) => (r.status || '').toLowerCase() === 'approved').length;
    const rejected = requests.filter((r) => (r.status || '').toLowerCase() === 'rejected').length;
    return { pending, approved, rejected, total: requests.length };
  }, [requests]);

  const handleApprove = async (req) => {
    // Optimistic UI update
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'Approved', reviewedAt: new Date().toISOString() } : r))
    );

    // Call backend API
    try {
      await fetch(`http://localhost:5000/api/security/requests/${req.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminName: 'System Administrator' })
      });
    } catch (e) {}

    const res = approvePasswordChangeRequest(req.id, 'System Administrator');
    refreshRequests(false);
    toast?.success(
      'Credentials Approved',
      `New password committed to MySQL for ${req.userName} (${req.loginId}). User can now log in with the new credentials.`
    );
  };

  const handleConfirmReject = async () => {
    if (!rejectingRequest) return;
    const reasonText = rejectReason.trim() || 'Request rejected by Security Administrator.';
    const req = rejectingRequest;

    // Optimistic update
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'Rejected', adminNotes: reasonText } : r))
    );
    setRejectingRequest(null);
    setRejectReason('');

    try {
      await fetch(`http://localhost:5000/api/security/requests/${req.id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminName: 'System Administrator', rejectionReason: reasonText })
      });
    } catch (e) {}

    rejectPasswordChangeRequest(req.id, 'System Administrator', reasonText);
    refreshRequests(false);
    toast?.warning(
      'Request Rejected',
      `Password change for ${req.userName} (${req.loginId}) was declined in MySQL audit records.`
    );
  };

  const toggleReveal = (reqId) => {
    setRevealedPasswords((prev) => ({ ...prev, [reqId]: !prev[reqId] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626'
              }}
            >
              <ShieldAlert size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Security & Credential Approvals
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Review, verify, and approve password change requests submitted by faculty and students.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={refreshRequests}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* High-Contrast KPI Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '20px'
          }}
        >
          {/* Pending Approvals */}
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '16px',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Approvals
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
              {kpis.pending}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '2px' }}>Awaiting admin action</div>
          </div>

          {/* Approved Requests */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '16px'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Approved Requests
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
              {kpis.approved}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '2px' }}>Credentials updated</div>
          </div>

          {/* Total Active Accounts */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Active Accounts
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              {totalCredentials}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Students & Faculty</div>
          </div>

          {/* Rejected Requests */}
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Rejected Requests
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
              {kpis.rejected}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#991b1b', marginTop: '2px' }}>Denied for security reasons</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by student/teacher name, PRN, Staff ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#0f172a',
              fontSize: '0.85rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Status Segmented Tabs */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', gap: '3px' }}>
            {['Pending', 'Approved', 'Rejected', 'All'].map((s) => {
              const count = s === 'All' ? requests.length : requests.filter((r) => r.status === s).length;
              const isActive = statusFilter === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    background: isActive ? '#2563eb' : 'transparent',
                    color: isActive ? '#ffffff' : '#64748b',
                    boxShadow: isActive ? '0 1px 3px rgba(37, 99, 235, 0.3)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {s} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Roles</option>
            <option value="student">Students Only</option>
            <option value="teacher">Faculty Only</option>
          </select>
        </div>
      </div>

      {/* Requests Ledger Table Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 18px', fontWeight: 650, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Requester Details
                </th>
                <th style={{ padding: '12px 18px', fontWeight: 650, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Login ID & Role
                </th>
                <th style={{ padding: '12px 18px', fontWeight: 650, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Requested Password
                </th>
                <th style={{ padding: '12px 18px', fontWeight: 650, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  User Reason
                </th>
                <th style={{ padding: '12px 18px', fontWeight: 650, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Status
                </th>
                <th style={{ padding: '12px 18px', fontWeight: 650, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                  Admin Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8' }}>
                    <ShieldCheck size={36} style={{ margin: '0 auto 8px auto', opacity: 0.5, color: '#10b981' }} />
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                      No {statusFilter === 'All' ? '' : statusFilter.toLowerCase()} password requests found
                    </div>
                    <div style={{ fontSize: '0.8rem', marginTop: '4px', color: '#64748b' }}>
                      Users who request password changes in their profile settings will show up here for verification.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isRevealed = Boolean(revealedPasswords[req.id]);
                  return (
                    <tr
                      key={req.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: req.status === 'Pending' ? '#fffdf7' : '#ffffff',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{req.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          {req.email}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '2px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            Dept: {req.department || 'IT'}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#2563eb', fontSize: '0.85rem' }}>
                          {req.loginId}
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: req.role === 'teacher' ? '#f3e8ff' : '#eff6ff',
                            color: req.role === 'teacher' ? '#7e22ce' : '#1d4ed8'
                          }}
                        >
                          {req.role}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem', fontWeight: 650, color: '#0f172a' }}>
                            {isRevealed ? req.requestedNewPassword : '••••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleReveal(req.id)}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #e2e8f0',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '3px 6px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title={isRevealed ? 'Hide Password' : 'Show Password for Verification'}
                          >
                            {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                          Requested: {new Date(req.requestedAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', maxWidth: '280px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                          "{req.reason}"
                        </div>
                        {req.adminNotes && (
                          <div style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '4px', fontWeight: 600 }}>
                            Admin note: {req.adminNotes}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            background:
                              req.status === 'Approved'
                                ? '#dcfce7'
                                : req.status === 'Rejected'
                                ? '#fee2e2'
                                : '#fef3c7',
                            color:
                              req.status === 'Approved'
                                ? '#15803d'
                                : req.status === 'Rejected'
                                ? '#b91c1c'
                                : '#b45309',
                            border:
                              req.status === 'Approved'
                                ? '1px solid #bbf7d0'
                                : req.status === 'Rejected'
                                ? '1px solid #fecaca'
                                : '1px solid #fde68a'
                          }}
                        >
                          {req.status === 'Approved' && <Check size={12} />}
                          {req.status === 'Rejected' && <X size={12} />}
                          {req.status === 'Pending' && <Clock size={12} />}
                          <span>{req.status}</span>
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        {req.status === 'Pending' ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleApprove(req)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: '#10b981',
                                border: 'none',
                                color: '#ffffff',
                                borderRadius: '8px',
                                padding: '6px 14px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(16, 185, 129, 0.25)',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Check size={13} />
                              <span>Approve</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRejectingRequest(req)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: '#fee2e2',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '0.78rem',
                                fontWeight: 650,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <X size={13} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                            Processed by Admin
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

        {/* Clear Completed History footer */}
        {requests.some((r) => r.status !== 'Pending') && (
          <div
            style={{
              padding: '12px 18px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Showing {filteredRequests.length} of {requests.length} total verification records.
            </span>
            <button
              type="button"
              onClick={() => {
                clearCompletedRequests();
                refreshRequests();
                toast?.info('History Cleared', 'Pruned approved/rejected entries from queue.');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Trash2 size={13} />
              <span>Clear Resolved Records</span>
            </button>
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      {rejectingRequest && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setRejectingRequest(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626', marginBottom: '12px' }}>
              <AlertTriangle size={20} />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Reject Credential Request
              </h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              You are declining the password change request for <strong>{rejectingRequest.userName}</strong> ({rejectingRequest.loginId}).
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Reason for Rejection (Displayed to user)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Identity verification failed. Please contact the IT Administration desk."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectingRequest(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#dc2626',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(220, 38, 38, 0.3)'
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
