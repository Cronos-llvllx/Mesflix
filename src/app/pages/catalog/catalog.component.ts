import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common'; // NgClass no se usa en tu template actual
import { Router, RouterModule } from '@angular/router'; // RouterModule añadido para routerLink en template
import { Genre } from '../../interface/genre'; // Tu interfaz Genre
import { TmdbService } from '../../services/tmdb.service'; // Importa TmdbService

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule /* NgClass si la usas en el template */],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'] // Corregido a styleUrls
})
export class CatalogComponent implements OnInit { // Implementa OnInit
  genres: Genre[] = []; // Se llenará desde el servicio
  isLoadingGenres: boolean = true;

  // Clases CSS simuladas que tenías (puedes adaptarlas o eliminarlas si el diseño cambia)
  // Podrías mapearlas a los géneros si quieres mantener estilos específicos por nombre/ID
  genreCssClasses: { [key: string]: string } = {
    'Comedia': 'genre-hexagon size-medium',
    'Ciencia Ficción': 'genre-hexagon size-medium',
    'Fantasía': 'genre-hexagon size-medium',
    'Aventura': 'genre-hexagon size-medium shape-wide',
    'Acción': 'genre-heptagon size-large',
    'Terror': 'genre-hexagon size-small',
    'Drama': 'genre-tall-hexagon size-medium'
    // Añade más si es necesario o crea una función para asignar clases
  };

  constructor(
    private router: Router,
    private tmdbService: TmdbService // Inyecta TmdbService
  ) {}

  ngOnInit(): void {
    this.isLoadingGenres = true;
    this.tmdbService.getGenres().subscribe({
      next: (loadedGenres) => {
        // Opcional: Filtrar o limitar el número de géneros a mostrar
        // this.genres = loadedGenres.slice(0, 7); // Ejemplo: mostrar solo 7
        this.genres = loadedGenres.map(genre => ({
          ...genre,
          // Asignar la clase CSS si existe en nuestro mapeo, o una por defecto
          cssClass: this.genreCssClasses[genre.name] || 'genre-hexagon size-medium'
        }));
        this.isLoadingGenres = false;
        console.log('Géneros cargados desde TMDB:', this.genres);
      },
      error: (err) => {
        console.error('Error al cargar géneros desde TMDB:', err);
        this.isLoadingGenres = false;
        // Aquí podrías mostrar un mensaje de error en la UI
      }
    });
  }

  selectGenre(genre: Genre): void {
    console.log('Género seleccionado:', genre.name, 'ID:', genre.id);
    // Navegar usando el ID numérico del género (convertido a string para el parámetro de ruta)
    this.router.navigate(['/genre', genre.id.toString()]);
  }
}
// La clase LoginComponent que estaba al final de tu archivo debe eliminarse de aquí.
// export class LoginComponent {} // <--- ELIMINA ESTO DE AQUÍ
