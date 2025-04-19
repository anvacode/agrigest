import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-farm-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './farm-crud.component.html',
  styleUrls: ['./farm-crud.component.scss'],
})
export class FarmCrudComponent implements OnInit {
  // Modelo para la finca
  farm = {
    name: '',
    location: '',
    size: 0,
    crops: '',
  };

  // Lista de fincas (inicialmente vacía)
  farms: any[] = [];

  // Variable para manejar el estado de carga
  isLoading = false;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserFarm(); // Cargar la finca del usuario al iniciar el componente
  }

  // Método para cargar la finca del usuario
  loadUserFarm(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No se encontró el token de autenticación.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get('http://localhost:5000/api/user-farm', { headers }).subscribe({
      next: (response: any) => {
        console.log('Finca del usuario cargada:', response);
        if (response) {
          this.farms.push(response); // Añadir la finca del usuario a la tabla
        }
      },
      error: (error) => {
        console.error('Error al cargar la finca del usuario:', error);
      },
    });
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit(): void {
    this.isLoading = true; // Mostrar indicador de carga
    const farmData = {
      ...this.farm,
      crops: this.farm.crops.split(',').map((crop) => crop.trim()),
    };

    const token = this.authService.getToken();
    if (!token) {
      Swal.fire('Error', 'No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.', 'error');
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post('http://localhost:5000/api/farms', farmData, { headers }).subscribe({
      next: (response: any) => {
        this.farms.push({
          id: response.id || this.farms.length + 1,
          name: farmData.name,
          location: farmData.location,
          size: farmData.size,
          crops: farmData.crops.join(', '),
        });

        // Limpiar el formulario
        this.farm = {
          name: '',
          location: '',
          size: 0,
          crops: '',
        };

        this.isLoading = false;

        // Mostrar mensaje de éxito
        Swal.fire('Éxito', 'Finca creada exitosamente.', 'success');
      },
      error: (error) => {
        console.error('Error al crear la finca:', error);
        this.isLoading = false;
        Swal.fire('Error', 'Ocurrió un error al crear la finca. Inténtalo de nuevo.', 'error');
      },
    });
  }

  // Método para editar una finca
  editFarm(farm: any): void {
    console.log('Editar finca:', farm);
  }

  // Método para eliminar una finca
  deleteFarm(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.farms = this.farms.filter((farm) => farm.id !== id);
        Swal.fire('Eliminado', 'La finca ha sido eliminada.', 'success');
      }
    });
  }
}