import React, { useState } from 'react';
import SidebarTooltip from './SidebarTooltip';

/**
 * Premium Apple-quality Navigation Item.
 * Implements subtle active state, hover response, and collapsed tooltip.
 * Strictly compliant with Sections 11, 13, 14, 15, and 20.
 */
export default function SidebarItem({
  item,
  isActive,
  isCollapsed,
  onSelect
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  const handleClick = () => {
    if (onSelect) {
      onSelect(item.id);
    }
  };

  return (
    <div
      className="sidebar-item-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
        onClick={handleClick}
        aria-current={isActive ? 'page' : undefined}
        title={isCollapsed ? undefined : item.label}
      >
        <span className="sidebar-icon-container">
          <Icon size={18} strokeWidth={isActive ? 2.1 : 1.8} className="sidebar-nav-icon" />
        </span>

        {!isCollapsed && (
          <span className="sidebar-nav-text">{item.label}</span>
        )}

        {!isCollapsed && item.badge && (
          <span className="sidebar-item-badge">
            {item.badge}
          </span>
        )}
      </button>

      {/* Unobtrusive tooltip when sidebar is collapsed */}
      {isCollapsed && (
        <SidebarTooltip
          label={item.label}
          badge={item.badge}
          isVisible={isHovered}
        />
      )}
    </div>
  );
}
