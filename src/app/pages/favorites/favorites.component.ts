import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { TmdbService } from '../../services/tmdb.service'; // Para obtener detalles de películas
import { Movie } from '../../interface/movie'; // Tu interfaz Movie
// Importaciones de RxJS necesarias:
import { Observable, Subscription, of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // Para *ngFor, *ngIf
import { RouterModule } from '@angular/router'; // Para routerLink


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule /*, MovieCardComponent*/], // Añade MovieCardComponent si lo usas
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteMoviesDetails: Movie[] = [];
  isLoading: boolean = true;
  private favIdsSubscription!: Subscription;

  constructor(
    private favoritesService: FavoritesService,
    private tmdbService: TmdbService // Asegúrate de que TmdbService esté correctamente inyectado
  ) {}

  ngOnInit(): void {
    // 1. Cargar los IDs de favoritos del backend (esto actualizará el BehaviorSubject en el servicio)
    this.favoritesService.loadUserFavorites().subscribe({
      next: () => {
        // No necesitamos hacer nada aquí directamente, la suscripción a favoriteMovieIds$ se encargará.
        console.log('Llamada a loadUserFavorites completada en FavoritesComponent ngOnInit.');
      },
      error: (err) => {
        console.error('Error al cargar IDs de favoritos en FavoritesComponent ngOnInit:', err);
        this.isLoading = false; // Detener la carga si hay un error inicial
      }
    });

    // 2. Suscribirse a los cambios en los IDs de películas favoritas desde el servicio
    this.favIdsSubscription = this.favoritesService.favoriteMovieIds$.subscribe(movieIds => {
      console.log('FavoritesComponent: IDs de favoritos actualizados recibidos:', movieIds);
      this.fetchMovieDetailsForFavorites(movieIds);
    });
  }

  fetchMovieDetailsForFavorites(movieIds: string[]): void {
    this.isLoading = true;
    this.favoriteMoviesDetails = []; // Limpiar antes de cargar nuevos detalles

    if (!movieIds || movieIds.length === 0) {
      this.isLoading = false;
      return;
    }

    const movieDetailObservables: Observable<Movie | null>[] = movieIds.map(id =>
      this.tmdbService.getMovieDetails(id).pipe( // Asume que tmdbService.getMovieDetails(id) devuelve Observable<Movie>
        catchError(error => { // catchError importado de 'rxjs/operators'
          console.error(`Error al obtener detalles para la película ${id}:`, error);
          return of(null); // 'of' importado de 'rxjs'. Devuelve null en caso de error para que forkJoin no falle por completo.
        })
      )
    );

    // Si movieDetailObservables puede estar vacío, necesitas manejar eso antes de forkJoin.
    if (movieDetailObservables.length > 0) {
      forkJoin(movieDetailObservables).subscribe({ // 'forkJoin' importado de 'rxjs'
        next: (moviesWithPossibleNulls => { // 'movies' ahora es 'moviesWithPossibleNulls' para claridad
          // Tipar 'movie' en el filter para evitar el error de 'any' implícito
          this.favoriteMoviesDetails = moviesWithPossibleNulls.filter((movie: Movie | null): movie is Movie => movie !== null);
          this.isLoading = false;
          console.log('Detalles de películas favoritas cargados:', this.favoriteMoviesDetails);
        }),
        error: (err) => {
          console.error('Error en forkJoin al obtener detalles de películas:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  // Método para quitar un favorito (si tienes un botón en esta vista)
  removeFromFavorites(movie: Movie): void {
    if (!movie || movie.id == null) { // Chequeo adicional
        console.error('Intento de eliminar favorito con película o ID inválido:', movie);
        return;
    }
    this.favoritesService.removeFavorite(movie.id.toString()).subscribe({
      next: () => console.log(`Película ${movie.id} eliminada de favoritos desde FavoritesComponent`),
      error: (err) => console.error('Error al eliminar favorito:', err)
    });
    // El BehaviorSubject en el servicio actualizará la lista automáticamente y esta vista reaccionará
  }

  // Para el template HTML (si muestras un botón de favorito aquí también)
  isMovieFavorite(movie: Movie): boolean {
    if (!movie || movie.id == null) return false;
    return this.favoritesService.isFavorite(movie.id.toString());
  }

  // Métodos para acciones en la tarjeta, si los tienes en el template de esta página.
  viewMovieDetails(movie: Movie): void {
    console.log('Navegando a detalles de:', movie.title);
    // this.router.navigate(['/movie-details', movie.id]); // Asegúrate de tener Router inyectado si lo usas
  }

  watchMovie(movie: Movie, event?: Event): void { // event es opcional
    event?.stopPropagation();
    console.log('Viendo película:', movie.title);
  }

  ngOnDestroy(): void {
    if (this.favIdsSubscription) {
      this.favIdsSubscription.unsubscribe();
    }
  }
}
