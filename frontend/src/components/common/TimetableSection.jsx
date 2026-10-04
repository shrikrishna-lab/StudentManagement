import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  User,
  GraduationCap,
  Download,
  Printer,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  Bell,
  ChevronRight,
  Filter,
  Check,
  FlaskConical,
  BookOpen,
  Edit3,
  Trash2
} from 'lucide-react';
import {
  WEEKLY_CLASS_SCHEDULE,
  INITIAL_EXAM_SCHEDULE,
  getExamPublishedStatus,
  setExamPublishedStatus,
  loadExamSchedule,
  saveExamSchedule,
  getWeeklyClassSchedule,
  saveWeeklyClassSession,
  deleteWeeklyClassSession,
  updateExamSession,
  deleteExamSession
} from '../../lib/timetableData';
import {
  calculateDivisionsForIntake,
  getDepartmentIntakes,
  AVAILABLE_DEPARTMENTS
} from '../../lib/departmentIntakeHelper';
import { getClearanceForStudent } from '../../lib/clearanceData';
import { getStoredStudentProfile } from '../../lib/studentProfiles';
import HallTicketModal from './HallTicketModal';
import ClearanceBlockedModal from './ClearanceBlockedModal';
import { useToast } from '../../context/ToastContext';
import { printOfficialHallTicket } from '../../lib/exportFormatHelper';

