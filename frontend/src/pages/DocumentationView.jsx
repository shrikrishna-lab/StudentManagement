import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen,
  Layers,
  Database,
  Shield,
  Zap,
  Presentation,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cpu,
  Monitor,
  Send,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  Lock,
  Unlock,
  Ticket,
  GraduationCap,
  Users,
  Code,
  Globe,
  Radio,
  Clock,
  Terminal,
  FileText,
  Sparkles,
  HelpCircle,
  BarChart3,
  X,
  Search,
  Activity,
  Trash2,
  Download
} from 'lucide-react';
import { studentService } from '../services/studentService';
import { useToast } from '../context/ToastContext';

// =========================================================================
// PRESET LIVE API SIMULATIONS
// =========================================================================
const PRESET_REQUESTS = [
  {
    id: 'health',
    title: 'Health & Diagnostics Ping',
    method: 'GET',
    endpoint: '/api/health',
    description: 'Pings MySQL 8.0 connection pool, retrieves latency, active connections, and table diagnostics.',
    category: 'System'
  },
  {
    id: 'students',
    title: 'Fetch All Students Roster',
    method: 'GET',
    endpoint: '/api/students',
    description: 'Queries MySQL students table with real-time attendance, semester, course, and CGPA metrics.',
    category: 'Students'
  },
  {
    id: 'analytics',
    title: 'System KPI & Institutional Overview',
    method: 'GET',
    endpoint: '/api/analytics/overview',
    description: 'Aggregates department-wise distribution, average marks, attendance health, and fee collection.',
    category: 'Analytics'
  },
  {
    id: 'clearance',
    title: 'Hall Ticket Clearance Roster',
    method: 'GET',
    endpoint: '/api/clearance',
    description: 'Retrieves multi-department clearance gatekeeper records (Accounts, Library, Lab, HOD).',
    category: 'Clearance'
  },
  {
    id: 'security',
    title: 'Security Approvals & 2FA Queue',
    method: 'GET',
    endpoint: '/api/security/requests',
    description: 'Lists pending Dean waiver requests, medical condonations, and session approval queue.',
    category: 'Security'
  },
  {
    id: 'assignments',
    title: 'Coursework & Deliverables Registry',
    method: 'GET',
    endpoint: '/api/assignments',
    description: 'Retrieves active academic coursework, submission deadlines, and evaluation grading records.',
    category: 'Academics'
  }
];

// =========================================================================
// PRESENTATION SLIDES DATA
// =========================================================================
const PRESENTATION_SLIDES = [
  {
    id: 1,
    category: 'OVERVIEW & MOTIVATION',
    title: 'EduTrack Enterprise ERP & Real-Time Engine',
    subtitle: 'Next-Generation Unified Student Management System for Autonomous Higher-Ed Institutions',
    badge: 'Project Showcase',
    bullets: [
      {
        heading: 'The Problem with Legacy Campus ERPs',
        desc: 'Fragmented databases, sluggish page refreshes, disconnected student/faculty portals, and lack of automated compliance gatekeepers.'
      },
      {
        heading: 'The EduTrack Unified Solution',
        desc: 'A single, high-performance web platform combining 3 specialized consoles (Admin, Faculty, Student) powered by a dual-engine architecture: REST API + MySQL WebSocket event streaming.'
      },
      {
        heading: 'Autonomous Academic Framework (Scheme 2026)',
        desc: 'Native support for AICTE/CBCS 10-point SGPA/CGPA evaluation, strict 75% attendance gatekeeping, anti-counterfeit admit cards, and verified document repository.'
      }
    ],
    metrics: [
      { label: 'Unified Portals', value: '3 in 1' },
      { label: 'Relational Tables', value: '20+' },
      { label: 'Realtime Latency', value: '< 15 ms' },
      { label: 'Compliance Standard', value: 'AICTE CBCS' }
    ]
  },
  {
    id: 2,
    category: 'SYSTEM ARCHITECTURE',
    title: 'Full-Stack Architecture & Reactive Pipeline',
    subtitle: 'High-availability architecture designed for zero data collisions and instant state synchronization',
    badge: 'Core Engine',
    bullets: [
      {
        heading: 'Frontend Presentation Layer',
        desc: 'Built with React 18, Vite, and custom Apple macOS-grade CSS design system with fluid typography, glassmorphism, and responsive drawer navigation.'
      },
      {
        heading: 'Enterprise Node.js / Express Server',
        desc: 'Stateless RESTful API handling business rules, parameter sanitization, and structured error boundaries on port 5000.'
      },
      {
        heading: 'Persistent WebSocket Broadcast Engine',
        desc: 'Concurrent WebSocket server broadcasting state mutations (e.g., student admission, clearance changes) across all connected clients simultaneously.'
      },
      {
        heading: 'Robust MySQL 8.0 Relational Core',
        desc: 'Configured with HikariCP-like connection pooling (mysql2/promise), transactional guarantees, foreign key cascades, and automated schema migrations.'
      }
    ],
    metrics: [
      { label: 'Frontend Stack', value: 'React 18 + Vite' },
      { label: 'Backend Runtime', value: 'Node.js Express' },
      { label: 'Database', value: 'MySQL 8.0' },
      { label: 'Realtime Protocol', value: 'WebSockets (RFC 6455)' }
    ]
  },
  {
    id: 3,
    category: 'THREE-PORTAL ROLE SYSTEM',
    title: 'Role-Based Access Control (RBAC) Matrix',
    subtitle: 'Zero privilege leakage with tailored interfaces for Students, Faculty, and Institutional Administrators',
    badge: 'Role Security',
    bullets: [
      {
        heading: 'Student Portal (Self-Service Hub)',
        desc: 'Live attendance gauge with subject-level breakdown, CBCS grade card, official admit card / hall ticket preview, coursework submission, and digital student ID card.'
      },
      {
        heading: 'Faculty Console (Teaching & Evaluation)',
        desc: 'Batch attendance marker, assignment manager, multi-component grading (Theory, Practical Viva, Capstone Defense), and invigilation allocation.'
      },
      {
        heading: 'Administrator Console (Institutional Control)',
        desc: 'Master institutional dashboard, automated student enrollment & credential slip generator, security approval vault, timetable matrix, and document scanner.'
      }
    ],
    metrics: [
      { label: 'Student Self-Service', value: '100%' },
      { label: 'Role Isolation', value: 'Strict RBAC' },
      { label: 'Credential Slips', value: 'Automated' },
      { label: 'Audit Trail', value: 'Timestamped' }
    ]
  },
  {
    id: 4,
    category: 'EXAMINATION GATEKEEPER',
    title: 'Automated 75% Attendance & Clearance Gatekeeper',
    subtitle: 'Algorithmic enforcement of university examination eligibility regulations',
    badge: 'Gatekeeper Rule',
    bullets: [
      {
        heading: 'Strict 75% Threshold Validation',
        desc: 'Every candidate must maintain >= 75.0% cumulative attendance. The ERP automatically withholds admit cards for candidates failing this threshold.'
      },
      {
        heading: 'Four-Tier Departmental Clearance',
        desc: 'Clearance records track Accounts (fee clearance), Library (book returns), Laboratory (breakage dues), and HOD academic endorsement.'
      },
      {
        heading: 'Dean Waiver & Medical Condonation Workflow',
        desc: 'Students with genuine medical grounds or special institutional deputations can submit waiver requests directly routed to the Dean / Admin approval queue.'
      },
      {
        heading: 'Cryptographic Anti-Counterfeit Admit Card',
        desc: 'Admit cards feature photo verification badges, anti-counterfeit high-density barcodes, dynamic exam room allocations, and invigilator rosters.'
      }
    ],
    metrics: [
      { label: 'Eligibility Gate', value: '75.0% Min' },
      { label: 'Clearance Tiers', value: '4 Pillars' },
      { label: 'Dean Override', value: 'Audit Logged' },
      { label: 'Barcode Verification', value: 'Instant' }
    ]
  },
  {
    id: 5,
    category: 'DOCUMENT REPOSITORY & ACADEMICS',
    title: 'Verified Institutional Academic Repository',
    subtitle: 'Centralized repository for curriculum syllabi, previous question papers, and self-service certificates',
    badge: 'Knowledge Hub',
    bullets: [
      {
        heading: 'Autonomous Scheme 2026 Syllabi',
        desc: 'Structured curriculum syllabi with lecture-tutorial-practical (L-T-P) distribution, unit breakdown, and prescribed textbooks.'
      },
      {
        heading: 'Solved Previous Year Question Papers (PYQs)',
        desc: 'Comprehensive archive of end-semester examinations with marking schemes and solution keys.'
      },
      {
        heading: 'Laboratory Manuals & Standard Code Templates',
        desc: 'Official lab journals, experiment test vectors, and Viva-voce question banks.'
      },
      {
        heading: 'One-Click Bonafide & Certificate Generation',
        desc: 'Official stamped bonafide certificates and fee receipts ready for instant A4 printing and PDF export.'
      }
    ],
    metrics: [
      { label: 'Repository Categories', value: '6 Curated' },
      { label: 'Document Formats', value: 'PDF / Markdown' },
      { label: 'Export Options', value: 'Print / Download' },
      { label: 'Search Latency', value: '< 5 ms' }
    ]
  },
  {
    id: 6,
    category: 'LIVE DATA SIMULATION',
    title: 'Real-Time Sync: The Request-Response Lifecycle',
    subtitle: 'Demonstrating sub-second bidirectional state synchronization across all connected clients',
    badge: 'Live Demo',
    bullets: [
      {
        heading: 'Step 1: Client Action Dispatch',
        desc: 'When an admin admits a student or approves a clearance waiver, a structured HTTP mutation payload is dispatched to the backend.'
      },
      {
        heading: 'Step 2: Database Persistence & Atomic Commit',
        desc: 'The backend validates authorization, executes parameterized SQL queries against MySQL 8.0, and commits the transaction.'
      },
      {
        heading: 'Step 3: Realtime WebSocket Broadcast',
        desc: 'Immediately following DB write, the WebSocket engine broadcasts an event packet (e.g. STUDENT_ADDED, CLEARANCE_UPDATED) to all active client sockets.'
      },
      {
        heading: 'Step 4: Reactive UI Re-render',
        desc: 'All connected browsers immediately update their internal cache and trigger smooth reactive DOM reconciliation with zero manual refresh required.'
      }
    ],
    metrics: [
      { label: 'Sync Mechanism', value: 'WebSocket Broadcast' },
      { label: 'Polling Required', value: '0% (Zero)' },
      { label: 'Packet Overhead', value: '< 200 Bytes' },
      { label: 'UI Re-render', value: 'Instant' }
    ]
  }
];

