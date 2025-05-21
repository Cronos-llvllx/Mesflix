  import { Injectable } from '@angular/core';
  import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
  import { Observable, BehaviorSubject, throwError } from 'rxjs';
  import { catchError, tap } from 'rxjs/operators';

  // Importa tus interfaces y la configuración de entorno
  import { UserRegisterPayload } from '../interface/user-register-payload.interface';
  import { UserLoginPayload } from '../interface/user-login-payload.interface';
  import { AuthResponse } from '../interface/auth-response.interface';
  import { RegisterResponse } from '../interface/register-response.interface';
  import { environment } from '../../environments/environment'; // Para la URL base de la API
  import { Router } from '@angular/router'; // Para la navegación en logout
  import { FavoritesService } from './favorites.service'; // Asegúrate de que la ruta sea correcta

  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private apiUrl = environment.apiUrl; // Ej: 'https://localhost:8000/api'
    private tokenKey = 'mesflix-auth-token'; // Clave para guardar el token en localStorage

    // BehaviorSubject para el estado de login
    private loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());
    isUserLoggedIn$ = this.loggedInStatus.asObservable(); // Observable para que los componentes se suscriban

    constructor(private http: HttpClient, private router: Router, private favoritesService: FavoritesService) { }

    private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

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
  this.loggedInStatus.next(false);
  this.favoritesService.clearLocalFavorites(); // Limpia los favoritos locales
  console.log('Usuario deslogueado, token y favoritos locales eliminados.');
  this.router.navigate(['/auth/login']);
}

    // Guarda el token en localStorage
    storeToken(token: string): void {
      localStorage.setItem(this.tokenKey, token);
      this.loggedInStatus.next(true); //por si se llama externamente

    }

    // Obtiene el token de localStorage
    getToken(): string | null {
      return localStorage.getItem(this.tokenKey);
    }

    // Verifica si el usuario está logueado (basado en la existencia del token)
    isLoggedIn(): boolean {
        return this.hasToken();
        // O si quieres verificar la expiración del token aquí (más avanzado para el guard):
        //const token = this.getToken();
        //if (!token) return false;
        //const decodedToken = /* lógica para decodificar token y obtener expiración */;
        //return decodedToken.exp > Date.now() / 1000;
      }

    // Manejador de errores HTTP simple
private handleError(error: HttpErrorResponse) {
  let errorMessage = 'Ocurrió un error desconocido. Por favor, intenta de nuevo.';

  if (error.error instanceof ErrorEvent) {
    // Error del lado del cliente o de red
    errorMessage = `Error de cliente o red: ${error.error.message}`;
  } else {
    // El backend devolvió un código de respuesta no exitoso.
    console.error('Backend error:', error); // Loguear el error completo para depuración

    if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión o el estado del servidor.';
    } else if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error; // Si el backend devuelve un string simple
      } else if (error.error.message) { // Si el backend devuelve { message: "..." }
        errorMessage = error.error.message;
      } else if (error.error.errors && typeof error.error.errors === 'object') {
        // Para errores de validación de ASP.NET Core (ModelState)
        const modelStateErrors = [];
        for (const key in error.error.errors) {
          if (error.error.errors[key] && Array.isArray(error.error.errors[key])) {
            modelStateErrors.push(error.error.errors[key].join(' '));
          }
        }
        if (modelStateErrors.length > 0) {
          errorMessage = modelStateErrors.join('\n');
        } else {
          errorMessage = `Error ${error.status}: ${error.statusText || 'Error del servidor'}`;
        }
      } else if (error.message) { // A veces el mensaje de error principal está en error.message
          errorMessage = error.message;
      }
        else {
        errorMessage = `Error ${error.status}: ${error.statusText || 'Respuesta inesperada del servidor'}`;
      }
    }    else {
      errorMessage = `Error HTTP ${error.status}: ${error.statusText || 'Error en la comunicación con el servidor'}`;
    }
  }
  console.error(`AuthService handleError: ${errorMessage}`);
  return throwError(() => new Error(errorMessage));
}
  }
