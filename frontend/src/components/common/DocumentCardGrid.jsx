import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import DocumentRepositoryModal from './DocumentRepositoryModal';

/**
 * 3D-styled SVG illustration icons custom-crafted for EduTrack Academic Resources.
 */

// 1. Curriculum & Syllabus Book Icon
function SyllabusIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="sylShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.12" />
        </filter>
        <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      {/* Back book page layers */}
      <rect x="13" y="9" width="25" height="31" rx="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="10" y="11" width="25" height="30" rx="3.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      {/* Front hardbound binder cover */}
      <g filter="url(#sylShadow)">
        <rect x="8" y="13" width="24" height="28" rx="3.5" fill="url(#bookCover)" />
        {/* Spine strip */}
        <rect x="8" y="13" width="4.5" height="28" rx="1" fill="#1e40af" />
        {/* Embossed title lines */}
        <rect x="15" y="18" width="13" height="2.5" rx="1" fill="#93c5fd" />
        <rect x="15" y="23" width="10" height="2" rx="1" fill="#bfdbfe" opacity="0.8" />
        {/* Graduation cap glyph / bookmark */}
        <path d="M 21 28 L 27 28 L 24 33 Z" fill="#fbbf24" />
        <circle cx="24" cy="27" r="1.5" fill="#ffffff" />
      </g>
      {/* Bookmark ribbon peeking from top */}
      <path d="M 23 6 L 27 6 L 27 12 L 25 10.5 L 23 12 Z" fill="#ef4444" />
    </svg>
  );
}

// 2. Previous Year Question Paper (PYQ) Icon
function PyqIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="pyqShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.12" />
        </filter>
        <linearGradient id="penBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {/* Exam Sheet */}
      <rect x="10" y="8" width="24" height="33" rx="3.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" filter="url(#pyqShadow)" />
      {/* Question paper headers */}
      <rect x="14" y="13" width="13" height="2.5" rx="1" fill="#0f172a" />
      <rect x="14" y="18" width="16" height="1.8" rx="0.9" fill="#94a3b8" />
      <rect x="14" y="22" width="16" height="1.8" rx="0.9" fill="#cbd5e1" />
      <rect x="14" y="26" width="12" height="1.8" rx="0.9" fill="#cbd5e1" />
      {/* A+ Distinction Stamp Badge */}
      <circle cx="21" cy="33" r="5" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
      <text x="21" y="35.5" fontSize="6" fontWeight="bold" fill="#b91c1c" textAnchor="middle" fontFamily="sans-serif">A+</text>
      {/* Luxury Fountain Pen */}
      <g transform="translate(24, 6) rotate(22)">
        <rect x="0" y="0" width="5" height="25" rx="2" fill="url(#penBody)" stroke="#334155" strokeWidth="0.8" />
        <rect x="0" y="2" width="5" height="1.2" fill="#f59e0b" />
        <path d="M 0 25 L 2.5 31 L 5 25 Z" fill="#f59e0b" />
        <circle cx="2.5" cy="27" r="0.7" fill="#0f172a" />
      </g>
    </svg>
  );
}

// 3. Lab Manuals & Practical Journals Icon
function LabManualIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="labShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.1" />
        </filter>
        <linearGradient id="flaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Lab Journal Sheet */}
      <rect x="9" y="8" width="24" height="33" rx="3.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" filter="url(#labShadow)" />
      {/* Spiral Wire Rings */}
      <circle cx="12" cy="11" r="1.5" fill="#94a3b8" />
      <circle cx="16" cy="11" r="1.5" fill="#94a3b8" />
      <circle cx="20" cy="11" r="1.5" fill="#94a3b8" />
      <circle cx="24" cy="11" r="1.5" fill="#94a3b8" />
      {/* Code syntax lines */}
      <rect x="13" y="16" width="10" height="2" rx="1" fill="#0284c7" />
      <rect x="13" y="20" width="14" height="1.8" rx="0.9" fill="#64748b" />
      <rect x="15" y="24" width="12" height="1.8" rx="0.9" fill="#10b981" />
      <rect x="15" y="28" width="10" height="1.8" rx="0.9" fill="#94a3b8" />
      {/* Science Beaker / Chemistry Flask Overlay */}
      <g transform="translate(24, 18)">
        <path d="M 6 0 L 10 0 L 10 5 L 15 15 C 16 17, 14 20, 11 20 L 5 20 C 2 20, 0 17, 1 15 L 6 5 Z" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
        {/* Liquid level */}
        <path d="M 2.5 15 C 4 14, 8 16, 13.5 15 L 11 20 L 5 20 Z" fill="url(#flaskGrad)" opacity="0.85" />
        <circle cx="7" cy="16" r="1" fill="#ffffff" opacity="0.8" />
        <circle cx="10" cy="17" r="0.7" fill="#ffffff" opacity="0.8" />
      </g>
    </svg>
  );
}

