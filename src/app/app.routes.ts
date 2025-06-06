import { Routes } from '@angular/router';
// Importa los componentes STANDALONE que corresponden a una página/ruta completa
import { CatalogComponent } from './pages/catalog/catalog.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { UserSelectionComponent } from './pages/user-selection/user-selection.component';
import { ForYouComponent } from './pages/for-you/for-you.component';
import { SearchComponent } from './pages/search/search.component';
import { GenreMoviesComponent } from './pages/genre-movies/genre-movies.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  // Ruta principal para autenticación (maneja login y register internamente)
{
    path: 'auth', // Esta será la ruta base, ej. /auth/login, /auth/register
    loadChildren: () => import('./auth/auth.routes').then(mod => mod.AUTH_ROUTES)
    // Asegúrate que la ruta './auth/auth.routes' sea correcta
    // Esto cargará las rutas definidas en AUTH_ROUTES cuando se navegue a /auth/*
  },
  // Ruta para el catálogo de películas
  {
      path: 'catalog', // Cuando la URL sea tudominio.com/catalog
      component: CatalogComponent, // Carga CatalogComponent
      data: { showNavbar: true, showFooter: true },
      canActivate: [AuthGuard]

      // Más adelante aquí podrías añadir un "CanActivate" guard para proteger la ruta
  },
  // Ruta para los favoritos
  {
      path: 'favorites', // Cuando la URL sea tudominio.com/favorites
      component: FavoritesComponent ,// Carga FavoritesComponent
      data: { showNavbar: true, showFooter: true },
      canActivate: [AuthGuard]
  },
  {
    path: 'select-user', // Cuando la URL sea tudominio.com/favorites
    component: UserSelectionComponent ,// Carga FavoritesComponent
    data: { showNavbar: false, showFooter: true },
    canActivate: [AuthGuard]
    // También podrías proteger esta ruta
},
  {
    path: 'search',
    component: SearchComponent,
    data: { showNavbar: true, showFooter: true },
    canActivate: [AuthGuard]
   }, // Asumimos que Navbar/Footer se muestran aquí
  {
  path: 'for-you', // La ruta para "Para mi"
  component: ForYouComponent,
  data: { showNavbar: true, showFooter: true},
  canActivate: [AuthGuard]  // Asumimos que Navbar/Footer se muestran aquí},
  },
  {
    path: 'genre/:genreId',
    component: GenreMoviesComponent ,
    data: { showNavbar: true, showFooter: true },
    canActivate: [AuthGuard]

},
  // Ruta por defecto: Si el usuario entra a la raíz (tudominio.com)
  {
      path: '', // URL vacía
      redirectTo: '/auth', // Redirige a la página de autenticación
      pathMatch: 'full' // Importante: Solo redirige si la ruta está EXACTAMENTE vacía
  },
  // Ruta Wildcard (Comodín): Si el usuario introduce una URL que no existe
  {
      path: '**', // Cualquier otra ruta no definida arriba
      redirectTo: '/auth' // Redirige a la autenticación (o podrías crear un componente NotFoundComponent 404 y redirigir allí)
  }
];
