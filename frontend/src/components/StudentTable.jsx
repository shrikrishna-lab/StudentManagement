import React from 'react';
import { Eye, Edit2, Trash2, GraduationCap } from 'lucide-react';

export default function StudentTable({
  students,
  onView,
  onEdit,
  onDelete
}) {
  if (!students || students.length === 0) {
    return (
      <div className="table-container state-box">
        <GraduationCap className="state-icon" size={44} color="var(--text-faint)" />
        <h3 style={{ fontSize: '16px', fontWeight: 650, marginBottom: '0.25rem' }}>No records found.</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Adjust your filters or add a student to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll No</th>
            <th>Department</th>
            <th>Year & Div</th>
            <th>Academic Score</th>
            <th>Contact</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const isTopper = student.percentage >= 90;
            return (
              <tr key={student.rollNumber}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar-squircle">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{student.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  #{student.rollNumber}
                </td>
                <td>
                  <span className="badge">
                    {student.course}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  Year {student.year} · Div {student.division}
                </td>
                <td>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className={`percentage-pill ${isTopper ? 'grade-topper' : ''}`}>
                      {Number(student.percentage).toFixed(2)}%
                    </span>
                    {isTopper && (
                      <span className="badge badge-popular" style={{ padding: '2px 6px', fontSize: '10px' }}>
                        Distinction
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  {student.phone}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                    <button
                      className="btn-icon"
                      title="View Profile"
                      onClick={() => onView(student)}
                      aria-label={`View ${student.name}`}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="btn-icon"
                      title="Edit Profile"
                      onClick={() => onEdit(student)}
                      aria-label={`Edit ${student.name}`}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="btn-icon delete"
                      title="Delete Record"
                      onClick={() => onDelete(student)}
                      aria-label={`Delete ${student.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
