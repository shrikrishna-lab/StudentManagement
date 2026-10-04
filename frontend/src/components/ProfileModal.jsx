import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Mail,
  Phone,
  MapPin,
  Building2,
  Bell,
  ShieldCheck,
  User,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  Users,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  RotateCcw,
  Briefcase,
  KeyRound,
  Lock,
  AlertCircle,
  Clock
} from 'lucide-react';
import {
  submitPasswordChangeRequest,
  getPasswordChangeRequests
} from '../lib/authCredentialsService';
import {
  AVATAR_OPTIONS,
  PRESET_STUDENT_PERSONAS,
  PRESET_FACULTY_PERSONAS,
  getStoredStudentProfile,
  saveStoredStudentProfile,
  getStoredFacultyProfile,
  saveStoredFacultyProfile
} from '../lib/studentProfiles';
import VirtualIDCard from './common/VirtualIDCard';
import { useToast } from '../context/ToastContext';

export default function ProfileModal({
  isOpen,
  onClose,
  currentRole = 'student',
  currentUser,
  onSaveProfile,
  initialTab = 'profile'
}) {
  const { toast } = useToast?.() || {};

  const [activeTab, setActiveTab] = useState(initialTab || 'profile'); // 'profile', 'id_card', 'edit'
  const [activePersonaId, setActivePersonaId] = useState('krrish');
  const [activeFacultyId, setActiveFacultyId] = useState('faculty_krrish');

  const [formData, setFormData] = useState(() => {
    if (currentRole === 'teacher') {
      const stored = getStoredFacultyProfile(currentUser);
      return {
        ...stored,
        name: currentUser?.name || stored.name || 'Prof. Krrish Sharma',
        email: currentUser?.email || stored.email || 'krrish.sharma@edutrack.edu',
        department: currentUser?.department || stored.department || 'Information Technology',
        course: currentUser?.department || stored.department || 'Information Technology',
        designation: currentUser?.designation || stored.designation || 'Associate Professor & Class Teacher',
        staffId: currentUser?.id || stored.staffId || 'FAC-IT-101',
        prn: currentUser?.id || stored.prn || 'FAC-IT-101',
        avatarUrl: currentUser?.avatarUrl || stored.avatarUrl || '/assets/student_avatar.jpg',
        notifications: true,
        securityAlerts: true
      };
    }
    const stored = getStoredStudentProfile();
    return {
      name: stored.name || 'Krrish Sharma',
      gender: stored.gender || 'Male',
      email: stored.email || 'krrish.sharma@edutrack.edu',
      phone: stored.phone || '+91 98765 43210',
      location: stored.location || 'Division A, Classroom 302',
      rollNumber: stored.rollNumber || 101,
      prn: stored.prn || 'PRN-2024098101',
      course: stored.course || 'IT',
      programFull: stored.programFull || 'B.Tech in Information Technology',
      division: stored.division || 'A',
      year: stored.year || 3,
      semester: stored.semester || 'Semester 6',
      cgpa: stored.cgpa || 8.82,
      standing: stored.standing || 'First Class with Distinction',
      avatarUrl: stored.avatarUrl || '/assets/student_avatar.jpg',
      attendancePercentage: stored.attendancePercentage || 89.5,
      feeStatus: stored.feeStatus || 'paid',
      bloodGroup: stored.bloodGroup || 'O+',
      notifications: true,
      securityAlerts: true
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  // Sync state whenever modal is opened or role changes
  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      if (currentRole === 'student') {
        const stored = getStoredStudentProfile();
        setFormData((prev) => {
          const { designation, staffId, specialization, teachingLoad, ...restPrev } = prev;
          return {
            ...restPrev,
            ...stored,
            designation: undefined,
            staffId: undefined,
            specialization: undefined,
            teachingLoad: undefined,
            notifications: prev.notifications ?? true,
            securityAlerts: prev.securityAlerts ?? true
          };
        });
        const matched = PRESET_STUDENT_PERSONAS.find((p) => p.rollNumber === stored.rollNumber);
        if (matched) {
          setActivePersonaId(matched.id);
        }
      } else if (currentRole === 'teacher') {
        const stored = getStoredFacultyProfile(currentUser);
        setFormData((prev) => ({
          ...prev,
          ...stored,
          name: currentUser?.name || stored.name || 'Prof. Krrish Sharma',
          email: currentUser?.email || stored.email || 'krrish.sharma@edutrack.edu',
          department: currentUser?.department || stored.department || 'Information Technology',
          course: currentUser?.department || stored.department || 'Information Technology',
          designation: currentUser?.designation || stored.designation || 'Associate Professor & Class Teacher',
          staffId: currentUser?.id || stored.staffId || 'FAC-IT-101',
          prn: currentUser?.id || stored.prn || 'FAC-IT-101',
          avatarUrl: currentUser?.avatarUrl || stored.avatarUrl || '/assets/student_avatar.jpg',
          notifications: prev.notifications ?? true,
          securityAlerts: prev.securityAlerts ?? true
        }));
        setActiveFacultyId('faculty_krrish');
      } else if (currentRole === 'admin') {
        setFormData({
          name: 'System Administrator',
          gender: 'Male',
          email: 'admin@edutrack.edu',
          phone: '+91 98765 43210',
          location: 'Central IT Server Complex, Room 101',
          rollNumber: null,
          prn: 'ADM-SYS-2026',
          course: 'Institutional Operations',
          programFull: 'University Examination & Academic Controller',
          division: 'Admin Cell',
          year: null,
          semester: 'Session 2026–2027',
          cgpa: null,
          standing: 'Root Administrative Access',
          avatarUrl: '/assets/student_avatar.jpg',
          attendancePercentage: null,
          feeStatus: 'exempt',
          bloodGroup: 'O+',
          notifications: true,
          securityAlerts: true
        });
      }
    }
  }, [isOpen, currentRole, initialTab]);

  const isStudent = currentRole === 'student';
  const isTeacher = currentRole === 'teacher';
  const isAdmin = currentRole === 'admin';

  // Handle switching preset student persona (Krrish vs Ananya vs Sneha vs Rohan)
  const handleSelectStudentPersona = (persona) => {
    setActivePersonaId(persona.id);
    const updated = {
      name: persona.name,
      gender: persona.gender,
      email: persona.email,
      phone: persona.phone,
      location: persona.location,
      rollNumber: persona.rollNumber,
      prn: persona.prn,
      course: persona.course,
      programFull: persona.programFull,
      division: persona.division,
      year: persona.year,
      semester: persona.semester,
      cgpa: persona.cgpa,
      standing: persona.standing,
      avatarUrl: persona.avatarUrl,
      attendancePercentage: persona.attendancePercentage,
      feeStatus: persona.feeStatus,
      bloodGroup: persona.gender === 'Female' ? 'A+' : 'O+',
      notifications: formData.notifications ?? true,
      securityAlerts: formData.securityAlerts ?? true
    };
    setFormData(updated);
    saveStoredStudentProfile(updated);
    if (onSaveProfile) {
      onSaveProfile(updated);
    }
    if (toast?.success) {
      toast.success(`Switched active profile to ${persona.name} (${persona.gender})`);
    }
  };

  // Handle switching preset faculty persona (Prof. Krrish vs Prof. Anjali vs Dr. Vivek)
  const handleSelectFacultyPersona = (faculty) => {
    setActiveFacultyId(faculty.id);
    const updated = {
      ...formData,
      name: faculty.name,
      gender: faculty.gender,
      email: faculty.email,
      phone: faculty.phone,
      location: faculty.location,
      rollNumber: null,
      prn: faculty.prn,
      staffId: faculty.staffId,
      department: faculty.department,
      course: faculty.department,
      designation: faculty.designation,
      standing: faculty.standing,
      specialization: faculty.specialization,
      avatarUrl: faculty.avatarUrl,
      teachingLoad: faculty.teachingLoad,
      semester: faculty.semester,
      bloodGroup: faculty.bloodGroup
    };
    setFormData(updated);
    saveStoredFacultyProfile(updated);
    if (onSaveProfile) {
      onSaveProfile(updated);
    }
    if (toast?.success) {
      toast.success(`Active faculty set to ${faculty.name} (${faculty.gender}, ${faculty.department})`);
    }
  };

  // Handle direct avatar selection from 3D library
  const handleSelectAvatar = (avatar) => {
    const updated = {
      ...formData,
      avatarUrl: avatar.url,
      gender: avatar.gender || formData.gender
    };
    setFormData(updated);
    if (isTeacher) {
      saveStoredFacultyProfile(updated);
    } else {
      saveStoredStudentProfile(updated);
    }
    if (onSaveProfile) {
      onSaveProfile(updated);
    }
  };

  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    if (isTeacher) {
      saveStoredFacultyProfile(formData);
    } else {
      saveStoredStudentProfile(formData);
    }
    if (onSaveProfile) {
      onSaveProfile(formData);
    }
    if (toast?.success) {
      toast.success('Profile credentials updated successfully!');
    }
    setTimeout(() => {
      setIsSaved(false);
      setActiveTab('profile');
    }, 600);
  };

  // Security & Password Change States
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordReason, setPasswordReason] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ error: '', success: '' });
  const [isSubmittingPass, setIsSubmittingPass] = useState(false);
  const [pendingUserRequest, setPendingUserRequest] = useState(null);

  // Check for pending request on mount or tab change
  const refreshUserRequests = () => {
    const allReqs = getPasswordChangeRequests();
    const myReq = allReqs.find(
      (r) =>
        (r.loginId && (r.loginId === formData.prn || r.loginId === formData.staffId || r.loginId === formData.rollNumber)) ||
        (r.email && r.email.toLowerCase() === formData.email?.toLowerCase())
    );
    setPendingUserRequest(myReq || null);
  };

  useEffect(() => {
    if (isOpen) {
      refreshUserRequests();
    }
  }, [isOpen, formData.email, formData.prn]);

  const handleRequestPasswordChange = (e) => {
    e.preventDefault();
    setPasswordFeedback({ error: '', success: '' });

    if (!currentPasswordInput) {
      setPasswordFeedback({ error: 'Please enter your current password.', success: '' });
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordFeedback({ error: 'New password must be at least 6 characters long.', success: '' });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordFeedback({ error: 'New password and confirmation do not match.', success: '' });
      return;
    }

    setIsSubmittingPass(true);

    setTimeout(() => {
      const res = submitPasswordChangeRequest({
        user: {
          id: isTeacher ? (formData.staffId || 'usr_teacher_101') : (formData.rollNumber ? `usr_student_${formData.rollNumber}` : 'usr_student_101'),
          loginId: formData.prn || formData.staffId || (isTeacher ? 'FAC-IT-101' : 'RBT24IT001'),
          email: formData.email,
          name: formData.name,
          role: currentRole,
          department: formData.course || formData.department || 'Information Technology'
        },
        currentPassword: currentPasswordInput,
        newPassword: newPasswordInput,
        reason: passwordReason.trim() || 'User requested password rotation in settings.'
      });

      setIsSubmittingPass(false);

      if (res.success) {
        setPasswordFeedback({ error: '', success: res.message });
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        setPasswordReason('');
        refreshUserRequests();
        toast?.success('Request Submitted', 'Password change request sent to Administrator for review.');
      } else {
        setPasswordFeedback({ error: res.message, success: '' });
      }
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Scrollable Modal Body Container */}
        <div className="profile-modal-body-scroll">
          {/* Top Cover Banner */}
          <div className="profile-modal-sky-cover">
            <div className="profile-modal-cover-brand">
              <GraduationCap size={18} className="profile-modal-brand-icon" />
              <span className="profile-modal-brand-text">
                {isTeacher
                  ? 'EduTrack Faculty & Staff Dossier'
                  : isAdmin
                  ? 'EduTrack Institutional Administrator'
                  : 'EduTrack Institutional Student Profile'}
              </span>
            </div>

            <button
              type="button"
              className="profile-modal-close-pill"
              onClick={onClose}
              aria-label="Close Profile Modal"
              title="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Hero Avatar & Identity Section */}
          <div className="profile-modal-header-hero">
          <div className="profile-modal-avatar-wrapper">
            <div className="profile-modal-avatar-ring">
              <img
                src={formData.avatarUrl || '/assets/student_avatar.jpg'}
                alt={formData.name}
                className="profile-modal-avatar-img"
              />
              <span className="profile-avatar-status-dot" title="Active on EduTrack Portal" />
            </div>

            <div className="profile-role-tag-cluster">
              <span className="profile-role-tag">
                {isStudent
                  ? formData.gender === 'Female'
                    ? '👩‍🎓 Female Student'
                    : '👨‍🎓 Male Student'
                  : isTeacher
                  ? formData.gender === 'Female'
                    ? '👩‍🏫 Faculty Member'
                    : '👨‍🏫 Faculty Member'
                  : '🛡️ University Administrator'}
              </span>
              {(isTeacher ? formData.designation : formData.standing) && (
                <span className="profile-standing-badge">
                  <Award size={12} style={{ marginRight: '4px' }} />
                  {isTeacher ? formData.designation : formData.standing}
                </span>
              )}
            </div>
          </div>

          {/* Identity Title */}
          <div className="profile-modal-identity">
            <div className="profile-modal-name-row">
              <h2 className="profile-modal-name">{formData.name}</h2>
              <div className="profile-verified-badge" title="Identity Verified & Active">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="profile-modal-email">{formData.email}</div>
          </div>
        </div>

        {/* Modal Segmented Navigation Bar */}
        <div className="profile-nav-pills-bar">
          <button
            type="button"
            className={`profile-nav-pill ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <Eye size={13} />
            <span>{isTeacher ? 'Dossier' : 'Overview'}</span>
          </button>

          <button
            type="button"
            className={`profile-nav-pill profile-nav-pill--badge ${activeTab === 'id_card' ? 'active' : ''}`}
            onClick={() => setActiveTab('id_card')}
          >
            <CreditCard size={13} />
            <span>Smart ID</span>
            <span className="id-card-new-pill">SMART</span>
          </button>

          <button
            type="button"
            className={`profile-nav-pill profile-nav-pill--badge ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('security');
              refreshUserRequests();
            }}
          >
            <KeyRound size={13} />
            <span>Security</span>
            {pendingUserRequest && pendingUserRequest.status === 'Pending' && (
              <span className="nav-pill-pending-dot" title="Password change pending" />
            )}
          </button>

          <button
            type="button"
            className={`profile-nav-pill ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <Edit3 size={13} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & CREDENTIALS */}
        {activeTab === 'profile' && (
          <div className="profile-tab-content-area">
            {/* Student Persona Quick Switcher */}
            {isStudent && (
              <div className="persona-switcher-box">
                <div className="persona-switcher-label">
                  <Users size={13} style={{ marginRight: '5px' }} />
                  <span>Switch Active Student Candidate:</span>
                </div>
                <div className="persona-pills-row">
                  {PRESET_STUDENT_PERSONAS.map((p) => {
                    const isActive = activePersonaId === p.id || formData.rollNumber === p.rollNumber;
                    const isFemale = p.gender === 'Female';
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`persona-pill-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleSelectStudentPersona(p)}
                        title={`Switch to ${p.name} (${p.gender}, Roll #${p.rollNumber}, ${p.course})`}
                      >
                        <span className="persona-pill-gender-emoji">{isFemale ? '👩‍🎓' : '👨‍🎓'}</span>
                        <span className="persona-pill-name">{p.name.split(' ')[0]}</span>
                        <span className="persona-pill-tag">
                          #{p.rollNumber} {isFemale ? '· F' : '· M'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3D Avatar Library Picker */}
            <div className="avatar-picker-section">
              <div className="avatar-picker-title">
                <Sparkles size={13} style={{ color: '#059669', marginRight: '5px' }} />
                <span>Choose 3D Academic Avatar (Male & Female Styles):</span>
              </div>
              <div className="avatar-picker-grid">
                {AVATAR_OPTIONS.map((av) => {
                  const isSelected = formData.avatarUrl === av.url;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      className={`avatar-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectAvatar(av)}
                      title={`Select ${av.label}`}
                    >
                      <div className="avatar-option-thumb-ring">
                        <img src={av.url} alt={av.label} className="avatar-option-img" />
                        {isSelected && (
                          <div className="avatar-check-badge">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <span className="avatar-option-label">{av.label.split('·')[0].trim()}</span>
                      <span className="avatar-option-sub">{av.gender}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 Academic or Faculty Key Metrics */}
            <div className="profile-metrics-strip">
              <div className="profile-metric-col">
                <span className="profile-metric-title">
                  {isStudent ? 'Roll Number & Div' : 'Staff Code'}
                </span>
                <strong className="profile-metric-val">
                  {isStudent ? `#${formData.rollNumber} (${formData.division})` : formData.prn || 'FAC-101'}
                </strong>
              </div>
              <div className="profile-metric-col">
                <span className="profile-metric-title">
                  {isStudent ? 'Degree / Program' : 'Department'}
                </span>
                <strong className="profile-metric-val">{formData.course || formData.department || 'IT'}</strong>
              </div>
              <div className="profile-metric-col">
                <span className="profile-metric-title">
                  {isStudent ? 'Academic Term' : 'Academic Designation'}
                </span>
                <strong className="profile-metric-val">
                  {isStudent ? formData.semester : formData.designation || 'Associate Professor'}
                </strong>
              </div>
              <div className="profile-metric-col">
                <span className="profile-metric-title">
                  {isStudent ? 'SGPA / CGPA' : 'Teaching / Load'}
                </span>
                <strong className="profile-metric-val" style={{ color: '#059669' }}>
                  {isStudent
                    ? formData.cgpa ? `${formData.cgpa} / 10.0` : '8.82 / 10.0'
                    : formData.teachingLoad || '3 Subjects'}
                </strong>
              </div>
            </div>

            {/* Additional Faculty Spec Box */}
            {isTeacher && formData.specialization && (
              <div className="profile-faculty-spec-box">
                <div className="profile-faculty-spec-title">
                  <BookOpen size={14} style={{ color: '#059669', marginRight: '6px' }} />
                  <span>Instructional Focus & Research Specialization:</span>
                </div>
                <div className="profile-faculty-spec-desc">{formData.specialization}</div>
                <div className="profile-faculty-office-row">
                  <MapPin size={13} style={{ color: '#64748b' }} />
                  <span>Office: {formData.location || 'Faculty Cabin 402, Block B'}</span>
                  <span style={{ margin: '0 6px', color: '#cbd5e1' }}>•</span>
                  <Phone size={13} style={{ color: '#64748b' }} />
                  <span>Direct: {formData.phone || '+91 98230 11450'}</span>
                </div>
              </div>
            )}

            {/* Action Bar inside Overview (Apple Grade Styled Buttons) */}
            <div className="profile-overview-actions-bar">
              <button
                type="button"
                className="profile-action-btn-secondary"
                onClick={() => setActiveTab('id_card')}
              >
                <CreditCard size={15} />
                <span>{isTeacher ? 'Open Faculty Smart Card' : 'Open Virtual Student ID Card'}</span>
              </button>

              <button
                type="button"
                className="profile-action-btn-primary"
                onClick={() => setActiveTab('edit')}
              >
                <Edit3 size={15} />
                <span>{isTeacher ? 'Edit Faculty Details' : 'Edit Profile Details'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: VIRTUAL STUDENT / FACULTY ID CARD */}
        {activeTab === 'id_card' && (
          <div className="profile-tab-id-card-view">
            <VirtualIDCard student={formData} />
          </div>
        )}

        {/* TAB 3: SECURITY & PASSWORD CHANGE REQUEST (User Requirement 1) */}
        {activeTab === 'security' && (
          <div className="profile-tab-content-area" style={{ padding: '20px 24px' }}>
            {/* Account Credentials Summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  {isTeacher ? 'Staff Faculty ID' : 'Student PRN / Roll'}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace', marginTop: '2px' }}>
                  {formData.prn || formData.staffId || (isTeacher ? 'FAC-IT-101' : 'RBT24IT001')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Authorized Role
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                  {isTeacher ? 'Faculty Member' : 'Undergraduate Student'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Registered Email
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginTop: '2px', wordBreak: 'break-all' }}>
                  {formData.email}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Account Security
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4ade80', marginTop: '2px' }}>
                  ● Two-Tier Admin Verified
                </div>
              </div>
            </div>

            {/* Existing Pending Request Notice */}
            {pendingUserRequest && pendingUserRequest.status === 'Pending' && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <Clock size={20} style={{ color: '#fbbf24', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fbbf24' }}>
                    Password Change Request In Progress (#{pendingUserRequest.id})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
                    Your request to update credentials was submitted on{' '}
                    <strong>{new Date(pendingUserRequest.requestedAt).toLocaleDateString()}</strong>. It is currently awaiting review by the System Administrator. Once approved, you can log in with your new password.
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                    Reason: "{pendingUserRequest.reason}"
                  </div>
                </div>
              </div>
            )}

            {/* Approved Request Notice */}
            {pendingUserRequest && pendingUserRequest.status === 'Approved' && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <CheckCircle2 size={18} style={{ color: '#4ade80', flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: '#86efac' }}>
                  Your password change request (#{pendingUserRequest.id}) was approved by{' '}
                  <strong>{pendingUserRequest.reviewedBy || 'Administrator'}</strong>.
                </span>
              </div>
            )}

            {/* Feedback Alerts */}
            {passwordFeedback.error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#fca5a5',
                  fontSize: '0.82rem'
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{passwordFeedback.error}</span>
              </div>
            )}

            {passwordFeedback.success && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#86efac',
                  fontSize: '0.82rem'
                }}
              >
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{passwordFeedback.success}</span>
              </div>
            )}

            {/* Password Change Form */}
            <form onSubmit={handleRequestPasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                  Request Password Update
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Per institutional safety guidelines, password changes require Administrator approval before being committed to the database.
                </p>
              </div>

              {/* Current Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Current Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    placeholder="Enter current password (demo: student / teacher / admin)"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 40px 10px 14px',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New & Confirm Password Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    New Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      placeholder="Min 6 characters"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '10px 40px 10px 14px',
                        color: '#f8fafc',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer'
                      }}
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Justification / Note for Admin */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Reason / Security Purpose (sent to Administrator)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Updating initial temporary password to personal password"
                  value={passwordReason}
                  onChange={(e) => setPasswordReason(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmittingPass}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: '#3b82f6',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: isSubmittingPass ? 'not-allowed' : 'pointer',
                    opacity: isSubmittingPass ? 0.7 : 1
                  }}
                >
                  <KeyRound size={15} />
                  <span>{isSubmittingPass ? 'Submitting Request...' : 'Submit Request to Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: EDIT PROFILE FORM */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSave} className="profile-modal-form">
            <div className="profile-fields-grid">
              {/* Full Name */}
              <div className="profile-field-item">
                <label className="profile-field-label">
                  {isTeacher ? 'Faculty Member Name' : 'Student Full Name'}
                </label>
                <div className="profile-field-input-box">
                  <User size={15} className="profile-field-icon" />
                  <input
                    type="text"
                    className="profile-field-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div className="profile-field-item">
                <label className="profile-field-label">Gender Identity</label>
                <div className="profile-gender-pill-group">
                  {['Female', 'Male', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`profile-gender-btn ${formData.gender === g ? 'active' : ''}`}
                      onClick={() => {
                        const updated = {
                          ...formData,
                          gender: g,
                          avatarUrl:
                            g === 'Female' && formData.avatarUrl === '/assets/student_avatar.jpg'
                              ? '/assets/female_student_avatar.jpg'
                              : g === 'Male' && formData.avatarUrl === '/assets/female_student_avatar.jpg'
                              ? '/assets/student_avatar.jpg'
                              : formData.avatarUrl
                        };
                        setFormData(updated);
                        if (isTeacher) {
                          saveStoredFacultyProfile(updated);
                        } else {
                          saveStoredStudentProfile(updated);
                        }
                      }}
                    >
                      {g === 'Female' ? '👩 Female' : g === 'Male' ? '👨 Male' : '✨ Other'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Official University Email */}
              <div className="profile-field-item">
                <label className="profile-field-label">Institutional Email</label>
                <div className="profile-field-input-box disabled">
                  <Mail size={15} className="profile-field-icon" />
                  <input
                    type="email"
                    className="profile-field-input"
                    value={formData.email}
                    disabled
                    title="Official university email assigned by Registry"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="profile-field-item">
                <label className="profile-field-label">Primary Contact Phone</label>
                <div className="profile-field-input-box">
                  <Phone size={15} className="profile-field-icon" />
                  <input
                    type="tel"
                    className="profile-field-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div className="profile-field-item">
                <label className="profile-field-label">Blood Group</label>
                <div className="profile-field-input-box">
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444' }}>🩸</span>
                  <input
                    type="text"
                    className="profile-field-input"
                    value={formData.bloodGroup || 'O+'}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  />
                </div>
              </div>

              {/* Campus / Classroom Location */}
              <div className="profile-field-item">
                <label className="profile-field-label">
                  {isTeacher ? 'Office / Cabin Location' : 'Campus Desk / Section'}
                </label>
                <div className="profile-field-input-box">
                  <MapPin size={15} className="profile-field-icon" />
                  <input
                    type="text"
                    className="profile-field-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="profile-modal-divider" />

            {/* Preferences */}
            <div className="profile-prefs-group">
              <div className="profile-pref-row">
                <div className="profile-pref-text">
                  <div className="profile-pref-title">Academic & Examination Notifications</div>
                  <div className="profile-pref-sub">
                    Receive SMS/email alerts for timetables, hall ticket clearance, and grade cards.
                  </div>
                </div>
                <button
                  type="button"
                  className={`apple-switch ${formData.notifications ? 'checked' : ''}`}
                  onClick={() => handleToggle('notifications')}
                  role="switch"
                  aria-checked={formData.notifications}
                >
                  <span className="apple-switch-thumb" />
                </button>
              </div>

              <div className="profile-pref-row">
                <div className="profile-pref-text">
                  <div className="profile-pref-title">Security & Session Protection</div>
                  <div className="profile-pref-sub">
                    Enforce strict institutional authentication and encrypted transcript downloads.
                  </div>
                </div>
                <button
                  type="button"
                  className={`apple-switch ${formData.securityAlerts ? 'checked' : ''}`}
                  onClick={() => handleToggle('securityAlerts')}
                  role="switch"
                  aria-checked={formData.securityAlerts}
                >
                  <span className="apple-switch-thumb" />
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="profile-modal-footer">
              <button
                type="button"
                className="profile-cancel-btn"
                onClick={() => setActiveTab('profile')}
              >
                Cancel
              </button>
              <button type="submit" className="profile-save-btn">
                {isSaved ? (
                  <>
                    <Check size={16} />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <span>Save Profile Changes</span>
                )}
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}
