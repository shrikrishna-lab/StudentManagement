/**
 * EduTrack Faculty Allocation & Departmental Role Assignment System
 * Handles Department-wise, Subject-wise, Lab-wise, Class Teacher, and GFM (Guardian Faculty Member) allocations.
 */

const STORAGE_KEY = 'edutrack_faculty_assignments_v1';

export const DEPARTMENTS = [
  'Information Technology',
  'Computer Science',
  'Electronics & Telecommunication',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering'
];

export const INITIAL_FACULTY_ASSIGNMENTS = [
  {
    id: 'FAC-IT-101',
    name: 'Prof. Krrish Sharma',
    email: 'krrish.sharma@edutrack.edu',
    department: 'Information Technology',
    designation: 'Associate Professor & Class Teacher',
    avatarUrl: '/assets/student_avatar.jpg',
    roles: {
      classTeacher: {
        assigned: true,
        division: 'Div A',
        year: 'Year 3 (Semester 6)',
        totalStudents: 42
      },
      gfm: {
        assigned: true,
        cohort: 'Roll #101 to #120 (Div A)',
        menteesCount: 20
      },
      theorySubjects: [
        { code: 'IT-301', name: 'Core Java & OOP Frameworks', credits: 4, weeklyHours: 4 }
      ],
      practicalLabs: [
        { code: 'IT-301L', name: 'Core Java Programming Laboratory', batch: 'Batch 1 (Roll 101–125)', labRoom: 'Computing Lab A-1' }
      ]
    }
  },
  {
    id: 'FAC-IT-102',
    name: 'Prof. Anjali Mehta',
    email: 'anjali.mehta@edutrack.edu',
    department: 'Information Technology',
    designation: 'Assistant Professor & GFM',
    avatarUrl: '/assets/female_student_avatar.jpg',
    roles: {
      classTeacher: {
        assigned: false,
        division: 'None',
        year: '',
        totalStudents: 0
      },
      gfm: {
        assigned: true,
        cohort: 'Roll #121 to #142 (Div A)',
        menteesCount: 22
      },
      theorySubjects: [
        { code: 'IT-302', name: 'Database Management Systems & Transactions', credits: 4, weeklyHours: 4 }
      ],
      practicalLabs: [
        { code: 'IT-302L', name: 'DBMS & SQL Query Optimization Lab', batch: 'Batch 2 (Roll 126–142)', labRoom: 'Computing Lab A-2' }
      ]
    }
  },
  {
    id: 'FAC-CS-103',
    name: 'Dr. Vivek Joshi',
    email: 'vivek.joshi@edutrack.edu',
    department: 'Computer Science',
    designation: 'Professor & Class Teacher',
    avatarUrl: '/assets/student_avatar.jpg',
    roles: {
      classTeacher: {
        assigned: true,
        division: 'Div B',
        year: 'Year 3 (Semester 6)',
        totalStudents: 38
      },
      gfm: {
        assigned: true,
        cohort: 'Roll #201 to #220 (Div B)',
        menteesCount: 20
      },
      theorySubjects: [
        { code: 'IT-303', name: 'Distributed Systems & Cloud Computing', credits: 4, weeklyHours: 4 }
      ],
      practicalLabs: [
        { code: 'CS-303L', name: 'Cloud & Kubernetes Systems Lab', batch: 'Batch 1', labRoom: 'Computing Lab B-1' }
      ]
    }
  },
  {
    id: 'FAC-IT-104',
    name: 'Prof. Neha Gupta',
    email: 'neha.gupta@edutrack.edu',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    avatarUrl: '/assets/female_student_avatar.jpg',
    roles: {
      classTeacher: {
        assigned: false,
        division: 'None',
        year: '',
        totalStudents: 0
      },
      gfm: {
        assigned: false,
        cohort: 'None',
        menteesCount: 0
      },
      theorySubjects: [
        { code: 'IT-304', name: 'Computer Networks & Network Security', credits: 4, weeklyHours: 4 }
      ],
      practicalLabs: [
        { code: 'IT-304L', name: 'Network Security & Packet Analysis Lab', batch: 'Batch 1 & 2', labRoom: 'Networking Lab N-1' }
      ]
    }
  }
];

