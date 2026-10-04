import React, { useState } from 'react';
import {
  ShieldCheck,
  Copy,
  Check,
  Printer,
  X,
  KeyRound,
  User,
  Mail,
  Building2,
  Lock,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function CredentialsSlipModal({
  isOpen,
  onClose,
  credentials = null
}) {
  const [copiedField, setCopiedField] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen || !credentials) return null;

  const handleCopyText = (text, fieldKey) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    const text = `🎓 EduTrack Campus Portal - Official Login Credentials
--------------------------------------------------
Account Name: ${credentials.name}
Assigned Role: ${credentials.role ? credentials.role.toUpperCase() : 'USER'}
Login ID / PRN: ${credentials.loginId}
Registered Email: ${credentials.email}
Temporary Password: ${credentials.password}
Portal URL: http://localhost:5173/

⚠️ Note: Please log in and change your password in Profile Settings upon initial access.
--------------------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handlePrintSlip = () => {
    const printWindow = window.open('', '_blank', 'width=750,height=800');
    if (!printWindow) {
      alert('Please allow popups to print credential slip.');
      return;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EduTrack Official Login Credentials - ${credentials.loginId}</title>
  <style>
    @page { size: A5 landscape; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      color: #0f172a;
      background: #ffffff;
    }
    .slip-container {
      border: 2px solid #0f172a;
      border-radius: 12px;
      padding: 24px;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .logo-box {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
      background: #0f172a;
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 18px;
    }
    .inst-name {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0f172a;
    }
    .inst-sub {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .slip-badge {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      color: #334155;
    }
    .title-banner {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title-banner h3 { margin: 0; font-size: 14px; font-weight: 700; color: #0f172a; }
    .title-banner span { font-size: 12px; color: #64748b; }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .field-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 14px;
      border-radius: 8px;
    }
    .field-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .field-val {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      word-break: break-all;
    }
    .cred-card {
      background: #0f172a;
      color: #ffffff;
      padding: 14px 18px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cred-item { display: flex; flex-direction: column; gap: 4px; }
    .cred-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; }
    .cred-val { font-size: 16px; font-weight: 800; font-family: monospace; letter-spacing: 1px; color: #38bdf8; }
    .footer-rules {
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
      border-top: 1px dashed #cbd5e1;
      padding-top: 14px;
    }
    .sign-row {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding-top: 20px;
    }
    .sign-box {
      text-align: center;
      width: 180px;
      border-top: 1px solid #94a3b8;
      padding-top: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="slip-container">
    <div class="header">
      <div class="logo-box">
        <div class="logo-icon">ET</div>
        <div>
          <div class="inst-name">EduTrack Institutional Portal</div>
          <div class="inst-sub">Central Access & Identity Management System</div>
        </div>
      </div>
      <div class="slip-badge">OFFICIAL CREDENTIAL CONFIDENTIAL SLIP</div>
    </div>

    <div class="title-banner">
      <h3>Role: ${credentials.role ? credentials.role.toUpperCase() : 'USER'} ACCOUNT ACTIVATED</h3>
      <span>Date: ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
    </div>

    <div class="grid">
      <div class="field-card">
        <div class="field-label">Account Holder</div>
        <div class="field-val">${credentials.name}</div>
      </div>
      <div class="field-card">
        <div class="field-label">Department / Cohort</div>
        <div class="field-val">${credentials.department || 'Information Technology'}</div>
      </div>
      <div class="field-card">
        <div class="field-label">Primary Email</div>
        <div class="field-val">${credentials.email}</div>
      </div>
      <div class="field-card">
        <div class="field-label">Account Status</div>
        <div class="field-val" style="color: #16a34a;">● Active & Enrolled</div>
      </div>
    </div>

    <div class="cred-card">
      <div class="cred-item">
        <span class="cred-label">Login Identifier (PRN / Staff ID)</span>
        <span class="cred-val">${credentials.loginId}</span>
      </div>
      <div class="cred-item">
        <span class="cred-label">Initial Temporary Password</span>
        <span class="cred-val" style="color: #fbbf24;">${credentials.password}</span>
      </div>
    </div>

    <div class="footer-rules">
      <strong>Security Notice:</strong> This document contains private authentication credentials. You are required to log into <em>http://localhost:5173/</em> and navigate to <strong>Profile Settings → Security & Password</strong> to submit a password update request upon initial sign-in.
    </div>

    <div class="sign-row">
      <div class="sign-box">Student / Faculty Signature</div>
      <div class="sign-box">Systems Administrator & Registrar</div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 250);
    }
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}
            >
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                Account Credentials Generated
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                Ready for role-based portal login & identity authorization
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* User Profile Mini Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                {credentials.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {credentials.department || 'Information Technology'} · {credentials.email}
              </div>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: credentials.role === 'teacher' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                color: credentials.role === 'teacher' ? '#d8b4fe' : '#93c5fd',
                border: credentials.role === 'teacher' ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              {credentials.role || 'Student'}
            </span>
          </div>

          {/* Credentials Display Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Login ID / PRN */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '10px',
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  {credentials.role === 'teacher' ? 'Staff Login ID' : 'Student PRN / ID'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(credentials.loginId, 'loginId')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedField === 'loginId' ? '#4ade80' : '#38bdf8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem'
                  }}
                >
                  {copiedField === 'loginId' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedField === 'loginId' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
                {credentials.loginId}
              </div>
            </div>

            {/* Generated Password */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                borderRadius: '10px',
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Initial Password
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(credentials.password, 'password')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedField === 'password' ? '#4ade80' : '#fbbf24',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem'
                  }}
                >
                  {copiedField === 'password' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedField === 'password' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>
                {credentials.password}
              </div>
            </div>
          </div>

          {/* Workflow Note */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(30, 41, 59, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '0.78rem',
              color: '#94a3b8',
              lineHeight: 1.5
            }}
          >
            <strong style={{ color: '#e2e8f0' }}>Login & Password Change Protocol:</strong> The user can immediately sign in with this Login ID or registered Email. If they wish to change their password later, they can submit a request in <span style={{ color: '#38bdf8' }}>Profile Settings</span>, which will be routed to Admin for one-click approval.
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.8)'
          }}
        >
          <button
            type="button"
            onClick={handlePrintSlip}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Printer size={15} />
            <span>Print Official Slip</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleCopyAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: copiedAll ? '#16a34a' : 'rgba(56, 189, 248, 0.15)',
                border: copiedAll ? '1px solid #22c55e' : '1px solid rgba(56, 189, 248, 0.3)',
                color: copiedAll ? '#ffffff' : '#38bdf8',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {copiedAll ? <Check size={15} /> : <Copy size={15} />}
              <span>{copiedAll ? 'Credentials Copied!' : 'Copy All'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                background: '#3b82f6',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
