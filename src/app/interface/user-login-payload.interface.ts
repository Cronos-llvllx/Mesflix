export interface UserLoginPayload {
  email: string;
  password?: string; // La contraseña es opcional si se envía directamente como string
}
