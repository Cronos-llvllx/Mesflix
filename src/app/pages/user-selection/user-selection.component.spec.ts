import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

import { UserSelectionComponent } from './user-selection.component';
import { DataTestService } from '../../services/data-test.service'; // Asegúrate que la ruta sea correcta
import { UserProfile } from '../../interface/user-profile';

// --- Mock de Servicios ---
class MockRouter {
  navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
}

class MockDataTestService {
  getPublicData = jasmine.createSpy('getPublicData').and.returnValue(of({ message: 'Public data success' }));
  getProtectedData = jasmine.createSpy('getProtectedData').and.returnValue(of({ message: 'Protected data success' }));

  // Métodos para simular respuestas específicas en las pruebas
  setGetPublicDataResponse(response: any) {
    this.getPublicData.and.returnValue(of(response));
  }
  setGetPublicDataError(error: any) {
    this.getPublicData.and.returnValue(throwError(() => error));
  }
  setGetProtectedDataResponse(response: any) {
    this.getProtectedData.and.returnValue(of(response));
  }
  setGetProtectedDataError(error: any) {
    this.getProtectedData.and.returnValue(throwError(() => error));
  }
}

describe('UserSelectionComponent', () => {
  let component: UserSelectionComponent;
  let fixture: ComponentFixture<UserSelectionComponent>;
  let mockRouter: MockRouter;
  let mockDataTestService: MockDataTestService;

  const testProfile: UserProfile = { id: 1, name: 'Test User', imageUrl: 'test.jpg' };

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockDataTestService = new MockDataTestService();

    await TestBed.configureTestingModule({
      imports: [UserSelectionComponent, CommonModule], // UserSelectionComponent es standalone
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: DataTestService, useValue: mockDataTestService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSelectionComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // Llamar en cada prueba o después de la configuración si ngOnInit es simple
  });

  it('debería crear el componente', () => {
    fixture.detectChanges(); // Para ngOnInit si es necesario
    expect(component).toBeTruthy();
  });

  it('debería tener una lista de perfiles predefinida', () => {
    fixture.detectChanges();
    expect(component.profiles.length).toBeGreaterThan(0);
    expect(component.profiles[0].name).toEqual('Usuario Principal');
  });

  describe('ngOnInit', () => {
    it('no debería llamar a fetchTestData por defecto', () => {
      spyOn(component, 'fetchTestData');
      fixture.detectChanges(); // Llama ngOnInit
      expect(component.fetchTestData).not.toHaveBeenCalled();
    });
  });

  describe('selectProfile', () => {
    it('debería registrar el perfil seleccionado y navegar a /catalog', () => {
      spyOn(console, 'log');
      component.selectProfile(testProfile);

      expect(console.log).toHaveBeenCalledWith('Perfil seleccionado:', testProfile.name, ' (ID:', testProfile.id, ')');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/catalog']);
    });
  });

  describe('createProfile', () => {
    it('debería registrar un mensaje de intento de creación de perfil', () => {
      spyOn(console, 'log');
      component.createProfile();
      expect(console.log).toHaveBeenCalledWith('Intentando crear un nuevo perfil...');
      // Si la navegación estuviera activa, se probaría aquí:
      // expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-profile']);
    });
  });

  describe('fetchTestData', () => {
    beforeEach(() => {
      // Resetea los spies antes de cada prueba en este describe anidado
      mockDataTestService.getPublicData.calls.reset();
      mockDataTestService.getProtectedData.calls.reset();
      spyOn(console, 'log');
      spyOn(console, 'error');
    });

    it('debería llamar a getPublicData y getProtectedData de DataTestService', fakeAsync(() => {
      component.fetchTestData();
      tick(); // Permite que los observables emitan

      expect(mockDataTestService.getPublicData).toHaveBeenCalled();
      expect(mockDataTestService.getProtectedData).toHaveBeenCalled();
    }));

    it('debería establecer publicDataResponse en éxito para getPublicData', fakeAsync(() => {
      const publicData = { message: 'Datos públicos recibidos!' };
      mockDataTestService.setGetPublicDataResponse(publicData);

      component.fetchTestData();
      tick();

      expect(component.publicDataResponse).toEqual(publicData);
      expect(console.log).toHaveBeenCalledWith('Respuesta Datos Públicos:', publicData);
      expect(component.errorMessage).toBeNull();
    }));

    it('debería establecer errorMessage en error para getPublicData', fakeAsync(() => {
      const errorResponse = { status: 500, statusText: 'Server Error' };
      mockDataTestService.setGetPublicDataError(errorResponse);

      component.fetchTestData();
      tick();

      expect(component.publicDataResponse).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error al obtener datos públicos:', errorResponse);
      expect(component.errorMessage).toBe(`Error al obtener datos públicos: ${errorResponse.statusText}`);
    }));

    it('debería establecer protectedDataResponse en éxito para getProtectedData', fakeAsync(() => {
      const protectedData = { message: 'Datos protegidos recibidos!' };
      mockDataTestService.setGetProtectedDataResponse(protectedData);

      component.fetchTestData();
      tick();

      expect(component.protectedDataResponse).toEqual(protectedData);
      expect(console.log).toHaveBeenCalledWith('Respuesta Datos Protegidos:', protectedData);
      // El errorMessage podría haber sido establecido por getPublicData si falló antes,
      // o ser null si ambas tuvieron éxito.
    }));

    it('debería establecer errorMessage en error para getProtectedData (error genérico)', fakeAsync(() => {
      const errorResponse = { status: 500, statusText: 'Server Error' };
      mockDataTestService.setGetProtectedDataError(errorResponse);

      component.fetchTestData();
      tick();

      expect(component.protectedDataResponse).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error al obtener datos protegidos:', errorResponse);
      expect(component.errorMessage).toBe(`Error al obtener datos protegidos: ${errorResponse.statusText}`);
    }));

    it('debería establecer un mensaje de error específico para 401 en getProtectedData', fakeAsync(() => {
      const errorResponse = { status: 401, statusText: 'Unauthorized' };
      mockDataTestService.setGetProtectedDataError(errorResponse);

      component.fetchTestData();
      tick();

      expect(component.protectedDataResponse).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error al obtener datos protegidos:', errorResponse);
      expect(component.errorMessage).toBe('Error 401: No autorizado para acceder a datos protegidos. Verifica que el token se esté enviando (interceptor) y sea válido.');
    }));

     it('debería usar "Error desconocido" si statusText no está presente en el error de getPublicData', fakeAsync(() => {
      const errorResponse = { status: 503 }; // Sin statusText
      mockDataTestService.setGetPublicDataError(errorResponse);

      component.fetchTestData();
      tick();

      expect(component.errorMessage).toBe(`Error al obtener datos públicos: Error desconocido`);
    }));

    it('debería usar "Error desconocido" si statusText no está presente en el error de getProtectedData (no 401)', fakeAsync(() => {
      const errorResponse = { status: 503 }; // Sin statusText
      mockDataTestService.setGetProtectedDataError(errorResponse);

      component.fetchTestData();
      tick();
      // El mensaje de error puede ser el de getPublicData si esa también falló.
      // Para aislar, podríamos hacer que getPublicData tenga éxito en esta prueba.
      mockDataTestService.setGetPublicDataResponse({message: "ok"});
      component.fetchTestData(); // Llamar de nuevo con getPublicData mockeado para éxito
      tick();

      expect(component.errorMessage).toBe(`Error al obtener datos protegidos: Error desconocido`);
    }));


    it('debería resetear las respuestas y el mensaje de error al inicio de fetchTestData', () => {
      // Establecer valores iniciales
      component.publicDataResponse = { oldPublic: 'data' };
      component.protectedDataResponse = { oldProtected: 'data' };
      component.errorMessage = 'Old error';

      component.fetchTestData(); // No necesitamos tick() aquí, solo probamos el reseteo síncrono

      expect(component.publicDataResponse).toBeNull();
      expect(component.protectedDataResponse).toBeNull();
      expect(component.errorMessage).toBeNull();
    });
  });
});