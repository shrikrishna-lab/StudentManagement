/**
 * Assignment Marks & Submissions Data Store
 * Allows teachers to evaluate submissions, assign marks, and provide feedback directly in the Assignments tab.
 */

const STORAGE_KEY_ASSIGNMENT_MARKS = 'edutrack_assignment_marks_store';

export const INITIAL_ASSIGNMENT_SUBMISSIONS = {
  1: {
    // Assignment 1: JDBC Student Management Project (Max 20)
    101: {
      submitted: true,
      submissionDate: '2026-10-02 16:30',
      fileName: 'JDBC_Student_System_v2.zip',
      fileSize: '3.4 MB',
      marks: 19,
      remarks: 'Excellent HikariCP pool and clean DAO pattern implementation.',
      status: 'Graded'
    },
    102: {
      submitted: true,
      submissionDate: '2026-10-03 11:15',
      fileName: 'JDBC_CRUD_Application.zip',
      fileSize: '2.8 MB',
      marks: 18,
      remarks: 'Good schema architecture and solid error handling.',
      status: 'Graded'
    },
    103: {
      submitted: true,
      submissionDate: '2026-10-03 14:20',
      fileName: 'Mini_Project_JDBC.zip',
      fileSize: '1.9 MB',
      marks: 14,
      remarks: 'Basic implementation; needs prepared statement parameter binding.',
      status: 'Graded'
    },
    104: {
      submitted: true,
      submissionDate: '2026-10-02 18:45',
      fileName: 'StudentManagement_JDBC.zip',
      fileSize: '4.1 MB',
      marks: 17,
      remarks: 'Well tested with sample dataset and clear README.',
      status: 'Graded'
    },
    105: {
      submitted: true,
      submissionDate: '2026-10-04 09:10',
      fileName: 'Java_JDBC_Solution.zip',
      fileSize: '2.2 MB',
      marks: 12,
      remarks: 'Submission delayed; missing transaction rollback handling.',
      status: 'Graded'
    },
    106: {
      submitted: true,
      submissionDate: '2026-10-01 20:00',
      fileName: 'JDBC_Enterprise_App.zip',
      fileSize: '5.0 MB',
      marks: 20,
      remarks: 'Outstanding work with clean singleton pattern and JUnit tests.',
      status: 'Graded'
    },
    107: {
      submitted: false,
      submissionDate: null,
      fileName: null,
      fileSize: null,
      marks: 0,
      remarks: 'Submission pending. Follow-up needed by Class Teacher.',
      status: 'Not Submitted'
    },
    108: {
      submitted: true,
      submissionDate: '2026-10-02 22:15',
      fileName: 'Meera_JDBC_Project.zip',
      fileSize: '3.1 MB',
      marks: 18,
      remarks: 'Proper ER mapping and query optimization.',
      status: 'Graded'
    },
    109: {
      submitted: true,
      submissionDate: '2026-10-03 16:50',
      fileName: 'Tanmay_JDBC_Lab.zip',
      fileSize: '2.5 MB',
      marks: 15,
      remarks: 'Satisfactory; code formatting needs PEP/Oracle convention.',
      status: 'Graded'
    },
    110: {
      submitted: true,
      submissionDate: '2026-10-03 17:30',
      fileName: 'Riya_JDBC_Module.zip',
      fileSize: '2.9 MB',
      marks: 17,
      remarks: 'Good database normalization and user session management.',
      status: 'Graded'
    }
  },
  2: {
    // Assignment 2: Collections Framework & Generics Lab (Max 25)
    101: {
      submitted: true,
      submissionDate: '2026-10-01 14:10',
      fileName: 'Generics_Lab_Record.pdf',
      fileSize: '1.8 MB',
      marks: 24,
      remarks: 'Full marks in ConcurrentHashMap and custom comparator test.',
      status: 'Graded'
    },
    102: {
      submitted: true,
      submissionDate: '2026-10-02 10:20',
      fileName: 'Collections_Lab_Ananya.pdf',
      fileSize: '2.1 MB',
      marks: 23,
      remarks: 'Demonstrated deep understanding of iterator and iterable interfaces.',
      status: 'Graded'
    },
    103: {
      submitted: true,
      submissionDate: '2026-10-02 17:40',
      fileName: 'Lab_Report_Collections.pdf',
      fileSize: '1.4 MB',
      marks: 16,
      remarks: 'Re-attempt lambda comparator questions in remedial session.',
      status: 'Graded'
    },
    104: {
      submitted: true,
      submissionDate: '2026-10-03 09:30',
      fileName: 'Generics_Assignment_Sneha.pdf',
      fileSize: '1.7 MB',
      marks: 22,
      remarks: 'Very neat documentation with output screenshots.',
      status: 'Graded'
    },
    105: {
      submitted: false,
      submissionDate: null,
      fileName: null,
      fileSize: null,
      marks: 0,
      remarks: 'Pending student upload.',
      status: 'Not Submitted'
    },
    106: {
      submitted: true,
      submissionDate: '2026-09-30 19:15',
      fileName: 'Pooja_Collections_Lab.pdf',
      fileSize: '2.4 MB',
      marks: 25,
      remarks: 'Flawless paper presentation and clean code snippets.',
      status: 'Graded'
    },
    107: {
      submitted: false,
      submissionDate: null,
      fileName: null,
      fileSize: null,
      marks: 0,
      remarks: 'Needs revision in thread synchronization before submission.',
      status: 'Not Submitted'
    },
    108: {
      submitted: true,
      submissionDate: '2026-10-02 15:45',
      fileName: 'Collections_Generics_Report.pdf',
      fileSize: '1.9 MB',
      marks: 21,
      remarks: 'Good explanation of bounded type parameters.',
      status: 'Graded'
    },
    109: {
      submitted: true,
      submissionDate: '2026-10-03 13:00',
      fileName: 'Lab4_Collections_Tanmay.pdf',
      fileSize: '1.6 MB',
      marks: 16,
      remarks: 'Average; review collection sorting algorithms.',
      status: 'Graded'
    },
    110: {
      submitted: true,
      submissionDate: '2026-10-02 18:00',
      fileName: 'Riya_Lab4_Generics.pdf',
      fileSize: '2.0 MB',
      marks: 22,
      remarks: 'Clear logic and thorough edge cases covered.',
      status: 'Graded'
    }
  }
};

