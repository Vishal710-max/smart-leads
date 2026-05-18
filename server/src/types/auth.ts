export enum UserRole {
  Admin = 'admin',
  Sales = 'sales',
}

export interface IUserPayload {
  id: string;
  email: string;
  role: UserRole;
}
