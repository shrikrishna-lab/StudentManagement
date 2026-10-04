import {
  LayoutDashboard,
  ClipboardCheck,
  GraduationCap,
  ClipboardList,
  BookOpen,
  CalendarDays,
  Megaphone,
  Bell,
  CircleUser,
  Settings,
  Users,
  UserRound,
  School,
  Layers,
  BookMarked,
  BarChart3,
  History,
  Sparkles,
  Library,
  Ticket,
  CreditCard,
  UserCheck,
  Hash,
  ShieldCheck,
  ShieldAlert,
  Presentation
} from 'lucide-react';

/**
 * Role-Based Navigation Data Structures
 * Strictly compliant with Section 10 (Semantic Icon System) and Sections 7, 8, 9
 */

export const studentNavigation = [
  {
    group: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    group: 'ACADEMICS',
    items: [
      { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
      { id: 'marks', label: 'Marks', icon: GraduationCap },
      { id: 'hall-ticket', label: 'Hall Ticket', icon: Ticket },
      { id: 'assignments', label: 'Assignments', icon: ClipboardList },
      { id: 'materials', label: 'Materials', icon: BookOpen },
      { id: 'repository', label: 'Repository', icon: Library },
      { id: 'timetable', label: 'Timetable', icon: CalendarDays }
    ]
  },
  {
    group: 'COMMUNICATION',
    items: [
      { id: 'announcements', label: 'Announcements', icon: Megaphone },
      { id: 'notifications', label: 'Notifications', icon: Bell }
    ]
  },
  {
    group: 'ACCOUNT',
    items: [
      { id: 'profile', label: 'Profile', icon: CircleUser },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export const teacherNavigation = [
  {
    group: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    group: 'TEACHING',
    items: [
      { id: 'classes', label: 'Classes', icon: School },
      { id: 'role-hub', label: 'Role Hub', icon: ShieldCheck },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
      { id: 'performance', label: 'Performance', icon: Sparkles },
      { id: 'fee-status', label: 'Fee Status', icon: CreditCard },
      { id: 'hall-ticket', label: 'Hall Tickets', icon: Ticket },
      { id: 'marks', label: 'Marks & Grading', icon: GraduationCap },
      { id: 'assignments', label: 'Assignments', icon: ClipboardList },
      { id: 'materials', label: 'Materials', icon: BookOpen },
      { id: 'repository', label: 'Repository', icon: Library }
    ]
  },
  {
    group: 'COMMUNICATION',
    items: [
      { id: 'announcements', label: 'Announcements', icon: Megaphone },
      { id: 'notifications', label: 'Notifications', icon: Bell }
    ]
  },
  {
    group: 'SCHEDULE',
    items: [
      { id: 'timetable', label: 'Timetable', icon: CalendarDays }
    ]
  },
  {
    group: 'ACCOUNT',
    items: [
      { id: 'profile', label: 'Profile', icon: CircleUser },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export const adminNavigation = [
  {
    group: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    group: 'PEOPLE',
    items: [
      { id: 'students', label: 'Students', icon: Users },
      { id: 'id-generator', label: 'ID Generator', icon: Hash },
      { id: 'teachers', label: 'Teachers', icon: UserRound },
      { id: 'faculty-allocation', label: 'Faculty Roles', icon: UserCheck }
    ]
  },
  {
    group: 'ACADEMIC',
    items: [
      { id: 'courses', label: 'Courses', icon: Layers },
      { id: 'subjects', label: 'Subjects', icon: BookMarked },
      { id: 'classes', label: 'Classes', icon: School },
      { id: 'timetable', label: 'Timetable', icon: CalendarDays },
      { id: 'repository', label: 'Repository', icon: Library }
    ]
  },
  {
    group: 'MANAGEMENT',
    items: [
      { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
      { id: 'clearance', label: 'Hall Tickets', icon: Ticket },
      { id: 'marks', label: 'Marks', icon: GraduationCap },
      { id: 'assignments', label: 'Assignments', icon: ClipboardList },
      { id: 'materials', label: 'Materials', icon: BookOpen },
      { id: 'doc-scanner', label: 'Doc Scanner', icon: Sparkles }
    ]
  },
  {
    group: 'COMMUNICATION',
    items: [
      { id: 'announcements', label: 'Announcements', icon: Megaphone },
      { id: 'notifications', label: 'Notifications', icon: Bell }
    ]
  },
  {
    group: 'REPORTS',
    items: [
      { id: 'reports', label: 'Reports', icon: BarChart3 }
    ]
  },
  {
    group: 'SYSTEM',
    items: [
      { id: 'security-approvals', label: 'Approvals', icon: ShieldAlert },
      { id: 'activity', label: 'Activity Log', icon: History },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export function getNavigationByRole(role) {
  switch (role) {
    case 'student':
      return studentNavigation;
    case 'teacher':
      return teacherNavigation;
    case 'admin':
    default:
      return adminNavigation;
  }
}
