import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AdminPanel from './pages/AdminPanel';
import TeacherPanel from './pages/TeacherPanel';
import StudentPanel from './pages/StudentPanel';
import AddStudent from './pages/AddStudent';
import StudentDetails from './pages/StudentDetails';
import ProfileModal from './components/ProfileModal';
import Login from './components/Login';
import { DEMO_ACCOUNTS } from './lib/demoAccounts';
import { studentService } from './services/studentService';
import { getStoredStudentProfile } from './lib/studentProfiles';
import { registerStudentCredentials } from './lib/authCredentialsService';
import { getFacultyAssignments } from './lib/facultyAssignmentsData';
import CredentialsSlipModal from './components/common/CredentialsSlipModal';
import DocumentationView from './pages/DocumentationView';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('edutrack_auth_user');
      return saved ? JSON.parse(saved) : DEMO_ACCOUNTS.student;
    } catch {
      return DEMO_ACCOUNTS.student;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('edutrack_auth_user');
      return saved ? JSON.parse(saved).role : 'student';
    } catch {
      return 'student';
    }
  });

  const [activeStudentProfile, setActiveStudentProfile] = useState(() => getStoredStudentProfile());

  useEffect(() => {
    const handleProfileSync = (e) => {
      if (e.detail) {
        setActiveStudentProfile(e.detail);
      }
    };
    window.addEventListener('edutrack_profile_updated', handleProfileSync);
    return () => window.removeEventListener('edutrack_profile_updated', handleProfileSync);
  }, []);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState('profile');

  const handleOpenProfileModal = (tab = 'profile') => {
    setProfileModalTab(typeof tab === 'string' ? tab : 'profile');
    setIsProfileModalOpen(true);
  };
  const [activeTab, setActiveTab] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const p = window.location.pathname.toLowerCase();
        const h = window.location.hash.toLowerCase();
        if (p === '/docs' || h === '#/docs' || h === '#docs') {
          return 'docs';
        }
      }
    } catch {}
    return 'dashboard';
  });

  // Keep URL in sync with docs state
  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const p = window.location.pathname.toLowerCase();
        const h = window.location.hash.toLowerCase();
        if (p === '/docs' || h === '#/docs' || h === '#docs') {
          setActiveTab('docs');
        }
      } catch {}
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const [currentSemester, setCurrentSemester] = useState(() => {
    try {
      return localStorage.getItem('edutrack_active_semester') || 'Semester 6';
    } catch {
      return 'Semester 6';
    }
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudentCredentials, setNewStudentCredentials] = useState(null);

  const handleSemesterChange = (newSem) => {
    setCurrentSemester(newSem);
    try {
      localStorage.setItem('edutrack_active_semester', newSem);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStudents();

    // Instant real-time listener from WebSocket & local cache sync
    const unsubscribe = studentService.subscribe((msg) => {
      if (['STUDENT_ADDED', 'STUDENT_UPDATED', 'STUDENT_DELETED', 'STUDENTS_BULK_ADDED'].includes(msg.event)) {
        loadStudents();
      }
    });

    const handleCacheSync = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setStudents(e.detail);
        setLoading(false);
      }
    };
    window.addEventListener('edutrack_students_updated', handleCacheSync);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      window.removeEventListener('edutrack_students_updated', handleCacheSync);
    };
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setActiveTab('dashboard');
    try {
      localStorage.setItem('edutrack_auth_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('edutrack_auth_user');
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleChange = (newRole) => {
    const acc = DEMO_ACCOUNTS[newRole] || { role: newRole, name: newRole };
    setCurrentUser(acc);
    setCurrentRole(newRole);
    setActiveTab('dashboard');
    try {
      localStorage.setItem('edutrack_auth_user', JSON.stringify(acc));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateOrUpdateStudent = async (formData) => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.rollNumber, formData);
        setEditingStudent(null);
      } else {
        const added = await studentService.add(formData);
        // Automatically generate unique institutional PRN and temporary password
        const creds = registerStudentCredentials({
          rollNumber: formData.rollNumber,
          name: formData.name,
          email: formData.email,
          course: formData.course,
          division: formData.division,
          prn: formData.prn
        });
        setNewStudentCredentials({
          ...creds,
          department: formData.course ? `B.Tech in ${formData.course}` : 'Information Technology',
          role: 'student'
        });
      }
      await loadStudents();
      setActiveTab('students');
    } catch (err) {
      console.error(err.message || 'Operation failed');
    }
  };

  const handleDeleteStudent = async (rollNumber) => {
    try {
      await studentService.delete(rollNumber);
      await loadStudents();
    } catch (err) {
      console.error(err.message || 'Failed to delete student');
    }
  };

  const handleStartEdit = (student) => {
    setEditingStudent(student);
    setActiveTab('add');
  };

  const handleCancelForm = () => {
    setEditingStudent(null);
    setActiveTab('students');
  };

  if (activeTab === 'docs') {
    return (
      <div
        className="docs-standalone-container"
        id="docs-scroll-root"
        style={{
          minHeight: '100vh',
          height: '100vh',
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: '#f8fafc',
          boxSizing: 'border-box',
          scrollBehavior: 'smooth'
        }}
      >
        <DocumentationView
          onBackToApp={() => {
            setActiveTab('dashboard');
            try {
              if (window.location.hash === '#/docs') window.history.pushState(null, '', '/');
              else if (window.location.pathname === '/docs') window.history.pushState(null, '', '/');
            } catch {}
          }}
        />
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Department & Division isolated student roster strictly scoped for teachers
  const teacherScopedStudents = useMemo(() => {
    if (currentRole !== 'teacher') return students;
    const dept = (currentUser?.department || 'Information Technology').toLowerCase();
    const facultyDeptCode = dept.includes('computer') ? 'CS' : dept.includes('electronic') ? 'EXTC' : dept.includes('mech') ? 'MECH' : 'IT';

    let assignedDivs = ['A'];
    try {
      const assignments = getFacultyAssignments();
      const fac = assignments.find(
        (f) =>
          f.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
          f.id === currentUser?.id ||
          f.name?.toLowerCase() === currentUser?.name?.toLowerCase()
      ) || assignments[0];

      if (fac) {
        const divs = new Set();
        const ctDiv = fac.roles?.classTeacher?.division || fac.classTeacherDivision;
        if (ctDiv && ctDiv !== 'None') {
          const parsed = ctDiv.replace(/[^A-Za-z]/g, '').slice(-1) || 'A';
          divs.add(parsed.toUpperCase());
        }
        if (fac.roles?.theorySubjects) {
          fac.roles.theorySubjects.forEach((s) => {
            if (s.division) divs.add(s.division.toUpperCase());
          });
        }
        if (divs.size > 0) assignedDivs = Array.from(divs);
      }
    } catch {}

    const assigned = students.filter((s) => {
      const studentCourse = (s.course || '').toUpperCase();
      const matchesDept = studentCourse === facultyDeptCode || studentCourse.includes(facultyDeptCode);
      const studentDiv = (s.division || (s.rollNumber % 2 === 0 ? 'B' : 'A')).toUpperCase();
      const matchesDiv = assignedDivs.includes(studentDiv);
      return matchesDept && matchesDiv;
    });

    if (assigned.length > 0) return assigned;

    // Fallback if DB students do not yet match
    const deptOnly = students.filter(s => (s.course || '').toUpperCase() === facultyDeptCode);
    return deptOnly.length > 0 ? deptOnly : [
      { rollNumber: 101, name: 'Krrish Sharma', course: 'IT', division: 'A', percentage: 94.2, cgpa: 9.15, email: 'krrish.sharma@edutrack.edu', feeTotal: 85000, feePaid: 85000 },
      { rollNumber: 102, name: 'Rohan Patel', course: 'IT', division: 'A', percentage: 71.4, cgpa: 6.84, email: 'rohan.patel@edutrack.edu', feeTotal: 85000, feePaid: 45000 },
      { rollNumber: 103, name: 'Pooja Nair', course: 'IT', division: 'A', percentage: 95.8, cgpa: 9.40, email: 'pooja.n@edutrack.edu', feeTotal: 85000, feePaid: 85000 },
      { rollNumber: 104, name: 'Meera Iyer', course: 'IT', division: 'A', percentage: 89.1, cgpa: 8.85, email: 'meera.i@edutrack.edu', feeTotal: 85000, feePaid: 85000 }
    ];
  }, [currentRole, currentUser, students]);

  // Sidebar badge student count
  const sidebarStudentCount = useMemo(() => {
    if (currentRole === 'admin') return students.length;
    if (currentRole === 'teacher') return teacherScopedStudents.length;
    return students.length;
  }, [currentRole, students.length, teacherScopedStudents.length]);

  return (
    <div className="window-container">
      {/* Strict Role-Based Sidebar per Section 7 */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'add') setEditingStudent(null);
          setActiveTab(tab);
          try {
            if (tab === 'docs') {
              if (window.location.hash !== '#/docs') window.location.hash = '#/docs';
            } else if (window.location.hash === '#/docs') {
              window.history.pushState(null, '', window.location.pathname === '/docs' ? '/' : window.location.pathname);
            }
          } catch {}
        }}
        currentRole={currentRole}
        currentUser={currentUser}
        activeStudentProfile={activeStudentProfile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        studentCount={sidebarStudentCount}
        onOpenProfileModal={handleOpenProfileModal}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main SaaS View Area */}
      <main className="main-surface">
        <Header
          activeTab={activeTab}
          currentRole={currentRole}
          currentUser={currentUser}
          activeStudentProfile={activeStudentProfile}
          currentSemester={currentSemester}
          onChangeSemester={handleSemesterChange}
          onChangeRole={handleRoleChange}
          onOpenProfileModal={handleOpenProfileModal}
          onLogout={handleLogout}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <div className="page-body" key={`${currentRole}-${activeTab}`}>
          {activeTab === 'add' && currentRole === 'admin' ? (
            <AddStudent
              initialData={editingStudent}
              onSubmit={handleCreateOrUpdateStudent}
              onCancel={handleCancelForm}
            />
          ) : (
            <>
              {currentRole === 'student' && (
                <StudentPanel
                  activeTab={activeTab}
                  onNavigate={setActiveTab}
                  students={students}
                  activeStudentProfile={activeStudentProfile}
                  onViewStudent={(s) => setViewingStudent(s)}
                  onOpenProfileModal={handleOpenProfileModal}
                />
              )}

              {currentRole === 'teacher' && (
                <TeacherPanel
                  activeTab={activeTab}
                  onNavigate={setActiveTab}
                  students={teacherScopedStudents}
                  currentUser={currentUser}
                  onViewStudent={(s) => setViewingStudent(s)}
                  onOpenProfileModal={handleOpenProfileModal}
                />
              )}

              {currentRole === 'admin' && (
                <AdminPanel
                  activeTab={activeTab}
                  onNavigate={setActiveTab}
                  students={students}
                  loading={loading}
                  onViewStudent={(s) => setViewingStudent(s)}
                  onEditStudent={handleStartEdit}
                  onDeleteStudent={handleDeleteStudent}
                  onOpenProfileModal={handleOpenProfileModal}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Student Details Inspection Modal */}
      {viewingStudent && (
        <StudentDetails
          student={viewingStudent}
          currentRole={currentRole}
          onClose={() => setViewingStudent(null)}
          onEdit={currentRole === 'admin' ? handleStartEdit : undefined}
        />
      )}

      {/* Profile & Account Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentRole={currentRole}
        currentUser={currentUser}
        initialTab={profileModalTab}
        onSaveProfile={(updated) => setActiveStudentProfile(updated)}
      />

      {/* Generated Student Credentials Slip Modal */}
      <CredentialsSlipModal
        isOpen={Boolean(newStudentCredentials)}
        onClose={() => setNewStudentCredentials(null)}
        credentials={newStudentCredentials}
      />
    </div>
  );
}
