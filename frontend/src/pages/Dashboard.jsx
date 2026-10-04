import React, { useEffect, useState } from 'react';
import { Users, Award, TrendingUp, BookOpen, Plus, ArrowRight } from 'lucide-react';
import { studentService } from '../services/studentService';

export default function Dashboard({ onNavigate, onViewStudent, onEditStudent, onDeleteStudent }) {
  const [analytics, setAnalytics] = useState({ total: 0, average: 0, highest: null });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [stats, all] = await Promise.all([
        studentService.getAnalytics(),
        studentService.getAll()
      ]);
      setAnalytics(stats);
      setRecentStudents(all.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCuteAvatarColor = (index) => {
    const colors = ['lilac', 'peach', 'mint', 'sky'];
    return colors[index % colors.length];
  };

  const getCuteEmoji = (index) => {
    const emojis = ['👾', '🦊', '🐱', '🐼', '🐯'];
    return emojis[index % emojis.length];
  };

  return (
    <div>
      {/* Hero Bar */}
      <div className="page-hero-bar">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
            Welcome back, Professor.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn-pill-subtle" onClick={() => onNavigate('schedule')}>
            Timetable
          </button>
          <button className="btn-pill-dark" onClick={() => onNavigate('add')}>
            <Plus size={16} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Pastel Metric Cards (Matching reference 1 & 2) */}
      <div className="pastel-stats-grid">
        {/* Purple Card */}
        <div className="pastel-card purple">
          <div className="stat-header-row">
            <span className="stat-label-title">Enrolled Students</span>
            <div className="stat-icon-bubble">
              <Users size={18} color="#6b21a8" />
            </div>
          </div>
          <div className="stat-big-number">{loading ? '...' : analytics.total}</div>
        </div>

        {/* Green Card */}
        <div className="pastel-card green">
          <div className="stat-header-row">
            <span className="stat-label-title">Batch Average</span>
            <div className="stat-icon-bubble">
              <TrendingUp size={18} color="#15803d" />
            </div>
          </div>
          <div className="stat-big-number">{loading ? '...' : `${analytics.average}%`}</div>
        </div>

        {/* Orange Card */}
        <div className="pastel-card orange">
          <div className="stat-header-row">
            <span className="stat-label-title">Top Achiever</span>
            <div className="stat-icon-bubble">
              <Award size={18} color="#9a3412" />
            </div>
          </div>
          <div className="stat-big-number">
            {loading ? '...' : analytics.highest ? `${analytics.highest.percentage}%` : 'N/A'}
          </div>
          {analytics.highest && (
            <div className="stat-sub-text">{analytics.highest.name}</div>
          )}
        </div>

        {/* Blue Card */}
        <div className="pastel-card blue">
          <div className="stat-header-row">
            <span className="stat-label-title">Active Streams</span>
            <div className="stat-icon-bubble">
              <BookOpen size={18} color="#0369a1" />
            </div>
          </div>
          <div className="stat-big-number">4 Departments</div>
        </div>
      </div>

      {/* Recent Students Table with Cute Pastel Avatars (Reference 2) */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Enrollments</h3>
          </div>
          <button
            className="btn-pill-subtle"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            onClick={() => onNavigate('students')}
          >
            <span>Full Directory</span>
            <ArrowRight size={14} />
          </button>
        </div>

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
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((s, idx) => {
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
                      <button
                        className="action-circle view"
                        title="View Details"
                        onClick={() => onViewStudent(s)}
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
