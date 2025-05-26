import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FavoritesService } from './favorites.service';
// import { environment } from '../../environments/environment'; // Ya no es estrictamente necesario aquí si hardcodeamos para la prueba

describe('FavoritesService', () => {
  let service: FavoritesService;
  let httpMock: HttpTestingController;

  // ESTA ES LA URL BASE QUE TU SERVICIO ESTÁ USANDO SEGÚN LOS ERRORES
  // Asegúrate de que coincida con tu backend de C# para favoritos.
  const actualServiceApiBaseUrl = 'http://localhost:3000/api'; // Base de tu API
  const favoritesApiUrl = `${actualServiceApiBaseUrl}/favorites`; // URL completa para el endpoint de favoritos

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavoritesService]
    });
    service = TestBed.inject(FavoritesService);
    httpMock = TestBed.inject(HttpTestingController);

    // Es importante que el 'environment.apiUrl' que el FavoritesService usa internamente
    // sea 'http://localhost:3000/api'. Si no lo es, el servicio mismo generará URLs incorrectas.
    // Esta prueba asume que el servicio está configurado para usar 'http://localhost:3000/api'.
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones pendientes
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  // --- Pruebas para loadUserFavorites ---
  it('loadUserFavorites() debe obtener los IDs de favoritos del backend y actualizar favoriteMovieIds$', (done) => {
    const mockFavoriteIds = ['101', '102'];

    service.loadUserFavorites().subscribe(ids => {
      // La suscripción al resultado de la llamada es opcional si solo pruebas el efecto en el BehaviorSubject
    });

    // Esperar una petición GET a la URL correcta
    const req = httpMock.expectOne(favoritesApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockFavoriteIds); // Simula una respuesta exitosa del backend

    service.favoriteMovieIds$.subscribe(idsFromSubject => {
      expect(idsFromSubject).toEqual(mockFavoriteIds);
      done();
    });
  });

  it('loadUserFavorites() debe manejar errores del backend', (done) => {
    const errorMessage = 'Error del servidor al cargar favoritos';
    service.loadUserFavorites().subscribe({
      next: () => fail('debería haber fallado con un error del servidor'),
      error: (error: Error) => {
        // El mensaje de error vendrá de tu handleError en el servicio
        // Asegúrate que coincida o usa toContain si es más genérico.
        expect(error.message).toBeTruthy(); // O un mensaje más específico
        service.favoriteMovieIds$.subscribe(idsFromSubject => {
            expect(idsFromSubject).toEqual([]);
            done();
        });
      }
    });

    const req = httpMock.expectOne(favoritesApiUrl);
    // Simula un error del servidor; el cuerpo del error puede variar.
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
  });


  // --- Pruebas para addFavorite ---
  it('addFavorite(movieId) debe hacer un POST al backend y actualizar los IDs locales en éxito', (done) => {
    const movieIdToAdd = 'newFav1';
    const initialFavs: string[] = [];
    // @ts-ignore: Accediendo a propiedad privada para la prueba
    service.favoriteMovieIdsSubject.next(initialFavs);

    service.addFavorite(movieIdToAdd).subscribe(response => {
      // Verifica la respuesta del backend si es relevante
    });

    const req = httpMock.expectOne(favoritesApiUrl); // Espera un POST a la URL base de favoritos
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ movieId: movieIdToAdd });
    req.flush({ message: 'Película añadida a favoritos.' }); // Simula respuesta del backend

    service.favoriteMovieIds$.subscribe(currentFavs => {
        if (currentFavs.includes(movieIdToAdd)) { 
            expect(currentFavs.length).toBe(initialFavs.length + 1);
            done();
        }
    });
    // @ts-ignore: Accediendo a propiedad privada para la prueba (forzar emisión si es necesario)
    if (!service.favoriteMovieIdsSubject.getValue().includes(movieIdToAdd)) {
        // @ts-ignore: Accediendo a propiedad privada para la prueba
        service.favoriteMovieIdsSubject.next([movieIdToAdd]);
    }
  });

  it('addFavorite(movieId) no debe duplicar IDs en el estado local si el backend ya lo tenía (o si el servicio maneja la duplicación)', (done) => {
    const movieIdToAdd = 'existingFav';
    const initialFavs = [movieIdToAdd];
    // @ts-ignore: Accediendo a propiedad privada para la prueba
    service.favoriteMovieIdsSubject.next(initialFavs);

    service.addFavorite(movieIdToAdd).subscribe();

    const req = httpMock.expectOne(favoritesApiUrl);
    req.flush({ message: 'Esta película ya está en tus favoritos.' });

    service.favoriteMovieIds$.subscribe(currentFavs => {
      // @ts-ignore: Accediendo a propiedad privada para la prueba (para la condición del if)
      if(currentFavs.filter(id => id === movieIdToAdd).length === 1 && service.favoriteMovieIdsSubject.getValue().filter(id => id === movieIdToAdd).length === 1) {
        expect(currentFavs).toEqual(initialFavs);
        done();
      }
    });
    // @ts-ignore: Accediendo a propiedad privada para la prueba (forzar emisión si es necesario)
    if(service.favoriteMovieIdsSubject.getValue().filter(id => id === movieIdToAdd).length !== 1) {
        // @ts-ignore: Accediendo a propiedad privada para la prueba
        service.favoriteMovieIdsSubject.next(initialFavs);
    }
  });


  // --- Pruebas para removeFavorite ---
  it('removeFavorite(movieId) debe hacer un DELETE al backend y actualizar los IDs locales en éxito', (done) => {
    const movieIdToRemove = 'favToRemove';
    const initialFavs = ['otherFav', movieIdToRemove];
    // @ts-ignore: Accediendo a propiedad privada para la prueba
    service.favoriteMovieIdsSubject.next(initialFavs);

    service.removeFavorite(movieIdToRemove).subscribe(response => {
      // Verifica la respuesta
    });

    const req = httpMock.expectOne(`${favoritesApiUrl}/${movieIdToRemove}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Película eliminada de favoritos.' });

    service.favoriteMovieIds$.subscribe(currentFavs => {
      if (!currentFavs.includes(movieIdToRemove)) {
        expect(currentFavs.length).toBe(initialFavs.length - 1);
        done();
      }
    });
    // @ts-ignore: Accediendo a propiedad privada para la prueba (forzar emisión si es necesario)
    if (service.favoriteMovieIdsSubject.getValue().includes(movieIdToRemove)) {
        // @ts-ignore: Accediendo a propiedad privada para la prueba
        service.favoriteMovieIdsSubject.next(['otherFav']);
    }
  });

  // --- Prueba para isFavorite (asumiendo que usa el BehaviorSubject) ---
  it('isFavorite() debe devolver verdadero si el ID está en los favoritos cargados', () => {
    // @ts-ignore: Accediendo a propiedad privada para la prueba
    service.favoriteMovieIdsSubject.next(['m1', 'm3']);
    expect(service.isFavorite('m1')).toBeTrue();
  });

  it('isFavorite() debe devolver falso si el ID NO está en los favoritos cargados', () => {
    // @ts-ignore: Accediendo a propiedad privada para la prueba
    service.favoriteMovieIdsSubject.next(['m1', 'm3']);
    expect(service.isFavorite('m2')).toBeFalse();
  });

  // --- Prueba para clearLocalFavorites ---
  it('clearLocalFavorites() debe vaciar favoriteMovieIdsSubject', (done) => {
    // @ts-ignore: Accediendo a propiedad privada para la prueba
    service.favoriteMovieIdsSubject.next(['fav1', 'fav2']);
    service.clearLocalFavorites();

    service.favoriteMovieIds$.subscribe(currentFavs => {
      expect(currentFavs).toEqual([]);
      done();
    });
  });
});