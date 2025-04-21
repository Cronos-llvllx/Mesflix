import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../interface/user-profile';
import { Router } from '@angular/router'; // Si quieres navegar después

@Component({
  selector: 'app-user-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-selection.component.html',
  styleUrl: './user-selection.component.scss'
})
  export class UserSelectionComponent {
    // 2. Declara e inicializa el array de perfiles (¡Simulado!)
    profiles: UserProfile[] = [
      { id: 1, name: 'Usuario Principal', imageUrl: 'UserProfile1.jpg' }, // Asegúrate que las rutas a las imágenes sean correctas
      { id: 2, name: 'Niños', imageUrl: 'AddProfile.jpg' },
      { id: 'guest', name: 'Invitado', imageUrl: 'Guest.jpg' }
      // Puedes añadir más perfiles aquí
    ];
    // Inyecta Router si vas a navegar después de seleccionar/crear
    constructor(private router: Router) {}
  // Usamos la interfaz importada para tipar el parámetro
  selectProfile(profile: UserProfile): void {
    console.log('Perfil seleccionado:', profile.name, ' (ID:', profile.id, ')');
    // Ejemplo: sessionStorage.setItem('selectedProfileId', profile.id.toString());
    this.router.navigate(['/catalog']);
  }
  createProfile(): void {
    console.log('Intentando crear un nuevo perfil...');
    // this.router.navigate(['/create-profile']);
    }
  }
