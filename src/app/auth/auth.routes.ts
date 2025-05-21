import { Routes } from '@angular/router';
import { AuthComponent } from '../pages/auth/auth.component';     // Asegúrate de importar AuthComponent
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '', // El path vacío DENTRO del bloque lazy-loaded 'auth'
    component: AuthComponent, // AuthComponent actúa como el layout/contenedor
    children: [ // Rutas hijas que se renderizarán dentro del <router-outlet> de AuthComponent
      {
        path: 'login', // Se accederá como /auth/login
        component: LoginComponent
      },
      {
        path: 'register', // Se accederá como /auth/register
        component: RegisterComponent
      },
      {
        path: '', // Si solo navegan a /auth, redirige a login
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
