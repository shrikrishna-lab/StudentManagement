import React from 'react';

export default function EduTrackLogo({ size = 'md', showText = true, className = '' }) {
  const boxHeight = size === 'sm' ? 30 : size === 'lg' ? 44 : 36;
  const boxWidth = size === 'sm' ? 24 : size === 'lg' ? 36 : 30;
  const fontSize = size === 'sm' ? '0.95rem' : size === 'lg' ? '1.35rem' : '1.1rem';

  return (
    <div
      className={`edutrack-logo-brand ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        userSelect: 'none'
      }}
    >
      {/* Official EduTrack Pencil & Mortarboard Emblem */}
      <div
        className="edutrack-logo-icon-box"
        style={{
          width: `${boxWidth}px`,
          height: `${boxHeight}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <img
          src="/assets/edutrack_emblem.png"
          alt="EduTrack Emblem"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))'
          }}
        />
      </div>

      {showText && (
        <span
          style={{
            fontSize,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          Edu<span style={{ color: '#16a34a' }}>Track</span>
        </span>
      )}
    </div>
  );
}
