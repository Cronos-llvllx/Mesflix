import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Ajusta la ruta si es diferente

@Injectable({
  providedIn: 'root'
})
export class DataTestService {
  constructor(private http: HttpClient) { }

  getPublicData(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/testdata/public`);
  }

  getProtectedData(): Observable<any> {
    // Esta petición debería ser interceptada por tu AuthInterceptor
    // y se le debería añadir la cabecera Authorization si hay un token.
    return this.http.get<any>(`${environment.apiUrl}/testdata/protected`);
  }
}
