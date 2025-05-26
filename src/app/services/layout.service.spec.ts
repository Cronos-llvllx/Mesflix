import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd, Event as RouterEvent, Data } from '@angular/router';
import { Subject, BehaviorSubject, of } from 'rxjs';

import { LayoutService } from './layout.service';

// --- Mocks ---

// Mock para ActivatedRouteSnapshot (parte de ActivatedRoute)
// Necesitamos simular la estructura de firstChild y data
interface MockActivatedRouteSnapshot {
  firstChild?: MockActivatedRouteSnapshot | null;
  data?: Data;
  outlet?: string;
}

class MockActivatedRoute {
  // Esta será la raíz del árbol de rutas simulado para una prueba
  private _snapshot: MockActivatedRouteSnapshot = { data: {}, outlet: 'primary' };
  // Para simular el 'data' observable de la ruta activa
  private _dataSubject = new BehaviorSubject<Data>({});
  public data = this._dataSubject.asObservable();

  // Propiedades para simular la estructura del árbol de rutas
  public firstChild: MockActivatedRoute | null = null;
  public outlet: string = 'primary'; // Por defecto

  // Método para configurar el snapshot de la ruta actual y sus hijos para una prueba
  // y el 'data' que emitirá el observable 'data' de la ruta más profunda.
  public setSnapshotTree(snapshot: MockActivatedRouteSnapshot, deepestRouteData: Data = {}) {
    this._snapshot = snapshot;

    // Encontrar la ruta más profunda y configurar su data observable
    let current: MockActivatedRoute | null = this;
    let currentSnapshot: MockActivatedRouteSnapshot | undefined = this._snapshot;

    while (currentSnapshot?.firstChild) {
        // Creamos instancias mock para los hijos si es necesario para la prueba
        // o asumimos que el servicio navega por el snapshot.
        // Para este servicio, parece que usa this.activatedRoute y luego su firstChild.
        // Así que necesitamos simular la estructura de ActivatedRoute, no solo el snapshot.
        if (!current?.firstChild) {
            current!.firstChild = new MockActivatedRoute(); // Crear un hijo mock
        }
        current = current!.firstChild;
        currentSnapshot = currentSnapshot.firstChild;
        current.outlet = currentSnapshot.outlet || 'primary'; // Asignar outlet al hijo
    }
    // 'current' ahora es la ruta más profunda en la estructura simulada
    (current as MockActivatedRoute)._dataSubject.next(deepestRouteData);
    (current as MockActivatedRoute)._snapshot.data = deepestRouteData; // También actualizamos el snapshot
  }

  // Propiedad snapshot que el servicio usa
  get snapshot(): MockActivatedRouteSnapshot {
    return this._snapshot;
  }
}

class MockRouter {
  // Usamos un Subject para poder emitir eventos de navegación en las pruebas
  public events = new Subject<RouterEvent>();
  // Otros métodos si fueran necesarios
  // navigate = jasmine.createSpy('navigate');
}

