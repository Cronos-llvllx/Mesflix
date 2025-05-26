import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, ParamMap } from '@angular/router';
import { of, Subject, BehaviorSubject, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

import { GenreMoviesComponent } from './genre-movies.component';
import { FavoritesService } from '../../services/favorites.service';
import { TmdbService } from '../../services/tmdb.service';
// Asegúrate que esta interfaz Movie esté ACTUALIZADA (sin el 'overview' redundante)
import { Movie } from '../../interface/movie';
import { Genre } from '../../interface/genre';

// --- Mocks de Servicios ---

class MockActivatedRoute {
  private paramMapSubject = new BehaviorSubject<ParamMap>(convertToParamMap({}));
  public paramMap = this.paramMapSubject.asObservable();

  setParamMap(params: { [key: string]: string }) {
    this.paramMapSubject.next(convertToParamMap(params));
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockFavoritesService {
  favoriteMovieIds$ = new BehaviorSubject<string[]>([]);
  isFavorite = jasmine.createSpy('isFavorite').and.returnValue(false);
  addFavorite = jasmine.createSpy('addFavorite').and.returnValue(of({ success: true }));
  removeFavorite = jasmine.createSpy('removeFavorite').and.returnValue(of({ success: true }));

  setIsFavorite(status: boolean) {
    this.isFavorite.and.returnValue(status);
  }
  setFavoriteIds(ids: string[]) {
    this.favoriteMovieIds$.next(ids);
  }
}

class MockTmdbService {
  getGenres = jasmine.createSpy('getGenres').and.returnValue(of<Genre[]>([]));
  getMoviesByGenre = jasmine.createSpy('getMoviesByGenre').and.returnValue(of<Movie[]>([]));

  setGetGenresResponse(genres: Genre[]) {
    this.getGenres.and.returnValue(of(genres));
  }
  setGetMoviesByGenreResponse(movies: Movie[]) {
    this.getMoviesByGenre.and.returnValue(of(movies));
  }
  setGetMoviesByGenreError(error: any) {
    this.getMoviesByGenre.and.returnValue(throwError(() => error));
  }
}

describe('GenreMoviesComponent', () => {
  let component: GenreMoviesComponent;
  let fixture: ComponentFixture<GenreMoviesComponent>;
  let mockActivatedRoute: MockActivatedRoute;
  let mockRouter: MockRouter;
  let mockFavoritesService: MockFavoritesService;
  let mockTmdbService: MockTmdbService;

  // CORRECCIÓN AQUÍ: Usar camelCase y 'description' para la sinopsis.
  // Asegúrate que estas propiedades coincidan con tu interfaz Movie ACTUALIZADA.
  const mockMovie1: Movie = {
    id: '1',
    title: 'Movie 1',
    description: 'Descripción de Movie 1', // Campo para sinopsis
    // Las siguientes son opcionales según tu interfaz, pero es bueno tenerlas para pruebas completas
    posterPath: '/poster1.jpg',           // camelCase
    genreIds: [28],                     // camelCase
    voteAverage: 7,                     // camelCase
    releaseDate: '2023-01-01',
    // backdropPath: '/backdrop1.jpg',
    // runtime: 120,
    // isNew: false,
  };
  const mockMovie2: Movie = {
    id: '2',
    title: 'Movie 2',
    description: 'Descripción de Movie 2',
    posterPath: '/poster2.jpg',
    genreIds: [12, 28],
    voteAverage: 8,
    releaseDate: '2023-02-01',
  };
  const mockGenres: Genre[] = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
  ];

  beforeEach(async () => {
    mockActivatedRoute = new MockActivatedRoute();
    mockRouter = new MockRouter();
    mockFavoritesService = new MockFavoritesService();
    mockTmdbService = new MockTmdbService();

    await TestBed.configureTestingModule({
      imports: [GenreMoviesComponent, CommonModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: FavoritesService, useValue: mockFavoritesService },
        { provide: TmdbService, useValue: mockTmdbService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenreMoviesComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería cargar el título del género y las películas si genreId está presente', fakeAsync(() => {
      const genreId = '28';
      mockActivatedRoute.setParamMap({ genreId });
      mockTmdbService.setGetGenresResponse(mockGenres);
      mockTmdbService.setGetMoviesByGenreResponse([mockMovie1, mockMovie2]);

      fixture.detectChanges(); // Llama a ngOnInit
      tick(); // Permite que los observables (paramMap, getGenres, getMoviesByGenre) emitan y procesen

      expect(component.genreId).toBe(genreId);
      expect(mockTmdbService.getGenres).toHaveBeenCalled();
      expect(component.genreTitle).toBe('Action');
      expect(mockTmdbService.getMoviesByGenre).toHaveBeenCalledWith(genreId);
      expect(component.movies.length).toBe(2);
      expect(component.movies[0].title).toBe('Movie 1');
      expect(component.isLoading).toBeFalse(); // isLoading should be false after all operations
    }));

    it('debería usar "Películas" como título si el género no se encuentra pero genreId existe', fakeAsync(() => {
        const genreId = '999';
        mockActivatedRoute.setParamMap({ genreId });
        mockTmdbService.setGetGenresResponse(mockGenres);
        mockTmdbService.setGetMoviesByGenreResponse([mockMovie1]);

        spyOn(console, 'warn');
        fixture.detectChanges();
        tick();

        expect(component.genreId).toBe(genreId);
        expect(mockTmdbService.getGenres).toHaveBeenCalled();
        expect(component.genreTitle).toBe('Películas');
        expect(console.warn).toHaveBeenCalledWith(`No se encontró el nombre para el ID de género: ${genreId}. Mostrando título genérico.`);
        expect(mockTmdbService.getMoviesByGenre).toHaveBeenCalledWith(genreId);
        expect(component.movies.length).toBe(1);
        expect(component.isLoading).toBeFalse();
    }));


    it('debería manejar la ausencia de genreId en la ruta', fakeAsync(() => {
      mockActivatedRoute.setParamMap({});
      spyOn(console, 'error');
      spyOn(component, 'fetchMoviesByGenre');

      fixture.detectChanges();
      tick();

      expect(component.genreId).toBeNull();
      expect(console.error).toHaveBeenCalledWith('No se encontró ID de género en la ruta');
      expect(component.movies.length).toBe(0);
      expect(component.isLoading).toBeFalse();
      expect(component.genreTitle).toBe('Género no especificado');
      expect(component.fetchMoviesByGenre).not.toHaveBeenCalled();
    }));

    it('debería suscribirse a favoriteMovieIds$ de FavoritesService', () => {
      fixture.detectChanges();
      // @ts-ignore
      expect(component.favSubscription).toBeDefined();
      // @ts-ignore
      expect(component.favSubscription.closed).toBeFalse();

      const consoleSpy = spyOn(console, 'log');
      mockFavoritesService.setFavoriteIds(['1', '2']);
      expect(consoleSpy).toHaveBeenCalledWith('GenreMovies: Lista de favoritos actualizada:', ['1', '2']);
    });
  });

  describe('fetchMoviesByGenre', () => {
    it('no debería hacer nada si genreId es null', () => {
      component.genreId = null;
      component.fetchMoviesByGenre(); // isLoading se establece en false dentro de esta condición
      expect(mockTmdbService.getMoviesByGenre).not.toHaveBeenCalled();
      expect(component.isLoading).toBeFalse(); // Verificamos el estado final
    });

    it('debería cargar películas y establecer isLoading a false al finalizar', fakeAsync(() => {
      component.genreId = '28';
      // Es importante que ngOnInit haya corrido para que genreTitle esté seteado si el console.log lo usa.
      // O podemos setearlo manualmente para esta prueba aislada de fetchMoviesByGenre.
      component.genreTitle = 'Action'; // Seteo manual para el console.log
      mockTmdbService.setGetMoviesByGenreResponse([mockMovie1]);
      const consoleLogSpy = spyOn(console, 'log');

      component.fetchMoviesByGenre();
      // Debido a que of() es síncrono, isLoading se vuelve true y luego false inmediatamente.
      // tick() asegura que cualquier microtarea se complete.
      tick();

      expect(component.movies.length).toBe(1);
      expect(component.movies[0]).toEqual(mockMovie1);
      expect(component.isLoading).toBeFalse(); // Estado final esperado
      expect(consoleLogSpy).toHaveBeenCalledWith(`Películas cargadas para ${component.genreTitle} (ID: ${component.genreId}):`, [mockMovie1]);
    }));

    it('debería manejar errores al cargar películas y establecer isLoading a false', fakeAsync(() => {
      component.genreId = '28';
      const errorResponse = { message: 'Error de red' };
      mockTmdbService.setGetMoviesByGenreError(errorResponse);
      spyOn(console, 'error');

      component.fetchMoviesByGenre();
      tick(); // Procesa la emisión del error (síncrono con throwError)

      expect(component.movies.length).toBe(0);
      expect(component.isLoading).toBeFalse(); // Estado final esperado
      expect(console.error).toHaveBeenCalledWith(`Error al cargar películas para el género ${component.genreId}:`, errorResponse);
    }));

    it('debería registrar un mensaje si no se encuentran películas y establecer isLoading a false', fakeAsync(() => {
        component.genreId = '28';
        component.genreTitle = 'Action';
        mockTmdbService.setGetMoviesByGenreResponse([]); // No se encontraron películas
        const consoleLogSpy = spyOn(console, 'log');

        component.fetchMoviesByGenre();
        tick(); // Procesa la emisión de la respuesta (array vacío)

        expect(component.movies.length).toBe(0);
        expect(component.isLoading).toBeFalse(); // Estado final esperado
        expect(consoleLogSpy).toHaveBeenCalledWith('No se encontraron películas para este género en TMDB.');
    }));
  });

  describe('viewMovieDetails', () => {
    it('debería navegar a los detalles de la película con el ID correcto', () => {
      component.viewMovieDetails(mockMovie1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/movie-details', mockMovie1.id]);
    });
  });

  describe('watchMovie', () => {
    it('debería detener la propagación del evento y registrar un mensaje', () => {
      const mockEvent = jasmine.createSpyObj('Event', ['stopPropagation']);
      spyOn(console, 'log');
      component.watchMovie(mockMovie1, mockEvent);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Botón VER presionado para:', mockMovie1.title);
    });
  });

  describe('hideMovie', () => {
    it('debería eliminar la película de la lista y detener la propagación del evento', () => {
      component.movies = [mockMovie1, mockMovie2];
      const mockEvent = jasmine.createSpyObj('Event', ['stopPropagation']);
      spyOn(console, 'log');

      component.hideMovie(mockMovie1, mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Botón OCULTAR presionado para:', mockMovie1.title);
      expect(component.movies.length).toBe(1);
      expect(component.movies).not.toContain(mockMovie1);
      expect(component.movies).toContain(mockMovie2);
    });
  });

  describe('toggleFavorite', () => {
    let mockEvent: jasmine.SpyObj<Event>;

    beforeEach(() => {
        mockEvent = jasmine.createSpyObj('Event', ['stopPropagation']);
    });

    it('debería llamar a favoritesService.addFavorite si la película no es favorita', fakeAsync(() => {
      mockFavoritesService.setIsFavorite(false);
      component.toggleFavorite(mockMovie1, mockEvent);
      tick();

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(mockFavoritesService.addFavorite).toHaveBeenCalledWith(mockMovie1.id);
      expect(mockFavoritesService.removeFavorite).not.toHaveBeenCalled();
    }));

    it('debería llamar a favoritesService.removeFavorite si la película es favorita', fakeAsync(() => {
      mockFavoritesService.setIsFavorite(true);
      component.toggleFavorite(mockMovie1, mockEvent);
      tick();

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(mockFavoritesService.removeFavorite).toHaveBeenCalledWith(mockMovie1.id);
      expect(mockFavoritesService.addFavorite).not.toHaveBeenCalled();
    }));
  });

  describe('isFavorite', () => {
    it('debería llamar a favoritesService.isFavorite con el ID de la película', () => {
      component.isFavorite(mockMovie1);
      expect(mockFavoritesService.isFavorite).toHaveBeenCalledWith(mockMovie1.id);
    });

    it('debería devolver false si la película es nula', () => {
      // @ts-ignore
      expect(component.isFavorite(null)).toBeFalse();
    });

    it('debería devolver false si el ID de la película es nulo', () => {
      const movieWithNullId = { ...mockMovie1, id: null as any };
      expect(component.isFavorite(movieWithNullId)).toBeFalse();
    });
  });

  describe('ngOnDestroy', () => {
    it('debería desuscribirse de favSubscription y routeSubscription', () => {
      fixture.detectChanges();
      // @ts-ignore
      spyOn(component.favSubscription, 'unsubscribe');
      // @ts-ignore
      spyOn(component.routeSubscription, 'unsubscribe');

      component.ngOnDestroy();

      // @ts-ignore
      expect(component.favSubscription.unsubscribe).toHaveBeenCalled();
      // @ts-ignore
      expect(component.routeSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});