export type UserRole = 'admin' | 'clinico';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}
