import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <div className="nav-pill-wrapper">
      <header className="nav-pill">
        <div className="brand" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-squircle">
            <GraduationCap size={16} />
          </div>
          <span className="brand-text">EduTrack</span>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('add')}
            style={{ marginLeft: '0.5rem' }}
          >
            Add Student
          </button>
        </nav>
      </header>
    </div>
  );
}
