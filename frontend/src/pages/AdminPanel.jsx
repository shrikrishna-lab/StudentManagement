import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  HardDrive,
  Database,
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  AlertTriangle,
  ArrowUpDown,
  BookOpen,
  GraduationCap,
  Briefcase,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Download,
  Upload,
  FileText,
  Server,
  Layers,
  Activity,
  UserPlus,
  RefreshCw,
  X,
  Check,
  Building2,
  Calendar,
  Megaphone,
  FileSpreadsheet,
  Printer,
  FlaskConical,
  Clock,
  Sparkles,
  Filter,
  Lock,
  ChevronRight,
  Settings as SettingsIcon
} from 'lucide-react';
import Alert from '../components/Alert';
import { useToast } from '../context/ToastContext';
import PillTabs from '../components/navigation/PillTabs';
import DocumentCardGrid from '../components/common/DocumentCardGrid';
import InstitutionalRepositoryView from '../components/common/InstitutionalRepositoryView';
import AnnouncementsSection from '../components/common/AnnouncementsSection';
import TimetableSection from '../components/common/TimetableSection';
import StudentClearanceManager from '../components/common/StudentClearanceManager';
import {
  exportStudentRosterExcel,
  printStudentRoster,
  printAllStudentsComprehensiveDossiers
} from '../lib/exportFormatHelper';
import {
  getStudyMaterials,
  addStudyMaterial,
  deleteStudyMaterial
} from '../lib/studyMaterialsData';
import {
  getStudentsClearance,
  updateStudentAttendanceData,
  grantCondonationWaiver
} from '../lib/clearanceData';
import AdminDocAutoChecker from '../components/admin/AdminDocAutoChecker';
import AdminFacultyAllocation from '../components/admin/AdminFacultyAllocation';
import AdminPRNGenerator from '../components/admin/AdminPRNGenerator';
import AdminSecurityApprovals from '../components/admin/AdminSecurityApprovals';
import {
  getDepartmentsList,
  saveDepartmentRecord,
  deleteDepartmentRecord,
  getSubjectsCatalog,
  saveSubjectRecord,
  deleteSubjectRecord,
  getClassesCatalog,
  saveClassRecord,
  deleteClassRecord,
  SEMESTER_LIST,
  YEAR_LIST,
  getYearForSemester,
  getNextSemester,
  getSubjectsForDepartmentAndSemester,
  advanceCohortToNextSemester,
  autoAssignStudentSubjectsOnProgression
} from '../lib/academicCatalogData';
import {
  getAcademicCalendar,
  saveAcademicCalendar,
  getCalendarDurationSummary
} from '../lib/academicCalendarData';
import { studentService } from '../services/studentService';

