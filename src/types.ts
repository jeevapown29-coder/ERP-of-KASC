export enum Role {
  ADMIN = 'Admin',
  PRINCIPAL = 'Principal',
  HOD = 'HOD',
  FACULTY = 'Faculty',
  STUDENT = 'Student',
  PARENT = 'Parent',
  LIBRARIAN = 'Librarian',
  HOSTEL_WARDEN = 'Hostel Warden',
  ACCOUNTANT = 'Accountant',
  SPORTS_COORDINATOR = 'Sports Coordinator',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
  requiresPasswordChange?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: any; // Lucide icon component type
  path: string;
  roles: Role[];
}
