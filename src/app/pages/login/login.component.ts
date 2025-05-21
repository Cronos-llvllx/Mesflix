import { Component, OnInit } from '@angular/core'; // OnInit añadido
import { Router } from '@angular/router';
// Importaciones para Formularios Reactivos
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Para *ngIf, etc.
// Importa tu AuthService y la interfaz UserLoginPayload
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta si tu estructura es diferente
import { UserLoginPayload } from '../../interface/user-login-payload.interface'; // Ajusta la ruta

@Component({
  selector: 'app-login',
  standalone: true,
  // Cambiamos FormsModule por ReactiveFormsModule
  imports: [ReactiveFormsModule, CommonModule, /* RouterModule podría no ser necesario aquí si la navegación es por código */],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Corregido a styleUrls (array)
})
export class LoginComponent implements OnInit { // Implementamos OnInit
  loginForm!: FormGroup; // '!' para indicar que se inicializará (en ngOnInit)
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder, // Inyectamos FormBuilder
    private authService: AuthService // Inyectamos AuthService
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo para email
      password: ['', Validators.required]
    });
  }

  // Método que se llamará al enviar el formulario desde el HTML
  // (antes se llamaba onLogin, lo cambiamos a onSubmit para consistencia con el HTML que te di)
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, ingresa un email y contraseña válidos.';
      this.loginForm.markAllAsTouched(); // Muestra errores de validación si los campos no se tocaron
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const payload: UserLoginPayload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login exitoso, respuesta:', response);
        // El AuthService ya se encarga de guardar el token si la respuesta lo incluye.
        // Redirigimos al usuario a la página principal o catálogo.
        this.router.navigate(['/select-user']); // Cambia '/catalog' a tu ruta deseada post-login
      },
      error: (error) => {
        this.isLoading = false;
        // authService.handleError debería proveer un error.message
        this.errorMessage = error.message || 'Email o contraseña incorrectos. Por favor, intenta de nuevo.';
        console.error('Error en el login desde el componente:', error);
        // Podrías añadir lógica para limpiar el campo de contraseña si quieres
        // this.loginForm.get('password')?.reset();
      }
    });
  }
}