export function getAssignmentMarksStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ASSIGNMENT_MARKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ASSIGNMENT_MARKS, JSON.stringify(INITIAL_ASSIGNMENT_SUBMISSIONS));
      return INITIAL_ASSIGNMENT_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ASSIGNMENT_SUBMISSIONS;
  }
}

export function saveAssignmentMarksStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY_ASSIGNMENT_MARKS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save assignment marks store:', e);
  }
}

export function calculateAssignmentGrade(marks, totalMarks) {
  if (totalMarks <= 0) return { grade: 'N/A', label: 'Not Graded', color: '#64748b' };
  const pct = (marks / totalMarks) * 100;
  if (pct >= 90) return { grade: 'O', label: 'Outstanding (90%+)', color: '#059669', bg: '#ecfdf5' };
  if (pct >= 80) return { grade: 'A+', label: 'Excellent (80-89%)', color: '#2563eb', bg: '#eff6ff' };
  if (pct >= 70) return { grade: 'A', label: 'Very Good (70-79%)', color: '#0891b2', bg: '#ecfeff' };
  if (pct >= 60) return { grade: 'B+', label: 'Good (60-69%)', color: '#4f46e5', bg: '#eef2ff' };
  if (pct >= 50) return { grade: 'B', label: 'Above Average (50-59%)', color: '#d97706', bg: '#fffbeb' };
  if (pct >= 40) return { grade: 'P', label: 'Pass (40-49%)', color: '#ea580c', bg: '#fff7ed' };
  return { grade: 'F', label: 'Resubmit (<40%)', color: '#dc2626', bg: '#fef2f2' };
}

export function exportAssignmentMarksCSV(assignment, studentRows) {
  const headers = ['Roll Number', 'PRN', 'Student Name', 'Division', 'Submission Status', 'File Name', 'Submission Time', `Marks (Out of ${assignment.totalMarks})`, 'Percentage', 'Grade', 'Teacher Remarks'];
  const rows = studentRows.map((s) => {
    const pct = assignment.totalMarks > 0 ? ((s.marks / assignment.totalMarks) * 100).toFixed(1) + '%' : '0%';
    const grade = calculateAssignmentGrade(s.marks, assignment.totalMarks).grade;
    return [
      s.rollNumber,
      `"${s.prn || 'N/A'}"`,
      `"${s.name}"`,
      s.division || 'A',
      s.status || 'Not Submitted',
      `"${s.fileName || 'None'}"`,
      `"${s.submissionDate || 'N/A'}"`,
      s.marks,
      pct,
      grade,
      `"${(s.remarks || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Assignment_Marks_${assignment.title.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
