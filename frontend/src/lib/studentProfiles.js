/**
 * EduTrack Student Profile & 3D Avatar Catalog
 * Comprehensive support for male and female university students,
 * faculty mentors, and administrators.
 */

export const AVATAR_OPTIONS = [
  {
    id: 'male_classic',
    label: 'Krrish · Emerald Hoodie',
    gender: 'Male',
    role: 'Student',
    url: '/assets/student_avatar.jpg',
    tag: 'Classic 3D'
  },
  {
    id: 'female_waves',
    label: 'Ananya · Wavy Locks & Star Clip',
    gender: 'Female',
    role: 'Student',
    url: '/assets/female_student_avatar.jpg',
    tag: 'Batch Topper'
  },
  {
    id: 'female_ponytail',
    label: 'Sneha · Ponytail & Glasses',
    gender: 'Female',
    role: 'Student',
    url: '/assets/female_student_avatar_2.jpg',
    tag: 'Scholar'
  },
  {
    id: 'male_curls',
    label: 'Rohan · Curls & Frames',
    gender: 'Male',
    role: 'Student',
    url: '/assets/male_student_avatar_2.jpg',
    tag: 'Tech Lead'
  }
];

export const PRESET_STUDENT_PERSONAS = [
  {
    id: 'krrish',
    rollNumber: 101,
    name: 'Krrish Sharma',
    gender: 'Male',
    email: 'krrish.sharma@edutrack.edu',
    phone: '+91 98765 43210',
    course: 'IT',
    programFull: 'B.Tech in Information Technology',
    year: 3,
    division: 'A',
    semester: 'Semester 6',
    percentage: 89.50,
    sgpa: 8.95,
    cgpa: 8.82,
    earnedCredits: 24.0,
    totalCredits: 24.0,
    standing: 'First Class with Distinction',
    feeStatus: 'paid',
    feeDueAmount: 0,
    attendancePercentage: 89.5,
    prn: 'PRN-2024098101',
    avatarUrl: '/assets/student_avatar.jpg',
    location: 'Division A, Classroom 302, Academic Block A',
    bio: 'Junior B.Tech IT scholar focusing on Distributed Systems and Database Architectures.'
  },
  {
    id: 'rohan',
    rollNumber: 102,
    name: 'Rohan Patel',
    gender: 'Male',
    email: 'rohan.patel@edutrack.edu',
    phone: '+91 98223 34455',
    course: 'IT',
    programFull: 'B.Tech in Information Technology',
    year: 3,
    division: 'A',
    semester: 'Semester 6',
    percentage: 71.40,
    sgpa: 7.20,
    cgpa: 7.15,
    earnedCredits: 20.0,
    totalCredits: 24.0,
    standing: 'Active Candidate',
    feeStatus: 'pending',
    feeDueAmount: 40000,
    attendancePercentage: 71.4,
    prn: 'PRN-2024098102',
    avatarUrl: '/assets/male_student_avatar_2.jpg',
    location: 'Division A, IT Computing Lab 102',
    bio: 'Web Development and Network Security enthusiast.'
  },
  {
    id: 'pooja',
    rollNumber: 103,
    name: 'Pooja Nair',
    gender: 'Female',
    email: 'pooja.n@edutrack.edu',
    phone: '+91 98112 23344',
    course: 'IT',
    programFull: 'B.Tech in Information Technology',
    year: 3,
    division: 'A',
    semester: 'Semester 6',
    percentage: 95.80,
    sgpa: 9.60,
    cgpa: 9.40,
    earnedCredits: 24.0,
    totalCredits: 24.0,
    standing: 'Institute Rank #1 · Gold Medalist',
    feeStatus: 'paid',
    feeDueAmount: 0,
    attendancePercentage: 95.8,
    prn: 'PRN-2024098103',
    avatarUrl: '/assets/female_student_avatar.jpg',
    location: 'Division A, Classroom 302, Academic Block A',
    bio: 'Information Technology undergraduate researching Cloud Infrastructures and Distributed Systems.'
  },
  {
    id: 'meera',
    rollNumber: 104,
    name: 'Meera Iyer',
    gender: 'Female',
    email: 'meera.i@edutrack.edu',
    phone: '+91 98334 45566',
    course: 'IT',
    programFull: 'B.Tech in Information Technology',
    year: 3,
    division: 'A',
    semester: 'Semester 6',
    percentage: 89.10,
    sgpa: 8.90,
    cgpa: 8.85,
    earnedCredits: 24.0,
    totalCredits: 24.0,
    standing: 'Dean’s Honor List · First Class Dist.',
    feeStatus: 'paid',
    feeDueAmount: 0,
    attendancePercentage: 89.1,
    prn: 'PRN-2024098104',
    avatarUrl: '/assets/female_student_avatar_2.jpg',
    location: 'Division A, IT Innovation Lab 201',
    bio: 'IT scholar specializing in Full-Stack Architecture and Cloud Security.'
  },
  {
    id: 'tanmay',
    rollNumber: 105,
    name: 'Tanmay Deshmukh',
    gender: 'Male',
    email: 'tanmay.d@edutrack.edu',
    phone: '+91 98889 90011',
    course: 'IT',
    programFull: 'B.Tech in Information Technology',
    year: 3,
    division: 'B',
    semester: 'Semester 6',
    percentage: 64.00,
    sgpa: 6.80,
    cgpa: 6.75,
    earnedCredits: 20.0,
    totalCredits: 24.0,
    standing: 'Active Candidate',
    feeStatus: 'paid',
    feeDueAmount: 0,
    attendancePercentage: 64.0,
    prn: 'PRN-2024098105',
    avatarUrl: '/assets/student_avatar.jpg',
    location: 'Division B, Classroom 304, Academic Block A',
    bio: 'Undergraduate student in Information Technology focusing on Mobile App Development.'
  }
];

