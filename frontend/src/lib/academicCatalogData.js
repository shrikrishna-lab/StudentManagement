import {
  getDepartmentIntakes,
  saveDepartmentIntakes,
  DEFAULT_DEPARTMENTS,
  calculateDivisionsForIntake
} from './departmentIntakeHelper';
import { getStudentsClearance, saveStudentsClearance } from './clearanceData';
import { getStoredStudentProfile, saveStoredStudentProfile } from './studentProfiles';

const STORAGE_KEY_SUBJECTS = 'edutrack_academic_subjects_v2';
const STORAGE_KEY_CLASSES = 'edutrack_academic_classes_v1';

// =========================================================================
// COMPREHENSIVE CURRICULUM CATALOG: DEPARTMENT-WISE & YEAR/SEMESTER-WISE
// Year 1 (FE: Sem 1, 2) | Year 2 (SE: Sem 3, 4) | Year 3 (TE: Sem 5, 6) | Year 4 (BE: Sem 7, 8)
// =========================================================================

export const INITIAL_SUBJECTS = [
  // -----------------------------------------------------------------------
  // INFORMATION TECHNOLOGY (IT)
  // -----------------------------------------------------------------------
  // Year 1 (FE) - Semester 1
  { code: 'IT-101', name: 'Engineering Mathematics I', department: 'Information Technology', semester: 'Semester 1', year: 'Year 1 (FE)', type: 'Theory', teacher: 'Dr. Anand Joshi', credits: 4, weeklyHours: 4, room: 'Hall 101' },
  { code: 'IT-102', name: 'Applied Physics & Nanomaterials', department: 'Information Technology', semester: 'Semester 1', year: 'Year 1 (FE)', type: 'Theory', teacher: 'Prof. Shilpa Nair', credits: 3, weeklyHours: 3, room: 'Hall 102' },
  { code: 'IT-103', name: 'Basics of Electrical & Electronics', department: 'Information Technology', semester: 'Semester 1', year: 'Year 1 (FE)', type: 'Theory', teacher: 'Dr. Sanjay Verma', credits: 3, weeklyHours: 3, room: 'Hall 101' },
  { code: 'IT-104', name: 'C Programming & Logic Development', department: 'Information Technology', semester: 'Semester 1', year: 'Year 1 (FE)', type: 'Theory', teacher: 'Prof. Arvind Saxena', credits: 3, weeklyHours: 3, room: 'Hall 103' },
  { code: 'IT-101L', name: 'Applied Physics & Electrical Lab', department: 'Information Technology', semester: 'Semester 1', year: 'Year 1 (FE)', type: 'Practical Lab', teacher: 'Prof. Shilpa Nair', credits: 2, weeklyHours: 2, room: 'Physics Lab 1' },
  { code: 'IT-102L', name: 'C Programming Workshop & Practice', department: 'Information Technology', semester: 'Semester 1', year: 'Year 1 (FE)', type: 'Practical Lab', teacher: 'Prof. Arvind Saxena', credits: 2, weeklyHours: 3, room: 'Computing Lab A-1' },

  // Year 1 (FE) - Semester 2
  { code: 'IT-105', name: 'Engineering Mathematics II', department: 'Information Technology', semester: 'Semester 2', year: 'Year 1 (FE)', type: 'Theory', teacher: 'Dr. Anand Joshi', credits: 4, weeklyHours: 4, room: 'Hall 101' },
  { code: 'IT-106', name: 'Applied Chemistry & Materials', department: 'Information Technology', semester: 'Semester 2', year: 'Year 1 (FE)', type: 'Theory', teacher: 'Dr. Rekha Sharma', credits: 3, weeklyHours: 3, room: 'Hall 102' },
  { code: 'IT-107', name: 'Structured Object-Oriented Principles', department: 'Information Technology', semester: 'Semester 2', year: 'Year 1 (FE)', type: 'Theory', teacher: 'Prof. Sneha Patil', credits: 3, weeklyHours: 3, room: 'Hall 103' },
  { code: 'IT-108', name: 'Engineering Graphics & CAD Models', department: 'Information Technology', semester: 'Semester 2', year: 'Year 1 (FE)', type: 'Theory', teacher: 'Prof. Rajesh Nair', credits: 3, weeklyHours: 3, room: 'CAD Hall 1' },
  { code: 'IT-105L', name: 'Python Fundamentals & Problem Solving', department: 'Information Technology', semester: 'Semester 2', year: 'Year 1 (FE)', type: 'Practical Lab', teacher: 'Prof. Sneha Patil', credits: 2, weeklyHours: 3, room: 'Computing Lab A-2' },
  { code: 'IT-106L', name: 'Engineering Workshop & Drafting Lab', department: 'Information Technology', semester: 'Semester 2', year: 'Year 1 (FE)', type: 'Practical Lab', teacher: 'Prof. Rajesh Nair', credits: 2, weeklyHours: 2, room: 'Workshop B-1' },

  // Year 2 (SE) - Semester 3
  { code: 'IT-201', name: 'Data Structures & Algorithms', department: 'Information Technology', semester: 'Semester 3', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Vivek Joshi', credits: 4, weeklyHours: 4, room: 'Room 201' },
  { code: 'IT-202', name: 'Discrete Mathematics & Graph Theory', department: 'Information Technology', semester: 'Semester 3', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Prof. Arvind Saxena', credits: 4, weeklyHours: 4, room: 'Room 201' },
  { code: 'IT-203', name: 'Digital Logic & Computer Architecture', department: 'Information Technology', semester: 'Semester 3', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Sanjay Verma', credits: 3, weeklyHours: 3, room: 'Room 202' },
  { code: 'IT-204', name: 'Data Communication Principles', department: 'Information Technology', semester: 'Semester 3', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Prof. Neha Gupta', credits: 3, weeklyHours: 3, room: 'Room 202' },
  { code: 'IT-201L', name: 'Data Structures with C++ Lab', department: 'Information Technology', semester: 'Semester 3', year: 'Year 2 (SE)', type: 'Practical Lab', teacher: 'Dr. Vivek Joshi', credits: 2, weeklyHours: 3, room: 'Computing Lab B-1' },
  { code: 'IT-202L', name: 'Digital Electronics Simulator Lab', department: 'Information Technology', semester: 'Semester 3', year: 'Year 2 (SE)', type: 'Practical Lab', teacher: 'Dr. Sanjay Verma', credits: 2, weeklyHours: 2, room: 'Hardware Lab 2' },

  // Year 2 (SE) - Semester 4
  { code: 'IT-205', name: 'Operating Systems & Architecture', department: 'Information Technology', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Vivek Joshi', credits: 4, weeklyHours: 4, room: 'Room 203' },
  { code: 'IT-206', name: 'Automata Theory & Formal Languages', department: 'Information Technology', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Prof. Arvind Saxena', credits: 4, weeklyHours: 4, room: 'Room 203' },
  { code: 'IT-207', name: 'Computer Networks & Protocols', department: 'Information Technology', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Prof. Neha Gupta', credits: 3, weeklyHours: 3, room: 'Room 204' },
  { code: 'IT-208', name: 'Probability, Statistics & Analytics', department: 'Information Technology', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Anand Joshi', credits: 3, weeklyHours: 3, room: 'Room 204' },
  { code: 'IT-205L', name: 'Operating Systems & Linux Shell Lab', department: 'Information Technology', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Practical Lab', teacher: 'Dr. Vivek Joshi', credits: 2, weeklyHours: 3, room: 'Computing Lab B-2' },
  { code: 'IT-206L', name: 'Network Configuration & Packet Lab', department: 'Information Technology', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Practical Lab', teacher: 'Prof. Neha Gupta', credits: 2, weeklyHours: 3, room: 'Networking Lab' },

  // Year 3 (TE) - Semester 5
  { code: 'IT-301', name: 'Software Engineering & Agile Systems', department: 'Information Technology', semester: 'Semester 5', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Prof. Sneha Patil', credits: 4, weeklyHours: 4, room: 'Room 301' },
  { code: 'IT-302', name: 'Internet of Things & Microcontrollers', department: 'Information Technology', semester: 'Semester 5', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Dr. Sanjay Verma', credits: 4, weeklyHours: 4, room: 'Room 301' },
  { code: 'IT-303', name: 'Full-Stack Web Development Frameworks', department: 'Information Technology', semester: 'Semester 5', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Prof. Arvind Saxena', credits: 4, weeklyHours: 4, room: 'Room 302' },
  { code: 'IT-304', name: 'Cryptographic Algorithms & Security', department: 'Information Technology', semester: 'Semester 5', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Prof. Neha Gupta', credits: 3, weeklyHours: 3, room: 'Room 302' },
  { code: 'IT-301L', name: 'IoT Hardware Prototyping Laboratory', department: 'Information Technology', semester: 'Semester 5', year: 'Year 3 (TE)', type: 'Practical Lab', teacher: 'Dr. Sanjay Verma', credits: 2, weeklyHours: 3, room: 'IoT Lab 1' },
  { code: 'IT-302L', name: 'Web Stack & Cloud Deployment Lab', department: 'Information Technology', semester: 'Semester 5', year: 'Year 3 (TE)', type: 'Practical Lab', teacher: 'Prof. Arvind Saxena', credits: 2, weeklyHours: 3, room: 'Computing Lab A-1' },

  // Year 3 (TE) - Semester 6 (ACTIVE BASELINE SEMESTER)
  { code: 'IT-305', name: 'Core Java & OOP Frameworks', department: 'Information Technology', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Prof. Arvind Saxena', credits: 4, weeklyHours: 4, room: 'Room 302' },
  { code: 'IT-305L', name: 'Core Java Programming Laboratory', department: 'Information Technology', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Practical Lab', teacher: 'Prof. Arvind Saxena', credits: 2, weeklyHours: 3, room: 'Computing Lab A-1' },
  { code: 'IT-306', name: 'Database Management Systems & SQL', department: 'Information Technology', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Prof. Sneha Patil', credits: 4, weeklyHours: 4, room: 'Room 302' },
  { code: 'IT-306L', name: 'DBMS & Query Performance Lab', department: 'Information Technology', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Practical Lab', teacher: 'Prof. Sneha Patil', credits: 2, weeklyHours: 3, room: 'Computing Lab A-2' },
  { code: 'IT-307', name: 'Distributed Systems & Cloud Clusters', department: 'Information Technology', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Dr. Vivek Joshi', credits: 4, weeklyHours: 4, room: 'Room 303' },
  { code: 'IT-308', name: 'Network Security & Threat Analysis', department: 'Information Technology', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Prof. Neha Gupta', credits: 3, weeklyHours: 3, room: 'Room 303' },

  // Year 4 (BE) - Semester 7
  { code: 'IT-401', name: 'Artificial Intelligence & Neural Nets', department: 'Information Technology', semester: 'Semester 7', year: 'Year 4 (BE)', type: 'Theory', teacher: 'Dr. Meera Nambiar', credits: 4, weeklyHours: 4, room: 'Hall 401' },
  { code: 'IT-402', name: 'Big Data Engineering & Spark Systems', department: 'Information Technology', semester: 'Semester 7', year: 'Year 4 (BE)', type: 'Theory', teacher: 'Dr. Vivek Joshi', credits: 4, weeklyHours: 4, room: 'Hall 401' },
  { code: 'IT-403', name: 'Cloud Computing & Microservices', department: 'Information Technology', semester: 'Semester 7', year: 'Year 4 (BE)', type: 'Theory', teacher: 'Prof. Arvind Saxena', credits: 3, weeklyHours: 3, room: 'Hall 402' },
  { code: 'IT-404', name: 'Information Retrieval & Search Eng', department: 'Information Technology', semester: 'Semester 7', year: 'Year 4 (BE)', type: 'Theory', teacher: 'Prof. Sneha Patil', credits: 3, weeklyHours: 3, room: 'Hall 402' },
  { code: 'IT-401L', name: 'AI & Machine Learning Laboratory', department: 'Information Technology', semester: 'Semester 7', year: 'Year 4 (BE)', type: 'Practical Lab', teacher: 'Dr. Meera Nambiar', credits: 2, weeklyHours: 3, room: 'AI Lab 1' },
  { code: 'IT-402L', name: 'Capstone Project Phase I (Design)', department: 'Information Technology', semester: 'Semester 7', year: 'Year 4 (BE)', type: 'Practical Lab', teacher: 'Department Faculty Council', credits: 4, weeklyHours: 4, room: 'Project Incubation Center' },

  // Year 4 (BE) - Semester 8
  { code: 'IT-405', name: 'Blockchain Systems & Smart Contracts', department: 'Information Technology', semester: 'Semester 8', year: 'Year 4 (BE)', type: 'Theory', teacher: 'Dr. Vivek Joshi', credits: 4, weeklyHours: 4, room: 'Hall 401' },
  { code: 'IT-406', name: 'DevOps & Site Reliability Engineering', department: 'Information Technology', semester: 'Semester 8', year: 'Year 4 (BE)', type: 'Theory', teacher: 'Prof. Arvind Saxena', credits: 4, weeklyHours: 4, room: 'Hall 401' },
  { code: 'IT-407', name: 'Cyber Forensics & Digital Auditing', department: 'Information Technology', semester: 'Semester 8', year: 'Year 4 (BE)', type: 'Theory', teacher: 'Prof. Neha Gupta', credits: 3, weeklyHours: 3, room: 'Hall 402' },
  { code: 'IT-408', name: 'Major Industry Capstone Project II', department: 'Information Technology', semester: 'Semester 8', year: 'Year 4 (BE)', type: 'Practical Lab', teacher: 'Department Faculty Council', credits: 10, weeklyHours: 12, room: 'Project Incubation Center' },

  // -----------------------------------------------------------------------
  // COMPUTER SCIENCE & ENGINEERING (CS)
  // -----------------------------------------------------------------------
  // Year 2 (SE) - Semester 4
  { code: 'CS-201', name: 'Data Structures with C++', department: 'Computer Science & Engineering', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Vivek Joshi', credits: 4, weeklyHours: 4, room: 'Room 304' },
  { code: 'CS-202', name: 'Computer Architecture & Org', department: 'Computer Science & Engineering', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Prof. Sanjay Verma', credits: 4, weeklyHours: 4, room: 'Room 304' },
  { code: 'CS-203', name: 'Operating Systems & Linux Kernel', department: 'Computer Science & Engineering', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Vivek Joshi', credits: 4, weeklyHours: 4, room: 'Room 305' },
  { code: 'CS-204', name: 'Discrete Mathematics', department: 'Computer Science & Engineering', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Anand Joshi', credits: 4, weeklyHours: 4, room: 'Room 305' },
  { code: 'CS-201L', name: 'Data Structures Laboratory', department: 'Computer Science & Engineering', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Practical Lab', teacher: 'Dr. Vivek Joshi', credits: 2, weeklyHours: 3, room: 'Computing Lab B-1' },

  // Year 3 (TE) - Semester 6
  { code: 'CS-301', name: 'Design & Analysis of Algorithms', department: 'Computer Science & Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Dr. Vivek Joshi', credits: 4, weeklyHours: 4, room: 'Room 304' },
  { code: 'CS-301L', name: 'Advanced Algorithms Laboratory', department: 'Computer Science & Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Practical Lab', teacher: 'Dr. Vivek Joshi', credits: 2, weeklyHours: 3, room: 'Computing Lab B-2' },
  { code: 'CS-302', name: 'Compiler Construction & Automata', department: 'Computer Science & Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Prof. Arvind Saxena', credits: 4, weeklyHours: 4, room: 'Room 304' },
  { code: 'CS-303', name: 'Database Systems Implementation', department: 'Computer Science & Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Prof. Sneha Patil', credits: 4, weeklyHours: 4, room: 'Room 305' },
  { code: 'CS-304', name: 'Artificial Intelligence Foundations', department: 'Computer Science & Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Dr. Meera Nambiar', credits: 3, weeklyHours: 3, room: 'Room 305' },

  // -----------------------------------------------------------------------
  // ARTIFICIAL INTELLIGENCE & DATA SCIENCE (AIDS)
  // -----------------------------------------------------------------------
  // Year 2 (SE) - Semester 4
  { code: 'AIDS-201', name: 'Linear Algebra & Optimization', department: 'Artificial Intelligence & Data Science', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Anand Joshi', credits: 4, weeklyHours: 4, room: 'AI Hall 1' },
  { code: 'AIDS-202', name: 'Python for Data Analytics & Stats', department: 'Artificial Intelligence & Data Science', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Meera Nambiar', credits: 4, weeklyHours: 4, room: 'AI Hall 1' },
  { code: 'AIDS-201L', name: 'Data Preprocessing & Visualization Lab', department: 'Artificial Intelligence & Data Science', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Practical Lab', teacher: 'Dr. Meera Nambiar', credits: 2, weeklyHours: 3, room: 'AI Lab 1' },

  // Year 3 (TE) - Semester 6
  { code: 'AIDS-301', name: 'Machine Learning Foundations', department: 'Artificial Intelligence & Data Science', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Dr. Meera Nambiar', credits: 4, weeklyHours: 4, room: 'AI Hall 1' },
  { code: 'AIDS-302', name: 'Deep Learning & Computer Vision', department: 'Artificial Intelligence & Data Science', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Dr. Meera Nambiar', credits: 4, weeklyHours: 4, room: 'AI Hall 1' },
  { code: 'AIDS-301L', name: 'Neural Networks & PyTorch Lab', department: 'Artificial Intelligence & Data Science', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Practical Lab', teacher: 'Dr. Meera Nambiar', credits: 2, weeklyHours: 3, room: 'AI Lab 2' },

  // -----------------------------------------------------------------------
  // ELECTRONICS & TELECOMMUNICATION (EXTC)
  // -----------------------------------------------------------------------
  // Year 2 (SE) - Semester 4
  { code: 'EXTC-201', name: 'Signals & Systems Analysis', department: 'Electronics & Telecommunication', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Sanjay Verma', credits: 4, weeklyHours: 4, room: 'Room 201' },
  { code: 'EXTC-202', name: 'Analog Integrated Circuits', department: 'Electronics & Telecommunication', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Theory', teacher: 'Dr. Sanjay Verma', credits: 4, weeklyHours: 4, room: 'Room 201' },
  { code: 'EXTC-201L', name: 'Analog & Simulation Laboratory', department: 'Electronics & Telecommunication', semester: 'Semester 4', year: 'Year 2 (SE)', type: 'Practical Lab', teacher: 'Dr. Sanjay Verma', credits: 2, weeklyHours: 3, room: 'Hardware Lab 1' },

  // Year 3 (TE) - Semester 6
  { code: 'EXTC-301', name: 'Signals, DSP & Microcontrollers', department: 'Electronics & Telecommunication', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Dr. Sanjay Verma', credits: 4, weeklyHours: 4, room: 'Room 201' },
  { code: 'EXTC-302', name: 'Electromagnetics & Antenna Waves', department: 'Electronics & Telecommunication', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Dr. Sanjay Verma', credits: 4, weeklyHours: 4, room: 'Room 201' },
  { code: 'EXTC-301L', name: 'DSP & Embedded Controller Lab', department: 'Electronics & Telecommunication', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Practical Lab', teacher: 'Dr. Sanjay Verma', credits: 2, weeklyHours: 3, room: 'Hardware Lab 2' },

  // -----------------------------------------------------------------------
  // MECHANICAL ENGINEERING (MECH)
  // -----------------------------------------------------------------------
  // Year 3 (TE) - Semester 6
  { code: 'MECH-301', name: 'Thermodynamics & Heat Transfer', department: 'Mechanical Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Prof. Rajesh Nair', credits: 4, weeklyHours: 4, room: 'Hall M-1' },
  { code: 'MECH-302', name: 'Theory of Machines & Dynamics', department: 'Mechanical Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Prof. Rajesh Nair', credits: 4, weeklyHours: 4, room: 'Hall M-1' },
  { code: 'MECH-301L', name: 'Thermal Engineering & Fluids Lab', department: 'Mechanical Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Practical Lab', teacher: 'Prof. Rajesh Nair', credits: 2, weeklyHours: 3, room: 'Mech Lab 2' },

  // -----------------------------------------------------------------------
  // CIVIL ENGINEERING (CIVIL)
  // -----------------------------------------------------------------------
  // Year 3 (TE) - Semester 6
  { code: 'CIVIL-301', name: 'Structural Analysis & Design', department: 'Civil Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Dr. Hemant Kulkarni', credits: 4, weeklyHours: 4, room: 'Hall C-1' },
  { code: 'CIVIL-302', name: 'Geotechnical Engineering & Soils', department: 'Civil Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Theory', teacher: 'Dr. Hemant Kulkarni', credits: 4, weeklyHours: 4, room: 'Hall C-1' },
  { code: 'CIVIL-301L', name: 'Soil Mechanics & Surveying Lab', department: 'Civil Engineering', semester: 'Semester 6', year: 'Year 3 (TE)', type: 'Practical Lab', teacher: 'Dr. Hemant Kulkarni', credits: 2, weeklyHours: 3, room: 'Civil Testing Lab' }
];

export const INITIAL_CLASSES = [
  { id: 'cls-1', name: 'TE-IT-Div A', department: 'Information Technology', year: 'Year 3 (TE)', division: 'Div A', room: 'Room 302', timing: '08:30 AM - 04:30 PM', students: 75, rep: 'Aarav Mehta' },
  { id: 'cls-2', name: 'TE-IT-Div B', department: 'Information Technology', year: 'Year 3 (TE)', division: 'Div B', room: 'Room 304', timing: '08:30 AM - 04:30 PM', students: 75, rep: 'Ananya Verma' },
  { id: 'cls-3', name: 'TE-CS-Div A', department: 'Computer Science & Engineering', year: 'Year 3 (TE)', division: 'Div A', room: 'Room 301', timing: '09:00 AM - 05:00 PM', students: 67, rep: 'Rohan Deshmukh' },
  { id: 'cls-4', name: 'SE-EXTC-Div A', department: 'Electronics & Telecommunication', year: 'Year 2 (SE)', division: 'Div A', room: 'Room 201', timing: '09:00 AM - 05:00 PM', students: 60, rep: 'Sneha Kulkarni' },
  { id: 'cls-5', name: 'TE-MECH-Div A', department: 'Mechanical Engineering', year: 'Year 3 (TE)', division: 'Div A', room: 'Hall M-1', timing: '08:30 AM - 04:30 PM', students: 60, rep: 'Vikas Shinde' }
];

// ==========================================
// SEMESTER & YEAR PROGRESSION MAPPING HELPERS
// ==========================================

export const SEMESTER_LIST = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8'
];

export const YEAR_LIST = [
  'Year 1 (FE)',
  'Year 2 (SE)',
  'Year 3 (TE)',
  'Year 4 (BE)'
];

/**
 * Returns academic year string for a given semester.
 */
export function getYearForSemester(semStr = 'Semester 6') {
  const num = parseInt(String(semStr).replace(/[^0-9]/g, ''), 10) || 6;
  if (num <= 2) return 'Year 1 (FE)';
  if (num <= 4) return 'Year 2 (SE)';
  if (num <= 6) return 'Year 3 (TE)';
  return 'Year 4 (BE)';
}

/**
 * Returns numeric year (1, 2, 3, 4) for a given semester.
 */
export function getNumericYearForSemester(semStr = 'Semester 6') {
  const num = parseInt(String(semStr).replace(/[^0-9]/g, ''), 10) || 6;
  if (num <= 2) return 1;
  if (num <= 4) return 2;
  if (num <= 6) return 3;
  return 4;
}

/**
 * Returns the sequential next semester.
 */
export function getNextSemester(semStr = 'Semester 6') {
  const num = parseInt(String(semStr).replace(/[^0-9]/g, ''), 10) || 6;
  if (num >= 8) return 'Graduated (Alumni)';
  return `Semester ${num + 1}`;
}

// ==========================================
// DEPARTMENTS & COURSES (Integrated with Intakes)
// ==========================================

export function getDepartmentsList() {
  const intakes = getDepartmentIntakes();
  return intakes.map((dept) => {
    const divs = calculateDivisionsForIntake(dept.intake);
    return {
      code: dept.code,
      name: dept.name,
      hod: dept.headOfDept || 'Dr. Department Head',
      duration: dept.duration || '4 Years',
      intakeLimit: Number(dept.intake) || 120,
      activeStudents: Number(dept.intake) || 120,
      activeSubjects: 6,
      classesCount: divs.length,
      divisions: divs,
      activeSemester: dept.activeSemester || 'Semester 6',
      years: dept.years || [1, 2, 3, 4]
    };
  });
}

export function saveDepartmentRecord(deptData) {
  const current = getDepartmentIntakes();
  const existingIdx = current.findIndex(
    (d) => d.code.toUpperCase() === (deptData.code || '').toUpperCase()
  );

  const newEntry = {
    code: (deptData.code || '').trim().toUpperCase(),
    name: (deptData.name || '').trim(),
    headOfDept: (deptData.hod || deptData.headOfDept || '').trim(),
    duration: deptData.duration || '4 Years',
    intake: Math.max(1, Number(deptData.intakeLimit || deptData.intake || 120)),
    classesCount: deptData.classesCount || 4,
    activeSemester: deptData.activeSemester || 'Semester 6',
    years: deptData.years || [1, 2, 3, 4]
  };

  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...updated[existingIdx], ...newEntry };
  } else {
    updated = [...current, newEntry];
  }

  saveDepartmentIntakes(updated);
  return newEntry;
}

export function deleteDepartmentRecord(code) {
  const current = getDepartmentIntakes();
  const filtered = current.filter((d) => d.code.toUpperCase() !== code.toUpperCase());
  saveDepartmentIntakes(filtered);
  return filtered;
}

// ==========================================
// SUBJECTS CATALOG (Theory & Labs)
// ==========================================

export function getSubjectsCatalog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBJECTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load subjects:', e);
  }
  return INITIAL_SUBJECTS;
}

export function saveSubjectRecord(subjectData) {
  const subjects = getSubjectsCatalog();
  const existingIdx = subjects.findIndex(
    (s) => s.code.toUpperCase() === (subjectData.code || '').toUpperCase()
  );

  const semester = subjectData.semester || 'Semester 6';
  const newRecord = {
    code: (subjectData.code || '').trim().toUpperCase(),
    name: (subjectData.name || '').trim(),
    department: (subjectData.department || 'Information Technology').trim(),
    semester: semester,
    year: subjectData.year || getYearForSemester(semester),
    type: subjectData.type || 'Theory',
    teacher: (subjectData.teacher || 'Unassigned').trim(),
    credits: Number(subjectData.credits) || 4,
    weeklyHours: Number(subjectData.weeklyHours) || 4,
    room: (subjectData.room || 'Room 302').trim()
  };

  let updated;
  if (existingIdx >= 0) {
    updated = [...subjects];
    updated[existingIdx] = newRecord;
  } else {
    updated = [newRecord, ...subjects];
  }

  try {
    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('edutrack_subjects_updated', { detail: updated }));
  } catch (e) {
    console.error(e);
  }

  return newRecord;
}

export function deleteSubjectRecord(code) {
  const subjects = getSubjectsCatalog();
  const updated = subjects.filter((s) => s.code.toUpperCase() !== code.toUpperCase());
  try {
    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('edutrack_subjects_updated', { detail: updated }));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

/**
 * Filter subjects strictly matching target department and semester.
 */
export function getSubjectsForDepartmentAndSemester(department = 'Information Technology', semester = 'Semester 6') {
  const all = getSubjectsCatalog();
  const deptNorm = String(department).toLowerCase();

  const matched = all.filter((s) => {
    const sDept = s.department.toLowerCase();
    const isDeptMatch = sDept.includes(deptNorm) ||
      (deptNorm.includes('it') && sDept.includes('information')) ||
      (deptNorm.includes('cs') && sDept.includes('computer')) ||
      (deptNorm.includes('aids') && sDept.includes('artificial')) ||
      (deptNorm.includes('extc') && sDept.includes('electronic')) ||
      (deptNorm.includes('mech') && sDept.includes('mechanical')) ||
      (deptNorm.includes('civil') && sDept.includes('civil'));

    return isDeptMatch && s.semester.toLowerCase() === semester.toLowerCase();
  });

  if (matched.length > 0) return matched;

  // Fallback to department subjects matching semester number or standard set
  return all.filter((s) => s.semester.toLowerCase() === semester.toLowerCase()).slice(0, 6);
}

// ==========================================
// AUTOMATIC STUDENT & COHORT PROGRESSION ENGINE
// ==========================================

/**
 * Auto-assigns curriculum courses to a student when they move to the next semester or year.
 * Automatically synchronizes grades and subject attendance breakdown in clearance storage.
 */
export function autoAssignStudentSubjectsOnProgression(rollNumber, targetSemester, targetDepartment) {
  const rNum = Number(rollNumber);
  const clearanceList = getStudentsClearance();
  const student = clearanceList.find((s) => s.rollNumber === rNum);

  const dept = targetDepartment || student?.course || 'Information Technology';
  const newSem = targetSemester || (student ? getNextSemester(student.semester) : 'Semester 6');
  const newYearNumeric = getNumericYearForSemester(newSem);
  const newYearLabel = getYearForSemester(newSem);

  const assignedSubjects = getSubjectsForDepartmentAndSemester(dept, newSem);

  // Generate fresh grades structure
  const updatedGrades = assignedSubjects.map((sub) => {
    const isTheory = sub.type === 'Theory';
    const totalMax = isTheory ? 100 : 50;
    const internalMax = isTheory ? 25 : 25;
    const endtermMax = isTheory ? 75 : 25;

    return {
      code: sub.code,
      name: sub.name,
      credits: sub.credits || (isTheory ? 4 : 2),
      internal: Math.round(internalMax * 0.88),
      endterm: Math.round(endtermMax * 0.85),
      total: Math.round(totalMax * 0.86),
      grade: 'O',
      gradePoint: 10,
      faculty: sub.teacher || 'Department Faculty',
      type: sub.type
    };
  });

  // Generate fresh attendance subject breakdown
  const updatedBreakdown = assignedSubjects.map((sub) => {
    const isTheory = sub.type === 'Theory';
    const totalClasses = isTheory ? 36 : 28;
    const attended = Math.round(totalClasses * 0.92);
    const pct = Math.round((attended / totalClasses) * 1000) / 10;

    return {
      code: sub.code,
      name: sub.name,
      type: sub.type,
      faculty: sub.teacher || 'Department Faculty',
      totalClasses,
      attended,
      percentage: pct,
      status: 'Normal'
    };
  });

  // Update in clearance list
  const updatedClearanceList = clearanceList.map((s) => {
    if (s.rollNumber === rNum) {
      return {
        ...s,
        semester: newSem,
        year: newYearNumeric,
        grades: updatedGrades,
        subjectBreakdown: updatedBreakdown,
        totalCredits: updatedGrades.reduce((sum, g) => sum + (g.credits || 0), 0),
        attendance: 91.5,
        attendanceCleared: true,
        hallTicketStatus: 'issued',
        marksheetStatus: 'released'
      };
    }
    return s;
  });

  saveStudentsClearance(updatedClearanceList);

  // If this is currently the active student profile, update profile store too
  const storedProfile = getStoredStudentProfile();
  if (storedProfile && (storedProfile.rollNumber === rNum || Number(storedProfile.rollNumber) === rNum)) {
    const updatedProfile = {
      ...storedProfile,
      semester: newSem,
      year: newYearNumeric,
      standing: `Promoted to ${newSem} (${newYearLabel})`
    };
    saveStoredStudentProfile(updatedProfile);
  }

  window.dispatchEvent(
    new CustomEvent('edutrack_student_promoted', {
      detail: {
        rollNumber: rNum,
        newSemester: newSem,
        newYear: newYearNumeric,
        assignedSubjects
      }
    })
  );

  return {
    student: updatedClearanceList.find((s) => s.rollNumber === rNum),
    assignedSubjects
  };
}

/**
 * Advance an entire department cohort (e.g. all Semester 5 IT students to Semester 6)
 */
export function advanceCohortToNextSemester(departmentCodeOrName, fromSemester, toSemester) {
  const targetNextSem = toSemester || getNextSemester(fromSemester);
  const clearanceList = getStudentsClearance();
  const deptQuery = String(departmentCodeOrName || '').toLowerCase();

  const affectedStudents = clearanceList.filter((s) => {
    const sCourse = (s.course || '').toLowerCase();
    const isDept = sCourse.includes(deptQuery) ||
      (deptQuery.includes('it') && sCourse.includes('it')) ||
      (deptQuery.includes('cs') && sCourse.includes('cs'));
    return isDept && s.semester.toLowerCase() === fromSemester.toLowerCase();
  });

  affectedStudents.forEach((student) => {
    autoAssignStudentSubjectsOnProgression(student.rollNumber, targetNextSem, departmentCodeOrName);
  });

  return {
    count: affectedStudents.length,
    fromSemester,
    toSemester: targetNextSem,
    affectedRollNumbers: affectedStudents.map((s) => s.rollNumber)
  };
}

// ==========================================
// CLASSES & DIVISIONS CATALOG
// ==========================================

export function getClassesCatalog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLASSES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load classes:', e);
  }
  return INITIAL_CLASSES;
}

export function saveClassRecord(classData) {
  const classes = getClassesCatalog();
  const id = classData.id || `cls-${Date.now()}`;

  const newRecord = {
    id,
    name: (classData.name || `${classData.department} - ${classData.division || 'Div A'}`).trim(),
    department: (classData.department || 'Information Technology').trim(),
    year: classData.year || 'Year 3 (TE)',
    division: classData.division || 'Div A',
    room: (classData.room || 'Room 302').trim(),
    timing: (classData.timing || '08:30 AM - 04:30 PM').trim(),
    students: Number(classData.students) || 75,
    rep: (classData.rep || 'Class Representative').trim()
  };

  const existingIdx = classes.findIndex((c) => c.id === id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...classes];
    updated[existingIdx] = newRecord;
  } else {
    updated = [newRecord, ...classes];
  }

  try {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('edutrack_classes_updated', { detail: updated }));
  } catch (e) {
    console.error(e);
  }

  return newRecord;
}

export function deleteClassRecord(id) {
  const classes = getClassesCatalog();
  const updated = classes.filter((c) => String(c.id) !== String(id));
  try {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('edutrack_classes_updated', { detail: updated }));
  } catch (e) {
    console.error(e);
  }
  return updated;
}
