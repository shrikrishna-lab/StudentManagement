/**
 * EduTrack Centralized User Credentials & Security Service
 * Handles:
 * - Dynamic Login with PRN / Staff ID / Email + Password
 * - Auto-generation of credentials & temporary passwords for Students & Teachers
 * - Password change requests with Administrator approval workflow
 * - In-app security audit notifications
 */

const CREDENTIALS_STORAGE_KEY = 'edutrack_user_credentials';
const PASS_REQUESTS_STORAGE_KEY = 'edutrack_password_change_requests';

// Default initial system accounts
const INITIAL_CREDENTIALS = [
  {
    id: 'usr_admin',
    loginId: 'ADM-SYS-001',
    email: 'admin@edutrack.edu',
    password: 'admin',
    name: 'System Administrator',
    role: 'admin',
    roleLabel: 'Admin',
    department: 'Central IT Administration',
    status: 'Active',
    mustChangePassword: false,
    createdAt: '2026-01-10'
  },
  {
    id: 'usr_teacher_101',
    loginId: 'FAC-IT-101',
    email: 'teacher@edutrack.edu',
    password: 'teacher',
    name: 'Prof. Krrish Sharma',
    role: 'teacher',
    roleLabel: 'Teacher',
    department: 'Information Technology',
    designation: 'Associate Professor & Class Teacher',
    status: 'Active',
    mustChangePassword: false,
    createdAt: '2026-01-15'
  },
  {
    id: 'usr_teacher_102',
    loginId: 'FAC-CS-102',
    email: 'v.joshi@edutrack.edu',
    password: 'teacher',
    name: 'Dr. Vivek Joshi',
    role: 'teacher',
    roleLabel: 'Teacher',
    department: 'Computer Science',
    designation: 'Professor & HOD',
    status: 'Active',
    mustChangePassword: false,
    createdAt: '2026-01-16'
  },
  {
    id: 'usr_student_101',
    loginId: 'RBT24IT001',
    email: 'student@edutrack.edu',
    password: 'student',
    name: 'Krrish Sharma',
    role: 'student',
    roleLabel: 'Student',
    rollNumber: 101,
    department: 'Information Technology',
    division: 'A',
    status: 'Active',
    mustChangePassword: false,
    createdAt: '2026-02-01'
  },
  {
    id: 'usr_student_102',
    loginId: 'RBT24CS002',
    email: 'ananya.verma@edutrack.edu',
    password: 'student',
    name: 'Ananya Verma',
    role: 'student',
    roleLabel: 'Student',
    rollNumber: 102,
    department: 'Computer Science',
    division: 'B',
    status: 'Active',
    mustChangePassword: false,
    createdAt: '2026-02-01'
  },
  {
    id: 'usr_student_103',
    loginId: 'RBT24IT003',
    email: 'rohan.patel@edutrack.edu',
    password: 'student',
    name: 'Rohan Patel',
    role: 'student',
    roleLabel: 'Student',
    rollNumber: 103,
    department: 'Information Technology',
    division: 'A',
    status: 'Active',
    mustChangePassword: false,
    createdAt: '2026-02-02'
  }
];

// Seed initial password change requests for demo
const INITIAL_PASSWORD_REQUESTS = [
  {
    id: 'REQ-SEC-2026-001',
    userId: 'usr_student_103',
    userName: 'Rohan Patel',
    loginId: 'RBT24IT003',
    email: 'rohan.patel@edutrack.edu',
    role: 'student',
    department: 'Information Technology',
    currentPasswordMasked: '••••••',
    requestedNewPassword: 'RohanSecure#2026',
    reason: 'Temporary password expired; requesting permanent private credentials.',
    status: 'Pending', // 'Pending' | 'Approved' | 'Rejected'
    requestedAt: '2026-10-02T14:30:00Z',
    reviewedAt: null,
    reviewedBy: null,
    adminNotes: null
  },
  {
    id: 'REQ-SEC-2026-002',
    userId: 'usr_teacher_102',
    userName: 'Dr. Vivek Joshi',
    loginId: 'FAC-CS-102',
    email: 'v.joshi@edutrack.edu',
    role: 'teacher',
    department: 'Computer Science',
    currentPasswordMasked: '••••••',
    requestedNewPassword: 'Joshi@CSdept2026',
    reason: 'Periodic departmental security rotation.',
    status: 'Approved',
    requestedAt: '2026-09-28T09:15:00Z',
    reviewedAt: '2026-09-28T10:00:00Z',
    reviewedBy: 'System Administrator',
    adminNotes: 'Verified with faculty ID.'
  }
];

export function getUserCredentials() {
  try {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(INITIAL_CREDENTIALS));
      return INITIAL_CREDENTIALS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load credentials from storage:', e);
    return INITIAL_CREDENTIALS;
  }
}

