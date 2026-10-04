import React, { useState } from 'react';
import {
  RotateCcw,
  Download,
  Printer,
  ShieldCheck,
  QrCode,
  GraduationCap,
  Sparkles,
  Award,
  Building2,
  Calendar,
  Phone,
  CheckCircle2,
  Wifi,
  CreditCard
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { printOfficialIDCard, downloadOfficialIDCard } from '../../lib/exportFormatHelper';

/**
 * Virtual Student ID Card Component for EduTrack.
 * Features 3D interactive flipping (Front & Back), smart RFID chip graphic,
 * dynamic female/male student avatars, barcode, QR code verification, and print/download.
 */
export default function VirtualIDCard({
  student,
  className = ''
}) {
  const { toast } = useToast?.() || {};
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardTheme, setCardTheme] = useState('emerald'); // 'emerald', 'sapphire', 'obsidian'

  const s = student || {
    name: 'Krrish Sharma',
    gender: 'Male',
    rollNumber: 101,
    prn: 'PRN-2024098101',
    course: 'IT',
    programFull: 'B.Tech in Information Technology',
    division: 'A',
    year: 3,
    semester: 'Semester 6',
    avatarUrl: '/assets/student_avatar.jpg',
    phone: '+91 98765 43210',
    location: 'Division A, Classroom 302',
    bloodGroup: 'O+'
  };

  const isFaculty = !s.rollNumber || String(s.prn || '').startsWith('FAC') || (s.standing && (s.standing.includes('Professor') || s.standing.includes('Faculty')));
  const isFemale = s.gender === 'Female';
  const bloodGroup = s.bloodGroup || (isFemale ? 'A+' : 'O+');
  const validUntil = isFaculty ? 'PERMANENT' : 'JUNE 2028';
  const libraryId = isFaculty ? `FAC-LIB-${s.prn || '101'}` : `LIB-${s.course}-${s.rollNumber}`;

  const handlePrint = () => {
    printOfficialIDCard(s, cardTheme);
    if (toast?.info) {
      toast.info('Generating Print Sheet', 'Opened official CR80 smart pass print layout.');
    }
  };

  const handleDownload = () => {
    downloadOfficialIDCard(s, cardTheme);
    if (toast?.success) {
      toast.success('Pass Downloaded', `Saved official digital pass for ${s.name} (${s.rollNumber || s.prn}).`);
    }
  };

  return (
    <div className={`virtual-id-card-container ${className}`}>
      {/* Control Bar: Flip & Theme Switcher */}
      <div className="id-card-controls-bar">
        <div className="id-card-controls-left">
          <button
            type="button"
            className="id-flip-action-btn"
            onClick={() => setIsFlipped((prev) => !prev)}
            title="Click to flip ID card"
          >
            <RotateCcw size={15} className={`flip-icon ${isFlipped ? 'rotated' : ''}`} />
            <span>{isFlipped ? 'View Front Side' : 'Flip to Back Side'}</span>
          </button>
          <span className="id-card-hint-pill">
            {isFaculty ? 'Faculty Smart Card' : 'Interactive 3D Smart Card'}
          </span>
        </div>

        <div className="id-card-theme-selector">
          <span className="id-theme-label">Pass Theme:</span>
          <button
            type="button"
            className={`id-theme-dot emerald ${cardTheme === 'emerald' ? 'active' : ''}`}
            onClick={() => setCardTheme('emerald')}
            title="Emerald University Theme"
          />
          <button
            type="button"
            className={`id-theme-dot sapphire ${cardTheme === 'sapphire' ? 'active' : ''}`}
            onClick={() => setCardTheme('sapphire')}
            title="Sapphire Academic Theme"
          />
          <button
            type="button"
            className={`id-theme-dot obsidian ${cardTheme === 'obsidian' ? 'active' : ''}`}
            onClick={() => setCardTheme('obsidian')}
            title="Obsidian Honor Theme"
          />
        </div>
      </div>

      {/* 3D Flip Card Scene */}
      <div className="id-card-perspective-box" onClick={() => setIsFlipped((prev) => !prev)}>
        <div className={`id-card-flipper ${isFlipped ? 'is-flipped' : ''} theme-${cardTheme}`}>
          
          {/* =================================================================
              FRONT SIDE: Digital Student or Faculty ID Pass
             ================================================================= */}
          <div className="id-card-face id-card-front">
            {/* Background Holographic Shimmer */}
            <div className="id-card-holo-strip" />

            {/* Institutional Header */}
            <div className="id-card-header">
              <div className="id-card-emblem-wrap">
                <img
                  src="/assets/edutrack_emblem_transparent.png"
                  alt="EduTrack Emblem"
                  className="id-card-emblem-img"
                />
              </div>
              <div className="id-card-header-titles">
                <span className="id-card-inst-name">EDUTRACK INSTITUTE OF TECHNOLOGY</span>
                <span className="id-card-inst-sub">AUTONOMOUS UNIVERSITY · ESTD. 2012</span>
                <span className="id-card-doc-type">
                  {isFaculty ? 'OFFICIAL FACULTY & STAFF SMART CARD' : 'OFFICIAL STUDENT IDENTITY CARD'}
                </span>
              </div>
              <div className="id-card-chip-nfc">
                <Wifi size={14} className="id-card-nfc-icon" />
              </div>
            </div>

            {/* Smart Card RFID Chip */}
            <div className="id-card-chip-row">
              <div className="id-smart-chip">
                <div className="id-chip-line l1" />
                <div className="id-chip-line l2" />
                <div className="id-chip-line l3" />
              </div>
              <span className="id-smart-chip-text">
                {isFaculty ? 'FACULTY RFID · STAFF GATE PASS' : 'RFID · NFC SMART PASS'}
              </span>
            </div>

            {/* Main Body: Photo & Credentials */}
            <div className="id-card-body">
              {/* Photo Box */}
              <div className="id-card-photo-col">
                <div className="id-card-photo-box">
                  <img
                    src={s.avatarUrl || (isFemale ? '/assets/female_student_avatar.jpg' : '/assets/student_avatar.jpg')}
                    alt={s.name}
                    className="id-card-photo-img"
                  />
                  <div className="id-card-valid-tag">VALID {validUntil}</div>
                </div>
                <div className="id-card-gender-badge">
                  {isFaculty
                    ? (isFemale ? '👩‍🏫 Female Faculty' : '👨‍🏫 Male Faculty')
                    : (isFemale ? '👩‍🎓 Female Candidate' : '👨‍🎓 Male Candidate')}
                </div>
              </div>

              {/* Details Column */}
              <div className="id-card-info-col">
                <div className="id-card-name-row">
                  <h3 className="id-card-student-name">{s.name.toUpperCase()}</h3>
                  <CheckCircle2 size={15} className="id-card-verified-icon" />
                </div>

                <div className="id-card-grid-meta">
                  <div className="id-meta-item">
                    <span className="id-meta-label">{isFaculty ? 'STAFF ID / PRN:' : 'ROLL NUMBER:'}</span>
                    <strong className="id-meta-val highlight">
                      {isFaculty ? (s.prn || 'FAC-IT-101') : `#${s.rollNumber} (${s.division || 'Div A'})`}
                    </strong>
                  </div>

                  <div className="id-meta-item">
                    <span className="id-meta-label">{isFaculty ? 'DESIGNATION:' : 'PRN ENROLMENT:'}</span>
                    <strong className="id-meta-val">
                      {isFaculty ? (s.standing || 'Senior Assistant Professor') : (s.prn || `PRN-2024098${s.rollNumber}`)}
                    </strong>
                  </div>

                  <div className="id-meta-item">
                    <span className="id-meta-label">{isFaculty ? 'CABIN / OFFICE:' : 'PROGRAM / DEGREE:'}</span>
                    <strong className="id-meta-val">
                      {isFaculty ? (s.location || 'Cabin 402, Block B') : `${s.course} · ${s.semester || 'Sem 6'}`}
                    </strong>
                  </div>

                  <div className="id-meta-item">
                    <span className="id-meta-label">BLOOD GROUP:</span>
                    <strong className="id-meta-val" style={{ color: '#ef4444' }}>{bloodGroup}</strong>
                  </div>

                  <div className="id-meta-item full">
                    <span className="id-meta-label">DEPARTMENT:</span>
                    <strong className="id-meta-val">
                      {isFaculty ? (s.department || s.course || 'Information Technology') : (s.programFull || `Bachelor of Technology in ${s.course}`)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Barcode, Validity, Seal */}
            <div className="id-card-footer">
              <div className="id-card-barcode-box">
                <div className="id-card-barcode-bars" />
                <span className="id-card-barcode-num">{s.prn || `PRN-2024098${s.rollNumber}`}</span>
              </div>
              <div className="id-card-auth-seal">
                <span className="id-seal-sign">Dr. Sanjay Verma</span>
                <span className="id-seal-title">Registrar Office (Seal)</span>
              </div>
            </div>
          </div>

          {/* =================================================================
              BACK SIDE: Barcode, Transit, Library & Terms
             ================================================================= */}
          <div className="id-card-face id-card-back">
            <div className="id-back-mag-strip" />

            <div className="id-back-content">
              <div className="id-back-header">
                <span className="id-back-inst-heading">INSTITUTIONAL REGULATIONS & SERVICES</span>
                <span className="id-back-emergency">Emergency: +91 22 2845 9900</span>
              </div>

              {/* Service Badges */}
              <div className="id-back-services-grid">
                <div className="id-service-cell">
                  <span className="id-service-label">Library Card No:</span>
                  <strong className="id-service-val">{libraryId}</strong>
                </div>
                <div className="id-service-cell">
                  <span className="id-service-label">Transit / Bus Pass:</span>
                  <strong className="id-service-val">Route #14 (Central Metro)</strong>
                </div>
                <div className="id-service-cell">
                  <span className="id-service-label">Campus Desk:</span>
                  <strong className="id-service-val">{s.location || 'Academic Block A'}</strong>
                </div>
                <div className="id-service-cell">
                  <span className="id-service-label">Emergency Contact:</span>
                  <strong className="id-service-val">{s.phone || '+91 98765 43210'}</strong>
                </div>
              </div>

              {/* Terms of Use */}
              <div className="id-back-terms-box">
                <ol className="id-back-terms-list">
                  <li>This card is non-transferable and remains institutional property.</li>
                  <li>Must be carried and presented during all examinations, lab sessions, and campus transit.</li>
                  <li>Report loss immediately to Academic Registry & Controller of Examinations.</li>
                </ol>
              </div>

              {/* QR Verification Box */}
              <div className="id-back-qr-row">
                <div className="id-back-qr-box">
                  <QrCode size={46} className="id-back-qr-svg" />
                </div>
                <div className="id-back-qr-meta">
                  <span className="id-qr-title">EduTrack Registry Verified</span>
                  <span className="id-qr-sub">Scan to authenticate candidate status</span>
                  <span className="id-qr-hash">HASH: EDU-{s.rollNumber}-2026-OK</span>
                </div>
              </div>

              <div className="id-back-footer-note">
                OFFICE OF THE REGISTRAR · EDUTRACK INSTITUTE OF TECHNOLOGY · CAMPUS BLOCK 04
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons: Print, Download, Flip Hint */}
      <div className="id-card-actions-row">
        <button
          type="button"
          className="id-action-btn secondary"
          onClick={() => setIsFlipped((prev) => !prev)}
        >
          <RotateCcw size={15} />
          <span>Flip Card (Front / Back)</span>
        </button>

        <button
          type="button"
          className="id-action-btn primary"
          onClick={handlePrint}
        >
          <Printer size={15} />
          <span>Print Smart Pass</span>
        </button>

        <button
          type="button"
          className="id-action-btn success"
          onClick={handleDownload}
        >
          <Download size={15} />
          <span>Download Digital Card</span>
        </button>
      </div>
    </div>
  );
}
