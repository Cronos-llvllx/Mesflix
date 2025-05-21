export interface UserRegisterPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // Asegúrate del formato esperado por el backend, ej. 'YYYY-MM-DD'
  email: string;
  password: string;
}
