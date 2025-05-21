import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Importaciones necesarias para el template
import { CommonModule } from '@angular/common'; // Para ngIf, ngClass si los usaras (no en este template simplificado)

@Component({
  selector: 'app-auth',
  standalone: true,
  // LoginComponent y RegisterComponent ya no se importan ni se usan directamente aquí
  // Se cargan a través del <router-outlet>
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  // Ya no necesitas la lógica de isLoginView, showLogin o showRegister
  constructor() { }
}
