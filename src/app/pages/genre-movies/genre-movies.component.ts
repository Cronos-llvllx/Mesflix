import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../interface/movie';
import { FavoritesService } from '../../services/favorites.service';
import { TmdbService } from '../../services/tmdb.service'; // <--- IMPORTA TmdbService
import { Observable, of, Subscription } from 'rxjs'; // 'delay', 'tap', 'forkJoin' pueden no ser necesarios aquí
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-genre-movies',
  standalone: true,
  imports: [ CommonModule, NgClass ],
  templateUrl: './genre-movies.component.html',
  styleUrls: ['./genre-movies.component.scss']
})
// src/app/pages/genre-movies/genre-movies.component.ts
// ... (importaciones)
export class GenreMoviesComponent implements OnInit, OnDestroy {
  genreId: string | null = null; // El ID de la ruta seguirá siendo string
  movies: Movie[] = [];
  genreTitle: string = '';
  isLoading: boolean = false;
  private favSubscription!: Subscription;
  private routeSubscription!: Subscription; // Para desuscribirse de paramMap

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService,
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => { // Guardar la suscripción
        this.genreId = params.get('genreId');
        if (this.genreId) {
          // Obtener el nombre del género usando el ID numérico
          this.tmdbService.getGenres().subscribe(genres => {
            const foundGenre = genres.find(g => g.id.toString() === this.genreId); // Compara como string
            this.genreTitle = foundGenre ? foundGenre.name : `Películas`;
            if (!foundGenre) {
              console.warn(`No se encontró el nombre para el ID de género: ${this.genreId}. Mostrando título genérico.`);
            }
          });
          this.fetchMoviesByGenre();
        } else {
          console.error('No se encontró ID de género en la ruta');
          this.movies = [];
          this.isLoading = false;
          this.genreTitle = 'Género no especificado';
        }
    });

    this.favSubscription = this.favoritesService.favoriteMovieIds$.subscribe(favIds => {
      console.log('GenreMovies: Lista de favoritos actualizada:', favIds);
    });
  }

  fetchMoviesByGenre(): void {
    if (!this.genreId) { // this.genreId aquí será el ID numérico como string
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.movies = [];

    this.tmdbService.getMoviesByGenre(this.genreId).subscribe({
      next: (loadedMovies) => {
        this.movies = loadedMovies; // Mostrar todas por ahora, o .slice(0, N)
        this.isLoading = false;
        console.log(`Películas cargadas para ${this.genreTitle} (ID: ${this.genreId}):`, this.movies);
        if (this.movies.length === 0) {
            console.log('No se encontraron películas para este género en TMDB.');
        }
      },
      error: (err) => {
        console.error(`Error al cargar películas para el género ${this.genreId}:`, err);
        this.isLoading = false;
      }
    });
  }



  // EL MÉTODO getSimulatedMoviesObservable() YA NO ES NECESARIO Y SE DEBE ELIMINAR

  viewMovieDetails(movie: Movie): void {
    console.log('Navegando a detalles de:', movie.title);
    this.router.navigate(['/movie-details', movie.id.toString()]); // Asegúrate que la ruta sea correcta
  }

  watchMovie(movie: Movie, event: Event): void {
    event.stopPropagation();
    console.log('Botón VER presionado para:', movie.title);
    // Lógica para ver la película
  }

  hideMovie(movie: Movie, event: Event): void {
    event.stopPropagation();
    console.log('Botón OCULTAR presionado para:', movie.title);
    this.movies = this.movies.filter(m => m.id !== movie.id);
  }

  toggleFavorite(movie: Movie, event: Event): void {
    event.stopPropagation();
    const movieIdStr = movie.id.toString();
    const isCurrentlyFavorite = this.favoritesService.isFavorite(movieIdStr);

    if (isCurrentlyFavorite) {
      this.favoritesService.removeFavorite(movieIdStr).subscribe({
        next: () => console.log(`Película ${movieIdStr} eliminada de favoritos`),
        error: (err) => console.error(`Error al eliminar favorito ${movieIdStr}:`, err)
      });
    } else {
      this.favoritesService.addFavorite(movieIdStr).subscribe({
        next: () => console.log(`Película ${movieIdStr} añadida a favoritos`),
        error: (err) => console.error(`Error al añadir favorito ${movieIdStr}:`, err)
      });
    }
  }

  isFavorite(movie: Movie): boolean {
    if (!movie || movie.id == null) return false;
    return this.favoritesService.isFavorite(movie.id.toString());
  }

  ngOnDestroy(): void {
    if (this.favSubscription) {
      this.favSubscription.unsubscribe();
    }
    if (this.routeSubscription) { // Desuscribirse de paramMap
      this.routeSubscription.unsubscribe();
    }
  }
}