// =========================================================================
// DATABASE SCHEMAS DEFINITION
// =========================================================================
const SCHEMA_TABLES = [
  {
    name: 'students',
    description: 'Core student entity tracking enrollments, biometrics, academic standing, and fees.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PK', desc: 'Internal unique student record ID' },
      { name: 'roll_number', type: 'INT UNIQUE', key: 'UK', desc: 'Official roll number (e.g. 101, 102)' },
      { name: 'name', type: 'VARCHAR(120)', key: '', desc: 'Candidate full legal name' },
      { name: 'email', type: 'VARCHAR(150)', key: '', desc: 'Institutional email address' },
      { name: 'phone', type: 'VARCHAR(20)', key: '', desc: 'Contact mobile number' },
      { name: 'course', type: 'VARCHAR(50)', key: '', desc: 'Department program (IT, CS, EXTC, AI-DS)' },
      { name: 'semester', type: 'VARCHAR(30)', key: '', desc: 'Enrolled academic semester (Semester 6)' },
      { name: 'division', type: 'VARCHAR(10)', key: '', desc: 'Class division section (A, B, C)' },
      { name: 'attendance', type: 'FLOAT', key: '', desc: 'Cumulative physical attendance percentage' },
      { name: 'marks', type: 'FLOAT', key: '', desc: 'Calculated cumulative academic score' },
      { name: 'fee_status', type: 'ENUM', key: '', desc: "'paid', 'partial', 'pending'" },
      { name: 'avatar_url', type: 'VARCHAR(255)', key: '', desc: 'Verified candidate biometric photo URL' }
    ]
  },
  {
    name: 'clearance_records',
    description: 'Four-tier examination gatekeeper tracking departmental approvals and admit card issuance.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PK', desc: 'Unique clearance record ID' },
      { name: 'roll_number', type: 'INT', key: 'FK', desc: 'References students(roll_number)' },
      { name: 'accounts_cleared', type: 'TINYINT(1)', key: '', desc: '1 if tuition and hostel fees settled' },
      { name: 'library_cleared', type: 'TINYINT(1)', key: '', desc: '1 if all borrowed books returned' },
      { name: 'laboratory_cleared', type: 'TINYINT(1)', key: '', desc: '1 if practical journal and viva completed' },
      { name: 'hod_approved', type: 'TINYINT(1)', key: '', desc: '1 if Head of Department authorized' },
      { name: 'hall_ticket_issued', type: 'TINYINT(1)', key: '', desc: '1 if Admit Card unlocked for student' },
      { name: 'updated_at', type: 'TIMESTAMP', key: '', desc: 'Last authorization change timestamp' }
    ]
  },
  {
    name: 'security_requests',
    description: 'Dean waiver appeals, medical condonation filings, and administrative 2FA audit vault.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PK', desc: 'Unique approval request ticket ID' },
      { name: 'student_roll', type: 'INT', key: 'FK', desc: 'References students(roll_number)' },
      { name: 'student_name', type: 'VARCHAR(120)', key: '', desc: 'Candidate name for quick indexing' },
      { name: 'request_type', type: 'VARCHAR(80)', key: '', desc: 'Medical Condonation, Dean Waiver, Attendance Appeal' },
      { name: 'status', type: 'ENUM', key: '', desc: "'PENDING', 'APPROVED', 'REJECTED'" },
      { name: 'reason', type: 'TEXT', key: '', desc: 'Detailed justification and medical certificate ref' },
      { name: 'approver', type: 'VARCHAR(100)', key: '', desc: 'Authorized Dean / Examination Board Member' },
      { name: 'created_at', type: 'TIMESTAMP', key: '', desc: 'Date and time of ticket submission' }
    ]
  },
  {
    name: 'teachers',
    description: 'Faculty directory tracking department allocations, designations, and assigned classrooms.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PK', desc: 'Unique faculty ID' },
      { name: 'teacher_code', type: 'VARCHAR(30)', key: 'UK', desc: 'Faculty registration code (FAC-IT-101)' },
      { name: 'name', type: 'VARCHAR(120)', key: '', desc: 'Professor / Instructor full name' },
      { name: 'department', type: 'VARCHAR(60)', key: '', desc: 'Academic department' },
      { name: 'designation', type: 'VARCHAR(80)', key: '', desc: 'Associate Professor, Assistant Professor, HOD' },
      { name: 'email', type: 'VARCHAR(150)', key: '', desc: 'Official faculty email address' }
    ]
  },
  {
    name: 'assignments',
    description: 'Coursework assignments, project deliverables, deadlines, and submission records.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PK', desc: 'Assignment primary key' },
      { name: 'title', type: 'VARCHAR(180)', key: '', desc: 'Assignment coursework title' },
      { name: 'course', type: 'VARCHAR(50)', key: '', desc: 'Target course (e.g. IT, CS)' },
      { name: 'due_date', type: 'DATE', key: '', desc: 'Strict submission deadline' },
      { name: 'max_marks', type: 'INT', key: '', desc: 'Maximum evaluable grade weightage' },
      { name: 'status', type: 'VARCHAR(40)', key: '', desc: 'Active, Closed, Evaluated' }
    ]
  },
  {
    name: 'marks',
    description: 'Autonomous CBCS academic evaluation scores, continuous assessment, practical viva, and relative grades.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PK', desc: 'Unique grade evaluation record ID' },
      { name: 'roll_number', type: 'INT', key: 'FK', desc: 'References students(roll_number)' },
      { name: 'subject_code', type: 'VARCHAR(30)', key: '', desc: 'Curriculum subject code (e.g. IT601)' },
      { name: 'subject_name', type: 'VARCHAR(120)', key: '', desc: 'Subject module name' },
      { name: 'mid_term', type: 'FLOAT', key: '', desc: 'Internal mid-term score (30 max)' },
      { name: 'end_term', type: 'FLOAT', key: '', desc: 'Autonomous university end-term score (70 max)' },
      { name: 'practical_viva', type: 'FLOAT', key: '', desc: 'Laboratory practical & viva score (50 max)' },
      { name: 'total_marks', type: 'FLOAT', key: '', desc: 'Cumulative score weighted out of 100' },
      { name: 'grade_point', type: 'INT', key: '', desc: 'AICTE 10-point relative grade point index (0 to 10)' }
    ]
  },
  {
    name: 'attendance_logs',
    description: 'Session-level biometric and classroom physical attendance logs with faculty signatures.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PK', desc: 'Unique attendance log record ID' },
      { name: 'roll_number', type: 'INT', key: 'FK', desc: 'References students(roll_number)' },
      { name: 'attendance_date', type: 'DATE', key: '', desc: 'Session date of academic instruction' },
      { name: 'subject_code', type: 'VARCHAR(30)', key: '', desc: 'Target subject course code' },
      { name: 'status', type: 'ENUM', key: '', desc: "'PRESENT', 'ABSENT', 'CONDONED'" },
      { name: 'marked_by', type: 'VARCHAR(50)', key: '', desc: 'Instructor faculty registration code' }
    ]
  },
  {
    name: 'fee_ledger',
    description: 'Accounts reconciliation ledger tracking tuition, lab dues, transaction IDs, and settlement status.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PK', desc: 'Unique transaction ledger ID' },
      { name: 'roll_number', type: 'INT', key: 'FK', desc: 'References students(roll_number)' },
      { name: 'transaction_ref', type: 'VARCHAR(64) UNIQUE', key: 'UK', desc: 'Bank clearance reference or transaction hash' },
      { name: 'semester_term', type: 'VARCHAR(30)', key: '', desc: 'Billing academic term (Semester 6)' },
      { name: 'tuition_fee', type: 'DECIMAL(10,2)', key: '', desc: 'Prescribed tuition & academic term fee' },
      { name: 'laboratory_fee', type: 'DECIMAL(10,2)', key: '', desc: 'Laboratory consumables and equipment fees' },
      { name: 'amount_paid', type: 'DECIMAL(10,2)', key: '', desc: 'Realized student payment amount' },
      { name: 'payment_status', type: 'ENUM', key: '', desc: "'PAID', 'PARTIAL', 'PENDING'" }
    ]
  },
  {
    name: 'exam_schedules',
    description: 'End-semester autonomous examination timetable matrix with room and invigilator rosters.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PK', desc: 'Unique exam timetable slot ID' },
      { name: 'course', type: 'VARCHAR(50)', key: '', desc: 'Target branch program (IT, CS, EXTC)' },
      { name: 'semester', type: 'VARCHAR(30)', key: '', desc: 'Target academic semester' },
      { name: 'subject_code', type: 'VARCHAR(30)', key: '', desc: 'University paper code' },
      { name: 'subject_name', type: 'VARCHAR(120)', key: '', desc: 'Official examination paper name' },
      { name: 'exam_date', type: 'DATE', key: '', desc: 'Scheduled examination session date' },
      { name: 'start_time', type: 'TIME', key: '', desc: 'Session opening time' },
      { name: 'duration_mins', type: 'INT', key: '', desc: 'Session length in minutes (e.g. 180)' },
      { name: 'room_number', type: 'VARCHAR(50)', key: '', desc: 'Allocated exam hall number' }
    ]
  }
];