export function saveUserCredentials(list) {
  try {
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('edutrack_credentials_updated', { detail: list }));
  } catch (e) {
    console.error('Failed to save credentials to storage:', e);
  }
}

export function getPasswordChangeRequests() {
  try {
    const raw = localStorage.getItem(PASS_REQUESTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PASS_REQUESTS_STORAGE_KEY, JSON.stringify(INITIAL_PASSWORD_REQUESTS));
      return INITIAL_PASSWORD_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load password requests:', e);
    return INITIAL_PASSWORD_REQUESTS;
  }
}

export function savePasswordChangeRequests(list) {
  try {
    localStorage.setItem(PASS_REQUESTS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('edutrack_security_requests_updated', { detail: list }));
  } catch (e) {
    console.error('Failed to save password requests:', e);
  }
}

/**
 * Generate a random memorable secure password
 */
export function generateSecurePassword(prefix = 'Edu') {
  const digits = Math.floor(1000 + Math.random() * 9000);
  const symbols = ['@', '#', '$', '!'];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  return `${prefix}${symbol}${digits}`;
}

/**
 * Authenticate user by identifier (Email OR Login ID/PRN/Staff ID) and password
 */
export function authenticateUser(identifier, password) {
  if (!identifier || !password) return { success: false, message: 'Please provide both login ID and password.' };

  const creds = getUserCredentials();
  const trimmedId = identifier.trim().toLowerCase();
  const trimmedPass = password.trim();

  const matched = creds.find(
    (u) =>
      u.email.toLowerCase() === trimmedId ||
      (u.loginId && u.loginId.toLowerCase() === trimmedId) ||
      (u.rollNumber && String(u.rollNumber) === trimmedId)
  );

  if (!matched) {
    return { success: false, message: 'Account not found. Verify your PRN, Staff ID, or Email.' };
  }

  if (matched.password !== trimmedPass) {
    return { success: false, message: 'Invalid password. Please check your credentials.' };
  }

  if (matched.status === 'Suspended') {
    return { success: false, message: 'This account has been suspended by Administrator.' };
  }

  return { success: true, user: matched };
}

/**
 * Register student credentials upon Student Creation
 */
export function registerStudentCredentials(student) {
  const creds = getUserCredentials();
  const year2Digit = '24';
  const deptCode = (student.course || 'IT').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  const seq = String(student.rollNumber || (creds.length + 101)).padStart(3, '0');
  const generatedPRN = student.prn || `RBT${year2Digit}${deptCode}${seq}`;
  const generatedPassword = generateSecurePassword('Rbt');

  const existingIndex = creds.findIndex(
    (c) => c.loginId === generatedPRN || (student.email && c.email.toLowerCase() === student.email.toLowerCase())
  );

  const newRecord = {
    id: `usr_student_${student.rollNumber || Date.now()}`,
    loginId: generatedPRN,
    email: student.email || `${student.name.toLowerCase().replace(/\s+/g, '.')}@edutrack.edu`,
    password: generatedPassword,
    name: student.name,
    role: 'student',
    roleLabel: 'Student',
    rollNumber: student.rollNumber,
    department: student.course || 'IT',
    division: student.division || 'A',
    status: 'Active',
    mustChangePassword: true,
    createdAt: new Date().toISOString().split('T')[0]
  };

  if (existingIndex >= 0) {
    creds[existingIndex] = { ...creds[existingIndex], ...newRecord };
  } else {
    creds.push(newRecord);
  }

  saveUserCredentials(creds);

  return {
    loginId: newRecord.loginId,
    email: newRecord.email,
    password: newRecord.password,
    name: newRecord.name,
    role: 'student'
  };
}

/**
 * Register teacher credentials upon Faculty Creation
 */
export function registerTeacherCredentials(teacher) {
  const creds = getUserCredentials();
  const deptCode = (teacher.department || 'IT').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  const count = creds.filter((c) => c.role === 'teacher').length + 101;
  const staffId = teacher.id || teacher.staffId || `FAC-${deptCode}-${count}`;
  const generatedPassword = generateSecurePassword('Fac');

  const existingIndex = creds.findIndex(
    (c) => c.loginId === staffId || (teacher.email && c.email.toLowerCase() === teacher.email.toLowerCase())
  );

  const newRecord = {
    id: `usr_teacher_${Date.now()}`,
    loginId: staffId,
    email: teacher.email || `${teacher.name.toLowerCase().replace(/\s+/g, '.')}@edutrack.edu`,
    password: generatedPassword,
    name: teacher.name,
    role: 'teacher',
    roleLabel: 'Teacher',
    department: teacher.department || 'Information Technology',
    designation: teacher.designation || 'Assistant Professor',
    status: 'Active',
    mustChangePassword: true,
    createdAt: new Date().toISOString().split('T')[0]
  };

  if (existingIndex >= 0) {
    creds[existingIndex] = { ...creds[existingIndex], ...newRecord };
  } else {
    creds.push(newRecord);
  }

  saveUserCredentials(creds);

  return {
    loginId: newRecord.loginId,
    email: newRecord.email,
    password: newRecord.password,
    name: newRecord.name,
    role: 'teacher'
  };
}

