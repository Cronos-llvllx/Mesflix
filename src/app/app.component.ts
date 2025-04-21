import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common'; // Importa AsyncPipe
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component'; // Importa Navbar
import { LayoutService } from './services/layout.service'; // Importa el servicio

@Component({
  selector: 'app-root',
  standalone: true,
  // Añade NavbarComponent y AsyncPipe a imports
  imports: [ RouterOutlet, NavbarComponent, FooterComponent, AsyncPipe, CommonModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mesflix';
  // Inyecta el servicio y hazlo público para usarlo en la plantilla
  constructor(public layoutService: LayoutService) {}
}
