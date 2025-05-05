import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necesario porque el componente lo importa
import { LoginComponent } from './login.component';

// --- Mock de Servicios ---
class MockRouter {
  navigate = jasmine.createSpy('navigate'); // Espía para ver si/cómo se llama a navigate
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: MockRouter; // Instancia del mock Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importa el componente Standalone y los módulos que él importa
      imports: [ LoginComponent, FormsModule ],
      providers: [
        // Proveedor del Mock para el Router
        { provide: Router, useClass: MockRouter }
        // No necesitamos mock de AuthService porque el componente no lo inyecta
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as unknown as MockRouter; // Obtener instancia del mock

    // Espiar alert globalmente para las pruebas que lo usan
    spyOn(window, 'alert');
    // Espiar console.log globalmente para verificar logs
    spyOn(console, 'log');

    // fixture.detectChanges(); // Llamar en cada test si es necesario
  });

  it('debería crear', () => {
    fixture.detectChanges(); // Ejecuta el ciclo de vida inicial
    expect(component).toBeTruthy();
  });

  // --- Prueba para onLogin() ---
  it('onLogin() debería registrar el mensaje y navegar a /select-user', () => {
    component.onLogin(); // Llama al método

    // Verifica el log
    expect(console.log).toHaveBeenCalledWith('Formulario enviado!');
    // Verifica la navegación
    expect(router.navigate).toHaveBeenCalledWith(['/select-user']);
  });

  // --- Prueba para login() ---
  it('login() debe registrar las credenciales y mostrar una alerta', () => {
    // Establece manualmente las propiedades que el método usa
    component.loginUsername = 'testUser';
    component.loginPassword = 'testPassword';

    component.login(); // Llama al método

    // Verifica los logs
    expect(console.log).toHaveBeenCalledWith('Login realizado:');
    expect(console.log).toHaveBeenCalledWith('Usuario:', 'testUser');
    expect(console.log).toHaveBeenCalledWith('Contraseña:', 'testPassword');
    // Verifica la alerta
    expect(window.alert).toHaveBeenCalledWith('Login simulado con éxito');
  });

  // --- Prueba para register() ---
  it('register() debe registrar los datos de registro y mostrar una alerta', () => {
    // Establece manualmente las propiedades que el método usa
    component.registerUsername = 'newUser';
    component.registerEmail = 'new@mail.com';
    component.registerPassword = 'newPassword';

    component.register(); // Llama al método

    // Verifica los logs
    expect(console.log).toHaveBeenCalledWith('Registro realizado:');
    expect(console.log).toHaveBeenCalledWith('Usuario:', 'newUser');
    expect(console.log).toHaveBeenCalledWith('Email:', 'new@mail.com');
    expect(console.log).toHaveBeenCalledWith('Contraseña:', 'newPassword');
    // Verifica la alerta
    expect(window.alert).toHaveBeenCalledWith('Registro simulado con éxito');
  });

  // --- Prueba para activateRegister() ---
  it('activateRegister() debe establecer isLoginActive en falso', () => {
    component.isLoginActive = true; // Estado inicial asegurado
    component.activateRegister(); // Llama al método
    expect(component.isLoginActive).toBeFalse(); // Verifica el cambio de estado
  });

  // --- Prueba para activateLogin() ---
  it('activateLogin() debe establecer isLoginActive en verdadero', () => {
    component.isLoginActive = false; // Estado inicial asegurado (opuesto)
    component.activateLogin(); // Llama al método
    expect(component.isLoginActive).toBeTrue(); // Verifica el cambio de estado
  });

});
