import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service'; // Ajusta la ruta a tu AuthService
import { environment } from '../environments/environment'; // Para la URL base de la API

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken(); // Obtiene el token del AuthService
    const isLoggedIn = this.authService.isLoggedIn(); // Verifica si el usuario está logueado
    const isApiUrl = request.url.startsWith(environment.apiUrl); // Verifica si la petición va a tu API

    // Si el usuario está logueado, hay un token, y la petición es a tu API, añade la cabecera.
    if (isLoggedIn && token && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Añade la cabecera Authorization con el token Bearer
        }
      });
    }

    return next.handle(request); // Pasa la petición (modificada o no) al siguiente handler
  }
}
