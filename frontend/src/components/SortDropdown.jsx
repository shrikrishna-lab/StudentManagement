import React from 'react';
import { ArrowDownUp } from 'lucide-react';

export default function SortDropdown({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <ArrowDownUp size={16} color="var(--text-muted)" />
      <select
        className="select-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort students by"
      >
        <option value="roll-asc">Roll Number (Ascending)</option>
        <option value="roll-desc">Roll Number (Descending)</option>
        <option value="name-asc">Name (A → Z)</option>
        <option value="name-desc">Name (Z → A)</option>
        <option value="percentage-desc">Percentage (Topper First)</option>
        <option value="percentage-asc">Percentage (Lowest First)</option>
      </select>
    </div>
  );
}
