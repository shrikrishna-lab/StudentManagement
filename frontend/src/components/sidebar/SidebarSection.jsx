import React from 'react';
import SidebarItem from './SidebarItem';

/**
 * Navigation Group Section.
 * Implements clean visual hierarchy and consistent rhythm.
 * Strictly compliant with Sections 5, 8, 9, 10, and 30.
 */
export default function SidebarSection({
  group,
  items,
  activeTab,
  isCollapsed,
  onSelect
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="sidebar-group-section">
      {!isCollapsed && group && (
        <div className="sidebar-group-header">
          {group}
        </div>
      )}

      {isCollapsed && (
        <div className="sidebar-collapsed-divider" />
      )}

      <div className="sidebar-group-items">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            isCollapsed={isCollapsed}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
