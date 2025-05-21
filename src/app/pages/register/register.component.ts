import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Para ngIf, ngFor, etc.
import { AuthService } from '../../services/auth.service'; // se ajusta la ruta
import { UserRegisterPayload } from '../../interface/user-register-payload.interface'; // interfaz

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // Tus campos individuales con sus validadores individuales
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required], // Opcional Validators.required
      dateOfBirth: ['', Validators.required], // Añade validadores específicos de fecha
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required] // Validador 'required' para el campo en sí
    }, {
      //validadores a nivel de grupo
      validators: this.passwordMatchValidator
    });
  }


  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      // Marcar campos como tocados para mostrar errores si es necesario
      this.registerForm.markAllAsTouched();
      return;
    }


    this.isLoading = true;
    this.errorMessage = null;

          // Crea el payload usando tu interfaz
        const payload: UserRegisterPayload = {
          email: this.registerForm.value.email,
          password: this.registerForm.value.password,
          firstName: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
          dateOfBirth: this.registerForm.value.dateOfBirth,
      };

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registro exitoso:', response);
        // Puedes mostrar un mensaje de éxito antes de redirigir
        // alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']); // O a la página de autenticación principal '/auth'
      },
      error: (error) => {
        this.isLoading = false;
        // El error ya viene formateado desde tu auth.service
        this.errorMessage = error.message || 'Ocurrió un error durante el registro.';
        console.error('Error en el registro desde el componente:', error);
      }
    });
  }

  // Validador personalizado para comparar contraseñas
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    // Si los campos aún no existen o no se han tocado, no hacer nada
    if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true }); // Establece un error en el campo confirmPassword
      return { passwordMismatch: true }; // Retorna un error para el grupo
    } else {
      confirmPassword.setErrors(null); // Limpia errores si coinciden
      return null; // No hay error
    }
  }}
