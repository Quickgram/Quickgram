export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  phoneNumber: string | null;
  isNewUser: boolean;
}