export const PRESET_FACULTY_PERSONAS = [
  {
    id: 'faculty_krrish',
    staffId: 'FAC-IT-101',
    prn: 'FAC-IT-101',
    name: 'Prof. Krrish Sharma',
    gender: 'Male',
    email: 'krrish.faculty@edutrack.edu',
    phone: '+91 98230 11450',
    department: 'Information Technology',
    course: 'Information Technology',
    designation: 'Associate Professor',
    standing: 'Senior Faculty Mentor',
    specialization: 'Core Java, OOP & Cloud Systems',
    location: 'Faculty Cabin 402, Block B',
    avatarUrl: '/assets/student_avatar.jpg',
    bloodGroup: 'B+',
    teachingLoad: '3 Classes · 125 Students',
    semester: 'Academic Year 2026–2027',
    bio: 'Associate Professor leading the Information Technology faculty group and software architecture labs.'
  },
  {
    id: 'faculty_anjali',
    staffId: 'FAC-IT-103',
    prn: 'FAC-IT-103',
    name: 'Prof. Anjali Mehta',
    gender: 'Female',
    email: 'anjali.mehta@edutrack.edu',
    phone: '+91 98115 67890',
    department: 'Information Technology',
    course: 'Information Technology',
    designation: 'Senior Assistant Professor',
    standing: 'DBMS Research Lead',
    specialization: 'Database Systems & SQL Optimization',
    location: 'Faculty Cabin 305, Block B',
    avatarUrl: '/assets/female_student_avatar.jpg',
    bloodGroup: 'O+',
    teachingLoad: '2 Classes · 86 Students',
    semester: 'Academic Year 2026–2027',
    bio: 'Specialist in Relational and Distributed Databases with 9+ years of undergraduate instruction experience.'
  },
  {
    id: 'faculty_vivek',
    staffId: 'FAC-CS-102',
    prn: 'FAC-CS-102',
    name: 'Dr. Vivek Joshi',
    gender: 'Male',
    email: 'v.joshi@edutrack.edu',
    phone: '+91 98334 77889',
    department: 'Computer Science',
    course: 'Computer Science',
    designation: 'Professor & HOD',
    standing: 'Head of Department',
    specialization: 'Distributed Systems & Algorithms',
    location: 'Tech Wing, Cabin 501',
    avatarUrl: '/assets/male_student_avatar_2.jpg',
    bloodGroup: 'A+',
    teachingLoad: '4 Classes · 165 Students',
    semester: 'Academic Year 2026–2027',
    bio: 'Head of Computer Science Department leading research in high-performance distributed computing.'
  }
];

const STORAGE_KEY = 'edutrack_active_student_profile';
const FACULTY_STORAGE_KEY = 'edutrack_active_faculty_profile';

export function getStoredStudentProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading student profile:', e);
  }
  return PRESET_STUDENT_PERSONAS[0]; // Krrish Sharma as default
}

export function saveStoredStudentProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('edutrack_profile_updated', { detail: profile }));
  } catch (e) {
    console.error('Failed saving student profile:', e);
  }
}

export function getStoredFacultyProfile(currentUser) {
  try {
    const raw = localStorage.getItem(FACULTY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If currentUser is provided, ensure stored profile belongs to this faculty member
      if (currentUser) {
        const matchesUser =
          (!currentUser.email || parsed.email?.toLowerCase() === currentUser.email?.toLowerCase()) &&
          (!currentUser.name || parsed.name?.toLowerCase() === currentUser.name?.toLowerCase());
        if (matchesUser) {
          return parsed;
        }
      } else {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed reading faculty profile:', e);
  }
  
  // Default to Prof. Krrish Sharma (Department of IT)
  return {
    ...PRESET_FACULTY_PERSONAS[0],
    ...(currentUser ? {
      name: currentUser.name || PRESET_FACULTY_PERSONAS[0].name,
      email: currentUser.email || PRESET_FACULTY_PERSONAS[0].email,
      department: currentUser.department || PRESET_FACULTY_PERSONAS[0].department,
      designation: currentUser.designation || PRESET_FACULTY_PERSONAS[0].designation
    } : {})
  };
}

export function saveStoredFacultyProfile(profile) {
  try {
    localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('edutrack_faculty_profile_updated', { detail: profile }));
  } catch (e) {
    console.error('Failed saving faculty profile:', e);
  }
}
