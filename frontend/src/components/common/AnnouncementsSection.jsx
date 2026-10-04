import React, { useState, useMemo, useEffect } from 'react';
import {
  Megaphone,
  Calendar,
  Building2,
  FileText,
  Download,
  Search,
  Filter,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  ChevronRight,
  Sparkles,
  Users,
  GraduationCap,
  Briefcase,
  Globe,
  Eye,
  CheckCheck
} from 'lucide-react';
import DiscreteTabs from '../navigation/DiscreteTabs';
import { useToast } from '../../context/ToastContext';
import { INITIAL_ANNOUNCEMENTS, SEMESTER_OPTIONS } from '../../lib/announcementsData';
import studentService from '../../services/studentService';

const ANNOUNCEMENTS_VERSION = 'v2_audience_segregated';

export default function AnnouncementsSection({
  title,
  subtitle,
  role = 'student',
  allowPublish = false,
  limit = null,
  onNavigateAll = null,
  className = ''
}) {
  const toast = useToast();

  // Role-appropriate default title and subtitle
  const sectionTitle =
    title ||
    (role === 'student'
      ? 'Student Notices & Academic Circulars'
      : role === 'teacher'
      ? 'Faculty Circulars & Department Directives'
      : 'Institutional Notices & Campus Broadcasts');

  const sectionSubtitle =
    subtitle ||
    (role === 'student'
      ? 'Official curriculum updates, examination timetables, and placement notices'
      : role === 'teacher'
      ? 'Confidential faculty council agendas, exam paper deadlines, and NAAC audits'
      : 'Campus-wide announcements with granular audience targeting');

  // Load and sync announcements from localStorage with version check
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const ver = localStorage.getItem('edutrack_announcements_ver');
      const saved = localStorage.getItem('edutrack_announcements');
      if (ver === ANNOUNCEMENTS_VERSION && saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem('edutrack_announcements_ver', ANNOUNCEMENTS_VERSION);
      localStorage.setItem('edutrack_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
      return INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  // Track read announcements for the current role
  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`edutrack_read_notices_${role}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [adminAudienceFilter, setAdminAudienceFilter] = useState('all');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);

  // New announcement form state
  const [formTitle, setFormTitle] = useState('');
  const [formAudience, setFormAudience] = useState(role === 'teacher' ? 'students' : 'all');
  const [formSemester, setFormSemester] = useState('Semester 6');
  const [formDepartment, setFormDepartment] = useState(
    role === 'teacher' ? 'Department of IT' : 'Examination Cell'
  );
  const [formTag, setFormTag] = useState('Academic');
  const [formPriority, setFormPriority] = useState('important');
  const [formMessage, setFormMessage] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formAttachment, setFormAttachment] = useState('');

  // Persist read status
  const toggleReadStatus = (id) => {
    setReadIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(`edutrack_read_notices_${role}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const markAllRead = () => {
    const allRoleIds = filteredAnnouncements.map((a) => a.id);
    const merged = Array.from(new Set([...readIds, ...allRoleIds]));
    setReadIds(merged);
    try {
      localStorage.setItem(`edutrack_read_notices_${role}`, JSON.stringify(merged));
    } catch (e) {
      console.error(e);
    }
    if (toast) toast.success('All Notices Marked as Read', 'All circulars in your view have been marked read.');
  };

  // Real-time instant notification broadcast sync across tabs & WebSockets
  useEffect(() => {
    const handleNoticeBroadcast = (e) => {
      const notice = e.detail;
      if (!notice || !notice.id) return;

      setAnnouncements((prev) => {
        if (prev.some((item) => item.id === notice.id)) return prev;
        const nextList = [notice, ...prev];
        try {
          localStorage.setItem('edutrack_announcements', JSON.stringify(nextList));
        } catch (err) {}
        return nextList;
      });

      // If current role is student and notice audience includes students, alert immediately
      if (role === 'student' && (notice.audience === 'students' || notice.audience === 'all')) {
        if (toast) {
          toast.info(
            `📢 New Circular: ${notice.title}`,
            `${notice.department || 'Academic Notice'} · ${notice.semester}`
          );
        }
      }
    };

    const handleStorageEvent = (e) => {
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
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('edutrack_notice_broadcast', handleNoticeBroadcast);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [role, toast]);

  // Persist announcements helper
  const saveAnnouncements = (newList) => {
    setAnnouncements(newList);
    try {
      localStorage.setItem('edutrack_announcements', JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) {
      if (toast) toast.error('Validation Error', 'Please fill in both the title and announcement message.');
      return;
    }

    const newNotice = {
      id: Date.now(),
      title: formTitle.trim(),
      semester: formSemester,
      audience: formAudience,
      department: formDepartment.trim() || (role === 'admin' ? 'Academic Administration' : 'Department of IT'),
      date: 'Just now',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: formTag,
      priority: formPriority,
      message: formMessage.trim(),
      details: formDetails.trim() || formMessage.trim(),
      author: role === 'admin' ? 'Administrator' : 'Faculty Instructor',
      attachment: formAttachment.trim() || `${formTitle.trim().replace(/\s+/g, '_')}.pdf`,
      readBy: []
    };

    const updated = [newNotice, ...announcements];
    saveAnnouncements(updated);

    // Instant real-time push: broadcasts through WebSocket and local browser clients
    studentService.broadcastNotice(newNotice);

    if (toast) {
      const audLabel =
        newNotice.audience === 'students'
          ? 'Students Only'
          : newNotice.audience === 'teachers'
          ? 'Faculty / Teachers Only'
          : 'Campus-Wide';

      toast.success(
        'Announcement Broadcasted',
        `Target: ${audLabel} · ${newNotice.semester}: "${newNotice.title}"`
      );
    }

    // Reset modal form
    setFormTitle('');
    setFormMessage('');
    setFormDetails('');
    setFormAttachment('');
    setIsPublishModalOpen(false);
  };

  // Filter logic with STRICT ROLE AUDIENCE SEPARATION
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      // 1. STRICT ROLE-BASED AUDIENCE ISOLATION
      // - Students CANNOT see notices for teachers
      // - Teachers CANNOT see student-only notices
      // - Admins can view all, or filter by audience
      if (role === 'student') {
        if (item.audience !== 'students' && item.audience !== 'all') {
          return false;
        }
      } else if (role === 'teacher') {
        if (item.audience !== 'teachers' && item.audience !== 'all') {
          return false;
        }
      } else if (role === 'admin') {
        if (adminAudienceFilter !== 'all') {
          if (item.audience !== adminAudienceFilter) return false;
        }
      }

      // 2. Unread filter
      if (onlyUnread && readIds.includes(item.id)) {
        return false;
      }

      // 3. Semester filter
      if (selectedSemester !== 'All') {
        if (selectedSemester === 'Semester 6') {
          if (!item.semester.includes('6') && item.semester !== 'All Semesters') return false;
        } else if (selectedSemester === 'Semester 5') {
          if (!item.semester.includes('5') && item.semester !== 'All Semesters') return false;
        } else if (selectedSemester === 'Semester 4') {
          if (!item.semester.includes('4') && item.semester !== 'All Semesters') return false;
        } else if (selectedSemester === 'All Semesters') {
          if (item.semester !== 'All Semesters') return false;
        }
      }

      // 4. Category filter
      if (selectedCategory !== 'All') {
        if (item.tag !== selectedCategory) return false;
      }

      // 5. Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMsg = item.message.toLowerCase().includes(q);
        const matchesDept = item.department.toLowerCase().includes(q);
        const matchesSem = item.semester.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg && !matchesDept && !matchesSem) return false;
      }

      return true;
    });
  }, [
    announcements,
    role,
    adminAudienceFilter,
    onlyUnread,
    readIds,
    selectedSemester,
    selectedCategory,
    searchQuery
  ]);

  const displayedList = limit ? filteredAnnouncements.slice(0, limit) : filteredAnnouncements;

  // Unread count for current role view
  const unreadCount = filteredAnnouncements.filter((a) => !readIds.includes(a.id)).length;

  // Semester tabs for DiscreteTabs
  const semesterTabs = [
    { id: 'All', label: 'All Semesters', icon: <Sparkles size={14} /> },
    {
      id: 'Semester 6',
      label: 'Semester 6',
      count: announcements.filter((a) => {
        if (role === 'student' && a.audience !== 'students' && a.audience !== 'all') return false;
        if (role === 'teacher' && a.audience !== 'teachers' && a.audience !== 'all') return false;
        return a.semester.includes('6');
      }).length
    },
    {
      id: 'Semester 5',
      label: 'Semester 5',
      count: announcements.filter((a) => {
        if (role === 'student' && a.audience !== 'students' && a.audience !== 'all') return false;
        if (role === 'teacher' && a.audience !== 'teachers' && a.audience !== 'all') return false;
        return a.semester.includes('5');
      }).length
    },
    {
      id: 'Semester 4',
      label: 'Semester 4',
      count: announcements.filter((a) => {
        if (role === 'student' && a.audience !== 'students' && a.audience !== 'all') return false;
        if (role === 'teacher' && a.audience !== 'teachers' && a.audience !== 'all') return false;
        return a.semester.includes('4');
      }).length
    },
    {
      id: 'All Semesters',
      label: 'Campus-Wide',
      count: announcements.filter((a) => {
        if (role === 'student' && a.audience !== 'students' && a.audience !== 'all') return false;
        if (role === 'teacher' && a.audience !== 'teachers' && a.audience !== 'all') return false;
        return a.semester === 'All Semesters';
      }).length
    }
  ];

  const getAudienceBadge = (audience) => {
    switch (audience) {
      case 'students':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#2563eb',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '2px 8px',
              borderRadius: '9999px'
            }}
          >
            <GraduationCap size={12} />
            <span>Students</span>
          </span>
        );
      case 'teachers':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#7c3aed',
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
              padding: '2px 8px',
              borderRadius: '9999px'
            }}
          >
            <Briefcase size={12} />
            <span>Faculty Only</span>
          </span>
        );
      case 'all':
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#059669',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '2px 8px',
              borderRadius: '9999px'
            }}
          >
            <Globe size={12} />
            <span>Campus-Wide</span>
          </span>
        );
    }
  };

  const handleDownloadAttachment = (notice) => {
    const filename = notice.attachment || `${notice.title.replace(/\s+/g, '_')}.pdf`;
    const content = `EDUTRACK OFFICIAL CIRCULAR ATTACHMENT
Document: ${filename}
Title: ${notice.title}
Department: ${notice.department}
Target Semester: ${notice.semester}
Target Audience: ${notice.audience.toUpperCase()}
Date: ${notice.date} · ${notice.time || 'Official'}
Authorized by: ${notice.author || 'Academic Board'}
========================================================================

NOTICE BODY:
${notice.message}

ADDITIONAL OPERATIONAL DETAILS:
${notice.details || notice.message}

Verified Digital Signature: EDUTRACK-VERIFIED-${notice.id}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.pdf') ? filename.replace('.pdf', '.txt') : filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (toast) {
      toast.success('Circular Downloaded', `Downloaded attachment: ${filename}`);
    }
  };

  return (
    <section className={`announcements-hub-container ${className}`} aria-label="Announcements Hub">
      {/* Top Header Controls */}
      <div className="announcements-header-bar">
        <div>
          <div className="announcements-title-wrap">
            <span className="announcements-icon-badge">
              <Megaphone size={18} color="#2563eb" />
            </span>
            <h3 className="announcements-main-title">{sectionTitle}</h3>
            <span className="announcements-total-pill">
              {filteredAnnouncements.length} {role === 'student' ? 'Student Circulars' : role === 'teacher' ? 'Faculty Circulars' : 'Total Notices'}
            </span>
            {unreadCount > 0 && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}
              >
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="announcements-sub-title">{sectionSubtitle}</p>
        </div>

        <div className="announcements-header-actions">
          {/* Keyword Search Input */}
          <div className="announcements-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search circulars, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="announcements-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Mark All Read Button */}
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={markAllRead}
              style={{ borderRadius: '9999px', padding: '5px 12px', fontSize: '0.78rem' }}
              title="Mark all current notices as read"
            >
              <CheckCheck size={14} />
              <span>Mark All Read</span>
            </button>
          )}

          {/* Action button if on Dashboard */}
          {onNavigateAll && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={onNavigateAll}
              style={{ borderRadius: '9999px', padding: '5px 14px', fontSize: '0.78rem' }}
            >
              <span>View All Notices</span>
              <ChevronRight size={13} />
            </button>
          )}

          {/* Publish Button for Teachers / Admins */}
          {allowPublish && (
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={() => setIsPublishModalOpen(true)}
              style={{ borderRadius: '9999px', padding: '5px 14px', fontSize: '0.78rem' }}
            >
              <Plus size={14} />
              <span>Publish Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Audience Filter Pill (Visible only in Admin mode) */}
      {role === 'admin' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            padding: '8px 12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px'
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Target Audience:</span>
          {[
            { id: 'all', label: 'All Audiences', count: announcements.length },
            { id: 'students', label: 'Students Only', count: announcements.filter((a) => a.audience === 'students').length },
            { id: 'teachers', label: 'Faculty / Teachers Only', count: announcements.filter((a) => a.audience === 'teachers').length },
            { id: 'all_campus', label: 'Campus-Wide', count: announcements.filter((a) => a.audience === 'all').length }
          ].map((aud) => (
            <button
              key={aud.id}
              type="button"
              onClick={() => setAdminAudienceFilter(aud.id === 'all_campus' ? 'all' : aud.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: (aud.id === 'all' && adminAudienceFilter === 'all') || adminAudienceFilter === aud.id ? 600 : 500,
                background: (aud.id === 'all' && adminAudienceFilter === 'all') || adminAudienceFilter === aud.id ? '#0f172a' : '#ffffff',
                color: (aud.id === 'all' && adminAudienceFilter === 'all') || adminAudienceFilter === aud.id ? '#ffffff' : '#475569',
                border: '1px solid #e2e8f0',
                cursor: 'pointer'
              }}
            >
              {aud.label} ({aud.count})
            </button>
          ))}
        </div>
      )}

      {/* DiscreteTabs Semester Filter */}
      <div className="announcements-filter-bar">
        <DiscreteTabs
          tabs={semesterTabs}
          activeTab={selectedSemester}
          onTabChange={setSelectedSemester}
          size="sm"
        />

        {/* Category & Unread Pills */}
        <div className="announcements-category-pills">
          <button
            type="button"
            className={`category-pill-btn ${onlyUnread ? 'active' : ''}`}
            onClick={() => setOnlyUnread((prev) => !prev)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: onlyUnread ? '#ffffff' : '#2563eb' }}></span>
            <span>Unread Only ({unreadCount})</span>
          </button>

          {['All', 'Examination', 'Academic', 'Placement', 'Lab Notice', 'Campus Event', 'Administrative'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcement Cards List */}
      <div className="announcements-cards-list">
        {displayedList.length === 0 ? (
          <div className="announcements-empty-box">
            <Megaphone size={32} color="#94a3b8" />
            <h4>No announcements found</h4>
            <p>
              No circulars match the selected semester ({selectedSemester}), category, or unread filters for your{' '}
              <strong>{role === 'student' ? 'Student' : role === 'teacher' ? 'Faculty' : 'Admin'}</strong> account.
            </p>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => {
                setSelectedSemester('All');
                setSelectedCategory('All');
                setOnlyUnread(false);
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedList.map((notice) => {
            const isRead = readIds.includes(notice.id);

            return (
              <article
                key={notice.id}
                className={`announcement-card-item priority-${notice.priority || 'normal'} ${isRead ? 'is-read' : 'is-unread'}`}
                style={{
                  position: 'relative',
                  borderLeft: isRead ? '4px solid #cbd5e1' : '4px solid #2563eb',
                  background: isRead ? '#fdfdfe' : '#ffffff'
                }}
              >
                <div className="announcement-card-header">
                  <div className="announcement-badges-left">
                    {/* Semester Tag */}
                    <span className="announcement-semester-badge">
                      <span className="semester-dot"></span>
                      {notice.semester}
                    </span>

                    {/* Role Target Audience Tag */}
                    {getAudienceBadge(notice.audience)}

                    {/* Priority / Category Tag */}
                    <span
                      className={`badge ${
                        notice.tag === 'Examination'
                          ? 'badge-danger'
                          : notice.tag === 'Placement'
                          ? 'badge-warning'
                          : notice.tag === 'Academic'
                          ? 'badge-primary'
                          : 'badge-neutral'
                      }`}
                    >
                      {notice.tag}
                    </span>

                    <span className="announcement-dept-meta">
                      <Building2 size={13} />
                      <span>{notice.department}</span>
                    </span>
                  </div>

                  <div className="announcement-date-right">
                    <Clock size={13} />
                    <span>{notice.date}</span>
                    {notice.time && <span className="announcement-time-sub">· {notice.time}</span>}
                  </div>
                </div>

                {/* Title & Body */}
                <h4
                  className="announcement-card-title"
                  onClick={() => {
                    setActiveNoticeModal(notice);
                    if (!isRead) toggleReadStatus(notice.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {!isRead && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        marginRight: 6,
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                  {notice.title}
                </h4>

                <p className="announcement-card-message">{notice.message}</p>

                {/* Footer Bar with Attachment & Actions */}
                <div className="announcement-card-footer">
                  <div className="announcement-author-meta">
                    <span className="author-label">Published by:</span>
                    <span className="author-name">{notice.author || notice.department}</span>
                  </div>

                  <div className="announcement-actions-group">
                    {/* View Details Modal Button */}
                    <button
                      type="button"
                      className="announcement-ack-btn"
                      onClick={() => {
                        setActiveNoticeModal(notice);
                        if (!isRead) toggleReadStatus(notice.id);
                      }}
                      title="Read full circular details and instructions"
                    >
                      <Eye size={13} />
                      <span>Read Circular</span>
                    </button>

                    {notice.attachment && (
                      <button
                        type="button"
                        className="announcement-attachment-btn"
                        onClick={() => handleDownloadAttachment(notice)}
                        title={`Download official circular attachment: ${notice.attachment}`}
                      >
                        <Download size={13} />
                        <span className="attachment-filename">{notice.attachment}</span>
                      </button>
                    )}

                    {/* Mark Read/Unread Toggle */}
                    <button
                      type="button"
                      className="announcement-ack-btn"
                      onClick={() => toggleReadStatus(notice.id)}
                      title={isRead ? 'Mark as Unread' : 'Mark as Read'}
                      style={{ color: isRead ? '#64748b' : '#16a34a' }}
                    >
                      <CheckCircle2 size={13} />
                      <span>{isRead ? 'Read' : 'Mark Read'}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Interactive Announcement Reader Modal */}
      {activeNoticeModal && (
        <div className="modal-backdrop" onClick={() => setActiveNoticeModal(null)} style={{ zIndex: 125 }}>
          <div
            className="modal-content-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '660px',
              width: '92vw',
              background: '#ffffff',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)'
            }}
          >
            <div className="modal-header-bar" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(37, 99, 235, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb'
                  }}
                >
                  <Megaphone size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    Official Circular Notice
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Reference #{activeNoticeModal.id} · EduTrack Academic Portal
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveNoticeModal(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto', background: '#ffffff' }}>
              {/* Badges Strip */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                <span className="announcement-semester-badge">
                  <span className="semester-dot"></span>
                  {activeNoticeModal.semester}
                </span>
                {getAudienceBadge(activeNoticeModal.audience)}
                <span className="badge badge-primary">{activeNoticeModal.tag}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginLeft: 'auto'
                  }}
                >
                  <Clock size={12} />
                  {activeNoticeModal.date} {activeNoticeModal.time && `· ${activeNoticeModal.time}`}
                </span>
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.35,
                  margin: '0 0 14px 0'
                }}
              >
                {activeNoticeModal.title}
              </h2>

              {/* Issuing Authority Card */}
              <div
                style={{
                  padding: '10px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={15} color="#64748b" />
                  <div>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{activeNoticeModal.department}</strong>
                    <span style={{ color: '#64748b' }}>Authorized by: {activeNoticeModal.author}</span>
                  </div>
                </div>
                <span style={{ color: '#059669', fontWeight: 600, background: '#ecfdf5', padding: '2px 8px', borderRadius: '9999px' }}>
                  Verified Circular
                </span>
              </div>

              {/* Notice Content */}
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: '#334155',
                  marginBottom: '18px'
                }}
              >
                <p style={{ margin: '0 0 12px 0', fontWeight: 500 }}>{activeNoticeModal.message}</p>
                {activeNoticeModal.details && (
                  <div
                    style={{
                      padding: '12px 16px',
                      background: '#eff6ff',
                      borderLeft: '4px solid #2563eb',
                      borderRadius: '0 8px 8px 0',
                      fontSize: '0.8125rem',
                      color: '#1e3a8a'
                    }}
                  >
                    <strong style={{ display: 'block', marginBottom: 4 }}>Operational Guidelines:</strong>
                    {activeNoticeModal.details}
                  </div>
                )}
              </div>

              {/* Attachment Download Box */}
              {activeNoticeModal.attachment && (
                <div
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2563eb'
                      }}
                    >
                      <FileText size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.8125rem', color: '#0f172a', display: 'block' }}>
                        {activeNoticeModal.attachment}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Official Document Attachment · Verified PDF/DOCX</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => handleDownloadAttachment(activeNoticeModal)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => {
                  toggleReadStatus(activeNoticeModal.id);
                  setActiveNoticeModal(null);
                }}
              >
                {readIds.includes(activeNoticeModal.id) ? 'Mark as Unread & Close' : 'Mark as Read & Close'}
              </button>

              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => setActiveNoticeModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Notice Modal */}
      {isPublishModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPublishModalOpen(false)} style={{ zIndex: 125 }}>
          <div
            className="modal-content-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '560px',
              width: '92vw',
              background: '#ffffff',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)'
            }}
          >
            <div className="modal-header-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Megaphone size={18} color="#2563eb" />
                <h3 className="modal-heading-title">Publish New Announcement</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsPublishModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePublish} className="modal-form-body">
              <div className="form-group-field">
                <label className="form-field-label">Notice Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Semester 6 Practical Schedule & Hall Tickets"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="form-input-control"
                  required
                />
              </div>

              {/* Target Audience Selector (CRUCIAL FOR ROLE SEPARATION) */}
              <div className="form-group-field">
                <label className="form-field-label">Target Audience *</label>
                <select
                  value={formAudience}
                  onChange={(e) => setFormAudience(e.target.value)}
                  className="form-input-control"
                  style={{ fontWeight: 600 }}
                >
                  <option value="students">🎓 Students Only (Hidden from Teachers)</option>
                  <option value="teachers">💼 Faculty / Teachers Only (Hidden from Students)</option>
                  <option value="all">🌐 Campus-Wide (Visible to All)</option>
                </select>
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                  {formAudience === 'students'
                    ? 'Only enrolled students and administrators will see this circular.'
                    : formAudience === 'teachers'
                    ? 'Only teaching faculty members and administrators will see this circular.'
                    : 'Broadcasted to all students, faculty members, and campus staff.'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Target Semester Selector */}
                <div className="form-group-field">
                  <label className="form-field-label">Target Semester *</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value)}
                    className="form-input-control"
                  >
                    {SEMESTER_OPTIONS.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                {/* Category Tag */}
                <div className="form-group-field">
                  <label className="form-field-label">Category Tag *</label>
                  <select
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="form-input-control"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Placement">Placement</option>
                    <option value="Lab Notice">Lab Notice</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Campus Event">Campus Event</option>
                    <option value="Library">Library</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Publishing Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Examination Cell"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="form-input-control"
                  />
                </div>

                <div className="form-group-field">
                  <label className="form-field-label">Priority Level</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="form-input-control"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent / Alert</option>
                  </select>
                </div>
              </div>

              <div className="form-group-field">
                <label className="form-field-label">Notice Message Summary *</label>
                <textarea
                  rows={3}
                  placeholder="Provide concise circular summary..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="form-input-control"
                  required
                />
              </div>

              <div className="form-group-field">
                <label className="form-field-label">Operational Instructions & Details (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Additional details, schedule specifics, reporting room, rules..."
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  className="form-input-control"
                />
              </div>

              <div className="form-group-field">
                <label className="form-field-label">Attachment Document Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Exam_Instructions_Circular.pdf"
                  value={formAttachment}
                  onChange={(e) => setFormAttachment(e.target.value)}
                  className="form-input-control"
                />
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsPublishModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Plus size={14} />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
