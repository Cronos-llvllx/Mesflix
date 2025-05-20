  import { Injectable } from '@angular/core';
  import { HttpClient, HttpErrorResponse } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError, tap } from 'rxjs/operators';

  // Importa tus interfaces y la configuración de entorno
  import { UserRegisterPayload } from '../interface/user-register-payload.interface';
  import { UserLoginPayload } from '../interface/user-login-payload.interface';
  import { AuthResponse } from '../interface/auth-response.interface';
  import { RegisterResponse } from '../interface/register-response.interface';
  import { environment } from '../../environments/environment'; // Para la URL base de la API
  import { Router } from '@angular/router'; // Para la navegación en logout

  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private apiUrl = environment.apiUrl; // Ej: 'https://localhost:7123/api' o 'http://localhost:5280/api'
    private tokenKey = 'mesflix-auth-token'; // Clave para guardar el token en localStorage

    constructor(private http: HttpClient, private router: Router) { }

    // Método para registrar un nuevo usuario
    register(userData: UserRegisterPayload): Observable<RegisterResponse> {
      return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, userData)
        .pipe(
          tap(response => console.log('Respuesta de registro:', response)),
          catchError(this.handleError)
        );
    }

    // Método para iniciar sesión
    login(credentials: UserLoginPayload): Observable<AuthResponse> {
      return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
        .pipe(
          tap(response => {
            console.log('Respuesta de login:', response);
            if (response && response.token) {
              this.storeToken(response.token); // Guarda el token si existe
            }
          }),
          catchError(this.handleError)
        );
    }

    // Método para cerrar sesión
    logout(): void {
      localStorage.removeItem(this.tokenKey);
      console.log('Usuario deslogueado, token eliminado.');
      this.router.navigate(['/auth']); // Redirige a la página de login/auth
    }

    // Guarda el token en localStorage
    storeToken(token: string): void {
      localStorage.setItem(this.tokenKey, token);
    }

    // Obtiene el token de localStorage
    getToken(): string | null {
      return localStorage.getItem(this.tokenKey);
    }

    // Verifica si el usuario está logueado (basado en la existencia del token)
    isLoggedIn(): boolean {
      const token = this.getToken();
      // Podrías añadir validación de expiración del token aquí en el futuro
      return !!token; // Retorna true si el token existe, false si no
    }

    // Manejador de errores HTTP simple
    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Ocurrió un error desconocido.';
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente o de red
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // El backend devolvió un código de respuesta no exitoso.
        // El cuerpo de la respuesta puede contener pistas sobre qué salió mal.
        if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión o el estado del servidor.';
        } else if (error.error && error.error.message) {
          errorMessage = `Error ${error.status}: ${error.error.message}`;
        } else if (typeof error.error === 'string' && error.error.includes('html')) {
          errorMessage = `Error ${error.status}: El servidor devolvió una página de error inesperada. Revisa los logs del backend.`;
        }
        else {
          errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage)); // Retorna un observable con un error user-friendly
    }
  }
