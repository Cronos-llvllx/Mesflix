import { Movie } from './../interface/movie';
import { Injectable } from '@angular/core';
// Importar interfaz

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageKey = 'mesflix-favorites'; // Clave para localStorage

  constructor() { }

  // Obtiene los IDs de las películas favoritas
  getFavoriteIds(): (string | number)[] {
    const favoritesJson = localStorage.getItem(this.storageKey);
    if (favoritesJson) {
      try {
        // Parsea el JSON guardado, asegurándose que sea un array
        const ids = JSON.parse(favoritesJson);
        return Array.isArray(ids) ? ids : [];
      } catch (e) {
        console.error("Error al parsear favoritos de localStorage", e);
        return []; // Retorna array vacío si hay error
      }
    }
    return []; // Retorna array vacío si no hay nada guardado
  }

  // Guarda la lista completa de IDs favoritos
  private saveFavorites(ids: (string | number)[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
  }

  // Verifica si una película es favorita
  isFavorite(movieId: string | number): boolean {
    const ids = this.getFavoriteIds();
    return ids.includes(movieId);
  }

  // Añade una película a favoritos
  addFavorite(movieId: string | number): void {
    if (!this.isFavorite(movieId)) {
      const ids = this.getFavoriteIds();
      ids.push(movieId);
      this.saveFavorites(ids);
      console.log('Añadido a favoritos:', movieId); // Log para depuración
    }
  }

  // Quita una película de favoritos
  removeFavorite(movieId: string | number): void {
    let ids = this.getFavoriteIds();
    if (this.isFavorite(movieId)) {
      ids = ids.filter(id => id !== movieId);
      this.saveFavorites(ids);
      console.log('Quitado de favoritos:', movieId); // Log para depuración
    }
  }

  // Método para alternar el estado de favorito (más conveniente)
  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie.id)) {
      this.removeFavorite(movie.id);
    } else {
      this.addFavorite(movie.id);
    }
    // Opcional: Podrías emitir un evento aquí si otros componentes necesitan reaccionar al cambio
  }
}
