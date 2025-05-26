import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router'; // Importar RouterLinkWithHref para probar routerLink
import { By } from '@angular/platform-browser';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core'; // Para tipado

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let compiled: HTMLElement; // Para acceder al DOM renderizado

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthComponent,
        // CommonModule, // AuthComponent ya lo importa
        // RouterOutlet, // AuthComponent ya lo importa
        // RouterLink, // AuthComponent ya lo importa
        // RouterLinkActive, // AuthComponent ya lo importa
        RouterTestingModule.withRoutes([]) // .withRoutes([]) es útil para probar routerLinks
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement; // Obtener el elemento DOM renderizado
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un router-outlet en su template', () => {
    const routerOutletElement = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutletElement).not.toBeNull();
  });

  // Pruebas para la estructura del HTML proporcionado
  it('debería tener un div contenedor principal con la clase "auth-container"', () => {
    const containerElement = compiled.querySelector('.auth-container');
    expect(containerElement).not.toBeNull();
  });

  it('debería tener un div con la clase "auth-card" dentro de "auth-container"', () => {
    const cardElement = compiled.querySelector('.auth-container .auth-card');
    expect(cardElement).not.toBeNull();
  });

  it('debería tener un div con la clase "auth-toggle" dentro de "auth-card"', () => {
    const toggleElement = compiled.querySelector('.auth-card .auth-toggle');
    expect(toggleElement).not.toBeNull();
  });

  it('debería tener dos botones dentro de "auth-toggle"', () => {
    const buttons = compiled.querySelectorAll('.auth-toggle button');
    expect(buttons.length).toBe(2);
  });

  it('el primer botón debería ser para "Ingresa" y tener el routerLink a "login"', () => {
    const loginButtonDe = fixture.debugElement.query(By.css('button[routerLink="login"]'));
    expect(loginButtonDe).not.toBeNull();
    const loginButton = loginButtonDe.nativeElement as HTMLButtonElement;
    expect(loginButton.textContent?.trim()).toBe('Ingresa');

    // Verificar el atributo routerLink
    const routerLinkInstance = loginButtonDe.injector.get(RouterLinkWithHref);
    // CORRECCIÓN AQUÍ: Acceder a la propiedad pública 'routerLink'
    expect(routerLinkInstance.routerLink).toEqual(['login']);
  });

  it('el segundo botón debería ser para "Registro" y tener el routerLink a "register"', () => {
    const registerButtonDe = fixture.debugElement.query(By.css('button[routerLink="register"]'));
    expect(registerButtonDe).not.toBeNull();
    const registerButton = registerButtonDe.nativeElement as HTMLButtonElement;
    expect(registerButton.textContent?.trim()).toBe('Registro');

    // Verificar el atributo routerLink
    const routerLinkInstance = registerButtonDe.injector.get(RouterLinkWithHref);
    // CORRECCIÓN AQUÍ: Acceder a la propiedad pública 'routerLink'
    expect(routerLinkInstance.routerLink).toEqual(['register']);
  });

  it('debería tener un div con la clase "form-area" que contiene el router-outlet', () => {
    const formAreaElement = compiled.querySelector('.auth-card .form-area');
    expect(formAreaElement).not.toBeNull();
    // Verificar que el router-outlet está dentro de form-area
    const routerOutletInFormArea = formAreaElement?.querySelector('router-outlet');
    expect(routerOutletInFormArea).not.toBeNull();
  });
});
