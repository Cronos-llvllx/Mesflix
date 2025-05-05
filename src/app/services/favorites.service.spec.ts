import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({}); // Configuración mínima para un servicio simple
    service = TestBed.inject(FavoritesService);

    // --- Limpiar localStorage ANTES de cada prueba ---
    localStorage.clear();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('isFavorite() debe devolver verdadero si el ID de la película está en localStorage', () => {
    localStorage.setItem('mesflix-favorites', JSON.stringify(['movie1', 'movie3']));
    expect(service.isFavorite('movie1')).toBeTrue();
  });

  it('isFavorite() debe devolver falso si el ID de la película NO está en el almacenamiento local', () => {
    localStorage.setItem('mesflix-favorites', JSON.stringify(['movie1', 'movie3']));
    expect(service.isFavorite('movie2')).toBeFalse();
  });

  it('isFavorite() debe devolver falso si localStorage está vacío', () => {
    expect(service.isFavorite('movie1')).toBeFalse();
  });
  it('addFavorite() debería agregar el ID de la película a localStorage', () => {
    const movieToAdd = { id: 'movie4', title: 'Test Movie', description: '', imageUrl: '' };
    service.addFavorite(movieToAdd.id);
    const favorites = JSON.parse(localStorage.getItem('mesflix-favorites') || '[]');
    expect(favorites).toContain('movie4');
  });

  it('addFavorite() no debe agregar ID duplicado', () => {
    localStorage.setItem('mesflix-favorites', JSON.stringify(['movie1']));
    const movieToAdd = { id: 'movie1', title: 'Test Movie', description: '', imageUrl: '' };
    service.addFavorite(movieToAdd.id); // Intenta añadir de nuevo
    const favorites = JSON.parse(localStorage.getItem('mesflix-favorites') || '[]');
    expect(favorites.length).toBe(1); // No debería haber crecido
  });
  it('toggleFavorite() debe agregar ID si no está presente', () => {
    const movieToToggle = { id: 'movie5', title: 'Toggle Movie', description: '', imageUrl: '' };
    service.toggleFavorite(movieToToggle);
    expect(service.isFavorite('movie5')).toBeTrue();
  });

  it('toggleFavorite() debe eliminar el ID si está presente', () => {
    localStorage.setItem('mesflix-favorites', JSON.stringify(['movie5']));
    const movieToToggle = { id: 'movie5', title: 'Toggle Movie', description: '', imageUrl: '' };
    service.toggleFavorite(movieToToggle);
    expect(service.isFavorite('movie5')).toBeFalse();
  });
    // Para probar la rama del catch en getFavoriteIds
    it('getFavoriteIds() debe devolver una matriz vacía para JSON no válido', () => {
      localStorage.setItem('mesflix-favorites', 'esto no es json valido');
      spyOn(console, 'error'); // Opcional: espiar el error
      expect(service.getFavoriteIds()).toEqual([]);
      expect(console.error).toHaveBeenCalled(); // Verifica que se logueó el error
    });

    // Para probar la rama donde el if(this.isFavorite) es falso en removeFavorite
    it('removeFavorite() no debe cambiar localStorage si el ID no existe', () => {
      const initialFavorites = ['movie1', 'movie3'];
      localStorage.setItem('mesflix-favorites', JSON.stringify(initialFavorites));
      service.removeFavorite('movie-non-existent'); // Intentar quitar uno que no está
      const finalFavorites = JSON.parse(localStorage.getItem('mesflix-favorites') || '[]');
      expect(finalFavorites).toEqual(initialFavorites); // El array no debe haber cambiado
    });

    // Otra rama posible en addFavorite: si el ID ya existe
    it('addFavorite() no debe cambiar localStorage si el ID ya existe', () => {
      const initialFavorites = ['movie1', 'movie3'];
      localStorage.setItem('mesflix-favorites', JSON.stringify(initialFavorites));
      service.addFavorite('movie1'); // Intentar añadir uno que ya está
      const finalFavorites = JSON.parse(localStorage.getItem('mesflix-favorites') || '[]');
      expect(finalFavorites).toEqual(initialFavorites); // El array no debe haber cambiado
    });

});
