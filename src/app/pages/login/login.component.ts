import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Si quieres navegar después
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { CommonModule } from '@angular/common'; // Para [ngClass], *ngIf
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // <--- Estos imports solo son validos con standalone true
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    // --- Inyecta Router en el constructor ---
    constructor(private router: Router) {}

    // --- Método que se llamará al enviar el formulario ---
    onLogin(): void {
      console.log('Formulario enviado!'); // Para verificar en la consola

      // Simulación: Siempre navega a la selección de usuario
      // Más adelante, aquí validarías credenciales ANTES de navegar
      this.router.navigate(['/select-user']);
    }
  // Variables para el formulario de login
  loginUsername: string = '';
  loginPassword: string = '';
  // Variables para el formulario de registro
  registerUsername: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  // Variable para alternar entre login y registro
  isLoginActive: boolean = true;

  // Método para simular el login
  login() {
    console.log('Login realizado:');
    console.log('Usuario:', this.loginUsername);
    console.log('Contraseña:', this.loginPassword);
    alert('Login simulado con éxito');
  }

  // Método para simular el registro
  register() {
    console.log('Registro realizado:');
    console.log('Usuario:', this.registerUsername);
    console.log('Email:', this.registerEmail);
    console.log('Contraseña:', this.registerPassword);
    alert('Registro simulado con éxito');
  }

  // Método para activar la vista de registro
  activateRegister() {
    this.isLoginActive = false;
  }

  // Método para activar la vista de login
  activateLogin() {
    this.isLoginActive = true;
  }
}
