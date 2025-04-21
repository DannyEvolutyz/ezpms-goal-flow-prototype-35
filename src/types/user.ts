
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoUrl?: string;
  managerId?: string;
  teamMembers?: string[]; // IDs of users reporting to this user
}

// User role type alias
export type UserRole = 'admin' | 'manager' | 'member';
