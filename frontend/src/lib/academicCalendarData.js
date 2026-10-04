/**
 * EduTrack Academic Calendar & Semester Duration Manager
 * Allows administrators to configure term dates, semester durations,
 * examination schedules, and automated student cohort progression rules.
 */

const STORAGE_KEY_CALENDAR = 'edutrack_academic_calendar_settings_v1';

export const DEFAULT_ACADEMIC_CALENDAR = {
  academicYear: '2026–2027',
  termName: 'Even Semester (Phase II)',
  termType: 'even', // 'odd' | 'even'
  activeSemesterLabel: 'Semester 6 (TE) & Semester 4 (SE) & Semester 8 (BE)',
  startDate: '2026-01-12',
  endDate: '2026-05-22',
  totalInstructionalWeeks: 18,
  totalWorkingDays: 92,
  teachingWeeksCompleted: 14,

  // Key Academic Milestone Windows
  midtermStart: '2026-03-02',
  midtermEnd: '2026-03-09',
  labExamStart: '2026-04-20',
  labExamEnd: '2026-04-28',
  endtermExamStart: '2026-05-04',
  endtermExamEnd: '2026-05-22',
  resultsDate: '2026-06-10',
  nextTermStartDate: '2026-07-15',

  // Policy & Progression Rules
  minimumAttendancePct: 75,
  graceAttendancePct: 65,
  passingCreditsPerSem: 20,
  autoEnrollOnProgression: true,
  allowBacklogCarryover: true,
  maxBacklogsAllowed: 4,
  lastUpdated: '2026-10-04T00:45:00Z',
  updatedBy: 'Dean of Academic Affairs'
};

export function getAcademicCalendar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CALENDAR);
    if (raw) {
      return { ...DEFAULT_ACADEMIC_CALENDAR, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to read academic calendar settings:', e);
  }
  return DEFAULT_ACADEMIC_CALENDAR;
}

export function saveAcademicCalendar(newSettings) {
  try {
    const merged = {
      ...getAcademicCalendar(),
      ...newSettings,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(merged));
    window.dispatchEvent(
      new CustomEvent('edutrack_academic_calendar_updated', {
        detail: { calendar: merged }
      })
    );
    return merged;
  } catch (e) {
    console.error('Failed to save academic calendar settings:', e);
    return newSettings;
  }
}

/**
 * Computes remaining calendar days and instructional status.
 */
export function getCalendarDurationSummary(cal = getAcademicCalendar()) {
  const now = new Date();
  const start = new Date(cal.startDate);
  const end = new Date(cal.endDate);
  const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  const elapsedDays = Math.max(0, Math.min(totalDays, Math.round((now - start) / (1000 * 60 * 60 * 24))));
  const daysRemaining = Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24)));
  const progressPct = Math.round((elapsedDays / totalDays) * 100);

  return {
    totalDays,
    elapsedDays,
    daysRemaining,
    progressPct,
    isTermActive: now >= start && now <= end,
    statusText: now < start ? 'Upcoming Term' : now > end ? 'Term Concluded' : 'In Session'
  };
}
