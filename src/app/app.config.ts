// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importa HTTP_INTERCEPTORS
import { AuthInterceptor } from './auth.interceptor'; // Ajusta la ruta a tu interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Mantenemos esto para permitir interceptores basados en DI

    // Aquí proveemos nuestro interceptor de clase
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // 'multi: true' porque puede haber múltiples interceptores
    }
  ]
};
