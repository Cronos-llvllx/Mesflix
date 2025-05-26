import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { DataTestService } from './data-test.service';
import { environment } from '../../environments/environment';

describe('DataTestService', () => {
  let service: DataTestService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://test-api.com/api'; // Simula environment.apiUrl

  // Guardar valor original de apiUrl
  let originalApiUrl: string;

  beforeEach(() => {
    originalApiUrl = environment.apiUrl;
    (environment as any).apiUrl = mockApiUrl; // Mockear para la prueba

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataTestService]
    });
    service = TestBed.inject(DataTestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    (environment as any).apiUrl = originalApiUrl; // Restaurar
    httpMock.verify(); // Verifica que no haya peticiones pendientes
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('getPublicData', () => {
    const publicDataUrl = `${mockApiUrl}/testdata/public`;

    it('debería obtener datos públicos y devolverlos', () => {
      const mockPublicData = { message: 'Estos son datos públicos' };

      service.getPublicData().subscribe(data => {
        expect(data).toEqual(mockPublicData);
      });

      const req = httpMock.expectOne(publicDataUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPublicData); // Simula una respuesta exitosa
    });

    it('debería manejar errores HTTP al obtener datos públicos', () => {
      const errorMessage = 'Error al obtener datos públicos';
      const mockError = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
        error: { message: errorMessage }
      });

      service.getPublicData().subscribe({
        next: () => fail('debería haber fallado con un error HTTP'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(publicDataUrl);
      req.flush({ message: errorMessage }, mockError); // Simula una respuesta de error
    });
  });

  describe('getProtectedData', () => {
    const protectedDataUrl = `${mockApiUrl}/testdata/protected`;

    it('debería obtener datos protegidos y devolverlos', () => {
      const mockProtectedData = { message: 'Estos son datos protegidos, ¡acceso concedido!' };

      service.getProtectedData().subscribe(data => {
        expect(data).toEqual(mockProtectedData);
      });

      const req = httpMock.expectOne(protectedDataUrl);
      expect(req.request.method).toBe('GET');
      // En una prueba más completa del interceptor, verificaríamos aquí la cabecera Authorization.
      // Para la prueba unitaria del servicio, solo verificamos que la petición se haga.
      req.flush(mockProtectedData);
    });

    it('debería manejar errores HTTP al obtener datos protegidos (ej. 401 No Autorizado)', () => {
      const errorMessage = 'No autorizado';
      const mockError = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        error: { message: errorMessage }
      });

      service.getProtectedData().subscribe({
        next: () => fail('debería haber fallado con un error 401'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
          // El cuerpo del error puede variar, así que podríamos ser más flexibles
          // o esperar la estructura exacta que devuelve tu backend.
          if (error.error && typeof error.error === 'object' && 'message' in error.error) {
            expect((error.error as any).message).toBe(errorMessage);
          } else {
            expect(error.statusText).toBe('Unauthorized');
          }
        }
      });

      const req = httpMock.expectOne(protectedDataUrl);
      req.flush({ message: errorMessage }, mockError); // Simula una respuesta de error 401
    });
  });
});