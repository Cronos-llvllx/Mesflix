import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs'; // of no es estrictamente necesario aquí pero es bueno tenerlo para mocks
import { AuthGuard } from './auth.guard'; // Importa tu clase AuthGuard
import { AuthService } from './services/auth.service'; // Importa el AuthService real para tipado

// Mock para AuthService
class MockAuthService {
  private loggedIn = false;

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // Método para controlar el estado de login en las pruebas
  setIsLoggedIn(status: boolean) {
    this.loggedIn = status;
  }
}

// Mock para Router
class MockRouter {
  navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)); // Simula la navegación
  // Para crear un UrlTree si es necesario en pruebas más avanzadas, aunque aquí no lo usamos directamente.
  // parseUrl(url: string): UrlTree { return new UrlTree(); }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: MockAuthService;
  let mockRouter: MockRouter;

  // Objetos simulados para ActivatedRouteSnapshot y RouterStateSnapshot
  // No necesitan ser muy complejos para esta prueba, solo lo suficiente para que el guard funcione.
  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyStateSnapshot = { url: '/protected-route' } as RouterStateSnapshot;
  const loginUrlTree = new UrlTree(); // Un UrlTree simple para comparar si es necesario

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard, // Proveer el AuthGuard real
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
    mockRouter = TestBed.inject(Router) as unknown as MockRouter;

    // Espiar console.warn para verificar que se llama cuando se redirige
    spyOn(console, 'warn');
  });

  it('debería ser creado', () => {
    expect(guard).toBeTruthy();
  });

  it('debería permitir la activación de la ruta si el usuario está logueado', () => {
    mockAuthService.setIsLoggedIn(true); // Simula que el usuario está logueado

    const canActivateResult = guard.canActivate(dummyRoute, dummyStateSnapshot);

    expect(canActivateResult).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // No debería navegar
  });

  it('NO debería permitir la activación de la ruta si el usuario NO está logueado', () => {
    mockAuthService.setIsLoggedIn(false); // Simula que el usuario NO está logueado

    const canActivateResult = guard.canActivate(dummyRoute, dummyStateSnapshot);

    expect(canActivateResult).toBeFalse();
  });

  it('debería navegar a /auth/login con returnUrl si el usuario NO está logueado', () => {
    mockAuthService.setIsLoggedIn(false);
    const targetUrl = '/some/protected/path';
    const stateWithTargetUrl = { url: targetUrl } as RouterStateSnapshot;

    guard.canActivate(dummyRoute, stateWithTargetUrl);

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/auth/login'],
      { queryParams: { returnUrl: targetUrl } }
    );
  });

  it('debería registrar una advertencia en consola si el usuario NO está logueado', () => {
    mockAuthService.setIsLoggedIn(false);

    guard.canActivate(dummyRoute, dummyStateSnapshot);

    expect(console.warn).toHaveBeenCalledWith('AuthGuard: Usuario no autenticado, redirigiendo a login...');
  });

  // Prueba para verificar el tipo de retorno (aunque en este caso es síncrono)
  it('debería devolver un booleano directamente', () => {
    mockAuthService.setIsLoggedIn(true);
    let result = guard.canActivate(dummyRoute, dummyStateSnapshot);
    expect(typeof result === 'boolean').toBeTrue();

    mockAuthService.setIsLoggedIn(false);
    result = guard.canActivate(dummyRoute, dummyStateSnapshot);
    expect(typeof result === 'boolean').toBeTrue();
  });
});
