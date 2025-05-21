import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Ajusta la ruta

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = `${environment.apiUrl}/favorites`; // Ruta base para los favoritos en tu API

  // BehaviorSubject para mantener la lista de IDs de películas favoritas en el estado local
  private favoriteMovieIdsSubject = new BehaviorSubject<string[]>([]);
  favoriteMovieIds$ = this.favoriteMovieIdsSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  // Método para cargar los favoritos del backend y actualizar el BehaviorSubject
  // Este método debería llamarse DESPUÉS de que el usuario inicie sesión.
  loadUserFavorites(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl).pipe(
      tap(movieIds => {
        this.favoriteMovieIdsSubject.next(movieIds);
        console.log('Favoritos cargados del backend:', movieIds);
      }),
      catchError(this.handleError)
    );
  }

  // Obtiene los IDs de favoritos del estado local (BehaviorSubject)
  getCurrentFavoriteIds(): string[] {
    return this.favoriteMovieIdsSubject.getValue();
  }

  // Verifica si una película es favorita (basado en el estado local)
  isFavorite(movieId: string): boolean {
    return this.getCurrentFavoriteIds().includes(movieId.toString()); // Asegurar que movieId sea string
  }

  addFavorite(movieId: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { movieId }).pipe( // Envía un objeto { movieId: "valor" }
      tap(response => {
        console.log('Película añadida a favoritos (respuesta backend):', response);
        // Actualiza el estado local de favoritos
        const currentFavorites = this.getCurrentFavoriteIds();
        if (!currentFavorites.includes(movieId.toString())) {
          this.favoriteMovieIdsSubject.next([...currentFavorites, movieId.toString()]);
        }
      }),
      catchError(this.handleError)
    );
  }

  removeFavorite(movieId: string): Observable<any> {
    return this.http.delete<any>(`<span class="math-inline">\{this\.apiUrl\}/</span>{movieId}`).pipe(
      tap(response => {
        console.log('Película eliminada de favoritos (respuesta backend):', response);
        // Actualiza el estado local de favoritos
        const currentFavorites = this.getCurrentFavoriteIds();
        this.favoriteMovieIdsSubject.next(currentFavorites.filter(id => id !== movieId.toString()));
      }),
      catchError(this.handleError)
    );
  }

  // Limpia los favoritos locales (ej. al hacer logout)
  clearLocalFavorites(): void {
    this.favoriteMovieIdsSubject.next([]);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido en el servicio de favoritos.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor para favoritos.';
      } else if (error.error && error.error.message) {
        errorMessage = `Error ${error.status}: ${error.error.message}`;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText || 'Error del servidor en favoritos'}`;
      }
    }
    console.error('FavoritesService handleError:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
