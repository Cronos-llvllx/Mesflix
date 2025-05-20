  import { Component, OnInit } from '@angular/core';
  import { CommonModule, NgClass } from '@angular/common'; // Importa NgClass y CommonModule
  import { ActivatedRoute, Router } from '@angular/router'; // Importa ActivatedRoute y Router
  import { Movie } from '../../interface/movie'; // Importa la interfaz Movie
  //import { FavoritesComponent } from '../favorites/favorites.component';
import { FavoritesService } from '../../services/favorites.service';
//Importa operadores y tipos de rxjs
import { Observable, of, delay, tap } from 'rxjs';
//importar mi archivo de peliculas
import { SIMULATED_MOVIES } from '../../data/simulated-movies'; // Importa la lista de películas simuladas
  @Component({
    selector: 'app-genre-movies',
    standalone: true,
    imports: [ CommonModule, NgClass ],
    templateUrl: './genre-movies.component.html',
    styleUrls: ['./genre-movies.component.scss']
  })
  export class GenreMoviesComponent implements OnInit {
    genreId: string | null = null;
    movies: Movie[] = [];
    genreTitle: string = '';
    isLoading: boolean = false; // flag de carga

    // --- Inyecta FavoritesService ---
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private favoritesService: FavoritesService // Inyectar servicio
    ) {}

      ngOnInit(): void {
        this.route.paramMap.subscribe(params => { // Usar subscribe es mejor si puedes navegar entre géneros
            this.genreId = params.get('genreId');
            if (this.genreId) {
              this.genreTitle = this.genreId.charAt(0).toUpperCase() + this.genreId.slice(1);
              this.fetchMoviesWithDelay(); // Llama al método que ahora maneja la suscripción
            } else {
              console.error('No se encontró ID de género en la ruta');
              this.movies = []; // Limpia las películas si no hay ID
              this.isLoading = false;
            }
        });
      }

      fetchMoviesWithDelay(): void {
        this.isLoading = true; // <-- Empieza la carga
        this.movies = []; // Opcional: Limpiar películas anteriores mientras carga

        // Llama al método que DEVUELVE el Observable
        this.getMoviesObservable().subscribe({ // Suscribe al Observable (RXJS)
          next: (loadedMovies) => { // Callback cuando llegan los datos(asincrono)
            this.movies = loadedMovies; // <-- Asigna las películas cuando llegan
            console.log('Películas cargadas (simulado con delay)');
          },
          error: (err) => {
            console.error('Error simulado al cargar películas:', err);
            this.isLoading = false; // <-- Termina la carga en caso de error
          },
          complete: () => {
            this.isLoading = false; // <-- Termina la carga cuando el Observable se completa
            console.log('Observable de películas completado.');
          }
        });
      }


      // --- Método que DEVUELVE el Observable con retraso ---
      getMoviesObservable(): Observable<Movie[]> {
        console.log(`Obteniendo Observable de películas simuladas para: ${this.genreId}`);

        // --- Simulación de Datos ---
        const simulatedMovies: Movie[] = [
            // Asegúrate que estos IDs coincidan con los que guardas en favoritos
          { id: 'movie1', title: 'Película Increíble 1', description: 'Una descripción breve...', imageUrl: 'BatmanAK.jpg', isNew: true },
          { id: 'movie2', title: 'Secuela Asombrosa 2', description: 'Las aventuras continúan...', imageUrl: 'GhostRider.jpg' },
          { id: 'movie3', title: 'El Origen Épico 3', description: 'Descubre cómo empezó...', imageUrl: 'Skyfall.jpg' },
          // ... más películas si quieres
        ];
        // --- Fin Simulación ---

        // 1. 'of()' crea un Observable que emite el array de películas UNA SOLA VEZ.
        // 2. 'delay(1000)' espera 1000ms (1 segundo) antes de emitir el valor.
        // 3. 'tap()' permite ejecutar efectos secundarios. Aquí lo usamos solo para log.
        //    Podríamos usarlo para poner isLoading=false, pero 'complete' en subscribe es más seguro.
        return of(simulatedMovies).pipe(
            delay(1000), // Simula 1 segundo de espera
            tap(data => console.log('Observable está a punto de emitir datos:', data)) // Opcional: log antes de emitir
            // finalize(() => this.isLoading = false) // Otra opción para poner isLoading=false, se ejecuta siempre (éxito o error)
        );
      }

        // --- Métodos existentes (viewMovieDetails, toggleFavorite, etc.) ---
        viewMovieDetails(movie: Movie): void {
          // Este método se llama si haces clic en TODA la tarjeta (si pusiste (click) en el wrapper)
          // No necesita event.stopPropagation() porque es la acción principal del wrapper.
          console.log('Se hizo clic en la tarjeta, navegando a detalles de:', movie.title);
          // Aquí podrías añadir la navegación real:
          // this.router.navigate(['/movie-details', movie.id]); // O la ruta que definas
        }
        watchMovie(movie: Movie, event: Event): void {
          event.stopPropagation(); // IMPORTANTE: Evita que se ejecute también viewMovieDetails
          console.log('Botón VER presionado para:', movie.title);
          // Aquí pondrías la lógica para "ver" la película (abrir un modal, navegar, etc.)
        }
        hideMovie(movie: Movie, event: Event): void {
          event.stopPropagation(); // IMPORTANTE: Evita que se ejecute también viewMovieDetails
          console.log('Botón OCULTAR presionado para:', movie.title);
          // filtramos el array this.movies y despues se crea uno nuevo que contiene todas excepto las ocultas
          this.movies = this.movies.filter(m => m.id !== movie.id);
          console.log('Pelicula ocultada. Peliculas restantes:', this.movies.length);
        }
        toggleFavorite(movie: Movie, event: Event): void {
          event.stopPropagation(); // IMPORTANTE: Evita que se ejecute también viewMovieDetails
          console.log('Botón FAVORITO presionado para:', movie.title, '- ID:', movie.id); // Log para saber que se llamó
          this.favoritesService.toggleFavorite(movie); // La lógica real que llama al servicio
          // No es necesario hacer más aquí si el HTML usa [class.is-favorite]="isFavorite(movie)"
        }
        // isFavorite ya estaba implementada, la dejamos como está:
        isFavorite(movie: Movie): boolean {
          return this.favoritesService.isFavorite(movie.id);
        }
    }
