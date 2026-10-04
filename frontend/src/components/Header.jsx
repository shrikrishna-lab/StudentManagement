import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle2,
  AlertTriangle,
  BellOff,
  User,
  LogOut,
  ChevronDown,
  PanelLeft,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Check,
  BarChart2,
  Sparkles,
  ChevronRight,
  Database
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SemesterModal from './common/SemesterModal';
import { studentService } from '../services/studentService';

const ROLE_NOTIFICATIONS = {
  student: [
    {
      id: 1,
      title: 'Attendance Warning',
      message: 'Computer Networks attendance is 74.3%. Minimum requirement is 75%.',
      time: '1 hour ago',
      read: false,
      type: 'alert'
    },
    {
      id: 2,
      title: 'Assignment Deadline',
      message: 'JDBC Student Management Project is due Oct 08, 11:59 PM.',
      time: '3 hours ago',
      read: false,
      type: 'info'
    },
    {
      id: 3,
      title: 'Lab Evaluation Completed',
      message: 'Core Java Lab #4 marks have been published by Prof. Krrish.',
      time: 'Yesterday',
      read: true,
      type: 'success'
    }
  ],
  teacher: [
    {
      id: 1,
      title: 'Attendance Alert',
      message: '2 students in IT Div A have attendance below 75%.',
      time: '30 mins ago',
      read: false,
      type: 'alert'
    },
    {
      id: 2,
      title: 'Pending Submissions',
      message: '38 students have submitted the JDBC Project for evaluation.',
      time: '2 hours ago',
      read: false,
      type: 'info'
    },
    {
      id: 3,
      title: 'Timetable Update',
      message: 'Room A-1 lab session scheduled for Thursday 8:00 AM.',
      time: 'Yesterday',
      read: true,
      type: 'info'
    }
  ],
  admin: [
    {
      id: 1,
      title: 'Database Sync Active',
      message: 'MySQL 8.0 connected on port 3306. 5 student records synchronized.',
      time: 'Just now',
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'New Student Registration',
      message: 'Sneha Kulkarni was enrolled into the EXTC Department.',
      time: '1 hour ago',
      read: false,
      type: 'info'
    },
    {
      id: 3,
      title: 'Audit Log Recorded',
      message: 'System backup export completed successfully.',
      time: '3 hours ago',
      read: true,
      type: 'info'
    }
  ]
};

