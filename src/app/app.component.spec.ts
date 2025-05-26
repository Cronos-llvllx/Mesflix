import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common'; // CommonModule por si se usa ngIf/ngFor directamente

import { AppComponent } from './app.component';
import { LayoutService } from './services/layout.service';
// Importamos los componentes hijos reales porque AppComponent los importa en su 'imports' array.
// Si tuvieran dependencias complejas, necesitaríamos mockearlas aquí también.
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service'; // NavbarComponent depende de AuthService

// Mock para LayoutService
class MockLayoutService {
  showNavbar$ = new BehaviorSubject<boolean>(true); // Valor inicial
  showFooter$ = new BehaviorSubject<boolean>(true); // Valor inicial

  setShowNavbar(value: boolean) {
    this.showNavbar$.next(value);
  }
  setShowFooter(value: boolean) {
    this.showFooter$.next(value);
  }
}

// Mock simple para AuthService (ya que NavbarComponent lo inyecta)
class MockAuthService {
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false); // Necesario para NavbarComponent
  // Añade otros métodos/propiedades que NavbarComponent pueda usar al inicializarse
  // si causan errores. Por ahora, esto podría ser suficiente.
  logout = jasmine.createSpy('logout');
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let layoutService: MockLayoutService;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // AppComponent es standalone, así que se importa directamente.
      // También importa los módulos/componentes que él mismo importa.
      imports: [
        AppComponent,
        // RouterOutlet, // AppComponent ya lo importa
        // NavbarComponent, // AppComponent ya lo importa
        // FooterComponent, // AppComponent ya lo importa
        // AsyncPipe, // AppComponent ya lo importa
        // CommonModule, // AppComponent ya lo importa
        RouterTestingModule // Para <router-outlet>
      ],
      providers: [
        { provide: LayoutService, useClass: MockLayoutService },
        { provide: AuthService, useClass: MockAuthService } // Proveer mock para dependencia de NavbarComponent
        // Si FooterComponent tuviera dependencias, se mockearían aquí también.
      ]
    })
    // Si NavbarComponent o FooterComponent son complejos y no quieres renderizarlos realmente,
    // podrías usar .overrideComponent para reemplazarlos por stubs,
    // o añadir NO_ERRORS_SCHEMA (aunque esto es menos ideal para standalone).
    // Ejemplo con override (si fueran declarados en un módulo):
    // .overrideModule(AppModule, {
    //   remove: { declarations: [NavbarComponent, FooterComponent] },
    //   add: { declarations: [StubNavbarComponent, StubFooterComponent] }
    // })
    // Para componentes standalone importados, el override es un poco diferente o
    // es más simple mockear sus dependencias si son pocas.
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService) as unknown as MockLayoutService; // Obtener instancia del mock
    compiled = fixture.nativeElement as HTMLElement;
    // fixture.detectChanges(); // Se llamará en cada prueba según sea necesario
  });

  it('debería crear la app', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`debería tener el titulo de 'Mesflix'`, () => {
    fixture.detectChanges();
    expect(component.title).toEqual('Mesflix');
    // Nota: Esta prueba solo verifica la propiedad 'title'. No verifica si se renderiza en el HTML.
  });

  // La prueba 'deberia renderizar titulo' original buscaba un h1 que ya no existe.
  // La eliminamos o la adaptamos si hay otro elemento que muestre el título.
  // Por ahora, la eliminamos.

  it('debería renderizar el router-outlet', () => {
    fixture.detectChanges();
    const routerOutletElement = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutletElement).not.toBeNull();
  });

  it('debería renderizar el contenedor principal "main-content-wrapper"', () => {
    fixture.detectChanges();
    expect(compiled.querySelector('main.main-content-wrapper')).not.toBeNull();
  });

  describe('Navbar condicional', () => {
    it('debería mostrar app-navbar cuando showNavbar$ es true', fakeAsync(() => {
      layoutService.setShowNavbar(true);
      fixture.detectChanges(); // Para que el pipe async se actualice
      tick(); // Esperar que el observable emita y el DOM se actualice
      fixture.detectChanges(); // Segunda detección para asegurar renderizado post-async

      // Buscamos por el selector del componente.
      // Si usamos stubs, buscaríamos el selector del stub.
      const navbarElement = fixture.debugElement.query(By.css('app-navbar'));
      expect(navbarElement).not.toBeNull();
    }));

    it('NO debería mostrar app-navbar cuando showNavbar$ es false', fakeAsync(() => {
      layoutService.setShowNavbar(false);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const navbarElement = fixture.debugElement.query(By.css('app-navbar'));
      expect(navbarElement).toBeNull();
    }));
  });

  describe('Footer condicional', () => {
    it('debería mostrar app-footer cuando showFooter$ es true', fakeAsync(() => {
      layoutService.setShowFooter(true);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const footerElement = fixture.debugElement.query(By.css('app-footer'));
      expect(footerElement).not.toBeNull();
    }));

    it('NO debería mostrar app-footer cuando showFooter$ es false', fakeAsync(() => {
      layoutService.setShowFooter(false);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const footerElement = fixture.debugElement.query(By.css('app-footer'));
      expect(footerElement).toBeNull();
    }));
  });
});