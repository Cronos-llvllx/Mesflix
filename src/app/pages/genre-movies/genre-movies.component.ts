
  import { Component, OnInit } from '@angular/core';
  import { CommonModule, NgClass } from '@angular/common'; // Importa NgClass y CommonModule
  import { ActivatedRoute, Router } from '@angular/router'; // Importa ActivatedRoute y Router
  import { Movie } from '../../interface/movie'; // Importa la interfaz Movie
  import { FavoritesComponent } from '../favorites/favorites.component';
import { FavoritesService } from '../../services/favorites.service';

  @Component({
    selector: 'app-genre-movies',
    standalone: true,
    imports: [ CommonModule, NgClass ], // Añade CommonModule y NgClass
    templateUrl: './genre-movies.component.html',
    styleUrls: ['./genre-movies.component.scss']
  })
  export class GenreMoviesComponent implements OnInit {
    genreId: string | null = null;
    movies: Movie[] = [];
    genreTitle: string = '';

    // --- Inyecta FavoritesService ---
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private FavoritesService: FavoritesService // Inyectar servicio
    ) {}

    ngOnInit(): void {
      this.genreId = this.route.snapshot.paramMap.get('genreId');
      if (this.genreId) {
        this.genreTitle = this.genreId.charAt(0).toUpperCase() + this.genreId.slice(1);
        this.loadMovies();
      } else {
        console.error('No se encontró ID de género en la ruta');
      }
    }

    loadMovies(): void {
      console.log(`Cargando películas simuladas para el género: ${this.genreId}`);
      this.movies = [ // Datos simulados
        { id: 'movie1', title: 'Película Increíble 1', description: 'Una descripción breve...', imageUrl: 'BatmanAK.jpg', isNew: true },
        { id: 'movie2', title: 'Secuela Asombrosa 2', description: 'Las aventuras continúan...', imageUrl: 'GhostRider.jpg' },
        { id: 'movie3', title: 'El Origen Épico 3', description: 'Descubre cómo empezó...', imageUrl: 'WinterSoldier.jpg' },
      ];
    }

    viewMovieDetails(movie: Movie): void {
      console.log('Navegar a detalles de:', movie.title);
      // this.router.navigate(['/movie', movie.id]);
    }

    watchMovie(movie: Movie, event: Event): void { /* ... */ }
    hideMovie(movie: Movie, event: Event): void { /* ... */ }

    // --- Método para alternar favorito ---
    toggleFavorite(movie: Movie, event: Event): void {
      event.stopPropagation(); // Evita que el clic navegue a detalles
      this.FavoritesService.toggleFavorite(movie);
      console.log('Estado favorito cambiado para:', movie.title);
      // Para forzar la actualización visual del botón si usas clases CSS:
      // Podrías necesitar manejar el estado localmente o usar un BehaviorSubject en el servicio
    }

    // --- Método para verificar si es favorito (para estilos) ---
    isFavorite(movie: Movie): boolean {
      return this.FavoritesService.isFavorite(movie.id);
    }
  }
