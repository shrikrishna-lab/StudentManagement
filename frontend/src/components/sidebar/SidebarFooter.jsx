import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import SidebarTooltip from './SidebarTooltip';

/**
 * Premium Apple-quality Sidebar Footer.
 * Compact profile card with integrated sign-out.
 * Strictly compliant with Sections 21, 22, and 28.
 */
export default function SidebarFooter({
  currentUser,
  currentRole,
  activeStudentProfile,
  isCollapsed,
  onOpenProfileModal,
  onLogout
}) {
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const getProfile = () => {
    if (currentRole === 'student') {
      const s = activeStudentProfile || currentUser;
      return {
        name: s?.name || 'Krrish Sharma',
        role: `Student · ${s?.course || 'IT'} (${s?.gender === 'Female' ? 'Female' : 'Male'})`,
        avatarUrl: s?.avatarUrl || (s?.gender === 'Female' ? '/assets/female_student_avatar.jpg' : '/assets/student_avatar.jpg')
      };
    }
    if (currentUser) {
      return {
        name: currentUser.name,
        role: currentUser.roleLabel || (currentUser.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Administrator'),
        avatarUrl: currentUser.avatarUrl || '/assets/student_avatar.jpg'
      };
    }
    switch (currentRole) {
      case 'admin':
        return { name: 'System Admin', role: 'Administrator', avatarUrl: '/assets/student_avatar.jpg' };
      case 'teacher':
        return { name: 'Prof. Krrish', role: 'Faculty Member', avatarUrl: '/assets/student_avatar.jpg' };
      case 'student':
      default:
        return { name: 'Krrish Sharma', role: 'Student · Year 3', avatarUrl: '/assets/student_avatar.jpg' };
    }
  };

  const profile = getProfile();

  if (isCollapsed) {
    return (
      <div className="sidebar-footer-collapsed">
        <div
          className="sidebar-footer-icon-wrap"
          onMouseEnter={() => setIsAvatarHovered(true)}
          onMouseLeave={() => setIsAvatarHovered(false)}
        >
          <button
            type="button"
            className="sidebar-user-avatar-btn"
            onClick={onOpenProfileModal}
            aria-label={`Profile: ${profile.name}`}
          >
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="sidebar-user-avatar-collapsed"
            />
          </button>
          <SidebarTooltip
            label={profile.name}
            badge={profile.role}
            isVisible={isAvatarHovered}
          />
        </div>

        {onLogout && (
          <div
            className="sidebar-footer-icon-wrap"
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
          >
            <button
              type="button"
              className="sidebar-logout-icon-btn"
              onClick={onLogout}
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
            <SidebarTooltip
              label="Sign Out"
              isVisible={isLogoutHovered}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="sidebar-footer-expanded">
      <div
        className="sidebar-user-profile-row"
        onClick={onOpenProfileModal}
        role="button"
        tabIndex={0}
        title="View profile details"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenProfileModal();
          }
        }}
      >
        <div className="sidebar-user-avatar-wrap">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="sidebar-user-avatar"
          />
        </div>

        <div className="sidebar-user-meta">
          <span className="sidebar-user-name">{profile.name}</span>
          <span className="sidebar-user-role">{profile.role}</span>
        </div>
      </div>

      {onLogout && (
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={onLogout}
          title="Sign out of EduTrack"
          aria-label="Sign out"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      )}
    </div>
  );
}
