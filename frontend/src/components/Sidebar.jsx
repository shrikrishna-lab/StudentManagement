import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import SidebarSection from './sidebar/SidebarSection';
import SidebarFooter from './sidebar/SidebarFooter';
import { getNavigationByRole } from './sidebar/navigationConfig';

/**
 * EduTrack Apple-Quality Sidebar Navigation System.
 * Matching the macOS rounded squircle styling and layout.
 */
export default function Sidebar({
  activeTab,
  setActiveTab,
  currentRole = 'student',
  currentUser,
  activeStudentProfile,
  isCollapsed = false,
  onToggleCollapse,
  onOpenProfileModal,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
  studentCount = 5
}) {
  const rawNavigationGroups = getNavigationByRole(currentRole);

  // Dynamically attach live counts (e.g. Students (5))
  const navigationGroups = rawNavigationGroups.map((section) => ({
    ...section,
    group: section.group === 'MAIN' ? 'NAVIGATION' : section.group,
    items: section.items.map((item) => {
      if (item.id === 'students') {
        return { ...item, badge: String(studentCount || 5) };
      }
      return item;
    })
  }));

  const handleSelectTab = (id) => {
    if (setActiveTab) setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const getRoleConsoleLabel = () => {
    switch (currentRole) {
      case 'admin':
        return 'ADMIN CONSOLE';
      case 'teacher':
        return 'FACULTY CONSOLE';
      case 'student':
      default:
        return 'STUDENT PORTAL';
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`edutrack-apple-sidebar ${isCollapsed ? 'collapsed' : ''} ${
          isMobileOpen ? 'mobile-open' : ''
        }`}
        aria-label="Primary Navigation"
      >
        {/* macOS Top Control Bar: Traffic Lights + Toggle Button */}
        <div className="sidebar-top-bar">
          <div className="sidebar-traffic-lights" aria-hidden="true">
            <span className="traffic-dot close" />
            <span className="traffic-dot minimize" />
            <span className="traffic-dot maximize" />
          </div>

          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={16} strokeWidth={1.8} />
            ) : (
              <PanelLeftClose size={16} strokeWidth={1.8} />
            )}
          </button>
        </div>

        {/* Brand Lockup: Official EduTrack Emblem + Title + Role Console Subtitle */}
        <div className="sidebar-brand-block">
          <div className="sidebar-brand-icon-box" title="EduTrack">
            <img
              src="/assets/edutrack_emblem.png"
              alt="EduTrack Logo"
              className="sidebar-brand-emblem-img"
            />
          </div>

          {!isCollapsed && (
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">
                Edu<span style={{ color: '#16a34a' }}>Track</span>
              </span>
              <span className="sidebar-brand-subtitle">
                {getRoleConsoleLabel()}
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="sidebar-scrollable-body">
          {navigationGroups.map((section) => (
            <SidebarSection
              key={section.group}
              group={section.group}
              items={section.items}
              activeTab={activeTab}
              isCollapsed={isCollapsed}
              onSelect={handleSelectTab}
            />
          ))}
        </div>

        {/* User Profile & Account Footer */}
        <div className="sidebar-footer-container">
          <SidebarFooter
            currentUser={currentUser}
            currentRole={currentRole}
            activeStudentProfile={activeStudentProfile}
            isCollapsed={isCollapsed}
            onOpenProfileModal={onOpenProfileModal}
            onLogout={onLogout}
          />
        </div>
      </aside>
    </>
  );
}