export function getFacultyAssignments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_FACULTY_ASSIGNMENTS;
}

export function saveFacultyAssignments(assignments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    window.dispatchEvent(new CustomEvent('edutrack_faculty_assignments_updated', { detail: assignments }));
  } catch (e) {
    // ignore
  }
}

export function addFacultyMember(facultyData) {
  const current = getFacultyAssignments();
  const deptCode = (facultyData.department || 'IT').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  const count = current.length + 101;
  const newId = facultyData.id || `FAC-${deptCode}-${count}`;

  const startRoll = Number(facultyData.gfmStartRoll) || 101;
  const endRoll = Number(facultyData.gfmEndRoll) || 135;
  const gfmDivision = facultyData.gfmDivision || 'Div A';
  const gfmDept = facultyData.gfmDept || facultyData.department || 'Information Technology';

  const newFaculty = {
    id: newId,
    name: facultyData.name,
    email: facultyData.email,
    phone: facultyData.phone || '+91 98201 12345',
    cabin: facultyData.cabin || 'Faculty Block B-204',
    department: facultyData.department || 'Information Technology',
    designation: facultyData.designation || 'Assistant Professor',
    avatarUrl: facultyData.gender === 'Female' ? '/assets/female_student_avatar.jpg' : '/assets/student_avatar.jpg',
    roles: {
      classTeacher: {
        assigned: Boolean(facultyData.isClassTeacher),
        department: facultyData.classTeacherDept || facultyData.department,
        division: facultyData.classTeacherDivision || 'Div A',
        year: facultyData.isClassTeacher ? (facultyData.classTeacherYear || 'Year 3 (Semester 6)') : '',
        room: facultyData.classTeacherRoom || 'Room 302',
        totalStudents: facultyData.isClassTeacher ? (facultyData.classTeacherTotalStudents || 65) : 0
      },
      gfm: {
        assigned: Boolean(facultyData.isGfm),
        department: gfmDept,
        division: gfmDivision,
        startRoll: startRoll,
        endRoll: endRoll,
        cabin: facultyData.gfmCabin || 'Counseling Cabin 104',
        cohort: facultyData.gfmCohort || `Roll #${startRoll} to #${endRoll} (${gfmDivision})`,
        menteesCount: facultyData.isGfm ? Math.max(1, endRoll - startRoll + 1) : 0
      },
      theorySubjects: facultyData.theorySubjects || [],
      practicalLabs: facultyData.practicalLabs || []
    }
  };

  current.push(newFaculty);
  saveFacultyAssignments(current);
  return newFaculty;
}

export function updateFacultyAssignment(facultyId, updatedRoles, updatedDept = null) {
  const current = getFacultyAssignments();
  const index = current.findIndex((f) => f.id === facultyId);
  if (index !== -1) {
    current[index] = {
      ...current[index],
      department: updatedDept || current[index].department,
      roles: {
        ...current[index].roles,
        ...updatedRoles
      }
    };
    saveFacultyAssignments(current);
    return current[index];
  }
  return null;
}

export function getTeacherForStudent(studentRollNumber, division = 'A') {
  const faculty = getFacultyAssignments();
  const roll = Number(studentRollNumber) || 101;

  // Find class teacher
  const classTeacher = faculty.find((f) => f.roles?.classTeacher?.assigned && f.roles?.classTeacher?.division.includes(division)) || faculty[0];

  // Find GFM (Guardian Faculty Member)
  let gfm = faculty.find((f) => {
    if (!f.roles?.gfm?.assigned) return false;
    if (roll >= 101 && roll <= 120 && f.id === 'FAC-IT-101') return true;
    if (roll >= 121 && roll <= 145 && f.id === 'FAC-IT-102') return true;
    if (roll >= 201 && roll <= 230 && f.id === 'FAC-CS-103') return true;
    return false;
  }) || faculty[0];

  return {
    classTeacher,
    gfm,
    facultyList: faculty
  };
}
