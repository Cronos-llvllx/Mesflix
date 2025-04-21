import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Servicio disponible globalmente
})
export class LayoutService {
  // BehaviorSubjects para mantener el estado actual y emitirlo
  // Inicialmente, asumimos que no se muestran hasta que sepamos la ruta
  private _showNavbar = new BehaviorSubject<boolean>(false);
  private _showFooter = new BehaviorSubject<boolean>(false);

  // Observables públicos para que los componentes se suscriban
  public showNavbar$ = this._showNavbar.asObservable();
  public showFooter$ = this._showFooter.asObservable();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd), // Escuchar solo al final de la navegación
      map(() => {
        // Navegar hasta la ruta hija más profunda activada
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'), // Considerar solo el router-outlet principal
      mergeMap(route => route.data) // Obtener el objeto 'data' de la ruta activa
    ).subscribe(data => {
      // Actualizar los BehaviorSubjects basado en los datos de la ruta
      // Si data['showNavbar'] no está definido, por defecto no se muestra (o como definas)
      this._showNavbar.next(data?.['showNavbar'] ?? false);
      // Si data['showFooter'] no está definido, por defecto no se muestra (o como definas)
      this._showFooter.next(data?.['showFooter'] ?? false);
    });
  }
}
