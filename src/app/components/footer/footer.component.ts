// src/app/components/footer/footer.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa RouterModule para routerLink y routerLinkActive

@Component({
  selector: 'app-footer', // Este es el selector que usaremos en AppComponent
  standalone: true,
  imports: [RouterModule], // Añade RouterModule a los imports
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'] // O .css
})
export class FooterComponent {
  currentYear = new Date().getFullYear(); // Obtiene el año actual
}
