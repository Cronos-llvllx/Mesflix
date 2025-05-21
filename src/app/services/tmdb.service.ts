import { Injectable } from '@angular/core';
// HttpClient y HttpParams ya los tenías, HttpErrorResponse es el que faltaba
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // 'throwError' también es necesario para el handleError
import { catchError, map, tap } from 'rxjs/operators';
import { Movie } from '../interface/movie';
import { Genre } from '../interface/genre';
import { environment } from '../../environments/environment';

// Interfaz para la respuesta de la API de TMDB que contiene una lista de películas
interface TmdbMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Interfaz para la respuesta de la API de TMDB que contiene una lista de géneros
interface TmdbGenresResponse {
  genres: Genre[];
}

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
    private apiKey = environment.TMDB_API_KEY;
    private baseUrl = environment.TMDB_API_URL;
    private language = 'es-MX';

  public imageBaseUrl = 'https://image.tmdb.org/t/p/';

constructor(private http: HttpClient) {
    if (!this.apiKey) { // Una verificación más robusta
      console.error('API Key de TMDB no configurada en el archivo de entorno. Por favor, añade tu clave a src/environments/environment.ts');
    }
  }

  private getDefaultParams(): HttpParams {
    return new HttpParams()
      .set('api_key', this.apiKey) // Aquí se usa la clave del entorno
      .set('language', this.language); // 'language' lo tienes hardcodeado, podría ir al environment también
  }

  getPopularMovies(page: number = 1): Observable<Movie[]> {
    const params = this.getDefaultParams().set('page', page.toString());
    return this.http.get<TmdbMoviesResponse>(`${this.baseUrl}/movie/popular`, { params })
      .pipe(
        map(response => this.mapMoviesResponse(response.results)),
        catchError(this.handleError)
      );
  }

  getTopRatedMovies(page: number = 1): Observable<Movie[]> {
    const params = this.getDefaultParams().set('page', page.toString());
    return this.http.get<TmdbMoviesResponse>(`${this.baseUrl}/movie/top_rated`, { params })
      .pipe(
        map(response => this.mapMoviesResponse(response.results)),
        catchError(this.handleError)
      );
  }

  getUpcomingMovies(page: number = 1): Observable<Movie[]> {
    const params = this.getDefaultParams().set('page', page.toString());
    return this.http.get<TmdbMoviesResponse>(`${this.baseUrl}/movie/upcoming`, { params })
      .pipe(
        map(response => this.mapMoviesResponse(response.results)),
        catchError(this.handleError)
      );
  }

  getTrendingMovies(timeWindow: 'day' | 'week' = 'week', page: number = 1): Observable<Movie[]> {
    const params = this.getDefaultParams().set('page', page.toString());
    return this.http.get<TmdbMoviesResponse>(`${this.baseUrl}/trending/movie/${timeWindow}`, { params })
      .pipe(
        map(response => this.mapMoviesResponse(response.results)),
        catchError(this.handleError)
      );
  }

  getMoviesByGenre(genreId: string, page: number = 1): Observable<Movie[]> {
    const params = this.getDefaultParams()
      .set('with_genres', genreId)
      .set('page', page.toString());
    return this.http.get<TmdbMoviesResponse>(`${this.baseUrl}/discover/movie`, { params })
      .pipe(
        map(response => this.mapMoviesResponse(response.results)),
        catchError(this.handleError)
      );
  }

  getGenres(): Observable<Genre[]> {
    const params = this.getDefaultParams();
    return this.http.get<TmdbGenresResponse>(`${this.baseUrl}/genre/movie/list`, { params })
      .pipe(
        map(response => response.genres),
        catchError(this.handleError)
      );
  }

  searchMovies(query: string, page: number = 1): Observable<Movie[]> {
    const params = this.getDefaultParams()
      .set('query', query)
      .set('page', page.toString());
    return this.http.get<TmdbMoviesResponse>(`${this.baseUrl}/search/movie`, { params })
      .pipe(
        map(response => this.mapMoviesResponse(response.results)),
        catchError(this.handleError)
      );
  }

  getMovieDetails(movieId: string | number): Observable<Movie> {
    const params = this.getDefaultParams()
      .set('append_to_response', 'videos,credits,images,recommendations,similar,keywords');
    return this.http.get<Movie>(`${this.baseUrl}/movie/${movieId}`, { params })
      .pipe(
        map(movieData => this.mapSingleMovieResponse(movieData)),
        tap(movie => console.log(`Detalles obtenidos para la película ${movie.id}:`, movie)),
        catchError(this.handleError)
      );
  }

  private mapMoviesResponse(results: any[]): Movie[] {
    return results.map(movieApi => ({
      id: movieApi.id.toString(),
      title: movieApi.title,
      description: movieApi.overview,
      releaseDate: movieApi.release_date,
      posterPath: movieApi.poster_path ? `${this.imageBaseUrl}w500${movieApi.poster_path}` : 'assets/img/DefaultPlaceholder.png',
      backdropPath: movieApi.backdrop_path ? `${this.imageBaseUrl}original${movieApi.backdrop_path}` : null,
      voteAverage: movieApi.vote_average,
      genreIds: movieApi.genre_ids,
      isNew: false, // Puedes calcular esto
    }));
  }

  private mapSingleMovieResponse(movieApi: any): Movie {
    return {
      id: movieApi.id.toString(),
      title: movieApi.title,
      description: movieApi.overview,
      releaseDate: movieApi.release_date,
      posterPath: movieApi.poster_path ? `${this.imageBaseUrl}w500${movieApi.poster_path}` : 'assets/img/DefaultPlaceholder.png',
      backdropPath: movieApi.backdrop_path ? `${this.imageBaseUrl}original${movieApi.backdrop_path}` : null,
      voteAverage: movieApi.vote_average,
      genreIds: movieApi.genres ? movieApi.genres.map((g: any) => g.id) : [],
      genres: movieApi.genres,
      runtime: movieApi.runtime,
      isNew: false, // Puedes calcular esto
    };
  }

  // El método handleError que me pasaste, con HttpErrorResponse ahora importado
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido al contactar TMDB.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend devolvió un código de respuesta no exitoso.
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor de TMDB.';
      } else if (error.status === 401) {
        errorMessage = `Error ${error.status}: No autorizado. Verifica tu API Key de TMDB.`;
      } else if (error.status === 404) {
        errorMessage = `Error ${error.status}: Recurso no encontrado en TMDB.`;
      }
      else if (error.error && error.error.status_message) { // Para errores específicos de la API de TMDB
        errorMessage = `Error TMDB ${error.status}: ${error.error.status_message}`;
      }
      else {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }
    console.error('TmdbService handleError:', errorMessage, error);
    return throwError(() => new Error(errorMessage)); // Asegúrate que throwError esté importado de 'rxjs'
  }
}
