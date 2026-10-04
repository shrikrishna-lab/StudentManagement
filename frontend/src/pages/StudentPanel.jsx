import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  BarChart3,
  FileText,
  Download,
  AlertTriangle,
  Upload,
  Search,
  Bell,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Percent,
  Layers,
  FileCheck,
  Edit3,
  CreditCard,
  ShieldCheck,
  User,
  Users,
  Sparkles,
  MapPin,
  FlaskConical,
  GraduationCap,
  Printer,
  Ticket,
  Eye
} from 'lucide-react';
import Alert from '../components/Alert';
import { useToast } from '../context/ToastContext';
import PillTabs from '../components/navigation/PillTabs';
import DocumentCardGrid from '../components/common/DocumentCardGrid';
import InstitutionalRepositoryView from '../components/common/InstitutionalRepositoryView';
import AnnouncementsSection from '../components/common/AnnouncementsSection';
import TimetableSection from '../components/common/TimetableSection';
import MarksheetModal from '../components/common/MarksheetModal';
import ClearanceBlockedModal from '../components/common/ClearanceBlockedModal';
import VirtualIDCard from '../components/common/VirtualIDCard';
import StudentHallTicketView from '../components/common/StudentHallTicketView';
import { getClearanceForStudent } from '../lib/clearanceData';
import { PRESET_STUDENT_PERSONAS, saveStoredStudentProfile } from '../lib/studentProfiles';
import { printOfficialMarksheet, printOfficialHallTicket } from '../lib/exportFormatHelper';
import { getTeacherForStudent } from '../lib/facultyAssignmentsData';
import {
  getAssignmentMarksStore,
  saveAssignmentMarksStore,
  calculateAssignmentGrade
} from '../lib/assignmentMarksData';
import { getEvaluationsStore } from '../lib/evaluationsData';