describe('LayoutService', () => {
  let service: LayoutService;
  let mockRouter: MockRouter;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(() => {
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      providers: [
        LayoutService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    // El servicio se crea aquí, y su constructor se suscribe a router.events
    service = TestBed.inject(LayoutService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('showNavbar$ y showFooter$ deberían emitir false inicialmente', (done) => {
    let navbarVisible = true; // Valor inicial opuesto para asegurar que el primer next() lo cambie
    let footerVisible = true;

    const sub1 = service.showNavbar$.subscribe(val => navbarVisible = val);
    const sub2 = service.showFooter$.subscribe(val => footerVisible = val);

    // Los BehaviorSubjects en el servicio se inicializan con false.
    // El constructor se suscribe a router.events, pero si no hay navegación inicial,
    // los valores deberían permanecer como los iniciales de los BehaviorSubjects.
    // Sin embargo, la lógica del constructor SÍ emite un valor basado en el estado inicial
    // de activatedRoute.data si se simula una navegación inicial o si el mock de data emite.
    // Para probar el estado *antes* de cualquier navegación simulada,
    // verificamos los valores con los que los BehaviorSubjects internos se inicializaron.
    // El servicio los inicializa con false.

    expect(navbarVisible).toBeFalse();
    expect(footerVisible).toBeFalse();

    sub1.unsubscribe();
    sub2.unsubscribe();
    done();
  });

  describe('al finalizar la navegación (NavigationEnd)', () => {
    it('debería establecer showNavbar y showFooter según los datos de la ruta raíz activa', fakeAsync(() => {
      const routeData = { showNavbar: true, showFooter: true };
      // Simulamos una estructura de ruta simple donde la raíz es la más profunda
      mockActivatedRoute.setSnapshotTree({ outlet: 'primary', data: routeData }, routeData);

      let navbarVisible: boolean | undefined;
      let footerVisible: boolean | undefined;
      service.showNavbar$.subscribe(val => navbarVisible = val);
      service.showFooter$.subscribe(val => footerVisible = val);

      // Simular evento de navegación
      mockRouter.events.next(new NavigationEnd(1, '/test', '/test'));
      tick(); // Permitir que el pipe de rxjs procese

      expect(navbarVisible).toBeTrue();
      expect(footerVisible).toBeTrue();
    }));

    it('debería establecer showNavbar y showFooter a false si no están en los datos de la ruta', fakeAsync(() => {
      const routeData = {}; // Sin showNavbar ni showFooter
      mockActivatedRoute.setSnapshotTree({ outlet: 'primary', data: routeData }, routeData);

      let navbarVisible: boolean | undefined;
      let footerVisible: boolean | undefined;
      service.showNavbar$.subscribe(val => navbarVisible = val);
      service.showFooter$.subscribe(val => footerVisible = val);

      mockRouter.events.next(new NavigationEnd(1, '/test-no-data', '/test-no-data'));
      tick();

      expect(navbarVisible).toBeFalse(); // Por el ?? false
      expect(footerVisible).toBeFalse(); // Por el ?? false
    }));

    it('debería usar el valor de showNavbar de los datos de la ruta y false para showFooter si no está definido', fakeAsync(() => {
      const routeData = { showNavbar: true }; // Solo showNavbar
      mockActivatedRoute.setSnapshotTree({ outlet: 'primary', data: routeData }, routeData);

      let navbarVisible: boolean | undefined;
      let footerVisible: boolean | undefined;
      service.showNavbar$.subscribe(val => navbarVisible = val);
      service.showFooter$.subscribe(val => footerVisible = val);

      mockRouter.events.next(new NavigationEnd(1, '/test-navbar-only', '/test-navbar-only'));
      tick();

      expect(navbarVisible).toBeTrue();
      expect(footerVisible).toBeFalse(); // Por el ?? false
    }));

    it('debería usar el valor de showFooter de los datos de la ruta y false para showNavbar si no está definido', fakeAsync(() => {
        const routeData = { showFooter: true }; // Solo showFooter
        mockActivatedRoute.setSnapshotTree({ outlet: 'primary', data: routeData }, routeData);

        let navbarVisible: boolean | undefined;
        let footerVisible: boolean | undefined;
        service.showNavbar$.subscribe(val => navbarVisible = val);
        service.showFooter$.subscribe(val => footerVisible = val);

        mockRouter.events.next(new NavigationEnd(1, '/test-footer-only', '/test-footer-only'));
        tick();

        expect(navbarVisible).toBeFalse(); // Por el ?? false
        expect(footerVisible).toBeTrue();
    }));

    it('debería navegar hasta la ruta hija más profunda para obtener los datos', fakeAsync(() => {
      const deepestRouteData = { showNavbar: true, showFooter: false };
      const rootSnapshot: MockActivatedRouteSnapshot = {
        outlet: 'primary',
        data: { showNavbar: false, showFooter: true }, // Datos de la ruta raíz (no deberían usarse)
        firstChild: {
          outlet: 'primary',
          data: { showNavbar: false, showFooter: false }, // Datos de la ruta intermedia
          firstChild: {
            outlet: 'primary',
            data: deepestRouteData // Datos de la ruta más profunda (deberían usarse)
          }
        }
      };
      mockActivatedRoute.setSnapshotTree(rootSnapshot, deepestRouteData);

      let navbarVisible: boolean | undefined;
      let footerVisible: boolean | undefined;
      service.showNavbar$.subscribe(val => navbarVisible = val);
      service.showFooter$.subscribe(val => footerVisible = val);

      mockRouter.events.next(new NavigationEnd(1, '/deep/path/child', '/deep/path/child'));
      tick();

      expect(navbarVisible).toBeTrue();
      expect(footerVisible).toBeFalse();
    }));

    it('debería ignorar rutas que no sean del outlet "primary"', fakeAsync(() => {
      // Establecer valores iniciales para ver si cambian (no deberían)
      // @ts-ignore: Accediendo a propiedad privada para la prueba
      service._showNavbar.next(true);
      // @ts-ignore
      service._showFooter.next(true);

      const routeDataNonPrimary = { showNavbar: false, showFooter: false }; // Datos que no deberían aplicarse
      // Simulamos una ruta con outlet 'popup'
      mockActivatedRoute.setSnapshotTree({ outlet: 'popup', data: routeDataNonPrimary }, routeDataNonPrimary);


      let navbarVisible: boolean | undefined;
      let footerVisible: boolean | undefined;
      service.showNavbar$.subscribe(val => navbarVisible = val);
      service.showFooter$.subscribe(val => footerVisible = val);


      mockRouter.events.next(new NavigationEnd(1, '/path (popup:aux)', '/path (popup:aux)'));
      tick();

      // Los valores no deberían haber cambiado porque la ruta no es 'primary'
      expect(navbarVisible).toBeTrue();
      expect(footerVisible).toBeTrue();
    }));

    it('debería manejar el caso donde route.data es undefined o null', fakeAsync(() => {
        // @ts-ignore: Accediendo a propiedad privada para la prueba
        service._showNavbar.next(true); // Establecer un valor inicial diferente de false
        // @ts-ignore
        service._showFooter.next(true);

        // Simulamos que la ruta más profunda no tiene 'data' o es null
        mockActivatedRoute.setSnapshotTree({ outlet: 'primary', data: undefined }, undefined as any);


        let navbarVisible: boolean | undefined;
        let footerVisible: boolean | undefined;
        service.showNavbar$.subscribe(val => navbarVisible = val);
        service.showFooter$.subscribe(val => footerVisible = val);

        mockRouter.events.next(new NavigationEnd(1, '/test-no-route-data', '/test-no-route-data'));
        tick();

        expect(navbarVisible).toBeFalse(); // Por el ?? false
        expect(footerVisible).toBeFalse(); // Por el ?? false
    }));
  });
});
