import React from 'react';

/**
 * Clean, lightweight, non-intrusive tooltip for collapsed sidebar icons.
 * Strictly compliant with Section 20 of the EduTrack Master Navigation Prompt.
 */
export default function SidebarTooltip({ label, badge, isVisible }) {
  if (!isVisible) return null;

  return (
    <div
      className="sidebar-apple-tooltip"
      role="tooltip"
      aria-hidden={!isVisible}
    >
      <span>{label}</span>
      {badge && <span className="sidebar-tooltip-badge">{badge}</span>}
    </div>
  );
}
