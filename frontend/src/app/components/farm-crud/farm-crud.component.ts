import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FarmService } from '../../services/farm.service';
import { AuthService } from '../../services/auth.service';
import { ExternalService } from '../../services/external.service';
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

  // Estado para edición
  isEditing = false;
  editFarmId: string | null = null;

  // Estado y variable para el clima
  weather: any = {};
  loadingWeather: boolean = false;

  constructor(
    private farmService: FarmService,
    private authService: AuthService,
    private router: Router,
    private externalService: ExternalService
  ) {}

  ngOnInit(): void {
    this.loadUserFarm(); // Cargar la finca del usuario al iniciar el componente
  }

  // Método para cargar la finca del usuario
  loadUserFarm(): void {
    this.farmService.getFarms().subscribe({
      next: (response: any) => {
        console.log('Finca del usuario cargada:', response);
        if (response.data) {
          this.farms = response.data;
          // Obtener clima para cada finca cargada
          this.farms.forEach(farm => this.getWeatherForFarm(farm));
        }
      },
      error: (error) => {
        console.error('Error al cargar la finca del usuario:', error);
      },
    });
  }

  // Método para editar una finca
  editFarm(farm: any): void {
    this.isEditing = true;
    this.editFarmId = farm._id || farm.id;
    this.farm = {
      name: farm.name,
      location: farm.location,
      size: farm.size,
      crops: Array.isArray(farm.crops) ? farm.crops.join(', ') : farm.crops || '',
    };
  }

  // Guardar cambios de edición o crear nueva finca
  onSubmit(): void {
    this.isLoading = true;
    const farmData = {
      ...this.farm,
      crops: this.farm.crops.split(',').map((crop) => crop.trim()),
    };
    if (this.isEditing && this.editFarmId) {
      this.farmService.updateFarm(this.editFarmId, farmData).subscribe({
        next: (response) => {
          // Actualizar la finca en la lista
          const idx = this.farms.findIndex(f => (f._id || f.id) === this.editFarmId);
          if (idx !== -1) {
            this.farms[idx] = { ...response.data };
          }
          this.resetForm();
          Swal.fire('Éxito', 'Finca actualizada exitosamente.', 'success');
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire('Error', 'Ocurrió un error al actualizar la finca. Inténtalo de nuevo.', 'error');
        }
      });
    } else {
      this.farmService.createFarm(farmData).subscribe({
        next: (response) => {
          this.farms.push(response.data);
          this.resetForm();
          Swal.fire('Éxito', 'Finca creada exitosamente.', 'success');
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire('Error', 'Ocurrió un error al crear la finca. Inténtalo de nuevo.', 'error');
        }
      });
    }
  }

  // Cancelar edición
  cancelEdit(): void {
    this.resetForm();
  }

  // Limpiar formulario y estado de edición
  private resetForm() {
    this.farm = { name: '', location: '', size: 0, crops: '' };
    this.isEditing = false;
    this.editFarmId = null;
    this.isLoading = false;
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

  // Obtener clima para una finca
  getWeatherForFarm(farm: any) {
    if (!farm.location) return;
    this.loadingWeather = true;
    this.externalService.getWeather(farm.location).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data && res.data.weather) {
          this.weather[farm._id || farm.id] = res.data;
        } else {
          this.weather[farm._id || farm.id] = { error: 'No se pudo obtener el clima para esta ubicación.' };
        }
        this.loadingWeather = false;
      },
      error: (err) => {
        let msg = 'No se pudo obtener el clima.';
        if (err.error && err.error.apiError) {
          if (typeof err.error.apiError === 'string') {
            msg = err.error.apiError;
          } else if (err.error.apiError.message) {
            msg = err.error.apiError.message;
          } else if (err.error.apiError.cod && err.error.apiError.message) {
            msg = `${err.error.apiError.cod}: ${err.error.apiError.message}`;
          } else {
            msg = JSON.stringify(err.error.apiError);
          }
        } else if (err.error && err.error.message) {
          msg = err.error.message;
        }
        this.weather[farm._id || farm.id] = { error: msg };
        this.loadingWeather = false;
      }
    });
  }
}