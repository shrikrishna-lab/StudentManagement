/**
 * EduTrack Study Materials & Courseware Repository
 * Manages institutional syllabi, lecture slides, lab manuals, and exam archives.
 */

const STORAGE_KEY = 'edutrack_study_materials_data';

export const INITIAL_STUDY_MATERIALS = [
  {
    id: 'mat-101',
    title: 'Core Java OOP Complete Slides & Notes',
    subjectCode: 'IT-301',
    subject: 'Core Java & OOP Frameworks',
    department: 'IT',
    semester: 'Semester 6',
    category: 'Lecture Notes',
    format: 'PDF',
    size: '4.8 MB',
    uploadedBy: 'Prof. Krrish Sharma',
    updated: 'Oct 01, 2026',
    downloads: 142,
    visibility: 'All Students'
  },
  {
    id: 'mat-102',
    title: 'Core Java Programming Laboratory Manual (IT-301L)',
    subjectCode: 'IT-301L',
    subject: 'Core Java Programming Lab',
    department: 'IT',
    semester: 'Semester 6',
    category: 'Lab Manual',
    format: 'PDF',
    size: '6.2 MB',
    uploadedBy: 'Prof. Krrish Sharma',
    updated: 'Sep 29, 2026',
    downloads: 118,
    visibility: 'All Students'
  },
  {
    id: 'mat-103',
    title: 'MySQL JDBC Connectivity & DAO Architecture Cheat-Sheet',
    subjectCode: 'IT-302',
    subject: 'Database Management Systems',
    department: 'IT',
    semester: 'Semester 6',
    category: 'Lecture Notes',
    format: 'PDF',
    size: '1.2 MB',
    uploadedBy: 'Prof. Anjali Mehta',
    updated: 'Sep 28, 2026',
    downloads: 98,
    visibility: 'All Students'
  },
  {
    id: 'mat-104',
    title: 'DBMS & SQL Query Optimization Lab Experiments Handbook',
    subjectCode: 'IT-302L',
    subject: 'DBMS & SQL Query Optimization Lab',
    department: 'IT',
    semester: 'Semester 6',
    category: 'Lab Manual',
    format: 'PDF',
    size: '3.7 MB',
    uploadedBy: 'Prof. Anjali Mehta',
    updated: 'Sep 25, 2026',
    downloads: 87,
    visibility: 'All Students'
  },
  {
    id: 'mat-105',
    title: 'Tree & Graph Algorithms Lab Manual (CS-205)',
    subjectCode: 'CS-201',
    subject: 'Data Structures & Algorithms',
    department: 'CS',
    semester: 'Semester 4',
    category: 'Lab Manual',
    format: 'PDF',
    size: '3.4 MB',
    uploadedBy: 'Dr. Vivek Joshi',
    updated: 'Sep 22, 2026',
    downloads: 175,
    visibility: 'All Students'
  },
  {
    id: 'mat-106',
    title: 'TCP/IP Protocol Suite & Subnetting Reference Guide',
    subjectCode: 'IT-304',
    subject: 'Computer Networks & Security',
    department: 'IT',
    semester: 'Semester 6',
    category: 'Lecture Notes',
    format: 'PDF',
    size: '2.9 MB',
    uploadedBy: 'Prof. Neha Gupta',
    updated: 'Sep 18, 2026',
    downloads: 64,
    visibility: 'All Students'
  },
  {
    id: 'mat-107',
    title: 'Semester 6 End-Sem Model Examination Question Papers',
    subjectCode: 'EXAM-SEM6',
    subject: 'All Department Courses',
    department: 'IT',
    semester: 'Semester 6',
    category: 'Exam Paper',
    format: 'ZIP',
    size: '12.4 MB',
    uploadedBy: 'System Administrator',
    updated: 'Oct 02, 2026',
    downloads: 210,
    visibility: 'All Students'
  },
  {
    id: 'mat-108',
    title: 'Digital Electronics & Logic Design Lab Protocols (ES-104)',
    subjectCode: 'EXTC-101',
    subject: 'Digital Electronics & Logic',
    department: 'EXTC',
    semester: 'Semester 2',
    category: 'Lab Manual',
    format: 'PDF',
    size: '4.1 MB',
    uploadedBy: 'Dr. Sanjay Verma',
    updated: 'Sep 15, 2026',
    downloads: 53,
    visibility: 'All Students'
  }
];

export function getStudyMaterials() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STUDY_MATERIALS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDY_MATERIALS;
  } catch (err) {
    console.error('Failed to load study materials from storage', err);
    return INITIAL_STUDY_MATERIALS;
  }
}

export function saveStudyMaterials(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('edutrack_materials_updated', { detail: { items } }));
  } catch (err) {
    console.error('Failed to persist study materials', err);
  }
}

export function addStudyMaterial(material) {
  const current = getStudyMaterials();
  const newItem = {
    id: `mat-${Date.now()}`,
    title: material.title,
    subjectCode: material.subjectCode || 'IT-301',
    subject: material.subject || 'Core Curriculum Course',
    department: material.department || 'IT',
    semester: material.semester || 'Semester 6',
    category: material.category || 'Lecture Notes',
    format: material.format || 'PDF',
    size: material.size || '3.5 MB',
    uploadedBy: material.uploadedBy || 'Institutional Admin',
    updated: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    downloads: 0,
    visibility: material.visibility || 'All Students'
  };
  const updated = [newItem, ...current];
  saveStudyMaterials(updated);
  return updated;
}

export function deleteStudyMaterial(id) {
  const current = getStudyMaterials();
  const updated = current.filter((m) => m.id !== id);
  saveStudyMaterials(updated);
  return updated;
}
