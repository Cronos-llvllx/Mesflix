import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router'; // Si quieres navegar después
import { Genre } from '../../interface/genre';


@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {

  // Lista simulada de géneros con clases CSS para estilo
  genres: Genre[] = [
    { id: 'comedia', name: 'Comedia', cssClass: 'genre-hexagon size-medium' },
    { id: 'ciencia-ficcion', name: 'Ciencia Ficción', cssClass: 'genre-hexagon size-medium' },
    { id: 'fantasia', name: 'Fantasía', cssClass: 'genre-hexagon size-medium' },
    { id: 'aventura', name: 'Aventura', cssClass: 'genre-hexagon size-medium shape-wide' }, // Un poco más ancho?
    { id: 'accion', name: 'Acción', cssClass: 'genre-heptagon size-large' }, // Forma especial grande
    { id: 'terror', name: 'Terror', cssClass: 'genre-hexagon size-small' }, // Hexágono pequeño
    { id: 'drama', name: 'Drama', cssClass: 'genre-tall-hexagon size-medium' } // Forma especial mediana/alta
  ];

  constructor(private router: Router) {} // Inyecta Router si lo necesitas

  selectGenre(genre: Genre): void {
    console.log('Género seleccionado:', genre.name);
    // Lógica futura para navegar a la vista de ese género:
    this.router.navigate(['/genre', genre.id]);
  }
}


export class LoginComponent {}