/**
 * Submit Password Change Request (User Side)
 */
export function submitPasswordChangeRequest({ user, currentPassword, newPassword, reason }) {
  const creds = getUserCredentials();
  const matched = creds.find(
    (c) =>
      c.id === user.id ||
      (c.loginId && c.loginId === user.loginId) ||
      c.email.toLowerCase() === (user.email || '').toLowerCase()
  );

  if (!matched) {
    return { success: false, message: 'User account not found.' };
  }

  if (matched.password !== currentPassword.trim()) {
    return { success: false, message: 'Current password does not match system records.' };
  }

  if (newPassword.trim().length < 6) {
    return { success: false, message: 'New password must be at least 6 characters long.' };
  }

  const requests = getPasswordChangeRequests();
  const existingPending = requests.find(
    (r) => (r.userId === user.id || r.loginId === user.loginId) && r.status === 'Pending'
  );

  if (existingPending) {
    return {
      success: false,
      message: `You already have a pending password change request (#${existingPending.id}). Await administrator approval.`
    };
  }

  const newRequest = {
    id: `REQ-SEC-${Date.now().toString().slice(-6)}`,
    userId: user.id || matched.id,
    userName: user.name || matched.name,
    loginId: user.loginId || matched.loginId,
    email: user.email || matched.email,
    role: user.role || matched.role,
    department: user.department || matched.department,
    currentPasswordMasked: '••••••',
    requestedNewPassword: newPassword.trim(),
    reason: reason || 'User requested password update in profile settings.',
    status: 'Pending',
    requestedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    adminNotes: null
  };

  requests.unshift(newRequest);
  savePasswordChangeRequests(requests);

  return {
    success: true,
    requestId: newRequest.id,
    message: 'Password change request submitted! It will take effect once reviewed and approved by Administrator.'
  };
}

/**
 * Approve Password Change Request (Admin Side)
 */
export function approvePasswordChangeRequest(requestId, adminName = 'System Administrator') {
  const requests = getPasswordChangeRequests();
  const reqIndex = requests.findIndex((r) => r.id === requestId);

  if (reqIndex < 0) return { success: false, message: 'Request not found.' };
  const targetReq = requests[reqIndex];

  if (targetReq.status !== 'Pending') {
    return { success: false, message: `Request is already ${targetReq.status.toLowerCase()}.` };
  }

  // Commit the new password to credentials
  const creds = getUserCredentials();
  const credIndex = creds.findIndex(
    (c) => c.id === targetReq.userId || (c.loginId && c.loginId === targetReq.loginId) || c.email === targetReq.email
  );

  if (credIndex >= 0) {
    creds[credIndex].password = targetReq.requestedNewPassword;
    creds[credIndex].mustChangePassword = false;
    saveUserCredentials(creds);
  }

  // Update request record
  requests[reqIndex] = {
    ...targetReq,
    status: 'Approved',
    reviewedAt: new Date().toISOString(),
    reviewedBy: adminName,
    adminNotes: 'Identity confirmed and password updated.'
  };

  savePasswordChangeRequests(requests);

  return {
    success: true,
    message: `Request #${requestId} approved! The user's password has been updated.`
  };
}

/**
 * Reject Password Change Request (Admin Side)
 */
export function rejectPasswordChangeRequest(requestId, adminName = 'System Administrator', rejectionReason = 'Verification requirements not met.') {
  const requests = getPasswordChangeRequests();
  const reqIndex = requests.findIndex((r) => r.id === requestId);

  if (reqIndex < 0) return { success: false, message: 'Request not found.' };
  const targetReq = requests[reqIndex];

  requests[reqIndex] = {
    ...targetReq,
    status: 'Rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: adminName,
    adminNotes: rejectionReason
  };

  savePasswordChangeRequests(requests);

  return {
    success: true,
    message: `Request #${requestId} rejected.`
  };
}

/**
 * Get count of pending security requests
 */
export function getPendingSecurityRequestsCount() {
  const requests = getPasswordChangeRequests();
  return requests.filter((r) => r.status === 'Pending').length;
}

export const getAllRegisteredCredentials = getUserCredentials;

export function clearCompletedRequests() {
  const requests = getPasswordChangeRequests();
  const pendingOnly = requests.filter((r) => r.status === 'Pending');
  savePasswordChangeRequests(pendingOnly);
  return pendingOnly;
}
