import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenreMoviesComponent } from './genre-movies.component';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { of } from 'rxjs'; // Para simular Observables
import { CommonModule } from '@angular/common'; // Importar si el componente usa NgIf, NgFor, etc.

  // --- Mock de Servicios ---
  class MockActivatedRoute {
    paramMap = of(convertToParamMap({ genreId: 'action' })); // Simula parámetro de ruta
  }
  class MockRouter {
    navigate = jasmine.createSpy('navigate'); // Espía para ver si se llama a navigate
  }
  class MockFavoritesService {
    isFavorite = jasmine.createSpy('isFavorite').and.returnValue(false);
    toggleFavorite = jasmine.createSpy('toggleFavorite');
    // Añade otros métodos si son necesarios
  }

  describe('GenreMoviesComponent', () => {
    let component: GenreMoviesComponent;
    let fixture: ComponentFixture<GenreMoviesComponent>;
    let favoritesService: FavoritesService; // Para espiar métodos

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GenreMoviesComponent, CommonModule], // Importa el componente Standalone y CommonModule
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: Router, useClass: MockRouter },
          { provide: FavoritesService, useClass: MockFavoritesService }
        ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(GenreMoviesComponent);
      component = fixture.componentInstance;
      favoritesService = TestBed.inject(FavoritesService); // Obtener la instancia (mock) del servicio
      // fixture.detectChanges(); // NO LLAMAR AQUÍ si quieres probar ngOnInit específicamente
    });

    it('debería crear', () => {
      expect(component).toBeTruthy();
    });

    // --- Pruebas para ngOnInit y Lógica Asíncrona ---
    it('ngOnInit debería cargar películas para genreId desde la ruta', () => {
        // Espiar el método que devuelve el observable *antes* de llamar a ngOnInit
        spyOn(component, 'getMoviesObservable').and.returnValue(of([
            { id: 'm1', title: 'Movie 1', description: '', imageUrl: '' },
            { id: 'm2', title: 'Movie 2', description: '', imageUrl: '' }
        ]));

        fixture.detectChanges(); // <-- ESTO LLAMA A ngOnInit

        expect(component.genreId).toBe('action');
        expect(component.genreTitle).toBe('Action');
        expect(component.getMoviesObservable).toHaveBeenCalled();
        expect(component.isLoading).toBeFalse(); // Porque el 'of()' es síncrono + complete()
        expect(component.movies.length).toBe(2);
        expect(component.movies[0].title).toBe('Movie 1');
    });

    it('ngOnInit debería gestionar el genreId faltante', () => {
        // Cambiar el mock de ActivatedRoute para esta prueba específica
        TestBed.overrideProvider(ActivatedRoute, { useValue: { paramMap: of(convertToParamMap({})) } });

        // Recrear el componente con el proveedor sobreescrito
        fixture = TestBed.createComponent(GenreMoviesComponent);
        component = fixture.componentInstance;
        spyOn(console, 'error'); // Espiar console.error
        spyOn(component, 'fetchMoviesWithDelay'); // Espiar para asegurar que NO se llame

        fixture.detectChanges(); // Llama ngOnInit

        expect(component.genreId).toBeNull();
        expect(component.movies.length).toBe(0);
        expect(component.isLoading).toBeFalse();
        expect(console.error).toHaveBeenCalledWith('No se encontró ID de género en la ruta');
        expect(component.fetchMoviesWithDelay).not.toHaveBeenCalled();
    });


    // --- Pruebas para Métodos del Componente ---
    it('hideMovie() debería eliminar la película de la lista', () => {
      // Establecer estado inicial
      component.movies = [
        { id: 'm1', title: 'Movie 1', description: '', imageUrl: '' },
        { id: 'm2', title: 'Movie 2', description: '', imageUrl: '' }
      ];
      const movieToHide = component.movies[0];
      const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };

      component.hideMovie(movieToHide, mockEvent as any);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(component.movies.length).toBe(1);
      expect(component.movies[0].id).toBe('m2'); // Verifica que quedó la correcta
    });

    it('toggleFavorite() debe llamar a favoritesService.toggleFavorite y detener la propagación del evento', () => {
      const movieToToggle = { id: 'm1', title: 'Movie 1', description: '', imageUrl: '' };
      const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };

      component.toggleFavorite(movieToToggle, mockEvent as any);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(favoritesService.toggleFavorite).toHaveBeenCalledWith(movieToToggle); // Verifica que el servicio fue llamado con el argumento correcto
    });

    it('isFavorite() debe llamar a favoritesService.isFavorite', () => {
      const movieToCheck = { id: 'm1', title: 'Movie 1', description: '', imageUrl: '' };
      component.isFavorite(movieToCheck);
      expect(favoritesService.isFavorite).toHaveBeenCalledWith('m1'); // Verifica la llamada al servicio
    });

    // ... (Añade pruebas para watchMovie, viewMovieDetails futuras)

  });