export default function Header({
  activeTab,
  currentRole,
  currentUser,
  onChangeRole,
  currentSemester = 'Semester 6',
  onChangeSemester,
  activeStudentProfile,
  onOpenProfileModal,
  onLogout,
  onToggleMobileSidebar,
  onToggleSidebar
}) {
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    return ROLE_NOTIFICATIONS[currentRole] || ROLE_NOTIFICATIONS.student;
  });

  const notificationRef = useRef(null);
  const roleMenuRef = useRef(null);
  const semesterMenuRef = useRef(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSemesterMenu, setShowSemesterMenu] = useState(false);
  const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: true, latencyMs: 25, database: 'MySQL 8.0' });

  useEffect(() => {
    let mounted = true;
    const checkStatus = async () => {
      try {
        const health = await studentService.checkHealth();
        if (mounted && health) {
          setDbStatus(health);
        }
      } catch (e) {
        if (mounted) setDbStatus({ connected: false, latencyMs: 0 });
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 15000);

    const handleDbEvent = (e) => {
      if (mounted && e.detail) {
        setDbStatus((prev) => ({ ...prev, connected: e.detail.connected }));
      }
    };
    window.addEventListener('edutrack_db_status', handleDbEvent);

    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener('edutrack_db_status', handleDbEvent);
    };
  }, []);

  useEffect(() => {
    setNotifications(ROLE_NOTIFICATIONS[currentRole] || ROLE_NOTIFICATIONS.student);
  }, [currentRole]);

  // Real-time instant notification broadcast for student & faculty alerts
  useEffect(() => {
    const handleNoticeBroadcast = (e) => {
      const notice = e.detail;
      if (!notice) return;

      // Filter by role: if current role is student, only student or all notices apply
      if (currentRole === 'student' && notice.audience !== 'students' && notice.audience !== 'all') {
        return;
      }
      if (currentRole === 'teacher' && notice.audience !== 'teachers' && notice.audience !== 'all') {
        return;
      }

      const notifItem = {
        id: notice.id || Date.now(),
        title: `📢 ${notice.title}`,
        message: `${notice.department ? notice.department + ': ' : ''}${notice.message || notice.details}`,
        time: 'Just now',
        read: false,
        type: notice.priority === 'urgent' ? 'alert' : 'info'
      };

      setNotifications((prev) => [notifItem, ...prev]);

      // Pop immediate Toast notification for student
      if (toast?.info && currentRole === 'student') {
        toast.info(
          `📢 Instant Notice: ${notice.title}`,
          `${notice.department || 'Academic Notice'} · ${notice.semester}`
        );
      }
    };

    const handleStorageBroadcast = (e) => {
      if (e.key === 'edutrack_latest_announcement_broadcast' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data && data.notice) {
            handleNoticeBroadcast({ detail: data.notice });
          }
        } catch (err) {}
      }
    };

    window.addEventListener('edutrack_notice_broadcast', handleNoticeBroadcast);
    window.addEventListener('storage', handleStorageBroadcast);
    return () => {
      window.removeEventListener('edutrack_notice_broadcast', handleNoticeBroadcast);
      window.removeEventListener('storage', handleStorageBroadcast);
    };
  }, [currentRole, toast]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setShowRoleMenu(false);
      }
      if (semesterMenuRef.current && !semesterMenuRef.current.contains(event.target)) {
        setShowSemesterMenu(false);
      }
    }
    if (showNotifications || showRoleMenu || showSemesterMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showRoleMenu, showSemesterMenu]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'students':
        return 'Students';
      case 'teachers':
        return 'Teachers';
      case 'courses':
        return 'Courses';
      case 'subjects':
        return 'Subjects';
      case 'classes':
        return currentRole === 'teacher' ? 'My Classes' : 'Classes & Divisions';
      case 'attendance':
        return 'Attendance';
      case 'marks':
        return 'Marks & Grades';
      case 'assignments':
        return 'Assignments';
      case 'materials':
        return 'Study Materials';
      case 'repository':
        return 'Document Repository';
      case 'doc-scanner':
        return 'AI Document Auto-Checker';
      case 'hall-ticket':
        return 'Exam Hall Ticket';
      case 'performance':
        return 'Academic Performance & Remedials';
      case 'fee-status':
        return 'Student Fees & Dues';
      case 'role-hub':
        return 'GFM & Class Teacher Hub';
      case 'id-generator':
        return 'PRN & Roll Number Engine';
      case 'faculty-allocation':
        return 'Faculty Role Allocation';
      case 'security-approvals':
        return 'Security & Credential Approvals';
      case 'timetable':
        return 'Timetable';
      case 'announcements':
        return 'Announcements';
      case 'notifications':
        return 'Notifications';
      case 'reports':
        return 'Reports';
      case 'activity':
        return 'Activity Log';
      case 'settings':
        return 'Settings';
      default:
        return 'Overview';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={15} className="notif-icon-success" />;
      case 'alert':
        return <AlertTriangle size={15} className="notif-icon-warning" />;
      case 'info':
      default:
        return <Info size={15} className="notif-icon-info" />;
    }
  };

  return (
    <header className="edutrack-header">
      {/* Left: Mobile Drawer Toggle (Desktop uses sidebar toggle only) + Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onToggleMobileSidebar && (
          <button
            type="button"
            className="header-mobile-toggle-btn"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation drawer"
            title="Open navigation"
          >
            <PanelLeft size={17} strokeWidth={1.8} />
          </button>
        )}

        <div className="header-breadcrumbs">
          <strong className="breadcrumb-current" style={{ fontSize: '0.95rem', fontWeight: 650, color: 'var(--text-main)' }}>
            {getBreadcrumbTitle()}
          </strong>
        </div>
      </div>

      {/* Right: Actions, Term badge, Role Selector, Notifications, Profile */}
      <div className="header-actions">
        {/* Live MySQL 8.0 Database Connection Pill (Only shown in Admin Panel) */}
        {currentRole === 'admin' && (
          <div
            className={`header-db-pill ${dbStatus.connected ? 'online' : 'offline'}`}
            title={
              dbStatus.connected
                ? `Connected to MySQL 8.0 [student_management] • Latency: ${dbStatus.latencyMs || 25}ms • Realtime WebSocket Active`
                : 'Connecting to MySQL backend on port 5000...'
            }
          >
            <span className="db-status-dot" />
            <Database size={13} style={{ opacity: 0.85 }} />
            <span className="db-status-text">{dbStatus.connected ? 'MySQL Live' : 'Reconnecting'}</span>
            {dbStatus.connected && (
              <span className="db-status-latency">{dbStatus.latencyMs || 25}ms</span>
            )}
          </div>
        )}

        {/* Semester Capsule Button & Interactive Switcher (Replaces Spring 2026) */}
        <div className="header-semester-wrap" ref={semesterMenuRef}>
          <button
            type="button"
            className={`header-semester-pill-btn ${showSemesterMenu ? 'active' : ''}`}
            onClick={() => setShowSemesterMenu((prev) => !prev)}
            aria-label="Academic Semester"
            title="Current Semester & Academic Progress"
            aria-expanded={showSemesterMenu}
          >
            <span className="semester-indicator-dot"></span>
            <span className="semester-pill-title">{currentSemester}</span>
            <ChevronDown size={13} className={`semester-pill-chevron ${showSemesterMenu ? 'open' : ''}`} />
          </button>

          {showSemesterMenu && (
            <div className="header-semester-dropdown-menu">
              <div className="semester-dropdown-header">
                <div>
                  <h4 className="semester-dropdown-title">Academic Semester</h4>
                  <span className="semester-dropdown-sub">IT Curriculum · Year 3</span>
                </div>
                <span className="semester-active-tag">Active Term</span>
              </div>

              {/* Quick stats for active semester */}
              <div className="semester-dropdown-stats">
                <div className="sem-stat-item">
                  <span className="sem-stat-label">Status</span>
                  <span className="sem-stat-val text-success">Enrolled</span>
                </div>
                <div className="sem-stat-item">
                  <span className="sem-stat-label">Credits</span>
                  <span className="sem-stat-val">22 Cr</span>
                </div>
                <div className="sem-stat-item">
                  <span className="sem-stat-label">CGPA</span>
                  <span className="sem-stat-val text-primary">8.95</span>
                </div>
              </div>

              <div className="semester-dropdown-divider" />

              <div className="semester-dropdown-list">
                {[
                  { id: 'Semester 6', name: 'Semester 6', term: 'Spring 2026', status: 'Active (Current)' },
                  { id: 'Semester 5', name: 'Semester 5', term: 'Fall 2025', status: 'Completed · 8.82 SGPA' },
                  { id: 'Semester 4', name: 'Semester 4', term: 'Spring 2025', status: 'Completed · 8.65 SGPA' },
                  { id: 'Semester 3', name: 'Semester 3', term: 'Fall 2024', status: 'Completed · 8.90 SGPA' },
                  { id: 'Semester 2', name: 'Semester 2', term: 'Spring 2024', status: 'Completed · 9.10 SGPA' },
                  { id: 'Semester 1', name: 'Semester 1', term: 'Fall 2023', status: 'Completed · 8.75 SGPA' },
                  { id: 'Semester 7', name: 'Semester 7', term: 'Fall 2026', status: 'Upcoming' },
                  { id: 'Semester 8', name: 'Semester 8', term: 'Spring 2027', status: 'Upcoming' }
                ].map((sem) => (
                  <button
                    key={sem.id}
                    type="button"
                    className={`semester-dropdown-item ${currentSemester === sem.id ? 'selected' : ''}`}
                    onClick={() => {
                      if (onChangeSemester) onChangeSemester(sem.id);
                      setShowSemesterMenu(false);
                      toast.success('Semester Selected', `Viewing academic data for ${sem.name} (${sem.term}).`);
                    }}
                  >
                    <div>
                      <div className="sem-item-title-row">
                        <strong className="sem-item-name">{sem.name}</strong>
                        {currentSemester === sem.id && (
                          <span className="sem-active-badge">Active</span>
                        )}
                      </div>
                      <span className="sem-item-meta">{sem.status}</span>
                    </div>
                    {currentSemester === sem.id && <Check size={14} className="sem-check-icon" />}
                  </button>
                ))}
              </div>

              <div className="semester-dropdown-footer">
                <button
                  type="button"
                  className="semester-view-all-btn"
                  onClick={() => {
                    setShowSemesterMenu(false);
                    setIsSemesterModalOpen(true);
                  }}
                >
                  <BarChart2 size={14} />
                  <span>Check All Semesters Full Breakdown</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Role Switcher - Apple-Grade Interactive Pill Menu */}
        {onChangeRole && (
          <div className="header-role-switcher-wrap" ref={roleMenuRef}>
            <button
              type="button"
              className={`header-role-pill-btn ${showRoleMenu ? 'active' : ''}`}
              onClick={() => setShowRoleMenu((prev) => !prev)}
              aria-label="Switch Role"
              title="Change Account Role"
              aria-expanded={showRoleMenu}
            >
              <span className="role-pill-icon-box">
                {currentRole === 'student' && <GraduationCap size={14} color="#16a34a" />}
                {currentRole === 'teacher' && <BookOpen size={14} color="#2563eb" />}
                {currentRole === 'admin' && <ShieldCheck size={14} color="#7c3aed" />}
              </span>
              <span className="role-pill-label">
                {currentRole === 'admin' ? 'Administrator' : currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
              </span>
              <ChevronDown size={13} className={`role-pill-chevron ${showRoleMenu ? 'open' : ''}`} />
            </button>

            {showRoleMenu && (
              <div className="header-role-dropdown-menu">
                <div className="role-dropdown-title-bar">Switch Workspace</div>
                {[
                  { id: 'student', label: 'Student', icon: <GraduationCap size={15} color="#16a34a" /> },
                  { id: 'teacher', label: 'Faculty / Teacher', icon: <BookOpen size={15} color="#2563eb" /> },
                  { id: 'admin', label: 'Administrator', icon: <ShieldCheck size={15} color="#7c3aed" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`role-dropdown-item ${currentRole === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      onChangeRole(item.id);
                      setShowRoleMenu(false);
                    }}
                  >
                    <div className="role-item-left">
                      <span className="role-item-icon">{item.icon}</span>
                      <span className="role-item-text">{item.label}</span>
                    </div>
                    {currentRole === item.id && (
                      <Check size={14} className="role-item-check" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="header-notif-wrap" ref={notificationRef}>
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="header-notif-count">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="header-notif-dropdown">
              <div className="notif-dropdown-header">
                <div>
                  <h4 className="notif-dropdown-title">Notifications</h4>
                  <span className="notif-dropdown-meta">{unreadCount} unread</span>
                </div>
                <div className="notif-dropdown-actions">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="notif-action-text-btn"
                      onClick={handleMarkAllRead}
                      title="Mark all as read"
                    >
                      <CheckCheck size={13} />
                      <span>Mark all read</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      className="notif-action-text-btn notif-clear-btn"
                      onClick={handleClearAll}
                      title="Clear notifications"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div className="notif-dropdown-body">
                {notifications.length === 0 ? (
                  <div className="notif-empty-state">
                    <BellOff size={22} className="notif-empty-icon" />
                    <span>No notifications</span>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`notif-item ${!item.read ? 'unread' : ''}`}
                      onClick={() => handleToggleRead(item.id)}
                    >
                      <div className="notif-item-icon-box">
                        {getNotificationIcon(item.type)}
                      </div>
                      <div className="notif-item-content">
                        <div className="notif-item-top">
                          <strong className="notif-item-title">{item.title}</strong>
                          <span className="notif-item-time">{item.time}</span>
                        </div>
                        <p className="notif-item-msg">{item.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile / Account Pill with Avatar */}
        {(() => {
          const isStudent = currentRole === 'student';
          const name = isStudent && activeStudentProfile?.name
            ? activeStudentProfile.name
            : (currentUser?.name || (currentRole === 'admin' ? 'Admin' : currentRole === 'teacher' ? 'Prof. Krrish' : 'Krrish Sharma'));
          const avatarUrl = isStudent && activeStudentProfile?.avatarUrl
            ? activeStudentProfile.avatarUrl
            : (currentUser?.avatarUrl || null);

          return (
            <button
              type="button"
              className="header-profile-btn"
              onClick={onOpenProfileModal}
              title="Account profile"
            >
              <div
                className="header-profile-avatar"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="header-profile-name">{name}</span>
            </button>
          );
        })()}

        {/* Sign Out */}
        {onLogout && (
          <button
            type="button"
            className="header-logout-btn"
            onClick={onLogout}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>

      {/* Complete Semester Tracker Modal */}
      <SemesterModal
        isOpen={isSemesterModalOpen}
        onClose={() => setIsSemesterModalOpen(false)}
        currentSemester={currentSemester}
        onSelectSemester={onChangeSemester}
      />
    </header>
  );
}
