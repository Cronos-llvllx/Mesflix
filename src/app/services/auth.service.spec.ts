import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; // Importar HttpClient
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { FavoritesService } from './favorites.service';
import { environment } from '../../environments/environment';
import { UserLoginPayload } from '../interface/user-login-payload.interface';
import { UserRegisterPayload } from '../interface/user-register-payload.interface';
import { AuthResponse } from '../interface/auth-response.interface';
import { RegisterResponse } from '../interface/register-response.interface';

// Mocks
    class MockRouter {
    navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
    }

    class MockFavoritesService {
    clearLocalFavorites = jasmine.createSpy('clearLocalFavorites');
    }

    describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let mockRouterInstance: MockRouter;
    let mockFavoritesServiceInstance: MockFavoritesService;
    const mockApiUrl = 'http://test-api.com/api';
    const tokenKey = 'mesflix-auth-token';

    let originalApiUrl: string;

    beforeEach(() => {
        originalApiUrl = environment.apiUrl;
        (environment as any).apiUrl = mockApiUrl;

        let store: { [key: string]: string } = {};
        const mockLocalStorage = {
        getItem: (key: string): string | null => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
        };
        spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
        spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);

        TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
            AuthService,
            { provide: Router, useClass: MockRouter },
            { provide: FavoritesService, useClass: MockFavoritesService }
        ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        mockRouterInstance = TestBed.inject(Router) as unknown as MockRouter;
        mockFavoritesServiceInstance = TestBed.inject(FavoritesService) as unknown as MockFavoritesService;

        store = {}; // Limpiar el store para cada prueba
    });

    afterEach(() => {
        (environment as any).apiUrl = originalApiUrl;
        httpMock.verify();
    });

    it('debería ser creado', () => {
        expect(service).toBeTruthy();
    });

    describe('Constructor e isUserLoggedIn$', () => {
        it('isUserLoggedIn$ debería emitir false inicialmente si no hay token', (done) => {
        // El servicio se crea en beforeEach con localStorage vacío
        service.isUserLoggedIn$.subscribe(status => {
            expect(status).toBeFalse();
            done();
        });
        });

        it('isUserLoggedIn$ debería emitir true inicialmente si hay un token', (done) => {
        localStorage.setItem(tokenKey, 'test-token');
        // Recrear el servicio para que el constructor lea el localStorage actualizado
        const httpClientInstance = TestBed.inject(HttpClient); // Obtener HttpClient
        // CORRECCIÓN: Usar 'as any' para los mocks al instanciar directamente
        const newServiceInstance = new AuthService(
            httpClientInstance,
            mockRouterInstance as any, // Cast a any para satisfacer el constructor
            mockFavoritesServiceInstance as any // Cast a any
        );
        newServiceInstance.isUserLoggedIn$.subscribe(status => {
            expect(status).toBeTrue();
            done();
        });
        });
    });

    describe('register', () => {
        const registerPayload: UserRegisterPayload = { email: 'test@test.com', password: 'password', firstName: 'Test', lastName: 'User', dateOfBirth: '2000-01-01' };
        // CORRECCIÓN: Añadir userId a mockRegisterResponse para que coincida con la interfaz
        const mockRegisterResponse: RegisterResponse = { message: 'Registrado!', userId: 123 };

        it('debería registrar un usuario y devolver la respuesta', () => {
        service.register(registerPayload).subscribe(response => {
            expect(response).toEqual(mockRegisterResponse);
        });
        const req = httpMock.expectOne(`${mockApiUrl}/auth/register`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(registerPayload);
        req.flush(mockRegisterResponse);
        });

        it('debería manejar errores durante el registro usando handleError', () => {
        const errorMsg = 'Error de registro';
        service.register(registerPayload).subscribe({
            next: () => fail('debería haber fallado'),
            error: (err: Error) => expect(err.message).toContain(errorMsg) // O el mensaje formateado por handleError
        });
        const req = httpMock.expectOne(`${mockApiUrl}/auth/register`);
        req.flush({ message: errorMsg }, { status: 400, statusText: 'Bad Request' });
        });
    });

    describe('login', () => {
        const loginPayload: UserLoginPayload = { email: 'test@test.com', password: 'password' };
        let req: TestRequest; // Declarar req aquí para que esté en el scope del subscribe

        it('debería loguear al usuario, guardar el token y emitir true en isUserLoggedIn$', (done) => {
        const mockAuthResponse: AuthResponse = { token: 'fake-token', userId: 1, username: 'test', email: 'test@test.com' };
        let loggedInStatus = false;
        const sub = service.isUserLoggedIn$.subscribe(status => {
            loggedInStatus = status;
            // Verificar el estado después de que la petición HTTP (simulada) haya completado
            if (status === true && req && req.request.method === 'POST' && !req.cancelled) {
            sub.unsubscribe();
            done();
            }
        });

        service.login(loginPayload).subscribe(response => {
            expect(response).toEqual(mockAuthResponse);
            expect(localStorage.setItem).toHaveBeenCalledWith(tokenKey, 'fake-token');
        });

        req = httpMock.expectOne(`${mockApiUrl}/auth/login`); // Asignar a la variable req
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(loginPayload);
        req.flush(mockAuthResponse);

        // Si done() no se llama desde el subscribe, la prueba fallará por timeout.
        // Esto asegura que esperamos la emisión del BehaviorSubject.
        });

        it('NO debería guardar el token si la respuesta no tiene token', () => {
        // CORRECCIÓN: Eliminar 'message' si AuthResponse no lo tiene.
        // El tipo Omit<AuthResponse, 'token'> asegura que 'token' no esté.
        // Las otras propiedades de AuthResponse (userId, username, email) deben estar.
        const mockAuthResponseNoToken: Omit<AuthResponse, 'token'> = {
            userId: 1, username: 'test', email: 'test@test.com'
            // No 'message' property si AuthResponse no la define
        };
        service.login(loginPayload).subscribe(response => {
            // El servicio espera AuthResponse, pero el mock no tiene token.
            // La aserción verifica que el objeto recibido sea el que se simuló.
            expect(response).toEqual(mockAuthResponseNoToken as AuthResponse);
        });
        const req = httpMock.expectOne(`${mockApiUrl}/auth/login`);
        req.flush(mockAuthResponseNoToken); // Flushear el objeto sin token
        expect(localStorage.setItem).not.toHaveBeenCalledWith(tokenKey, jasmine.anything());
        });

        it('NO debería guardar el token si la respuesta es nula', () => {
        service.login(loginPayload).subscribe(response => {
            expect(response).toBeNull();
        });
        const req = httpMock.expectOne(`${mockApiUrl}/auth/login`);
        req.flush(null);
        expect(localStorage.setItem).not.toHaveBeenCalledWith(tokenKey, jasmine.anything());
        });

        it('debería manejar errores durante el login usando handleError', () => {
        const errorMsg = 'Credenciales inválidas';
        service.login(loginPayload).subscribe({
            next: () => fail('debería haber fallado'),
            error: (err: Error) => expect(err.message).toContain(errorMsg)
        });
        const req = httpMock.expectOne(`${mockApiUrl}/auth/login`);
        req.flush({ message: errorMsg }, { status: 401, statusText: 'Unauthorized' });
        });
    });

    describe('logout', () => {
        it('debería remover el token, actualizar loggedInStatus, limpiar favoritos y navegar a login', (done) => {
        localStorage.setItem(tokenKey, 'test-token');
        // @ts-ignore: Accediendo a propiedad privada para la prueba
        service.loggedInStatus.next(true);

        let loggedInStatusAfterLogout = true;
        const sub = service.isUserLoggedIn$.subscribe(status => {
            loggedInStatusAfterLogout = status;
            if (status === false) {
            sub.unsubscribe();
            done();
            }
        });

        service.logout();

        expect(localStorage.removeItem).toHaveBeenCalledWith(tokenKey);
        expect(mockFavoritesServiceInstance.clearLocalFavorites).toHaveBeenCalled();
        expect(mockRouterInstance.navigate).toHaveBeenCalledWith(['/auth/login']);
        });
    });

    describe('storeToken', () => {
        it('debería guardar el token en localStorage y emitir true en isUserLoggedIn$', (done) => {
        const testToken = 'new-test-token';
        let loggedInStatus = false;
        const sub = service.isUserLoggedIn$.subscribe(status => {
            loggedInStatus = status;
            if (status === true) {
            sub.unsubscribe();
            done();
            }
        });

        service.storeToken(testToken);

        expect(localStorage.setItem).toHaveBeenCalledWith(tokenKey, testToken);
        });
    });

    describe('getToken', () => {
        it('debería devolver el token de localStorage si existe', () => {
        localStorage.setItem(tokenKey, 'my-token');
        expect(service.getToken()).toBe('my-token');
        });

        it('debería devolver null si no hay token en localStorage', () => {
        expect(service.getToken()).toBeNull();
        });
    });

    describe('isLoggedIn (y hasToken)', () => {
        it('debería devolver true si hay un token', () => {
        localStorage.setItem(tokenKey, 'my-token');
        expect(service.isLoggedIn()).toBeTrue();
        });

        it('debería devolver false si no hay token', () => {
        localStorage.removeItem(tokenKey);
        expect(service.isLoggedIn()).toBeFalse();
        });
    });

    describe('handleError', () => {
        const testUrl = `${mockApiUrl}/test-error`;

        function makeRequestToTriggerError() {
        return (service as any)['http'].get(testUrl).pipe(catchError((err: HttpErrorResponse) => (service as any)['handleError'](err)));
        }

        it('debería manejar ErrorEvent (error de cliente/red)', (done) => {
        const errorEvent = new ErrorEvent('Network error', { message: 'Conexión perdida' });
        makeRequestToTriggerError().subscribe({
            error: (err: Error) => {
            expect(err.message).toBe('Error de cliente o red: Conexión perdida');
            done();
            }
        });
        const req = httpMock.expectOne(testUrl);
        req.error(errorEvent);
        });

        it('debería manejar error con status 0 (sin conexión)', (done) => {
        makeRequestToTriggerError().subscribe({
            error: (err: Error) => {
            expect(err.message).toBe('No se pudo conectar con el servidor. Verifica tu conexión o el estado del servidor.');
            done();
            }
        });
        const req = httpMock.expectOne(testUrl);
        req.flush(null, { status: 0, statusText: 'Unknown Error' });
        });

        it('debería manejar error.error como string', (done) => {
        const errorBodyString = 'Error directo del backend como string';
        makeRequestToTriggerError().subscribe({
            error: (err: Error) => {
            expect(err.message).toBe(errorBodyString);
            done();
            }
        });
        const req = httpMock.expectOne(testUrl);
        req.flush(errorBodyString, { status: 400, statusText: 'Bad Request' });
        });

        it('debería manejar error.error.message', (done) => {
        const errorBodyWithMessage = { message: 'Mensaje de error específico del backend' };
        makeRequestToTriggerError().subscribe({
            error: (err: Error) => {
            expect(err.message).toBe(errorBodyWithMessage.message);
            done();
            }
        });
        const req = httpMock.expectOne(testUrl);
        req.flush(errorBodyWithMessage, { status: 400, statusText: 'Bad Request' });
        });

        it('debería manejar error.error.errors (ModelState) con múltiples errores', (done) => {
        const modelStateErrors = { errors: { field1: ['Error A'], field2: ['Error B1', 'Error B2'] } };
        const expectedMsg = 'Error A\nError B1 Error B2';
        makeRequestToTriggerError().subscribe({
            error: (err: Error) => {
            expect(err.message).toBe(expectedMsg);
            done();
            }
        });
        const req = httpMock.expectOne(testUrl);
        req.flush(modelStateErrors, { status: 400, statusText: 'Bad Request' });
        });

        it('debería manejar error.error.errors (ModelState) cuando modelStateErrors está vacío y usar statusText', (done) => {
        const modelStateNoActualErrors = { errors: { field1: [] } };
        makeRequestToTriggerError().subscribe({
            error: (err: Error) => {
            expect(err.message).toBe('Error 400: Bad Request');
            done();
            }
        });
        const req = httpMock.expectOne(testUrl);
        req.flush(modelStateNoActualErrors, { status: 400, statusText: 'Bad Request' });
        });

        it('debería manejar error.error.errors (ModelState) cuando errors[key] no es array', (done) => {
        const modelStateNotArray = { errors: { field1: 'Not an array' } };
        makeRequestToTriggerError().subscribe({
            error: (err: Error) => {
            expect(err.message).toBe('Error 400: Bad Request');
            done();
            }
        });
        const req = httpMock.expectOne(testUrl);
        req.flush(modelStateNotArray, { status: 400, statusText: 'Bad Request' });
        });

        it('debería manejar error.message si error.error es falsy', (done) => {
        const statusTextForTest = 'Server Error (for error.message test)';
        makeRequestToTriggerError().subscribe({
            error: (err: Error) => {
            expect(err.message).toBe(`Http failure response for ${testUrl}: 500 ${statusTextForTest}`);
            done();
            }
        });
        const req = httpMock.expectOne(testUrl);
        req.flush(null, { status: 500, statusText: statusTextForTest });
        });

        it('debería usar statusText si error.error es un objeto vacío y error.message es genérico', (done) => {
        const statusTextForGeneric = 'Specific Server Issue';
        makeRequestToTriggerError().subscribe({
            error: (err: Error) => {
            expect(err.message).toBe(`Error 500: ${statusTextForGeneric || 'Respuesta inesperada del servidor'}`);
            done();
            }
        });
        const req = httpMock.expectOne(testUrl);
        req.flush({}, { status: 500, statusText: statusTextForGeneric });
        });

        it('debería usar mensaje genérico "Respuesta inesperada del servidor" si statusText no está y error.error es objeto vacío', (done) => {
            makeRequestToTriggerError().subscribe({
                error: (err: Error) => {
                expect(err.message).toBe('Error 400: Respuesta inesperada del servidor');
                done();
                }
            });
            const req = httpMock.expectOne(testUrl);
            req.flush({}, { status: 400, statusText: undefined });
        });

        it('debería usar el mensaje de "Error en la comunicación" como último recurso (error.error es null, statusText es undefined)', (done) => {
            makeRequestToTriggerError().subscribe({
                error: (err: Error) => {
                    expect(err.message).toBe('Error HTTP 400: Error en la comunicación con el servidor');
                    done();
                }
            });
            const req = httpMock.expectOne(testUrl);
            req.flush(null, { status: 400, statusText: undefined });
        });
    });
    });