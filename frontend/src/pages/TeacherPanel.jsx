import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Calendar,
  CheckCircle2,
  BookOpen,
  Search,
  Filter,
  BarChart3,
  FileText,
  Upload,
  Radio,
  AlertTriangle,
  Download,
  Plus,
  Trash2,
  Edit3,
  Save,
  Check,
  X,
  Layers,
  Percent,
  Clock,
  Send,
  Eye,
  Building2,
  Megaphone,
  Printer,
  Award,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  CreditCard,
  GraduationCap,
  Ticket,
  FileSpreadsheet,
  UserCheck,
  BadgePercent,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Shield,
  ShieldCheck
} from 'lucide-react';
import Alert from '../components/Alert';
import { useToast } from '../context/ToastContext';
import PillTabs from '../components/navigation/PillTabs';
import DocumentCardGrid from '../components/common/DocumentCardGrid';
import InstitutionalRepositoryView from '../components/common/InstitutionalRepositoryView';
import AnnouncementsSection from '../components/common/AnnouncementsSection';
import TimetableSection from '../components/common/TimetableSection';
import {
  printAttendanceDefaulterReport,
  printAcademicLearnersReport,
  printFeeClearanceReport,
  printOfficialHallTicket,
  downloadOfficialHallTicket,
  exportAttendanceCSV,
  exportAcademicLearnersCSV,
  exportFeeClearanceCSV,
  exportHallTicketClearanceCSV,
  exportStudentsRosterCSV,
  exportStudentRosterExcel,
  printStudentRoster,
  printBatchHallTickets,
  printAllStudentsComprehensiveDossiers
} from '../lib/exportFormatHelper';
import { getFacultyAssignments, getTeacherForStudent } from '../lib/facultyAssignmentsData';
import { getStudentsClearance } from '../lib/clearanceData';
import TeacherMarksAndEvaluations from '../components/teacher/TeacherMarksAndEvaluations';
import TeacherRoleManagementHub from '../components/teacher/TeacherRoleManagementHub';
import TeacherAssignmentGrading from '../components/teacher/TeacherAssignmentGrading';

