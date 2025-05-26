import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, NavigationEnd, Event as RouterEvent, ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject, Subscription, of } from 'rxjs'; // Importar of para el mock de ActivatedRoute

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';

// --- Mock de Servicios ---
class MockRouter {
  public events = new Subject<RouterEvent>();
  navigate = jasmine.createSpy('navigate');
  url = '/';
}

class MockAuthService {
  public isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  logout = jasmine.createSpy('logout');

  setLoggedIn(status: boolean) {
    this.isUserLoggedIn$.next(status);
  }
}

// Mock para ActivatedRoute (aunque NavbarComponent no lo use directamente,
// a veces el inyector lo busca o dependencias indirectas lo hacen)
class MockActivatedRoute {
  // Puedes añadir más propiedades si alguna prueba específica lo necesitara,
  // pero para NavbarComponent, un mock vacío o con un 'of({})' suele ser suficiente.
  snapshot = {}; // Un snapshot vacío
  paramMap = of({}); // Observable vacío para paramMap
  queryParamMap = of({}); // Observable vacío para queryParamMap
  params = of({});
  queryParams = of({});
  fragment = of(null);
  data = of({});
  outlet = '';
  component = null;
  routeConfig = null;
  root = {} as ActivatedRoute; // Simular la propiedad root
  parent = null;
  firstChild = null;
  children = [];
  pathFromRoot = [];
  url = of([]);
}


describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockRouter: MockRouter;
  let mockAuthService: MockAuthService;
  let mockActivatedRoute: MockActivatedRoute; // Añadir instancia del mock

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockAuthService = new MockAuthService();
    mockActivatedRoute = new MockActivatedRoute(); // Crear instancia del mock

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, CommonModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // <--- AÑADIR ESTE PROVEEDOR
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería suscribirse a isUserLoggedIn$ de AuthService y actualizar isLoggedIn', () => {
      mockAuthService.setLoggedIn(false);
      fixture.detectChanges();
      expect(component.isLoggedIn).toBeFalse();

      mockAuthService.setLoggedIn(true);
      fixture.detectChanges();
      expect(component.isLoggedIn).toBeTrue();

      mockAuthService.setLoggedIn(false);
      fixture.detectChanges();
      expect(component.isLoggedIn).toBeFalse();
    });

    it('debería añadir el event listener para scroll', () => {
      spyOn(window, 'addEventListener');
      fixture.detectChanges();
      expect(window.addEventListener).toHaveBeenCalledWith('scroll', component.scroll, true);
    });

    it('debería actualizar currentRoute al recibir NavigationEnd', () => {
      fixture.detectChanges();

      const testUrl = '/test-route';
      mockRouter.events.next(new NavigationEnd(1, testUrl, testUrl));
      fixture.detectChanges();

      expect(component.currentRoute).toBe(testUrl);
    });
  });

  describe('ngOnDestroy', () => {
    it('debería desuscribirse de authSubscription', () => {
      fixture.detectChanges();
      // @ts-ignore: Accediendo a propiedad privada para la prueba
      spyOn(component.authSubscription, 'unsubscribe');
      component.ngOnDestroy();
      // @ts-ignore
      expect(component.authSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('debería remover el event listener para scroll', () => {
      fixture.detectChanges();
      spyOn(window, 'removeEventListener');
      component.ngOnDestroy();
      expect(window.removeEventListener).toHaveBeenCalledWith('scroll', component.scroll, true);
    });
  });

  describe('handleLogout', () => {
    it('debería llamar a authService.logout()', () => {
      fixture.detectChanges();
      component.handleLogout();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('debería establecer isUserMenuOpen en false', () => {
      fixture.detectChanges();
      component.isUserMenuOpen = true;
      component.handleLogout();
      expect(component.isUserMenuOpen).toBeFalse();
    });
  });

  describe('scroll (manejo de evento de scroll)', () => {
    it('debería establecer isScrolled en true cuando window.pageYOffset > 50', () => {
      fixture.detectChanges();
      component.isScrolled = false;
      spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(100);
      component.scroll();
      expect(component.isScrolled).toBeTrue();
    });

    it('debería establecer isScrolled en false cuando window.pageYOffset <= 50', () => {
      fixture.detectChanges();
      component.isScrolled = true;
      spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(10);
      component.scroll();
      expect(component.isScrolled).toBeFalse();
    });
  });

  describe('toggleUserMenu', () => {
    it('debería cambiar el estado de isUserMenuOpen', () => {
      fixture.detectChanges();
      expect(component.isUserMenuOpen).toBeFalse();
      component.toggleUserMenu();
      expect(component.isUserMenuOpen).toBeTrue();
      component.toggleUserMenu();
      expect(component.isUserMenuOpen).toBeFalse();
    });
  });

  describe('showSearchBar', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería devolver true para rutas donde la barra de búsqueda debe mostrarse', () => {
      const allowedRoutes = ['/catalog', '/search', '/favorites', '/genre/28'];
      allowedRoutes.forEach(route => {
        mockRouter.events.next(new NavigationEnd(1, route, route));
        fixture.detectChanges();
        expect(component.showSearchBar()).withContext(`para ruta ${route}`).toBeTrue();
      });
    });

    it('debería devolver false para rutas donde la barra de búsqueda NO debe mostrarse', () => {
      const restrictedRoutes = ['/auth/login', '/auth/register', '/select-user'];
      restrictedRoutes.forEach(route => {
        mockRouter.events.next(new NavigationEnd(1, route, route));
        fixture.detectChanges();
        expect(component.showSearchBar()).withContext(`para ruta ${route}`).toBeFalse();
      });
    });

     it('debería devolver false si currentRoute comienza con una ruta restringida', () => {
        mockRouter.events.next(new NavigationEnd(1, '/auth/login/step2', '/auth/login/step2'));
        fixture.detectChanges();
        expect(component.showSearchBar()).toBeFalse();

        mockRouter.events.next(new NavigationEnd(1, '/select-user/profile/1', '/select-user/profile/1'));
        fixture.detectChanges();
        expect(component.showSearchBar()).toBeFalse();
    });
  });
});
