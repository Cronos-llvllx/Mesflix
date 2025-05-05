import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para NgClass

import { NavbarComponent } from './navbar.component';

  // Mock del Router
  class MockRouter {
    navigate = jasmine.createSpy('navigate');
  }

  describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let router: Router;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        // Importa el componente standalone y CommonModule
        imports: [ NavbarComponent, CommonModule ],
        providers: [
          { provide: Router, useClass: MockRouter }
        ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(NavbarComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router); // Obtener instancia del mock Router
      // fixture.detectChanges(); // No llamar aquí todavía si ngOnInit hace algo importante
    });

    it('debería crear', () => {
      fixture.detectChanges(); // Llama ngOnInit
      expect(component).toBeTruthy();
    });

    // --- Prueba para Función: goToSearch ---
    it('goToSearch() debe navegar a /search', () => {
      component.goToSearch(); // Llama al método
      expect(router.navigate).toHaveBeenCalledWith(['/search']); // Verifica la navegación
    });

    // --- Pruebas para Función y Ramas: onWindowScroll ---
    it('onWindowScroll() debe establecer isScrolled en verdadero cuando se desplaza hacia abajo', () => {
      // Simula el estado inicial (opcional, ya que ngOnInit lo llama)
      component.isScrolled = false;

      // Simula el evento de scroll (llamando directamente al método es más fácil en unit tests)
      // Simulamos un scroll mayor a 10px (ej. 50)
      spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(50);
      component.onWindowScroll(); // Llama al método manualmente

      expect(component.isScrolled).toBeTrue(); // Verifica que la propiedad cambió
    });

    it('onWindowScroll() debe establecer isScrolled en falso cuando se desplaza cerca de la parte superior', () => {
      // Simula estado inicial (scrolled)
      component.isScrolled = true;

      // Simula scroll menor o igual a 10px (ej. 5)
      spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(5);
      component.onWindowScroll(); // Llama al método manualmente

      expect(component.isScrolled).toBeFalse(); // Verifica que la propiedad cambió a false
    });

    // --- Prueba para Función: ngOnInit (verifica estado inicial de isScrolled) ---
    it('ngOnInit debe llamar a onWindowScroll para establecer el estado de desplazamiento inicial', () => {
        spyOn(component, 'onWindowScroll'); // Espía el método
        fixture.detectChanges(); // Llama ngOnInit
        expect(component.onWindowScroll).toHaveBeenCalled(); // Verifica que fue llamado
    });

    // --- Prueba para Función: toggleSearch ---
      // it('toggleSearch should toggle searchVisible property', () => {
      //   expect(component.searchVisible).toBeFalse(); // Estado inicial
      //   component.toggleSearch();
      //   expect(component.searchVisible).toBeTrue(); // Después del primer clic
      //   component.toggleSearch();
      //   expect(component.searchVisible).toBeFalse(); // Después del segundo clic
      // });

  });
