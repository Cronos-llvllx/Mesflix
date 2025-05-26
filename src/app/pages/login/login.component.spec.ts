import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { UserLoginPayload } from '../../interface/user-login-payload.interface';
import { AuthResponse } from '../../interface/auth-response.interface'; // Importar la interfaz AuthResponse

/// --- Mock de Servicios ---
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Mock para AuthService
class MockAuthService {
  login(payload: UserLoginPayload): Observable<AuthResponse> {
    if (payload.email === 'test@example.com' && payload.password === 'password123') {
      // CORRECCIÓN AQUÍ: Devolver un objeto que coincida con AuthResponse
      return of({
        userId: 1,
        username: 'testuser',
        email: payload.email, // o un email de prueba si prefieres
        token: 'fake-jwt-token'
      });
    }
    // Para los errores, la estructura suele ser { message: string } o un HttpErrorResponse,
    // lo cual está bien porque el componente maneja el error de forma diferente.
    return throwError(() => ({ message: 'Email o contraseña incorrectos.' }));
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: MockRouter;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockAuthService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería inicializar loginForm en ngOnInit', () => {
    fixture.detectChanges();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('el campo email debería ser inválido si está vacío y válido con un email correcto', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('');
    expect(emailControl?.invalid).toBeTrue();
    expect(emailControl?.hasError('required')).toBeTrue();

    emailControl?.setValue('test');
    expect(emailControl?.invalid).toBeTrue();
    expect(emailControl?.hasError('email')).toBeTrue();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('el campo password debería ser inválido si está vacío y válido si tiene valor', () => {
    fixture.detectChanges();
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('');
    expect(passwordControl?.invalid).toBeTrue();
    expect(passwordControl?.hasError('required')).toBeTrue();

    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBeTrue();
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('no debería llamar a authService.login si el formulario es inválido', () => {
      spyOn(mockAuthService, 'login').and.callThrough();
      component.loginForm.get('email')?.setValue('');
      component.onSubmit();

      expect(mockAuthService.login).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe('Por favor, ingresa un email y contraseña válidos.');
      expect(component.isLoading).toBeFalse();
    });

    it('debería llamar a authService.login con los datos del formulario si es válido', () => {
      spyOn(mockAuthService, 'login').and.callThrough();
      const testEmail = 'test@example.com';
      const testPassword = 'password123';

      component.loginForm.get('email')?.setValue(testEmail);
      component.loginForm.get('password')?.setValue(testPassword);
      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith({ email: testEmail, password: testPassword });
    });

    it('debería establecer isLoading en true mientras se llama a authService.login y luego en false', fakeAsync(() => {
      // CORRECCIÓN AQUÍ TAMBIÉN: Asegurar que el objeto coincida con AuthResponse
      spyOn(mockAuthService, 'login').and.returnValue(of({
        userId: 2,
        username: 'loadingUser',
        email: 'test@example.com',
        token: 'fake-token-for-loading-test'
      }).pipe());
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');

      component.onSubmit();
      expect(component.isLoading).toBeTrue();

      tick();
      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
    }));

    it('debería navegar a /select-user en un login exitoso', fakeAsync(() => {
      const testEmail = 'test@example.com';
      const testPassword = 'password123';
      component.loginForm.get('email')?.setValue(testEmail);
      component.loginForm.get('password')?.setValue(testPassword);

      component.onSubmit();
      tick();
      fixture.detectChanges();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/select-user']);
      expect(component.errorMessage).toBeNull();
    }));

    it('debería mostrar un mensaje de error si authService.login falla', fakeAsync(() => {
      const incorrectEmail = 'wrong@example.com';
      const incorrectPassword = 'wrongpassword';
      component.loginForm.get('email')?.setValue(incorrectEmail);
      component.loginForm.get('password')?.setValue(incorrectPassword);

      spyOn(mockAuthService, 'login').and.returnValue(throwError(() => ({ message: 'Email o contraseña incorrectos.' })));

      component.onSubmit();
      tick();
      fixture.detectChanges();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe('Email o contraseña incorrectos.');
      expect(component.isLoading).toBeFalse();
    }));

    it('debería usar el mensaje de error genérico si el error del servicio no tiene .message', fakeAsync(() => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('somepassword');

      spyOn(mockAuthService, 'login').and.returnValue(throwError(() => ({})));

      component.onSubmit();
      tick();
      fixture.detectChanges();

      expect(component.errorMessage).toBe('Email o contraseña incorrectos. Por favor, intenta de nuevo.');
    }));
  });
});
