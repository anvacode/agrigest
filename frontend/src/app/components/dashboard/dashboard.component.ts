import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importar Router para redirección

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Datos mockeados para las fincas
  farms = [
    {
      id: '1',
      name: 'La Esperanza',
      location: 'Ocaña',
      size: 18,
      crops: ['Café', 'Plátano']
    },
    {
      id: '2',
      name: 'El Porvenir',
      location: 'Tibú',
      size: 25,
      crops: ['Cacao', 'Maíz']
    },
    {
      id: '3',
      name: 'San Isidro',
      location: 'Abrego',
      size: 12,
      crops: ['Yuca', 'Fríjol']
    }
  ];

  loading = false;
  errorMessage = '';

  constructor(private router: Router) {} // Inyectar Router

  // Calcula el área total
  calculateTotalArea(): number {
    return this.farms.reduce((total, farm) => total + farm.size, 0);
  }

  // Simula carga de datos
  loadFarms(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // Función para cerrar sesión
  logout(): void {
    // Eliminar el token de autenticación (si se usa localStorage o cookies)
    localStorage.removeItem('authToken');
    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);
  }
}