// 4. Bonafide & Student Certificates Icon
function CertificatesIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="certShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#0f172a" floodOpacity="0.1" />
        </filter>
        <linearGradient id="goldSeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Certificate Parchment Sheet */}
      <rect x="9" y="8" width="25" height="33" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" filter="url(#certShadow)" />
      {/* Formal Border Inset */}
      <rect x="11.5" y="10.5" width="20" height="28" rx="1.5" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
      {/* University Crest / Title block */}
      <circle cx="21.5" cy="15" r="2.5" fill="#2563eb" />
      <rect x="14" y="20" width="15" height="2" rx="1" fill="#0f172a" />
      <rect x="14" y="24" width="13" height="1.6" rx="0.8" fill="#64748b" />
      <rect x="14" y="27.5" width="14" height="1.6" rx="0.8" fill="#cbd5e1" />
      {/* Official Golden Seal with Ribbon */}
      <g transform="translate(23, 20)">
        {/* Red Ribbons hanging */}
        <path d="M 6 12 L 4 20 L 7 18 L 10 20 L 8 12 Z" fill="#dc2626" />
        {/* Golden Embossed Seal */}
        <circle cx="7" cy="10" r="6" fill="url(#goldSeal)" stroke="#b45309" strokeWidth="0.8" />
        <circle cx="7" cy="10" r="4.2" fill="none" stroke="#fef3c7" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        {/* Star in center */}
        <circle cx="7" cy="10" r="1.5" fill="#ffffff" />
      </g>
    </svg>
  );
}

// 5. Academic Regulations & Grading Rules Icon
function RegulationsIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="regShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.1" />
        </filter>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      {/* Regulation Code Sheet */}
      <rect x="10" y="8" width="24" height="33" rx="3.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" filter="url(#regShadow)" />
      <rect x="14" y="13" width="16" height="2.2" rx="1" fill="#0f172a" />
      <rect x="14" y="17.5" width="14" height="1.8" rx="0.9" fill="#64748b" />
      <rect x="14" y="21.5" width="16" height="1.8" rx="0.9" fill="#cbd5e1" />
      <rect x="14" y="25.5" width="12" height="1.8" rx="0.9" fill="#cbd5e1" />
      {/* Autonomous Scales of Justice / Academic Shield */}
      <g transform="translate(24, 17)">
        {/* Scales Balance Bar */}
        <rect x="0" y="3" width="18" height="1.8" rx="0.9" fill="#d97706" />
        <line x1="9" y1="1" x2="9" y2="16" stroke="#d97706" strokeWidth="1.5" />
        {/* Left Pan */}
        <path d="M 2 5 L 4 11 L 0 11 Z" fill="#f59e0b" opacity="0.8" />
        {/* Right Pan */}
        <path d="M 16 5 L 18 11 L 14 11 Z" fill="#f59e0b" opacity="0.8" />
        {/* Pedestal Base */}
        <rect x="5" y="16" width="8" height="2" rx="1" fill="#78350f" />
      </g>
    </svg>
  );
}

