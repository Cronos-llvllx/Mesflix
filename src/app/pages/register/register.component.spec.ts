import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { UserRegisterPayload } from '../../interface/user-register-payload.interface';

// --- Mock de Servicios ---
class MockRouter {
  navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
}

class MockAuthService {
  register(payload: UserRegisterPayload) {
    // Por defecto, simula un registro exitoso
    if (payload.email === 'test@example.com') {
      return of({ success: true, message: 'Registro exitoso desde mock' });
    }
    // Simula un error para otros casos o si el email ya existe
    return throwError(() => ({ message: 'El email ya está en uso (mock).' }));
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRouter: MockRouter;
  let mockAuthService: MockAuthService;
  let fb: FormBuilder;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockAuthService = new MockAuthService();

    await TestBed.configureTestingModule({
      // RegisterComponent es standalone, así que se importa directamente.
      // ReactiveFormsModule y CommonModule ya son importados por RegisterComponent.
      imports: [RegisterComponent],
      providers: [
        FormBuilder, // El FormBuilder real es necesario para crear el formulario
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder); // Obtener FormBuilder para pruebas de validadores
    fixture.detectChanges(); // Llama al constructor y ngOnInit (aunque ngOnInit esté vacío)
  });

  it('debería crear el componente y el formulario de registro', () => {
    expect(component).toBeTruthy();
    expect(component.registerForm).toBeDefined();
    const formValue = component.registerForm.value;
    expect(formValue.email).toBeDefined();
    expect(formValue.firstName).toBeDefined();
    expect(formValue.lastName).toBeDefined();
    expect(formValue.dateOfBirth).toBeDefined();
    expect(formValue.password).toBeDefined();
    expect(formValue.confirmPassword).toBeDefined();
  });

  // Pruebas de validación para cada campo
  describe('Validaciones del Formulario', () => {
    it('el campo email debería ser inválido si está vacío o tiene formato incorrecto, y válido si es correcto', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBeTrue();
      emailControl?.setValue('test');
      expect(emailControl?.hasError('email')).toBeTrue();
      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBeTrue();
    });

    it('el campo firstName debería ser inválido si está vacío', () => {
      const firstNameControl = component.registerForm.get('firstName');
      firstNameControl?.setValue('');
      expect(firstNameControl?.hasError('required')).toBeTrue();
      firstNameControl?.setValue('John');
      expect(firstNameControl?.valid).toBeTrue();
    });

    it('el campo lastName debería ser inválido si está vacío', () => {
        const lastNameControl = component.registerForm.get('lastName');
        lastNameControl?.setValue('');
        expect(lastNameControl?.hasError('required')).toBeTrue();
        lastNameControl?.setValue('Doe');
        expect(lastNameControl?.valid).toBeTrue();
    });

    it('el campo dateOfBirth debería ser inválido si está vacío', () => {
        const dateOfBirthControl = component.registerForm.get('dateOfBirth');
        dateOfBirthControl?.setValue('');
        expect(dateOfBirthControl?.hasError('required')).toBeTrue();
        dateOfBirthControl?.setValue('2000-01-01');
        expect(dateOfBirthControl?.valid).toBeTrue();
    });

    it('el campo password debería ser inválido si está vacío o es muy corto', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBeTrue();
      passwordControl?.setValue('12345'); // Menos de 8 caracteres
      expect(passwordControl?.hasError('minlength')).toBeTrue();
      passwordControl?.setValue('password123');
      expect(passwordControl?.valid).toBeTrue();
    });

    it('el campo confirmPassword debería ser inválido si está vacío', () => {
        const confirmPasswordControl = component.registerForm.get('confirmPassword');
        confirmPasswordControl?.setValue('');
        expect(confirmPasswordControl?.hasError('required')).toBeTrue();
        confirmPasswordControl?.setValue('password123');
        expect(confirmPasswordControl?.valid).toBeTrue();
    });

    // Pruebas para passwordMatchValidator
    it('el validador passwordMatchValidator debería retornar null si las contraseñas coinciden', () => {
      component.registerForm.get('password')?.setValue('password123');
      component.registerForm.get('confirmPassword')?.setValue('password123');
      // El validador de grupo se ejecuta cuando cambia el valor de alguno de sus controles.
      // Para forzar su ejecución en la prueba, podemos actualizar el valor del grupo o un control.
      component.registerForm.updateValueAndValidity();
      expect(component.registerForm.hasError('passwordMismatch')).toBeFalse();
      expect(component.registerForm.get('confirmPassword')?.hasError('passwordMismatch')).toBeFalse();
    });

    it('el validador passwordMatchValidator debería retornar error si las contraseñas NO coinciden', () => {
      component.registerForm.get('password')?.setValue('password123');
      component.registerForm.get('confirmPassword')?.setValue('password456');
      component.registerForm.updateValueAndValidity();
      expect(component.registerForm.hasError('passwordMismatch')).toBeTrue();
      expect(component.registerForm.get('confirmPassword')?.hasError('passwordMismatch')).toBeTrue();
    });

     it('passwordMatchValidator debería retornar null si los campos de contraseña están inicialmente vacíos', () => {
      // Los campos ya están vacíos al inicio
      // El validador de grupo se ejecuta al inicio también
      expect(component.registerForm.hasError('passwordMismatch')).toBeFalse(); // o null, dependiendo de cómo se maneje
    });

    it('passwordMatchValidator debería limpiar el error de confirmPassword si las contraseñas luego coinciden', () => {
      // Primero, hacer que no coincidan
      component.registerForm.get('password')?.setValue('password123');
      component.registerForm.get('confirmPassword')?.setValue('password456');
      component.registerForm.updateValueAndValidity();
      expect(component.registerForm.hasError('passwordMismatch')).toBeTrue();

      // Luego, hacer que coincidan
      component.registerForm.get('confirmPassword')?.setValue('password123');
      component.registerForm.updateValueAndValidity();
      expect(component.registerForm.hasError('passwordMismatch')).toBeFalse();
      expect(component.registerForm.get('confirmPassword')?.hasError('passwordMismatch')).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Rellenar el formulario con datos válidos por defecto para la mayoría de las pruebas de onSubmit
      component.registerForm.setValue({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '2000-01-01',
        password: 'password123',
        confirmPassword: 'password123'
      });
      component.errorMessage = null;
      component.isLoading = false;
      mockRouter.navigate.calls.reset(); // Resetea el espía del router
      spyOn(mockAuthService, 'register').and.callThrough(); // Espiar el método register del mock
    });

    it('no debería llamar a authService.register si el formulario es inválido', () => {
      component.registerForm.get('email')?.setValue(''); // Hacer el formulario inválido
      spyOn(component.registerForm, 'markAllAsTouched');
      component.onSubmit();

      expect(mockAuthService.register).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe('Por favor, completa todos los campos correctamente.');
      expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    });

    it('debería llamar a authService.register y navegar a /login en un registro exitoso', fakeAsync(() => {
      mockAuthService.register = jasmine.createSpy('register').and.returnValue(of({ message: 'Éxito' })); // Sobrescribir para esta prueba

      component.onSubmit();
      expect(component.isLoading).toBeTrue(); // Debe ser true justo después de llamar
      tick(); // Procesar la suscripción al observable

      const expectedPayload: UserRegisterPayload = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '2000-01-01',
        password: 'password123'
      };
      expect(mockAuthService.register).toHaveBeenCalledWith(expectedPayload);
      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('debería mostrar un mensaje de error si authService.register falla', fakeAsync(() => {
      const errorMsg = 'El registro falló.';
      // Sobrescribir el mock para que devuelva un error
      mockAuthService.register = jasmine.createSpy('register').and.returnValue(throwError(() => ({ message: errorMsg })));

      component.onSubmit();
      expect(component.isLoading).toBeTrue();
      tick(); // Procesar la suscripción al observable (error)

      expect(mockAuthService.register).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe(errorMsg);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));

    it('debería usar un mensaje de error genérico si el error del servicio no tiene .message', fakeAsync(() => {
      mockAuthService.register = jasmine.createSpy('register').and.returnValue(throwError(() => ({}))); // Error sin .message

      component.onSubmit();
      tick();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Ocurrió un error durante el registro.');
    }));
  });
});
