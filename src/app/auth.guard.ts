import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate, // Importa CanActivate
  RouterStateSnapshot,
  UrlTree,
  Router // Importa Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service'; // Ajusta la ruta a tu AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate { // Implementa CanActivate

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isLoggedIn()) {
      // Si el usuario está logueado (según tu AuthService, que probablemente verifica el token),
      // permite el acceso a la ruta.
      return true;
    } else {
      // Si el usuario NO está logueado, redirige a la página de login.
      // Puedes guardar la URL a la que intentaba acceder (state.url) para redirigirlo allí después del login.
      console.warn('AuthGuard: Usuario no autenticado, redirigiendo a login...');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false; // No permite el acceso a la ruta solicitada
    }
  }
}
