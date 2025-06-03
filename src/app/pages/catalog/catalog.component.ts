import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Genre } from '../../interface/genre';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  allGenres: Genre[] = []; // Todos los géneros cargados
  displayedGenres: Genre[] = []; // Géneros actualmente visibles (3x3 = 9)
  isLoadingGenres: boolean = true;

  currentPage: number = 0;
  itemsPerPage: number = 9; // 3 filas x 3 géneros por fila
  totalPages: number = 0;

  constructor(
    private router: Router,
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    this.isLoadingGenres = true;
    this.tmdbService.getGenres().subscribe({ //
      next: (loadedGenres) => {
        this.allGenres = loadedGenres.map(genre => ({
          ...genre
          // Ya no necesitamos cssClass para la forma aquí
        }));
        this.totalPages = Math.ceil(this.allGenres.length / this.itemsPerPage);
        this.updateDisplayedGenres();
        this.isLoadingGenres = false;
        console.log('Géneros cargados desde TMDB:', this.allGenres);
      },
      error: (err) => {
        console.error('Error al cargar géneros desde TMDB:', err);
        this.isLoadingGenres = false;
      }
    });
  }

  updateDisplayedGenres(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedGenres = this.allGenres.slice(startIndex, endIndex);
    // Aquí podrías añadir lógica para la animación si los géneros cambian
  }

  previousGenres(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedGenres();
    }
  }

  nextGenres(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateDisplayedGenres();
    }
  }

  selectGenre(genre: Genre): void {
    console.log('Género seleccionado:', genre.name, 'ID:', genre.id);
    this.router.navigate(['/genre', genre.id.toString()]);
  }
}