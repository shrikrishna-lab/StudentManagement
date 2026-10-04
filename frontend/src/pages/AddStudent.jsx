import React, { useState, useEffect } from 'react';
import StudentForm from '../components/StudentForm';
import {
  Users,
  UserPlus,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import {
  calculateDivisionsForIntake,
  getDepartmentIntakes,
  getNextRollNumberForDivision,
  AVAILABLE_DEPARTMENTS,
  AVAILABLE_YEARS
} from '../lib/departmentIntakeHelper';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';

export default function AddStudent({ initialData, onSubmit, onCancel }) {
  const toast = useToast();
  const isEdit = Boolean(initialData);
  const [activeMode, setActiveMode] = useState('single'); // 'single' | 'bulk'

  // Bulk Generator State
  const [bulkDept, setBulkDept] = useState('IT');
  const [bulkYear, setBulkYear] = useState(3);
  const [bulkDivision, setBulkDivision] = useState('A');
  const [bulkSemester, setBulkSemester] = useState('Semester 6');
  const [generateCount, setGenerateCount] = useState(5);
  const [generatedCohort, setGeneratedCohort] = useState([]);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState(null);

  const deptIntakes = getDepartmentIntakes();
  const currentDeptObj = deptIntakes.find((d) => d.code === bulkDept) || deptIntakes[0];
  const dynamicDivisions = calculateDivisionsForIntake(currentDeptObj?.intake || 120);

  // Generate preview cohort roster
  const handleGeneratePreview = async () => {
    try {
      const allStudents = await studentService.getAll();
      const startRoll = getNextRollNumberForDivision(allStudents, bulkDept, bulkDivision);
      const sampleFirstNames = [
        'Aarav', 'Ananya', 'Rohan', 'Sneha', 'Kabir', 'Ishita', 'Aditya', 'Pooja', 'Vikram', 'Tanvi',
        'Kunal', 'Rhea', 'Manish', 'Neha', 'Siddharth', 'Divya', 'Gaurav', 'Shreya', 'Dev', 'Tara'
      ];
      const sampleLastNames = [
        'Sharma', 'Verma', 'Patel', 'Iyer', 'Deshmukh', 'Mehta', 'Kulkarni', 'Joshi', 'Chopra', 'Nair',
        'Rao', 'Bansal', 'Gupta', 'Bhatia', 'Malhotra', 'Kapoor', 'Saxena', 'Pandey', 'Mishra', 'Reddy'
      ];

      const newBatch = [];
      for (let i = 0; i < generateCount; i++) {
        const rollNum = startRoll + i;
        const firstName = sampleFirstNames[(startRoll + i) % sampleFirstNames.length];
        const lastName = sampleLastNames[(startRoll + i * 3) % sampleLastNames.length];
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${rollNum}@edutrack.edu`;
        const phone = `98${String(10000000 + (startRoll + i) * 37).slice(0, 8)}`;
        const gender = ['Ananya', 'Sneha', 'Ishita', 'Pooja', 'Tanvi', 'Rhea', 'Neha', 'Divya', 'Shreya', 'Tara'].includes(firstName) ? 'Female' : 'Male';
        const percentage = Number((72 + ((startRoll + i * 7) % 24) + 0.5).toFixed(2));

        newBatch.push({
          rollNumber: rollNum,
          name: fullName,
          email,
          phone,
          gender,
          course: bulkDept,
          year: bulkYear,
          division: bulkDivision,
          semester: bulkSemester,
          percentage,
          attendancePercentage: 85.0,
          labAttendance: 90.0,
          feeTotal: 85000,
          feePaid: 85000,
          admissionYear: 2024,
          prn: `RBT24${bulkDept}${String(rollNum).padStart(3, '0')}`
        });
      }

      setGeneratedCohort(newBatch);
      setBulkSuccessMessage(null);
    } catch (e) {
      console.error(e);
      toast?.error('Generation Failed', 'Could not generate student cohort preview.');
    }
  };

  const handleCommitBulk = async () => {
    if (generatedCohort.length === 0) return;
    setIsSubmittingBulk(true);
    try {
      const result = await studentService.bulkAdd(generatedCohort);
      setIsSubmittingBulk(false);
      setBulkSuccessMessage(`Successfully enrolled ${result.added.length} students into ${bulkDept} Div ${bulkDivision}!`);
      toast?.success('Cohort Enrolled', `${result.added.length} students added with sequential roll numbers.`);
      setGeneratedCohort([]);
      if (onSubmit) {
        onSubmit(result.added[0]);
      }
    } catch (e) {
      setIsSubmittingBulk(false);
      toast?.error('Enrollment Error', e.message || 'Failed to enroll bulk cohort.');
    }
  };

  return (
    <div style={{ maxWidth: '940px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Student Record' : 'Student Enrollment & Cohort Registration'}</h1>
          <p className="page-subtitle">
            {isEdit
              ? `Update academic details, department cohort, and attendance status for Roll #${initialData.rollNumber}`
              : 'Add individual students or auto-generate sequential intake cohorts scaled by department capacity.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      {!isEdit && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            background: '#f1f5f9',
            padding: '6px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            width: 'fit-content'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMode('single')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeMode === 'single' ? '#ffffff' : 'transparent',
              color: activeMode === 'single' ? '#1e293b' : '#64748b',
              boxShadow: activeMode === 'single' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <UserPlus size={16} color={activeMode === 'single' ? '#2563eb' : '#64748b'} />
            <span>Single Student Form</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('bulk');
              if (generatedCohort.length === 0) {
                handleGeneratePreview();
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeMode === 'bulk' ? '#ffffff' : 'transparent',
              color: activeMode === 'bulk' ? '#1e293b' : '#64748b',
              boxShadow: activeMode === 'bulk' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={16} color={activeMode === 'bulk' ? '#059669' : '#64748b'} />
            <span>Intake Cohort Auto-Generator</span>
          </button>
        </div>
      )}

      {/* Mode 1: Single Student Form */}
      {activeMode === 'single' || isEdit ? (
        <StudentForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ) : (
        /* Mode 2: Bulk Intake Cohort Generator */
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                Department Intake Cohort Generator
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Auto-generates sequential roll numbers starting from 101 or the next available roll in the division.
              </p>
            </div>
            <span style={{ fontSize: '0.78rem', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, border: '1px solid #a7f3d0' }}>
              ✓ Intake Distribution Compliant
            </span>
          </div>

          {/* Config Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Department (Intake)
              </label>
              <select
                value={bulkDept}
                onChange={(e) => {
                  setBulkDept(e.target.value);
                  setGeneratedCohort([]);
                }}
                className="form-modern-select"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                {AVAILABLE_DEPARTMENTS.map((d) => {
                  const info = deptIntakes.find((di) => di.code === d.code);
                  return (
                    <option key={d.code} value={d.code}>
                      {d.name} ({d.code}) — {info?.intake || 120} Seats
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Division (Capacity Range)
              </label>
              <select
                value={bulkDivision}
                onChange={(e) => {
                  setBulkDivision(e.target.value);
                  setGeneratedCohort([]);
                }}
                className="form-modern-select"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                {dynamicDivisions.map((div) => (
                  <option key={div.division} value={div.division}>
                    Div {div.division} ({div.count} Students, Roll {div.startRoll}–{div.endRoll})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Year of Study
              </label>
              <select
                value={bulkYear}
                onChange={(e) => {
                  const yr = Number(e.target.value);
                  setBulkYear(yr);
                  setBulkSemester(yr === 1 ? 'Semester 1' : yr === 2 ? 'Semester 3' : yr === 3 ? 'Semester 6' : 'Semester 7');
                  setGeneratedCohort([]);
                }}
                className="form-modern-select"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value={1}>1st Year (FE)</option>
                <option value={2}>2nd Year (SE)</option>
                <option value={3}>3rd Year (TE)</option>
                <option value={4}>4th Year (BE)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Batch Size (Count)
              </label>
              <select
                value={generateCount}
                onChange={(e) => {
                  setGenerateCount(Number(e.target.value));
                  setGeneratedCohort([]);
                }}
                className="form-modern-select"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value={3}>3 Students (Quick Test)</option>
                <option value={5}>5 Students</option>
                <option value={10}>10 Students</option>
                <option value={20}>20 Students</option>
                <option value={35}>35 Students (Half Division)</option>
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={handleGeneratePreview}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} />
              <span>Generate / Re-Roll Cohort Roster</span>
            </button>

            {generatedCohort.length > 0 && (
              <button
                type="button"
                onClick={handleCommitBulk}
                disabled={isSubmittingBulk}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  border: 'none',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                }}
              >
                <CheckCircle2 size={16} />
                <span>Enroll & Create Credentials for {generatedCohort.length} Students</span>
              </button>
            )}
          </div>

          {bulkSuccessMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', marginBottom: '16px' }}>
              <CheckCircle2 size={18} color="#059669" />
              <span>{bulkSuccessMessage}</span>
            </div>
          )}

          {/* Generated Roster Preview Table */}
          {generatedCohort.length > 0 && (
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Roll #</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>PRN</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Full Name</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Email</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Dept / Div</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Score (%)</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedCohort.map((student, idx) => (
                    <tr key={student.rollNumber} style={{ borderBottom: idx < generatedCohort.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#2563eb' }}>
                        #{student.rollNumber}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#64748b', fontFamily: 'monospace' }}>
                        {student.prn}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>
                        {student.name}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>
                        {student.email}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {student.course} - Div {student.division}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                        {student.percentage}%
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', fontWeight: 600 }}>
                          <CheckCircle2 size={12} /> Ready
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
