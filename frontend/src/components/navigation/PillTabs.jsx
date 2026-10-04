import React from 'react';
import DiscreteTabs from './DiscreteTabs';

/**
 * PillTabs - Page-Level Navigation & View Switching Component
 * Powered by Apple-inspired DiscreteTabs motion engine.
 * Ensures consistent animation, immediate feedback, and strict EduTrack content fidelity.
 */
export default function PillTabs({
  tabs = [],
  activeTab,
  onChange,
  onTabChange,
  className = '',
  size = 'md'
}) {
  return (
    <DiscreteTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange || onChange}
      onChange={onChange || onTabChange}
      className={className}
      size={size}
    />
  );
}