export default function AdminPanel({
  activeTab = 'dashboard',
  onNavigate,
  students = [],
  loading = false,
  onViewStudent,
  onEditStudent,
  onDeleteStudent
}) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('hierarchy');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All'); // 'All' | 'distinction' | 'first' | 'pass'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Page-Level Sub-tab & Filter States (Sections 1, 15, 38)
  const [reportsSubTab, setReportsSubTab] = useState('students');
  const [activitySubTab, setActivitySubTab] = useState('all');
  const [timetableMode, setTimetableMode] = useState('schedule'); // 'schedule' | 'clearance'
  const [marksMode, setMarksMode] = useState('clearance'); // 'clearance' | 'analytics'

  // Study Materials State & Filters (Admin Managed)
  const [studyMaterials, setStudyMaterials] = useState(getStudyMaterials);
  const [materialsSearch, setMaterialsSearch] = useState('');
  const [materialsDeptFilter, setMaterialsDeptFilter] = useState('All');
  const [materialsCatFilter, setMaterialsCatFilter] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCourse, setNewDocCourse] = useState('IT-301');
  const [newDocDept, setNewDocDept] = useState('IT');
  const [newDocCategory, setNewDocCategory] = useState('Lecture Notes');
  const [newDocFormat, setNewDocFormat] = useState('PDF');
  const [newDocSize, setNewDocSize] = useState('4.2 MB');
  const [newDocUploader, setNewDocUploader] = useState('System Admin');

  // Attendance & Laboratory Management State (Admin Managed)
  const [attendanceSubTab, setAttendanceSubTab] = useState('students'); // 'students' | 'compliance'
  const [attendanceList, setAttendanceList] = useState(getStudentsClearance);
  const [selectedStudentForAtt, setSelectedStudentForAtt] = useState(null);
  const [attEditOverall, setAttEditOverall] = useState(85);
  const [attEditTheory, setAttEditTheory] = useState(84);
  const [attEditLab, setAttEditLab] = useState(90);
  const [attEditCondonation, setAttEditCondonation] = useState(false);
  const [attEditSubjects, setAttEditSubjects] = useState([]);
  const [attSearch, setAttSearch] = useState('');
  const [attDeptFilter, setAttDeptFilter] = useState('All');
  const [isAttModalOpen, setIsAttModalOpen] = useState(false);

  // Refresh attendance when clearance updates
  useEffect(() => {
    const handleSync = () => {
      setAttendanceList(getStudentsClearance());
    };
    window.addEventListener('edutrack_clearance_updated', handleSync);
    return () => window.removeEventListener('edutrack_clearance_updated', handleSync);
  }, []);

  // 1. Faculty / Teacher Management State
  const [teachers, setTeachers] = useState([
    { id: 'FAC-IT-101', name: 'Prof. Krrish Sharma', email: 'krrish.faculty@edutrack.edu', department: 'Information Technology', subject: 'Core Java & OOP', status: 'Active' },
    { id: 'FAC-CS-102', name: 'Dr. Vivek Joshi', email: 'v.joshi@edutrack.edu', department: 'Computer Science', subject: 'Data Structures & Algorithms', status: 'Active' },
    { id: 'FAC-IT-103', name: 'Prof. Neha Mehta', email: 'n.mehta@edutrack.edu', department: 'Information Technology', subject: 'Database Management Systems', status: 'Active' },
    { id: 'FAC-EXTC-104', name: 'Dr. Sanjay Verma', email: 's.verma@edutrack.edu', department: 'Electronics & Telecom', subject: 'Signals & Microprocessors', status: 'Active' },
    { id: 'FAC-MECH-105', name: 'Prof. Rajesh Nair', email: 'r.nair@edutrack.edu', department: 'Mechanical Engineering', subject: 'Thermodynamics & Robotics', status: 'Inactive' }
  ]);

  // 2. Departments & Courses Catalog (Live Intake Sync)
  const [departments, setDepartments] = useState(getDepartmentsList);
  const [deptSearch, setDeptSearch] = useState('');
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({
    code: '',
    name: '',
    hod: '',
    duration: '4 Years',
    intakeLimit: 120,
    activeSemester: 'Semester 6'
  });

  // Academic Calendar & Semester Duration State
  const [courseSubTab, setCourseSubTab] = useState('departments'); // 'departments' | 'calendar'
  const [academicCalendar, setAcademicCalendar] = useState(getAcademicCalendar);
  const [calendarSummary, setCalendarSummary] = useState(getCalendarDurationSummary);
  const [isCalendarEditOpen, setIsCalendarEditOpen] = useState(false);
  const [calendarForm, setCalendarForm] = useState(getAcademicCalendar);

  // 3. Subject Catalog (Theory & Practical Labs) with Year-wise & Dept-wise Scoping
  const [subjectsList, setSubjectsList] = useState(getSubjectsCatalog);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectDeptFilter, setSubjectDeptFilter] = useState('All');
  const [subjectYearFilter, setSubjectYearFilter] = useState('All');
  const [subjectSemFilter, setSubjectSemFilter] = useState('All');
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    department: 'Information Technology',
    semester: 'Semester 6',
    year: 'Year 3 (TE)',
    type: 'Theory',
    teacher: '',
    credits: 4,
    weeklyHours: 4,
    room: 'Room 302'
  });

  // Cohort Auto-Assignment & Progression State
  const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);
  const [cohortDept, setCohortDept] = useState('Information Technology');
  const [cohortFromSem, setCohortFromSem] = useState('Semester 5');
  const [cohortToSem, setCohortToSem] = useState('Semester 6');

  // 4. Classes Catalog (Divisions & Classrooms)
  const [classesList, setClassesList] = useState(getClassesCatalog);
  const [classSearch, setClassSearch] = useState('');
  const [classDeptFilter, setClassDeptFilter] = useState('All');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [classForm, setClassForm] = useState({
    id: '',
    name: '',
    department: 'Information Technology',
    year: 'Year 3 (TE)',
    division: 'Div A',
    room: 'Room 302',
    timing: '08:30 AM - 04:30 PM',
    students: 75,
    rep: ''
  });

  // Academic Delete Confirmation State
  const [academicDeleteTarget, setAcademicDeleteTarget] = useState(null);

  useEffect(() => {
    const syncDepartments = () => setDepartments(getDepartmentsList());
    const syncSubjects = () => setSubjectsList(getSubjectsCatalog());
    const syncClasses = () => setClassesList(getClassesCatalog());
    const syncCalendar = () => {
      setAcademicCalendar(getAcademicCalendar());
      setCalendarSummary(getCalendarDurationSummary());
    };

    window.addEventListener('edutrack_intakes_updated', syncDepartments);
    window.addEventListener('edutrack_subjects_updated', syncSubjects);
    window.addEventListener('edutrack_classes_updated', syncClasses);
    window.addEventListener('edutrack_academic_calendar_updated', syncCalendar);

    return () => {
      window.removeEventListener('edutrack_intakes_updated', syncDepartments);
      window.removeEventListener('edutrack_subjects_updated', syncSubjects);
      window.removeEventListener('edutrack_classes_updated', syncClasses);
      window.removeEventListener('edutrack_academic_calendar_updated', syncCalendar);
    };
  }, []);

  // Department CRUD Handlers
  const handleOpenAddDept = () => {
    setEditingDept(null);
    setDeptForm({
      code: '',
      name: '',
      hod: '',
      duration: '4 Years',
      intakeLimit: 120,
      activeSemester: 'Semester 6'
    });
    setIsDeptModalOpen(true);
  };

  const handleOpenEditDept = (dept) => {
    setEditingDept(dept);
    setDeptForm({
      code: dept.code,
      name: dept.name,
      hod: dept.hod || '',
      duration: dept.duration || '4 Years',
      intakeLimit: dept.intakeLimit || 120,
      activeSemester: dept.activeSemester || 'Semester 6'
    });
    setIsDeptModalOpen(true);
  };

  const handleSaveDeptSubmit = (e) => {
    e.preventDefault();
    if (!deptForm.code.trim() || !deptForm.name.trim()) {
      toast.error('Validation Error', 'Department code and title are required.');
      return;
    }
    saveDepartmentRecord(deptForm);
    setDepartments(getDepartmentsList());
    setIsDeptModalOpen(false);
    toast.success(
      editingDept ? 'Department Updated' : 'Department Registered',
      `${deptForm.code} intake set to ${deptForm.intakeLimit} seats. Divisions synchronized.`
    );
  };

  const handleConfirmDeleteDept = (code) => {
    deleteDepartmentRecord(code);
    setDepartments(getDepartmentsList());
    setAcademicDeleteTarget(null);
    toast.info('Department Removed', `Department ${code} has been deleted.`);
  };

  // Academic Calendar & Semester Duration Handlers
  const handleOpenCalendarEdit = () => {
    setCalendarForm(getAcademicCalendar());
    setIsCalendarEditOpen(true);
  };

  const handleSaveCalendarSubmit = (e) => {
    e.preventDefault();
    const updated = saveAcademicCalendar(calendarForm);
    setAcademicCalendar(updated);
    setCalendarSummary(getCalendarDurationSummary(updated));
    setIsCalendarEditOpen(false);
    toast.success(
      'Semester Duration Updated',
      `Active Term (${updated.academicYear}) duration configured from ${updated.startDate} to ${updated.endDate}.`
    );
  };

  // Cohort Progression & Auto-Assignment Handlers
  const handleOpenCohortModal = () => {
    setCohortDept(departments[0]?.name || 'Information Technology');
    setCohortFromSem('Semester 5');
    setCohortToSem('Semester 6');
    setIsCohortModalOpen(true);
  };

  const handleExecuteCohortProgression = (e) => {
    e.preventDefault();
    const result = advanceCohortToNextSemester(cohortDept, cohortFromSem, cohortToSem);
    setSubjectsList(getSubjectsCatalog());
    setIsCohortModalOpen(false);
    toast.success(
      'Cohort Promoted & Enrolled',
      `Advanced ${result.count || 'all active'} students in ${cohortDept} from ${cohortFromSem} to ${cohortToSem}. All curriculum subjects auto-assigned!`
    );
  };

  const handleQuickPromoteStudent = (student) => {
    const nextSem = getNextSemester(student.semester);
    const result = autoAssignStudentSubjectsOnProgression(student.rollNumber, nextSem, student.course);
    toast.success(
      'Student Promoted & Syllabi Auto-Assigned',
      `${student.name} (${student.rollNumber}) transitioned to ${nextSem}. ${result.assignedSubjects?.length || 6} curriculum subjects, grades, and attendance rosters auto-assigned.`
    );
  };

  // Subject CRUD Handlers
  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubjectForm({
      code: '',
      name: '',
      department: departments[0]?.name || 'Information Technology',
      semester: 'Semester 6',
      year: 'Year 3 (TE)',
      type: 'Theory',
      teacher: '',
      credits: 4,
      weeklyHours: 4,
      room: 'Room 302'
    });
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (subj) => {
    setEditingSubject(subj);
    setSubjectForm({
      code: subj.code,
      name: subj.name,
      department: subj.department,
      semester: subj.semester,
      year: subj.year || getYearForSemester(subj.semester),
      type: subj.type || 'Theory',
      teacher: subj.teacher || '',
      credits: subj.credits || 4,
      weeklyHours: subj.weeklyHours || 4,
      room: subj.room || 'Room 302'
    });
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubjectSubmit = (e) => {
    e.preventDefault();
    if (!subjectForm.code.trim() || !subjectForm.name.trim()) {
      toast.error('Validation Error', 'Subject code and name are required.');
      return;
    }
    saveSubjectRecord(subjectForm);
    setSubjectsList(getSubjectsCatalog());
    setIsSubjectModalOpen(false);
    toast.success(
      editingSubject ? 'Subject Updated' : 'Subject Created',
      `${subjectForm.code}: ${subjectForm.name} saved successfully.`
    );
  };

  const handleConfirmDeleteSubject = (code) => {
    deleteSubjectRecord(code);
    setSubjectsList(getSubjectsCatalog());
    setAcademicDeleteTarget(null);
    toast.info('Subject Deleted', `Course ${code} removed from catalog.`);
  };

  // Class CRUD Handlers
  const handleOpenAddClass = () => {
    setEditingClass(null);
    setClassForm({
      id: '',
      name: '',
      department: departments[0]?.name || 'Information Technology',
      year: 'Year 3 (TE)',
      division: 'Div A',
      room: 'Room 302',
      timing: '08:30 AM - 04:30 PM',
      students: 75,
      rep: ''
    });
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (cls) => {
    setEditingClass(cls);
    setClassForm({
      id: cls.id,
      name: cls.name,
      department: cls.department,
      year: cls.year,
      division: cls.division || 'Div A',
      room: cls.room,
      timing: cls.timing,
      students: cls.students,
      rep: cls.rep || ''
    });
    setIsClassModalOpen(true);
  };

  const handleSaveClassSubmit = (e) => {
    e.preventDefault();
    const resolvedName = classForm.name.trim() || `${classForm.department} - ${classForm.division}`;
    saveClassRecord({ ...classForm, name: resolvedName });
    setClassesList(getClassesCatalog());
    setIsClassModalOpen(false);
    toast.success(
      editingClass ? 'Class Division Updated' : 'Class Division Created',
      `${resolvedName} configured.`
    );
  };

  const handleConfirmDeleteClass = (id) => {
    deleteClassRecord(id);
    setClassesList(getClassesCatalog());
    setAcademicDeleteTarget(null);
    toast.info('Class Division Removed', 'Division record has been deleted.');
  };

  // 5. User Accounts & Access Control
  const [userAccounts, setUserAccounts] = useState([
    { id: 'USR-01', name: 'System Administrator', email: 'admin@edutrack.edu', role: 'Admin', status: 'Active', lastLogin: 'Just now' },
    { id: 'USR-02', name: 'Prof. Krrish Sharma', email: 'teacher@edutrack.edu', role: 'Teacher', status: 'Active', lastLogin: '10 mins ago' },
    { id: 'USR-03', name: 'Krrish Sharma', email: 'student@edutrack.edu', role: 'Student', status: 'Active', lastLogin: '25 mins ago' },
    { id: 'USR-04', name: 'Ananya Verma', email: 'ananya.verma@example.com', role: 'Student', status: 'Active', lastLogin: '2 hours ago' },
    { id: 'USR-05', name: 'Guest Faculty Examiner', email: 'guest.faculty@edutrack.edu', role: 'Teacher', status: 'Inactive', lastLogin: '5 days ago' }
  ]);

  // 6. Activity & Audit Logs
  const [auditLogs] = useState([
    { id: 'LOG-881', timestamp: '12:15:30', user: 'System Admin', action: 'DATABASE_BACKUP_EXPORT', module: 'MySQL 8.0', status: 'Success', ip: '127.0.0.1' },
    { id: 'LOG-880', timestamp: '12:10:14', user: 'Prof. Krrish', action: 'ATTENDANCE_COMMITTED', module: 'IT Div A', status: 'Success', ip: '192.168.1.42' },
    { id: 'LOG-879', timestamp: '12:05:44', user: 'System Admin', action: 'USER_ROLE_VERIFIED', module: 'Auth Core', status: 'Success', ip: '127.0.0.1' },
    { id: 'LOG-878', timestamp: '11:58:20', user: 'Student #101', action: 'ASSIGNMENT_UPLOAD', module: 'Portal', status: 'Success', ip: '192.168.1.101' },
    { id: 'LOG-877', timestamp: '11:42:15', user: 'System Admin', action: 'STUDENT_RECORD_INSERT', module: 'MySQL JDBC', status: 'Success', ip: '127.0.0.1' }
  ]);

  // Announcements
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Final Examination Schedule for Spring 2026', date: 'Oct 02, 2026', target: 'All Cohorts', message: 'Theory and practical examination timetable published.' },
    { id: 2, title: 'Faculty Academic Committee Meeting', date: 'Sep 30, 2026', target: 'Faculty Roster', message: 'Annual curriculum review meeting scheduled in Conference Hall 1.' }
  ]);

  // Modals state
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ id: 'FAC-IT-106', name: '', email: '', department: 'Information Technology', subject: 'Core Java' });
  const [newNotice, setNewNotice] = useState({ title: '', target: 'All Cohorts', message: '' });

  // Filtered students for Overview student directory with multi-tier sorting
  const processedStudents = useMemo(() => {
    let list = [...students];
    if (selectedCourse !== 'All') {
      list = list.filter((s) => (s.course || '').toUpperCase() === selectedCourse.toUpperCase());
    }
    if (selectedYear !== 'All') {
      list = list.filter((s) => String(s.year || '1') === String(selectedYear));
    }
    if (selectedDivision !== 'All') {
      list = list.filter((s) => String(s.division || 'A').toUpperCase() === selectedDivision.toUpperCase());
    }
    if (selectedGrade !== 'All') {
      if (selectedGrade === 'distinction') list = list.filter((s) => Number(s.percentage) >= 85);
      else if (selectedGrade === 'first') list = list.filter((s) => Number(s.percentage) >= 60 && Number(s.percentage) < 85);
      else if (selectedGrade === 'pass') list = list.filter((s) => Number(s.percentage) < 60);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          (s.name || '').toLowerCase().includes(q) ||
          (s.email || '').toLowerCase().includes(q) ||
          (s.course || '').toLowerCase().includes(q) ||
          String(s.division || '').toLowerCase().includes(q) ||
          String(s.year || '').toLowerCase().includes(q) ||
          String(s.rollNumber || '').includes(q)
      );
    }
    list.sort((a, b) => {
      switch (selectedSort) {
        case 'hierarchy': {
          // 1. Year-wise (Year 1/FE -> Year 2/SE -> Year 3/TE -> Year 4/BE)
          const yA = Number(a.year) || 1;
          const yB = Number(b.year) || 1;
          if (yA !== yB) return yA - yB;

          // 2. Department-wise
          const dA = (a.course || '').toUpperCase();
          const dB = (b.course || '').toUpperCase();
          if (dA !== dB) return dA.localeCompare(dB);

          // 3. Division-wise (A -> B -> C)
          const divA = (a.division || 'A').toUpperCase();
          const divB = (b.division || 'B').toUpperCase();
          if (divA !== divB) return divA.localeCompare(divB);

          // 4. Roll No. ascending
          return (Number(a.rollNumber) || 0) - (Number(b.rollNumber) || 0);
        }
        case 'dept-div-roll': {
          const dA = (a.course || '').toUpperCase();
          const dB = (b.course || '').toUpperCase();
          if (dA !== dB) return dA.localeCompare(dB);

          const divA = (a.division || 'A').toUpperCase();
          const divB = (b.division || 'B').toUpperCase();
          if (divA !== divB) return divA.localeCompare(divB);

          return (Number(a.rollNumber) || 0) - (Number(b.rollNumber) || 0);
        }
        case 'roll-asc': return (Number(a.rollNumber) || 0) - (Number(b.rollNumber) || 0);
        case 'roll-desc': return (Number(b.rollNumber) || 0) - (Number(a.rollNumber) || 0);
        case 'name-asc': return (a.name || '').localeCompare(b.name || '');
        case 'name-desc': return (b.name || '').localeCompare(a.name || '');
        case 'percentage-desc': return (b.percentage || 0) - (a.percentage || 0);
        case 'percentage-asc': return (a.percentage || 0) - (b.percentage || 0);
        default: return (Number(a.rollNumber) || 0) - (Number(b.rollNumber) || 0);
      }
    });
    return list;
  }, [students, searchQuery, selectedCourse, selectedYear, selectedDivision, selectedGrade, selectedSort]);

  const activeFiltersCount = useMemo(() => {
    return (selectedCourse !== 'All' ? 1 : 0) +
      (selectedDivision !== 'All' ? 1 : 0) +
      (selectedGrade !== 'All' ? 1 : 0) +
      (selectedSort !== 'hierarchy' ? 1 : 0);
  }, [selectedCourse, selectedDivision, selectedGrade, selectedSort]);

  const confirmDelete = () => {
    if (studentToDelete) {
      onDeleteStudent(studentToDelete.rollNumber);
      setStudentToDelete(null);
      toast.warning('Student Deleted', `Roll #${studentToDelete.rollNumber} removed from database.`);
    }
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacher.name) return;
    setTeachers((prev) => [
      ...prev,
      { ...newTeacher, id: `FAC-${newTeacher.department.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`, status: 'Active' }
    ]);
    setIsAddTeacherOpen(false);
    toast.success('Teacher Registered', `Faculty record for ${newTeacher.name} created.`);
    setNewTeacher({ id: '', name: '', email: '', department: 'Information Technology', subject: 'Core Java' });
  };

  const toggleTeacherStatus = (id) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' } : t))
    );
    toast.info('Faculty Status Updated', 'Teacher status modified.');
  };

  const toggleUserStatus = (id) => {
    setUserAccounts((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u))
    );
    toast.info('Account Status Toggled', 'User account status updated.');
  };

  const [liveDbInfo, setLiveDbInfo] = useState({
    status: 'UP',
    connected: true,
    latencyMs: 25,
    studentCount: students.length,
    tablesCount: 20
  });

  useEffect(() => {
    studentService.checkHealth().then((info) => {
      if (info && info.connected) {
        setLiveDbInfo(info);
      }
    });
  }, [students.length]);

  const handleDatabasePing = async () => {
    try {
      const info = await studentService.checkHealth();
      if (info.connected) {
        setLiveDbInfo(info);
        toast.success(
          `MySQL 8.0 Live: ${info.latencyMs}ms`,
          `Connection verified on localhost:3306. ${info.tablesCount} tables, ${info.studentCount} students synchronized in real-time.`
        );
      } else {
        toast.error('Database Offline', 'Backend server unreachable on port 5000.');
      }
    } catch (err) {
      toast.error('Ping Failed', err.message);
    }
  };

  const [assignmentsList, setAssignmentsList] = useState([
    { id: 1, subjectCode: 'IT-301', title: 'JDBC Student Management Project', faculty: 'Prof. Krrish Sharma', submissionsCount: 10, totalStudents: 10, compliance: '100%', status: 'Active' },
    { id: 2, subjectCode: 'IT-301', title: 'Collections Framework & Generics Lab', faculty: 'Prof. Krrish Sharma', submissionsCount: 10, totalStudents: 10, compliance: '100%', status: 'Active' },
    { id: 3, subjectCode: 'IT-302', title: 'Normalization 3NF/BCNF Schema Design', faculty: 'Prof. Neha Mehta', submissionsCount: 0, totalStudents: 10, compliance: '0%', status: 'Active' }
  ]);

  useEffect(() => {
    fetch('http://localhost:5000/api/assignments')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAssignmentsList(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddNotice = (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.message) return;
    setAnnouncements((prev) => [
      { id: Date.now(), title: newNotice.title, target: newNotice.target, message: newNotice.message, date: 'Just now' },
      ...prev
    ]);
    setIsAddNoticeOpen(false);
    toast.success('Announcement Published', `Notice "${newNotice.title}" broadcasted.`);
    setNewNotice({ title: '', target: 'All Cohorts', message: '' });
  };

  return (
    <div>
      {/* =========================================================================
          VIEW 1: DASHBOARD (ADMIN DASHBOARD PER SECTION 8)
          - Total students
          - Total teachers
          - Courses/classes
          - Important system information
          - Relevant recent activity
          ========================================================================= */}
      {activeTab === 'dashboard' && (
        <>
          {/* Metrics Row */}
          <div className="stats-grid" style={{ marginBottom: 20 }}>
            <div className="stat-card">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{students.length}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total Teachers</span>
              <span className="stat-value">{teachers.length}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Courses & Classes</span>
              <span className="stat-value">4 / 4</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Database Status</span>
              <span className="stat-value" style={{ color: 'var(--success)' }}>Online</span>
            </div>
          </div>

          {/* Recent System Activity / Audit Table */}
          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Recent System Activity</h3>
              </div>
            </div>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td><strong>{log.id}</strong></td>
                    <td style={{ color: 'var(--text-muted)' }}>{log.timestamp}</td>
                    <td style={{ fontWeight: 600 }}>{log.user}</td>
                    <td>
                      <code style={{ background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {log.action}
                      </code>
                    </td>
                    <td>{log.module}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="badge badge-success">{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: STUDENTS (CRUD MANAGEMENT)
          ========================================================================= */}
      {activeTab === 'students' && (
        <div className="table-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Year-Wise Section Bar (Apple Segmented Style) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            padding: '8px 12px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 30, height: 30, borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <GraduationCap size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                  Academic Year
                </span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>
                  Filter directory by study year
                </span>
              </div>
            </div>

            {/* Apple Segmented Control */}
            <div style={{
              display: 'inline-flex',
              background: '#f1f5f9',
              padding: '3px',
              borderRadius: '12px',
              gap: '2px',
              flexWrap: 'wrap'
            }}>
              {[
                { key: 'All', label: 'All Years (FE–BE)', count: students.length },
                { key: '1', label: 'FE • 1st Year', count: students.filter((s) => String(s.year || '1') === '1').length },
                { key: '2', label: 'SE • 2nd Year', count: students.filter((s) => String(s.year) === '2').length },
                { key: '3', label: 'TE • 3rd Year', count: students.filter((s) => String(s.year) === '3').length },
                { key: '4', label: 'BE • 4th Year', count: students.filter((s) => String(s.year) === '4').length }
              ].map((tab) => {
                const isActive = selectedYear === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedYear(tab.key)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '9px',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? '#0f172a' : '#64748b',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.18s var(--ease-apple)',
                      boxShadow: isActive ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none'
                    }}
                  >
                    <span>{tab.label}</span>
                    <span style={{
                      fontSize: '0.68rem',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      background: isActive ? '#eff6ff' : '#e2e8f0',
                      color: isActive ? '#2563eb' : '#64748b',
                      fontWeight: 700
                    }}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Directory Toolbar with Apple Filter Popover (matching Image 3) */}
          <div className="table-header-bar" style={{ marginTop: 0, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 className="table-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Student Directory
              </h3>
              <span style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {processedStudents.length} Record{processedStudents.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Apple Search Field */}
              <div className="search-bar-wrap" style={{ minWidth: '220px' }}>
                <Search size={14} className="search-bar-icon" />
                <input
                  type="text"
                  placeholder="Search roll, PRN, name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  style={{ background: '#f8fafc', borderRadius: '10px', fontSize: '0.8rem' }}
                />
              </div>

              {/* Apple-Style Filter Flyout Trigger Button (Image 3 Style) */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: isFilterOpen || activeFiltersCount > 0 ? '#eff6ff' : '#ffffff',
                    border: isFilterOpen || activeFiltersCount > 0 ? '1px solid #bfdbfe' : '1px solid #cbd5e1',
                    color: isFilterOpen || activeFiltersCount > 0 ? '#1d4ed8' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isFilterOpen ? '0 0 0 3px rgba(37, 99, 235, 0.12)' : '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                >
                  <Filter size={15} />
                  <span>Filter</span>
                  {activeFiltersCount > 0 && (
                    <span style={{
                      background: '#2563eb',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      fontWeight: 800
                    }}>
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Floating Apple-Style Filter Popover Modal (matching Image 3) */}
                {isFilterOpen && (
                  <div className="apple-filter-popover" style={{ width: '340px' }}>
                    {/* Popover Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                      <div className="apple-filter-title">Filter</div>
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: '#f1f5f9',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        title="Close Filter"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {/* Section 1: Filter by Department */}
                    <div>
                      <div className="apple-filter-section-title">Filter by Department</div>
                      <div className="apple-filter-chips-grid">
                        {[
                          { key: 'All', label: 'All Departments' },
                          { key: 'IT', label: 'IT' },
                          { key: 'CS', label: 'CS' },
                          { key: 'EXTC', label: 'EXTC' },
                          { key: 'MECH', label: 'MECH' }
                        ].map((d) => {
                          const isSel = selectedCourse === d.key;
                          return (
                            <button
                              key={d.key}
                              type="button"
                              onClick={() => setSelectedCourse(d.key)}
                              className={`apple-filter-chip ${isSel ? 'active' : ''}`}
                            >
                              {d.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Filter by Division */}
                    <div>
                      <div className="apple-filter-section-title">Filter by Division</div>
                      <div className="apple-filter-chips-grid">
                        {[
                          { key: 'All', label: 'All Divisions' },
                          { key: 'A', label: 'Division A' },
                          { key: 'B', label: 'Division B' },
                          { key: 'C', label: 'Division C' }
                        ].map((div) => {
                          const isSel = selectedDivision === div.key;
                          return (
                            <button
                              key={div.key}
                              type="button"
                              onClick={() => setSelectedDivision(div.key)}
                              className={`apple-filter-chip ${isSel ? 'active' : ''}`}
                            >
                              {div.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 3: Filter by Academic Standing */}
                    <div>
                      <div className="apple-filter-section-title">Academic Score Standing</div>
                      <div className="apple-filter-chips-grid">
                        {[
                          { key: 'All', label: 'All Scores' },
                          { key: 'distinction', label: 'Honors (≥85%)' },
                          { key: 'first', label: 'First Class (60–84%)' },
                          { key: 'pass', label: 'Pass (<60%)' }
                        ].map((g) => {
                          const isSel = selectedGrade === g.key;
                          return (
                            <button
                              key={g.key}
                              type="button"
                              onClick={() => setSelectedGrade(g.key)}
                              className={`apple-filter-chip ${isSel ? 'active' : ''}`}
                            >
                              {g.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 4: Sort Hierarchy */}
                    <div>
                      <div className="apple-filter-section-title">Sort Records Hierarchy</div>
                      <div className="apple-filter-chips-grid">
                        {[
                          { key: 'hierarchy', label: 'Year → Dept → Div → Roll' },
                          { key: 'roll-asc', label: 'Roll # (Ascending)' },
                          { key: 'roll-desc', label: 'Roll # (Descending)' },
                          { key: 'name-asc', label: 'Name (A–Z)' },
                          { key: 'percentage-desc', label: 'Highest Score' }
                        ].map((s) => {
                          const isSel = selectedSort === s.key;
                          return (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => setSelectedSort(s.key)}
                              className={`apple-filter-chip ${isSel ? 'active-primary' : ''}`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '2px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourse('All');
                          setSelectedDivision('All');
                          setSelectedGrade('All');
                          setSelectedSort('hierarchy');
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Reset All
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        style={{
                          background: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 18px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Apply & Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filter Badges with Quick Removal */}
              {selectedCourse !== 'All' && (
                <span
                  onClick={() => setSelectedCourse('All')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '4px 9px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  title="Click to remove Department filter"
                >
                  Dept: {selectedCourse} ✕
                </span>
              )}

              {selectedDivision !== 'All' && (
                <span
                  onClick={() => setSelectedDivision('All')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '4px 9px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  title="Click to remove Division filter"
                >
                  Div: {selectedDivision} ✕
                </span>
              )}

              {selectedGrade !== 'All' && (
                <span
                  onClick={() => setSelectedGrade('All')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '4px 9px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  title="Click to remove Score filter"
                >
                  Score: {selectedGrade} ✕
                </span>
              )}

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (!processedStudents || processedStudents.length === 0) {
                    toast.error('No Students', 'No student records to print.');
                    return;
                  }
                  printAllStudentsComprehensiveDossiers(processedStudents, {
                    department: selectedCourse,
                    division: selectedDivision
                  });
                  toast.success(
                    'Complete Dossiers Ready',
                    `Preparing comprehensive records for ${processedStudents.length} students (Multi-page batch).`
                  );
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                title="Print All Students Complete Data (Full Profiles, Academic Marks, Fees, Attendance & Submissions)"
              >
                <Printer size={14} />
                <span>Print All Students Complete Data</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  exportStudentRosterExcel(processedStudents, {
                    department: selectedCourse,
                    division: selectedDivision
                  });
                  toast.success('Roster Exported to Excel', `Exported ${processedStudents.length} students in official formatted spreadsheet.`);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                title="Export Student Directory in formatted Excel spreadsheet (.xls)"
              >
                <FileSpreadsheet size={14} />
                <span>Export to Excel</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  printStudentRoster(processedStudents, {
                    department: selectedCourse,
                    division: selectedDivision
                  });
                  toast.info('Student Roster Print View', `Preparing printable student directory for ${processedStudents.length} candidates.`);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                title="Print Official Institutional Student Directory & Audit Register"
              >
                <Printer size={14} />
                <span>Print Roster</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => onNavigate && onNavigate('id-generator')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                <span>ID Generator</span>
              </button>

              <button className="btn-primary" onClick={() => onNavigate && onNavigate('add')}>
                <Plus size={14} />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          <table className="clean-table">
            <thead>
              <tr>
                <th style={{ width: '70px', textAlign: 'center' }}>Roll #</th>
                <th style={{ width: '130px' }}>Unique PRN</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year & Div</th>
                <th>Academic Score</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={24} color="#94a3b8" />
                      <strong style={{ color: '#0f172a' }}>No students match your filter criteria</strong>
                      <span style={{ fontSize: '0.78rem' }}>Try clearing active filters or modifying search keywords.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                (() => {
                  let lastCohortKey = null;
                  const yearLabels = { 1: 'First Year (FE)', 2: 'Second Year (SE)', 3: 'Third Year (TE)', 4: 'Final Year (BE)' };

                  return processedStudents.map((s) => {
                    const currentCohortKey = `${s.year || 1}-${s.course || 'IT'}-${s.division || 'A'}`;
                    const isNewCohort = selectedSort === 'hierarchy' && currentCohortKey !== lastCohortKey;
                    if (isNewCohort) {
                      lastCohortKey = currentCohortKey;
                    }

                    return (
                      <React.Fragment key={s.rollNumber}>
                        {isNewCohort && (
                          <tr style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                            <td colSpan="8" style={{ padding: '8px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', padding: '3px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700 }}>
                                    {yearLabels[s.year || 1] || `Year ${s.year}`}
                                  </span>
                                  <span style={{ background: '#ffffff', color: '#475569', border: '1px solid #e2e8f0', padding: '3px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600 }}>
                                    Dept: {s.course}
                                  </span>
                                  <span style={{ background: '#ffffff', color: '#475569', border: '1px solid #e2e8f0', padding: '3px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600 }}>
                                    Division {s.division || 'A'}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
                                  Cohort Section
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ textAlign: 'center' }}><strong>#{s.rollNumber}</strong></td>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>
                              {s.prn || 'RBT24' + (s.course || 'IT') + String(s.rollNumber).padStart(3, '0')}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{s.name}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                          <td><span className="badge badge-neutral">{s.course}</span></td>
                          <td>Year {s.year} (Div {s.division})</td>
                          <td>
                            <span className={`badge ${s.percentage >= 85 ? 'badge-success' : s.percentage >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                              {Number(s.percentage).toFixed(1)}%
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => onViewStudent && onViewStudent(s)}
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => onEditStudent && onEditStudent(s)}
                          title="Edit Student"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          className="btn-secondary btn-sm"
                          style={{ color: '#2563eb', background: '#eff6ff', borderColor: '#bfdbfe' }}
                          onClick={() => handleQuickPromoteStudent(s)}
                          title="Advance Student to Next Semester & Auto-Assign Syllabi"
                        >
                          <Sparkles size={13} />
                        </button>
                        <button
                          className="btn-secondary btn-sm"
                          style={{ color: 'var(--danger)' }}
                          onClick={() => setStudentToDelete(s)}
                          title="Delete Student"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                        </tr>
                      </React.Fragment>
                    );
                  });
                })()
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: TEACHERS (FACULTY MANAGEMENT)
          ========================================================================= */}
      {activeTab === 'teachers' && (
        <div className="table-container">
          <div className="table-header-bar">
            <div>
              <h3 className="table-title">Teachers</h3>
            </div>

            <button className="btn-primary" onClick={() => setIsAddTeacherOpen(true)}>
              <Plus size={14} />
              <span>Register Teacher</span>
            </button>
          </div>

          <table className="clean-table">
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Assigned Subject</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.id}</strong></td>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.email}</td>
                  <td>{t.department}</td>
                  <td>{t.subject}</td>
                  <td>
                    <span className={`badge ${t.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => toggleTeacherStatus(t.id)}
                    >
                      {t.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: COURSES (DEPARTMENTS, INTAKES & SEMESTER DURATION MANAGEMENT)
          ========================================================================= */}
      {activeTab === 'courses' && (() => {
        const filteredDepts = departments.filter((d) => {
          if (!deptSearch.trim()) return true;
          const q = deptSearch.toLowerCase();
          return d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q) || (d.hod || '').toLowerCase().includes(q);
        });

        return (
          <div className="table-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Segmented Subtab Navigation */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setCourseSubTab('departments')}
                style={{
                  cursor: 'pointer',
                  padding: '7px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: '1px solid',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: courseSubTab === 'departments' ? '#2563eb' : '#f8fafc',
                  color: courseSubTab === 'departments' ? '#ffffff' : '#475569',
                  borderColor: courseSubTab === 'departments' ? '#2563eb' : '#e2e8f0',
                  transition: 'all 0.15s ease'
                }}
              >
                <Building2 size={15} />
                <span>Department Programs & Quotas</span>
              </button>
              <button
                type="button"
                onClick={() => setCourseSubTab('calendar')}
                style={{
                  cursor: 'pointer',
                  padding: '7px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: '1px solid',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: courseSubTab === 'calendar' ? '#2563eb' : '#f8fafc',
                  color: courseSubTab === 'calendar' ? '#ffffff' : '#475569',
                  borderColor: courseSubTab === 'calendar' ? '#2563eb' : '#e2e8f0',
                  transition: 'all 0.15s ease'
                }}
              >
                <Calendar size={15} />
                <span>Academic Calendar & Semester Duration</span>
              </button>
            </div>

            {/* TAB CONTENT A: DEPARTMENTS & INTAKES */}
            {courseSubTab === 'departments' && (
              <>
                <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 className="table-title">Departments & Intake Capacities</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Manage departmental programs, annual intake quotas, and leadership
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div className="search-bar-wrap" style={{ minWidth: '220px' }}>
                      <Search size={14} className="search-bar-icon" />
                      <input
                        type="text"
                        placeholder="Search department or HOD..."
                        value={deptSearch}
                        onChange={(e) => setDeptSearch(e.target.value)}
                        className="search-input"
                        style={{ background: '#f8fafc', borderRadius: '10px', fontSize: '0.8rem' }}
                      />
                    </div>

                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleOpenAddDept}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '7px 14px' }}
                    >
                      <Plus size={14} />
                      <span>Add Department</span>
                    </button>
                  </div>
                </div>

                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Department Program</th>
                      <th>Head of Department</th>
                      <th>Intake Capacity</th>
                      <th>Divisions</th>
                      <th>Active Semester</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepts.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                          No departments found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredDepts.map((d) => (
                        <tr key={d.code}>
                          <td>
                            <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem' }}>
                              {d.code}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{d.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{d.duration || '4 Years'} Degree</div>
                          </td>
                          <td style={{ fontWeight: 500, color: '#334155' }}>{d.hod}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.intakeLimit} Seats</span>
                            <div style={{ fontSize: '0.7rem', color: '#059669' }}>Scales divisions dynamically</div>
                          </td>
                          <td>
                            <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
                              {d.classesCount || d.divisions?.length || 2} Divisions
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.78rem', color: '#475569' }}>{d.activeSemester || 'Semester 6'}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn-icon"
                                onClick={() => handleOpenEditDept(d)}
                                title="Edit Department & Intake"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                className="btn-icon delete"
                                onClick={() => setAcademicDeleteTarget({ type: 'department', id: d.code, name: d.name })}
                                title="Delete Department"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {/* TAB CONTENT B: ACADEMIC CALENDAR & SEMESTER DURATION */}
            {courseSubTab === 'calendar' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 className="table-title">Academic Term & Semester Duration Settings</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Configure semester duration dates, teaching windows, examination cycles, and progression policies.
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleOpenCalendarEdit}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '7px 14px' }}
                  >
                    <Edit3 size={14} />
                    <span>Configure Term Duration & Dates</span>
                  </button>
                </div>

                {/* Hero Semester Progress Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{academicCalendar.termName}</span>
                        <span className="badge badge-primary" style={{ fontWeight: 600 }}>AY {academicCalendar.academicYear}</span>
                        <span className={`badge ${calendarSummary.isActive ? 'badge-success' : 'badge-neutral'}`} style={{ fontWeight: 600 }}>
                          {calendarSummary.isActive ? '● Currently In Session' : '○ Term Break / Recess'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                        Applies to: <strong style={{ color: '#334155' }}>{academicCalendar.activeSemesterLabel}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>
                        {calendarSummary.progressPct}% Complete
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {calendarSummary.elapsedDays} of {calendarSummary.totalDays} calendar days ({calendarSummary.remainingDays} days remaining)
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                      <span>Term Start: {academicCalendar.startDate}</span>
                      <span>Target Conclusion: {academicCalendar.endDate}</span>
                    </div>
                    <div style={{ width: '100%', height: '9px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, Math.max(0, calendarSummary.progressPct))}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #2563eb, #38bdf8)',
                          borderRadius: '999px',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Metric Dimension Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {/* Card 1: Instructional Term Metrics */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Clock size={16} style={{ color: '#2563eb' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>Teaching Duration</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Total Instructional Weeks:</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{academicCalendar.totalInstructionalWeeks} Weeks</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Total Working Days:</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{academicCalendar.totalWorkingDays} Days</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Teaching Weeks Completed:</span>
                        <span style={{ fontWeight: 600, color: '#059669' }}>{academicCalendar.teachingWeeksCompleted} Weeks</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Next Term Kickoff:</span>
                        <span style={{ fontWeight: 600, color: '#2563eb' }}>{academicCalendar.nextTermStartDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Key Examination Windows */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <FlaskConical size={16} style={{ color: '#d97706' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>Exam & Viva Windows</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Midterm Assessments:</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{academicCalendar.midtermStart} → {academicCalendar.midtermEnd}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Practical Labs & Vivas:</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{academicCalendar.labExamStart} → {academicCalendar.labExamEnd}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Semester Final Exams:</span>
                        <span style={{ fontWeight: 600, color: '#dc2626' }}>{academicCalendar.endtermExamStart} → {academicCalendar.endtermExamEnd}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Results Declaration:</span>
                        <span style={{ fontWeight: 600, color: '#16a34a' }}>{academicCalendar.resultsDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Progression & Attendance Policy */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <ShieldCheck size={16} style={{ color: '#059669' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>Progression Policies</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Min Attendance Required:</span>
                        <span style={{ fontWeight: 700, color: '#dc2626' }}>{academicCalendar.minimumAttendancePct}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Grace / Condonation Limit:</span>
                        <span style={{ fontWeight: 600, color: '#d97706' }}>{academicCalendar.graceAttendancePct}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                        <span style={{ color: '#64748b' }}>Passing Credits / Semester:</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{academicCalendar.passingCreditsPerSem} Credits</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Syllabi Auto-Enrollment:</span>
                        <span style={{ fontWeight: 700, color: '#2563eb' }}>
                          {academicCalendar.autoEnrollOnProgression ? 'Active (Auto-Assign)' : 'Manual Mode'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* =========================================================================
          VIEW 5: SUBJECTS & LABS (ACADEMIC COURSE CATALOG)
          ========================================================================= */}
      {activeTab === 'subjects' && (() => {
        const filteredSubjects = subjectsList.filter((s) => {
          if (subjectDeptFilter !== 'All' && s.department !== subjectDeptFilter && !s.department.includes(subjectDeptFilter)) {
            return false;
          }
          if (subjectYearFilter !== 'All' && (s.year || getYearForSemester(s.semester)) !== subjectYearFilter) {
            return false;
          }
          if (subjectSemFilter !== 'All' && s.semester !== subjectSemFilter) {
            return false;
          }
          if (subjectSearch.trim()) {
            const q = subjectSearch.toLowerCase();
            return s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || (s.teacher || '').toLowerCase().includes(q);
          }
          return true;
        });

        return (
          <div className="table-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="table-title">Department Curriculum & Subjects Catalog</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Manage department-wise, year-wise, and semester-wise syllabi with automatic progression assignment
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Dept:</span>
                  <select
                    className="apple-input"
                    value={subjectDeptFilter}
                    onChange={(e) => setSubjectDeptFilter(e.target.value)}
                    style={{ padding: '5px 10px', fontSize: '0.8rem', width: 'auto' }}
                  >
                    <option value="All">All Depts</option>
                    {departments.map((d) => (
                      <option key={d.code} value={d.name}>{d.code}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Year:</span>
                  <select
                    className="apple-input"
                    value={subjectYearFilter}
                    onChange={(e) => setSubjectYearFilter(e.target.value)}
                    style={{ padding: '5px 10px', fontSize: '0.8rem', width: 'auto' }}
                  >
                    <option value="All">All Years</option>
                    {YEAR_LIST.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Sem:</span>
                  <select
                    className="apple-input"
                    value={subjectSemFilter}
                    onChange={(e) => setSubjectSemFilter(e.target.value)}
                    style={{ padding: '5px 10px', fontSize: '0.8rem', width: 'auto' }}
                  >
                    <option value="All">All Semesters</option>
                    {SEMESTER_LIST.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div className="search-bar-wrap" style={{ minWidth: '180px' }}>
                  <Search size={14} className="search-bar-icon" />
                  <input
                    type="text"
                    placeholder="Search code, title or faculty..."
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    className="search-input"
                    style={{ background: '#f8fafc', borderRadius: '10px', fontSize: '0.8rem' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenCohortModal}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    padding: '7px 13px',
                    borderRadius: '8px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Promote a department cohort and auto-assign next year/sem curriculum"
                >
                  <Sparkles size={14} style={{ color: '#2563eb' }} />
                  <span>Advance Cohort / Auto-Assign</span>
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleOpenAddSubject}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '7px 14px' }}
                >
                  <Plus size={14} />
                  <span>Add Subject</span>
                </button>
              </div>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Course Title</th>
                  <th>Type</th>
                  <th>Department</th>
                  <th>Year & Semester</th>
                  <th>Faculty In-Charge</th>
                  <th>Credits</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No subjects found matching your selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((s) => (
                    <tr key={s.code}>
                      <td>
                        <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem' }}>
                          {s.code}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{s.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{s.room || 'Hall 302'}</div>
                      </td>
                      <td>
                        <span
                          className={`badge ${s.type === 'Practical Lab' ? 'badge-primary' : 'badge-neutral'}`}
                          style={{ fontWeight: 600 }}
                        >
                          {s.type || 'Theory'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#334155' }}>{s.department}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>{s.semester}</div>
                        <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 500 }}>
                          {s.year || getYearForSemester(s.semester)}
                        </div>
                      </td>
                      <td style={{ fontWeight: 500, color: '#0f172a' }}>{s.teacher || 'Unassigned'}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{s.credits} Credits</span>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{s.weeklyHours || 4} hrs/wk</div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => handleOpenEditSubject(s)}
                            title="Edit Subject"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon delete"
                            onClick={() => setAcademicDeleteTarget({ type: 'subject', id: s.code, name: s.name })}
                            title="Delete Subject"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      })()}

      {/* =========================================================================
          VIEW 6: CLASSES (DIVISIONS, ROOMS & BATCHES)
          ========================================================================= */}
      {activeTab === 'classes' && (() => {
        const filteredClasses = classesList.filter((c) => {
          if (classDeptFilter !== 'All' && c.department !== classDeptFilter && !c.department.includes(classDeptFilter)) {
            return false;
          }
          if (classSearch.trim()) {
            const q = classSearch.toLowerCase();
            return c.name.toLowerCase().includes(q) || (c.room || '').toLowerCase().includes(q) || (c.rep || '').toLowerCase().includes(q);
          }
          return true;
        });

        return (
          <div className="table-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="table-title">Classes & Divisions</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Manage class sections, assigned lecture halls, daily schedules, and student reps
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Dept:</span>
                  <select
                    className="apple-input"
                    value={classDeptFilter}
                    onChange={(e) => setClassDeptFilter(e.target.value)}
                    style={{ padding: '5px 10px', fontSize: '0.8rem', width: 'auto' }}
                  >
                    <option value="All">All Departments</option>
                    {departments.map((d) => (
                      <option key={d.code} value={d.name}>{d.code}</option>
                    ))}
                  </select>
                </div>

                <div className="search-bar-wrap" style={{ minWidth: '200px' }}>
                  <Search size={14} className="search-bar-icon" />
                  <input
                    type="text"
                    placeholder="Search class or room..."
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    className="search-input"
                    style={{ background: '#f8fafc', borderRadius: '10px', fontSize: '0.8rem' }}
                  />
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleOpenAddClass}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '7px 14px' }}
                >
                  <Plus size={14} />
                  <span>Add Class</span>
                </button>
              </div>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th>Class / Division</th>
                  <th>Department</th>
                  <th>Academic Year</th>
                  <th>Classroom / Hall</th>
                  <th>Daily Timing</th>
                  <th>Capacity</th>
                  <th>Class Representative</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No classes found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</td>
                      <td style={{ fontSize: '0.8rem', color: '#334155' }}>{c.department}</td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
                          {c.year || 'Year 3 (TE)'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#0f172a', background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          {c.room}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#475569' }}>{c.timing}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{c.students} Students</span>
                      </td>
                      <td style={{ fontWeight: 500, color: '#334155' }}>{c.rep || 'Unassigned'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => handleOpenEditClass(c)}
                            title="Edit Class Division"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon delete"
                            onClick={() => setAcademicDeleteTarget({ type: 'class', id: c.id, name: c.name })}
                            title="Delete Class Division"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      })()}

      {/* =========================================================================
          VIEW 7: ATTENDANCE & LABORATORY MANAGEMENT (ADMIN OVERRIDE & AUDIT)
          ========================================================================= */}
      {activeTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Institutional Attendance Criteria Rule Alert */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#15803d',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong style={{ color: '#14532d', fontSize: '0.92rem' }}>
                  Institutional Criteria: Overall Attendance &ge; 75.0% Mandatory
                </strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#166534' }}>
                  Eligibility clearance is evaluated against student's <strong>Overall Attendance</strong> across all theory lectures & practical labs. Individual subject shortfalls can be condoned by Administration.
                </p>
              </div>
            </div>

            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '999px',
              background: '#ffffff',
              color: '#15803d',
              border: '1px solid #86efac'
            }}>
              Active Institutional Policy
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <PillTabs
              tabs={[
                { id: 'students', label: 'Attendance Register', count: attendanceList.length },
                { id: 'compliance', label: 'Compliance' }
              ]}
              activeTab={attendanceSubTab}
              onChange={setAttendanceSubTab}
            />
          </div>

          {attendanceSubTab === 'students' ? (
            <div className="table-container">
              <div className="table-header-bar">
                <div>
                  <h3 className="table-title">Attendance Register</h3>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div className="search-bar-wrap">
                    <Search size={14} className="search-bar-icon" />
                    <input
                      type="text"
                      placeholder="Search candidate name or roll..."
                      value={attSearch}
                      onChange={(e) => setAttSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <select
                    value={attDeptFilter}
                    onChange={(e) => setAttDeptFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="CS">CS</option>
                    <option value="EXTC">EXTC</option>
                    <option value="MECH">MECH</option>
                  </select>
                </div>
              </div>

              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Roll # & Candidate</th>
                    <th>Dept & Cohort</th>
                    <th>Theory Classes %</th>
                    <th>Practical Labs %</th>
                    <th>Overall Attendance %</th>
                    <th>Clearance Status</th>
                    <th>Condonation</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceList
                    .filter((s) => {
                      const matchesSearch = s.name.toLowerCase().includes(attSearch.toLowerCase()) || String(s.rollNumber).includes(attSearch);
                      const matchesDept = attDeptFilter === 'All' || s.course === attDeptFilter;
                      return matchesSearch && matchesDept;
                    })
                    .map((s) => {
                      const isEligible = s.attendance >= 75 || s.condonationGranted;
                      const theoryVal = s.theoryAttendance !== undefined ? s.theoryAttendance : (s.attendance - 1.5);
                      const labVal = s.labAttendance !== undefined ? s.labAttendance : (s.attendance + 3.2);

                      return (
                        <tr key={s.rollNumber}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={s.avatarUrl || (s.name.toLowerCase().includes('ananya') || s.name.toLowerCase().includes('sneha') ? '/assets/female_student_avatar.jpg' : '/assets/student_avatar.jpg')}
                                alt={s.name}
                                style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'cover' }}
                              />
                              <div>
                                <strong style={{ color: '#0f172a' }}>{s.name}</strong>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>
                                  Roll #{s.rollNumber}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-neutral">{s.course}</span> · Year {s.year} ({s.division})
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: '#334155' }}>
                              {Number(theoryVal).toFixed(1)}%
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <FlaskConical size={13} />
                              {Number(labVal).toFixed(1)}%
                            </span>
                          </td>
                          <td>
                            <strong style={{ fontSize: '0.95rem', color: s.attendance >= 75 ? '#059669' : '#dc2626' }}>
                              {Number(s.attendance).toFixed(1)}%
                            </strong>
                          </td>
                          <td>
                            <span className={`badge ${isEligible ? 'badge-success' : 'badge-danger'}`}>
                              {isEligible ? '✓ Clearance OK' : '⚠️ Defaulter (<75%)'}
                            </span>
                          </td>
                          <td>
                            {s.condonationGranted ? (
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '999px', border: '1px solid #bfdbfe' }}>
                                ✓ Medical Waiver
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>None</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => {
                                setSelectedStudentForAtt(s);
                                setAttEditOverall(s.attendance);
                                setAttEditTheory(theoryVal);
                                setAttEditLab(labVal);
                                setAttEditCondonation(Boolean(s.condonationGranted));
                                setAttEditSubjects(s.subjectBreakdown ? JSON.parse(JSON.stringify(s.subjectBreakdown)) : []);
                                setIsAttModalOpen(true);
                              }}
                              title="Adjust student attendance and condonation"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                            >
                              <Edit3 size={13} />
                              <span>Adjust</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-header-bar">
                <div>
                  <h3 className="table-title">Attendance Overview</h3>
                </div>
              </div>

              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Overall Attendance %</th>
                    <th>Theory Average %</th>
                    <th>Lab Practical %</th>
                    <th>Enrolled Students</th>
                    <th>Below 75% Threshold</th>
                    <th style={{ textAlign: 'right' }}>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Information Technology</td>
                    <td><strong style={{ color: 'var(--success)' }}>91.4%</strong></td>
                    <td>89.8%</td>
                    <td>94.2%</td>
                    <td>84</td>
                    <td>2 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Good</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Computer Science</td>
                    <td><strong style={{ color: 'var(--success)' }}>89.2%</strong></td>
                    <td>87.5%</td>
                    <td>92.1%</td>
                    <td>92</td>
                    <td>3 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Good</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Electronics & Telecom</td>
                    <td><strong style={{ color: 'var(--warning)' }}>78.6%</strong></td>
                    <td>77.0%</td>
                    <td>81.4%</td>
                    <td>68</td>
                    <td>8 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-warning">Review Needed</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Mechanical Engineering</td>
                    <td><strong style={{ color: 'var(--success)' }}>84.1%</strong></td>
                    <td>82.4%</td>
                    <td>87.0%</td>
                    <td>55</td>
                    <td>4 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Good</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 8: MARKS & OFFICIAL TRANSCRIPTS (EXAMINATION & CLEARANCE)
          ========================================================================= */}
      {activeTab === 'marks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <PillTabs
              tabs={[
                { id: 'clearance', label: 'Clearance' },
                { id: 'analytics', label: 'Analytics' }
              ]}
              activeTab={marksMode}
              onChange={setMarksMode}
            />
          </div>

          {marksMode === 'clearance' ? (
            <StudentClearanceManager initialFilter="all" />
          ) : (
            <div className="table-container">
              <div className="table-header-bar">
                <div>
                  <h3 className="table-title">Marks Overview</h3>
                </div>
              </div>

              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Average Score</th>
                    <th>Pass Rate</th>
                    <th>Distinction Tier</th>
                    <th style={{ textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Information Technology</td>
                    <td>84.5%</td>
                    <td>97.6%</td>
                    <td>32 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Normal</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Computer Science</td>
                    <td>82.1%</td>
                    <td>95.4%</td>
                    <td>28 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Normal</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Electronics & Telecom</td>
                    <td>76.4%</td>
                    <td>91.2%</td>
                    <td>18 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Normal</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Mechanical Engineering</td>
                    <td>74.8%</td>
                    <td>89.0%</td>
                    <td>12 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Normal</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 9: ASSIGNMENTS (MONITORING)
          ========================================================================= */}
      {activeTab === 'assignments' && (
        <div className="table-container">
          <div className="table-header-bar">
            <div>
              <h3 className="table-title">Assignments</h3>
            </div>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => {
                const headers = ['Course', 'Assignment Title', 'Faculty', 'Submissions', 'Compliance %', 'Status'];
                const rows = [
                  ['"IT-301"', '"JDBC Student Management Project"', '"Prof. Krrish Sharma"', '"38 / 42"', '90.5%', 'Active'],
                  ['"IT-301L"', '"Collections Framework Lab"', '"Prof. Krrish Sharma"', '"15 / 38"', '39.5%', 'Due in 6 days'],
                  ['"CS-201"', '"Binary Trees Practical"', '"Dr. Vivek Joshi"', '"45 / 45"', '100%', 'Completed']
                ];
                const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
                const link = document.createElement('a');
                link.setAttribute('href', encodeURI(csvContent));
                link.setAttribute('download', `Institutional_Assignments_Monitoring_${new Date().toISOString().slice(0, 10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              title="Export Assignments Monitoring (CSV / Excel)"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>

          <table className="clean-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Assignment Title</th>
                <th>Faculty</th>
                <th>Submissions</th>
                <th>Compliance %</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignmentsList.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.subjectCode}</strong></td>
                  <td>{a.title}</td>
                  <td>{a.faculty || 'Prof. Krrish Sharma'}</td>
                  <td>{a.submissionsCount} / {a.totalStudents}</td>
                  <td>
                    <span style={{ fontWeight: 650, color: parseInt(a.compliance) > 75 ? '#16a34a' : '#d97706' }}>
                      {a.compliance}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`badge ${a.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          VIEW 10: TIMETABLE & EXAM SCHEDULE PUBLISHER (MASTER CONTROLLER)
          ========================================================================= */}
      {activeTab === 'timetable' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <PillTabs
              tabs={[
                { id: 'schedule', label: 'Timetable' },
                { id: 'clearance', label: 'Clearance' }
              ]}
              activeTab={timetableMode}
              onChange={setTimetableMode}
            />
          </div>

          {timetableMode === 'schedule' ? (
            <TimetableSection role="admin" currentSemester="Semester 6" />
          ) : (
            <StudentClearanceManager initialFilter="all" />
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 11: ANNOUNCEMENTS
          ========================================================================= */}
      {activeTab === 'announcements' && (
        <AnnouncementsSection
          title="Institutional Notices & Academic Circulars"
          subtitle="Campus-wide and semester-specific announcements management"
          role="admin"
          allowPublish={true}
        />
      )}

      {/* =========================================================================
          VIEW 12: REPORTS (SECTIONS 1, 15, 38)
          Pills: [Students] [Attendance] [Marks] [Performance]
          ========================================================================= */}
      {activeTab === 'reports' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <PillTabs
              tabs={[
                { id: 'students', label: 'Students' },
                { id: 'attendance', label: 'Attendance' },
                { id: 'marks', label: 'Marks' },
                { id: 'performance', label: 'Performance' }
              ]}
              activeTab={reportsSubTab}
              onChange={setReportsSubTab}
            />
          </div>

          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">{reportsSubTab.charAt(0).toUpperCase() + reportsSubTab.slice(1)} Report</h3>
              </div>

              <button
                className="btn-secondary btn-sm"
                onClick={() => toast.success('Report Exported', `Downloaded ${reportsSubTab}_report_2026.csv.`)}
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
            </div>

            {reportsSubTab === 'students' && (
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Active Students</th>
                    <th>Average Attendance</th>
                    <th>Average Score</th>
                    <th style={{ textAlign: 'right' }}>Cohort Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Information Technology</strong></td>
                    <td>84 enrolled</td>
                    <td style={{ color: 'var(--success)' }}>91.4%</td>
                    <td>84.5%</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Good</span></td>
                  </tr>
                  <tr>
                    <td><strong>Computer Science</strong></td>
                    <td>92 enrolled</td>
                    <td style={{ color: 'var(--success)' }}>89.8%</td>
                    <td>82.1%</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Good</span></td>
                  </tr>
                  <tr>
                    <td><strong>Electronics & Telecom</strong></td>
                    <td>68 enrolled</td>
                    <td style={{ color: 'var(--warning)' }}>78.6%</td>
                    <td>76.4%</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-warning">Review Needed</span></td>
                  </tr>
                  <tr>
                    <td><strong>Mechanical Engineering</strong></td>
                    <td>55 enrolled</td>
                    <td style={{ color: 'var(--success)' }}>84.1%</td>
                    <td>74.8%</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Good</span></td>
                  </tr>
                </tbody>
              </table>
            )}

            {reportsSubTab === 'attendance' && (
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Lectures Held</th>
                    <th>Overall Attendance %</th>
                    <th>Students Flagged (&lt;75%)</th>
                    <th style={{ textAlign: 'right' }}>Institutional Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Information Technology</strong></td>
                    <td>420 sessions</td>
                    <td><strong style={{ color: 'var(--success)' }}>91.4%</strong></td>
                    <td>3 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Compliant</span></td>
                  </tr>
                  <tr>
                    <td><strong>Computer Science</strong></td>
                    <td>450 sessions</td>
                    <td><strong style={{ color: 'var(--success)' }}>89.8%</strong></td>
                    <td>5 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Compliant</span></td>
                  </tr>
                  <tr>
                    <td><strong>Electronics & Telecom</strong></td>
                    <td>380 sessions</td>
                    <td><strong style={{ color: 'var(--warning)' }}>78.6%</strong></td>
                    <td>12 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-warning">Advisory Issued</span></td>
                  </tr>
                  <tr>
                    <td><strong>Mechanical Engineering</strong></td>
                    <td>360 sessions</td>
                    <td><strong style={{ color: 'var(--success)' }}>84.1%</strong></td>
                    <td>4 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Compliant</span></td>
                  </tr>
                </tbody>
              </table>
            )}

            {reportsSubTab === 'marks' && (
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Mean Score</th>
                    <th>Pass Percentage</th>
                    <th>Distinction (&gt;75%)</th>
                    <th style={{ textAlign: 'right' }}>Standing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Information Technology</strong></td>
                    <td>84.5%</td>
                    <td>97.6%</td>
                    <td>32 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Tier 1</span></td>
                  </tr>
                  <tr>
                    <td><strong>Computer Science</strong></td>
                    <td>82.1%</td>
                    <td>95.4%</td>
                    <td>28 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-success">Tier 1</span></td>
                  </tr>
                  <tr>
                    <td><strong>Electronics & Telecom</strong></td>
                    <td>76.4%</td>
                    <td>91.2%</td>
                    <td>18 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-neutral">Tier 2</span></td>
                  </tr>
                  <tr>
                    <td><strong>Mechanical Engineering</strong></td>
                    <td>74.8%</td>
                    <td>89.0%</td>
                    <td>12 students</td>
                    <td style={{ textAlign: 'right' }}><span className="badge badge-neutral">Tier 2</span></td>
                  </tr>
                </tbody>
              </table>
            )}

            {reportsSubTab === 'performance' && (
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>IT</th>
                    <th>CS</th>
                    <th>EXTC</th>
                    <th style={{ textAlign: 'right' }}>MECH</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Lab Evaluation Average</strong></td>
                    <td>92.4%</td>
                    <td>88.6%</td>
                    <td>81.2%</td>
                    <td style={{ textAlign: 'right' }}>79.5%</td>
                  </tr>
                  <tr>
                    <td><strong>Continuous Internal Score</strong></td>
                    <td>86.0%</td>
                    <td>83.2%</td>
                    <td>77.0%</td>
                    <td style={{ textAlign: 'right' }}>75.1%</td>
                  </tr>
                  <tr>
                    <td><strong>Assignment Completion</strong></td>
                    <td>94.8%</td>
                    <td>92.0%</td>
                    <td>84.6%</td>
                    <td style={{ textAlign: 'right' }}>81.0%</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW: STUDY MATERIALS (MANAGEMENT)
          ========================================================================= */}
      {/* =========================================================================
          VIEW: STUDY MATERIALS & COURSEWARE (ADMIN REPOSITORY & UPLOADER)
          ========================================================================= */}
      {activeTab === 'materials' && (
        <div className="table-container">
          <div className="table-header-bar">
            <div>
              <h3 className="table-title">Materials</h3>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="search-bar-wrap">
                <Search size={14} className="search-bar-icon" />
                <input
                  type="text"
                  placeholder="Search courseware or subject..."
                  value={materialsSearch}
                  onChange={(e) => setMaterialsSearch(e.target.value)}
                  className="search-input"
                />
              </div>

              <select
                value={materialsDeptFilter}
                onChange={(e) => setMaterialsDeptFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Departments</option>
                <option value="IT">IT</option>
                <option value="CS">CS</option>
                <option value="EXTC">EXTC</option>
                <option value="MECH">MECH</option>
              </select>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsUploadModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Upload size={14} />
                <span>Upload Document</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Category:</span>
            {['All', 'Lecture Notes', 'Lab Manual', 'Exam Paper', 'Syllabus'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setMaterialsCatFilter(cat)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: materialsCatFilter === cat ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  background: materialsCatFilter === cat ? '#eff6ff' : '#ffffff',
                  color: materialsCatFilter === cat ? '#1d4ed8' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat === 'Lab Manual' ? 'Lab Manuals' : cat === 'Lecture Notes' ? 'Lecture Notes' : cat === 'Exam Paper' ? 'Past Exam Papers' : cat}
              </button>
            ))}
          </div>

          <table className="clean-table">
            <thead>
              <tr>
                <th>Document Title & Type</th>
                <th>Department & Course Code</th>
                <th>Format & Size</th>
                <th>Uploaded By</th>
                <th>Downloads</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studyMaterials
                .filter((m) => {
                  const matchesSearch = m.title.toLowerCase().includes(materialsSearch.toLowerCase()) ||
                    m.subject.toLowerCase().includes(materialsSearch.toLowerCase()) ||
                    m.subjectCode.toLowerCase().includes(materialsSearch.toLowerCase());
                  const matchesDept = materialsDeptFilter === 'All' || m.department === materialsDeptFilter;
                  const matchesCat = materialsCatFilter === 'All' || m.category === materialsCatFilter;
                  return matchesSearch && matchesDept && matchesCat;
                })
                .map((m) => {
                  const isLab = m.category === 'Lab Manual';
                  const isExam = m.category === 'Exam Paper';

                  return (
                    <tr key={m.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.title}</div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: isLab ? '#ecfdf5' : isExam ? '#fdf4ff' : '#eff6ff',
                            color: isLab ? '#059669' : isExam ? '#9333ea' : '#2563eb'
                          }}>
                            {isLab ? '🔬 Lab Manual' : isExam ? '📝 Exam Paper' : '📚 ' + m.category}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                            Updated {m.updated}
                          </span>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: '#2563eb' }}>{m.subjectCode}</strong> · {m.department} ({m.semester})
                      </td>
                      <td>
                        <span className="badge badge-neutral">{m.format} · {m.size}</span>
                      </td>
                      <td style={{ color: '#475569', fontSize: '0.82rem' }}>
                        {m.uploadedBy}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                          {m.downloads} times
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => toast.success('Downloaded', `Saved "${m.title}" to local drive.`)}
                            title="Download document"
                          >
                            <Download size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            style={{ color: '#dc2626' }}
                            onClick={() => {
                              const updated = deleteStudyMaterial(m.id);
                              setStudyMaterials(updated);
                              toast.success('Document Removed', `Deleted "${m.title}".`);
                            }}
                            title="Delete document"
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
              onClick={() => toast.success('Notifications Synchronized', 'All system pings cleared.')}
            >
              <Check size={14} />
              <span>Mark All Read</span>
            </button>
          </div>
          <div style={{ padding: '8px 20px' }}>
            <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.875rem' }}>MySQL JDBC Persistence Verification</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Just now</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Active connection on port 3306. 5 student records synchronized with zero packet latency.
                </p>
              </div>
            </div>

            <div style={{ padding: '14px 0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--secondary)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.875rem' }}>Student Profile Updated</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>1 hour ago</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Administrative profile changes committed for Roll #104 (Priya Sharma).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW: ACTIVITY LOG (SYSTEM) (SECTIONS 1, 15)
          Pills: [All Events] [Database] [Users] [Security]
          ========================================================================= */}
      {(activeTab === 'activity' || activeTab === 'activity-log') && (
        <>
          <div style={{ marginBottom: 16 }}>
            <PillTabs
              tabs={[
                { id: 'all', label: 'All Events', count: auditLogs.length },
                { id: 'database', label: 'Database' },
                { id: 'users', label: 'Users' },
                { id: 'security', label: 'Security' }
              ]}
              activeTab={activitySubTab}
              onChange={setActivitySubTab}
            />
          </div>

          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Activity Log</h3>
              </div>
              <button
                className="btn-secondary btn-sm"
                onClick={() => toast.success('Audit Log Exported', 'Downloaded audit_log_spring2026.csv.')}
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
            </div>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Operator</th>
                  <th>Action Type</th>
                  <th>Resource Target</th>
                  <th>IP / Client</th>
                  <th style={{ textAlign: 'right' }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs
                  .filter((log) => {
                    if (activitySubTab === 'all') return true;
                    if (activitySubTab === 'database') return log.action.includes('DATABASE') || log.action.includes('RECORD');
                    if (activitySubTab === 'users') return log.action.includes('USER') || log.action.includes('STUDENT');
                    if (activitySubTab === 'security') return log.action.includes('AUTH') || log.action.includes('VERIFIED');
                    return true;
                  })
                  .map((log) => (
                    <tr key={log.id}>
                      <td>{log.timestamp}</td>
                      <td><strong>{log.user}</strong></td>
                      <td><span className="badge badge-neutral">{log.action}</span></td>
                      <td>{log.module}</td>
                      <td>{log.ip}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-success">{log.status}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 13: SETTINGS
          ========================================================================= */}
      {activeTab === 'settings' && (
        <>
          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Database Status</h3>
              </div>

              <button className="btn-secondary btn-sm" onClick={handleDatabasePing}>
                <RefreshCw size={13} />
                <span>Test Connection</span>
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Database Engine</span>
                  <div style={{ fontWeight: 650, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: liveDbInfo.connected ? '#22c55e' : '#ef4444', display: 'inline-block' }}></span>
                    MySQL Server 8.0 ({liveDbInfo.connected ? 'Connected' : 'Offline'})
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ping Latency</span>
                  <div style={{ fontWeight: 650, marginTop: '2px', color: '#16a34a' }}>
                    {liveDbInfo.latencyMs || 25} ms (Realtime Active)
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Host & Port</span>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>localhost:3306 (API: 5000)</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Schema & Tables</span>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>student_management ({liveDbInfo.tablesCount || 20} tables)</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Synchronized Students</span>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>{students.length} Records in DB</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Realtime Sync Channel</span>
                  <div style={{ fontWeight: 600, marginTop: '2px', color: 'var(--primary)' }}>WebSocket EventBus Live</div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">User Accounts</h3>
              </div>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {userAccounts.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.id}</strong></td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td>
                      <span className="badge badge-neutral">{u.role}</span>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() => toggleUserStatus(u.id)}
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal (Strictly per Section 25) */}
      {studentToDelete && (
        <div className="modal-overlay" onClick={() => setStudentToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete this student?</h3>
              <button className="modal-close-btn" onClick={() => setStudentToDelete(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>
                Are you sure you want to delete <strong>{studentToDelete.name}</strong> (Roll #{studentToDelete.rollNumber})?
              </p>
              <p style={{ color: 'var(--danger)', fontSize: '0.8125rem', fontWeight: 500 }}>
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStudentToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {isAddTeacherOpen && (
        <div className="modal-overlay" onClick={() => setIsAddTeacherOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Register Teacher</h3>
              <button className="modal-close-btn" onClick={() => setIsAddTeacherOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddTeacher}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. Rajesh Sharma"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="r.sharma@edutrack.edu"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    <option>Information Technology</option>
                    <option>Computer Science</option>
                    <option>Electronics & Telecom</option>
                    <option>Mechanical Engineering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Core Java & OOP"
                    value={newTeacher.subject}
                    onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddTeacherOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Notice Modal */}
      {isAddNoticeOpen && (
        <div className="modal-overlay" onClick={() => setIsAddNoticeOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Publish Campus Notice</h3>
              <button className="modal-close-btn" onClick={() => setIsAddNoticeOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddNotice}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Notice Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Sports Week Registration"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <select
                    value={newNotice.target}
                    onChange={(e) => setNewNotice({ ...newNotice, target: e.target.value })}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    <option>All Cohorts</option>
                    <option>Faculty Roster</option>
                    <option>Year 3 & 4 Students</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Notice Content</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Enter announcement details..."
                    value={newNotice.message}
                    onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddNoticeOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Study Material Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={18} style={{ color: 'var(--primary)' }} />
                  <span>Upload Academic Study Material</span>
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Publish lecture notes, lab manuals, and question banks to the student portal
                </span>
              </div>
              <button className="modal-close-btn" onClick={() => setIsUploadModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newDocTitle.trim()) return;
                const newDoc = addStudyMaterial({
                  title: newDocTitle.trim(),
                  subjectCode: newDocCourse,
                  subject: newDocCourse === 'IT-301' ? 'Core Java & OOP' : newDocCourse === 'IT-302' ? 'Database Management' : 'Computer Science',
                  department: newDocDept,
                  semester: 'Sem 6',
                  category: newDocCategory,
                  format: newDocFormat,
                  size: newDocSize || '3.5 MB',
                  uploadedBy: newDocUploader || 'Prof. Krrish Sharma'
                });
                setStudyMaterials(getStudyMaterials());
                setIsUploadModalOpen(false);
                setNewDocTitle('');
                toast.success('Material Uploaded', `Published "${newDoc.title}" for ${newDoc.subjectCode}.`);
              }}
            >
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 4: Microservices & Spring Boot Lab Manual"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Department</label>
                    <select
                      value={newDocDept}
                      onChange={(e) => setNewDocDept(e.target.value)}
                      className="filter-select"
                      style={{ width: '100%' }}
                    >
                      <option value="IT">Information Technology (IT)</option>
                      <option value="CS">Computer Science (CS)</option>
                      <option value="EXTC">Electronics & Telecom (EXTC)</option>
                      <option value="MECH">Mechanical Engineering (MECH)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Course Module</label>
                    <select
                      value={newDocCourse}
                      onChange={(e) => setNewDocCourse(e.target.value)}
                      className="filter-select"
                      style={{ width: '100%' }}
                    >
                      <option value="IT-301">IT-301 Core Java & OOP</option>
                      <option value="IT-302">IT-302 Database Management Systems</option>
                      <option value="IT-303">IT-303 Computer Networks & Security</option>
                      <option value="CS-201">CS-201 Data Structures & Algorithms</option>
                      <option value="EXTC-101">EXTC-101 Digital Electronics</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Material Category</label>
                    <select
                      value={newDocCategory}
                      onChange={(e) => setNewDocCategory(e.target.value)}
                      className="filter-select"
                      style={{ width: '100%' }}
                    >
                      <option value="Lecture Notes">📚 Lecture Notes</option>
                      <option value="Lab Manual">🔬 Practical Lab Manual</option>
                      <option value="Exam Paper">📝 Past Exam Paper</option>
                      <option value="Syllabus">📋 Syllabus & Curriculum</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Document Format</label>
                    <select
                      value={newDocFormat}
                      onChange={(e) => setNewDocFormat(e.target.value)}
                      className="filter-select"
                      style={{ width: '100%' }}
                    >
                      <option value="PDF">PDF Document (.pdf)</option>
                      <option value="ZIP">Archive Bundle (.zip)</option>
                      <option value="DOCX">Word Document (.docx)</option>
                      <option value="PPTX">Presentation (.pptx)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>File Size Estimation</label>
                    <input
                      type="text"
                      placeholder="e.g. 4.8 MB"
                      value={newDocSize}
                      onChange={(e) => setNewDocSize(e.target.value)}
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Uploaded By</label>
                    <input
                      type="text"
                      placeholder="e.g. Prof. Krrish Sharma"
                      value={newDocUploader}
                      onChange={(e) => setNewDocUploader(e.target.value)}
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsUploadModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Upload size={14} />
                  <span>Publish Material</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance & Laboratory Adjuster Modal */}
      {isAttModalOpen && selectedStudentForAtt && (
        <div className="modal-overlay" onClick={() => setIsAttModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FlaskConical size={18} style={{ color: 'var(--primary)' }} />
                  <span>Adjust Attendance & Lab Metrics</span>
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Override attendance records for Roll #{selectedStudentForAtt.rollNumber} ({selectedStudentForAtt.name})
                </span>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAttModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStudentAttendanceData(selectedStudentForAtt.rollNumber, {
                  overallAttendance: Number(attEditOverall),
                  attendance: Number(attEditOverall),
                  theoryAttendance: Number(attEditTheory),
                  labAttendance: Number(attEditLab),
                  condonationGranted: Boolean(attEditCondonation),
                  subjectBreakdown: attEditSubjects
                });
                setAttendanceList(getStudentsClearance());
                setIsAttModalOpen(false);
                toast.success(
                  'Attendance Record Updated',
                  `Roll #${selectedStudentForAtt.rollNumber}: Overall ${Number(attEditOverall).toFixed(1)}% | Theory ${Number(attEditTheory).toFixed(1)}% | Lab ${Number(attEditLab).toFixed(1)}%`
                );
              }}
            >
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Institutional rule note */}
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  fontSize: '0.78rem',
                  color: '#166534',
                  lineHeight: 1.45
                }}>
                  <strong>🎓 Institutional Attendance Criteria:</strong> Minimum <strong>75.0% Overall Attendance</strong> is required across all classes for exam hall ticket clearance. Individual subject variations do not disqualify a student as long as their aggregate overall reaches 75% or medical condonation is granted.
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#2563eb',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    #{selectedStudentForAtt.rollNumber}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{selectedStudentForAtt.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {selectedStudentForAtt.course} · Year {selectedStudentForAtt.year} · Division {selectedStudentForAtt.division}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, color: '#0f172a' }}>
                      Overall Attendance (%) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={attEditOverall}
                      onChange={(e) => setAttEditOverall(e.target.value)}
                      className="input-field"
                      style={{
                        width: '100%',
                        fontWeight: 700,
                        color: Number(attEditOverall) >= 75 ? '#059669' : '#dc2626'
                      }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Threshold: ≥ 75.0%
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Theory Classes (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={attEditTheory}
                      onChange={(e) => setAttEditTheory(e.target.value)}
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Classroom lectures
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, color: '#059669' }}>
                      Practical Labs (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={attEditLab}
                      onChange={(e) => setAttEditLab(e.target.value)}
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Hands-on practicals
                    </span>
                  </div>
                </div>

                {/* Subject-Wise & Laboratory Attendance Breakdown */}
                {attEditSubjects && attEditSubjects.length > 0 && (
                  <div style={{ marginTop: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        Subject & Laboratory Attendance Adjuster
                      </label>
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '0.73rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0
                        }}
                        onClick={() => {
                          if (attEditSubjects.length > 0) {
                            const avg = Math.round(attEditSubjects.reduce((acc, s) => acc + Number(s.percentage), 0) / attEditSubjects.length * 10) / 10;
                            const theories = attEditSubjects.filter(s => s.type === 'Theory');
                            const labs = attEditSubjects.filter(s => s.type !== 'Theory');
                            const thAvg = theories.length > 0 ? Math.round(theories.reduce((acc, s) => acc + Number(s.percentage), 0) / theories.length * 10) / 10 : avg;
                            const labAvg = labs.length > 0 ? Math.round(labs.reduce((acc, s) => acc + Number(s.percentage), 0) / labs.length * 10) / 10 : avg;
                            setAttEditOverall(avg);
                            setAttEditTheory(thAvg);
                            setAttEditLab(labAvg);
                            toast.info('Recalculated', `Overall set to ${avg}% based on ${attEditSubjects.length} courses.`);
                          }
                        }}
                      >
                        ⚡ Auto-Calculate Overall From Subjects
                      </button>
                    </div>

                    <div style={{
                      maxHeight: '190px',
                      overflowY: 'auto',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: '#f8fafc'
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                            <th style={{ padding: '6px 10px', textAlign: 'left' }}>Course</th>
                            <th style={{ padding: '6px 10px', textAlign: 'left', width: '100px' }}>Type</th>
                            <th style={{ padding: '6px 10px', textAlign: 'right', width: '90px' }}>Attended %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attEditSubjects.map((sub, idx) => {
                            const isLab = (sub.type && sub.type.includes('Lab')) || sub.code.includes('L');
                            return (
                              <tr key={sub.code || idx} style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                                <td style={{ padding: '6px 10px' }}>
                                  <strong style={{ color: '#0f172a', marginRight: '6px' }}>{sub.code}</strong>
                                  <span style={{ color: '#64748b' }}>{sub.name}</span>
                                </td>
                                <td style={{ padding: '6px 10px' }}>
                                  <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    background: isLab ? '#ecfdf5' : '#eff6ff',
                                    color: isLab ? '#047857' : '#1d4ed8'
                                  }}>
                                    {isLab ? '🔬 Lab' : '📚 Theory'}
                                  </span>
                                </td>
                                <td style={{ padding: '4px 10px', textAlign: 'right' }}>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={sub.percentage}
                                    onChange={(e) => {
                                      const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                                      const updated = [...attEditSubjects];
                                      updated[idx] = {
                                        ...sub,
                                        percentage: val,
                                        attended: Math.round((val / 100) * (sub.totalClasses || 36))
                                      };
                                      setAttEditSubjects(updated);
                                    }}
                                    style={{
                                      width: '68px',
                                      padding: '3px 6px',
                                      borderRadius: '5px',
                                      border: '1px solid #cbd5e1',
                                      fontSize: '0.76rem',
                                      fontWeight: 700,
                                      textAlign: 'right',
                                      color: sub.percentage >= 75 ? '#047857' : '#dc2626'
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: attEditCondonation ? '#eff6ff' : '#f8fafc',
                  border: attEditCondonation ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                  marginTop: '4px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={attEditCondonation}
                      onChange={(e) => setAttEditCondonation(e.target.checked)}
                      style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#2563eb' }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.84rem', color: '#1e293b' }}>
                        Grant Institutional / Medical Condonation Waiver
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        Authorizes official hall ticket generation and examination clearance even if the candidate's aggregate overall attendance is below 75%.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAttModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={14} />
                  <span>Commit Attendance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW: INSTITUTIONAL RESOURCE & DOCUMENT REPOSITORY (NEW DEDICATED SECTION)
          ========================================================================= */}
      {activeTab === 'repository' && (
        <InstitutionalRepositoryView role="admin" />
      )}

      {/* =========================================================================
          VIEW: AI INSTITUTIONAL DOCUMENT AUTO-CHECKER & OCR
          ========================================================================= */}
      {activeTab === 'doc-scanner' && (
        <AdminDocAutoChecker
          onRecordUpdated={() => {
            setAttendanceList(getStudentsClearance());
          }}
        />
      )}

      {/* =========================================================================
          VIEW: FACULTY ROLE & TEACHING ASSIGNMENTS (Admin Engine)
          ========================================================================= */}
      {activeTab === 'faculty-allocation' && (
        <AdminFacultyAllocation />
      )}

      {/* =========================================================================
          VIEW: EXAM CLEARANCE & COMBINED HALL TICKETS (Admin Gatekeeper)
          ========================================================================= */}
      {activeTab === 'clearance' && (
        <StudentClearanceManager />
      )}

      {/* =========================================================================
          VIEW: INSTITUTIONAL UNIQUE PRN & ROLL NUMBER GENERATOR (User Requirement 2)
          ========================================================================= */}
      {activeTab === 'id-generator' && (
        <AdminPRNGenerator students={students} />
      )}

      {/* =========================================================================
          VIEW: SECURITY & CREDENTIAL APPROVALS (Password Requests & User Approvals)
          ========================================================================= */}
      {(activeTab === 'security-approvals' || activeTab === 'approvals') && (
        <AdminSecurityApprovals />
      )}

      {/* =========================================================================
          ACADEMIC MANAGEMENT MODALS: COURSES, SUBJECTS, CLASSES, DELETE CONFIRM
          ========================================================================= */}
      
      {/* 1. Department / Course Create & Edit Modal */}
      {isDeptModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsDeptModalOpen(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header-bar">
              <div>
                <h3 className="modal-title">{editingDept ? 'Edit Department & Intake' : 'Add New Department'}</h3>
                <span className="modal-subtitle">Configure departmental branch, intake quota, and leadership</span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsDeptModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDeptSubmit} className="modal-form-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Branch Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT"
                    value={deptForm.code}
                    disabled={Boolean(editingDept)}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                    className="apple-input"
                    style={{ fontWeight: 700 }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Department Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Information Technology"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                    className="apple-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Head of Department (HOD)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Arvind Saxena"
                  value={deptForm.hod}
                  onChange={(e) => setDeptForm({ ...deptForm, hod: e.target.value })}
                  className="apple-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">
                    Annual Intake Capacity *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    required
                    value={deptForm.intakeLimit}
                    onChange={(e) => setDeptForm({ ...deptForm, intakeLimit: Number(e.target.value) || 60 })}
                    className="apple-input"
                    style={{ fontWeight: 700, color: '#0f172a' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#059669', marginTop: '2px', display: 'block' }}>
                    Auto-scales class divisions & quotas
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Program Duration</label>
                  <select
                    className="apple-input"
                    value={deptForm.duration}
                    onChange={(e) => setDeptForm({ ...deptForm, duration: e.target.value })}
                  >
                    <option value="4 Years">4 Years (B.Tech / B.E.)</option>
                    <option value="2 Years">2 Years (M.Tech)</option>
                    <option value="3 Years">3 Years (Polytechnic / Diploma)</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-secondary" onClick={() => setIsDeptModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={15} />
                  <span>{editingDept ? 'Update Department' : 'Save Department'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Subject / Lab Create & Edit Modal */}
      {isSubjectModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsSubjectModalOpen(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header-bar">
              <div>
                <h3 className="modal-title">{editingSubject ? 'Edit Subject / Lab' : 'Add Subject Course'}</h3>
                <span className="modal-subtitle">Configure syllabus code, credit weighting, and faculty</span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsSubjectModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSubjectSubmit} className="modal-form-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT-305"
                    value={subjectForm.code}
                    disabled={Boolean(editingSubject)}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                    className="apple-input"
                    style={{ fontWeight: 700 }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Computing & Microservices"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    className="apple-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="apple-input"
                    value={subjectForm.department}
                    onChange={(e) => setSubjectForm({ ...subjectForm, department: e.target.value })}
                  >
                    {departments.map((d) => (
                      <option key={d.code} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select
                    className="apple-input"
                    value={subjectForm.semester}
                    onChange={(e) => {
                      const newSem = e.target.value;
                      setSubjectForm({
                        ...subjectForm,
                        semester: newSem,
                        year: getYearForSemester(newSem)
                      });
                    }}
                  >
                    {SEMESTER_LIST.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <select
                    className="apple-input"
                    value={subjectForm.year}
                    onChange={(e) => setSubjectForm({ ...subjectForm, year: e.target.value })}
                  >
                    {YEAR_LIST.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Course Type</label>
                  <select
                    className="apple-input"
                    value={subjectForm.type}
                    onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value })}
                  >
                    <option value="Theory">Theory Class</option>
                    <option value="Practical Lab">Practical Lab</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Faculty In-Charge</label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Arvind Saxena"
                    value={subjectForm.teacher}
                    onChange={(e) => setSubjectForm({ ...subjectForm, teacher: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={subjectForm.credits}
                    onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) || 4 })}
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Classroom / Lab</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 302"
                    value={subjectForm.room}
                    onChange={(e) => setSubjectForm({ ...subjectForm, room: e.target.value })}
                    className="apple-input"
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-secondary" onClick={() => setIsSubjectModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={15} />
                  <span>{editingSubject ? 'Update Subject' : 'Save Subject'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Class Division Create & Edit Modal */}
      {isClassModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsClassModalOpen(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header-bar">
              <div>
                <h3 className="modal-title">{editingClass ? 'Edit Class Division' : 'Add Class Division'}</h3>
                <span className="modal-subtitle">Configure division room, timings, and class representative</span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsClassModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveClassSubmit} className="modal-form-body">
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Department Program</label>
                  <select
                    className="apple-input"
                    value={classForm.department}
                    onChange={(e) => setClassForm({ ...classForm, department: e.target.value })}
                  >
                    {departments.map((d) => (
                      <option key={d.code} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <select
                    className="apple-input"
                    value={classForm.year}
                    onChange={(e) => setClassForm({ ...classForm, year: e.target.value })}
                  >
                    <option value="Year 1 (FE)">Year 1 (FE)</option>
                    <option value="Year 2 (SE)">Year 2 (SE)</option>
                    <option value="Year 3 (TE)">Year 3 (TE)</option>
                    <option value="Year 4 (BE)">Year 4 (BE)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Division Name / Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TE-IT-Div A"
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Hall</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 302"
                    value={classForm.room}
                    onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Student Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={classForm.students}
                    onChange={(e) => setClassForm({ ...classForm, students: Number(e.target.value) || 60 })}
                    className="apple-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Daily Timing Schedule</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:30 AM - 04:30 PM"
                    value={classForm.timing}
                    onChange={(e) => setClassForm({ ...classForm, timing: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Class Representative (CR)</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Mehta"
                    value={classForm.rep}
                    onChange={(e) => setClassForm({ ...classForm, rep: e.target.value })}
                    className="apple-input"
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-secondary" onClick={() => setIsClassModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={15} />
                  <span>{editingClass ? 'Update Class' : 'Save Class'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Academic Delete Confirmation Dialog */}
      {academicDeleteTarget && (
        <div className="modal-backdrop" onClick={() => setAcademicDeleteTarget(null)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header-bar">
              <div>
                <h3 className="modal-title" style={{ color: '#dc2626' }}>
                  Delete {academicDeleteTarget.type.charAt(0).toUpperCase() + academicDeleteTarget.type.slice(1)}
                </h3>
                <span className="modal-subtitle">Permanent catalog removal</span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setAcademicDeleteTarget(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-form-body">
              <p style={{ fontSize: '0.84rem', color: '#475569', margin: '0 0 16px' }}>
                Are you sure you want to permanently delete <strong>{academicDeleteTarget.name}</strong> ({academicDeleteTarget.id})? This action will remove it from all institutional records.
              </p>

              <div className="modal-actions-bar">
                <button type="button" className="btn-secondary" onClick={() => setAcademicDeleteTarget(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => {
                    if (academicDeleteTarget.type === 'department') handleConfirmDeleteDept(academicDeleteTarget.id);
                    else if (academicDeleteTarget.type === 'subject') handleConfirmDeleteSubject(academicDeleteTarget.id);
                    else if (academicDeleteTarget.type === 'class') handleConfirmDeleteClass(academicDeleteTarget.id);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Trash2 size={15} />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Academic Calendar & Semester Duration Configuration Modal */}
      {isCalendarEditOpen && (
        <div className="modal-backdrop" onClick={() => setIsCalendarEditOpen(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-header-bar">
              <div>
                <h3 className="modal-title">Configure Academic Term & Semester Duration</h3>
                <span className="modal-subtitle">
                  Define official semester start/end dates, instructional weeks, examination windows, and policies
                </span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsCalendarEditOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCalendarSubmit} className="modal-form-body">
              {/* Term Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Academic Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026–2027"
                    value={calendarForm.academicYear}
                    onChange={(e) => setCalendarForm({ ...calendarForm, academicYear: e.target.value })}
                    className="apple-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Term / Phase Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Even Semester (Phase II)"
                    value={calendarForm.termName}
                    onChange={(e) => setCalendarForm({ ...calendarForm, termName: e.target.value })}
                    className="apple-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Term Type</label>
                  <select
                    className="apple-input"
                    value={calendarForm.termType}
                    onChange={(e) => setCalendarForm({ ...calendarForm, termType: e.target.value })}
                  >
                    <option value="even">Even Term</option>
                    <option value="odd">Odd Term</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Applicable Semester Batches</label>
                <input
                  type="text"
                  placeholder="e.g. Semester 6 (TE) & Semester 4 (SE) & Semester 8 (BE)"
                  value={calendarForm.activeSemesterLabel}
                  onChange={(e) => setCalendarForm({ ...calendarForm, activeSemesterLabel: e.target.value })}
                  className="apple-input"
                />
              </div>

              {/* Semester Dates & Weeks */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                  Semester Span & Teaching Schedule
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Term Start Date *</label>
                    <input
                      type="date"
                      required
                      value={calendarForm.startDate}
                      onChange={(e) => setCalendarForm({ ...calendarForm, startDate: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Term End Date *</label>
                    <input
                      type="date"
                      required
                      value={calendarForm.endDate}
                      onChange={(e) => setCalendarForm({ ...calendarForm, endDate: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Weeks</label>
                    <input
                      type="number"
                      min="8"
                      max="30"
                      value={calendarForm.totalInstructionalWeeks}
                      onChange={(e) => setCalendarForm({ ...calendarForm, totalInstructionalWeeks: Number(e.target.value) || 18 })}
                      className="apple-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Working Days</label>
                    <input
                      type="number"
                      min="30"
                      max="150"
                      value={calendarForm.totalWorkingDays}
                      onChange={(e) => setCalendarForm({ ...calendarForm, totalWorkingDays: Number(e.target.value) || 90 })}
                      className="apple-input"
                    />
                  </div>
                </div>
              </div>

              {/* Examination & Evaluation Windows */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                  Examination & Results Windows
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Midterm Window (Start → End)</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="date"
                        value={calendarForm.midtermStart}
                        onChange={(e) => setCalendarForm({ ...calendarForm, midtermStart: e.target.value })}
                        className="apple-input"
                      />
                      <input
                        type="date"
                        value={calendarForm.midtermEnd}
                        onChange={(e) => setCalendarForm({ ...calendarForm, midtermEnd: e.target.value })}
                        className="apple-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lab Vivas & Practicals Window</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="date"
                        value={calendarForm.labExamStart}
                        onChange={(e) => setCalendarForm({ ...calendarForm, labExamStart: e.target.value })}
                        className="apple-input"
                      />
                      <input
                        type="date"
                        value={calendarForm.labExamEnd}
                        onChange={(e) => setCalendarForm({ ...calendarForm, labExamEnd: e.target.value })}
                        className="apple-input"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Semester Finals (Start → End)</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="date"
                        value={calendarForm.endtermExamStart}
                        onChange={(e) => setCalendarForm({ ...calendarForm, endtermExamStart: e.target.value })}
                        className="apple-input"
                      />
                      <input
                        type="date"
                        value={calendarForm.endtermExamEnd}
                        onChange={(e) => setCalendarForm({ ...calendarForm, endtermExamEnd: e.target.value })}
                        className="apple-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Results Declaration</label>
                    <input
                      type="date"
                      value={calendarForm.resultsDate}
                      onChange={(e) => setCalendarForm({ ...calendarForm, resultsDate: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Next Term Start</label>
                    <input
                      type="date"
                      value={calendarForm.nextTermStartDate}
                      onChange={(e) => setCalendarForm({ ...calendarForm, nextTermStartDate: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                </div>
              </div>

              {/* Progression & Attendance Thresholds */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Min Attendance %</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={calendarForm.minimumAttendancePct}
                    onChange={(e) => setCalendarForm({ ...calendarForm, minimumAttendancePct: Number(e.target.value) || 75 })}
                    className="apple-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Condonation / Grace %</label>
                  <input
                    type="number"
                    min="40"
                    max="90"
                    value={calendarForm.graceAttendancePct}
                    onChange={(e) => setCalendarForm({ ...calendarForm, graceAttendancePct: Number(e.target.value) || 65 })}
                    className="apple-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Passing Credits / Sem</label>
                  <input
                    type="number"
                    min="10"
                    max="35"
                    value={calendarForm.passingCreditsPerSem}
                    onChange={(e) => setCalendarForm({ ...calendarForm, passingCreditsPerSem: Number(e.target.value) || 20 })}
                    className="apple-input"
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-secondary" onClick={() => setIsCalendarEditOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={15} />
                  <span>Save Term Duration & Policies</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Cohort Progression & Auto-Curriculum Assignment Modal */}
      {isCohortModalOpen && (() => {
        const previewSubjects = getSubjectsForDepartmentAndSemester(cohortDept, cohortToSem);
        const totalCredits = previewSubjects.reduce((sum, s) => sum + (s.credits || 0), 0);

        return (
          <div className="modal-backdrop" onClick={() => setIsCohortModalOpen(false)}>
            <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
              <div className="modal-header-bar">
                <div>
                  <h3 className="modal-title">Cohort Progression & Auto-Assign Syllabi</h3>
                  <span className="modal-subtitle">
                    Advance an entire department batch to the next semester and automatically assign course syllabi
                  </span>
                </div>
                <button type="button" className="modal-close-btn" onClick={() => setIsCohortModalOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleExecuteCohortProgression} className="modal-form-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Department Program</label>
                    <select
                      className="apple-input"
                      value={cohortDept}
                      onChange={(e) => setCohortDept(e.target.value)}
                    >
                      {departments.map((d) => (
                        <option key={d.code} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Semester</label>
                    <select
                      className="apple-input"
                      value={cohortFromSem}
                      onChange={(e) => {
                        const fromSem = e.target.value;
                        setCohortFromSem(fromSem);
                        setCohortToSem(getNextSemester(fromSem));
                      }}
                    >
                      {SEMESTER_LIST.slice(0, 7).map((sem) => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Promote To Target</label>
                    <select
                      className="apple-input"
                      value={cohortToSem}
                      onChange={(e) => setCohortToSem(e.target.value)}
                    >
                      {SEMESTER_LIST.map((sem) => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Auto-Assignment Syllabus Preview Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={15} style={{ color: '#2563eb' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>
                        Curriculum Courses Auto-Assigned on Promotion
                      </span>
                    </div>
                    <span className="badge badge-primary" style={{ fontWeight: 600 }}>
                      {previewSubjects.length} Courses ({totalCredits} Credits)
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {previewSubjects.map((sub) => (
                      <div key={sub.code} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a' }}>{sub.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{sub.code}</span> • {sub.type}
                          </div>
                        </div>
                        <span className="badge badge-neutral" style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                          {sub.credits} Cr
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.74rem', color: '#059669', background: '#ecfdf5', padding: '8px 10px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                    ✓ <strong>Instant Parity:</strong> All students advancing from {cohortFromSem} to {cohortToSem} in {cohortDept} will immediately receive these courses, default marksheet entries, and individual subject attendance registers in their Student Portal.
                  </div>
                </div>

                <div className="modal-actions-bar">
                  <button type="button" className="btn-secondary" onClick={() => setIsCohortModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2563eb' }}
                  >
                    <Check size={15} />
                    <span>Advance Cohort & Auto-Assign Syllabi</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

