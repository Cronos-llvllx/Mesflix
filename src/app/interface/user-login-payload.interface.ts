export interface UserLoginPayload {
  loginIdentifier: string;
  password?: string; // La contraseña es opcional si se envía directamente como string
}
