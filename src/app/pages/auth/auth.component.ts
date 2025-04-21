import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- AÑADIR esta línea

// --- CORREGIR esta ruta de importación ---
// import { LoginComponent } from '../catalog/catalog.component'; // <-- Ruta INCORRECTA
import { LoginComponent } from '../login/login.component'; // <-- Ruta CORREGIDA (asumiendo que está en pages/login/)

import { RegisterComponent } from '../register/register.component'; // <-- Esta ruta parece correcta si está en pages/register/

@Component({
  selector: 'app-auth',
  standalone: true,
  // Asegúrate que CommonModule esté aquí si usas *ngIf, *ngFor, etc. en el HTML
  imports: [
    CommonModule, // <--- Necesario para *ngIf
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss' // <-- Asegúrate que este archivo exista (antes mencionamos .css, .scss está bien si existe)
})
export class AuthComponent {
  isLoginView: boolean = true; // Por defecto mostramos Login

  showLogin() {
    this.isLoginView = true;
  }

  showRegister() {
    this.isLoginView = false;
  }
}
