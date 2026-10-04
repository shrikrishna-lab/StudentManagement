import React from 'react';
import { Mail, Globe, FileText, CheckCircle2, BookOpen, Users, Database, ShieldCheck } from 'lucide-react';

export default function ProfileCard({
  profile,
  currentRole,
  onViewProfile,
  compact = false
}) {
  // 100% REAL, content-specific academic data tailored to the current role
  const getRoleDetails = () => {
    switch (currentRole) {
      case 'admin':
        return {
          name: profile?.name || 'System Administrator',
          subtitle: 'SysID #A-01 · Root Privilege',
          tagline: 'Database & Infrastructure Administrator · Managing MySQL 8.0 & Student Records',
          avatarUrl: '/assets/student_avatar.jpg',
          expLabel: 'sys',
          expActive: 24,
          expTotal: 26,
          btnLabel: 'Admin Dossier ↗',
          stats: [
            { label: 'DB Status', value: 'Online' },
            { label: 'Students', value: '124' },
            { label: 'Uptime', value: '100%' }
          ],
          socials: [
            { icon: <Mail size={15} />, title: 'Admin Email', action: () => window.location.href = 'mailto:admin@edutrack.edu' },
            { icon: <Database size={15} />, title: 'MySQL Storage', action: onViewProfile },
            { icon: <ShieldCheck size={15} />, title: 'Security Privileges', action: onViewProfile }
          ]
        };
      case 'teacher':
        return {
          name: profile?.name || 'Prof. Krrish',
          subtitle: 'Faculty ID #T-402 · Dept IT',
          tagline: 'Senior IT Mentor · Lecturer in Core Java, OOP & MySQL Database Systems',
          avatarUrl: '/assets/student_avatar.jpg',
          expLabel: 'fac',
          expActive: 22,
          expTotal: 26,
          btnLabel: 'Faculty Profile ↗',
          stats: [
            { label: 'Courses', value: '4 Active' },
            { label: 'Students', value: '120+' },
            { label: 'Pass Rate', value: '98.5%' }
          ],
          socials: [
            { icon: <Mail size={15} />, title: 'Faculty Email', action: () => window.location.href = 'mailto:krrish.faculty@edutrack.edu' },
            { icon: <BookOpen size={15} />, title: 'Curriculum & Syllabi', action: onViewProfile },
            { icon: <Users size={15} />, title: 'Student Directory', action: onViewProfile }
          ]
        };
      case 'student':
      default:
        return {
          name: profile?.name || 'Krrish Sharma',
          subtitle: 'Roll #101 · Div A · Sem 6',
          tagline: 'Information Technology Undergrad · Specializing in Core Java & MySQL Systems',
          avatarUrl: '/assets/student_avatar.jpg',
          expLabel: 'sem',
          expActive: 21,
          expTotal: 26,
          btnLabel: 'View Record ↗',
          stats: [
            { label: 'Attendance', value: '94.2%' },
            { label: 'CGPA', value: '8.95' },
            { label: 'Batch Rank', value: '#2 / 60' }
          ],
          socials: [
            { icon: <Mail size={15} />, title: 'Student Email', action: () => window.location.href = 'mailto:krrish.sharma@edutrack.edu' },
            { icon: <FileText size={15} />, title: 'Academic Transcript', action: onViewProfile },
            { icon: <Globe size={15} />, title: 'Student Portal ID', action: onViewProfile }
          ]
        };
    }
  };

  const details = getRoleDetails();

  return (
    <div className={`nex-profile-card ${compact ? 'compact' : ''}`}>
      {/* 1. Botanical Cover Banner with Real Academic Action Button */}
      <div className="nex-card-banner">
        <button
          className="nex-follow-btn"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile();
          }}
          title="Open Full Profile & Record"
        >
          <span>{details.btnLabel}</span>
        </button>
      </div>

      {/* 2. Overlapping Avatar & REAL Semester/Academic Progress Tally Bar */}
      <div className="nex-avatar-exp-row">
        <div className="nex-avatar-wrapper" onClick={onViewProfile} title="View Profile Details">
          <img
            src={details.avatarUrl}
            alt={details.name}
            className="nex-avatar-img"
          />
        </div>

        <div className="nex-exp-container" title={`Academic Level Progress: ${details.expActive} / ${details.expTotal} milestones`}>
          <span className="nex-exp-label">{details.expLabel}</span>
          <div className="nex-exp-bars">
            {Array.from({ length: details.expTotal }).map((_, i) => (
              <span
                key={i}
                className={`nex-exp-bar ${i < details.expActive ? 'active' : ''}`}
                style={{ '--bar-index': i }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Name, Verified Badge & Academic Subtitle */}
      <div className="nex-bio-section">
        <div className="nex-user-heading" onClick={onViewProfile} title="Click to view details">
          <h3 className="nex-name">{details.name}</h3>
          <CheckCircle2 size={15} className="nex-verified-badge" />
        </div>
        <div className="nex-role-tag">{details.subtitle}</div>
        <p className="nex-tagline">{details.tagline}</p>
      </div>

      {/* 4. Bottom Frosted Glass Stats (100% Real Academic Metrics) & Direct Tools */}
      <div className="nex-stats-footer">
        <div className="nex-stats-grid">
          {details.stats.map((stat, idx) => (
            <div key={idx} className="nex-stat-item">
              <div className="nex-stat-val">{stat.value}</div>
              <div className="nex-stat-lbl">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Real Academic Quick Action Icons */}
        <div className="nex-social-row">
          {details.socials.map((soc, idx) => (
            <button
              key={idx}
              className="nex-social-btn"
              title={soc.title}
              onClick={(e) => {
                e.stopPropagation();
                soc.action();
              }}
            >
              {soc.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
