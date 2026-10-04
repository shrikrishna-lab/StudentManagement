import React, { useState, useMemo } from 'react';
import {
  Hash,
  Sparkles,
  RefreshCw,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Edit3,
  Copy,
  Check,
  Search,
  Filter,
  Save,
  Download
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import {
  generatePRN,
  batchGenerateStudentPRNs,
  printPRNEnrolmentRegister,
  INSTITUTION_PREFIX,
  DEPARTMENTS_CONFIG,
  DIVISION_ROLL_SCHEMES
} from '../../lib/prnGeneratorHelper';

export default function AdminPRNGenerator({ students = [], onUpdateStudents }) {
  const { toast } = useToast();

  const [prefix, setPrefix] = useState(INSTITUTION_PREFIX);
  const [admissionYear, setAdmissionYear] = useState('2024');
  const [deptFilter, setDeptFilter] = useState('All');
  const [divFilter, setDivFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPrn, setCopiedPrn] = useState(null);

  // Roll Scheme: 'division' (A: 101+, B: 201+, C: 301+) | 'department' | 'current'
  const [rollScheme, setRollScheme] = useState('division');

  // Editing single student PRN modal state
  const [editingStudent, setEditingStudent] = useState(null);
  const [customPrnInput, setCustomPrnInput] = useState('');

  // Local student records
  const [studentRecords, setStudentRecords] = useState(() => {
    const list = students.length > 0 ? students : [
      { rollNumber: 101, name: 'Krrish Sharma', course: 'IT', division: 'A', percentage: 94.2, admissionYear: 2024, prn: 'RBT24IT001' },
      { rollNumber: 102, name: 'Rohan Patel', course: 'IT', division: 'A', percentage: 71.4, admissionYear: 2024, prn: 'RBT24IT002' },
      { rollNumber: 103, name: 'Pooja Nair', course: 'IT', division: 'A', percentage: 95.8, admissionYear: 2024, prn: 'RBT24IT003' },
      { rollNumber: 104, name: 'Meera Iyer', course: 'IT', division: 'A', percentage: 89.1, admissionYear: 2024, prn: 'RBT24IT004' },
      { rollNumber: 105, name: 'Tanmay Deshmukh', course: 'IT', division: 'B', percentage: 64.0, admissionYear: 2024, prn: 'RBT24IT005' },
      { rollNumber: 106, name: 'Aditya Joshi', course: 'CS', division: 'A', percentage: 68.2, admissionYear: 2024, prn: 'RBT24CS001' },
      { rollNumber: 107, name: 'Riya Sen', course: 'CS', division: 'A', percentage: 86.4, admissionYear: 2024, prn: 'RBT24CS002' },
      { rollNumber: 108, name: 'Ananya Verma', course: 'CS', division: 'B', percentage: 92.5, admissionYear: 2024, prn: 'RBT24CS003' },
      { rollNumber: 109, name: 'Sneha Kulkarni', course: 'EXTC', division: 'A', percentage: 88.0, admissionYear: 2024, prn: 'RBT24EXTC001' },
      { rollNumber: 110, name: 'Vikram Singh', course: 'MECH', division: 'A', percentage: 56.5, admissionYear: 2024, prn: 'RBT24MECH001' }
    ];
    return list.map((s, idx) => ({
      ...s,
      admissionYear: s.admissionYear || 2024,
      prn: s.prn || generatePRN(INSTITUTION_PREFIX, s.admissionYear || 2024, s.course || 'IT', idx + 1)
    }));
  });

  // Calculate live preview of generated PRNs & Rolls
  const previewData = useMemo(() => {
    return batchGenerateStudentPRNs(studentRecords, {
      prefix,
      admissionYear: Number(admissionYear),
      reindexDivisionRolls: rollScheme === 'division',
      preserveExistingPrn: false
    });
  }, [studentRecords, prefix, admissionYear, rollScheme]);

  // Filtered preview list
  const filteredStudents = useMemo(() => {
    return previewData.filter(s => {
      const matchesDept = deptFilter === 'All' || s.course === deptFilter;
      const matchesDiv = divFilter === 'All' || s.division === divFilter;
      const matchesSearch = searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(s.rollNumber).includes(searchQuery) ||
        (s.prn && s.prn.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDept && matchesDiv && matchesSearch;
    });
  }, [previewData, deptFilter, divFilter, searchQuery]);

  const handleApplyBatchPRN = () => {
    setStudentRecords(previewData);
    if (onUpdateStudents) {
      onUpdateStudents(previewData);
    }
    try {
      localStorage.setItem('edutrack_students_data', JSON.stringify(previewData));
      window.dispatchEvent(new CustomEvent('edutrack_students_updated', { detail: previewData }));
    } catch (e) {
      console.error(e);
    }
    toast.success(
      'PRNs & Roll Numbers Synchronized',
      `Assigned unique PRNs (${prefix}${String(admissionYear).substring(2)}...) to ${previewData.length} students across all departments.`
    );
  };

  const handleCopyPrn = (prn) => {
    navigator.clipboard.writeText(prn);
    setCopiedPrn(prn);
    toast.info('PRN Copied', `${prn} copied to clipboard.`);
    setTimeout(() => setCopiedPrn(null), 2000);
  };

  const handleSaveCustomPRN = () => {
    if (!editingStudent || !customPrnInput) return;
    const updated = studentRecords.map(s =>
      s.rollNumber === editingStudent.rollNumber ? { ...s, prn: customPrnInput.toUpperCase().trim() } : s
    );
    setStudentRecords(updated);
    setEditingStudent(null);
    toast.success('PRN Updated', `Roll #${editingStudent.rollNumber} allocated custom PRN: ${customPrnInput.toUpperCase()}`);
  };

  return (
    <div>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          borderRadius: '16px',
          padding: '22px 26px',
          color: '#ffffff',
          marginBottom: '20px',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
                }}
              >
                <Hash size={22} color="#ffffff" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                  Student ID Generator
                </h2>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.825rem', color: '#94a3b8' }}>
                  Generate sequential roll numbers and unique PRNs.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={handleApplyBatchPRN}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} />
              <span>Apply PRNs</span>
            </button>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => printPRNEnrolmentRegister(previewData, deptFilter, divFilter)}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 14px',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={14} />
              <span>Print Register</span>
            </button>
          </div>
        </div>

        {/* Engine Configuration Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '12px',
            padding: '14px 18px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', display: 'block', fontWeight: 700, marginBottom: '4px' }}>
              Institute Prefix
            </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              className="input-field"
              style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', fontWeight: 700, fontFamily: 'monospace' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', display: 'block', fontWeight: 700, marginBottom: '4px' }}>
              Admission Batch Year
            </label>
            <select
              value={admissionYear}
              onChange={(e) => setAdmissionYear(e.target.value)}
              className="input-field"
              style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', fontWeight: 600 }}
            >
              <option value="2024" style={{ color: '#000' }}>Batch 2024 ('24') - TY</option>
              <option value="2025" style={{ color: '#000' }}>Batch 2025 ('25') - SY</option>
              <option value="2026" style={{ color: '#000' }}>Batch 2026 ('26') - FY</option>
              <option value="2023" style={{ color: '#000' }}>Batch 2023 ('23') - BTech</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', display: 'block', fontWeight: 700, marginBottom: '4px' }}>
              Roll Number Scheme
            </label>
            <select
              value={rollScheme}
              onChange={(e) => setRollScheme(e.target.value)}
              className="input-field"
              style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', fontWeight: 600 }}
            >
              <option value="division" style={{ color: '#000' }}>Division-Wise (Div A: 101, B: 201, C: 301)</option>
              <option value="department" style={{ color: '#000' }}>Department-Wise (Sequential)</option>
              <option value="current" style={{ color: '#000' }}>Keep Existing Rolls</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', display: 'block', fontWeight: 700, marginBottom: '4px' }}>
              Sample PRN Preview
            </label>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#38bdf8',
                padding: '7px 12px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '8px'
              }}
            >
              {generatePRN(prefix, admissionYear, deptFilter === 'All' ? 'IT' : deptFilter, 1)}
            </div>
          </div>
        </div>
      </div>

      {/* Roster & Filter Bar */}
      <div className="table-container">
        <div className="table-header-bar" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 className="table-title">Student PRN Register</h3>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search name, roll, or PRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '30px', fontSize: '0.8rem' }}
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 600 }}
            >
              <option value="All">All Departments</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="CS">Computer Science (CS)</option>
              <option value="EXTC">Electronics & Telecom (EXTC)</option>
              <option value="MECH">Mechanical Engg (MECH)</option>
            </select>

            <select
              value={divFilter}
              onChange={(e) => setDivFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 600 }}
            >
              <option value="All">All Divisions</option>
              <option value="A">Division A</option>
              <option value="B">Division B</option>
              <option value="C">Division C</option>
            </select>
          </div>
        </div>

        {/* Division Range Helper Pill Tags */}
        <div style={{ padding: '0 20px 12px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center', fontWeight: 600 }}>
            Division Allocation Ranges:
          </span>
          <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>
            Div A: Roll 101 – 160
          </span>
          <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>
            Div B: Roll 201 – 260
          </span>
          <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>
            Div C: Roll 301 – 360
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
            {filteredStudents.length} Students Indexed
          </span>
        </div>

        <table className="clean-table">
          <thead>
            <tr>
              <th style={{ width: '70px', textAlign: 'center' }}>Roll #</th>
              <th>Student Name</th>
              <th>Department</th>
              <th style={{ textAlign: 'center' }}>Division</th>
              <th style={{ textAlign: 'center' }}>Admission Year</th>
              <th>Unique PRN Code</th>
              <th>Format Breakdown</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => {
              const yr = String(s.admissionYear || 2024).substring(2);
              const dept = (s.course || 'IT').toUpperCase();

              return (
                <tr key={s.rollNumber || idx}>
                  <td style={{ textAlign: 'center' }}>
                    <strong style={{ color: '#0f172a', fontSize: '0.88rem' }}>#{s.rollNumber}</strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.email}</div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{s.course}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: s.division === 'A' ? '#eff6ff' : s.division === 'B' ? '#f0fdf4' : '#fef2f2',
                        color: s.division === 'A' ? '#1d4ed8' : s.division === 'B' ? '#047857' : '#b91c1c',
                        fontSize: '0.78rem'
                      }}
                    >
                      Div {s.division || 'A'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                    {s.admissionYear || 2024}
                  </td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          color: '#1d4ed8',
                          letterSpacing: '0.04em',
                          background: '#eff6ff',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid #bfdbfe'
                        }}
                      >
                        {s.prn}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrn(s.prn)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}
                        title="Copy PRN"
                      >
                        {copiedPrn === s.prn ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      <strong>{prefix}</strong> (Inst) + <strong>{yr}</strong> (Yr) + <strong>{dept}</strong> (Dept) + <strong>Seq</strong>
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        setEditingStudent(s);
                        setCustomPrnInput(s.prn);
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit3 size={12} />
                      <span>Edit PRN</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Single PRN Override Modal */}
      {editingStudent && (
        <div className="modal-overlay" onClick={() => setEditingStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Student PRN & Roll</h3>
              <button className="modal-close-btn" onClick={() => setEditingStudent(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 14 }}>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{editingStudent.name}</strong>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Roll #{editingStudent.rollNumber} · Department of {editingStudent.course} (Div {editingStudent.division})
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Unique PRN Code (Uppercase)
                </label>
                <input
                  type="text"
                  value={customPrnInput}
                  onChange={(e) => setCustomPrnInput(e.target.value.toUpperCase())}
                  className="input-field"
                  style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem' }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                  Standard pattern: {prefix} + [Admission 2-digit year] + [Dept] + [3-digit sequence]
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setEditingStudent(null)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleSaveCustomPRN}>
                <Save size={13} />
                <span>Save PRN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
