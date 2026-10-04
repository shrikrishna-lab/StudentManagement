import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Building2,
  BookOpen,
  FlaskConical,
  GraduationCap,
  ShieldCheck,
  Edit3,
  Check,
  X,
  Search,
  Plus,
  Save,
  UserPlus,
  Info,
  Maximize2,
  Minimize2,
  Mail,
  Phone,
  MapPin,
  User,
  CheckCircle2
} from 'lucide-react';
import {
  getFacultyAssignments,
  updateFacultyAssignment,
  addFacultyMember,
  DEPARTMENTS
} from '../../lib/facultyAssignmentsData';
import { registerTeacherCredentials } from '../../lib/authCredentialsService';
import CredentialsSlipModal from '../common/CredentialsSlipModal';
import { useToast } from '../../context/ToastContext';

import {
  calculateDivisionsForIntake,
  getDepartmentIntakes,
  AVAILABLE_DEPARTMENTS,
  AVAILABLE_YEARS
} from '../../lib/departmentIntakeHelper';

const AVAILABLE_THEORY_SUBJECTS = [
  { code: 'IT-301', name: 'Core Java & OOP Frameworks', dept: 'Information Technology' },
  { code: 'IT-302', name: 'Database Management Systems & Transactions', dept: 'Information Technology' },
  { code: 'IT-303', name: 'Distributed Systems & Cloud Computing', dept: 'Information Technology' },
  { code: 'IT-304', name: 'Computer Networks & Network Security', dept: 'Information Technology' },
  { code: 'CS-201', name: 'Object-Oriented Programming (C++)', dept: 'Computer Science' },
  { code: 'CS-301', name: 'Data Structures & Algorithms', dept: 'Computer Science' },
  { code: 'CS-302', name: 'Operating System Design & Internals', dept: 'Computer Science' },
  { code: 'CS-304', name: 'Artificial Intelligence & Search Algorithms', dept: 'Computer Science' },
  { code: 'EXTC-301', name: 'Signals & Systems', dept: 'Electronics & Telecommunication' },
  { code: 'EXTC-302', name: 'Microcontrollers & Embedded Systems', dept: 'Electronics & Telecommunication' },
  { code: 'MECH-301', name: 'Thermodynamics & Heat Transfer', dept: 'Mechanical Engineering' },
  { code: 'MECH-302', name: 'Fluid Mechanics & Turbomachinery', dept: 'Mechanical Engineering' },
  { code: 'AIDS-301', name: 'Machine Learning Foundations', dept: 'Artificial Intelligence & Data Science' },
  { code: 'AIDS-302', name: 'Deep Neural Networks', dept: 'Artificial Intelligence & Data Science' }
];

const AVAILABLE_PRACTICAL_LABS = [
  { code: 'IT-301L', name: 'Core Java Programming Laboratory', room: 'Computing Lab A-1', dept: 'Information Technology' },
  { code: 'IT-302L', name: 'DBMS & SQL Performance Laboratory', room: 'Computing Lab A-2', dept: 'Information Technology' },
  { code: 'IT-304L', name: 'Network Security & Packet Analysis Lab', room: 'Networking Lab N-1', dept: 'Information Technology' },
  { code: 'CS-301L', name: 'Advanced Algorithms Lab', room: 'Computing Lab B-2', dept: 'Computer Science' },
  { code: 'CS-303L', name: 'Cloud & Kubernetes Systems Lab', room: 'Computing Lab B-1', dept: 'Computer Science' },
  { code: 'EXTC-301L', name: 'DSP & Simulation Lab', room: 'Hardware Lab H-1', dept: 'Electronics & Telecommunication' },
  { code: 'MECH-301L', name: 'CAD/CAM Simulation Lab', room: 'Design Lab M-1', dept: 'Mechanical Engineering' },
  { code: 'AIDS-301L', name: 'AI Model Training Lab', room: 'AI Cluster 1', dept: 'Artificial Intelligence & Data Science' }
];