// 6. Fee Receipts & Scholarships Icon
function FeesScholarshipsIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="feeShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#0f172a" floodOpacity="0.1" />
        </filter>
        <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      {/* Official Voucher Receipt */}
      <rect x="10" y="8" width="24" height="33" rx="3.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" filter="url(#feeShadow)" />
      {/* Serrated voucher cutout circles on left/right edge */}
      <circle cx="10" cy="22" r="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="34" cy="22" r="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      {/* Receipt header & amount lines */}
      <rect x="14" y="13" width="13" height="2.2" rx="1" fill="#0f172a" />
      <rect x="14" y="17" width="10" height="1.6" rx="0.8" fill="#64748b" />
      <line x1="13" y1="22" x2="31" y2="22" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />
      <rect x="14" y="25" width="14" height="1.6" rx="0.8" fill="#cbd5e1" />
      <rect x="14" y="28.5" width="11" height="1.6" rx="0.8" fill="#cbd5e1" />
      {/* Paid / Verified Green Currency Shield */}
      <g transform="translate(23, 19)">
        <circle cx="8" cy="8" r="6.5" fill="url(#badgeGrad)" stroke="#065f46" strokeWidth="0.8" />
        <path d="M 5 8 L 7.2 10.2 L 11 6" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

const DEFAULT_DOC_CARDS = [
  {
    id: 'syllabus',
    title: 'Curriculum & Syllabus',
    subtitle: 'AICTE CBCS Scheme 2026',
    icon: <SyllabusIcon />,
    description: 'Autonomous semester course structure, subject credits, course outcomes (COs), and textbook references.'
  },
  {
    id: 'pyqs',
    title: 'Previous Question Papers',
    subtitle: 'Solved Papers (2022–2025)',
    icon: <PyqIcon />,
    description: 'University end-term exam question papers with official marking schemes and step-by-step solutions.'
  },
  {
    id: 'lab-manuals',
    title: 'Lab Manuals & Journals',
    subtitle: 'Semester 6 Experiments & Code',
    icon: <LabManualIcon />,
    description: 'Detailed lab problem statements, setup guides, verified source code, and practical viva question banks.'
  },
  {
    id: 'certificates',
    title: 'Bonafide & Certificates',
    subtitle: 'Instant Self-Service Issuance',
    icon: <CertificatesIcon />,
    description: 'Generate verified Bonafide Certificate, Railway Concession Pass, Internship NOC, and Fee Estimate.'
  },
  {
    id: 'regulations',
    title: 'Academic Regulations',
    subtitle: '75% Attendance & Grading Bylaws',
    icon: <RegulationsIcon />,
    description: 'Mandatory 75% attendance criteria, medical condonation bylaws, relative grading scale, and ATKT norms.'
  },
  {
    id: 'fees-scholarships',
    title: 'Fee Receipts & Aid',
    subtitle: 'Tuition Ledger & State Schemes',
    icon: <FeesScholarshipsIcon />,
    description: 'Semester tuition payment receipts, installment schedules, government e-scholarship forms, and concessions.'
  }
];

export default function DocumentCardGrid({
  cards = DEFAULT_DOC_CARDS,
  onCardClick,
  className = ''
}) {
  const toast = useToast();
  const [selectedCatId, setSelectedCatId] = React.useState('syllabus');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCardClick = (card) => {
    setSelectedCatId(card.id);
    if (onCardClick) {
      onCardClick(card);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className={`doc-cards-grid ${className}`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className="doc-card-item"
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick(card)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(card);
              }
            }}
          >
            <div className="doc-card-left">
              <div className="doc-card-icon-container" aria-hidden="true">
                {card.icon}
              </div>
              <div className="doc-card-meta">
                <span className="doc-card-title">{card.title}</span>
                <span className="doc-card-updated">{card.subtitle}</span>
              </div>
            </div>

            <div className="doc-card-arrow-btn" aria-hidden="true">
              <ArrowUpRight size={17} strokeWidth={2.2} />
            </div>
          </div>
        ))}
      </div>

      <DocumentRepositoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCategoryId={selectedCatId}
      />
    </>
  );
}
