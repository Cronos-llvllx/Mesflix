import { Component, OnInit, OnDestroy } from '@angular/core'; // Añadir OnInit, OnDestroy
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs'; // Para la desuscripción
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isUserMenuOpen: boolean = false;
  isScrolled: boolean = false;
  isLoggedIn: boolean = false; // Para el estado de login
  private authSubscription!: Subscription; // Para desuscripción

  // Variable para almacenar la ruta actual y decidir si mostrar la barra de búsqueda
  currentRoute: string = '';

  constructor(
    private router: Router,
    public authService: AuthService // Hacerlo público para acceso fácil en template o inyectarlo privado y usar la suscripción
  ) {
    // Suscribirse a eventos de navegación para obtener la ruta actual
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {
    // Suscribirse al estado de login del AuthService
    this.authSubscription = this.authService.isUserLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      console.log('Navbar: User logged in status:', this.isLoggedIn);
    });

    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    window.removeEventListener('scroll', this.scroll, true);
  }

  // Método para llamar al logout del AuthService
  handleLogout(): void {
    this.authService.logout();
    this.isUserMenuOpen = false; // Cierra el menú si estaba abierto
  }

  // --- Métodos existentes ---
  scroll = (): void => {
    this.isScrolled = window.pageYOffset > 50;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  // Método para decidir si mostrar la barra de búsqueda
  showSearchBar(): boolean {
    // Lista de rutas donde NO quieres mostrar la barra de búsqueda
    const noSearchRoutes = ['/auth/login', '/auth/register', '/select-user'];
    return !noSearchRoutes.some(route => this.currentRoute.startsWith(route));
  }
}