export default function AdminFacultyAllocation() {
  const toast = useToast();
  const [facultyList, setFacultyList] = useState(getFacultyAssignments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [editingFaculty, setEditingFaculty] = useState(null);

  // Form states for editing
  const [formDept, setFormDept] = useState('');
  const [formIsClassTeacher, setFormIsClassTeacher] = useState(false);
  const [formClassDiv, setFormClassDiv] = useState('Div A');
  const [formIsGfm, setFormIsGfm] = useState(false);
  const [formGfmCohort, setFormGfmCohort] = useState('');
  const [formTheory, setFormTheory] = useState([]);
  const [formLabs, setFormLabs] = useState([]);

  // State for creating new faculty
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [newFacultyForm, setNewFacultyForm] = useState({
    name: '',
    email: '',
    phone: '',
    cabin: 'Faculty Block B-204',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    gender: 'Male',
    isClassTeacher: false,
    classTeacherDept: 'Information Technology',
    classTeacherYear: 'Year 3 (TE)',
    classTeacherDivision: 'Div A',
    classTeacherRoom: 'Room 302',
    isGfm: false,
    gfmDept: 'Information Technology',
    gfmDivision: 'Div A',
    gfmStartRoll: '101',
    gfmEndRoll: '135',
    gfmCabin: 'Counseling Cabin 104',
    gfmCohort: 'Roll #101 to #135 (Div A)',
    theorySubjects: ['IT-301'],
    practicalLabs: ['IT-301L']
  });

  const handleCreateFaculty = (e) => {
    e.preventDefault();
    if (!newFacultyForm.name.trim() || !newFacultyForm.email.trim()) {
      toast?.error('Missing Fields', 'Name and email are required to register faculty.');
      return;
    }

    const theoryObjs = newFacultyForm.theorySubjects.map((code) => {
      const found = AVAILABLE_THEORY_SUBJECTS.find((s) => s.code === code);
      return { code, name: found ? found.name : 'Theory Course', credits: 4, weeklyHours: 4 };
    });

    const labObjs = newFacultyForm.practicalLabs.map((code) => {
      const found = AVAILABLE_PRACTICAL_LABS.find((l) => l.code === code);
      return { code, name: found ? found.name : 'Lab Course', batch: 'Batch 1', labRoom: found ? found.room : 'Lab A-1' };
    });

    const added = addFacultyMember({
      name: newFacultyForm.name.trim(),
      email: newFacultyForm.email.trim(),
      phone: newFacultyForm.phone.trim() || '+91 98201 12345',
      cabin: newFacultyForm.cabin.trim() || 'Faculty Block B-204',
      department: newFacultyForm.department,
      designation: newFacultyForm.designation,
      gender: newFacultyForm.gender,
      isClassTeacher: newFacultyForm.isClassTeacher,
      classTeacherDept: newFacultyForm.classTeacherDept,
      classTeacherYear: newFacultyForm.classTeacherYear,
      classTeacherDivision: newFacultyForm.classTeacherDivision,
      classTeacherRoom: newFacultyForm.classTeacherRoom,
      classTeacherTotalStudents: 75,
      isGfm: newFacultyForm.isGfm,
      gfmDept: newFacultyForm.gfmDept,
      gfmDivision: newFacultyForm.gfmDivision,
      gfmStartRoll: newFacultyForm.gfmStartRoll,
      gfmEndRoll: newFacultyForm.gfmEndRoll,
      gfmCabin: newFacultyForm.gfmCabin,
      gfmCohort: `Roll #${newFacultyForm.gfmStartRoll} to #${newFacultyForm.gfmEndRoll} (${newFacultyForm.gfmDivision})`,
      theorySubjects: theoryObjs,
      practicalLabs: labObjs
    });

    // Generate credentials & password for immediate role-based login
    const creds = registerTeacherCredentials({
      staffId: added.id,
      name: added.name,
      email: added.email,
      department: added.department,
      designation: added.designation
    });

    setIsAddModalOpen(false);
    setGeneratedCredentials({
      ...creds,
      department: added.department,
      role: 'teacher'
    });

    toast?.success('Faculty Registered', `Staff ID ${added.id} created with secure login credentials!`);
    setNewFacultyForm({
      name: '',
      email: '',
      phone: '',
      cabin: 'Faculty Block B-204',
      department: 'Information Technology',
      designation: 'Assistant Professor',
      gender: 'Male',
      isClassTeacher: false,
      classTeacherDept: 'Information Technology',
      classTeacherYear: 'Year 3 (TE)',
      classTeacherDivision: 'Div A',
      classTeacherRoom: 'Room 302',
      isGfm: false,
      gfmDept: 'Information Technology',
      gfmDivision: 'Div A',
      gfmStartRoll: '101',
      gfmEndRoll: '135',
      gfmCabin: 'Counseling Cabin 104',
      gfmCohort: 'Roll #101 to #135 (Div A)',
      theorySubjects: ['IT-301'],
      practicalLabs: ['IT-301L']
    });
  };

  useEffect(() => {
    const handleUpdate = () => {
      setFacultyList(getFacultyAssignments());
    };
    window.addEventListener('edutrack_faculty_assignments_updated', handleUpdate);
    return () => window.removeEventListener('edutrack_faculty_assignments_updated', handleUpdate);
  }, []);

  const handleOpenEdit = (faculty) => {
    setEditingFaculty(faculty);
    setFormDept(faculty.department || 'Information Technology');
    setFormIsClassTeacher(Boolean(faculty.roles?.classTeacher?.assigned));
    setFormClassDiv(faculty.roles?.classTeacher?.division || 'Div A');
    setFormIsGfm(Boolean(faculty.roles?.gfm?.assigned));
    setFormGfmCohort(faculty.roles?.gfm?.cohort || 'Roll #101 to #120 (Div A)');
    setFormTheory((faculty.roles?.theorySubjects || []).map((s) => s.code));
    setFormLabs((faculty.roles?.practicalLabs || []).map((l) => l.code));
  };

  const handleSaveAllocation = () => {
    if (!editingFaculty) return;

    const updatedRoles = {
      classTeacher: {
        assigned: formIsClassTeacher,
        division: formIsClassTeacher ? formClassDiv : 'None',
        year: formIsClassTeacher ? 'Year 3 (Semester 6)' : '',
        totalStudents: formIsClassTeacher ? 42 : 0
      },
      gfm: {
        assigned: formIsGfm,
        cohort: formIsGfm ? formGfmCohort : 'None',
        menteesCount: formIsGfm ? 20 : 0
      },
      theorySubjects: formTheory.map((code) => {
        const found = AVAILABLE_THEORY_SUBJECTS.find((s) => s.code === code);
        return {
          code,
          name: found ? found.name : 'Theory Course',
          credits: 4,
          weeklyHours: 4
        };
      }),
      practicalLabs: formLabs.map((code) => {
        const found = AVAILABLE_PRACTICAL_LABS.find((l) => l.code === code);
        return {
          code,
          name: found ? found.name : 'Practical Laboratory',
          batch: 'Assigned Batch',
          labRoom: found ? found.room : 'Lab Room'
        };
      })
    };

    updateFacultyAssignment(editingFaculty.id, updatedRoles, formDept);
    setFacultyList(getFacultyAssignments());
    setEditingFaculty(null);

    if (toast?.success) {
      toast.success(
        'Faculty Allocation Updated',
        `Assigned updated subject, lab, Class Teacher, and GFM roles to ${editingFaculty.name}.`
      );
    }
  };

  const filteredFaculty = facultyList.filter((f) => {
    const matchDept = selectedDept === 'All' || f.department === selectedDept;
    const matchSearch = !searchQuery.trim() || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
      {/* Header Banner - High Contrast Clean Institutional Surface */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '22px 26px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669'
            }}
          >
            <UserCheck size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Faculty Teaching Allocation & Institutional Roles
              </h2>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #a7f3d0'
                }}
              >
                Departmental Governance Matrix
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
              Assign faculty department-wise, subject-wise (Theory), lab-wise (Practical), Class Teacher divisions, and Guardian Faculty Member (GFM) mentorship cohorts.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#475569', background: '#f8fafc', padding: '7px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: 500 }}>
            Active Term: <strong style={{ color: '#0f172a' }}>Academic Year 2026–2027</strong>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsAddModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', padding: '9px 18px', fontWeight: 700 }}
          >
            <Plus size={16} />
            <span>Register Faculty Member</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '320px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px' }}>
          <Search size={15} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search faculty name or staff ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.825rem', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Department:</span>
            <select
              className="input-field"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ width: 'auto', padding: '5px 12px', fontSize: '0.8rem' }}
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsAddModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 14px' }}
          >
            <Plus size={14} />
            <span>Register Faculty Member</span>
          </button>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
        {filteredFaculty.map((faculty) => {
          const isCt = faculty.roles?.classTeacher?.assigned;
          const isGfm = faculty.roles?.gfm?.assigned;

          return (
            <div
              key={faculty.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src={faculty.avatarUrl}
                    alt={faculty.name}
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #cbd5e1' }}
                    onError={(e) => { e.target.src = '/assets/student_avatar.jpg'; }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                      {faculty.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {faculty.id} · {faculty.department}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => handleOpenEdit(faculty)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Edit3 size={13} />
                  <span>Configure Roles</span>
                </button>
              </div>

              {/* Roles Chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: isCt ? '#eff6ff' : '#f8fafc',
                    color: isCt ? '#1d4ed8' : '#64748b',
                    border: `1px solid ${isCt ? '#bfdbfe' : '#e2e8f0'}`
                  }}
                >
                  {isCt ? `Class Teacher: ${faculty.roles.classTeacher.division}` : 'No Class Assigned'}
                </span>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: isGfm ? '#f0fdf4' : '#f8fafc',
                    color: isGfm ? '#15803d' : '#64748b',
                    border: `1px solid ${isGfm ? '#bbf7d0' : '#e2e8f0'}`
                  }}
                >
                  {isGfm ? `GFM: ${faculty.roles.gfm.cohort}` : 'No GFM Assigned'}
                </span>
              </div>

              {/* Teaching Subject Breakdown */}
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>Assigned Theory Subjects:</span>
                  <div style={{ marginTop: '2px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(faculty.roles?.theorySubjects || []).length === 0 ? (
                      <span style={{ color: '#94a3b8' }}>None allocated</span>
                    ) : (
                      faculty.roles.theorySubjects.map((s) => (
                        <span key={s.code} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, color: '#0f172a' }}>
                          {s.code}: {s.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>Assigned Practical Labs:</span>
                  <div style={{ marginTop: '2px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(faculty.roles?.practicalLabs || []).length === 0 ? (
                      <span style={{ color: '#94a3b8' }}>None allocated</span>
                    ) : (
                      faculty.roles.practicalLabs.map((l) => (
                        <span key={l.code} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, color: '#047857' }}>
                          {l.code} ({l.labRoom || 'Lab'})
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editingFaculty && (
        <div className="modal-backdrop" onClick={() => setEditingFaculty(null)} style={{ zIndex: 140 }}>
          <div
            className="modal-content-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '620px', width: '92vw', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Assign Faculty Roles & Teaching Duties
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {editingFaculty.name} ({editingFaculty.id})
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingFaculty(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.825rem' }}>
              {/* Department */}
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="input-field"
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Class Teacher Allocation */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, cursor: 'pointer', marginBottom: formIsClassTeacher ? '10px' : 0 }}>
                  <input
                    type="checkbox"
                    checked={formIsClassTeacher}
                    onChange={(e) => setFormIsClassTeacher(e.target.checked)}
                  />
                  <span>Designate as Class Teacher (Divisional Mentor)</span>
                </label>

                {formIsClassTeacher && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: '22px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>Class Division:</span>
                    <select
                      className="input-field"
                      style={{ width: 'auto', padding: '4px 10px' }}
                      value={formClassDiv}
                      onChange={(e) => setFormClassDiv(e.target.value)}
                    >
                      <option value="Div A">Year 3 - Div A</option>
                      <option value="Div B">Year 3 - Div B</option>
                      <option value="Div C">Year 3 - Div C</option>
                    </select>
                  </div>
                )}
              </div>

              {/* GFM (Guardian Faculty Member) Allocation */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, cursor: 'pointer', marginBottom: formIsGfm ? '10px' : 0 }}>
                  <input
                    type="checkbox"
                    checked={formIsGfm}
                    onChange={(e) => setFormIsGfm(e.target.checked)}
                  />
                  <span>Assign Guardian Faculty Member (GFM / Mentorship Group)</span>
                </label>

                {formIsGfm && (
                  <div style={{ marginLeft: '22px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>Mentee Student Cohort Description:</span>
                    <input
                      type="text"
                      className="input-field"
                      value={formGfmCohort}
                      onChange={(e) => setFormGfmCohort(e.target.value)}
                      placeholder="e.g. Roll #101 to #120 (Div A)"
                    />
                  </div>
                )}
              </div>

              {/* Theory Subjects */}
              <div>
                <label className="form-label">Assign Theory Subjects</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px' }}>
                  {AVAILABLE_THEORY_SUBJECTS.map((sub) => {
                    const isChecked = formTheory.includes(sub.code);
                    return (
                      <label key={sub.code} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormTheory([...formTheory, sub.code]);
                            } else {
                              setFormTheory(formTheory.filter((c) => c !== sub.code));
                            }
                          }}
                        />
                        <span><strong>{sub.code}</strong> — {sub.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Practical Labs */}
              <div>
                <label className="form-label">Assign Practical Laboratories</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px' }}>
                  {AVAILABLE_PRACTICAL_LABS.map((lab) => {
                    const isChecked = formLabs.includes(lab.code);
                    return (
                      <label key={lab.code} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormLabs([...formLabs, lab.code]);
                            } else {
                              setFormLabs(formLabs.filter((c) => c !== lab.code));
                            }
                          }}
                        />
                        <span><strong>{lab.code}</strong> — {lab.name} ({lab.room})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setEditingFaculty(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveAllocation}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={14} />
                <span>Save Teaching Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Faculty Member Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 9990,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isFullscreenModal ? '0' : '20px'
          }}
        >
          <div
            style={{
              width: isFullscreenModal ? '100vw' : '95%',
              maxWidth: isFullscreenModal ? '100vw' : '1060px',
              height: isFullscreenModal ? '100vh' : 'auto',
              maxHeight: isFullscreenModal ? '100vh' : '92vh',
              background: '#ffffff',
              border: isFullscreenModal ? 'none' : '1px solid #e2e8f0',
              borderRadius: isFullscreenModal ? '0' : '18px',
              boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              color: '#0f172a',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#ffffff',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f172a',
                    flexShrink: 0
                  }}
                >
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
                    Register Faculty Member
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Configure faculty details, mentor roles, and teaching allocations.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsFullscreenModal(!isFullscreenModal)}
                  title={isFullscreenModal ? 'Exit Full Screen' : 'Expand to Full Screen'}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    transition: 'all 0.16s ease'
                  }}
                >
                  {isFullscreenModal ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  <span>{isFullscreenModal ? 'Exit Fullscreen' : 'Full Screen'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.16s ease'
                  }}
                  title="Close Modal"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleCreateFaculty}
              style={{
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                overflowY: 'auto',
                flexGrow: 1,
                scrollbarWidth: 'thin'
              }}
            >
              {/* SECTION 1: Personal & Institutional Identity */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Building2 size={15} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                        Faculty Information
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Arvind Saxena"
                        value={newFacultyForm.name}
                        onChange={(e) => setNewFacultyForm({ ...newFacultyForm, name: e.target.value })}
                        className="apple-input"
                        style={{ paddingLeft: '34px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Institutional Email *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="email"
                        required
                        placeholder="e.g. a.saxena@edutrack.edu"
                        value={newFacultyForm.email}
                        onChange={(e) => setNewFacultyForm({ ...newFacultyForm, email: e.target.value })}
                        className="apple-input"
                        style={{ paddingLeft: '34px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Contact Phone
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="e.g. +91 98201 54321"
                        value={newFacultyForm.phone}
                        onChange={(e) => setNewFacultyForm({ ...newFacultyForm, phone: e.target.value })}
                        className="apple-input"
                        style={{ paddingLeft: '34px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Faculty Cabin / Desk Room
                    </label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="e.g. Faculty Block B-204"
                        value={newFacultyForm.cabin}
                        onChange={(e) => setNewFacultyForm({ ...newFacultyForm, cabin: e.target.value })}
                        className="apple-input"
                        style={{ paddingLeft: '34px' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Primary Department
                    </label>
                    <select
                      value={newFacultyForm.department}
                      onChange={(e) => {
                        const dept = e.target.value;
                        setNewFacultyForm({
                          ...newFacultyForm,
                          department: dept,
                          classTeacherDept: dept,
                          gfmDept: dept
                        });
                      }}
                      className="apple-input"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Designation
                    </label>
                    <select
                      value={newFacultyForm.designation}
                      onChange={(e) => setNewFacultyForm({ ...newFacultyForm, designation: e.target.value })}
                      className="apple-input"
                    >
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor & HOD">Professor & HOD</option>
                      <option value="Visiting Faculty">Visiting Faculty</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Gender
                    </label>
                    <select
                      value={newFacultyForm.gender}
                      onChange={(e) => setNewFacultyForm({ ...newFacultyForm, gender: e.target.value })}
                      className="apple-input"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Class Teacher Role (Dynamic Division by Department Intake) */}
              <div
                className={`apple-toggle-card ${newFacultyForm.isClassTeacher ? 'active' : ''}`}
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: newFacultyForm.isClassTeacher ? '1px solid #cbd5e1' : '1px solid #e2e8f0',
                  background: newFacultyForm.isClassTeacher ? '#fafbfd' : '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => setNewFacultyForm({ ...newFacultyForm, isClassTeacher: !newFacultyForm.isClassTeacher })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: newFacultyForm.isClassTeacher ? '#f1f5f9' : '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: newFacultyForm.isClassTeacher ? '#0f172a' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                          Class Teacher
                        </span>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                        Assign as primary class teacher for a specific cohort division.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={newFacultyForm.isClassTeacher}
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewFacultyForm({ ...newFacultyForm, isClassTeacher: !newFacultyForm.isClassTeacher });
                    }}
                    className={`apple-switch ${newFacultyForm.isClassTeacher ? 'active-blue' : ''}`}
                    title="Toggle Class Teacher Duty"
                  >
                    <span className="apple-switch-handle" />
                  </button>
                </div>

                {newFacultyForm.isClassTeacher && (() => {
                  const targetDeptData = getDepartmentIntakes().find((d) => d.name === newFacultyForm.classTeacherDept || d.code === newFacultyForm.classTeacherDept) || getDepartmentIntakes()[0];
                  const divisions = calculateDivisionsForIntake(targetDeptData?.intake || 120);

                  return (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '12px',
                        marginTop: '14px',
                        padding: '16px',
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Target Department</label>
                        <select
                          value={newFacultyForm.classTeacherDept}
                          onChange={(e) => {
                            const newDept = e.target.value;
                            const dData = getDepartmentIntakes().find((d) => d.name === newDept || d.code === newDept) || getDepartmentIntakes()[0];
                            const divs = calculateDivisionsForIntake(dData.intake);
                            setNewFacultyForm({
                              ...newFacultyForm,
                              classTeacherDept: newDept,
                              classTeacherDivision: `Div ${divs[0].division}`
                            });
                          }}
                          className="apple-input"
                          style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                        >
                          {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Academic Year</label>
                        <select
                          value={newFacultyForm.classTeacherYear}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, classTeacherYear: e.target.value })}
                          className="apple-input"
                          style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                        >
                          <option value="Year 1 (FE)">Year 1 (FE - Sem 1/2)</option>
                          <option value="Year 2 (SE)">Year 2 (SE - Sem 3/4)</option>
                          <option value="Year 3 (TE)">Year 3 (TE - Sem 5/6)</option>
                          <option value="Year 4 (BE)">Year 4 (BE - Sem 7/8)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>
                          Division (Intake: {targetDeptData?.intake || 120})
                        </label>
                        <select
                          value={newFacultyForm.classTeacherDivision}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, classTeacherDivision: e.target.value })}
                          className="apple-input"
                          style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                        >
                          {divisions.map((div) => (
                            <option key={div.division} value={`Div ${div.division}`}>
                              Div {div.division} ({div.count} Students, Roll {div.startRoll}–{div.endRoll})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Classroom / Hall</label>
                        <input
                          type="text"
                          value={newFacultyForm.classTeacherRoom}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, classTeacherRoom: e.target.value })}
                          placeholder="e.g. Room 302"
                          className="apple-input"
                          style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* SECTION 3: Guardian Faculty Member (GFM) Role */}
              <div
                className={`apple-toggle-card ${newFacultyForm.isGfm ? 'active' : ''}`}
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: newFacultyForm.isGfm ? '1px solid #cbd5e1' : '1px solid #e2e8f0',
                  background: newFacultyForm.isGfm ? '#fafbfd' : '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => setNewFacultyForm({ ...newFacultyForm, isGfm: !newFacultyForm.isGfm })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: newFacultyForm.isGfm ? '#f1f5f9' : '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: newFacultyForm.isGfm ? '#0f172a' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                          Guardian Faculty Member (GFM)
                        </span>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                        Assign a cohort roll number range for student mentorship.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={newFacultyForm.isGfm}
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewFacultyForm({ ...newFacultyForm, isGfm: !newFacultyForm.isGfm });
                    }}
                    className={`apple-switch ${newFacultyForm.isGfm ? 'active-purple' : ''}`}
                    title="Toggle GFM Mentorship Duty"
                  >
                    <span className="apple-switch-handle" />
                  </button>
                </div>

                {newFacultyForm.isGfm && (() => {
                  const targetDeptData = getDepartmentIntakes().find((d) => d.name === newFacultyForm.gfmDept || d.code === newFacultyForm.gfmDept) || getDepartmentIntakes()[0];
                  const divisions = calculateDivisionsForIntake(targetDeptData?.intake || 120);

                  return (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr',
                        gap: '10px',
                        marginTop: '14px',
                        padding: '16px',
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Mentee Department</label>
                        <select
                          value={newFacultyForm.gfmDept}
                          onChange={(e) => {
                            const newDept = e.target.value;
                            const dData = getDepartmentIntakes().find((d) => d.name === newDept || d.code === newDept) || getDepartmentIntakes()[0];
                            const divs = calculateDivisionsForIntake(dData.intake);
                            setNewFacultyForm({
                              ...newFacultyForm,
                              gfmDept: newDept,
                              gfmDivision: `Div ${divs[0].division}`,
                              gfmStartRoll: divs[0].startRoll,
                              gfmEndRoll: Math.min(divs[0].startRoll + 24, divs[0].endRoll)
                            });
                          }}
                          className="apple-input"
                          style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                        >
                          {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Division</label>
                        <select
                          value={newFacultyForm.gfmDivision}
                          onChange={(e) => {
                            const divLetter = e.target.value;
                            const matched = divisions.find((d) => `Div ${d.division}` === divLetter);
                            setNewFacultyForm({
                              ...newFacultyForm,
                              gfmDivision: divLetter,
                              gfmStartRoll: matched ? matched.startRoll : newFacultyForm.gfmStartRoll,
                              gfmEndRoll: matched ? Math.min(matched.startRoll + 24, matched.endRoll) : newFacultyForm.gfmEndRoll
                            });
                          }}
                          className="apple-input"
                          style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                        >
                          {divisions.map((div) => (
                            <option key={div.division} value={`Div ${div.division}`}>
                              Div {div.division} (Roll {div.startRoll}–{div.endRoll})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Start Roll</label>
                        <input
                          type="number"
                          value={newFacultyForm.gfmStartRoll}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, gfmStartRoll: e.target.value })}
                          className="apple-input"
                          style={{ padding: '7px 10px', fontSize: '0.8rem', fontWeight: 600 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>End Roll</label>
                        <input
                          type="number"
                          value={newFacultyForm.gfmEndRoll}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, gfmEndRoll: e.target.value })}
                          className="apple-input"
                          style={{ padding: '7px 10px', fontSize: '0.8rem', fontWeight: 600 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Cabin / Office</label>
                        <input
                          type="text"
                          value={newFacultyForm.gfmCabin}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, gfmCabin: e.target.value })}
                          placeholder="Cabin 104"
                          className="apple-input"
                          style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* SECTION 4: Subject Allocation (Theory & Practical Labs) */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px 22px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <BookOpen size={15} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                        Teaching Allocations
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        background: '#f8fafc',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      {newFacultyForm.theorySubjects.length} Theory
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        background: '#f8fafc',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      {newFacultyForm.practicalLabs.length} Lab
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Theory Subjects */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Theory Subjects
                    </label>
                    <div className="apple-list-box" style={{ maxHeight: '220px' }}>
                      {AVAILABLE_THEORY_SUBJECTS.map((sub) => {
                        const checked = newFacultyForm.theorySubjects.includes(sub.code);
                        return (
                          <div
                            key={sub.code}
                            onClick={() => {
                              if (checked) {
                                setNewFacultyForm({
                                  ...newFacultyForm,
                                  theorySubjects: newFacultyForm.theorySubjects.filter((c) => c !== sub.code)
                                });
                              } else {
                                setNewFacultyForm({
                                  ...newFacultyForm,
                                  theorySubjects: [...newFacultyForm.theorySubjects, sub.code]
                                });
                              }
                            }}
                            className={`apple-subject-row ${checked ? 'selected-theory' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              style={{ width: '16px', height: '16px', accentColor: '#0f172a', cursor: 'pointer' }}
                            />
                            <div style={{ fontSize: '0.78rem', flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, color: '#0f172a' }}>{sub.code}</span>
                                <span style={{ fontSize: '0.68rem', color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>{sub.dept}</span>
                              </div>
                              <div style={{ color: '#475569', fontWeight: 500, fontSize: '0.74rem', marginTop: '1px' }}>{sub.name}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Practical Labs */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Practical Laboratories
                    </label>
                    <div className="apple-list-box" style={{ maxHeight: '220px' }}>
                      {AVAILABLE_PRACTICAL_LABS.map((lab) => {
                        const checked = newFacultyForm.practicalLabs.includes(lab.code);
                        return (
                          <div
                            key={lab.code}
                            onClick={() => {
                              if (checked) {
                                setNewFacultyForm({
                                  ...newFacultyForm,
                                  practicalLabs: newFacultyForm.practicalLabs.filter((c) => c !== lab.code)
                                });
                              } else {
                                setNewFacultyForm({
                                  ...newFacultyForm,
                                  practicalLabs: [...newFacultyForm.practicalLabs, lab.code]
                                });
                              }
                            }}
                            className={`apple-subject-row ${checked ? 'selected-lab' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              style={{ width: '16px', height: '16px', accentColor: '#0f172a', cursor: 'pointer' }}
                            />
                            <div style={{ fontSize: '0.78rem', flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, color: '#0f172a' }}>{lab.code}</span>
                                <span style={{ fontSize: '0.68rem', color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>{lab.room}</span>
                              </div>
                              <div style={{ color: '#475569', fontWeight: 500, fontSize: '0.74rem', marginTop: '1px' }}>{lab.name}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '16px',
                  marginTop: '4px'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} style={{ color: '#2d6a4f' }} />
                  <span>Institutional login credentials will be generated automatically.</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#475569',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.16s ease'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#0f172a',
                      border: 'none',
                      color: '#ffffff',
                      padding: '8px 20px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.16s ease'
                    }}
                  >
                    <Plus size={15} />
                    <span>Save Faculty</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Credentials Slip Modal */}
      <CredentialsSlipModal
        isOpen={Boolean(generatedCredentials)}
        onClose={() => setGeneratedCredentials(null)}
        credentials={generatedCredentials}
      />
    </div>
  );
}
