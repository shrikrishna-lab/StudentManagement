/**
 * EduTrack Department Intake, Dynamic Divisions & Sequential Roll Number Engine
 * 
 * Rules:
 * 1. Every department's roll numbers start from 101.
 * 2. Every department has an intake capacity (e.g., 60, 120, 150, 180, 200).
 * 3. Divisions scale with intake (A, B, C, D...).
 *    - Standard target per division is ~60–75 students.
 *    - Intake is distributed as equally as possible across divisions.
 *    - If there is a remainder, extra students are placed in the earliest divisions (e.g. Div A gets 1 extra).
 * 4. Roll numbers continue consecutively across divisions:
 *    - E.g. IT Div A (75 students): Roll 101 to 175
 *    - IT Div B (75 students): Roll 176 to 250
 *    - CS Div A (67 students): Roll 101 to 167
 *    - CS Div B (67 students): Roll 168 to 234
 *    - CS Div C (66 students): Roll 235 to 300
 */

const STORAGE_KEY_INTAKES = 'edutrack_department_intakes_v2';

export const DEFAULT_DEPARTMENTS = [
  {
    code: 'IT',
    name: 'Information Technology',
    headOfDept: 'Dr. Arvind Saxena',
    duration: '4 Years',
    intake: 150, // 2 Divisions (75 in A, 75 in B)
    classesCount: 8,
    activeSemester: 'Semester 6',
    years: [1, 2, 3, 4]
  },
  {
    code: 'CS',
    name: 'Computer Science & Engineering',
    headOfDept: 'Dr. Radhika Sen',
    duration: '4 Years',
    intake: 200, // 3 Divisions (67 in A, 67 in B, 66 in C)
    classesCount: 12,
    activeSemester: 'Semester 6',
    years: [1, 2, 3, 4]
  },
  {
    code: 'EXTC',
    name: 'Electronics & Telecommunication',
    headOfDept: 'Dr. Suresh Rao',
    duration: '4 Years',
    intake: 120, // 2 Divisions (60 in A, 60 in B)
    classesCount: 8,
    activeSemester: 'Semester 4',
    years: [1, 2, 3, 4]
  },
  {
    code: 'MECH',
    name: 'Mechanical Engineering',
    headOfDept: 'Dr. Hemant Patil',
    duration: '4 Years',
    intake: 60, // 1 Division (60 in A)
    classesCount: 4,
    activeSemester: 'Semester 6',
    years: [1, 2, 3, 4]
  },
  {
    code: 'AIDS',
    name: 'Artificial Intelligence & Data Science',
    headOfDept: 'Dr. Meera Nambiar',
    duration: '4 Years',
    intake: 150, // 2 Divisions (75 in A, 75 in B)
    classesCount: 8,
    activeSemester: 'Semester 4',
    years: [1, 2, 3, 4]
  }
];

export function getDepartmentIntakes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTAKES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load department intakes:', e);
  }
  return DEFAULT_DEPARTMENTS;
}

export function saveDepartmentIntakes(intakes) {
  try {
    localStorage.setItem(STORAGE_KEY_INTAKES, JSON.stringify(intakes));
    window.dispatchEvent(new CustomEvent('edutrack_intakes_updated', { detail: intakes }));
  } catch (e) {
    console.error('Failed to save department intakes:', e);
  }
}

/**
 * Calculates divisions and student capacities for a given department intake.
 * E.g., intake = 150 -> 2 divisions [ { division: 'A', count: 75, startRoll: 101, endRoll: 175 }, { division: 'B', count: 75, startRoll: 176, endRoll: 250 } ]
 * E.g., intake = 200 -> 3 divisions [ { division: 'A', count: 67, startRoll: 101, endRoll: 167 }, { division: 'B', count: 67, startRoll: 168, endRoll: 234 }, { division: 'C', count: 66, startRoll: 235, endRoll: 300 } ]
 */
export function calculateDivisionsForIntake(intake = 120) {
  const safeIntake = Math.max(1, Number(intake) || 60);
  
  // Rule: target division capacity ~60–75 students.
  let numDivisions = 1;
  if (safeIntake > 180) {
    numDivisions = Math.ceil(safeIntake / 70); // e.g. 200 -> 3 divisions
  } else if (safeIntake > 75) {
    numDivisions = 2; // e.g. 120, 150 -> 2 divisions
  } else {
    numDivisions = 1; // <= 75 -> 1 division
  }

  const basePerDiv = Math.floor(safeIntake / numDivisions);
  const remainder = safeIntake % numDivisions;

  const divisionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const result = [];
  let currentRoll = 101;

  for (let i = 0; i < numDivisions; i++) {
    const divLetter = divisionLetters[i] || `Div-${i + 1}`;
    const studentCount = basePerDiv + (i < remainder ? 1 : 0);
    const startRoll = currentRoll;
    const endRoll = currentRoll + studentCount - 1;

    result.push({
      division: divLetter,
      count: studentCount,
      startRoll,
      endRoll,
      label: `Division ${divLetter} (Roll ${startRoll}–${endRoll})`
    });

    currentRoll = endRoll + 1;
  }

  return result;
}

/**
 * Returns the division specification for a given department and division letter.
 */
export function getDivisionSpec(deptCode = 'IT', divisionLetter = 'A') {
  const intakes = getDepartmentIntakes();
  const dept = intakes.find((d) => d.code.toUpperCase() === deptCode.toUpperCase()) || intakes[0];
  const divisions = calculateDivisionsForIntake(dept.intake);
  const matched = divisions.find((d) => d.division.toUpperCase() === divisionLetter.toUpperCase());
  return matched || divisions[0];
}

/**
 * Calculates the next available roll number in a specific department and division.
 */
export function getNextRollNumberForDivision(existingStudents = [], deptCode = 'IT', divisionLetter = 'A') {
  const spec = getDivisionSpec(deptCode, divisionLetter);
  const deptStudentsInDiv = existingStudents.filter((s) => {
    const c = (s.course || '').toUpperCase();
    const d = (s.division || 'A').toUpperCase();
    return (c === deptCode.toUpperCase() || c.includes(deptCode.toUpperCase())) && d === divisionLetter.toUpperCase();
  });

  if (deptStudentsInDiv.length === 0) {
    return spec.startRoll;
  }

  const highestRoll = deptStudentsInDiv.reduce((max, s) => Math.max(max, Number(s.rollNumber) || 0), 0);
  const nextRoll = highestRoll >= spec.startRoll ? highestRoll + 1 : spec.startRoll;
  return nextRoll;
}

/**
 * Standard courses metadata
 */
export const AVAILABLE_DEPARTMENTS = [
  { code: 'IT', name: 'Information Technology' },
  { code: 'CS', name: 'Computer Science & Engineering' },
  { code: 'EXTC', name: 'Electronics & Telecommunication' },
  { code: 'MECH', name: 'Mechanical Engineering' },
  { code: 'AIDS', name: 'Artificial Intelligence & Data Science' }
];

export const AVAILABLE_YEARS = [
  { year: 1, label: 'First Year (FE)', semesters: ['Semester 1', 'Semester 2'] },
  { year: 2, label: 'Second Year (SE)', semesters: ['Semester 3', 'Semester 4'] },
  { year: 3, label: 'Third Year (TE)', semesters: ['Semester 5', 'Semester 6'] },
  { year: 4, label: 'Final Year (BE)', semesters: ['Semester 7', 'Semester 8'] }
];
