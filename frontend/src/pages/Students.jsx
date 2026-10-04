import React, { useState, useMemo } from 'react';
import { Plus, Search, ArrowUpDown, Trash2, Edit3, Eye, AlertTriangle } from 'lucide-react';

export default function Students({
  students,
  loading,
  onNavigate,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  currentRole = 'admin'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedSort, setSelectedSort] = useState('roll-asc');
  const [studentToDelete, setStudentToDelete] = useState(null);

  const courses = ['All', 'IT', 'CS', 'EXTC', 'MECH'];

  const processedStudents = useMemo(() => {
    let list = [...students];

    if (selectedCourse !== 'All') {
      list = list.filter((s) => s.course.toUpperCase() === selectedCourse.toUpperCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q) ||
          String(s.rollNumber).includes(q)
      );
    }

    list.sort((a, b) => {
      switch (selectedSort) {
        case 'roll-asc': return a.rollNumber - b.rollNumber;
        case 'roll-desc': return b.rollNumber - a.rollNumber;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'percentage-desc': return b.percentage - a.percentage;
        case 'percentage-asc': return a.percentage - b.percentage;
        default: return 0;
      }
    });

    return list;
  }, [students, searchQuery, selectedCourse, selectedSort]);

  const getCuteAvatarColor = (index) => {
    const colors = ['lilac', 'peach', 'mint', 'sky'];
    return colors[index % colors.length];
  };

  const getCuteEmoji = (index) => {
    const emojis = ['👾', '🦊', '🐱', '🐼', '🐯', '🐰', '🦁'];
    return emojis[index % emojis.length];
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      onDeleteStudent(studentToDelete.rollNumber);
      setStudentToDelete(null);
    }
  };

  return (
    <div>
      {/* Hero Bar with Department Pills and + Add Student */}
      <div className="page-hero-bar">
        <div>
          <div className="hero-date-title">Students Directory</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {processedStudents.length} of {students.length} students matched
          </p>
        </div>

        {/* Pill category filters (like Reference 1) */}
        <div className="pill-group">
          {courses.map((c) => (
            <button
              key={c}
              className={`filter-pill ${selectedCourse === c ? 'active' : ''}`}
              onClick={() => setSelectedCourse(c)}
            >
              {c === 'All' ? 'All Depts' : c}
            </button>
          ))}
        </div>

        {/* Add Student button (Admin ONLY Privilege) */}
        {currentRole === 'admin' && (
          <button className="btn-pill-dark" onClick={() => onNavigate('add')}>
            <Plus size={16} />
            <span>Add Student</span>
          </button>
        )}
      </div>

      {/* Search and Sort Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            className="search-input-pill"
            placeholder="Search by name, roll, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowUpDown size={16} color="var(--text-secondary)" />
          <select
            className="filter-pill"
            style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '8px 14px' }}
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="roll-asc">Roll No (Ascending)</option>
            <option value="roll-desc">Roll No (Descending)</option>
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="percentage-desc">Percentage (Topper First)</option>
            <option value="percentage-asc">Percentage (Lowest First)</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="students-table-card">
        <table className="clean-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No</th>
              <th>Department</th>
              <th>Year & Div</th>
              <th>Score</th>
              <th>Standing</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading students...
                </td>
              </tr>
            ) : processedStudents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🔍</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>No student records match your query</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try clearing your filters or search bar.</div>
                </td>
              </tr>
            ) : (
              processedStudents.map((s, idx) => {
                const isTopper = s.percentage >= 90;
                const isFirstClass = s.percentage >= 75;
                return (
                  <tr key={s.rollNumber}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className={`cute-avatar ${getCuteAvatarColor(idx)}`}>
                          {getCuteEmoji(idx)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{s.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>#{s.rollNumber}</td>
                    <td>
                      <span className="filter-pill active" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                        {s.course}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      Year {s.year} · Div {s.division}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {Number(s.percentage).toFixed(2)}%
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          isTopper ? 'topper' : isFirstClass ? 'first-class' : 'second-class'
                        }`}
                      >
                        {isTopper ? '⭐ Topper' : isFirstClass ? 'First Class' : 'Pass Class'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          className="action-circle view"
                          title="View Profile Record"
                          onClick={() => onViewStudent(s)}
                        >
                          <Eye size={15} />
                        </button>
                        {currentRole !== 'student' && (
                          <button
                            className="action-circle edit"
                            title={currentRole === 'admin' ? 'Edit Student Record' : 'Edit Academic Notes'}
                            onClick={() => onEditStudent(s)}
                          >
                            <Edit3 size={15} />
                          </button>
                        )}
                        {currentRole === 'admin' && (
                          <button
                            className="action-circle delete"
                            title="Delete Student (Admin Only)"
                            onClick={() => setStudentToDelete(s)}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="modal-overlay" onClick={() => setStudentToDelete(null)}>
          <div className="modal-pastel-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#dc2626' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Deletion</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              Are you sure you want to remove <strong>{studentToDelete.name}</strong> (Roll #{studentToDelete.rollNumber})? This operation cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button className="btn-pill-subtle" onClick={() => setStudentToDelete(null)}>
                Cancel
              </button>
              <button
                className="btn-pill-dark"
                style={{ background: '#dc2626' }}
                onClick={confirmDelete}
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
