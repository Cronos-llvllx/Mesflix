export interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  token: string; // El JWT que enviará tu backend
}
