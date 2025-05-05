  import { Component, OnInit } from '@angular/core';
  import { CommonModule, NgClass } from '@angular/common';
  import { RouterModule } from '@angular/router';
  import { Movie } from '../../interface/movie';
  import { FavoritesService } from '../../services/favorites.service';
  import { SIMULATED_MOVIES } from '../../data/simulated-movies';

  @Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [ CommonModule, NgClass, RouterModule ],
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss']
  })
  export class FavoritesComponent implements OnInit {
    favoriteMovies: Movie[] = [];

    constructor(private favoritesService: FavoritesService) {}

    ngOnInit(): void {
      this.loadFavoriteMovies();
    }

    loadFavoriteMovies(): void {
      const favoriteIds = this.favoritesService.getFavoriteIds();
      console.log('IDs favoritos encontrados:', favoriteIds);

      // --- Simulación para obtener detalles de películas favoritas ---
      // En una app real, llamarías a un MovieService: this.movieService.getMoviesByIds(favoriteIds)...
      // Aquí, filtramos nuestra lista simulada "maestra"
      this.favoriteMovies = SIMULATED_MOVIES.filter(movie => favoriteIds.includes(movie.id));
      console.log('Películas favoritas cargadas:', this.favoriteMovies);
      // --- Fin Simulación ---
    }

      // Puedes añadir los métodos toggleFavorite, watchMovie, etc. aquí también
      // si quieres que los botones funcionen igual en esta página.
      // ¡Recuerda llamar a loadFavoriteMovies() después de quitar un favorito
      // desde esta página para que la lista se actualice!
    toggleFavorite(movie: Movie, event: Event): void {
      event.stopPropagation();
      this.favoritesService.toggleFavorite(movie);
      this.loadFavoriteMovies(); // Recargar la lista para reflejar el cambio
    }
    viewMovieDetails(movie: Movie): void { /* Navegar a detalles */ }
    watchMovie(movie: Movie, event: Event): void { /* ... */ }
    hideMovie(movie: Movie, event: Event): void { /* ... */ }
    isFavorite(movie: Movie): boolean { // Necesario si el botón cambia
      return this.favoritesService.isFavorite(movie.id);
    }
  }