export default function TeacherPanel({
  activeTab = 'dashboard',
  onNavigate,
  students = [],
  currentUser,
  onViewStudent,
  onOpenProfileModal
}) {
  const { toast } = useToast();
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Faculty Assignments & Department Context (from persistent store)
  const [facultyVersion, setFacultyVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setFacultyVersion((v) => v + 1);
    window.addEventListener('edutrack_faculty_assignments_updated', handleUpdate);
    return () => window.removeEventListener('edutrack_faculty_assignments_updated', handleUpdate);
  }, []);

  const facultyAssignmentsList = useMemo(() => getFacultyAssignments(), [facultyVersion]);
  const currentFaculty = useMemo(() => {
    if (currentUser) {
      const match = facultyAssignmentsList.find(
        (f) =>
          (currentUser.email && f.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
          (currentUser.id && f.id === currentUser.id) ||
          (currentUser.name && f.name?.toLowerCase() === currentUser.name?.toLowerCase())
      );
      if (match) return match;
    }
    return facultyAssignmentsList[0] || {
      id: 'FAC-IT-101',
      name: 'Prof. Krrish Sharma',
      department: 'Information Technology',
      designation: 'Associate Professor & Class Teacher',
      roles: {
        classTeacher: { assigned: true, division: 'Div A' },
        gfm: { assigned: true, cohort: 'Roll #101 to #120 (Div A)' },
        theorySubjects: [{ code: 'IT-301', name: 'Core Java & OOP Frameworks' }],
        practicalLabs: [{ code: 'IT-301L', name: 'Core Java Programming Laboratory', labRoom: 'Computing Lab A-1' }]
      }
    };
  }, [facultyAssignmentsList, currentUser]);

  // Derived faculty scope (Strictly set by Admin)
  const facultyDeptCode = useMemo(() => {
    const dept = (currentFaculty.department || '').toLowerCase();
    if (dept.includes('computer')) return 'CS';
    if (dept.includes('electronic') || dept.includes('telecom')) return 'EXTC';
    if (dept.includes('mech')) return 'MECH';
    if (dept.includes('data') || dept.includes('ai')) return 'AIDS';
    return 'IT';
  }, [currentFaculty.department]);

  const facultyAssignedDivisions = useMemo(() => {
    const divs = new Set();
    const ctDiv = currentFaculty.roles?.classTeacher?.division || currentFaculty.classTeacherDivision;
    if (ctDiv && ctDiv !== 'None') {
      const parsed = ctDiv.replace(/[^A-Za-z]/g, '').slice(-1) || 'A';
      divs.add(parsed.toUpperCase());
    }
    if (currentFaculty.roles?.theorySubjects) {
      currentFaculty.roles.theorySubjects.forEach((s) => {
        if (s.division) divs.add(s.division.toUpperCase());
      });
    }
    if (divs.size === 0) divs.add('A');
    return Array.from(divs);
  }, [currentFaculty]);

  const facultySubjects = useMemo(() => {
    const list = [];
    (currentFaculty.roles?.theorySubjects || []).forEach((s) => {
      list.push({ code: s.code, name: `${s.code}: ${s.name} (Theory)` });
    });
    (currentFaculty.roles?.practicalLabs || []).forEach((l) => {
      list.push({ code: l.code, name: `${l.code}: ${l.name} (Lab)` });
    });
    if (list.length === 0) {
      list.push({ code: 'IT-301', name: 'IT-301: Core Java & OOP Frameworks' });
    }
    return list;
  }, [currentFaculty]);

  // State for Defaulters & Attendance Filter
  const [attStatusFilter, setAttStatusFilter] = useState('all'); // 'all', 'defaulters', 'eligible'
  const [attDivisionFilter, setAttDivisionFilter] = useState(() => facultyAssignedDivisions[0] || 'A');

  // State for Academic Performance (Slow / Fast Learners)
  const [perfCategoryFilter, setPerfCategoryFilter] = useState('all'); // 'all', 'fast', 'average', 'slow'
  const [perfDivisionFilter, setPerfDivisionFilter] = useState(() => facultyAssignedDivisions[0] || 'A');

  // State for Fee Clearance
  const [feeStatusFilter, setFeeStatusFilter] = useState('all'); // 'all', 'paid', 'due'
  const [feeDivisionFilter, setFeeDivisionFilter] = useState(() => facultyAssignedDivisions[0] || 'A');

  // State for Hall Tickets
  const [hallTicketFilter, setHallTicketFilter] = useState('all'); // 'all', 'eligible', 'withheld'
  const [hallTicketDivisionFilter, setHallTicketDivisionFilter] = useState(() => facultyAssignedDivisions[0] || 'A');

  // Fallback student roster strictly isolated to this teacher's assigned department and division(s)
  const fallbackStudentsForFaculty = useMemo(() => [
    { rollNumber: 101, name: 'Krrish Sharma', course: facultyDeptCode, division: facultyAssignedDivisions[0] || 'A', percentage: 94.2, cgpa: 9.15, email: 'krrish.sharma@edutrack.edu', feeTotal: 85000, feePaid: 85000, lastPayment: '2026-08-14' },
    { rollNumber: 102, name: 'Rohan Patel', course: facultyDeptCode, division: facultyAssignedDivisions[0] || 'A', percentage: 71.4, cgpa: 6.84, email: 'rohan.patel@edutrack.edu', feeTotal: 85000, feePaid: 45000, lastPayment: '2026-08-10' },
    { rollNumber: 103, name: 'Pooja Nair', course: facultyDeptCode, division: facultyAssignedDivisions[0] || 'A', percentage: 95.8, cgpa: 9.40, email: 'pooja.n@edutrack.edu', feeTotal: 85000, feePaid: 85000, lastPayment: '2026-08-12' },
    { rollNumber: 104, name: 'Meera Iyer', course: facultyDeptCode, division: facultyAssignedDivisions[0] || 'A', percentage: 89.1, cgpa: 8.85, email: 'meera.i@edutrack.edu', feeTotal: 85000, feePaid: 85000, lastPayment: '2026-08-19' }
  ], [facultyDeptCode, facultyAssignedDivisions]);

  // Base student roster strictly filtered to this teacher's assigned department and division(s)
  const baseStudentsRoster = useMemo(() => {
    let list = [];
    if (students && students.length > 0) {
      list = students.filter((s) => {
        const studentCourse = (s.course || '').toUpperCase();
        const matchesDept = studentCourse === facultyDeptCode || studentCourse.includes(facultyDeptCode);
        const studentDiv = (s.division || (s.rollNumber % 2 === 0 ? 'B' : 'A')).toUpperCase();
        const matchesDiv = facultyAssignedDivisions.includes(studentDiv);
        return matchesDept && matchesDiv;
      });
    }
    if (list.length === 0) {
      list = fallbackStudentsForFaculty;
    }
    return list.map((s) => {
      const feePaid = s.feePaid ?? (Number(s.percentage) < 72 ? 45000 : 85000);
      const feeTotal = s.feeTotal ?? 85000;
      const isFeePaid = feePaid >= feeTotal;
      const att = Number(s.percentage) || 75;
      const isEligible = att >= 75 && isFeePaid;
      return {
        ...s,
        percentage: att,
        course: facultyDeptCode,
        division: s.division || facultyAssignedDivisions[0] || 'A',
        feeTotal,
        feePaid,
        feeBalance: feeTotal - feePaid,
        feeStatus: isFeePaid ? 'Paid in Full' : 'Pending Dues',
        hallTicketCleared: isEligible,
        learnerCategory: att >= 85 ? 'Fast' : att < 65 ? 'Slow' : 'Average'
      };
    });
  }, [students, facultyDeptCode, facultyAssignedDivisions, fallbackStudentsForFaculty]);

  // Students tab filter state & computed displayed list strictly scoped to faculty
  const [studentsDivisionFilter, setStudentsDivisionFilter] = useState('all'); // 'all' or specific assigned division
  const [studentsStatusFilter, setStudentsStatusFilter] = useState('all'); // 'all', 'good', 'low'
  const [studentsRosterSearch, setStudentsRosterSearch] = useState('');

  const displayedStudentsRoster = useMemo(() => {
    return baseStudentsRoster.filter((s) => {
      const sDiv = (s.division || 'A').toUpperCase();

      if (studentsDivisionFilter !== 'all' && sDiv !== studentsDivisionFilter) {
        return false;
      }

      if (studentsStatusFilter === 'low' && Number(s.percentage) >= 75) {
        return false;
      }
      if (studentsStatusFilter === 'good' && Number(s.percentage) < 75) {
        return false;
      }

      if (studentsRosterSearch.trim()) {
        const q = studentsRosterSearch.toLowerCase();
        const nameMatch = (s.name || '').toLowerCase().includes(q);
        const rollMatch = String(s.rollNumber || '').includes(q);
        const divMatch = sDiv.toLowerCase().includes(q);
        return nameMatch || rollMatch || divMatch;
      }
      return true;
    });
  }, [baseStudentsRoster, studentsDivisionFilter, studentsStatusFilter, studentsRosterSearch]);

  // Page-Level Sub-tab & Filter States (Sections 1, 15, 25, 29, 30)
  const [classesFilter, setClassesFilter] = useState('all');
  const [assignmentsFilter, setAssignmentsFilter] = useState('all');
  const [activeGradingAssignmentId, setActiveGradingAssignmentId] = useState(1);
  const [materialsFilter, setMaterialsFilter] = useState('all');
  const [announcementsFilter, setAnnouncementsFilter] = useState('all');
  const [selectedAssessment, setSelectedAssessment] = useState('Internal');

  // 1. Assigned Classes & Subjects (Derived from Admin Allocation)
  const assignedClasses = useMemo(() => {
    const list = [];
    let idCounter = 1;
    (currentFaculty.roles?.theorySubjects || []).forEach((s) => {
      list.push({
        id: idCounter++,
        code: s.code,
        subject: s.name,
        class: `${facultyDeptCode} - Year 3 (Div ${facultyAssignedDivisions.join(', ')})`,
        studentsCount: baseStudentsRoster.length,
        room: 'Room 301'
      });
    });
    (currentFaculty.roles?.practicalLabs || []).forEach((l) => {
      list.push({
        id: idCounter++,
        code: l.code,
        subject: l.name,
        class: `${facultyDeptCode} - Year 3 (Div ${facultyAssignedDivisions[0] || 'A'})`,
        studentsCount: baseStudentsRoster.length,
        room: l.labRoom || 'Computing Lab A-1'
      });
    });
    if (list.length === 0) {
      list.push({
        id: 1,
        code: 'IT-301',
        subject: 'Core Java & OOP Frameworks',
        class: `${facultyDeptCode} - Year 3 (Div ${facultyAssignedDivisions[0] || 'A'})`,
        studentsCount: baseStudentsRoster.length,
        room: 'Lab A-1'
      });
    }
    return list;
  }, [currentFaculty, facultyDeptCode, facultyAssignedDivisions, baseStudentsRoster.length]);

  // 2. Interactive Attendance State
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    return baseStudentsRoster.map((s) => ({
      ...s,
      status: s.percentage < 75 ? 'Absent' : 'Present'
    }));
  });

  useEffect(() => {
    setAttendanceRecords(
      baseStudentsRoster.map((s) => ({
        ...s,
        status: s.percentage < 75 ? 'Absent' : 'Present'
      }))
    );
  }, [baseStudentsRoster]);

  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState(() => facultySubjects[0]?.name || 'IT-301: Core Java & OOP Frameworks (Theory)');

  // 3. Gradebook / Marks State (strictly scoped to teacher's assigned department and division)
  const [gradebookData, setGradebookData] = useState(() => {
    return baseStudentsRoster.map((s, idx) => ({
      rollNumber: s.rollNumber,
      name: s.name,
      course: facultyDeptCode,
      internal: 22 + (idx % 4),
      midterm: 44 + (idx % 6),
      practical: 24 - (idx % 3)
    }));
  });

  useEffect(() => {
    setGradebookData(
      baseStudentsRoster.map((s, idx) => ({
        rollNumber: s.rollNumber,
        name: s.name,
        course: facultyDeptCode,
        internal: 22 + (idx % 4),
        midterm: 44 + (idx % 6),
        practical: 24 - (idx % 3)
      }))
    );
  }, [baseStudentsRoster, facultyDeptCode]);

  // 4. Assignments Created by Teacher
  const [teacherAssignments, setTeacherAssignments] = useState(() => [
    {
      id: 1,
      title: 'JDBC Student Management Project',
      subject: facultySubjects[0]?.name || 'Core Java (IT-301)',
      deadline: '2026-10-08',
      totalMarks: 20,
      submissionsCount: baseStudentsRoster.length,
      totalStudents: baseStudentsRoster.length,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Collections Framework & Generics Lab',
      subject: facultySubjects[1]?.name || 'Advanced Java Lab (IT-301L)',
      deadline: '2026-10-14',
      totalMarks: 25,
      submissionsCount: Math.max(0, baseStudentsRoster.length - 2),
      totalStudents: baseStudentsRoster.length,
      status: 'Active'
    }
  ]);

  // 5. Courseware / Study Materials
  const [classMaterials, setClassMaterials] = useState(() => [
    { id: 1, title: 'Unit 1 & 2 - OOP Fundamentals & Java Syntax.pdf', subject: facultySubjects[0]?.name || 'Core Java (IT-301)', size: '3.8 MB', date: '2026-10-01', downloads: 84 },
    { id: 2, title: 'Lab Assignment Sheet 4 - Collections & Iterators.pdf', subject: facultySubjects[1]?.name || 'Advanced Java Lab (IT-301L)', size: '1.2 MB', date: '2026-09-28', downloads: 62 },
    { id: 3, title: 'MySQL Connector/J Configuration Guide.pdf', subject: facultySubjects[0]?.name || 'Core Java (IT-301)', size: '890 KB', date: '2026-09-22', downloads: 91 }
  ]);

  // 6. Timetable / Today's Classes (Dynamically populated from assignedClasses)
  const todayClasses = useMemo(() => {
    return assignedClasses.map((cls, idx) => {
      const times = ['09:00 AM - 10:00 AM', '11:15 AM - 12:15 PM', '02:00 PM - 03:00 PM'];
      const statuses = ['Completed', 'In Progress', 'Scheduled'];
      return {
        time: times[idx % times.length],
        subject: cls.subject,
        class: cls.class,
        room: cls.room,
        status: statuses[idx % statuses.length]
      };
    });
  }, [assignedClasses]);

  // 7. Announcements published
  const [announcements, setAnnouncements] = useState(() => [
    { id: 1, title: 'Unit Test 1 on Collections and JDBC', date: 'Oct 02, 2026', class: `${facultyDeptCode} Year 3 (Div ${facultyAssignedDivisions.join(', ')})`, message: 'Syllabus includes Chapters 1 to 4. Carry college ID cards.' },
    { id: 2, title: 'Lab Record Submission Deadline', date: 'Sep 29, 2026', class: `${facultyDeptCode} Year 3 (Div ${facultyAssignedDivisions[0] || 'A'})`, message: 'Hard copies of Lab 1-4 must be submitted by Monday 4 PM.' }
  ]);

  // Modals state
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isUploadMaterialOpen, setIsUploadMaterialOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: facultySubjects[0]?.name || 'Core Java (IT-301)',
    deadline: '',
    totalMarks: 20
  });

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: facultySubjects[0]?.name || 'Core Java (IT-301)'
  });

  const [broadcastMessage, setBroadcastMessage] = useState({
    title: '',
    class: `${facultyDeptCode} Year 3 (Div ${facultyAssignedDivisions.join(', ')})`,
    message: ''
  });

  // Roll call toggle
  const toggleAttendanceStatus = (rollNumber) => {
    setAttendanceRecords((prev) =>
      prev.map((s) =>
        s.rollNumber === rollNumber
          ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' }
          : s
      )
    );
  };

  const handleMarkAll = (status) => {
    setAttendanceRecords((prev) => prev.map((s) => ({ ...s, status })));
    toast.info('Roster Updated', `All students marked as ${status}.`);
  };

  const handleSaveAttendance = () => {
    const presentCount = attendanceRecords.filter((s) => s.status === 'Present').length;
    toast.success(
      'Attendance Saved',
      `${presentCount} of ${attendanceRecords.length} students logged present for ${attendanceDate}.`
    );
  };

  // Gradebook change handler
  const handleGradeChange = (rollNumber, field, value) => {
    const num = Number(value);
    setGradebookData((prev) =>
      prev.map((item) =>
        item.rollNumber === rollNumber ? { ...item, [field]: isNaN(num) ? 0 : num } : item
      )
    );
  };

  const handleSaveGrades = () => {
    toast.success('Gradebook Saved', 'Marks committed to institutional records.');
  };

  // Create Assignment
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.deadline) return;

    setTeacherAssignments((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newAssignment,
        submissionsCount: 0,
        totalStudents: 42,
        status: 'Active'
      }
    ]);

    setIsAddAssignmentOpen(false);
    toast.success('Assignment Created', `"${newAssignment.title}" published.`);
    setNewAssignment({ title: '', subject: 'Core Java (IT-301)', deadline: '', totalMarks: 20 });
  };

  // Upload Material
  const handleUploadMaterial = (e) => {
    e.preventDefault();
    if (!newMaterial.title) return;

    setClassMaterials((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newMaterial.title,
        subject: newMaterial.subject,
        size: '2.4 MB',
        date: new Date().toISOString().split('T')[0],
        downloads: 0
      }
    ]);

    setIsUploadMaterialOpen(false);
    toast.success('Material Uploaded', `"${newMaterial.title}" added to class library.`);
    setNewMaterial({ title: '', subject: 'Core Java (IT-301)' });
  };

  // Broadcast announcement
  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.title || !broadcastMessage.message) return;

    setAnnouncements((prev) => [
      {
        id: Date.now(),
        title: broadcastMessage.title,
        date: 'Just now',
        class: broadcastMessage.class,
        message: broadcastMessage.message
      },
      ...prev
    ]);

    setIsBroadcastOpen(false);
    toast.success('Notice Published', `"${broadcastMessage.title}" posted to student portal.`);
    setBroadcastMessage({ title: '', class: 'IT Year 3 (Div A & B)', message: '' });
  };

  const lowAttendanceStudents = attendanceRecords.filter((s) => s.percentage < 75);

  return (
    <div>
      {/* =========================================================================
          VIEW 1: DASHBOARD (TEACHER DASHBOARD PER SECTION 8)
          - Faculty teaching allocations & roles banner
          - Today's classes
          - Assigned students
          - Pending assignments
          - Attendance status
          - Important announcements
          ========================================================================= */}
      {activeTab === 'dashboard' && (
        <>
          {/* Dashboard Header */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Dashboard</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Welcome back, {currentFaculty.name.split(' ')[0]}.</span>
          </div>

          {/* Low Attendance Notice */}
          {lowAttendanceStudents.length > 0 && (
            <Alert
              type="warning"
              title="Attendance Notice"
              message={`${lowAttendanceStudents.length} students have overall attendance below 75%.`}
              actionText="Review"
              onAction={() => onNavigate && onNavigate('attendance')}
            />
          )}

          {/* Metrics */}
          <div className="stats-grid" style={{ marginBottom: 20 }}>
            <div className="stat-card">
              <span className="stat-label">Assigned Students</span>
              <span className="stat-value">{baseStudentsRoster.length}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Today's Classes</span>
              <span className="stat-value">{todayClasses.length}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Pending Submissions</span>
              <span className="stat-value" style={{ color: 'var(--warning)' }}>
                {teacherAssignments.reduce((acc, a) => acc + Math.max(0, a.totalStudents - a.submissionsCount), 0)}
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Average Attendance</span>
              <span className="stat-value" style={{ color: 'var(--success)' }}>
                {baseStudentsRoster.length > 0
                  ? (baseStudentsRoster.reduce((acc, s) => acc + Number(s.percentage), 0) / baseStudentsRoster.length).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>

          {/* Today's Classes Table */}
          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Today's Classes</h3>
              </div>
            </div>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Schedule</th>
                  <th>Subject</th>
                  <th>Division</th>
                  <th>Location</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayClasses.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.time}</div>
                    </td>
                    <td><strong>{item.subject}</strong></td>
                    <td>{item.class}</td>
                    <td>
                      <span className="badge badge-neutral">{item.room}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${
                        item.status === 'Completed'
                          ? 'badge-success'
                          : item.status === 'In Progress'
                          ? 'badge-warning'
                          : 'badge-neutral'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Low Attendance Notice Table */}
          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Attendance Alerts (&lt;75%)</h3>
              </div>
            </div>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Roll #</th>
                  <th>Student Name</th>
                  <th>Department & Div</th>
                  <th>Attendance %</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {lowAttendanceStudents.map((s) => (
                  <tr key={s.rollNumber}>
                    <td><strong>#{s.rollNumber}</strong></td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>{s.course} (Div {s.division || 'A'})</td>
                    <td>
                      <strong style={{ color: 'var(--danger)' }}>{s.percentage}%</strong>
                    </td>
                    <td>
                      <span className="badge badge-danger">Below 75%</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() =>
                          toast.info('Notification Issued', `Warning email sent to ${s.name} (${s.percentage}%).`)
                        }
                      >
                        <Send size={12} />
                        <span>Send Warning</span>
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
          VIEW 2: MY CLASSES (SECTIONS 1, 15, 25)
          Pills: [All Classes] [Today] [Upcoming]
          ========================================================================= */}
      {activeTab === 'classes' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <PillTabs
              tabs={[
                { id: 'all', label: 'All Classes', count: assignedClasses.length },
                { id: 'today', label: 'Today', count: 2 },
                { id: 'upcoming', label: 'Upcoming', count: 1 }
              ]}
              activeTab={classesFilter}
              onChange={setClassesFilter}
            />
          </div>

          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Assigned Classes</h3>
              </div>
            </div>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Course Name</th>
                  <th>Division</th>
                  <th>Students</th>
                  <th>Room</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedClasses
                  .filter((item) => {
                    if (classesFilter === 'all') return true;
                    if (classesFilter === 'today') return item.id === 1 || item.id === 2;
                    if (classesFilter === 'upcoming') return item.id === 3;
                    return true;
                  })
                  .map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.code}</strong></td>
                      <td style={{ fontWeight: 600 }}>{item.subject}</td>
                      <td>{item.class}</td>
                      <td>{item.studentsCount}</td>
                      <td>
                        <span className="badge badge-neutral">{item.room}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn-primary btn-sm"
                            onClick={() => onNavigate && onNavigate('attendance')}
                          >
                            Roll Call
                          </button>
                          <button
                            className="btn-secondary btn-sm"
                            onClick={() => onNavigate && onNavigate('marks')}
                          >
                            Gradebook
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 3: ATTENDANCE & DEFAULTERS (SECTIONS 1, 27 + USER REQUIREMENTS)
          Filter: All / Defaulters (<75%) / Eligible (>=75%)
          Features: Roll call, deficit lectures, parent intimation, and PRINT DEFAULTER REPORT
          ========================================================================= */}
      {activeTab === 'attendance' && (() => {
        const divFiltered = attendanceRecords.filter(
          (s) => attDivisionFilter === 'All' || (s.division || 'A') === attDivisionFilter
        );
        const defaulters = divFiltered.filter((s) => s.percentage < 75);
        const eligible = divFiltered.filter((s) => s.percentage >= 75);
        const displayRecords = divFiltered.filter((s) => {
          if (attStatusFilter === 'defaulters') return s.percentage < 75;
          if (attStatusFilter === 'eligible') return s.percentage >= 75;
          return true;
        });

        return (
          <>
            {/* Top Attendance Summary Bar */}
            <div className="stats-grid" style={{ marginBottom: 16 }}>
              <div className="stat-card">
                <span className="stat-label">Total Students</span>
                <span className="stat-value">{divFiltered.length}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Defaulters (&lt;75%)</span>
                <span className="stat-value" style={{ color: '#ef4444' }}>
                  {defaulters.length}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Eligible (≥75%)</span>
                <span className="stat-value" style={{ color: '#10b981' }}>
                  {eligible.length}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Average Attendance</span>
                <span className="stat-value" style={{ color: '#3b82f6' }}>
                  {divFiltered.length > 0
                    ? (divFiltered.reduce((acc, s) => acc + s.percentage, 0) / divFiltered.length).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 className="table-title">Attendance Register</h3>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Division Filter */}
                  <select
                    className="input-field"
                    style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 600 }}
                    value={attDivisionFilter}
                    onChange={(e) => setAttDivisionFilter(e.target.value)}
                  >
                    {facultyAssignedDivisions.length > 1 && (
                      <option value="All">All Assigned Divisions ({facultyAssignedDivisions.join(', ')})</option>
                    )}
                    {facultyAssignedDivisions.map((div) => (
                      <option key={div} value={div}>Division {div} (Assigned Class)</option>
                    ))}
                  </select>

                  <select
                    className="input-field"
                    style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem' }}
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    {facultySubjects.map((sub) => (
                      <option key={sub.code} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="input-field"
                    style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem' }}
                  />

                  {/* Print Defaulter Report Button (User Requirement 1) */}
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => {
                      if (defaulters.length === 0) {
                        toast.info('No Defaulters', `No students below 75% in Division ${attDivisionFilter}.`);
                        return;
                      }
                      printAttendanceDefaulterReport(defaulters, attDivisionFilter, 'Information Technology');
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
                  >
                    <Printer size={13} />
                    <span>Print Defaulter Report ({defaulters.length})</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => printAttendanceDefaulterReport(divFiltered, attDivisionFilter, 'Information Technology')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
                  >
                    <FileText size={13} />
                    <span>Print Register</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => exportAttendanceCSV(displayRecords, attDivisionFilter, selectedSubject)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
                    title="Export Attendance Register (CSV / Excel)"
                  >
                    <Download size={13} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Executive Segmented Filter & Roll Call Toolbar */}
              <div style={{ padding: '0 20px 14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', gap: '3px' }}>
                  <button
                    type="button"
                    onClick={() => setAttStatusFilter('all')}
                    style={{
                      border: 'none',
                      background: attStatusFilter === 'all' ? '#ffffff' : 'transparent',
                      color: attStatusFilter === 'all' ? '#0f172a' : '#64748b',
                      boxShadow: attStatusFilter === 'all' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: attStatusFilter === 'all' ? 650 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    All Students ({divFiltered.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttStatusFilter('defaulters')}
                    style={{
                      border: 'none',
                      background: attStatusFilter === 'defaulters' ? '#ffffff' : 'transparent',
                      color: attStatusFilter === 'defaulters' ? '#dc2626' : '#64748b',
                      boxShadow: attStatusFilter === 'defaulters' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: attStatusFilter === 'defaulters' ? 650 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <AlertTriangle size={12} />
                    <span>Defaulters &lt;75% ({defaulters.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttStatusFilter('eligible')}
                    style={{
                      border: 'none',
                      background: attStatusFilter === 'eligible' ? '#ffffff' : 'transparent',
                      color: attStatusFilter === 'eligible' ? '#16a34a' : '#64748b',
                      boxShadow: attStatusFilter === 'eligible' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: attStatusFilter === 'eligible' ? 650 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <CheckCircle size={12} />
                    <span>Eligible ({eligible.length})</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="btn-secondary btn-sm" onClick={() => handleMarkAll('Present')}>
                    Mark All Present
                  </button>
                  <button className="btn-secondary btn-sm" onClick={() => handleMarkAll('Absent')}>
                    Mark All Absent
                  </button>
                  <button className="btn-primary btn-sm" onClick={handleSaveAttendance} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Save size={13} />
                    <span>Save Roll Call</span>
                  </button>
                </div>
              </div>

              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Roll #</th>
                    <th>Student Name</th>
                    <th>Dept & Div</th>
                    <th>Attendance %</th>
                    <th>Deficit Shortfall</th>
                    <th>Eligibility Status</th>
                    <th style={{ textAlign: 'center' }}>Daily Roll Call</th>
                    <th style={{ textAlign: 'right' }}>Faculty Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRecords.map((s) => {
                    const isDefaulter = s.percentage < 75;
                    const shortfallLectures = isDefaulter
                      ? Math.max(1, Math.ceil((75 - s.percentage) * 0.45))
                      : 0;

                    return (
                      <tr key={s.rollNumber} style={{ background: isDefaulter ? 'rgba(239, 68, 68, 0.02)' : undefined }}>
                        <td>
                          <strong>#{s.rollNumber}</strong>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.email}</div>
                        </td>
                        <td>
                          {s.course} (Div {s.division || 'A'})
                        </td>
                        <td>
                          <span
                            style={{
                              color: isDefaulter ? 'var(--danger)' : 'var(--success)',
                              fontWeight: 700,
                              fontSize: '0.88rem'
                            }}
                          >
                            {s.percentage}%
                          </span>
                        </td>
                        <td>
                          {isDefaulter ? (
                            <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.78rem' }}>
                              Needs +{shortfallLectures} lectures
                            </span>
                          ) : (
                            <span style={{ color: '#10b981', fontSize: '0.78rem' }}>Compliant</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${isDefaulter ? 'badge-danger' : 'badge-success'}`}>
                            {isDefaulter ? '⚠️ Below 75% Defaulter' : '✓ Exam Eligible'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className={`btn-sm ${s.status === 'Present' ? 'btn-primary' : 'btn-danger'}`}
                            onClick={() => toggleAttendanceStatus(s.rollNumber)}
                            style={{ minWidth: '85px' }}
                          >
                            {s.status === 'Present' ? '✓ Present' : '✗ Absent'}
                          </button>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {isDefaulter ? (
                            <button
                              className="btn-secondary btn-sm"
                              onClick={() =>
                                toast.warning(
                                  'Defaulter Warning Issued',
                                  `Official intimation email dispatched to ${s.name} and registered guardian.`
                                )
                              }
                              style={{ color: '#ef4444', border: '1px solid #fca5a5' }}
                            >
                              <Send size={12} />
                              <span>Parent Notice</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Good Standing</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}

      {/* =========================================================================
          VIEW: ACADEMIC PERFORMANCE (SLOW & FAST LEARNERS) (USER REQUIREMENT 1)
          Features: Filter fast learners (>=85%), average (60-84%), slow learners (<60%)
          Print NAAC/NBA Remedial & Advanced Learners Plan
          ========================================================================= */}
      {activeTab === 'performance' && (() => {
        const divFiltered = baseStudentsRoster.filter(
          (s) => perfDivisionFilter === 'All' || s.division === perfDivisionFilter
        );
        const fastLearners = divFiltered.filter((s) => s.percentage >= 85);
        const averageLearners = divFiltered.filter((s) => s.percentage >= 60 && s.percentage < 85);
        const slowLearners = divFiltered.filter((s) => s.percentage < 60);

        const displayedLearners = divFiltered.filter((s) => {
          if (perfCategoryFilter === 'fast') return s.percentage >= 85;
          if (perfCategoryFilter === 'average') return s.percentage >= 60 && s.percentage < 85;
          if (perfCategoryFilter === 'slow') return s.percentage < 60;
          return true;
        });

        return (
          <>
            {/* Top Learners Cohort Metrics */}
            <div className="stats-grid" style={{ marginBottom: 16 }}>
              <div className="stat-card">
                <span className="stat-label">Advanced (≥85%)</span>
                <span className="stat-value" style={{ color: '#16a34a' }}>{fastLearners.length}</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Average (60–84%)</span>
                <span className="stat-value" style={{ color: '#2563eb' }}>{averageLearners.length}</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Remedial (&lt;60%)</span>
                <span className="stat-value" style={{ color: '#dc2626' }}>{slowLearners.length}</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Total Students</span>
                <span className="stat-value">{divFiltered.length}</span>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 className="table-title">Learner Categorization</h3>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    className="input-field"
                    style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 600 }}
                    value={perfDivisionFilter}
                    onChange={(e) => setPerfDivisionFilter(e.target.value)}
                  >
                    {facultyAssignedDivisions.length > 1 && (
                      <option value="All">All Assigned Divisions ({facultyAssignedDivisions.join(', ')})</option>
                    )}
                    {facultyAssignedDivisions.map((div) => (
                      <option key={div} value={div}>Division {div} (Assigned Class)</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => printAcademicLearnersReport(fastLearners, slowLearners, perfDivisionFilter, currentFaculty.department || 'Information Technology')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Printer size={13} />
                    <span>Print Remedial Report</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => exportAcademicLearnersCSV(displayedLearners, perfDivisionFilter)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    title="Export Learners Categorization (CSV / Excel)"
                  >
                    <Download size={13} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Segmented Filter Control */}
              <div style={{ padding: '0 20px 14px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', gap: '3px' }}>
                  <button
                    type="button"
                    onClick={() => setPerfCategoryFilter('all')}
                    style={{
                      border: 'none',
                      background: perfCategoryFilter === 'all' ? '#ffffff' : 'transparent',
                      color: perfCategoryFilter === 'all' ? '#0f172a' : '#64748b',
                      boxShadow: perfCategoryFilter === 'all' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: perfCategoryFilter === 'all' ? 650 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    All Cohorts ({divFiltered.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPerfCategoryFilter('fast')}
                    style={{
                      border: 'none',
                      background: perfCategoryFilter === 'fast' ? '#ffffff' : 'transparent',
                      color: perfCategoryFilter === 'fast' ? '#16a34a' : '#64748b',
                      boxShadow: perfCategoryFilter === 'fast' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: perfCategoryFilter === 'fast' ? 650 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Sparkles size={12} />
                    <span>Advanced Learners ({fastLearners.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPerfCategoryFilter('average')}
                    style={{
                      border: 'none',
                      background: perfCategoryFilter === 'average' ? '#ffffff' : 'transparent',
                      color: perfCategoryFilter === 'average' ? '#2563eb' : '#64748b',
                      boxShadow: perfCategoryFilter === 'average' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: perfCategoryFilter === 'average' ? 650 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <BookOpen size={12} />
                    <span>Continuous ({averageLearners.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPerfCategoryFilter('slow')}
                    style={{
                      border: 'none',
                      background: perfCategoryFilter === 'slow' ? '#ffffff' : 'transparent',
                      color: perfCategoryFilter === 'slow' ? '#dc2626' : '#64748b',
                      boxShadow: perfCategoryFilter === 'slow' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: perfCategoryFilter === 'slow' ? 650 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <AlertTriangle size={12} />
                    <span>Remedial Track ({slowLearners.length})</span>
                  </button>
                </div>
              </div>

              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Roll #</th>
                    <th>Candidate Name</th>
                    <th>Division</th>
                    <th>Academic Score / CGPA</th>
                    <th>Cohort Category</th>
                    <th>Prescribed Academic Action / Intervention</th>
                    <th>Assigned GFM Mentor</th>
                    <th style={{ textAlign: 'right' }}>Faculty Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedLearners.map((s) => {
                    const isFast = s.percentage >= 85;
                    const isSlow = s.percentage < 60;

                    return (
                      <tr key={s.rollNumber}>
                        <td><strong>#{s.rollNumber}</strong></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.email}</div>
                        </td>
                        <td>{s.course} (Div {s.division})</td>
                        <td>
                          <strong style={{ color: isFast ? '#10b981' : isSlow ? '#ef4444' : '#2563eb' }}>
                            {s.percentage.toFixed(1)}% ({s.cgpa || (s.percentage / 10).toFixed(2)} CGPA)
                          </strong>
                        </td>
                        <td>
                          {isFast && (
                            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Sparkles size={11} />
                              <span>Fast Learner</span>
                            </span>
                          )}
                          {isSlow && (
                            <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={11} />
                              <span>Remedial Support</span>
                            </span>
                          )}
                          {!isFast && !isSlow && (
                            <span className="badge badge-neutral">Average Learner</span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.8rem' }}>
                          {isFast && 'Assigned Research Paper review, hackathon team lead, and peer study mentoring.'}
                          {isSlow && 'Scheduled Saturday remedial lectures in Data Structures and 1-on-1 GFM doubt clearing.'}
                          {!isFast && !isSlow && 'Standard weekly assignments, unit assessments, and regular lab practice.'}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {s.division === 'A' ? 'Prof. Krrish Sharma (GFM)' : 'Prof. Anjali Mehta (GFM)'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {isSlow ? (
                            <button
                              type="button"
                              className="btn-danger btn-sm"
                              onClick={() => toast.success('Remedial Scheduled', `Remedial session invitation sent to ${s.name}.`)}
                            >
                              Log Remedial
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => toast.info('Advanced Task', `Advanced project assigned to ${s.name}.`)}
                            >
                              Assign Task
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}

      {/* =========================================================================
          VIEW: STUDENT FEES & DUES CLEARANCE (USER REQUIREMENT 1)
          Features: Check fee paid vs dues, accounts register, and PRINT FEE REPORT
          ========================================================================= */}
      {activeTab === 'fee-status' && (() => {
        const divFiltered = baseStudentsRoster.filter(
          (s) => feeDivisionFilter === 'All' || s.division === feeDivisionFilter
        );
        const paidStudents = divFiltered.filter((s) => s.feeBalance <= 0);
        const duesStudents = divFiltered.filter((s) => s.feeBalance > 0);
        const totalCollected = divFiltered.reduce((acc, s) => acc + s.feePaid, 0);
        const totalPending = divFiltered.reduce((acc, s) => acc + s.feeBalance, 0);

        const displayedRecords = divFiltered.filter((s) => {
          if (feeStatusFilter === 'paid') return s.feeBalance <= 0;
          if (feeStatusFilter === 'due') return s.feeBalance > 0;
          return true;
        });

        return (
          <>
            {/* Top Fee Metrics */}
            <div className="stats-grid" style={{ marginBottom: 16 }}>
              <div className="stat-card">
                <span className="stat-label">Total Fee Assessed</span>
                <span className="stat-value">₹{(divFiltered.length * 85000).toLocaleString('en-IN')}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Fees Collected</span>
                <span className="stat-value" style={{ color: '#10b981' }}>
                  ₹{totalCollected.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Outstanding Dues</span>
                <span className="stat-value" style={{ color: '#ef4444' }}>
                  ₹{totalPending.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Fee Clearance Rate</span>
                <span className="stat-value" style={{ color: '#3b82f6' }}>
                  {divFiltered.length > 0 ? Math.round((paidStudents.length / divFiltered.length) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 className="table-title">Fee Clearance</h3>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    className="input-field"
                    style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 600 }}
                    value={feeDivisionFilter}
                    onChange={(e) => setFeeDivisionFilter(e.target.value)}
                  >
                    {facultyAssignedDivisions.length > 1 && (
                      <option value="All">All Assigned Divisions ({facultyAssignedDivisions.join(', ')})</option>
                    )}
                    {facultyAssignedDivisions.map((div) => (
                      <option key={div} value={div}>Division {div} (Assigned Class)</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => printFeeClearanceReport(displayedRecords, feeDivisionFilter, currentFaculty.department || 'Information Technology')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Printer size={13} />
                    <span>Print Fee Clearance Register</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => exportFeeClearanceCSV(displayedRecords, feeDivisionFilter)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    title="Export Fee Clearance Register (CSV / Excel)"
                  >
                    <Download size={13} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Segmented Filter Control */}
              <div style={{ padding: '0 20px 14px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', gap: '3px' }}>
                  <button
                    type="button"
                    onClick={() => setFeeStatusFilter('all')}
                    style={{
                      border: 'none',
                      background: feeStatusFilter === 'all' ? '#ffffff' : 'transparent',
                      color: feeStatusFilter === 'all' ? '#0f172a' : '#64748b',
                      boxShadow: feeStatusFilter === 'all' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: feeStatusFilter === 'all' ? 650 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    All Candidates ({divFiltered.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeeStatusFilter('paid')}
                    style={{
                      border: 'none',
                      background: feeStatusFilter === 'paid' ? '#ffffff' : 'transparent',
                      color: feeStatusFilter === 'paid' ? '#16a34a' : '#64748b',
                      boxShadow: feeStatusFilter === 'paid' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: feeStatusFilter === 'paid' ? 650 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <CheckCircle size={12} />
                    <span>Paid in Full ({paidStudents.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeeStatusFilter('due')}
                    style={{
                      border: 'none',
                      background: feeStatusFilter === 'due' ? '#ffffff' : 'transparent',
                      color: feeStatusFilter === 'due' ? '#dc2626' : '#64748b',
                      boxShadow: feeStatusFilter === 'due' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: feeStatusFilter === 'due' ? 650 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <AlertTriangle size={12} />
                    <span>Pending Dues ({duesStudents.length})</span>
                  </button>
                </div>
              </div>

              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Roll #</th>
                    <th>Candidate Name</th>
                    <th>Dept & Div</th>
                    <th>Total Assessed Fee</th>
                    <th>Paid Amount</th>
                    <th>Pending Balance</th>
                    <th>Last Receipt Date</th>
                    <th>Accounts Clearance</th>
                    <th style={{ textAlign: 'right' }}>Faculty Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRecords.map((s) => {
                    const isDue = s.feeBalance > 0;

                    return (
                      <tr key={s.rollNumber} style={{ background: isDue ? 'rgba(239, 68, 68, 0.02)' : undefined }}>
                        <td><strong>#{s.rollNumber}</strong></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.email}</div>
                        </td>
                        <td>{s.course} (Div {s.division})</td>
                        <td>₹{s.feeTotal.toLocaleString('en-IN')}</td>
                        <td>
                          <strong style={{ color: '#10b981' }}>₹{s.feePaid.toLocaleString('en-IN')}</strong>
                        </td>
                        <td>
                          {isDue ? (
                            <strong style={{ color: '#ef4444' }}>₹{s.feeBalance.toLocaleString('en-IN')}</strong>
                          ) : (
                            <span style={{ color: '#10b981' }}>₹0.00</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {s.lastPayment || '2026-08-15'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${isDue ? 'badge-danger' : 'badge-success'}`}>
                            {isDue ? '⚠️ Pending Dues' : '✓ Full Cleared'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {isDue ? (
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => toast.warning('Fee Reminder Sent', `Dues reminder notice sent to ${s.name}.`)}
                              style={{ color: '#ef4444', border: '1px solid #fca5a5' }}
                            >
                              <Send size={12} />
                              <span>Send Notice</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => toast.success('Accounts Verified', `Receipt #EDT-2026-${s.rollNumber} verified.`)}
                            >
                              <CheckCircle size={12} />
                              <span>Verified</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}

      {/* =========================================================================
          VIEW: HALL TICKETS & EXAM CLEARANCE (USER REQUIREMENTS 1, 4)
          "where is hall ticket print option"
          "in hall ticket we can print hall ticket but as combined for all subjects not sub wise all in one"
          ========================================================================= */}
      {activeTab === 'hall-ticket' && (() => {
        const divFiltered = baseStudentsRoster.filter(
          (s) => hallTicketDivisionFilter === 'All' || s.division === hallTicketDivisionFilter
        );
        const eligibleCandidates = divFiltered.filter((s) => s.percentage >= 75 && s.feeBalance <= 0);
        const withheldCandidates = divFiltered.filter((s) => s.percentage < 75 || s.feeBalance > 0);

        const displayedCandidates = divFiltered.filter((s) => {
          if (hallTicketFilter === 'eligible') return s.percentage >= 75 && s.feeBalance <= 0;
          if (hallTicketFilter === 'withheld') return s.percentage < 75 || s.feeBalance > 0;
          return true;
        });

        return (
          <>
            <div className="table-container">
              <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 className="table-title">Hall Tickets</h3>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    className="input-field"
                    style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 600 }}
                    value={hallTicketDivisionFilter}
                    onChange={(e) => setHallTicketDivisionFilter(e.target.value)}
                  >
                    {facultyAssignedDivisions.length > 1 && (
                      <option value="All">All Assigned Divisions ({facultyAssignedDivisions.join(', ')})</option>
                    )}
                    {facultyAssignedDivisions.map((div) => (
                      <option key={div} value={div}>Division {div} (Assigned Class)</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => {
                      if (!displayedCandidates || displayedCandidates.length === 0) {
                        toast.error('No Candidates', 'No student candidates found in current selection.');
                        return;
                      }
                      printBatchHallTickets(displayedCandidates, {
                        semester: 'Semester 6',
                        division: hallTicketDivisionFilter,
                        department: facultyDeptCode
                      });
                      toast.success(
                        'Batch Hall Tickets Ready',
                        `Printing ${displayedCandidates.length} hall tickets (1 per A4 page, sorted by Roll No.)`
                      );
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                    title="Print all students hall tickets at once (1 student per page, strictly ordered by Roll No.)"
                  >
                    <Printer size={13} />
                    <span>Print All Hall Tickets (Batch A4)</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => {
                      exportStudentRosterExcel(displayedCandidates, {
                        department: facultyDeptCode,
                        division: hallTicketDivisionFilter
                      });
                      toast.success('Clearance Excel Exported', `Generated formatted Excel register for ${displayedCandidates.length} candidates.`);
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    title="Export Clearance Register as formatted Excel Spreadsheet"
                  >
                    <FileSpreadsheet size={13} />
                    <span>Export to Excel</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => exportHallTicketClearanceCSV(displayedCandidates, hallTicketDivisionFilter)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    title="Export Hall Ticket Clearance Register (CSV)"
                  >
                    <Download size={13} />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Segmented Filter Control */}
              <div style={{ padding: '0 20px 14px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', gap: '3px' }}>
                  <button
                    type="button"
                    onClick={() => setHallTicketFilter('all')}
                    style={{
                      border: 'none',
                      background: hallTicketFilter === 'all' ? '#ffffff' : 'transparent',
                      color: hallTicketFilter === 'all' ? '#0f172a' : '#64748b',
                      boxShadow: hallTicketFilter === 'all' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: hallTicketFilter === 'all' ? 650 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    All Candidates ({divFiltered.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setHallTicketFilter('eligible')}
                    style={{
                      border: 'none',
                      background: hallTicketFilter === 'eligible' ? '#ffffff' : 'transparent',
                      color: hallTicketFilter === 'eligible' ? '#16a34a' : '#64748b',
                      boxShadow: hallTicketFilter === 'eligible' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: hallTicketFilter === 'eligible' ? 650 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <CheckCircle size={12} />
                    <span>Hall Ticket Unlocked ({eligibleCandidates.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHallTicketFilter('withheld')}
                    style={{
                      border: 'none',
                      background: hallTicketFilter === 'withheld' ? '#ffffff' : 'transparent',
                      color: hallTicketFilter === 'withheld' ? '#dc2626' : '#64748b',
                      boxShadow: hallTicketFilter === 'withheld' ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: hallTicketFilter === 'withheld' ? 650 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <AlertTriangle size={12} />
                    <span>Clearance Withheld ({withheldCandidates.length})</span>
                  </button>
                </div>
              </div>

              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Roll #</th>
                    <th>Candidate Name</th>
                    <th>PRN</th>
                    <th>Division</th>
                    <th>Attendance %</th>
                    <th>Fee Status</th>
                    <th>Admit Card Clearance</th>
                    <th style={{ textAlign: 'right' }}>Official Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCandidates.map((s) => {
                    const isAttOk = s.percentage >= 75;
                    const isFeeOk = s.feeBalance <= 0;
                    const isCleared = isAttOk && isFeeOk;

                    return (
                      <tr key={s.rollNumber} style={{ background: !isCleared ? 'rgba(239, 68, 68, 0.02)' : undefined }}>
                        <td><strong>#{s.rollNumber}</strong></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.email}</div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                            PRN-2024098{s.rollNumber}
                          </span>
                        </td>
                        <td>{s.course} (Div {s.division})</td>
                        <td>
                          <strong style={{ color: isAttOk ? '#10b981' : '#ef4444' }}>
                            {s.percentage}% {isAttOk ? '✓' : '✗'}
                          </strong>
                        </td>
                        <td>
                          <span style={{ color: isFeeOk ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: '0.8rem' }}>
                            {isFeeOk ? '✓ Cleared' : `₹${s.feeBalance.toLocaleString('en-IN')} Due`}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${isCleared ? 'badge-success' : 'badge-danger'}`}>
                            {isCleared ? '✓ Hall Ticket Issued' : '⚠️ Gatekeeper Hold'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn-primary btn-sm"
                              onClick={() => printOfficialHallTicket(s)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                            >
                              <Printer size={12} />
                              <span>Print Combined Hall Ticket</span>
                            </button>
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => downloadOfficialHallTicket(s)}
                              title="Download Admit Card HTML"
                            >
                              <Download size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}

      {/* =========================================================================
          VIEW 4: MARKS & EVALUATION ENGINE (User Requirement 1)
          Allows assigning, filling marks for assignments, exam papers, CIE & Viva
          ========================================================================= */}
      {activeTab === 'marks' && (
        <TeacherMarksAndEvaluations
          students={baseStudentsRoster}
          currentFaculty={currentFaculty}
        />
      )}

      {/* =========================================================================
          VIEW: GFM & CLASS TEACHER ROLE MANAGEMENT HUB (User Requirement 1)
          Role-based duties: Class Teacher division oversight & GFM mentee counseling
          ========================================================================= */}
      {activeTab === 'role-hub' && (
        <TeacherRoleManagementHub
          students={baseStudentsRoster}
          currentFaculty={currentFaculty}
          onNavigate={onNavigate}
        />
      )}

      {/* =========================================================================
          VIEW 5: ASSIGNMENTS (SECTIONS 1, 15, 29)
          Pills: [All] [Active] [Due] [Completed]
          ========================================================================= */}
      {activeTab === 'assignments' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <PillTabs
              tabs={[
                { id: 'all', label: 'All', count: teacherAssignments.length },
                { id: 'active', label: 'Active', count: teacherAssignments.filter((a) => a.status === 'Active').length },
                { id: 'due', label: 'Due', count: 1 },
                { id: 'completed', label: 'Completed', count: 0 }
              ]}
              activeTab={assignmentsFilter}
              onChange={setAssignmentsFilter}
            />
          </div>

          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Course Assignments</h3>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => {
                    const headers = ['Assignment ID', 'Title', 'Subject / Course', 'Deadline', 'Total Marks', 'Submissions Count', 'Total Students', 'Submission %', 'Status'];
                    const rows = teacherAssignments.map((a) => [
                      a.id,
                      `"${a.title}"`,
                      `"${a.subject}"`,
                      `"${a.deadline}"`,
                      a.totalMarks,
                      a.submissionsCount,
                      a.totalStudents,
                      `${Math.round((a.submissionsCount / (a.totalStudents || 1)) * 100)}%`,
                      `"${a.status}"`
                    ]);
                    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
                    const link = document.createElement('a');
                    link.setAttribute('href', encodeURI(csvContent));
                    link.setAttribute('download', `Course_Assignments_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  title="Export Course Assignments (CSV / Excel)"
                >
                  <Download size={13} />
                  <span>Export CSV</span>
                </button>

                <button className="btn-primary btn-sm" onClick={() => setIsAddAssignmentOpen(true)}>
                  <Plus size={13} />
                  <span>Create Assignment</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
              <table className="clean-table" style={{ minWidth: '820px' }}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Course</th>
                    <th>Deadline</th>
                    <th>Total Marks</th>
                    <th>Submissions</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherAssignments
                    .filter((a) => {
                      if (assignmentsFilter === 'all') return true;
                      if (assignmentsFilter === 'active') return a.status === 'Active';
                      if (assignmentsFilter === 'due') return a.id === 1;
                      if (assignmentsFilter === 'completed') return a.status === 'Completed';
                      return true;
                    })
                    .map((a) => {
                      const isGradingActive = activeGradingAssignmentId === a.id;
                      return (
                        <tr
                          key={a.id}
                          style={{
                            background: isGradingActive ? 'rgba(59, 130, 246, 0.03)' : undefined,
                            cursor: 'pointer'
                          }}
                          onClick={() => setActiveGradingAssignmentId(a.id)}
                        >
                          <td>
                            <strong>{a.title}</strong>
                            {isGradingActive && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  fontSize: '0.68rem',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: '#dbeafe',
                                  color: '#1d4ed8',
                                  fontWeight: 600
                                }}
                              >
                                Active for Grading
                              </span>
                            )}
                          </td>
                          <td>{a.subject}</td>
                          <td>{a.deadline}</td>
                          <td>{a.totalMarks} pts</td>
                          <td>
                            {a.submissionsCount} / {a.totalStudents} ({Math.round((a.submissionsCount / a.totalStudents) * 100)}%)
                          </td>
                          <td>
                            <span className="badge badge-success">{a.status}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                              <button
                                className={`btn-sm ${isGradingActive ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => {
                                  setActiveGradingAssignmentId(a.id);
                                  toast.info('Assignment Selected', `Opening grading ledger for "${a.title}".`);
                                  const el = document.getElementById('assignment-grading-ledger');
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                              >
                                Grade ({a.submissionsCount})
                              </button>
                              <button
                                className="btn-secondary btn-sm"
                                style={{ color: 'var(--danger)' }}
                                onClick={() => {
                                  setTeacherAssignments((prev) => prev.filter((item) => item.id !== a.id));
                                  toast.info('Assignment Removed', `Deleted "${a.title}".`);
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dedicated Assignment Submissions & Marks Evaluation Section */}
          <div id="assignment-grading-ledger">
            <TeacherAssignmentGrading
              assignments={teacherAssignments}
              selectedAssignmentId={activeGradingAssignmentId}
              onSelectAssignment={(id) => {
                setActiveGradingAssignmentId(id);
                const el = document.getElementById('assignment-grading-ledger');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              students={baseStudentsRoster}
              currentFaculty={currentFaculty}
            />
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 6: MATERIALS (SECTIONS 1, 15, 30)
          Pills: [All] [Notes] [PDF] [Links]
          ========================================================================= */}
      {activeTab === 'materials' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <PillTabs
              tabs={[
                { id: 'all', label: 'All', count: classMaterials.length },
                { id: 'notes', label: 'Notes' },
                { id: 'pdf', label: 'PDF', count: classMaterials.length },
                { id: 'links', label: 'Links' }
              ]}
              activeTab={materialsFilter}
              onChange={setMaterialsFilter}
            />
          </div>

          {/* Quick Notice to Dedicated Document Repository */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={16} style={{ color: '#059669' }} />
              <span style={{ fontSize: '0.825rem', color: '#475569' }}>
                Need institutional syllabi, solved question papers, or university templates?
              </span>
            </div>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => onNavigate && onNavigate('repository')}
              style={{ whiteSpace: 'nowrap' }}
            >
              <span>Open Document Repository</span>
            </button>
          </div>

          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Materials</h3>
              </div>

              <button className="btn-primary btn-sm" onClick={() => setIsUploadMaterialOpen(true)}>
                <Upload size={13} />
                <span>Upload Document</span>
              </button>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Subject</th>
                  <th>File Size</th>
                  <th>Upload Date</th>
                  <th>Downloads</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {classMaterials
                  .filter((mat) => {
                    if (materialsFilter === 'all') return true;
                    if (materialsFilter === 'notes') return mat.title.toLowerCase().includes('oop') || mat.title.toLowerCase().includes('guide');
                    if (materialsFilter === 'pdf') return mat.title.endsWith('.pdf');
                    if (materialsFilter === 'links') return false;
                    return true;
                  })
                  .map((mat) => (
                    <tr key={mat.id}>
                      <td><strong>{mat.title}</strong></td>
                      <td>{mat.subject}</td>
                      <td>{mat.size}</td>
                      <td>{mat.date}</td>
                      <td>{mat.downloads}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-secondary btn-sm"
                          style={{ color: 'var(--danger)' }}
                          onClick={() => {
                            setClassMaterials((prev) => prev.filter((m) => m.id !== mat.id));
                            toast.info('Resource Removed', `Deleted "${mat.title}".`);
                          }}
                        >
                          <Trash2 size={13} />
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
        <InstitutionalRepositoryView role="teacher" />
      )}

      {/* =========================================================================
          VIEW 7: ANNOUNCEMENTS (SECTIONS 1, 15, 39)
          Pills: [All] [Class Notices] [Department]
          ========================================================================= */}
      {activeTab === 'announcements' && (
        <AnnouncementsSection
          title="Faculty Notices & Circulars"
          subtitle="Publish and manage departmental circulars targeted to specific academic semesters"
          role="teacher"
          allowPublish={true}
        />
      )}

      {/* =========================================================================
          VIEW 8: TIMETABLE & EXAM DUTIES (Apple-Grade Interactive Hub)
          ========================================================================= */}
      {activeTab === 'timetable' && (
        <TimetableSection
          role="teacher"
          currentSemester="Semester 6"
          assignedDivision={`Div ${facultyAssignedDivisions[0] || 'A'}`}
        />
      )}
      {/* =========================================================================
          VIEW: STUDENTS ROSTER (TEACHING)
          ========================================================================= */}
      {activeTab === 'students' && (
        <div className="table-container">
          <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 className="table-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Student Roster ({facultyDeptCode} - Div {facultyAssignedDivisions.join(', ')})</span>
                <span className="badge badge-info" style={{ fontSize: '11px', fontWeight: 700 }}>
                  {displayedStudentsRoster.length} {displayedStudentsRoster.length === 1 ? 'Student' : 'Students'}
                </span>
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Cohort strictly restricted to your allocated department ({facultyDeptCode}) & assigned division ({facultyAssignedDivisions.join(', ')}). Other departments & faculties are isolated.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Search name, roll #..."
                  value={studentsRosterSearch}
                  onChange={(e) => setStudentsRosterSearch(e.target.value)}
                  className="form-input"
                  style={{
                    paddingLeft: '32px',
                    paddingRight: '12px',
                    height: '34px',
                    width: '180px',
                    fontSize: '12px'
                  }}
                />
              </div>

              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => {
                  if (!displayedStudentsRoster || displayedStudentsRoster.length === 0) {
                    toast.error('No Students', 'No student records found to print.');
                    return;
                  }
                  printAllStudentsComprehensiveDossiers(displayedStudentsRoster, {
                    department: facultyDeptCode,
                    division: facultyAssignedDivisions.join(', ')
                  });
                  toast.success(
                    'Complete Dossiers Ready',
                    `Preparing comprehensive records for ${displayedStudentsRoster.length} students (Multi-page batch).`
                  );
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 700 }}
                title="Print All Students Complete Data (Full Profiles, Academic Marks, Fees, Attendance & Submissions)"
              >
                <Printer size={13} />
                <span>Print All Students Complete Data</span>
              </button>

              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => {
                  exportStudentRosterExcel(displayedStudentsRoster, {
                    department: facultyDeptCode,
                    division: facultyAssignedDivisions.join(', ')
                  });
                  toast.success('Roster Exported to Excel', `Generated official formatted spreadsheet for ${displayedStudentsRoster.length} students.`);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                title="Export Student Roster in formatted Excel spreadsheet (.xls)"
              >
                <FileSpreadsheet size={13} />
                <span>Export to Excel</span>
              </button>

              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => {
                  printStudentRoster(displayedStudentsRoster, {
                    department: facultyDeptCode,
                    division: facultyAssignedDivisions.join(', ')
                  });
                  toast.info('Student Roster Print View', `Preparing printable class directory for ${displayedStudentsRoster.length} students.`);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                title="Print Official Institutional Student Roster"
              >
                <Printer size={13} />
                <span>Print Roster</span>
              </button>

              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => {
                  exportStudentsRosterCSV(displayedStudentsRoster, facultyAssignedDivisions.join('_'));
                  toast.success('Roster Exported', `Exported ${displayedStudentsRoster.length} students to CSV.`);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                title="Export Student Roster as CSV"
              >
                <Download size={13} />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Scoped Filter Tabs: Status & Assigned Division only */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 16px',
            background: 'var(--table-header-bg, rgba(255,255,255,0.03))',
            borderBottom: '1px solid var(--border-color)',
            overflowX: 'auto',
            alignItems: 'center'
          }}>
            <button
              type="button"
              className={`btn-pill ${studentsStatusFilter === 'all' && studentsDivisionFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                setStudentsStatusFilter('all');
                setStudentsDivisionFilter('all');
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                background: studentsStatusFilter === 'all' && studentsDivisionFilter === 'all' ? 'var(--primary, #0284c7)' : 'transparent',
                color: studentsStatusFilter === 'all' && studentsDivisionFilter === 'all' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              All Assigned ({baseStudentsRoster.length})
            </button>

            <button
              type="button"
              className={`btn-pill ${studentsStatusFilter === 'good' ? 'active' : ''}`}
              onClick={() => setStudentsStatusFilter((prev) => prev === 'good' ? 'all' : 'good')}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                background: studentsStatusFilter === 'good' ? 'var(--primary, #0284c7)' : 'transparent',
                color: studentsStatusFilter === 'good' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              In Good Standing ({baseStudentsRoster.filter(s => Number(s.percentage) >= 75).length})
            </button>

            <button
              type="button"
              className={`btn-pill ${studentsStatusFilter === 'low' ? 'active' : ''}`}
              onClick={() => setStudentsStatusFilter((prev) => prev === 'low' ? 'all' : 'low')}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                background: studentsStatusFilter === 'low' ? 'var(--danger, #ef4444)' : 'transparent',
                color: studentsStatusFilter === 'low' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              Low Attendance ({baseStudentsRoster.filter(s => Number(s.percentage) < 75).length})
            </button>

            {facultyAssignedDivisions.length > 1 && facultyAssignedDivisions.map((div) => (
              <button
                key={div}
                type="button"
                className={`btn-pill ${studentsDivisionFilter === div ? 'active' : ''}`}
                onClick={() => setStudentsDivisionFilter((prev) => prev === div ? 'all' : div)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  background: studentsDivisionFilter === div ? 'var(--primary, #0284c7)' : 'transparent',
                  color: studentsDivisionFilter === div ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Div {div} ({baseStudentsRoster.filter(s => (s.division || 'A').toUpperCase() === div).length})
              </button>
            ))}
          </div>

          <table className="clean-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Roll #</th>
                <th>Full Name</th>
                <th>Course / Division</th>
                <th>Attendance %</th>
                <th>Fee Status</th>
                <th>Academic Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedStudentsRoster.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                    No students match the current filter or search criteria in your assigned cohort.
                  </td>
                </tr>
              ) : (
                displayedStudentsRoster.map((s) => (
                  <tr key={s.rollNumber}>
                    <td>
                      <strong style={{ color: 'var(--primary, #0284c7)', fontFamily: 'monospace', fontSize: '13px' }}>
                        #{s.rollNumber}
                      </strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {s.prn || (s.email ? s.email.split('@')[0] : `PRN-RBT24${facultyDeptCode}${String(s.rollNumber).slice(-2)}`)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 500 }}>
                          {facultyDeptCode} (Div {s.division || facultyAssignedDivisions[0] || 'A'})
                        </span>
                        <span
                          className="badge badge-info"
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            fontWeight: 700
                          }}
                        >
                          Assigned
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: Number(s.percentage) < 75 ? 'var(--danger, #ef4444)' : 'var(--success, #10b981)', fontWeight: 600 }}>
                          {Number(s.percentage).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${s.feePaid >= s.feeTotal ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '11px' }}>
                        {s.feePaid >= s.feeTotal ? 'Paid in Full' : 'Pending Dues'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${Number(s.percentage) < 75 ? 'badge-danger' : 'badge-success'}`}>
                        {Number(s.percentage) < 75 ? 'Low Attendance' : 'In Good Standing'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => onViewStudent && onViewStudent(s)}
                        style={{ fontSize: '12px', padding: '4px 10px' }}
                      >
                        View Record
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          VIEW: NOTIFICATIONS (COMMUNICATION)
          ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="table-container">
          <div className="table-header-bar">
            <div>
              <h3 className="table-title">Notifications</h3>
            </div>
            <button
              className="btn-secondary btn-sm"
              onClick={() => toast.success('Cleared', 'All faculty notices marked as read.')}
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
                  <strong style={{ fontSize: '0.875rem' }}>Attendance Deficit Alert</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>30 mins ago</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  2 students in IT Div A have attendance below the 75% threshold in Computer Networks.
                </p>
              </div>
            </div>

            <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--secondary)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.875rem' }}>Assignment Submissions Completed</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>2 hours ago</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  38 students submitted their JDBC Student Management Project files ready for evaluation.
                </p>
              </div>
            </div>

            <div style={{ padding: '14px 0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.875rem' }}>Room Allocation Confirmed</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Yesterday</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Lab A-1 reserved for Thursday 8:00 AM Core Java practicals.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW: SETTINGS (ACCOUNT)
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
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>Automated Low-Attendance Warnings</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Auto-flag students on roster when attendance falls below 75%.
                </p>
                <span className="badge badge-success">Active & Monitoring</span>
              </div>

              <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>Office Hours & Consultation</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Weekly schedule displayed to students for academic mentorship.
                </p>
                <div style={{ fontSize: '0.84rem', fontWeight: 500, color: 'var(--text-main)' }}>
                  Mon & Wed: 3:00 PM – 4:30 PM (Cabin F-204)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddAssignmentOpen && (
        <div className="modal-overlay" onClick={() => setIsAddAssignmentOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Class Assignment</h3>
              <button className="modal-close-btn" onClick={() => setIsAddAssignmentOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateAssignment}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Assignment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 3 JDBC Implementation"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Course / Subject</label>
                  <select
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    {facultySubjects.map((sub) => (
                      <option key={sub.code} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Submission Deadline</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.deadline}
                    onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddAssignmentOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUploadMaterialOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadMaterialOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Upload Study Document</h3>
              <button className="modal-close-btn" onClick={() => setIsUploadMaterialOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleUploadMaterial}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Document Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 4 Multithreading Notes.pdf"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Select File (PDF)</label>
                  <input type="file" className="input-field" required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsUploadMaterialOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBroadcastOpen && (
        <div className="modal-overlay" onClick={() => setIsBroadcastOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Post Class Notice</h3>
              <button className="modal-close-btn" onClick={() => setIsBroadcastOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSendBroadcast}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Announcement Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Extra Practical Session"
                    value={broadcastMessage.title}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message Content</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Write notice text..."
                    value={broadcastMessage.message}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, message: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsBroadcastOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
