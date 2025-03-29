import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
}