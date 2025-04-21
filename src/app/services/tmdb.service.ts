import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  // Definicion de las variables que se van a usar en el servicio
  // API key de TMDB
  private apiKey = environment.TMDB_API_KEY;
  private apiUrl = environment.TMDB_API_URL;
  private imgUrl = environment.TMDB_IMG_URL;
  private baseUrl = environment.TMDB_BASE_URL_ORIGINAL;
  //NACIMIENTO DE LA CLASE
  constructor(private http: HttpClient) { }

  getMovies(): Observable<any> {
    const url = `${this.baseUrl}movie/popular?api_key=${this.apiKey}&language-es-ES`;
    return this.http.get(url);
  }
}