export default function TimetableSection({
  role = 'student',
  currentSemester = 'Semester 6',
  className = '',
  assignedDivision = 'Div A'
}) {
  const toast = useToast();

  // Active sub-tab: 'class' (Weekly Class Schedule) or 'exam' (Exam Timetable)
  const [activeSubTab, setActiveSubTab] = useState('class');

  // Multi-Department & Dynamic Division Scoping State
  const [selectedDepartment, setSelectedDepartment] = useState('IT');
  const [selectedSemester, setSelectedSemester] = useState(currentSemester || 'Semester 6');
  const [selectedDivision, setSelectedDivision] = useState(() => assignedDivision || 'Div A');
  const [sessionFilter, setSessionFilter] = useState('all'); // 'all' | 'theory' | 'lab'

  const deptIntakes = getDepartmentIntakes();
  const currentDeptObj = deptIntakes.find((d) => d.code === selectedDepartment) || deptIntakes[0];
  const dynamicDivisions = calculateDivisionsForIntake(currentDeptObj?.intake || 120);

  // Class schedule day selection
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const initialDay = daysOfWeek.includes(todayName) ? todayName : 'Monday';
  const [selectedDay, setSelectedDay] = useState(initialDay);

  // Exam timetable published state (Admin controlled)
  const [isExamPublished, setIsExamPublished] = useState(getExamPublishedStatus);

  // Exam schedule dataset
  const [examSchedule, setExamSchedule] = useState(loadExamSchedule);

  // Teacher specific filter: only show my assigned invigilation duties
  const [onlyMyDuties, setOnlyMyDuties] = useState(false);

  // Modals state
  const [isHallTicketModalOpen, setIsHallTicketModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);

  // Weekly Session Slot Modal state
  const [scheduleRevision, setScheduleRevision] = useState(0);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionFormData, setSessionFormData] = useState({
    time: '09:00 AM - 10:00 AM',
    courseCode: '',
    courseName: '',
    sessionType: 'Theory Lecture',
    faculty: '',
    room: 'Room A-201',
    division: assignedDivision || 'Div A',
    status: 'scheduled'
  });

  const handleStudentHallTicketClick = () => {
    const clearance = getClearanceForStudent(101); // Student session
    if (clearance.hallTicketStatus === 'issued') {
      setIsHallTicketModalOpen(true);
    } else {
      setIsBlockedModalOpen(true);
    }
  };

  const handleStudentPrintHallTicket = () => {
    const student = getStoredStudentProfile() || { name: 'Krrish Sharma', rollNumber: 101, semester: currentSemester };
    const clearance = getClearanceForStudent(student.rollNumber || 101);
    if (clearance && clearance.hallTicketStatus === 'issued') {
      printOfficialHallTicket(student, examSchedule);
      if (toast?.info) {
        toast.info('Combined Admit Card Print', 'Opening official A4 Admit Card for all combined subjects.');
      }
    } else {
      setIsBlockedModalOpen(true);
    }
  };

  // Exam form state
  const [formDepartment, setFormDepartment] = useState('IT');
  const [formDivision, setFormDivision] = useState('All');
  const [formPaperCode, setFormPaperCode] = useState('');
  const [formSubjectName, setFormSubjectName] = useState('');
  const [formDate, setFormDate] = useState('Nov 28, 2026');
  const [formDay, setFormDay] = useState('Saturday');
  const [formTime, setFormTime] = useState('10:00 AM - 01:00 PM');
  const [formRoom, setFormRoom] = useState('Examination Hall A-101');
  const [formSeating, setFormSeating] = useState('Desk #01 to #60');
  const [formExamType, setFormExamType] = useState('Theory Written');
  const [formMarks, setFormMarks] = useState(100);
  const [formInvigilator, setFormInvigilator] = useState('Prof. Krrish Sharma');

  // Sync published state across windows / role changes
  useEffect(() => {
    const handleVisibilityChange = (e) => {
      if (e.detail && typeof e.detail.published === 'boolean') {
        setIsExamPublished(e.detail.published);
      }
    };
    const handleScheduleUpdated = (e) => {
      if (e.detail && e.detail.items) {
        setExamSchedule(e.detail.items);
      }
    };
    const handleWeeklyUpdated = () => {
      setScheduleRevision((r) => r + 1);
    };

    window.addEventListener('edutrack_exam_visibility_changed', handleVisibilityChange);
    window.addEventListener('edutrack_exam_schedule_updated', handleScheduleUpdated);
    window.addEventListener('edutrack_weekly_schedule_updated', handleWeeklyUpdated);

    return () => {
      window.removeEventListener('edutrack_exam_visibility_changed', handleVisibilityChange);
      window.removeEventListener('edutrack_exam_schedule_updated', handleScheduleUpdated);
      window.removeEventListener('edutrack_weekly_schedule_updated', handleWeeklyUpdated);
    };
  }, []);

  // Admin toggle handler
  const handleTogglePublish = (newStatus) => {
    setIsExamPublished(newStatus);
    setExamPublishedStatus(newStatus);

    if (toast) {
      if (newStatus) {
        toast.success(
          'Exam Timetable Published Live',
          'Students and Faculty can now view official examination dates, halls, and admit cards.'
        );
      } else {
        toast.warning(
          'Exam Timetable Retracted to Draft',
          'Examination schedule is now hidden from Students and Teachers.'
        );
      }
    }
  };

  const handleOpenAddExam = () => {
    setEditingExamId(null);
    setFormPaperCode('');
    setFormSubjectName('');
    setFormDate('Nov 28, 2026');
    setFormDay('Saturday');
    setFormTime('10:00 AM - 01:00 PM');
    setFormRoom('Examination Hall A-101');
    setFormSeating('Desk #01 to #60');
    setFormExamType('Theory Written');
    setFormMarks(100);
    setFormInvigilator('Prof. Krrish Sharma');
    setFormDepartment(selectedDepartment);
    setFormDivision('All');
    setIsAddExamModalOpen(true);
  };

  const handleOpenEditExam = (exam) => {
    setEditingExamId(exam.id);
    setFormPaperCode(exam.paperCode || '');
    setFormSubjectName(exam.subjectName || '');
    setFormDate(exam.date || 'Nov 28, 2026');
    setFormDay(exam.day || 'Saturday');
    setFormTime(exam.time || '10:00 AM - 01:00 PM');
    setFormRoom(exam.room || 'Examination Hall A-101');
    setFormSeating(exam.seatingBlock || 'Desk #01 to #60');
    setFormExamType(exam.examType || 'Theory Written');
    setFormMarks(exam.marks || 100);
    setFormInvigilator(exam.invigilator || 'Prof. Krrish Sharma');
    setFormDepartment(exam.department || selectedDepartment);
    setFormDivision(exam.division || 'All');
    setIsAddExamModalOpen(true);
  };

  const handleDeleteExam = (examId, paperCode) => {
    if (window.confirm(`Are you sure you want to remove exam session "${paperCode}"?`)) {
      deleteExamSession(examId);
      if (toast) {
        toast.info('Exam Removed', `Deleted examination paper ${paperCode}.`);
      }
    }
  };

  const handleAddExam = (e) => {
    e.preventDefault();
    if (!formPaperCode.trim() || !formSubjectName.trim()) {
      if (toast) toast.error('Validation Error', 'Please specify paper code and subject name.');
      return;
    }

    if (editingExamId) {
      updateExamSession(editingExamId, {
        paperCode: formPaperCode.trim(),
        subjectName: formSubjectName.trim(),
        date: formDate,
        day: formDay,
        time: formTime,
        shift: formTime.includes('09:') || formTime.includes('10:') ? 'Morning Shift' : 'Afternoon Shift',
        duration: '3 Hours',
        marks: Number(formMarks) || 100,
        examType: formExamType,
        room: formRoom,
        seatingBlock: formSeating,
        invigilator: formInvigilator,
        department: formDepartment,
        division: formDivision
      });
      if (toast) {
        toast.success(
          'Exam Session Updated',
          `Updated ${formPaperCode}: ${formSubjectName}.`
        );
      }
      setEditingExamId(null);
      setIsAddExamModalOpen(false);
      return;
    }

    const newPaper = {
      id: `exam-${Date.now()}`,
      paperCode: formPaperCode.trim(),
      subjectName: formSubjectName.trim(),
      date: formDate,
      day: formDay,
      time: formTime,
      shift: formTime.includes('09:') || formTime.includes('10:') ? 'Morning Shift' : 'Afternoon Shift',
      duration: '3 Hours',
      marks: Number(formMarks) || 100,
      examType: formExamType,
      room: formRoom,
      seatingBlock: formSeating,
      invigilator: formInvigilator,
      coInvigilator: 'Department Proctor',
      reportingTime: '09:20 AM',
      status: 'Scheduled',
      instructions: 'Carry official hall ticket & identity smartcard.',
      department: formDepartment,
      division: formDivision
    };

    const updated = [...examSchedule, newPaper];
    setExamSchedule(updated);
    saveExamSchedule(updated);

    if (toast) {
      toast.success(
        'Exam Session Added',
        `Scheduled ${newPaper.paperCode}: ${newPaper.subjectName} on ${newPaper.date}.`
      );
    }

    setFormPaperCode('');
    setFormSubjectName('');
    setIsAddExamModalOpen(false);
  };

  // Weekly Session Slot Handlers
  const handleOpenAddSession = () => {
    setEditingSession(null);
    setSessionFormData({
      time: '09:00 AM - 10:00 AM',
      courseCode: '',
      courseName: '',
      sessionType: 'Theory Lecture',
      faculty: '',
      room: 'Room A-201',
      division: selectedDivision || 'Div A',
      status: 'scheduled'
    });
    setIsSessionModalOpen(true);
  };

  const handleOpenEditSession = (session) => {
    setEditingSession(session);
    setSessionFormData({
      time: session.time || '09:00 AM - 10:00 AM',
      courseCode: session.courseCode || '',
      courseName: session.courseName || '',
      sessionType: session.sessionType || 'Theory Lecture',
      faculty: session.faculty || '',
      room: session.room || '',
      division: session.division || selectedDivision || 'Div A',
      status: session.status || 'scheduled'
    });
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = (e) => {
    e.preventDefault();
    if (!sessionFormData.courseCode.trim() || !sessionFormData.courseName.trim()) {
      if (toast) toast.error('Validation Error', 'Please enter course code and course name.');
      return;
    }

    saveWeeklyClassSession(
      selectedDepartment,
      selectedSemester,
      selectedDivision,
      selectedDay,
      {
        id: editingSession ? editingSession.id : undefined,
        ...sessionFormData
      }
    );

    if (toast) {
      toast.success(
        editingSession ? 'Session Slot Updated' : 'Session Slot Added',
        `${sessionFormData.courseCode}: ${sessionFormData.courseName} on ${selectedDay} (${sessionFormData.time}).`
      );
    }

    setIsSessionModalOpen(false);
  };

  const handleDeleteSession = (sessionId, courseName) => {
    if (window.confirm(`Are you sure you want to delete session slot "${courseName}"?`)) {
      deleteWeeklyClassSession(selectedDepartment, selectedSemester, selectedDivision, selectedDay, sessionId);
      if (toast) {
        toast.info('Session Deleted', `Removed session slot "${courseName}".`);
      }
    }
  };

  // Filter exam schedule based on role and department
  const displayedExams = useMemo(() => {
    let list = examSchedule.filter(
      (e) => !e.department || e.department === selectedDepartment || e.department === 'All'
    );
    if (role === 'teacher' && onlyMyDuties) {
      list = list.filter((e) =>
        e.invigilator.toLowerCase().includes('krrish') ||
        (e.coInvigilator && e.coInvigilator.toLowerCase().includes('krrish'))
      );
    }
    return list;
  }, [examSchedule, selectedDepartment, role, onlyMyDuties]);

  // Current day schedule items (reactively recomputed on scheduleRevision)
  const semesterSchedule = useMemo(() => {
    return getWeeklyClassSchedule(selectedDepartment, selectedSemester, selectedDivision);
  }, [selectedDepartment, selectedSemester, selectedDivision, scheduleRevision]);

  const rawDaySchedule = (semesterSchedule && semesterSchedule[selectedDay]) || [];

  const isLabSession = (s) =>
    s.sessionType.toLowerCase().includes('lab') ||
    s.sessionType.toLowerCase().includes('practical') ||
    (s.room && s.room.toLowerCase().includes('lab')) ||
    (s.courseCode && s.courseCode.includes('L')) ||
    s.sessionType.toLowerCase().includes('coding');

  const labCount = rawDaySchedule.filter(isLabSession).length;
  const theoryCount = rawDaySchedule.length - labCount;

  const daySchedule = useMemo(() => {
    if (sessionFilter === 'theory') {
      return rawDaySchedule.filter((s) => !isLabSession(s));
    }
    if (sessionFilter === 'lab') {
      return rawDaySchedule.filter(isLabSession);
    }
    return rawDaySchedule;
  }, [rawDaySchedule, sessionFilter]);

  return (
    <div className={`timetable-hub-container ${className}`}>
      {/* Top Header & Main Mode Navigation */}
      <div className="table-header-bar" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb'
              }}
            >
              <Calendar size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                {activeSubTab === 'class' ? 'Weekly Academic Timetable' : 'End-Semester Examination Timetable'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {selectedSemester} · Department of {currentDeptObj?.name || 'Information Technology'} ({currentDeptObj?.code || 'IT'}) · Intake: {currentDeptObj?.intake || 120} Seats
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tab Navigation (Class vs Exam) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '3px',
              background: '#f1f5f9',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveSubTab('class')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: activeSubTab === 'class' ? 600 : 500,
                background: activeSubTab === 'class' ? '#ffffff' : 'transparent',
                color: activeSubTab === 'class' ? '#0f172a' : '#64748b',
                border: 'none',
                boxShadow: activeSubTab === 'class' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Clock size={13} />
              <span>Class Timetable</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('exam')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: activeSubTab === 'exam' ? 600 : 500,
                background: activeSubTab === 'exam' ? '#ffffff' : 'transparent',
                color: activeSubTab === 'exam' ? '#0f172a' : '#64748b',
                border: 'none',
                boxShadow: activeSubTab === 'exam' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <GraduationCap size={14} />
              <span>Exam Timetable</span>
              {role === 'admin' ? (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: isExamPublished ? '#dcfce7' : '#fee2e2',
                    color: isExamPublished ? '#15803d' : '#b91c1c'
                  }}
                >
                  {isExamPublished ? 'Live' : 'Draft'}
                </span>
              ) : isExamPublished ? (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: '#dcfce7',
                    color: '#15803d'
                  }}
                >
                  Live
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: '#f1f5f9',
                    color: '#64748b'
                  }}
                >
                  Pending
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Department & Division Scoping Selector Bar */}
      {role === 'admin' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '12px 18px',
            borderRadius: '14px',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={15} color="#2563eb" />
              Department:
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {AVAILABLE_DEPARTMENTS.map((dept) => {
                const isSelected = selectedDepartment === dept.code;
                const dIntake = deptIntakes.find((d) => d.code === dept.code);
                return (
                  <button
                    key={dept.code}
                    type="button"
                    onClick={() => {
                      setSelectedDepartment(dept.code);
                      const dData = deptIntakes.find((d) => d.code === dept.code) || deptIntakes[0];
                      const divs = calculateDivisionsForIntake(dData.intake);
                      setSelectedDivision(`Div ${divs[0].division}`);
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 700 : 500,
                      border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                      background: isSelected ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 6px rgba(37,99,235,0.25)' : 'none'
                    }}
                  >
                    {dept.name} ({dept.code} · {dIntake?.intake || 120})
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#64748b' }}>Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#1e293b'
                }}
              >
                <option value="Semester 1">Semester 1 (FE)</option>
                <option value="Semester 2">Semester 2 (FE)</option>
                <option value="Semester 3">Semester 3 (SE)</option>
                <option value="Semester 4">Semester 4 (SE)</option>
                <option value="Semester 5">Semester 5 (TE)</option>
                <option value="Semester 6">Semester 6 (TE)</option>
                <option value="Semester 7">Semester 7 (BE)</option>
                <option value="Semester 8">Semester 8 (BE)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#64748b' }}>Division:</span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#1e293b'
                }}
              >
                {dynamicDivisions.map((div) => (
                  <option key={div.division} value={`Div ${div.division}`}>
                    Div {div.division} ({div.count} Students · Roll {div.startRoll}–{div.endRoll})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: REGULAR CLASS TIMETABLE
          ========================================================================= */}
      {activeSubTab === 'class' && (
        <div>
          {/* Day of Week Selector Pills & Filters */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: 16,
              padding: '12px 16px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
              {daysOfWeek.map((day) => {
                const isSelected = selectedDay === day;
                const isToday = todayName === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      fontSize: '0.8125rem',
                      fontWeight: isSelected ? 600 : 500,
                      background: isSelected ? '#0f172a' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#334155',
                      border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{day}</span>
                    {isToday && (
                      <span
                        style={{
                          fontSize: '0.625rem',
                          background: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#2563eb',
                          color: '#ffffff',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          fontWeight: 700
                        }}
                      >
                        Today
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {role === 'student' ? (
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.8125rem',
                    fontWeight: 650,
                    color: '#0f172a',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Enrolled Division (Admin Provisioned)"
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  <span>Enrolled: {assignedDivision || 'Div A'}</span>
                </div>
              ) : role === 'teacher' ? (
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.8125rem',
                    fontWeight: 650,
                    color: '#0f172a',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Faculty Teaching Allocation"
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
                  <span>Teaching: {assignedDivision || 'Div A'}</span>
                </div>
              ) : (
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#334155',
                    background: '#ffffff'
                  }}
                >
                  {dynamicDivisions.map((div) => (
                    <option key={div.division} value={`Div ${div.division}`}>
                      Div {div.division} ({div.count} Students · Roll {div.startRoll}–{div.endRoll})
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => window.print()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                title="Print class schedule"
              >
                <Printer size={13} />
                <span>Print</span>
              </button>

              {role === 'admin' && (
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={handleOpenAddSession}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Plus size={13} />
                  <span>Add Slot</span>
                </button>
              )}
            </div>
          </div>

          {/* Schedule Table */}
          <div className="table-container" style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div className="table-header-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 18px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                  {selectedDay} Schedule
                </h4>
              </div>

              {/* Minimal Segmented Filter */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                {[
                  { id: 'all', label: `All (${rawDaySchedule.length})` },
                  { id: 'theory', label: `Theory (${theoryCount})` },
                  { id: 'lab', label: `Labs (${labCount})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSessionFilter(f.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.73rem',
                      fontWeight: sessionFilter === f.id ? 600 : 500,
                      cursor: 'pointer',
                      border: 'none',
                      background: sessionFilter === f.id ? '#ffffff' : 'transparent',
                      color: sessionFilter === f.id ? '#0f172a' : '#64748b',
                      boxShadow: sessionFilter === f.id ? '0 1px 2px rgba(15, 23, 42, 0.08)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="clean-table" style={{ width: '100%', minWidth: '780px', margin: 0 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ width: '150px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                      Time Slot
                    </th>
                    <th style={{ padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                      Course & Subject
                    </th>
                    <th style={{ width: '130px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                      Session Type
                    </th>
                    <th style={{ width: '220px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                      Faculty Instructor
                    </th>
                    <th style={{ width: '115px', padding: '10px 16px', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                      Room / Lab
                    </th>
                    <th style={{ width: '105px', padding: '10px 16px', textAlign: 'right', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                      Status
                    </th>
                    {role === 'admin' && (
                      <th style={{ width: '90px', padding: '10px 16px', textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {daySchedule.map((slot) => {
                    const isLab = isLabSession(slot);

                    return (
                      <tr
                        key={slot.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: isLab ? 'rgba(240, 253, 244, 0.45)' : '#ffffff',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                            {slot.time}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                fontWeight: 700,
                                color: isLab ? '#047857' : '#2563eb',
                                background: isLab ? '#ecfdf5' : '#eff6ff',
                                border: isLab ? '1px solid #bbf7d0' : '1px solid #dbeafe',
                                padding: '2px 7px',
                                borderRadius: '5px',
                                fontSize: '0.72rem',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                              }}
                            >
                              {slot.courseCode}
                            </span>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.84rem', lineHeight: 1.3 }}>
                                {slot.courseName}
                              </div>
                              {slot.division && (
                                <span style={{ fontSize: '0.7rem', color: isLab ? '#059669' : '#64748b', fontWeight: 500 }}>
                                  {slot.division}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              background: isLab ? '#ecfdf5' : '#f8fafc',
                              color: isLab ? '#047857' : '#475569',
                              border: isLab ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                            }}
                          >
                            {isLab ? <FlaskConical size={11} color="#047857" /> : <BookOpen size={11} color="#64748b" />}
                            <span>{isLab ? 'Practical Lab' : 'Theory Class'}</span>
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                background: isLab ? '#dcfce7' : '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.625rem',
                                fontWeight: 700,
                                color: isLab ? '#15803d' : '#64748b',
                                flexShrink: 0
                              }}
                            >
                              {slot.faculty.charAt(slot.faculty.lastIndexOf(' ') + 1) || 'F'}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {slot.faculty}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              color: isLab ? '#047857' : '#475569'
                            }}
                          >
                            {isLab ? <FlaskConical size={11} color="#047857" /> : <MapPin size={11} color="#94a3b8" />}
                            <span>{slot.room}</span>
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              background: slot.status === 'active' ? '#dcfce7' : '#f1f5f9',
                              color: slot.status === 'active' ? '#15803d' : '#64748b'
                            }}
                          >
                            {slot.status === 'active' ? '● In Session' : slot.status === 'completed' ? 'Completed' : 'Scheduled'}
                          </span>
                        </td>
                        {role === 'admin' && (
                          <td style={{ padding: '12px 16px', textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditSession(slot)}
                                style={{
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#334155',
                                  borderRadius: '6px',
                                  padding: '4px 7px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                                title="Edit Session Slot"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSession(slot.id, slot.courseName)}
                                style={{
                                  border: '1px solid #fecaca',
                                  background: '#fef2f2',
                                  color: '#dc2626',
                                  borderRadius: '6px',
                                  padding: '4px 7px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                                title="Delete Session Slot"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: EXAMINATION TIMETABLE (WITH ADMIN VISIBILITY CONTROLLER)
          ========================================================================= */}
      {activeSubTab === 'exam' && (
        <div>
          {/* ADMIN MASTER CONTROL BAR: Toggle live visibility & Add paper */}
          {role === 'admin' && (
            <div
              style={{
                marginBottom: 20,
                padding: '16px 20px',
                background: '#ffffff',
                border: isExamPublished ? '1.5px solid #86efac' : '1.5px solid #fecaca',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Apple-style Interactive Toggle Switch */}
                <div
                  role="switch"
                  aria-checked={isExamPublished}
                  tabIndex={0}
                  onClick={() => handleTogglePublish(!isExamPublished)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTogglePublish(!isExamPublished);
                    }
                  }}
                  style={{
                    width: 52,
                    height: 30,
                    borderRadius: 9999,
                    background: isExamPublished ? '#16a34a' : '#cbd5e1',
                    padding: 3,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)'
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#ffffff',
                      transform: isExamPublished ? 'translateX(22px)' : 'translateX(0px)',
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isExamPublished ? <Check size={13} color="#16a34a" /> : <X size={13} color="#94a3b8" />}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                      {isExamPublished
                        ? 'Exam Timetable is Live on Student & Faculty Portals'
                        : 'Exam Timetable is in Draft (Hidden from Students & Teachers)'}
                    </strong>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 9999,
                        background: isExamPublished ? '#ecfdf5' : '#fef2f2',
                        color: isExamPublished ? '#059669' : '#dc2626',
                        border: isExamPublished ? '1px solid #a7f3d0' : '1px solid #fecaca'
                      }}
                    >
                      {isExamPublished ? 'Published & Active' : 'Unpublished (Draft)'}
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    {isExamPublished
                      ? 'Students can view dates, venues, seating blocks, and download official hall tickets.'
                      : 'Toggle ON to release examination dates, room rosters, and admit cards to all cohorts.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={handleOpenAddExam}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} />
                  <span>Add Exam Paper</span>
                </button>
              </div>
            </div>
          )}

          {/* LOCKED / UNPUBLISHED STATE FOR STUDENTS & TEACHERS */}
          {!isExamPublished && role !== 'admin' ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '60px 24px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(15, 23, 42, 0.03)',
                maxWidth: '680px',
                margin: '20px auto'
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '20px',
                  background: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  margin: '0 auto 18px'
                }}
              >
                <Clock size={32} />
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#64748b',
                  background: '#f1f5f9',
                  padding: '3px 10px',
                  borderRadius: 9999
                }}
              >
                Examination Cell · Scheduling in Progress
              </span>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '12px 0 8px 0' }}>
                End-Semester Examination Timetable Not Yet Published
              </h3>

              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 24px' }}>
                The official timetable for {currentSemester} theory examinations, practical lab vivas, and hall seatings is currently being finalized by the Controller of Examinations and Academic Council.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveSubTab('class')}
                >
                  View Weekly Class Schedule
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    toast.success('Reminder Set', 'You will receive an alert as soon as the exam schedule is published.')
                  }
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Bell size={14} />
                  <span>Notify Me on Release</span>
                </button>
              </div>
            </div>
          ) : (
            /* PUBLISHED EXAM TIMETABLE (VISIBLE TO ALL WHEN ON, OR TO ADMIN IN DRAFT) */
            <div>
              {/* Countdown & Quick Action Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  color: '#ffffff',
                  borderRadius: '16px',
                  marginBottom: '16px',
                  boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.2)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 4 }}>
                    <span
                      style={{
                        background: 'rgba(37, 99, 235, 0.35)',
                        border: '1px solid rgba(96, 165, 250, 0.5)',
                        color: '#93c5fd',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 9999,
                        textTransform: 'uppercase'
                      }}
                    >
                      Winter 2026 Examination Phase
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Starts Nov 10, 2026 · 38 Days Remaining
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                    {currentSemester} End-Term Examination Schedule
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                    {examSchedule.length} Scheduled Papers · Examination Center #04 (Block A & B)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Student Hall Ticket Actions */}
                  {role === 'student' && (
                    <>
                      <button
                        type="button"
                        onClick={handleStudentPrintHallTicket}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: 'rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          borderRadius: '10px',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        title="Print combined official exam hall ticket for all subjects"
                      >
                        <Printer size={14} />
                        <span>Print Combined Hall Ticket</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleStudentHallTicketClick}
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
                          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Download size={14} />
                        <span>View / Download Hall Ticket</span>
                      </button>
                    </>
                  )}

                  {/* Teacher Filter Toggle */}
                  {role === 'teacher' && (
                    <button
                      type="button"
                      onClick={() => setOnlyMyDuties(!onlyMyDuties)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: onlyMyDuties ? '#2563eb' : 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Filter size={13} />
                      <span>{onlyMyDuties ? 'Showing My Duties Only' : 'Filter My Invigilation Duties'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Printer size={13} />
                    <span>Print Schedule</span>
                  </button>
                </div>
              </div>

              {/* Exam Papers Table */}
              <div className="table-container" style={{ background: '#ffffff', borderRadius: 16 }}>
                <div className="table-header-bar">
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                      Examination Schedule
                    </h4>
                  </div>
                </div>

                <table className="clean-table">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>Date & Day</th>
                      <th style={{ width: '150px' }}>Timing & Shift</th>
                      <th>Course Subject</th>
                      <th>Exam Type</th>
                      <th>Venue & Seating Block</th>
                      {role === 'teacher' || role === 'admin' ? (
                        <th>Appointed Invigilators</th>
                      ) : (
                        <th>Reporting Time</th>
                      )}
                      <th style={{ textAlign: 'right' }}>Admit Status</th>
                      {role === 'admin' && (
                        <th style={{ width: '90px', textAlign: 'center' }}>Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedExams.map((exam) => (
                      <tr key={exam.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{exam.date}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{exam.day}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{exam.time}</div>
                          <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>{exam.shift}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 2 }}>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: '#0f172a',
                                background: '#f1f5f9',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontSize: '0.72rem'
                              }}
                            >
                              {exam.paperCode}
                            </span>
                            <strong style={{ color: '#0f172a' }}>{exam.subjectName}</strong>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {exam.duration} · Max Marks: {exam.marks}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              exam.examType.includes('Practical')
                                ? 'badge-primary'
                                : exam.examType.includes('Defense')
                                ? 'badge-warning'
                                : 'badge-neutral'
                            }`}
                          >
                            {exam.examType}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{exam.room}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{exam.seatingBlock}</div>
                        </td>
                        {role === 'teacher' || role === 'admin' ? (
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{exam.invigilator}</div>
                            {exam.coInvigilator && (
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                Co-Duty: {exam.coInvigilator}
                              </div>
                            )}
                          </td>
                        ) : (
                          <td>
                            <div style={{ fontWeight: 600, color: '#059669' }}>{exam.reportingTime}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Gate Closes 09:45 AM</div>
                          </td>
                        )}
                        <td style={{ textAlign: 'right' }}>
                          <span className="badge badge-success">Confirmed</span>
                        </td>
                        {role === 'admin' && (
                          <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditExam(exam)}
                                style={{
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#334155',
                                  borderRadius: '6px',
                                  padding: '4px 7px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                                title="Edit Exam Paper"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExam(exam.id, exam.paperCode)}
                                style={{
                                  border: '1px solid #fecaca',
                                  background: '#fef2f2',
                                  color: '#dc2626',
                                  borderRadius: '6px',
                                  padding: '4px 7px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                                title="Delete Exam Paper"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Official Hall Ticket Modal for Students */}
      {isHallTicketModalOpen && (
        <HallTicketModal
          isOpen={isHallTicketModalOpen}
          onClose={() => setIsHallTicketModalOpen(false)}
          student={getStoredStudentProfile() || getClearanceForStudent(101)}
          examSchedule={examSchedule}
        />
      )}

      {/* Clearance Blocked Modal for Students */}
      {isBlockedModalOpen && (
        <ClearanceBlockedModal
          isOpen={isBlockedModalOpen}
          onClose={() => setIsBlockedModalOpen(false)}
          blockType="hallticket"
          student={getClearanceForStudent(101)}
        />
      )}

      {/* Admin: Add Exam Paper Modal */}
      {isAddExamModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddExamModalOpen(false)} style={{ zIndex: 130 }}>
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
                <GraduationCap size={18} color="#2563eb" />
                <h3 className="modal-heading-title">
                  {editingExamId ? 'Edit Examination Paper' : 'Schedule New Examination Paper'}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddExamModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddExam} className="modal-form-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '10px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Target Department *</label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="form-input-control"
                  >
                    {AVAILABLE_DEPARTMENTS.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group-field">
                  <label className="form-field-label">Target Division *</label>
                  <select
                    value={formDivision}
                    onChange={(e) => setFormDivision(e.target.value)}
                    className="form-input-control"
                  >
                    <option value="All">All Divisions (Dept-Wide)</option>
                    <option value="Div A">Division A</option>
                    <option value="Div B">Division B</option>
                    <option value="Div C">Division C</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Paper Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. IT-305"
                    value={formPaperCode}
                    onChange={(e) => setFormPaperCode(e.target.value)}
                    className="form-input-control"
                    required
                  />
                </div>
                <div className="form-group-field">
                  <label className="form-field-label">Subject Course Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Artificial Intelligence & Neural Networks"
                    value={formSubjectName}
                    onChange={(e) => setFormSubjectName(e.target.value)}
                    className="form-input-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Examination Date *</label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 28, 2026"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="form-input-control"
                    required
                  />
                </div>
                <div className="form-group-field">
                  <label className="form-field-label">Day of Week</label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value)}
                    className="form-input-control"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Time Slot</label>
                  <select
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="form-input-control"
                  >
                    <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                    <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                    <option value="09:00 AM - 01:00 PM">Lab Practical Morning (4h)</option>
                    <option value="01:30 PM - 05:30 PM">Lab Practical Afternoon (4h)</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label className="form-field-label">Examination Type</label>
                  <select
                    value={formExamType}
                    onChange={(e) => setFormExamType(e.target.value)}
                    className="form-input-control"
                  >
                    <option value="Theory Written">Theory Written</option>
                    <option value="Practical Lab & Viva">Practical Lab & Viva</option>
                    <option value="Project Defense">Project Defense</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Assigned Hall / Lab</label>
                  <input
                    type="text"
                    placeholder="e.g. Examination Hall A-101"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="form-input-control"
                  />
                </div>

                <div className="form-group-field">
                  <label className="form-field-label">Invigilator Lead</label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Krrish Sharma"
                    value={formInvigilator}
                    onChange={(e) => setFormInvigilator(e.target.value)}
                    className="form-input-control"
                  />
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddExamModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Plus size={14} />
                  <span>{editingExamId ? 'Update Exam Paper' : 'Save Exam Paper'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin: Add / Edit Weekly Class Session Slot Modal */}
      {isSessionModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsSessionModalOpen(false)} style={{ zIndex: 130 }}>
          <div
            className="modal-content-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '560px',
              width: '92vw',
              background: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)'
            }}
          >
            <div className="modal-header-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#2563eb" />
                <h3 className="modal-heading-title">
                  {editingSession ? 'Edit Timetable Session Slot' : `Add Session Slot to ${selectedDay}`}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSessionModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="modal-form-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '10px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Time Slot *</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM - 10:00 AM"
                    value={sessionFormData.time}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, time: e.target.value })}
                    className="form-input-control"
                    required
                  />
                </div>
                <div className="form-group-field">
                  <label className="form-field-label">Session Type *</label>
                  <select
                    value={sessionFormData.sessionType}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, sessionType: e.target.value })}
                    className="form-input-control"
                  >
                    <option value="Theory Lecture">Theory Lecture</option>
                    <option value="Practical Lab">Practical Lab</option>
                    <option value="Coding Lab">Coding Lab</option>
                    <option value="Tutorial Session">Tutorial Session</option>
                    <option value="Seminar / Presentation">Seminar / Presentation</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Course Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. IT-301"
                    value={sessionFormData.courseCode}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, courseCode: e.target.value })}
                    className="form-input-control"
                    required
                  />
                </div>
                <div className="form-group-field">
                  <label className="form-field-label">Course / Subject Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Database Management Systems"
                    value={sessionFormData.courseName}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, courseName: e.target.value })}
                    className="form-input-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Faculty Instructor *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sneha Patil"
                    value={sessionFormData.faculty}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, faculty: e.target.value })}
                    className="form-input-control"
                    required
                  />
                </div>
                <div className="form-group-field">
                  <label className="form-field-label">Room / Lab Location *</label>
                  <input
                    type="text"
                    placeholder="e.g. Hall A-201 or Lab 3"
                    value={sessionFormData.room}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, room: e.target.value })}
                    className="form-input-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Target Division</label>
                  <select
                    value={sessionFormData.division}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, division: e.target.value })}
                    className="form-input-control"
                  >
                    <option value="All">All Divisions</option>
                    <option value="Div A">Div A</option>
                    <option value="Div B">Div B</option>
                    <option value="Div C">Div C</option>
                    <option value="Batch A1">Batch A1 (Lab)</option>
                    <option value="Batch A2">Batch A2 (Lab)</option>
                    <option value="Batch B1">Batch B1 (Lab)</option>
                    <option value="Batch B2">Batch B2 (Lab)</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label className="form-field-label">Session Status</label>
                  <select
                    value={sessionFormData.status}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, status: e.target.value })}
                    className="form-input-control"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="active">In Session (Active)</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsSessionModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Plus size={14} />
                  <span>{editingSession ? 'Update Slot' : 'Save Session Slot'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
