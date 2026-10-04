import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  X,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Layers,
  Percent,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Award,
  Sparkles,
  Lock,
  Hash,
  ShieldAlert,
  Users
} from 'lucide-react';
import {
  calculateDivisionsForIntake,
  getDepartmentIntakes,
  getNextRollNumberForDivision,
  getDivisionSpec,
  AVAILABLE_DEPARTMENTS,
  AVAILABLE_YEARS
} from '../lib/departmentIntakeHelper';
import studentService from '../services/studentService';

export default function StudentForm({ initialData = null, onSubmit, onCancel }) {
  const isEditMode = Boolean(initialData);
  const [existingStudents, setExistingStudents] = useState([]);

  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    course: 'IT',
    year: '3',
    division: 'A',
    semester: 'Semester 6',
    guardianName: '',
    guardianPhone: '',
    gfmName: 'Prof. Krrish Sharma',
    percentage: '',
    attendancePercentage: '85.0',
    labAttendance: '90.0',
    condonationGranted: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        const list = await studentService.getAll();
        setExistingStudents(list);
        if (!initialData) {
          const next = getNextRollNumberForDivision(list, 'IT', 'A');
          setFormData((prev) => ({ ...prev, rollNumber: String(next) }));
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      }
    }
    loadData();
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        rollNumber: String(initialData.rollNumber),
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        gender: initialData.gender || (initialData.name?.toLowerCase().includes('ananya') || initialData.name?.toLowerCase().includes('sneha') ? 'Female' : 'Male'),
        course: (initialData.course || 'IT').toUpperCase(),
        year: String(initialData.year || '3'),
        division: initialData.division || 'A',
        semester: initialData.semester || 'Semester 6',
        guardianName: initialData.guardianName || 'Dr. S. Sharma',
        guardianPhone: initialData.guardianPhone || '9820011223',
        gfmName: initialData.gfmName || 'Prof. Krrish Sharma',
        percentage: String(initialData.percentage || ''),
        attendancePercentage: String(initialData.attendancePercentage || initialData.attendance || '85.0'),
        labAttendance: String(initialData.labAttendance || '90.0'),
        condonationGranted: Boolean(initialData.condonationGranted)
      });
    }
  }, [initialData]);

  // Compute dynamic divisions for the selected course
  const currentDeptIntakes = getDepartmentIntakes();
  const selectedDeptData = currentDeptIntakes.find(
    (d) => d.code.toUpperCase() === formData.course.toUpperCase()
  ) || currentDeptIntakes[0];
  const activeDivisions = calculateDivisionsForIntake(selectedDeptData?.intake || 120);
  const activeDivSpec = getDivisionSpec(formData.course, formData.division);

  // Filter students enrolled in the exact same cohort (Year, Dept, Division)
  const cohortStudents = useMemo(() => {
    return existingStudents
      .filter((s) =>
        (s.course || '').toUpperCase() === (formData.course || '').toUpperCase() &&
        String(s.year || '1') === String(formData.year || '1') &&
        String(s.division || 'A').toUpperCase() === String(formData.division || 'A').toUpperCase()
      )
      .sort((a, b) => (Number(a.rollNumber) || 0) - (Number(b.rollNumber) || 0));
  }, [existingStudents, formData.course, formData.year, formData.division]);

  // Previous student in this cohort
  const previousStudent = cohortStudents.length > 0 ? cohortStudents[cohortStudents.length - 1] : null;

  // Auto-calculated next sequential roll number based on previous student or intake division start
  const recommendedNextRoll = previousStudent
    ? Number(previousStudent.rollNumber) + 1
    : (activeDivSpec?.startRoll || 101);

  // Duplicate roll number check in existing database
  const isDuplicateRoll = !isEditMode && Boolean(formData.rollNumber) && existingStudents.some((s) => Number(s.rollNumber) === Number(formData.rollNumber));
  const duplicateStudent = isDuplicateRoll ? existingStudents.find((s) => Number(s.rollNumber) === Number(formData.rollNumber)) : null;

  const handleAutoAssignRoll = () => {
    setFormData((prev) => ({ ...prev, rollNumber: String(recommendedNextRoll) }));
    if (errors.rollNumber) {
      setErrors((prev) => ({ ...prev, rollNumber: null }));
    }
  };

  const handleAdjustRoll = (delta) => {
    const current = Number(formData.rollNumber) || recommendedNextRoll;
    const updated = Math.max(1, current + delta);
    setFormData((prev) => ({ ...prev, rollNumber: String(updated) }));
    if (errors.rollNumber) {
      setErrors((prev) => ({ ...prev, rollNumber: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.rollNumber || isNaN(formData.rollNumber) || Number(formData.rollNumber) <= 0) {
      newErrors.rollNumber = 'Enter a valid positive roll number.';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Phone number must contain 10 digits.';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Department is required.';
    }

    const pct = parseFloat(formData.percentage);
    if (formData.percentage === '' || isNaN(pct) || pct < 0 || pct > 100) {
      newErrors.percentage = 'Academic score must be between 0.0 and 100.0%.';
    }

    const att = parseFloat(formData.attendancePercentage);
    if (formData.attendancePercentage !== '' && (isNaN(att) || att < 0 || att > 100)) {
      newErrors.attendancePercentage = 'Attendance must be between 0 and 100%.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        rollNumber: Number(formData.rollNumber),
        year: Number(formData.year),
        percentage: parseFloat(formData.percentage),
        attendancePercentage: parseFloat(formData.attendancePercentage || 85),
        labAttendance: parseFloat(formData.labAttendance || 90)
      });
    }
  };

  const avatarSrc = formData.gender === 'Female' ? '/assets/female_student_avatar.jpg' : '/assets/student_avatar.jpg';

  return (
    <form className="student-edit-form-card" onSubmit={handleSubmit} noValidate>
      {/* Top Banner / Avatar Lockup */}
      <div className="form-card-header">
        <div className="form-card-avatar-wrap">
          <img src={avatarSrc} alt={formData.name || 'Student'} className="form-card-avatar-img" />
          <span className="form-avatar-gender-tag">{formData.gender === 'Female' ? '👩‍🎓' : '👨‍🎓'}</span>
        </div>
        <div>
          <h3 className="form-card-title">
            {isEditMode ? `Edit Student: ${formData.name || 'Candidate'}` : 'Register New Student Profile'}
          </h3>
          <p className="form-card-sub">
            {isEditMode
              ? `Manage registry credentials, attendance status, and cohort for Roll #${formData.rollNumber}`
              : 'Add an enrolled student to EduTrack database with institutional credentials'}
          </p>
        </div>
      </div>

      <div className="form-sections-stack">
        {/* Section 1: Personal & Contact */}
        <div className="form-section-box">
          <div className="form-section-header">
            <User size={16} color="#2563eb" />
            <span>Personal & Communication Details</span>
          </div>

          <div className="form-inputs-grid">
            {/* Roll Number with Auto-Increment & Previous Student Cohort Tracking */}
            <div className="form-input-group" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" htmlFor="rollNumber" style={{ margin: 0, fontWeight: 700 }}>
                  Roll Number * {isEditMode && <span className="locked-badge"><Lock size={10} /> Locked in Edit Mode</span>}
                </label>
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={handleAutoAssignRoll}
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1d4ed8',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Sparkles size={12} />
                    Auto-Assign Next Roll (#{recommendedNextRoll})
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleAdjustRoll(-1)}
                    title="Decrement Roll Number"
                    style={{
                      padding: '8px 12px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontWeight: 800,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    –
                  </button>
                )}

                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="number"
                  disabled={isEditMode}
                  placeholder={`e.g. ${recommendedNextRoll}`}
                  className={`form-modern-input ${isEditMode ? 'disabled' : ''}`}
                  value={formData.rollNumber}
                  onChange={handleChange}
                  style={{
                    flex: 1,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: isDuplicateRoll ? '#dc2626' : '#0f172a',
                    borderColor: isDuplicateRoll ? '#f87171' : undefined
                  }}
                />

                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleAdjustRoll(1)}
                    title="Increment Roll Number"
                    style={{
                      padding: '8px 12px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontWeight: 800,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                )}
              </div>

              {/* Cohort Previous Student & Auto-Increment Context Box */}
              <div style={{
                marginTop: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                background: isDuplicateRoll ? '#fef2f2' : '#f8fafc',
                border: isDuplicateRoll ? '1px solid #fecaca' : '1px solid #e2e8f0',
                fontSize: '0.76rem',
                lineHeight: '1.4'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#334155' }}>
                    📍 Cohort: Year {formData.year} • {formData.course} • Division {formData.division}
                  </span>
                  <span style={{ color: '#64748b' }}>
                    Division Range: <strong>{activeDivSpec.startRoll} to {activeDivSpec.endRoll}</strong>
                  </span>
                </div>

                {previousStudent ? (
                  <div style={{ color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span>⏮️ <strong>Previous Student in Cohort:</strong> Roll #{previousStudent.rollNumber} ({previousStudent.name})</span>
                    <span>➔ Auto-recommendation: <strong>#{recommendedNextRoll}</strong></span>
                  </div>
                ) : (
                  <div style={{ color: '#047857', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span>✨ <strong>First Student in this Cohort:</strong> Starts at Division Roll <strong>#{recommendedNextRoll}</strong></span>
                  </div>
                )}

                {isDuplicateRoll && duplicateStudent && (
                  <div style={{ color: '#b91c1c', fontWeight: 700, marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertCircle size={13} />
                    <span>Warning: Roll #{formData.rollNumber} is already assigned to {duplicateStudent.name} ({duplicateStudent.course} Div {duplicateStudent.division}).</span>
                  </div>
                )}
              </div>

              {errors.rollNumber && <span className="form-error-msg">{errors.rollNumber}</span>}
            </div>

            {/* Name */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Ananya Verma"
                className="form-modern-input"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="form-error-msg">{errors.name}</span>}
            </div>

            {/* Gender Picker */}
            <div className="form-input-group">
              <label className="form-label">Candidate Gender</label>
              <div className="gender-toggle-row">
                <button
                  type="button"
                  className={`gender-chip ${formData.gender === 'Male' ? 'active' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, gender: 'Male' }))}
                >
                  <span>👨‍🎓 Male Student</span>
                </button>
                <button
                  type="button"
                  className={`gender-chip female ${formData.gender === 'Female' ? 'active' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, gender: 'Female' }))}
                >
                  <span>👩‍🎓 Female Student</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. student@edutrack.edu"
                className="form-modern-input"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="form-error-msg">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="phone">Phone Number (10 Digits) *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                maxLength={10}
                placeholder="e.g. 9876543210"
                className="form-modern-input"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
            </div>

            {/* Parent / Guardian Name */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="guardianName">Parent / Guardian Name</label>
              <input
                id="guardianName"
                name="guardianName"
                type="text"
                placeholder="e.g. Dr. S. Sharma"
                className="form-modern-input"
                value={formData.guardianName}
                onChange={handleChange}
              />
            </div>

            {/* Parent / Guardian Phone */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="guardianPhone">Parent / Guardian Phone</label>
              <input
                id="guardianPhone"
                name="guardianPhone"
                type="tel"
                maxLength={10}
                placeholder="e.g. 9820011223"
                className="form-modern-input"
                value={formData.guardianPhone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Program & Cohort */}
        <div className="form-section-box">
          <div className="form-section-header">
            <Building2 size={16} color="#059669" />
            <span>Academic Program, Dynamic Intake Divisions & Cohort</span>
          </div>

          <div className="form-inputs-grid">
            {/* Department */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="course">
                Department / Program (Intake Capacity)
              </label>
              <select
                id="course"
                name="course"
                className="form-modern-select"
                value={formData.course}
                onChange={(e) => {
                  const newDept = e.target.value;
                  const dData = currentDeptIntakes.find((d) => d.code === newDept) || currentDeptIntakes[0];
                  const divs = calculateDivisionsForIntake(dData.intake);
                  const firstDiv = divs[0].division;
                  const nextRoll = isEditMode
                    ? formData.rollNumber
                    : getNextRollNumberForDivision(existingStudents, newDept, firstDiv);

                  setFormData((prev) => ({
                    ...prev,
                    course: newDept,
                    division: firstDiv,
                    rollNumber: String(nextRoll)
                  }));
                }}
              >
                {AVAILABLE_DEPARTMENTS.map((dept) => {
                  const dInfo = currentDeptIntakes.find((d) => d.code === dept.code);
                  return (
                    <option key={dept.code} value={dept.code}>
                      {dept.name} ({dept.code}) — Intake: {dInfo?.intake || 120} Seats
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Year of Study */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="year">Year of Study</label>
              <select
                id="year"
                name="year"
                className="form-modern-select"
                value={formData.year}
                onChange={(e) => {
                  const yr = e.target.value;
                  const defaultSem = yr === '1' ? 'Semester 1' : yr === '2' ? 'Semester 3' : yr === '3' ? 'Semester 5' : 'Semester 7';
                  const nextRoll = isEditMode
                    ? formData.rollNumber
                    : getNextRollNumberForDivision(existingStudents, formData.course, formData.division);
                  setFormData((prev) => ({
                    ...prev,
                    year: yr,
                    semester: defaultSem,
                    rollNumber: isEditMode ? prev.rollNumber : String(nextRoll)
                  }));
                }}
              >
                <option value="1">1st Year (FE) · First Year Engineering</option>
                <option value="2">2nd Year (SE) · Second Year Engineering</option>
                <option value="3">3rd Year (TE) · Third Year Engineering</option>
                <option value="4">4th Year (BE) · Final Year Engineering</option>
              </select>
            </div>

            {/* Semester */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="semester">Academic Semester</label>
              <select
                id="semester"
                name="semester"
                className="form-modern-select"
                value={formData.semester}
                onChange={handleChange}
              >
                {formData.year === '1' && (
                  <>
                    <option value="Semester 1">Semester 1 (Autumn)</option>
                    <option value="Semester 2">Semester 2 (Spring)</option>
                  </>
                )}
                {formData.year === '2' && (
                  <>
                    <option value="Semester 3">Semester 3 (Autumn)</option>
                    <option value="Semester 4">Semester 4 (Spring)</option>
                  </>
                )}
                {formData.year === '3' && (
                  <>
                    <option value="Semester 5">Semester 5 (Autumn)</option>
                    <option value="Semester 6">Semester 6 (Spring)</option>
                  </>
                )}
                {formData.year === '4' && (
                  <>
                    <option value="Semester 7">Semester 7 (Autumn)</option>
                    <option value="Semester 8">Semester 8 (Spring)</option>
                  </>
                )}
              </select>
            </div>

            {/* Division (Intake Scaled) */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="division">
                Division (Scaled by {selectedDeptData?.name} Intake: {selectedDeptData?.intake})
              </label>
              <select
                id="division"
                name="division"
                className="form-modern-select"
                value={formData.division}
                onChange={(e) => {
                  const div = e.target.value;
                  const nextRoll = isEditMode
                    ? formData.rollNumber
                    : getNextRollNumberForDivision(existingStudents, formData.course, div);
                  setFormData((prev) => ({
                    ...prev,
                    division: div,
                    rollNumber: String(nextRoll)
                  }));
                }}
              >
                {activeDivisions.map((d) => (
                  <option key={d.division} value={d.division}>
                    Division {d.division} (Roll {d.startRoll}–{d.endRoll}) · {d.count} Students Capacity
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned GFM */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="gfmName">Guardian Faculty Member (GFM / Mentor)</label>
              <input
                id="gfmName"
                name="gfmName"
                type="text"
                placeholder="e.g. Prof. Krrish Sharma"
                className="form-modern-input"
                value={formData.gfmName}
                onChange={handleChange}
              />
            </div>

            {/* Percentage */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="percentage">Overall Academic Score (%) *</label>
              <input
                id="percentage"
                name="percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g. 88.50"
                className="form-modern-input"
                value={formData.percentage}
                onChange={handleChange}
              />
              {errors.percentage && <span className="form-error-msg">{errors.percentage}</span>}
            </div>
          </div>
        </div>

        {/* Section 3: Attendance, Practical Labs & Clearance Controls */}
        <div className="form-section-box">
          <div className="form-section-header">
            <FlaskConical size={16} color="#7c3aed" />
            <span>Attendance & Laboratory Clearance Control (Admin Managed)</span>
          </div>

          <div className="form-inputs-grid">
            {/* Overall Attendance */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="attendancePercentage">
                Overall Attendance (%) — Criteria &ge; 75%
              </label>
              <input
                id="attendancePercentage"
                name="attendancePercentage"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 89.5"
                className="form-modern-input"
                value={formData.attendancePercentage}
                onChange={handleChange}
              />
              <span className="field-hint-text">
                {parseFloat(formData.attendancePercentage || 0) >= 75
                  ? '✓ Meets mandatory 75% institutional criteria'
                  : '⚠️ Defaulter: Below 75% requirement'}
              </span>
              {errors.attendancePercentage && <span className="form-error-msg">{errors.attendancePercentage}</span>}
            </div>

            {/* Practical Lab Attendance */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="labAttendance">
                Practical Lab Attendance (%)
              </label>
              <input
                id="labAttendance"
                name="labAttendance"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 94.0"
                className="form-modern-input"
                value={formData.labAttendance}
                onChange={handleChange}
              />
              <span className="field-hint-text">Hands-on laboratory sessions and practical performance</span>
            </div>

            {/* Condonation Exemption */}
            <div className="form-input-group full">
              <label className="condonation-checkbox-label">
                <input
                  type="checkbox"
                  name="condonationGranted"
                  checked={formData.condonationGranted}
                  onChange={handleChange}
                  className="modern-checkbox"
                />
                <div>
                  <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>
                    Grant Authorized Medical / Sports Condonation
                  </strong>
                  <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                    Waives the 75% attendance gatekeeper hold and unlocks Hall Ticket for official examinations.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Form Bottom Action Bar */}
      <div className="form-footer-actions">
        {onCancel && (
          <button type="button" className="btn-form-cancel" onClick={onCancel}>
            <X size={16} />
            <span>Cancel</span>
          </button>
        )}
        <button type="submit" className="btn-form-submit">
          <Save size={16} />
          <span>{isEditMode ? 'Update Student Record' : 'Save & Register Student'}</span>
        </button>
      </div>
    </form>
  );
}
