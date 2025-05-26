import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

import { TmdbService } from './tmdb.service';
import { Movie } from '../interface/movie'; // Asegúrate que esta interfaz esté actualizada
import { Genre } from '../interface/genre';
import { environment } from '../../environments/environment';

// Interfaz para la respuesta de la API de TMDB que contiene una lista de películas
interface TmdbMoviesResponseFromApi {
  page: number;
  results: any[]; // La API devuelve 'any' para los resultados de películas
  total_pages: number;
  total_results: number;
}

// Interfaz para la respuesta de la API de TMDB que contiene una lista de géneros
interface TmdbGenresResponseFromApi {
  genres: Genre[];
}

describe('TmdbService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;
  const mockApiKey = 'test_api_key';
  const mockApiBaseUrl = 'https://api.themoviedb.org/3'; // Simula el baseUrl de TMDB
  const mockImageBaseUrl = 'https://image.tmdb.org/t/p/';
  const defaultLang = 'es-MX';

  // Guardar los valores originales del environment para restaurarlos después
  let originalApiKey: string;
  let originalApiUrl: string;

  // Mock de datos de la API
  const mockApiMovie = {
    id: 123, // TMDB usa números para IDs
    title: 'Test Movie API',
    overview: 'This is a test overview from API.',
    release_date: '2023-01-01',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    vote_average: 7.5,
    genre_ids: [28, 12],
  };

  const mockApiMovieDetails = {
    ...mockApiMovie,
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }],
    runtime: 120,
  };

  // Datos esperados después del mapeo
  const expectedMappedMovie: Movie = {
    id: '123',
    title: 'Test Movie API',
    description: 'This is a test overview from API.',
    releaseDate: '2023-01-01',
    posterPath: `${mockImageBaseUrl}w500/poster.jpg`,
    backdropPath: `${mockImageBaseUrl}original/backdrop.jpg`,
    voteAverage: 7.5,
    genreIds: [28, 12],
    isNew: false,
  };

  const expectedMappedMovieDetails: Movie = {
    ...expectedMappedMovie,
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }],
    runtime: 120,
  };

  const mockApiGenres: Genre[] = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
  ];

  beforeEach(() => {
    // Guardar los valores originales del environment
    originalApiKey = environment.TMDB_API_KEY;
    originalApiUrl = environment.TMDB_API_URL;

    // Mockear las propiedades del environment directamente
    (environment as any).TMDB_API_KEY = mockApiKey;
    (environment as any).TMDB_API_URL = mockApiBaseUrl;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TmdbService],
    });
    service = TestBed.inject(TmdbService);
    httpMock = TestBed.inject(HttpTestingController);

    service.imageBaseUrl = mockImageBaseUrl;
  });

  afterEach(() => {
    // Restaurar los valores originales del environment para no afectar otras pruebas
    (environment as any).TMDB_API_KEY = originalApiKey;
    (environment as any).TMDB_API_URL = originalApiUrl;

    // Verificar httpMock solo si se inicializó correctamente
    if (httpMock) {
      httpMock.verify(); // Asegura que no haya peticiones pendientes
    }
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  function assertDefaultParams(params: HttpParams) {
    expect(params.get('api_key')).toBe(mockApiKey);
    expect(params.get('language')).toBe(defaultLang);
  }

  describe('getPopularMovies', () => {
    it('debería obtener películas populares y mapearlas correctamente', () => {
      const mockResponse: TmdbMoviesResponseFromApi = {
        page: 1,
        results: [mockApiMovie],
        total_pages: 1,
        total_results: 1,
      };

      service.getPopularMovies(1).subscribe(movies => {
        expect(movies.length).toBe(1);
        expect(movies[0]).toEqual(expectedMappedMovie);
      });

      const req = httpMock.expectOne(
        `${mockApiBaseUrl}/movie/popular?api_key=${mockApiKey}&language=${defaultLang}&page=1`
      );
      expect(req.request.method).toBe('GET');
      assertDefaultParams(req.request.params);
      expect(req.request.params.get('page')).toBe('1');
      req.flush(mockResponse);
    });
  });

  describe('getTopRatedMovies', () => {
    it('debería obtener películas mejor valoradas y mapearlas', () => {
        const mockResponse: TmdbMoviesResponseFromApi = { page: 1, results: [mockApiMovie], total_pages: 1, total_results: 1 };
        service.getTopRatedMovies(1).subscribe(movies => {
            expect(movies.length).toBe(1);
            expect(movies[0]).toEqual(expectedMappedMovie);
        });
        const req = httpMock.expectOne(`${mockApiBaseUrl}/movie/top_rated?api_key=${mockApiKey}&language=${defaultLang}&page=1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
  });

  describe('getUpcomingMovies', () => {
    it('debería obtener próximos estrenos y mapearlos', () => {
        const mockResponse: TmdbMoviesResponseFromApi = { page: 1, results: [mockApiMovie], total_pages: 1, total_results: 1 };
        service.getUpcomingMovies(1).subscribe(movies => {
            expect(movies.length).toBe(1);
            expect(movies[0]).toEqual(expectedMappedMovie);
        });
        const req = httpMock.expectOne(`${mockApiBaseUrl}/movie/upcoming?api_key=${mockApiKey}&language=${defaultLang}&page=1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
  });

  describe('getTrendingMovies', () => {
    it('debería obtener películas en tendencia (semana por defecto) y mapearlas', () => {
        const mockResponse: TmdbMoviesResponseFromApi = { page: 1, results: [mockApiMovie], total_pages: 1, total_results: 1 };
        service.getTrendingMovies('week', 1).subscribe(movies => {
            expect(movies.length).toBe(1);
            expect(movies[0]).toEqual(expectedMappedMovie);
        });
        const req = httpMock.expectOne(`${mockApiBaseUrl}/trending/movie/week?api_key=${mockApiKey}&language=${defaultLang}&page=1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
  });


  describe('getMoviesByGenre', () => {
    it('debería obtener películas por género y mapearlas', () => {
      const genreId = '28';
      const mockResponse: TmdbMoviesResponseFromApi = {
        page: 1,
        results: [mockApiMovie],
        total_pages: 1,
        total_results: 1,
      };

      service.getMoviesByGenre(genreId, 1).subscribe(movies => {
        expect(movies.length).toBe(1);
        expect(movies[0]).toEqual(expectedMappedMovie);
      });

      const req = httpMock.expectOne(
        `${mockApiBaseUrl}/discover/movie?api_key=${mockApiKey}&language=${defaultLang}&with_genres=${genreId}&page=1`
      );
      expect(req.request.method).toBe('GET');
      assertDefaultParams(req.request.params);
      expect(req.request.params.get('with_genres')).toBe(genreId);
      expect(req.request.params.get('page')).toBe('1');
      req.flush(mockResponse);
    });
  });

  describe('getGenres', () => {
    it('debería obtener la lista de géneros', () => {
      const mockResponse: TmdbGenresResponseFromApi = { genres: mockApiGenres };

      service.getGenres().subscribe(genres => {
        expect(genres.length).toBe(2);
        expect(genres).toEqual(mockApiGenres); // Asume que la interfaz Genre es la misma
      });

      const req = httpMock.expectOne(
        `${mockApiBaseUrl}/genre/movie/list?api_key=${mockApiKey}&language=${defaultLang}`
      );
      expect(req.request.method).toBe('GET');
      assertDefaultParams(req.request.params);
      req.flush(mockResponse);
    });
  });

  describe('searchMovies', () => {
    it('debería buscar películas y mapearlas', () => {
      const query = 'Test Query';
      const mockResponse: TmdbMoviesResponseFromApi = {
        page: 1,
        results: [mockApiMovie],
        total_pages: 1,
        total_results: 1,
      };

      service.searchMovies(query, 1).subscribe(movies => {
        expect(movies.length).toBe(1);
        expect(movies[0]).toEqual(expectedMappedMovie);
      });

      const req = httpMock.expectOne(
        `${mockApiBaseUrl}/search/movie?api_key=${mockApiKey}&language=${defaultLang}&query=${encodeURIComponent(query)}&page=1`
      );
      expect(req.request.method).toBe('GET');
      assertDefaultParams(req.request.params);
      expect(req.request.params.get('query')).toBe(query);
      expect(req.request.params.get('page')).toBe('1');
      req.flush(mockResponse);
    });
  });

  describe('getMovieDetails', () => {
    it('debería obtener detalles de una película y mapearlos correctamente', () => {
      const movieId = '123';
      const mockResponseFromApi = mockApiMovieDetails;

      service.getMovieDetails(movieId).subscribe(movie => {
        expect(movie).toEqual(expectedMappedMovieDetails);
      });

      const req = httpMock.expectOne(
        `${mockApiBaseUrl}/movie/${movieId}?api_key=${mockApiKey}&language=${defaultLang}&append_to_response=videos,credits,images,recommendations,similar,keywords`
      );
      expect(req.request.method).toBe('GET');
      assertDefaultParams(req.request.params);
      expect(req.request.params.get('append_to_response')).toBeTruthy();
      req.flush(mockResponseFromApi);
    });
  });

  it('debería manejar errores de API para getPopularMovies', () => {
    const mockError = new HttpErrorResponse({
      error: { status_message: 'Invalid API key: You must be granted a valid key.' },
      status: 401,
      statusText: 'Unauthorized',
    });

    service.getPopularMovies(1).subscribe({
      next: () => fail('debería haber fallado con error 401'),
      error: (error: Error) => {
        expect(error.message).toContain('Error TMDB 401: Invalid API key');
      },
    });

    const req = httpMock.expectOne(
      `${mockApiBaseUrl}/movie/popular?api_key=${mockApiKey}&language=${defaultLang}&page=1`
    );
    req.flush({ status_message: 'Invalid API key: You must be granted a valid key.' }, mockError);
  });

  it('debería manejar errores de red (status 0)', () => {
    service.getPopularMovies(1).subscribe({
      next: () => fail('debería haber fallado por error de red'),
      error: (error: Error) => {
        expect(error.message).toContain('No se pudo conectar con el servidor de TMDB.');
      },
    });

    const req = httpMock.expectOne(
      `${mockApiBaseUrl}/movie/popular?api_key=${mockApiKey}&language=${defaultLang}&page=1`
    );
    req.error(new ErrorEvent('Network error'), { status: 0, statusText: 'Unknown Error' });
  });

   it('debería manejar un error 404 Not Found', () => {
    const mockError = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: { status_message: 'The resource you requested could not be found.'}
    });

    service.getMovieDetails('nonExistentId').subscribe({
      next: () => fail('debería haber fallado con 404'),
      error: (error: Error) => {
        expect(error.message).toContain('Error TMDB 404: The resource you requested could not be found.');
      }
    });

    const req = httpMock.expectOne(
      `${mockApiBaseUrl}/movie/nonExistentId?api_key=${mockApiKey}&language=${defaultLang}&append_to_response=videos,credits,images,recommendations,similar,keywords`
    );
    req.flush({ status_message: 'The resource you requested could not be found.' }, mockError);
  });

  it('debería manejar un error genérico del servidor (ej. 500)', () => {
    const mockError = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    service.getPopularMovies(1).subscribe({
      next: () => fail('debería haber fallado con 500'),
      error: (error: Error) => {
        expect(error.message).toContain('Error 500: Internal Server Error');
      }
    });
    const req = httpMock.expectOne(
      `${mockApiBaseUrl}/movie/popular?api_key=${mockApiKey}&language=${defaultLang}&page=1`
    );
    req.flush(null, mockError);
  });
});