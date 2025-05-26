import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

// Mock para AuthService
class MockAuthService {
  private token: string | null = null;
  private loggedIn: boolean = false;

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  setIsLoggedIn(status: boolean) {
    this.loggedIn = status;
  }
}

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let mockAuthService: MockAuthService;
  const testApiUrl = 'http://localhost:3000/api/test'; // URL de prueba para tu API
  const externalUrl = 'http://externalsite.com/api/data'; // URL de prueba externa

  // Guardar los valores originales del environment
  let originalApiUrl: string;

  beforeEach(() => {
    // Guardar valor original
    originalApiUrl = environment.apiUrl;
    // Mockear el valor para la prueba
    (environment as any).apiUrl = 'http://localhost:3000/api';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
  });

  afterEach(() => {
    // Restaurar valor original
    (environment as any).apiUrl = originalApiUrl;
    if (httpMock) {
        httpMock.verify();
    }
  });

  it('debería añadir la cabecera Authorization si el usuario está logueado, hay token y es una URL de la API', () => {
    const testToken = 'test-jwt-token';
    mockAuthService.setIsLoggedIn(true);
    mockAuthService.setToken(testToken);

    httpClient.get(testApiUrl).subscribe();
    const httpRequest = httpMock.expectOne(testApiUrl);

    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    httpRequest.flush({});
  });

  it('NO debería añadir la cabecera Authorization si el usuario NO está logueado', () => {
    mockAuthService.setIsLoggedIn(false);
    mockAuthService.setToken('some-token');

    httpClient.get(testApiUrl).subscribe();
    const httpRequest = httpMock.expectOne(testApiUrl);

    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
    httpRequest.flush({});
  });

  it('NO debería añadir la cabecera Authorization si NO hay token', () => {
    mockAuthService.setIsLoggedIn(true);
    mockAuthService.setToken(null);

    httpClient.get(testApiUrl).subscribe();
    const httpRequest = httpMock.expectOne(testApiUrl);

    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
    httpRequest.flush({});
  });

  it('NO debería añadir la cabecera Authorization si la URL NO es de la API', () => {
    const testToken = 'test-jwt-token';
    mockAuthService.setIsLoggedIn(true);
    mockAuthService.setToken(testToken);

    httpClient.get(externalUrl).subscribe();
    const httpRequest = httpMock.expectOne(externalUrl);

    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
    httpRequest.flush({});
  });

  it('NO debería añadir la cabecera si el usuario no está logueado AUNQUE la URL sea de la API y haya token', () => {
    const testToken = 'test-jwt-token';
    mockAuthService.setIsLoggedIn(false);
    mockAuthService.setToken(testToken);

    httpClient.get(testApiUrl).subscribe();
    const httpRequest = httpMock.expectOne(testApiUrl);

    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
    httpRequest.flush({});
  });

  it('debería pasar la petición sin modificar si todas las condiciones para añadir cabecera no se cumplen', () => {
    mockAuthService.setIsLoggedIn(false);
    mockAuthService.setToken(null);

    httpClient.get(externalUrl).subscribe();
    const httpRequest = httpMock.expectOne(externalUrl);
    const originalRequest = new HttpRequest('GET', externalUrl);

    expect(httpRequest.request.headers.keys().length).toEqual(originalRequest.headers.keys().length);
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
    httpRequest.flush({});
  });
});