export default function DocumentationView({ onBackToApp }) {
  const toast = useToast?.() || {};

  // Active Documentation Navigation Section
  const [activeSection, setActiveSection] = useState('presentation'); // 'presentation' | 'simulator' | 'architecture' | 'schema' | 'security' | 'roles'

  // Presentation Slide State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [copiedSlide, setCopiedSlide] = useState(false);
  const presentationContainerRef = useRef(null);

  // Live API Simulator State
  const [selectedPreset, setSelectedPreset] = useState(PRESET_REQUESTS[0]);
  const [customMethod, setCustomMethod] = useState('GET');
  const [customEndpoint, setCustomEndpoint] = useState('/api/health');
  const [customBody, setCustomBody] = useState('{\n  "note": "Presentation live ping test"\n}');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLatency, setApiLatency] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Multi-Endpoint Batch Diagnostics State
  const [batchTesting, setBatchTesting] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  // Schema Search & DDL State
  const [schemaSearch, setSchemaSearch] = useState('');
  const [copiedDDL, setCopiedDDL] = useState(false);

  // Scroll to Top State
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Realtime WebSocket Event Feed
  const [wsEvents, setWsEvents] = useState([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      event: 'WS_STATUS',
      source: 'MySQL Engine',
      payload: { connected: true, engine: 'MySQL 8.0 WebSocket Streamer', port: 5000 }
    }
  ]);
  const [isWsLive, setIsWsLive] = useState(true);

  // Unlock document scrolling when Docs view is mounted
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyHeight = document.body.style.height;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.height = prevBodyHeight;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  // Track scroll position to show / hide "Back to Top" floating button
  useEffect(() => {
    const scrollContainer = document.getElementById('docs-scroll-root');
    const handleScroll = () => {
      const top = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      setShowScrollTop(top > 240);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.getElementById('docs-scroll-root');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Presentation Auto Play Interval (every 5 seconds)
  useEffect(() => {
    if (!isAutoPlay || activeSection !== 'presentation') return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev < PRESENTATION_SLIDES.length - 1 ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, activeSection]);

  // Listen to live WebSocket events in the app
  useEffect(() => {
    const handleRealtimeEvent = (e) => {
      if (e.detail) {
        setWsEvents((prev) => [
          {
            id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            timestamp: new Date().toLocaleTimeString(),
            event: e.detail.event || 'REALTIME_BROADCAST',
            source: 'Backend Socket',
            payload: e.detail.payload || e.detail
          },
          ...prev.slice(0, 19)
        ]);
      }
    };

    const handleWsStatus = (e) => {
      if (e.detail) {
        setIsWsLive(Boolean(e.detail.connected));
      }
    };

    window.addEventListener('edutrack_realtime_event', handleRealtimeEvent);
    window.addEventListener('edutrack_db_status', handleWsStatus);

    return () => {
      window.removeEventListener('edutrack_realtime_event', handleRealtimeEvent);
      window.removeEventListener('edutrack_db_status', handleWsStatus);
    };
  }, []);

  // Keyboard navigation for presentation slides (without blocking page vertical scroll!)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const targetTag = e.target?.tagName?.toUpperCase();
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }

      if (activeSection === 'presentation') {
        if (e.key === 'ArrowRight') {
          handleNextSlide();
        } else if (e.key === 'ArrowLeft') {
          handlePrevSlide();
        } else if (isFullscreen) {
          if (e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            handleNextSlide();
          } else if (e.key === 'PageUp') {
            e.preventDefault();
            handlePrevSlide();
          } else if (e.key === 'Escape') {
            setIsFullscreen(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, currentSlideIndex, isFullscreen]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < PRESENTATION_SLIDES.length - 1 ? prev + 1 : 0));
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : PRESENTATION_SLIDES.length - 1));
  };

  // Toggle presentation fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (presentationContainerRef.current?.requestFullscreen) {
        presentationContainerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Execute Live API Request
  const handleExecuteRequest = async (overrideEndpoint, overrideMethod) => {
    const endpoint = overrideEndpoint || customEndpoint;
    const method = overrideMethod || customMethod;
    setApiLoading(true);
    setApiResponse(null);
    setApiStatus(null);
    const startTime = performance.now();

    try {
      const url = `http://localhost:5000${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Source': 'EduTrack-Presentation-Simulator'
        }
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && customBody.trim()) {
        try {
          options.body = JSON.stringify(JSON.parse(customBody));
        } catch {
          options.body = customBody;
        }
      }

      const res = await fetch(url, options);
      const latency = Math.round(performance.now() - startTime);
      setApiLatency(latency);
      setApiStatus(`${res.status} ${res.statusText}`);

      let data;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setApiResponse(data);

      // Append to local event feed
      setWsEvents((prev) => [
        {
          id: `req-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          event: `HTTP_${method}_SUCCESS`,
          source: 'Live Simulator',
          payload: { endpoint, status: res.status, latencyMs: latency, summary: 'Executed real-time request' }
        },
        ...prev.slice(0, 19)
      ]);

      if (toast?.success) {
        toast.success(`Request ${res.status} OK`, `${method} ${endpoint} completed in ${latency}ms.`);
      }
    } catch (err) {
      const latency = Math.round(performance.now() - startTime);
      setApiLatency(latency);
      setApiStatus('Network Error / Backend Unreachable');
      setApiResponse({
        error: err.message,
        hint: 'Ensure server is running on port 5000 with MySQL connection active.'
      });

      if (toast?.error) {
        toast.error('Request Failed', err.message);
      }
    } finally {
      setApiLoading(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setCustomMethod(preset.method);
    setCustomEndpoint(preset.endpoint);
    handleExecuteRequest(preset.endpoint, preset.method);
  };

  const handleCopyResponse = () => {
    if (!apiResponse) return;
    navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy Slide Summary to Clipboard
  const handleCopySlide = () => {
    const slide = PRESENTATION_SLIDES[currentSlideIndex];
    if (!slide) return;
    const bulletsText = slide.bullets?.map((b) => `• ${b.heading}: ${b.desc}`).join('\n') || '';
    const metricsText = slide.metrics?.map((m) => `${m.label}: ${m.value}`).join(' | ') || '';
    const summary = `EduTrack Presentation - Slide ${currentSlideIndex + 1}: ${slide.title}\n${slide.subtitle}\n\nCategory: ${slide.category}\n\nKey Pillars:\n${bulletsText}\n\nMetrics:\n${metricsText}`;
    navigator.clipboard.writeText(summary);
    setCopiedSlide(true);
    setTimeout(() => setCopiedSlide(false), 2000);
  };

  // Multi-Endpoint Parallel Health Diagnostics Runner
  const handleRunBatchDiagnostics = async () => {
    setBatchTesting(true);
    setBatchResults(null);

    const promises = PRESET_REQUESTS.map(async (preset) => {
      const startTime = performance.now();
      try {
        const url = `http://localhost:5000${preset.endpoint}`;
        const res = await fetch(url, {
          method: preset.method,
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Source': 'EduTrack-Batch-Diagnostics'
          }
        });
        const latency = Math.round(performance.now() - startTime);
        return {
          id: preset.id,
          title: preset.title,
          endpoint: preset.endpoint,
          method: preset.method,
          status: `${res.status} ${res.statusText}`,
          statusCode: res.status,
          latency,
          ok: res.ok
        };
      } catch (err) {
        const latency = Math.round(performance.now() - startTime);
        return {
          id: preset.id,
          title: preset.title,
          endpoint: preset.endpoint,
          method: preset.method,
          status: 'Connection Error',
          statusCode: 0,
          latency,
          ok: false,
          error: err.message
        };
      }
    });

    const results = await Promise.all(promises);
    setBatchResults(results);
    setBatchTesting(false);

    setWsEvents((prev) => [
      {
        id: `batch-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        event: 'DIAGNOSTIC_BATCH_RUN',
        source: 'System Diagnostics',
        payload: {
          endpointsTested: results.length,
          allPassed: results.every((r) => r.ok),
          avgLatencyMs: Math.round(results.reduce((a, b) => a + b.latency, 0) / results.length)
        }
      },
      ...prev.slice(0, 19)
    ]);
  };

  // Clear WebSocket Event Log
  const handleClearWsLogs = () => {
    setWsEvents([]);
  };

  // Search filter for MySQL 8.0 schema tables
  const filteredSchemaTables = useMemo(() => {
    if (!schemaSearch.trim()) return SCHEMA_TABLES;
    const q = schemaSearch.toLowerCase();
    return SCHEMA_TABLES.filter((table) => {
      const nameMatch = table.name.toLowerCase().includes(q);
      const descMatch = table.description.toLowerCase().includes(q);
      const colMatch = table.columns.some(
        (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)
      );
      return nameMatch || descMatch || colMatch;
    });
  }, [schemaSearch]);

  // Copy Complete MySQL Schema DDL
  const handleCopyDDL = () => {
    const ddl = filteredSchemaTables
      .map((t) => {
        const colDefs = t.columns
          .map((c) => {
            let def = `  \`${c.name}\` ${c.type}`;
            if (c.key === 'PK') def += ' PRIMARY KEY';
            if (c.key === 'UK') def += ' UNIQUE';
            return `${def} COMMENT '${c.desc.replace(/'/g, "\\'")}'`;
          })
          .join(',\n');
        return `CREATE TABLE IF NOT EXISTS \`${t.name}\` (\n${colDefs}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n`;
      })
      .join('\n');
    navigator.clipboard.writeText(ddl);
    setCopiedDDL(true);
    setTimeout(() => setCopiedDDL(false), 2000);
  };

  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  return (
    <div className="docs-page-shell" ref={presentationContainerRef}>
      {/* =========================================================================
          TOP COMMAND BAR & PRESENTATION NAVIGATION
          ========================================================================= */}
      <header className="docs-top-navbar">
        <div className="docs-brand-cluster">
          <div className="docs-brand-badge">
            <GraduationCap size={20} className="docs-brand-icon" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="docs-brand-title">EduTrack Architecture & Presentation Hub</h1>
              <span className="docs-version-chip">v2.4.0 Live Enterprise</span>
            </div>
            <p className="docs-brand-subtitle">
              System Blueprint, Interactive Request Lifecycle, MySQL 8.0 Schema, and Evaluation Pitch Deck
            </p>
          </div>
        </div>

        <div className="docs-nav-controls">
          <button
            type="button"
            className="docs-back-btn"
            onClick={onBackToApp}
            title="Return to the active ERP workspace"
          >
            <ArrowLeft size={15} />
            <span>Back to Application</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          SECTION SWITCHER PILL TABS
          ========================================================================= */}
      <nav className="docs-section-tab-bar" aria-label="Documentation Sections">
        {[
          { id: 'presentation', label: 'Presentation Pitch Deck', icon: Presentation, badge: 'Slides' },
          { id: 'simulator', label: 'Live Request & WS Simulator', icon: Zap, badge: 'Interactive' },
          { id: 'architecture', label: 'System Architecture', icon: Layers, badge: 'Full Stack' },
          { id: 'schema', label: 'MySQL 8.0 Database Schema', icon: Database, badge: '20+ Tables' },
          { id: 'security', label: '75% Gatekeeper & Clearance', icon: Shield, badge: 'Workflow' },
          { id: 'roles', label: 'Console & Role Matrix', icon: Users, badge: 'RBAC' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`docs-section-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSection(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && <span className="docs-tab-badge">{tab.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* =========================================================================
          VIEW 1: PRESENTATION SLIDE DECK (IDEAL FOR EVALUATIONS & VIVA DEMOS)
          ========================================================================= */}
      {activeSection === 'presentation' && (
        <section className={`docs-slide-deck-container ${isFullscreen ? 'fullscreen' : ''}`}>
          {/* Slide Deck Top Progress Line */}
          <div className="docs-slide-progress-track">
            <div
              className="docs-slide-progress-fill"
              style={{ width: `${((currentSlideIndex + 1) / PRESENTATION_SLIDES.length) * 100}%` }}
            />
          </div>

          {/* Slide Stage Header */}
          <div className="docs-slide-controls-bar">
            <div className="docs-slide-meta-left">
              <span className="docs-slide-counter-chip">
                Slide <strong>{currentSlideIndex + 1}</strong> of {PRESENTATION_SLIDES.length}
              </span>
              <span className="docs-slide-category-chip">{currentSlide.category}</span>
            </div>

            <div className="docs-slide-actions-right">
              {/* Auto Play Toggle */}
              <button
                type="button"
                className={`docs-slide-action-pill ${isAutoPlay ? 'active' : ''}`}
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                title={isAutoPlay ? 'Pause 5-second slide auto-play' : 'Start 5-second automatic slide show'}
              >
                {isAutoPlay ? <Pause size={13} /> : <Play size={13} />}
                <span>{isAutoPlay ? 'Auto Play (Active)' : 'Auto Play'}</span>
              </button>

              {/* Copy Slide Talking Points */}
              <button
                type="button"
                className="docs-slide-action-pill"
                onClick={handleCopySlide}
                title="Copy slide summary and key talking points"
              >
                {copiedSlide ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                <span>{copiedSlide ? 'Copied' : 'Copy Points'}</span>
              </button>

              <span className="docs-keyboard-hint">
                Use <kbd>←</kbd> <kbd>→</kbd> Arrow keys
              </span>

              <button
                type="button"
                className="docs-icon-action-btn"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Presentation Mode'}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          {/* Slide Quick-Jump Pill Bar */}
          <div className="docs-slide-nav-pills">
            {PRESENTATION_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={`docs-slide-nav-pill ${idx === currentSlideIndex ? 'active' : ''}`}
                onClick={() => setCurrentSlideIndex(idx)}
                title={slide.title}
              >
                <span className="pill-num">0{idx + 1}</span>
                <span className="pill-title">{slide.category.split('&')[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* Slide Canvas */}
          <article className="docs-slide-canvas">
            <div className="docs-slide-badge-row">
              <span className="docs-slide-status-pill">
                <Sparkles size={13} />
                <span>{currentSlide.badge}</span>
              </span>
            </div>

            <h2 className="docs-slide-title">{currentSlide.title}</h2>
            <p className="docs-slide-subtitle">{currentSlide.subtitle}</p>

            {/* Slide Key Pillars Grid */}
            <div className="docs-slide-bullets-grid">
              {currentSlide.bullets.map((b, idx) => (
                <div key={idx} className="docs-slide-bullet-card">
                  <div className="docs-bullet-header">
                    <span className="docs-bullet-num">{idx + 1}</span>
                    <h3 className="docs-bullet-heading">{b.heading}</h3>
                  </div>
                  <p className="docs-bullet-desc">{b.desc}</p>
                </div>
              ))}
            </div>

            {/* Slide Bottom Metrics Row */}
            <div className="docs-slide-metrics-strip">
              {currentSlide.metrics.map((m, idx) => (
                <div key={idx} className="docs-slide-metric-item">
                  <span className="docs-metric-value">{m.value}</span>
                  <span className="docs-metric-label">{m.label}</span>
                </div>
              ))}
            </div>
          </article>

          {/* Slide Deck Bottom Control Nav */}
          <footer className="docs-slide-footer-nav">
            <button
              type="button"
              className="docs-slide-nav-btn prev"
              onClick={handlePrevSlide}
              title="Previous Slide (Left Arrow)"
            >
              <ArrowLeft size={16} />
              <span>Previous Slide</span>
            </button>

            {/* Dots Pagination */}
            <div className="docs-slide-dots-row">
              {PRESENTATION_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`docs-slide-dot ${idx === currentSlideIndex ? 'active' : ''}`}
                  onClick={() => setCurrentSlideIndex(idx)}
                  title={`Go to Slide ${idx + 1}: ${slide.title}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="docs-slide-nav-btn next"
              onClick={handleNextSlide}
              title="Next Slide (Right Arrow)"
            >
              <span>Next Slide</span>
              <ArrowRight size={16} />
            </button>
          </footer>
        </section>
      )}

      {/* =========================================================================
          VIEW 2: LIVE REQUEST-RESPONSE & WEBSOCKET SIMULATOR
          ========================================================================= */}
      {activeSection === 'simulator' && (
        <section className="docs-simulator-view">
          {/* Quick Batch Health & Service Diagnostics Runner */}
          <div className="docs-batch-diagnostics-card">
            <div className="docs-batch-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={20} className="text-blue" />
                <div>
                  <h3 className="docs-batch-title">Multi-Endpoint Parallel Health Diagnostics</h3>
                  <p className="docs-batch-desc">
                    Asynchronously benchmarks all 6 core microservice endpoints against MySQL 8.0 with live latency metrics
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="docs-batch-run-btn"
                onClick={handleRunBatchDiagnostics}
                disabled={batchTesting}
              >
                {batchTesting ? <RefreshCw size={15} className="spin" /> : <Play size={15} />}
                <span>{batchTesting ? 'Testing All Services...' : 'Benchmark All 6 Endpoints'}</span>
              </button>
            </div>

            {batchResults && (
              <div className="docs-batch-grid">
                {batchResults.map((res) => (
                  <div key={res.id} className={`docs-batch-result-item ${res.ok ? 'pass' : 'fail'}`}>
                    <div className="docs-batch-res-left">
                      <span className={`method-badge ${res.method.toLowerCase()}`}>{res.method}</span>
                      <div>
                        <div className="docs-batch-res-title">{res.title}</div>
                        <code className="docs-batch-res-endpoint">{res.endpoint}</code>
                      </div>
                    </div>
                    <div className="docs-batch-res-right">
                      <span className={`docs-batch-status-badge ${res.ok ? 'success' : 'danger'}`}>
                        {res.status}
                      </span>
                      <span className="docs-batch-latency-badge">
                        <Clock size={11} /> {res.latency} ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Visual Architecture Flow Animation */}
          <div className="docs-lifecycle-visualizer-card">
            <div className="docs-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} className="text-emerald" />
                <h3 className="docs-card-title">Real-Time Request & Event Propagation Lifecycle</h3>
              </div>
              <span className="docs-chip-live">
                <span className="pulse-dot green" />
                <span>Sub-15ms Latency Pipeline</span>
              </span>
            </div>

            <div className="docs-flow-pipeline-grid">
              <div className="docs-flow-node">
                <div className="docs-node-icon-box blue">
                  <Monitor size={18} />
                </div>
                <div className="docs-node-step">01. CLIENT ACTION</div>
                <h4 className="docs-node-title">React 18 User Interface</h4>
                <p className="docs-node-desc">User submits form, triggers toggle, or filters live students.</p>
              </div>

              <div className="docs-flow-arrow">
                <ArrowRight size={20} />
              </div>

              <div className="docs-flow-node">
                <div className="docs-node-icon-box purple">
                  <Globe size={18} />
                </div>
                <div className="docs-node-step">02. HTTP TRANSPORT</div>
                <h4 className="docs-node-title">RESTful API Dispatch</h4>
                <p className="docs-node-desc">Parameterized payload dispatched via fetch over HTTP on port 5000.</p>
              </div>

              <div className="docs-flow-arrow">
                <ArrowRight size={20} />
              </div>

              <div className="docs-flow-node">
                <div className="docs-node-icon-box emerald">
                  <Database size={18} />
                </div>
                <div className="docs-node-step">03. PERSISTENCE</div>
                <h4 className="docs-node-title">MySQL 8.0 Engine</h4>
                <p className="docs-node-desc">HikariCP-style connection pool executes ACID transaction commits.</p>
              </div>

              <div className="docs-flow-arrow">
                <ArrowRight size={20} />
              </div>

              <div className="docs-flow-node">
                <div className="docs-node-icon-box amber">
                  <Radio size={18} />
                </div>
                <div className="docs-node-step">04. BROADCAST</div>
                <h4 className="docs-node-title">WebSocket Engine</h4>
                <p className="docs-node-desc">Instant event notification broadcast to all active browser sockets.</p>
              </div>

              <div className="docs-flow-arrow">
                <ArrowRight size={20} />
              </div>

              <div className="docs-flow-node highlight">
                <div className="docs-node-icon-box teal">
                  <Zap size={18} />
                </div>
                <div className="docs-node-step">05. REACTIVE DOM</div>
                <h4 className="docs-node-title">Instant UI Sync</h4>
                <p className="docs-node-desc">All open client tabs update without manual page reloads.</p>
              </div>
            </div>
          </div>

          {/* Interactive Request Sender & Event Feed Split */}
          <div className="docs-simulator-split-layout">
            {/* Left: API Request Tester */}
            <div className="docs-simulator-panel">
              <div className="docs-panel-header">
                <div>
                  <h3 className="docs-panel-title">Interactive API Request Dispatcher</h3>
                  <p className="docs-panel-desc">Execute live HTTP requests against the backend running on port 5000.</p>
                </div>
              </div>

              {/* Preset Endpoint Selector Pills */}
              <div className="docs-preset-pills-row">
                <span className="docs-pill-group-label">Quick Presets:</span>
                {PRESET_REQUESTS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`docs-preset-pill ${selectedPreset.id === preset.id ? 'active' : ''}`}
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <span className={`method-badge ${preset.method.toLowerCase()}`}>{preset.method}</span>
                    <span>{preset.title}</span>
                  </button>
                ))}
              </div>

              {/* Request URL Input Bar */}
              <div className="docs-request-input-bar">
                <select
                  value={customMethod}
                  onChange={(e) => setCustomMethod(e.target.value)}
                  className="docs-method-select"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <div className="docs-endpoint-input-wrap">
                  <span className="docs-base-url">http://localhost:5000</span>
                  <input
                    type="text"
                    value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                    className="docs-endpoint-input"
                    placeholder="/api/health"
                  />
                </div>

                <button
                  type="button"
                  className="docs-send-btn"
                  onClick={() => handleExecuteRequest()}
                  disabled={apiLoading}
                >
                  {apiLoading ? (
                    <RefreshCw size={15} className="spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  <span>{apiLoading ? 'Sending...' : 'Send Request'}</span>
                </button>
              </div>

              {/* Request Payload Editor (if POST/PUT) */}
              {['POST', 'PUT'].includes(customMethod) && (
                <div className="docs-payload-box">
                  <label className="docs-payload-label">JSON Request Body:</label>
                  <textarea
                    rows={4}
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    className="docs-payload-textarea"
                  />
                </div>
              )}

              {/* Response Inspector Box */}
              <div className="docs-response-card">
                <div className="docs-response-meta-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="docs-response-title">Live Response Inspector</span>
                    {apiStatus && (
                      <span className={`docs-status-chip ${apiStatus.includes('200') ? 'success' : 'error'}`}>
                        {apiStatus}
                      </span>
                    )}
                    {apiLatency !== null && (
                      <span className="docs-latency-chip">
                        <Clock size={12} />
                        <span>{apiLatency} ms</span>
                      </span>
                    )}
                  </div>

                  {apiResponse && (
                    <button
                      type="button"
                      className="docs-copy-btn"
                      onClick={handleCopyResponse}
                      title="Copy response JSON"
                    >
                      {copiedCode ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  )}
                </div>

                <pre className="docs-json-viewer">
                  {apiLoading ? (
                    <div className="docs-json-placeholder">
                      <RefreshCw size={24} className="spin text-blue" />
                      <span>Transmitting HTTP packet to MySQL Engine...</span>
                    </div>
                  ) : apiResponse ? (
                    JSON.stringify(apiResponse, null, 2)
                  ) : (
                    <div className="docs-json-placeholder">
                      <Terminal size={24} />
                      <span>Select a preset or click "Send Request" above to view live execution response.</span>
                    </div>
                  )}
                </pre>
              </div>
            </div>

            {/* Right: Live WebSocket Broadcast Event Stream */}
            <div className="docs-simulator-panel">
              <div className="docs-panel-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Radio size={16} className={isWsLive ? 'text-emerald' : 'text-amber'} />
                    <h3 className="docs-panel-title">Realtime WebSocket Event Stream</h3>
                  </div>
                  <p className="docs-panel-desc">Live streaming socket packets received from ws://localhost:5000/</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`docs-ws-pill ${isWsLive ? 'connected' : 'disconnected'}`}>
                    <span className={`pulse-dot ${isWsLive ? 'green' : 'amber'}`} />
                    <span>{isWsLive ? 'Socket Connected' : 'Reconnecting'}</span>
                  </span>
                  <button
                    type="button"
                    className="docs-clear-log-btn"
                    onClick={handleClearWsLogs}
                    title="Clear WebSocket event stream log"
                  >
                    <Trash2 size={13} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons to Inject Simulation Events */}
              <div className="docs-event-simulator-toolbar">
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                  Inject Test Broadcast:
                </span>
                <button
                  type="button"
                  className="docs-sim-btn"
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent('edutrack_realtime_event', {
                        detail: {
                          event: 'STUDENT_ENROLLED_DEMO',
                          payload: {
                            rollNumber: 109,
                            name: 'Devika Sharma',
                            course: 'IT',
                            timestamp: new Date().toISOString()
                          }
                        }
                      })
                    );
                  }}
                >
                  Simulate Admission Event
                </button>

                <button
                  type="button"
                  className="docs-sim-btn"
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent('edutrack_realtime_event', {
                        detail: {
                          event: 'CLEARANCE_OVERRIDE_DEMO',
                          payload: {
                            rollNumber: 104,
                            action: 'DEAN_WAIVER_APPROVED',
                            issuedBy: 'Dean of Academics'
                          }
                        }
                      })
                    );
                  }}
                >
                  Simulate Clearance Waiver
                </button>
              </div>

              {/* Event Stream Log List */}
              <div className="docs-ws-event-log-container">
                {wsEvents.map((evt) => (
                  <div key={evt.id} className="docs-ws-event-row">
                    <div className="docs-event-row-top">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="docs-event-type-badge">{evt.event}</span>
                        <span className="docs-event-source-tag">{evt.source}</span>
                      </div>
                      <span className="docs-event-time">{evt.timestamp}</span>
                    </div>
                    <pre className="docs-event-payload-json">
                      {JSON.stringify(evt.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          VIEW 3: SYSTEM ARCHITECTURE & FULL-STACK BLUEPRINT
          ========================================================================= */}
      {activeSection === 'architecture' && (
        <section className="docs-architecture-view">
          <div className="docs-section-hero">
            <h2 className="docs-section-title">Architectural Foundation & Tech Stack</h2>
            <p className="docs-section-lead">
              Engineered with zero third-party framework overhead, sub-second reactivity, and modular tier separation.
            </p>
          </div>

          <div className="docs-arch-cards-grid">
            <div className="docs-arch-card">
              <div className="docs-arch-card-header">
                <div className="docs-arch-icon-box blue">
                  <Monitor size={22} />
                </div>
                <div>
                  <h3 className="docs-arch-card-title">Frontend Architecture</h3>
                  <span className="docs-arch-card-meta">React 18 · Vite · Custom Design System</span>
                </div>
              </div>
              <ul className="docs-arch-list">
                <li>
                  <strong>Component Architecture:</strong> Strictly isolated role views (StudentPanel, TeacherPanel, AdminPanel) sharing common primitives (HallTicketModal, MarksheetModal, DocumentRepository).
                </li>
                <li>
                  <strong>Styling Framework:</strong> High-performance CSS design system using native CSS variables, Apple macOS rounded squircles, smooth glassmorphism, and zero Tailwind runtime overhead.
                </li>
                <li>
                  <strong>State Synchronization:</strong> Hybrid state management with local optimistic cache, CustomEvent bus, and dual-layer sync with server.
                </li>
              </ul>
            </div>

            <div className="docs-arch-card">
              <div className="docs-arch-card-header">
                <div className="docs-arch-icon-box emerald">
                  <Server size={22} />
                </div>
                <div>
                  <h3 className="docs-arch-card-title">Backend Architecture</h3>
                  <span className="docs-arch-card-meta">Node.js · Express · WebSocket Server</span>
                </div>
              </div>
              <ul className="docs-arch-list">
                <li>
                  <strong>Dual-Protocol Server:</strong> Concurrently exposes Express REST endpoints and WebSocket protocol on single HTTP server instance (Port 5000).
                </li>
                <li>
                  <strong>Realtime Event Dispatch:</strong> Broadcasts granular payloads (`STUDENT_ADDED`, `CLEARANCE_UPDATED`, `SECURITY_REQUEST_APPROVED`) instantly upon database mutation.
                </li>
                <li>
                  <strong>Stateless REST Endpoints:</strong> Over 25 documented API routes handling authentication, student registry, gradebook evaluations, and institutional repository.
                </li>
              </ul>
            </div>

            <div className="docs-arch-card">
              <div className="docs-arch-card-header">
                <div className="docs-arch-icon-box purple">
                  <Database size={22} />
                </div>
                <div>
                  <h3 className="docs-arch-card-title">Database & Storage Engine</h3>
                  <span className="docs-arch-card-meta">MySQL 8.0 · Connection Pooling · ACID</span>
                </div>
              </div>
              <ul className="docs-arch-list">
                <li>
                  <strong>Relational Schema:</strong> 20 normalized tables with primary keys, unique roll number constraints, and foreign key relations.
                </li>
                <li>
                  <strong>Connection Pooling:</strong> High-efficiency `mysql2/promise` pool managing concurrent transactions with 0ms ping latency.
                </li>
                <li>
                  <strong>Automated Seeding:</strong> Deterministic database seeder bootstrapping student personas, faculty rosters, timetables, and clearance records on boot.
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          VIEW 4: RELATIONAL MYSQL 8.0 SCHEMA VISUALIZER
          ========================================================================= */}
      {activeSection === 'schema' && (
        <section className="docs-schema-view">
          <div className="docs-section-hero">
            <h2 className="docs-section-title">MySQL 8.0 Relational Entity Model</h2>
            <p className="docs-section-lead">
              Normalized enterprise schema ensuring data integrity, strict foreign key constraints, and fast index traversal across all academic tables.
            </p>
          </div>

          {/* Schema Search & Export Toolbar */}
          <div className="docs-schema-toolbar">
            <div className="docs-schema-search-box">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search tables or columns (e.g. students, marks, fee, roll_number)..."
                value={schemaSearch}
                onChange={(e) => setSchemaSearch(e.target.value)}
                className="docs-schema-search-input"
              />
              {schemaSearch && (
                <button
                  type="button"
                  className="docs-search-clear-btn"
                  onClick={() => setSchemaSearch('')}
                  title="Clear search filter"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="docs-schema-toolbar-right">
              <span className="docs-schema-count-badge">
                Showing <strong>{filteredSchemaTables.length}</strong> of {SCHEMA_TABLES.length} Tables
              </span>
              <button
                type="button"
                className="docs-copy-ddl-btn"
                onClick={handleCopyDDL}
                title="Copy complete MySQL CREATE TABLE DDL script to clipboard"
              >
                {copiedDDL ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                <span>{copiedDDL ? 'Copied DDL' : 'Copy DDL Schema'}</span>
              </button>
            </div>
          </div>

          {filteredSchemaTables.length === 0 ? (
            <div className="docs-empty-search-state">
              <Database size={36} className="text-slate-400" />
              <h4>No Matching Database Tables Found</h4>
              <p>No table or field matched "{schemaSearch}". Try clearing the search or searching for "students", "marks", "attendance", or "fee".</p>
              <button type="button" className="docs-reset-search-btn" onClick={() => setSchemaSearch('')}>
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="docs-schema-tables-grid">
              {filteredSchemaTables.map((table) => (
                <div key={table.name} className="docs-schema-table-card">
                  <div className="docs-schema-table-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Database size={16} className="text-blue" />
                      <h3 className="docs-table-name">{table.name}</h3>
                    </div>
                    <span className="docs-table-pill">{table.columns.length} Columns</span>
                  </div>
                  <p className="docs-table-desc">{table.description}</p>

                  <div className="docs-columns-table-wrap">
                    <table className="docs-schema-columns-table">
                      <thead>
                        <tr>
                          <th>Field Name</th>
                          <th>Type</th>
                          <th>Key</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((col) => (
                          <tr key={col.name}>
                            <td>
                              <code className="docs-col-name">{col.name}</code>
                            </td>
                            <td>
                              <span className="docs-col-type">{col.type}</span>
                            </td>
                            <td>
                              {col.key === 'PK' && <span className="docs-key-badge pk">PK</span>}
                              {col.key === 'FK' && <span className="docs-key-badge fk">FK</span>}
                              {col.key === 'UK' && <span className="docs-key-badge uk">UK</span>}
                            </td>
                            <td className="docs-col-desc">{col.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          VIEW 5: 75% ATTENDANCE GATEKEEPER & CLEARANCE WORKFLOW
          ========================================================================= */}
      {activeSection === 'security' && (
        <section className="docs-security-view">
          <div className="docs-section-hero">
            <h2 className="docs-section-title">75% Attendance Gatekeeper & Examination Clearance Engine</h2>
            <p className="docs-section-lead">
              Algorithmic verification logic governing eligibility, Dean condonation waivers, and admit card generation.
            </p>
          </div>

          <div className="docs-workflow-cards-grid">
            <div className="docs-workflow-step-card">
              <div className="docs-step-badge">Phase 1: Real-Time Attendance Evaluation</div>
              <h3 className="docs-step-title">Cumulative Attendance Aggregator</h3>
              <p className="docs-step-desc">
                The ERP continuously aggregates subject attendance records. If aggregate percentage falls below 75.0%, the student is flagged as barred from examinations.
              </p>
              <div className="docs-step-condition-box alert">
                <AlertTriangle size={15} />
                <span>Attendance &lt; 75.0% ➔ Hall Ticket Automatically Withheld by ERP Gatekeeper</span>
              </div>
            </div>

            <div className="docs-workflow-step-card">
              <div className="docs-step-badge">Phase 2: Multi-Department Clearance Audit</div>
              <h3 className="docs-step-title">Four-Pillar Institutional Clearance</h3>
              <p className="docs-step-desc">
                Prior to hall ticket release, four institutional departments must register clearance in the database:
              </p>
              <div className="docs-clearance-pillars-list">
                <div className="docs-pillar-item">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <span><strong>Accounts Office:</strong> 100% Tuition & Term fees cleared.</span>
                </div>
                <div className="docs-pillar-item">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <span><strong>Central Library:</strong> All borrowed books and late fines returned.</span>
                </div>
                <div className="docs-pillar-item">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <span><strong>Department Laboratories:</strong> Practical journals & viva validated.</span>
                </div>
                <div className="docs-pillar-item">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <span><strong>HOD Endorsement:</strong> Academic conduct and disciplinary sign-off.</span>
                </div>
              </div>
            </div>

            <div className="docs-workflow-step-card">
              <div className="docs-step-badge">Phase 3: Dean Waiver & Security Condonation</div>
              <h3 className="docs-step-title">Administrative Override Vault</h3>
              <p className="docs-step-desc">
                Students with documented medical hospitalization or national sporting deputations can submit a condonation appeal.
                Admins and Deans review medical documentation in the Security Approvals vault and approve/reject with audit logging.
              </p>
              <div className="docs-step-condition-box success">
                <CheckCircle2 size={15} />
                <span>Dean Waiver Approved ➔ Eligibility Flag Override Unlocked in MySQL</span>
              </div>
            </div>

            <div className="docs-workflow-step-card">
              <div className="docs-step-badge">Phase 4: Cryptographic Admit Card Release</div>
              <h3 className="docs-step-title">Admit Card / Hall Ticket Generation</h3>
              <p className="docs-step-desc">
                Once cleared, the student portal unlocks the official Admit Card complete with photo biometric verification badge, high-density anti-counterfeit barcode, examination center assignment, and invigilator rosters.
              </p>
              <div className="docs-step-condition-box blue">
                <Ticket size={15} />
                <span>Ready for Instant Official A4 Printing & Examination Entry Verification</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          VIEW 6: CONSOLE & ROLE-BASED ACCESS CONTROL (RBAC) MATRIX
          ========================================================================= */}
      {activeSection === 'roles' && (
        <section className="docs-roles-view">
          <div className="docs-section-hero">
            <h2 className="docs-section-title">Console & Privilege Permission Matrix</h2>
            <p className="docs-section-lead">
              Comprehensive mapping of role permissions across the three unified enterprise consoles.
            </p>
          </div>

          <div className="docs-rbac-table-container">
            <table className="docs-rbac-matrix-table">
              <thead>
                <tr>
                  <th>ERP Feature / Module</th>
                  <th style={{ textAlign: 'center' }}>Student Portal</th>
                  <th style={{ textAlign: 'center' }}>Faculty Console</th>
                  <th style={{ textAlign: 'center' }}>Admin Console</th>
                  <th>Security Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Student Directory & Admissions</strong></td>
                  <td style={{ textAlign: 'center' }}>Read Profile Only</td>
                  <td style={{ textAlign: 'center' }}>Read Enrolled Classes</td>
                  <td style={{ textAlign: 'center' }}><span className="rbac-badge full">Full CRUD + Bulk</span></td>
                  <td>Strict Admin Only</td>
                </tr>
                <tr>
                  <td><strong>Attendance Marking & Editing</strong></td>
                  <td style={{ textAlign: 'center' }}>Read Only</td>
                  <td style={{ textAlign: 'center' }}><span className="rbac-badge write">Daily Mark + Bulk</span></td>
                  <td style={{ textAlign: 'center' }}><span className="rbac-badge full">Full Override</span></td>
                  <td>Faculty / Admin</td>
                </tr>
                <tr>
                  <td><strong>Marks & Grade Evaluations</strong></td>
                  <td style={{ textAlign: 'center' }}>Read Gradecard</td>
                  <td style={{ textAlign: 'center' }}><span className="rbac-badge write">Grading Rubrics</span></td>
                  <td style={{ textAlign: 'center' }}><span className="rbac-badge full">Audit & Publish</span></td>
                  <td>Faculty / Admin</td>
                </tr>
                <tr>
                  <td><strong>Admit Card & Clearance Approvals</strong></td>
                  <td style={{ textAlign: 'center' }}>Print Cleared Card</td>
                  <td style={{ textAlign: 'center' }}>View Roster</td>
                  <td style={{ textAlign: 'center' }}><span className="rbac-badge full">Approve / Bar</span></td>
                  <td>Gatekeeper Authority</td>
                </tr>
                <tr>
                  <td><strong>Security Waivers & 2FA Appeals</strong></td>
                  <td style={{ textAlign: 'center' }}>Submit Appeal</td>
                  <td style={{ textAlign: 'center' }}>Endorse (HOD)</td>
                  <td style={{ textAlign: 'center' }}><span className="rbac-badge full">Approve / Reject</span></td>
                  <td>Dean / Admin</td>
                </tr>
                <tr>
                  <td><strong>Institutional Document Repository</strong></td>
                  <td style={{ textAlign: 'center' }}>Download / Print</td>
                  <td style={{ textAlign: 'center' }}>Upload Curriculum</td>
                  <td style={{ textAlign: 'center' }}><span className="rbac-badge full">Manage All Docs</span></td>
                  <td>Academic Board</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =========================================================================
          FLOATING BACK TO TOP BUTTON
          ========================================================================= */}
      {showScrollTop && (
        <button
          type="button"
          className="docs-scroll-top-btn"
          onClick={scrollToTop}
          title="Scroll back to top"
          aria-label="Scroll back to top"
        >
          <ArrowUp size={18} />
          <span>Top</span>
        </button>
      )}
    </div>
  );
}