export default function StudentPanel({
  activeTab = 'dashboard',
  onNavigate,
  students = [],
  onViewStudent,
  onOpenProfileModal,
  activeStudentProfile
}) {
  const { toast } = useToast();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [selectedSubmissionReview, setSelectedSubmissionReview] = useState(null);

  // Page-Level Pill Tabs & Sub-view States (Sections 1, 15, 16)
  const [attendanceSubTab, setAttendanceSubTab] = useState('overview');
  const [marksSubTab, setMarksSubTab] = useState('overview');
  const [assignmentsFilter, setAssignmentsFilter] = useState('all');
  const [materialsFilter, setMaterialsFilter] = useState('all');
  const [timetableSubTab, setTimetableSubTab] = useState('today');
  const [announcementsFilter, setAnnouncementsFilter] = useState('all');

  // Active student representation (Supports female and male students seamlessly)
  const currentStudent = activeStudentProfile || students[0] || {
    rollNumber: 101,
    name: 'Krrish Sharma',
    gender: 'Male',
    email: 'krrish.sharma@edutrack.edu',
    phone: '+91 98765 43210',
    course: 'IT',
    year: 3,
    division: 'A',
    percentage: 89.50,
    avatarUrl: '/assets/student_avatar.jpg'
  };

  const studentAttendance = currentStudent.attendancePercentage !== undefined
    ? currentStudent.attendancePercentage
    : (currentStudent.gender === 'Female' ? 92.4 : 89.5);
  const isAttendanceEligible = studentAttendance >= 75.0;

  // Clearance, Hall Ticket & Marksheet states
  const [isMarksheetModalOpen, setIsMarksheetModalOpen] = useState(false);
  const [isMarksheetBlockedOpen, setIsMarksheetBlockedOpen] = useState(false);
  const [clearanceVersion, setClearanceVersion] = useState(0);
  const [liveNoticeAlert, setLiveNoticeAlert] = useState(null);

  useEffect(() => {
    const handleClearanceUpdate = () => {
      setClearanceVersion((v) => v + 1);
    };
    window.addEventListener('edutrack_clearance_updated', handleClearanceUpdate);
    return () => window.removeEventListener('edutrack_clearance_updated', handleClearanceUpdate);
  }, []);

  // Real-time instant student notice reception
  useEffect(() => {
    const handleNoticeBroadcast = (e) => {
      const notice = e.detail;
      if (!notice) return;
      if (notice.audience === 'students' || notice.audience === 'all') {
        setLiveNoticeAlert(notice);
        if (toast?.info) {
          toast.info(
            `📢 New Circular: ${notice.title}`,
            `${notice.department || 'Examination & Academic Cell'} · Just now`
          );
        }
      }
    };
    window.addEventListener('edutrack_notice_broadcast', handleNoticeBroadcast);
    return () => window.removeEventListener('edutrack_notice_broadcast', handleNoticeBroadcast);
  }, [toast]);

  const currentStudentClearance = useMemo(() => {
    return getClearanceForStudent(currentStudent.rollNumber);
  }, [currentStudent.rollNumber, clearanceVersion]);

  const handleViewMarksheet = () => {
    const clearance = getClearanceForStudent(currentStudent.rollNumber);
    if (clearance && clearance.marksheetStatus === 'released') {
      setIsMarksheetModalOpen(true);
    } else {
      setIsMarksheetBlockedOpen(true);
    }
  };

  const handlePrintMarksheetDirect = () => {
    const clearance = getClearanceForStudent(currentStudent.rollNumber);
    if (clearance && clearance.marksheetStatus === 'released') {
      printOfficialMarksheet(currentStudent);
      if (toast?.info) {
        toast.info('Marksheet Print View', `Preparing official Grade Transcript for ${currentStudent.name}.`);
      }
    } else {
      setIsMarksheetBlockedOpen(true);
    }
  };

  const handleSwitchPersona = (persona) => {
    saveStoredStudentProfile(persona);
    if (toast?.success) {
      toast.success('Active Student Switched', `Switched candidate profile to ${persona.name} (#${persona.rollNumber}).`);
    }
  };

  const [attendanceTypeFilter, setAttendanceTypeFilter] = useState('all');

  // 1. Detailed Subject-wise & Practical Laboratory Attendance Data (Synced with Clearance)
  const defaultITBreakdown = [
    { code: 'IT-301', name: 'Core Java & OOP Frameworks', type: 'Theory', faculty: 'Prof. Krrish Sharma', totalClasses: 36, attended: 35, percentage: 97.2, status: 'Normal' },
    { code: 'IT-301L', name: 'Core Java Programming Lab', type: 'Practical Lab', faculty: 'Prof. Krrish Sharma', totalClasses: 30, attended: 29, percentage: 96.7, status: 'Normal' },
    { code: 'IT-302', name: 'Database Management Systems', type: 'Theory', faculty: 'Prof. Anjali Mehta', totalClasses: 34, attended: 32, percentage: 94.1, status: 'Normal' },
    { code: 'IT-302L', name: 'DBMS & SQL Query Optimization Lab', type: 'Practical Lab', faculty: 'Prof. Anjali Mehta', totalClasses: 28, attended: 26, percentage: 92.8, status: 'Normal' },
    { code: 'IT-303', name: 'Distributed Systems & Cloud', type: 'Theory', faculty: 'Dr. Vivek Joshi', totalClasses: 38, attended: 35, percentage: 92.1, status: 'Normal' },
    { code: 'IT-304', name: 'Computer Networks & Security', type: 'Theory', faculty: 'Prof. Neha Gupta', totalClasses: 35, attended: 26, percentage: 74.3, status: 'Normal' }
  ];

  const subjectAttendance = useMemo(() => {
    if (currentStudentClearance && currentStudentClearance.subjectBreakdown && currentStudentClearance.subjectBreakdown.length > 0) {
      return currentStudentClearance.subjectBreakdown;
    }
    return defaultITBreakdown;
  }, [currentStudentClearance]);

  const filteredSubjectAttendance = useMemo(() => {
    if (attendanceTypeFilter === 'theory') {
      return subjectAttendance.filter((s) => s.type === 'Theory' || !s.code.includes('L'));
    }
    if (attendanceTypeFilter === 'lab') {
      return subjectAttendance.filter((s) => (s.type && s.type.includes('Lab')) || s.code.includes('L'));
    }
    return subjectAttendance;
  }, [subjectAttendance, attendanceTypeFilter]);

  // Attendance History Logs
  const attendanceHistory = [
    { date: 'Oct 02, 2026', time: '09:00 AM', subject: 'Core Java & OOP', status: 'Present', room: 'Lab A-1' },
    { date: 'Oct 01, 2026', time: '11:15 AM', subject: 'Data Structures', status: 'Present', room: 'Room 302' },
    { date: 'Sep 30, 2026', time: '02:00 PM', subject: 'Computer Networks', status: 'Absent', room: 'Room 204' },
    { date: 'Sep 29, 2026', time: '10:00 AM', subject: 'Database Systems', status: 'Present', room: 'Lab B-2' },
    { date: 'Sep 28, 2026', time: '08:30 AM', subject: 'Core Java & OOP', status: 'Present', room: 'Lab A-1' }
  ];

  // 2. Subject-wise Marks & Performance Breakdown (Synced with Teacher Evaluations Store)
  const subjectMarks = useMemo(() => {
    const evalStore = getEvaluationsStore();
    const marksMatrix = evalStore.marksMatrix || {};
    const cieMarks = marksMatrix['CIE-IT301-01']?.[currentStudent.rollNumber]?.marks ?? (currentStudent.percentage >= 85 ? 28 : 22);
    const labMarks = marksMatrix['LAB-IT301L-01']?.[currentStudent.rollNumber]?.marks ?? (currentStudent.percentage >= 85 ? 24 : 18);
    const midMarks = marksMatrix['MID-IT301-01']?.[currentStudent.rollNumber]?.marks ?? (currentStudent.percentage >= 85 ? 46 : 34);
    const it301Total = cieMarks + midMarks + labMarks;
    const it301Pct = Math.round((it301Total / 105) * 100);

    return [
      {
        code: 'IT-301',
        name: 'Core Java & OOP Frameworks',
        internal: cieMarks,
        internalMax: 30,
        midterm: midMarks,
        midtermMax: 50,
        practical: labMarks,
        practicalMax: 25,
        totalPercent: it301Pct,
        grade: it301Pct >= 90 ? 'O' : it301Pct >= 80 ? 'A+' : it301Pct >= 70 ? 'A' : 'B+'
      },
      {
        code: 'IT-302',
        name: 'Data Structures & Algorithms',
        internal: currentStudent.percentage >= 85 ? 23 : 19,
        internalMax: 25,
        midterm: currentStudent.percentage >= 85 ? 45 : 36,
        midtermMax: 50,
        practical: currentStudent.percentage >= 85 ? 23 : 20,
        practicalMax: 25,
        totalPercent: currentStudent.percentage >= 85 ? 91.0 : 75.0,
        grade: currentStudent.percentage >= 85 ? 'A+' : 'B+'
      },
      {
        code: 'IT-303',
        name: 'Database Management Systems',
        internal: currentStudent.percentage >= 85 ? 24 : 18,
        internalMax: 25,
        midterm: currentStudent.percentage >= 85 ? 47 : 35,
        midtermMax: 50,
        practical: currentStudent.percentage >= 85 ? 24 : 19,
        practicalMax: 25,
        totalPercent: currentStudent.percentage >= 85 ? 95.0 : 72.0,
        grade: currentStudent.percentage >= 85 ? 'O' : 'B'
      },
      {
        code: 'IT-304',
        name: 'Computer Networks',
        internal: currentStudent.percentage >= 85 ? 21 : 16,
        internalMax: 25,
        midterm: currentStudent.percentage >= 85 ? 40 : 32,
        midtermMax: 50,
        practical: currentStudent.percentage >= 85 ? 22 : 18,
        practicalMax: 25,
        totalPercent: currentStudent.percentage >= 85 ? 83.0 : 66.0,
        grade: currentStudent.percentage >= 85 ? 'A' : 'C'
      }
    ];
  }, [currentStudent.rollNumber, currentStudent.percentage, clearanceVersion]);

  // 3. Assignments & Deadlines (Synced with Teacher Assignment Grading Store)
  const baseCourseAssignments = useMemo(() => [
    {
      id: 1,
      code: 'IT-301',
      title: 'JDBC Student Management Project',
      deadline: 'Oct 08, 2026 (11:59 PM)',
      dueDays: 'Due in 5 days',
      totalMarks: 20,
      faculty: 'Prof. Krrish Sharma'
    },
    {
      id: 2,
      code: 'IT-301L',
      title: 'Collections Framework & Generics Lab',
      deadline: 'Oct 14, 2026 (11:59 PM)',
      dueDays: 'Due in 11 days',
      totalMarks: 25,
      faculty: 'Prof. Krrish Sharma'
    },
    {
      id: 3,
      code: 'IT-302',
      title: 'Normalization (3NF/BCNF) Problem Set',
      deadline: 'Oct 18, 2026 (05:00 PM)',
      dueDays: 'Due in 15 days',
      totalMarks: 25,
      faculty: 'Prof. Neha Mehta'
    }
  ], []);

  const assignments = useMemo(() => {
    const store = getAssignmentMarksStore();
    return baseCourseAssignments.map((a) => {
      const assignmentSubmissions = store[a.id] || {};
      const sub = assignmentSubmissions[currentStudent.rollNumber];
      if (sub && sub.submitted) {
        const gradeInfo = calculateAssignmentGrade(sub.marks, a.totalMarks);
        return {
          ...a,
          status: sub.status === 'Graded' ? 'Graded' : 'Submitted',
          awardedMarks: sub.marks,
          percentage: Math.round((sub.marks / a.totalMarks) * 100),
          grade: gradeInfo.grade,
          gradeColor: gradeInfo.color,
          gradeBg: gradeInfo.bg,
          fileName: sub.fileName,
          fileSize: sub.fileSize,
          submissionDate: sub.submissionDate,
          remarks: sub.remarks,
          isEvaluated: sub.status === 'Graded'
        };
      }
      return {
        ...a,
        status: 'Pending',
        awardedMarks: null,
        fileName: null,
        remarks: null,
        isEvaluated: false
      };
    });
  }, [baseCourseAssignments, currentStudent.rollNumber, clearanceVersion]);

  // 4. Study Materials
  const studyMaterials = [
    {
      id: 1,
      title: 'Core Java OOP Complete Slides & Notes',
      subject: 'Core Java & OOP (IT-301)',
      format: 'PDF',
      size: '4.8 MB',
      updated: 'Oct 01, 2026'
    },
    {
      id: 2,
      title: 'MySQL JDBC Connectivity Cheat-Sheet',
      subject: 'Database Systems (IT-303)',
      format: 'PDF',
      size: '1.2 MB',
      updated: 'Sep 28, 2026'
    },
    {
      id: 3,
      title: 'Tree & Graph Algorithms Lab Manual',
      subject: 'Data Structures (IT-302)',
      format: 'PDF',
      size: '3.4 MB',
      updated: 'Sep 22, 2026'
    },
    {
      id: 4,
      title: 'TCP/IP Protocol Suite & Subnetting Guide',
      subject: 'Computer Networks (IT-304)',
      format: 'PDF',
      size: '2.9 MB',
      updated: 'Sep 18, 2026'
    }
  ];

  // 5. Timetable / Upcoming Classes
  const upcomingSchedule = [
    {
      date: 'Tuesday, Oct 06',
      time: '07:00 AM - 07:45 AM',
      course: 'Core Java & OOP',
      assessment: 'Lecture & Lab (Collections & OOP)',
      faculty: 'Prof. Krrish',
      room: 'Lab A-1'
    },
    {
      date: 'Thursday, Oct 08',
      time: '08:00 AM - 09:15 AM',
      course: 'Data Structures & Algorithms',
      assessment: 'Binary Trees & Heap Practical',
      faculty: 'Dr. Joshi',
      room: 'Room 302'
    },
    {
      date: 'Monday, Oct 12',
      time: '11:00 AM - 12:30 PM',
      course: 'Database Management Systems',
      assessment: 'Normalization & Indexing Lab',
      faculty: 'Prof. Mehta',
      room: 'Lab B-2'
    }
  ];

  // 6. Announcements & Circulars
  const announcements = [
    {
      id: 1,
      title: 'Semester 6 Final Examination Schedule Released',
      department: 'Examination Cell',
      date: 'Oct 02, 2026',
      message: 'The final timetable for theory and laboratory examinations has been published under Schedule.',
      tag: 'Important'
    },
    {
      id: 2,
      title: 'Annual Academic Project Registration Open',
      department: 'IT Department',
      date: 'Sep 29, 2026',
      message: 'Register your capstone project groups for Semester 6 evaluation before Oct 15.',
      tag: 'Academic'
    },
    {
      id: 3,
      title: 'Guest Lecture on Distributed Systems',
      department: 'Computer Science',
      date: 'Sep 25, 2026',
      message: 'Lecture on Cloud Architecture & Kubernetes this Friday in Auditorium 1.',
      tag: 'Seminar'
    }
  ];

  const handleSubmitAssignment = (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    const store = getAssignmentMarksStore();
    const assignmentMap = { ...(store[selectedAssignment.id] || {}) };
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const fname = submissionFile ? submissionFile.split(/(\\|\/)/).pop() : `${selectedAssignment.code}_Deliverable.zip`;

    assignmentMap[currentStudent.rollNumber] = {
      submitted: true,
      submissionDate: dateStr,
      fileName: fname,
      fileSize: '3.2 MB',
      marks: 0,
      remarks: submissionNotes || 'Deliverable uploaded by candidate. Awaiting faculty evaluation.',
      status: 'Submitted'
    };
    store[selectedAssignment.id] = assignmentMap;
    saveAssignmentMarksStore(store);

    setClearanceVersion((v) => v + 1);
    setIsSubmitModalOpen(false);
    toast.success(
      'Assignment Submitted',
      `"${selectedAssignment.title}" uploaded successfully. Faculty notified.`
    );
    setSubmissionFile('');
    setSubmissionNotes('');
  };

  // Attendance Metrics (Synced with Clearance & Admin Adjustments)
  const overallAtt = currentStudentClearance?.attendance ?? currentStudent?.attendance ?? 89.5;
  const theoryAtt = currentStudentClearance?.theoryAttendance ?? (overallAtt > 80 ? overallAtt - 1.5 : overallAtt);
  const labAtt = currentStudentClearance?.labAttendance ?? (overallAtt > 80 ? overallAtt + 3.0 : overallAtt);
  const isCondoned = Boolean(currentStudentClearance?.condonationGranted);
  const hasAttendanceWarning = overallAtt < 75 && !isCondoned;

  return (
    <div>
      {/* Attendance Warning Alert (Triggered when overall attendance < 75% and no condonation) */}
      {hasAttendanceWarning ? (
        <Alert
          type="warning"
          title="Institutional Attendance Warning"
          message={`Your overall attendance is ${Number(overallAtt).toFixed(1)}%, which is below the mandatory 75.0% institutional requirement for examination clearance.`}
          actionText="VIEW ATTENDANCE"
          onAction={() => onNavigate && onNavigate('attendance')}
        />
      ) : isCondoned && overallAtt < 75 ? (
        <Alert
          type="info"
          title="Medical / Condonation Waiver Active"
          message={`Your overall attendance is ${Number(overallAtt).toFixed(1)}%, but an approved institutional waiver grants you examination and hall ticket clearance.`}
          actionText="VIEW CLEARANCE"
          onAction={() => onNavigate && onNavigate('attendance')}
        />
      ) : null}

      {/* Real-time Notice Broadcast Instant Banner */}
      {liveNoticeAlert && (
        <Alert
          type="info"
          title={`Official Circular Broadcasted: "${liveNoticeAlert.title}"`}
          message={`${liveNoticeAlert.department ? liveNoticeAlert.department + ' — ' : ''}${liveNoticeAlert.message || liveNoticeAlert.details}`}
          actionText="VIEW CIRCULAR"
          onAction={() => {
            setLiveNoticeAlert(null);
            onNavigate && onNavigate('announcements');
          }}
        />
      )}

      {/* =========================================================================
          VIEW 1: DASHBOARD (STUDENT DASHBOARD PER SECTION 8)
          - Attendance summary
          - Current academic performance
          - Pending assignments
          - Upcoming classes
          - Important announcements
          ========================================================================= */}
      {activeTab === 'dashboard' && (
        <>
          {/* Dashboard Header */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Dashboard</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Welcome back, {currentStudent.name.split(' ')[0]}.</span>
          </div>

          {/* Metric Cards Row */}
          <div className="stats-grid" style={{ marginBottom: 20 }}>
            <div className="stat-card">
              <span className="stat-label">Attendance</span>
              <span className="stat-value" style={{ color: isAttendanceEligible ? '#059669' : '#dc2626' }}>
                {Number(studentAttendance).toFixed(1)}%
              </span>
              <span className="stat-sub">
                {isAttendanceEligible ? 'Eligible' : 'Below 75%'}
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Overall Score</span>
              <span className="stat-value">{Number(currentStudent.percentage || 89.5).toFixed(1)}%</span>
              <span className="stat-sub">{currentStudent.cgpa ? `${currentStudent.cgpa} CGPA` : 'Tier A+'}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Pending Assignments</span>
              <span className="stat-value" style={{ color: 'var(--warning)' }}>
                {assignments.filter((a) => a.status === 'Pending').length}
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Active Courses</span>
              <span className="stat-value">4</span>
            </div>
          </div>

          {/* Upcoming Classes Table */}
          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Upcoming Classes</h3>
              </div>
            </div>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Schedule</th>
                  <th>Course</th>
                  <th>Topic</th>
                  <th>Faculty</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {upcomingSchedule.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</div>
                    </td>
                    <td><strong>{item.course}</strong></td>
                    <td>{item.assessment}</td>
                    <td>{item.faculty}</td>
                    <td>
                      <span className="badge badge-neutral">{item.room}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: ATTENDANCE (SECTIONS 1, 15, 19)
          Pills: [Overview] [By Subject] [History]
          ========================================================================= */}
      {activeTab === 'attendance' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <PillTabs
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'by-subject', label: 'By Subject', count: subjectAttendance.length },
                { id: 'history', label: 'History', count: attendanceHistory.length }
              ]}
              activeTab={attendanceSubTab}
              onChange={setAttendanceSubTab}
            />
          </div>

          {attendanceSubTab === 'overview' && (
            <>
              {/* Institutional Rule Banner */}
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  flexShrink: 0
                }}>
                  <GraduationCap size={18} />
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Institutional Clearance Criteria:</strong> University examination clearance and Hall Ticket generation are determined by <strong>Overall Cumulative Attendance (≥ 75.0%)</strong> across all subjects and laboratory sessions combined. Individual subject variations do not block eligibility if overall attendance meets 75.0% or an institutional condonation is granted.
                </div>
              </div>

              <div className="stats-grid" style={{ marginBottom: 20 }}>
                <div className="stat-card">
                  <span className="stat-label">Overall Attendance</span>
                  <span className="stat-value" style={{ color: overallAtt >= 75 || isCondoned ? 'var(--success)' : 'var(--danger)' }}>
                    {Number(overallAtt).toFixed(1)}%
                  </span>
                  <span className="stat-sub">
                    {overallAtt >= 75 ? 'Criteria met (≥75%)' : isCondoned ? 'Waiver applied' : 'Below 75%'}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Theory Classes</span>
                  <span className="stat-value" style={{ color: '#2563eb' }}>
                    {Number(theoryAtt).toFixed(1)}%
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Practical Labs</span>
                  <span className="stat-value" style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FlaskConical size={20} />
                    {Number(labAtt).toFixed(1)}%
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Clearance Status</span>
                  <span className="stat-value" style={{ fontSize: '1.25rem', color: overallAtt >= 75 || isCondoned ? 'var(--success)' : 'var(--danger)' }}>
                    {overallAtt >= 75 ? 'Clearance OK' : isCondoned ? 'Waiver OK' : 'Defaulter'}
                  </span>
                  <span className="stat-sub">
                    {overallAtt >= 75 || isCondoned ? 'Hall Ticket Eligible' : 'Contact HOD Office'}
                  </span>
                </div>
              </div>

              <div className="table-container" style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div className="table-header-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 18px' }}>
                  <div>
                    <h3 className="table-title" style={{ fontSize: '0.92rem' }}>Attendance</h3>
                  </div>

                  {/* Filter Pills */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                    {[
                      { id: 'all', label: `All (${subjectAttendance.length})` },
                      { id: 'theory', label: `Theory (${subjectAttendance.filter(s => s.type === 'Theory' || !s.code.includes('L')).length})` },
                      { id: 'lab', label: `Labs (${subjectAttendance.filter(s => (s.type && s.type.includes('Lab')) || s.code.includes('L')).length})` }
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setAttendanceTypeFilter(f.id)}
                        style={{
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: attendanceTypeFilter === f.id ? 600 : 500,
                          cursor: 'pointer',
                          border: 'none',
                          background: attendanceTypeFilter === f.id ? '#ffffff' : 'transparent',
                          color: attendanceTypeFilter === f.id ? '#0f172a' : '#64748b',
                          boxShadow: attendanceTypeFilter === f.id ? '0 1px 2px rgba(15, 23, 42, 0.08)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <table className="clean-table" style={{ margin: 0 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Course</th>
                      <th style={{ width: '130px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Type</th>
                      <th style={{ padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Faculty Mentor</th>
                      <th style={{ width: '120px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Attended</th>
                      <th style={{ width: '110px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Percentage</th>
                      <th style={{ width: '180px', textAlign: 'right', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Clearance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubjectAttendance.map((item) => {
                      const isLab = (item.type && item.type.includes('Lab')) || item.code.includes('L');
                      const isOverallCleared = overallAtt >= 75 || isCondoned;

                      return (
                        <tr key={item.code} style={{ borderBottom: '1px solid #f1f5f9', background: isLab ? 'rgba(240, 253, 244, 0.35)' : '#ffffff' }}>
                          <td style={{ padding: '10px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontFamily: 'ui-monospace, monospace',
                                  fontWeight: 700,
                                  color: isLab ? '#047857' : '#2563eb',
                                  background: isLab ? '#ecfdf5' : '#eff6ff',
                                  border: isLab ? '1px solid #bbf7d0' : '1px solid #dbeafe',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {item.code}
                              </span>
                              <strong style={{ color: '#0f172a', fontSize: '0.84rem' }}>{item.name}</strong>
                            </div>
                          </td>
                          <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                background: isLab ? '#ecfdf5' : '#eff6ff',
                                color: isLab ? '#047857' : '#1d4ed8',
                                border: isLab ? '1px solid #a7f3d0' : '1px solid #bfdbfe'
                              }}
                            >
                              {isLab ? <FlaskConical size={11} color="#047857" /> : <BookOpen size={11} color="#1d4ed8" />}
                              <span>{isLab ? 'Practical Lab' : 'Theory Class'}</span>
                            </span>
                          </td>
                          <td style={{ padding: '10px 16px', color: '#475569', fontSize: '0.8rem' }}>{item.faculty}</td>
                          <td style={{ padding: '10px 16px', fontWeight: 600, color: '#334155', fontSize: '0.82rem' }}>
                            {item.attended} / {item.totalClasses}
                          </td>
                          <td style={{ padding: '10px 16px' }}>
                            <strong style={{ fontSize: '0.88rem', color: item.percentage >= 75 ? 'var(--success)' : '#d97706' }}>
                              {Number(item.percentage).toFixed(1)}%
                            </strong>
                          </td>
                          <td style={{ textAlign: 'right', padding: '10px 16px' }}>
                            {isOverallCleared ? (
                              item.percentage >= 75 ? (
                                <span className="badge badge-success">✓ Eligible</span>
                              ) : (
                                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#047857', background: '#ecfdf5', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                                  ✓ Cleared (Overall ≥75%)
                                </span>
                              )
                            ) : (
                              <span className="badge badge-danger">⚠️ Defaulter (&lt;75%)</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {attendanceSubTab === 'by-subject' && (
            <div className="table-container" style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div className="table-header-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 18px' }}>
                <div>
                  <h3 className="table-title" style={{ fontSize: '0.92rem' }}>Subject Attendance</h3>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                  {[
                    { id: 'all', label: `All (${subjectAttendance.length})` },
                    { id: 'theory', label: `Theory (${subjectAttendance.filter(s => s.type === 'Theory' || !s.code.includes('L')).length})` },
                    { id: 'lab', label: `Labs (${subjectAttendance.filter(s => (s.type && s.type.includes('Lab')) || s.code.includes('L')).length})` }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setAttendanceTypeFilter(f.id)}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontSize: '0.73rem',
                        fontWeight: attendanceTypeFilter === f.id ? 600 : 500,
                        cursor: 'pointer',
                        border: 'none',
                        background: attendanceTypeFilter === f.id ? '#ffffff' : 'transparent',
                        color: attendanceTypeFilter === f.id ? '#0f172a' : '#64748b',
                        boxShadow: attendanceTypeFilter === f.id ? '0 1px 2px rgba(15, 23, 42, 0.08)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <table className="clean-table" style={{ margin: 0 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Subject Code & Course</th>
                    <th style={{ width: '130px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Type</th>
                    <th style={{ padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Faculty Mentor</th>
                    <th style={{ width: '70px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Present</th>
                    <th style={{ width: '70px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Absent</th>
                    <th style={{ width: '70px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Total</th>
                    <th style={{ width: '110px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Percentage</th>
                    <th style={{ width: '180px', textAlign: 'right', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>Eligibility Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjectAttendance.map((item) => {
                    const isLab = (item.type && item.type.includes('Lab')) || item.code.includes('L');
                    const absent = item.totalClasses - item.attended;
                    const isOverallCleared = overallAtt >= 75 || isCondoned;

                    return (
                      <tr key={item.code} style={{ borderBottom: '1px solid #f1f5f9', background: isLab ? 'rgba(240, 253, 244, 0.35)' : '#ffffff' }}>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontFamily: 'ui-monospace, monospace',
                                fontWeight: 700,
                                color: isLab ? '#047857' : '#2563eb',
                                background: isLab ? '#ecfdf5' : '#eff6ff',
                                border: isLab ? '1px solid #bbf7d0' : '1px solid #dbeafe',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.code}
                            </span>
                            <strong style={{ color: '#0f172a', fontSize: '0.84rem' }}>{item.name}</strong>
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              background: isLab ? '#ecfdf5' : '#eff6ff',
                              color: isLab ? '#047857' : '#1d4ed8',
                              border: isLab ? '1px solid #a7f3d0' : '1px solid #bfdbfe'
                            }}
                          >
                            {isLab ? <FlaskConical size={11} color="#047857" /> : <BookOpen size={11} color="#1d4ed8" />}
                            <span>{isLab ? 'Practical Lab' : 'Theory Class'}</span>
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', color: '#475569', fontSize: '0.8rem' }}>{item.faculty}</td>
                        <td style={{ padding: '10px 16px', color: 'var(--success)', fontWeight: 600 }}>{item.attended}</td>
                        <td style={{ padding: '10px 16px', color: 'var(--danger)', fontWeight: 600 }}>{absent}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 600, color: '#64748b' }}>{item.totalClasses}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <strong style={{ fontSize: '0.88rem', color: item.percentage >= 75 ? 'var(--success)' : '#d97706' }}>
                            {Number(item.percentage).toFixed(1)}%
                          </strong>
                        </td>
                        <td style={{ textAlign: 'right', padding: '10px 16px' }}>
                          {isOverallCleared ? (
                            item.percentage >= 75 ? (
                              <span className="badge badge-success">✓ Eligible</span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#047857', background: '#ecfdf5', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                                ✓ Cleared (Overall ≥75%)
                              </span>
                            )
                          ) : (
                            <span className="badge badge-danger">⚠️ Defaulter (&lt;75%)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {attendanceSubTab === 'history' && (
            <div className="table-container">
              <div className="table-header-bar">
                <div>
                  <h3 className="table-title">Session History</h3>
                </div>
              </div>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Subject</th>
                    <th>Classroom / Lab</th>
                    <th style={{ textAlign: 'right' }}>Recorded Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.date} · {log.time}</td>
                      <td><strong>{log.subject}</strong></td>
                      <td>{log.room}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge ${log.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          VIEW 3: MARKS (SECTIONS 1, 15, 20)
          Pills: [Overview] [Subject-wise] [Exams]
          ========================================================================= */}
      {activeTab === 'marks' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <PillTabs
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'subject-wise', label: 'Subject-wise', count: subjectMarks.length },
                { id: 'exams', label: 'Exams' }
              ]}
              activeTab={marksSubTab}
              onChange={setMarksSubTab}
            />
          </div>

          {marksSubTab === 'overview' && (
            <>
              {/* Official Marksheet Transcript Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  borderRadius: '16px',
                  color: '#ffffff',
                  marginBottom: '20px',
                  boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      background: 'rgba(37, 99, 235, 0.25)',
                      border: '1px solid rgba(96, 165, 250, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#93c5fd'
                    }}
                  >
                    <Award size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                        Official Semester 6 Marksheet & Grade Transcript
                      </h4>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 9999,
                          background: currentStudentClearance?.marksheetStatus === 'released' ? '#dcfce7' : '#fee2e2',
                          color: currentStudentClearance?.marksheetStatus === 'released' ? '#15803d' : '#b91c1c'
                        }}
                      >
                        {currentStudentClearance?.marksheetStatus === 'released' ? 'Released & Live' : 'Withheld / Clearance Required'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      Verified autonomous ledger · Controller of Examinations
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handlePrintMarksheetDirect}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '10px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title="Print official semester marksheet and credit transcript"
                  >
                    <Printer size={14} />
                    <span>Print Marksheet</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleViewMarksheet}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <FileText size={14} />
                    <span>View Official Marksheet</span>
                  </button>
                </div>
              </div>

              <div className="stats-grid" style={{ marginBottom: 20 }}>
                <div className="stat-card">
                  <span className="stat-label">Cumulative Performance</span>
                  <span className="stat-value" style={{ color: 'var(--primary)' }}>89.0%</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Academic Tier</span>
                  <span className="stat-value">A+</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Total Subjects</span>
                  <span className="stat-value">4</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Credits Earned</span>
                  <span className="stat-value" style={{ color: 'var(--success)' }}>15 / 15</span>
                </div>
              </div>

              <div className="table-container">
                <div className="table-header-bar">
                  <div>
                    <h3 className="table-title">Performance Summary</h3>
                  </div>
                </div>
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Total Obtained</th>
                      <th>Maximum Marks</th>
                      <th>Percentage</th>
                      <th style={{ textAlign: 'right' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectMarks.map((item) => {
                      const totalObtained = item.internal + item.midterm + item.practical;
                      const totalMax = item.internalMax + item.midtermMax + item.practicalMax;
                      return (
                        <tr key={item.code}>
                          <td><strong>{item.code}</strong> — {item.name}</td>
                          <td>{totalObtained}</td>
                          <td>{totalMax}</td>
                          <td><strong>{item.totalPercent}%</strong></td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="badge badge-success">{item.grade}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {marksSubTab === 'subject-wise' && (
            <div className="table-container">
              <div className="table-header-bar">
                <div>
                  <h3 className="table-title">Subject Breakdown</h3>
                </div>
              </div>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Internal (25)</th>
                    <th>Midterm (50)</th>
                    <th>Practical (25)</th>
                    <th>Total (100)</th>
                    <th style={{ textAlign: 'right' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectMarks.map((item) => (
                    <tr key={item.code}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.code}</div>
                      </td>
                      <td>{item.internal} / {item.internalMax}</td>
                      <td>{item.midterm} / {item.midtermMax}</td>
                      <td>{item.practical} / {item.practicalMax}</td>
                      <td><strong>{item.totalPercent}%</strong></td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-success">{item.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {marksSubTab === 'exams' && (
            <div className="table-container">
              <div className="table-header-bar">
                <div>
                  <h3 className="table-title">Examination Schedule</h3>
                </div>
              </div>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Exam Type</th>
                    <th>Scheduled Date</th>
                    <th>Max Marks</th>
                    <th>Room</th>
                    <th style={{ textAlign: 'right' }}>Admit Slip</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectMarks.map((item, idx) => (
                    <tr key={item.code}>
                      <td><strong>{item.code}</strong> — {item.name}</td>
                      <td>Semester End Theory</td>
                      <td>Nov {10 + idx * 3}, 2026</td>
                      <td>100</td>
                      <td>Exam Hall 2</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => toast.success('Slip Downloaded', `Admit card for ${item.code} saved.`)}
                        >
                          <Download size={13} />
                          <span>Hall Ticket</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          VIEW 4: ASSIGNMENTS (SECTIONS 1, 15, 21)
          Pills: [All] [Pending] [Submitted] [Completed]
          ========================================================================= */}
      {activeTab === 'assignments' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <PillTabs
              tabs={[
                { id: 'all', label: 'All', count: assignments.length },
                { id: 'pending', label: 'Pending', count: assignments.filter((a) => a.status === 'Pending').length },
                { id: 'submitted', label: 'Submitted', count: assignments.filter((a) => a.status === 'Submitted').length },
                { id: 'completed', label: 'Completed', count: assignments.filter((a) => a.status === 'Graded' || a.status === 'Completed').length }
              ]}
              activeTab={assignmentsFilter}
              onChange={setAssignmentsFilter}
            />
          </div>

          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Assignments</h3>
              </div>
            </div>
            {assignments.filter((item) => {
              if (assignmentsFilter === 'all') return true;
              if (assignmentsFilter === 'pending') return item.status === 'Pending';
              if (assignmentsFilter === 'submitted') return item.status === 'Submitted';
              if (assignmentsFilter === 'completed') return item.status === 'Graded' || item.status === 'Completed';
              return true;
            }).length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No assignments found in this view.
              </div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                <table className="clean-table" style={{ minWidth: '920px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '180px' }}>Course & Title</th>
                      <th style={{ width: '150px' }}>Faculty & Deadline</th>
                      <th style={{ width: '160px' }}>Submitted File</th>
                      <th style={{ width: '130px' }}>Marks Awarded</th>
                      <th style={{ width: '80px' }}>Grade</th>
                      <th style={{ minWidth: '200px' }}>Faculty Feedback</th>
                      <th style={{ width: '110px' }}>Status</th>
                      <th style={{ width: '110px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments
                      .filter((item) => {
                        if (assignmentsFilter === 'all') return true;
                        if (assignmentsFilter === 'pending') return item.status === 'Pending';
                        if (assignmentsFilter === 'submitted') return item.status === 'Submitted';
                        if (assignmentsFilter === 'completed') return item.status === 'Graded' || item.status === 'Completed';
                        return true;
                      })
                      .map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div style={{ fontWeight: 650, color: '#0f172a' }}>{item.title}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.code}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{item.faculty}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.deadline}</div>
                          </td>
                          <td>
                            {item.fileName ? (
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: '#2563eb',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '150px'
                                }}
                                title={item.fileName}
                              >
                                {item.fileName}
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                Not uploaded yet
                              </span>
                            )}
                          </td>
                          <td>
                            {item.isEvaluated ? (
                              <div>
                                <span style={{ fontWeight: 700, color: '#059669', fontSize: '0.86rem' }}>
                                  {item.awardedMarks}
                                </span>
                                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                  {' '}/ {item.totalMarks} pts ({item.percentage}%)
                                </span>
                              </div>
                            ) : item.status === 'Submitted' ? (
                              <span style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 600 }}>
                                Under Review
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                                — / {item.totalMarks} pts
                              </span>
                            )}
                          </td>
                          <td>
                            {item.isEvaluated ? (
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: item.gradeBg,
                                  color: item.gradeColor
                                }}
                              >
                                {item.grade}
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>—</span>
                            )}
                          </td>
                          <td>
                            {item.remarks ? (
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#334155',
                                  background: '#f8fafc',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  maxWidth: '240px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                title={item.remarks}
                              >
                                "{item.remarks}"
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                Awaiting evaluation
                              </span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === 'Pending'
                                  ? 'badge-warning'
                                  : item.status === 'Submitted'
                                  ? 'badge-neutral'
                                  : 'badge-success'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {item.status === 'Pending' ? (
                              <button
                                className="btn-primary btn-sm"
                                onClick={() => {
                                  setSelectedAssignment(item);
                                  setIsSubmitModalOpen(true);
                                }}
                              >
                                <Upload size={13} />
                                <span>Submit</span>
                              </button>
                            ) : (
                              <button
                                className="btn-secondary btn-sm"
                                onClick={() => setSelectedSubmissionReview(item)}
                              >
                                <Eye size={13} />
                                <span>Details</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 5: STUDY MATERIALS (SECTIONS 1, 15, 22)
          Pills: [All] [Notes] [PDF] [Links]
          ========================================================================= */}
      {activeTab === 'materials' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <PillTabs
              tabs={[
                { id: 'all', label: 'All', count: studyMaterials.length },
                { id: 'notes', label: 'Notes' },
                { id: 'pdf', label: 'PDF' },
                { id: 'links', label: 'Links' }
              ]}
              activeTab={materialsFilter}
              onChange={setMaterialsFilter}
            />
          </div>

          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Materials</h3>
              </div>
            </div>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Package Title</th>
                  <th>Subject</th>
                  <th>Format</th>
                  <th>File Size</th>
                  <th>Last Updated</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {studyMaterials
                  .filter((mat) => {
                    if (materialsFilter === 'all') return true;
                    if (materialsFilter === 'notes') return mat.title.toLowerCase().includes('notes');
                    if (materialsFilter === 'pdf') return mat.format.toUpperCase() === 'PDF';
                    if (materialsFilter === 'links') return mat.format.toUpperCase() === 'LINK';
                    return true;
                  })
                  .map((mat) => (
                    <tr key={mat.id}>
                      <td><strong>{mat.title}</strong></td>
                      <td>{mat.subject}</td>
                      <td>
                        <span className="badge badge-neutral">{mat.format}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{mat.size}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{mat.updated}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() =>
                            toast.success('Download Complete', `${mat.title} saved to downloads.`)
                          }
                        >
                          <Download size={13} />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW: INSTITUTIONAL RESOURCE & DOCUMENT REPOSITORY (NEW DEDICATED SECTION)
          ========================================================================= */}
      {activeTab === 'repository' && (
        <InstitutionalRepositoryView role="student" />
      )}

      {/* =========================================================================
          VIEW: EXAM HALL TICKET (OFFICIAL COMBINED ADMIT CARD)
          ========================================================================= */}
      {activeTab === 'hall-ticket' && (
        <StudentHallTicketView student={currentStudent} />
      )}

      {/* =========================================================================
          VIEW 6: TIMETABLE & EXAM SCHEDULE (Apple-Grade Interactive Hub)
          ========================================================================= */}
      {activeTab === 'timetable' && (
        <TimetableSection
          role="student"
          currentSemester="Semester 6"
          assignedDivision={`Div ${currentStudent.division || 'A'}`}
        />
      )}

      {/* =========================================================================
          VIEW 7: ANNOUNCEMENTS (SECTIONS 1, 15, 39)
          Pills: [All] [College] [Class] [Subject]
          ========================================================================= */}
      {activeTab === 'announcements' && (
        <AnnouncementsSection
          title="Announcements"
          role="student"
        />
      )}
      {/* =========================================================================
          VIEW 8: NOTIFICATIONS (COMMUNICATION)
          ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="table-container">
          <div className="table-header-bar">
            <div>
              <h3 className="table-title">Notifications</h3>
            </div>
            <button
              className="btn-secondary btn-sm"
              onClick={() => toast.success('Cleared', 'All notifications marked as read.')}
            >
              <Check size={14} />
              <span>Mark All Read</span>
            </button>
          </div>
          <div style={{ padding: '8px 20px' }}>
            <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--danger)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Attendance Threshold Warning</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>1 hour ago</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Computer Networks attendance is currently 74.3%. Minimum requirement is 75%. Please attend upcoming lab sessions.
                </p>
              </div>
            </div>

            <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--secondary)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>New Assignment Uploaded</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>3 hours ago</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Prof. Krrish published "JDBC Student Management Console" due on Oct 08, 11:59 PM.
                </p>
              </div>
            </div>

            <div style={{ padding: '14px 0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Lab Grade Published</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Yesterday</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Core Java Lab #4 marks committed: 24/25 (Grade: A+). Feedback: "Excellent JDBC DAO implementation."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 8.5: PROFILE & VIRTUAL ID CARD (STUDENT SMART IDENTITY PASSPORT)
          ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="profile-page-container">
          {/* Top Profile Hero Card */}
          <div className="profile-page-hero">
            <div className="profile-hero-left">
              <div className="profile-hero-avatar-wrap">
                <img
                  src={currentStudent.avatarUrl || (currentStudent.gender === 'Female' ? '/assets/female_student_avatar.jpg' : '/assets/student_avatar.jpg')}
                  alt={currentStudent.name}
                  className="profile-hero-avatar-img"
                />
              </div>
              <div className="profile-hero-info">
                <div className="profile-hero-title-row">
                  <h2 className="profile-hero-name">{currentStudent.name}</h2>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: currentStudent.gender === 'Female' ? '#fdf2f8' : '#ecfdf5',
                    color: currentStudent.gender === 'Female' ? '#be185d' : '#065f46',
                    border: `1px solid ${currentStudent.gender === 'Female' ? '#fbcfe8' : '#a7f3d0'}`
                  }}>
                    {currentStudent.gender === 'Female' ? '👩‍🎓 Female Candidate' : '👨‍🎓 Male Candidate'}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe'
                  }}>
                    PRN: {currentStudent.prn || `PRN-2024098${currentStudent.rollNumber}`}
                  </span>
                </div>
                <span className="profile-hero-sub">
                  Enrolled Candidate · {currentStudent.programFull || `B.Tech in ${currentStudent.course}`} (Year {currentStudent.year}, {currentStudent.semester || 'Semester 6'}, Div {currentStudent.division || 'A'})
                </span>
                <div className="profile-hero-tags">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} /> {currentStudent.location || 'Classroom 302, Academic Block A'}
                  </span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={13} /> {currentStudent.email}
                  </span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={13} /> {currentStudent.phone || '+91 98765 43210'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-hero-actions">
              <button
                type="button"
                className="profile-edit-trigger-btn"
                onClick={() => onOpenProfileModal && onOpenProfileModal('edit')}
                title="Edit student profile details"
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onOpenProfileModal && onOpenProfileModal('profile')}
                style={{ height: '42px', borderRadius: '12px' }}
                title="Open comprehensive profile modal dialog"
              >
                <ExternalLink size={15} />
                <span>Modal View</span>
              </button>
            </div>
          </div>

          {/* Persona Switcher Quick Row (Easily test female and male profiles) */}
          <div className="profile-persona-quick-switcher">
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} color="#059669" />
              <span>Quick Candidate Switcher:</span>
            </span>
            {PRESET_STUDENT_PERSONAS.map((p) => {
              const isActive = Number(currentStudent.rollNumber) === Number(p.rollNumber);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`profile-persona-chip ${isActive ? 'active' : ''}`}
                  onClick={() => handleSwitchPersona(p)}
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="profile-persona-avatar-sm"
                  />
                  <span>{p.name} (#{p.rollNumber})</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    {p.gender === 'Female' ? '👩‍🎓' : '👨‍🎓'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2-Column Content Grid: 3D ID Card + Verified Dossier */}
          <div className="profile-page-grid">
            {/* Left Column: 3D Virtual Student ID Card */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="#059669" />
                  <span>Institutional Virtual ID Card</span>
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '3px 10px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
                  ✓ RFID & Barcode Verified
                </span>
              </div>
              <VirtualIDCard student={currentStudent} />
            </div>

            {/* Right Column: Academic Dossier & Direct Services */}
            <div className="profile-dossier-card">
              <div className="profile-dossier-header">
                <h4 className="profile-dossier-title">
                  <ShieldCheck size={18} color="#2563eb" />
                  <span>Verified Academic Registry Dossier</span>
                </h4>
                <span className="badge badge-success">Active Enrolment</span>
              </div>

              <div className="profile-dossier-body">
                {/* Institutional Credentials */}
                <div className="profile-dossier-section">
                  <span className="profile-dossier-section-title">Enrolment & Programme</span>
                  <div className="profile-dossier-kv-grid">
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Roll Number</span>
                      <strong className="profile-kv-value">#{currentStudent.rollNumber}</strong>
                    </div>
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Permanent Reg. No (PRN)</span>
                      <strong className="profile-kv-value" style={{ fontFamily: 'monospace' }}>
                        {currentStudent.prn || `PRN-2024098${currentStudent.rollNumber}`}
                      </strong>
                    </div>
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Department</span>
                      <strong className="profile-kv-value">{currentStudent.course}</strong>
                    </div>
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Division & Cohort</span>
                      <strong className="profile-kv-value">Division {currentStudent.division || 'A'} · Cohort 2024-28</strong>
                    </div>
                    <div className="profile-kv-item" style={{ gridColumn: 'span 2' }}>
                      <span className="profile-kv-label">Degree Curriculum</span>
                      <strong className="profile-kv-value">
                        {currentStudent.programFull || `Bachelor of Technology in ${currentStudent.course}`}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Academic & Attendance Health */}
                <div className="profile-dossier-section" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <span className="profile-dossier-section-title">Academic & Attendance Status</span>
                  <div className="profile-dossier-kv-grid">
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Academic Score / CGPA</span>
                      <strong className="profile-kv-value" style={{ color: '#2563eb' }}>
                        {Number(currentStudent.percentage || 89.5).toFixed(1)}% ({currentStudent.cgpa || 8.82} CGPA)
                      </strong>
                    </div>
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Attendance Rate</span>
                      <strong className="profile-kv-value" style={{ color: isAttendanceEligible ? '#059669' : '#dc2626' }}>
                        {Number(studentAttendance).toFixed(1)}% {isAttendanceEligible ? '✓ Clearance OK' : '⚠️ Warning'}
                      </strong>
                    </div>
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Fee Clearance</span>
                      <strong className="profile-kv-value" style={{ color: '#059669' }}>
                        {currentStudentClearance?.feeStatus === 'paid' ? '✓ Fully Cleared' : 'Pending Verification'}
                      </strong>
                    </div>
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Admit Card Clearance</span>
                      <strong className="profile-kv-value" style={{ color: currentStudentClearance?.hallTicketAllowed ? '#059669' : '#dc2626' }}>
                        {currentStudentClearance?.hallTicketAllowed ? '✓ Unlocked' : 'Gatekeeper Hold'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Direct Emergency & Institutional Contacts */}
                <div className="profile-dossier-section" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <span className="profile-dossier-section-title">Contact & Dispatch Registry</span>
                  <div className="profile-dossier-kv-grid">
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Institutional Email</span>
                      <strong className="profile-kv-value">{currentStudent.email}</strong>
                    </div>
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Emergency Mobile</span>
                      <strong className="profile-kv-value">{currentStudent.phone || '+91 98765 43210'}</strong>
                    </div>
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Blood Group</span>
                      <strong className="profile-kv-value" style={{ color: '#ef4444' }}>
                        {currentStudent.bloodGroup || (currentStudent.gender === 'Female' ? 'A+' : 'O+')}
                      </strong>
                    </div>
                    <div className="profile-kv-item">
                      <span className="profile-kv-label">Hostel / Campus Desk</span>
                      <strong className="profile-kv-value">{currentStudent.location || 'Classroom 302, Academic Block A'}</strong>
                    </div>
                  </div>
                </div>

                {/* Assigned Academic Mentors & Faculty Roles (Requirement 3) */}
                {(() => {
                  const mentors = getTeacherForStudent(currentStudent);
                  return (
                    <div className="profile-dossier-section" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                      <span className="profile-dossier-section-title">Assigned Faculty Mentors & Academic Roles</span>
                      <div className="profile-dossier-kv-grid">
                        <div className="profile-kv-item">
                          <span className="profile-kv-label">Class Teacher (Div {currentStudent.division || 'A'})</span>
                          <strong className="profile-kv-value" style={{ color: '#2563eb' }}>
                            {mentors.classTeacher ? mentors.classTeacher.name : 'Prof. Krrish Sharma'} (Cabin F-204)
                          </strong>
                        </div>
                        <div className="profile-kv-item">
                          <span className="profile-kv-label">Guardian Faculty Member (GFM)</span>
                          <strong className="profile-kv-value" style={{ color: '#7c3aed' }}>
                            {mentors.gfm ? mentors.gfm.name : 'Prof. Anjali Mehta'} (Mentorship Cohort)
                          </strong>
                        </div>
                        <div className="profile-kv-item" style={{ gridColumn: 'span 2' }}>
                          <span className="profile-kv-label">Department Head (HOD) & Academic Oversight</span>
                          <strong className="profile-kv-value">
                            Dr. Vivek Joshi · Department of {currentStudent.course || 'Information Technology'}
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1, minWidth: '150px', justifyContent: 'center' }}
                    onClick={handleViewMarksheet}
                  >
                    <FileText size={15} />
                    <span>View Marksheet</span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1, minWidth: '150px', justifyContent: 'center' }}
                    onClick={() => onOpenProfileModal && onOpenProfileModal('edit')}
                  >
                    <Edit3 size={15} />
                    <span>Edit Profile Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 9: SETTINGS (ACCOUNT)
          ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="table-container">
          <div className="table-header-bar">
            <div>
              <h3 className="table-title">Settings</h3>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>Attendance Warning Threshold</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Receive in-app alerts and SMS when subject attendance dips below criteria.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '4px 10px' }}>75% (Mandatory)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Institute standard</span>
                </div>
              </div>

              <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>Registered Mobile & Email</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Academic dispatch contact for circulars and marks slips.
                </p>
                <div style={{ fontSize: '0.84rem', fontWeight: 500, color: 'var(--text-main)' }}>
                  {currentStudent.email} · {currentStudent.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {isSubmitModalOpen && selectedAssignment && (
        <div className="modal-overlay" onClick={() => setIsSubmitModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Submit Assignment</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {selectedAssignment.code} · {selectedAssignment.title}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSubmitModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Attached File (PDF / ZIP / Java)</label>
                  <input
                    type="file"
                    className="input-field"
                    onChange={(e) => setSubmissionFile(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Submission Notes (Optional)</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Enter any comments for the instructor..."
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsSubmitModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deliverable Review & Faculty Evaluation Modal */}
      {selectedSubmissionReview && (
        <div className="modal-overlay" onClick={() => setSelectedSubmissionReview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Assignment Submission & Evaluation</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {selectedSubmissionReview.code} · {selectedSubmissionReview.title}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedSubmissionReview(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Score & Grade Banner */}
              <div
                style={{
                  background: selectedSubmissionReview.isEvaluated ? '#f0fdf4' : '#f8fafc',
                  border: selectedSubmissionReview.isEvaluated ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>
                    Evaluation Result
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: selectedSubmissionReview.isEvaluated ? '#15803d' : '#0f172a' }}>
                    {selectedSubmissionReview.isEvaluated
                      ? `${selectedSubmissionReview.awardedMarks} / ${selectedSubmissionReview.totalMarks} Points`
                      : 'Under Faculty Review'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                    Instructor: {selectedSubmissionReview.faculty}
                  </div>
                </div>

                {selectedSubmissionReview.isEvaluated && (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: selectedSubmissionReview.gradeBg,
                        color: selectedSubmissionReview.gradeColor
                      }}
                    >
                      {selectedSubmissionReview.grade}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4 }}>
                      {selectedSubmissionReview.percentage}% Score
                    </div>
                  </div>
                )}
              </div>

              {/* Submitted Deliverable File */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 650, color: '#0f172a' }}>
                    {selectedSubmissionReview.fileName || 'Assignment_Submission.zip'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {selectedSubmissionReview.fileSize || '2.4 MB'} · Submitted on {selectedSubmissionReview.submissionDate || 'Recently'}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => toast.info('Download', `Downloading ${selectedSubmissionReview.fileName}...`)}
                  style={{ gap: 4 }}
                >
                  <Download size={12} />
                  <span>Download</span>
                </button>
              </div>

              {/* Faculty Feedback & Remarks */}
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                  Faculty Evaluation Remarks
                </label>
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '0.82rem',
                    color: '#334155',
                    fontStyle: selectedSubmissionReview.remarks ? 'normal' : 'italic'
                  }}
                >
                  {selectedSubmissionReview.remarks || 'No written comments provided yet.'}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setSelectedSubmissionReview(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Marksheet & Grade Transcript Modal */}
      {isMarksheetModalOpen && (
        <MarksheetModal
          student={currentStudent}
          onClose={() => setIsMarksheetModalOpen(false)}
        />
      )}

      {/* Clearance Gatekeeper Modal (Attendance Shortage or Fee Dues) */}
      {isMarksheetBlockedOpen && (
        <ClearanceBlockedModal
          student={currentStudent}
          blockType="marksheet"
          onClose={() => setIsMarksheetBlockedOpen(false)}
        />
      )}
    </div>
  );
}
