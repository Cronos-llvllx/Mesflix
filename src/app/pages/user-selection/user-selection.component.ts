import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../interface/user-profile';
import { Router } from '@angular/router';
import { DataTestService } from '../../services/data-test.service';

@Component({
  selector: 'app-user-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss'] 
})
export class UserSelectionComponent implements OnInit { // Implementa OnInit
  // Propiedades para almacenar las respuestas y errores
  publicDataResponse: any;
  protectedDataResponse: any;
  errorMessage: string | null = null;

  profiles: UserProfile[] = [
    { id: 1, name: 'Usuario Principal', imageUrl: 'UserProfile1.jpg' },
    { id: 2, name: 'Niños', imageUrl: 'AddProfile.jpg' },
    { id: 'guest', name: 'Invitado', imageUrl: 'Guest.jpg' }
  ];

  constructor(
    private router: Router,
    private dataTestService: DataTestService // Inyecta el servicio
  ) {}

  ngOnInit(): void {
    // Puedes decidir si quieres llamar a fetchTestData() automáticamente al cargar
    // o solo a través de un botón. Para probar, un botón es más claro.
    // this.fetchTestData(); // Descomenta si quieres que se llame al inicio
  }

  selectProfile(profile: UserProfile): void {
    console.log('Perfil seleccionado:', profile.name, ' (ID:', profile.id, ')');
    this.router.navigate(['/catalog']);
  }

  createProfile(): void {
    console.log('Intentando crear un nuevo perfil...');
    // this.router.navigate(['/create-profile']);
  }

  // Nuevo método para llamar a los endpoints de prueba
  fetchTestData(): void {
    this.publicDataResponse = null; // Resetea respuestas anteriores
    this.protectedDataResponse = null;
    this.errorMessage = null;

    // 1. Probar el endpoint público
    this.dataTestService.getPublicData().subscribe({
      next: (data) => {
        console.log('Respuesta Datos Públicos:', data);
        this.publicDataResponse = data;
      },
      error: (err) => {
        console.error('Error al obtener datos públicos:', err);
        this.errorMessage = `Error al obtener datos públicos: ${err.statusText || 'Error desconocido'}`;
      }
    });

    // 2. Probar el endpoint protegido
    this.dataTestService.getProtectedData().subscribe({
      next: (data) => {
        console.log('Respuesta Datos Protegidos:', data);
        this.protectedDataResponse = data;
        // Si esta llamada es exitosa (200 OK) y en la pestaña Network ves la cabecera Authorization,
        // ¡tu interceptor está funcionando!
      },
      error: (err) => {
        console.error('Error al obtener datos protegidos:', err);
        if (err.status === 401) {
          this.errorMessage = 'Error 401: No autorizado para acceder a datos protegidos. Verifica que el token se esté enviando (interceptor) y sea válido.';
        } else {
          this.errorMessage = `Error al obtener datos protegidos: ${err.statusText || 'Error desconocido'}`;
        }
      }
    });
  }
}
