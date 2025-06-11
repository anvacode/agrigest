import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { FarmService } from '../../services/farm.service';
import { CultivoService } from '../../services/cultivo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-crud.component.html',
  styleUrls: ['./task-crud.component.scss'],
})
export class TaskCrudComponent implements OnInit {
  task = { title: '', description: '', date: '', status: 'pendiente', farm: '', cultivo: '' };
  tasks: any[] = [];
  farms: any[] = [];
  cultivos: any[] = [];
  // Cultivos filtrados según la finca seleccionada
  cultivosFiltrados: any[] = [];
  isEditing = false;
  editTaskId: string | null = null;

  constructor(
    private taskService: TaskService,
    private farmService: FarmService,
    private cultivoService: CultivoService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadFarms();
    this.loadCultivos();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (res) => (this.tasks = res.data),
      error: () => Swal.fire('Error', 'No se pudieron cargar las tareas', 'error'),
    });
  }

  loadFarms(): void {
    this.farmService.getFarms().subscribe({
      next: (res) => (this.farms = res.data || res),
      error: () => Swal.fire('Error', 'No se pudieron cargar las fincas', 'error'),
    });
  }

  loadCultivos(): void {
    this.cultivoService.obtenerCultivos().subscribe({
      next: (res) => {
        this.cultivos = res;
        this.filtrarCultivosPorFinca();
      },
      error: () => Swal.fire('Error', 'No se pudieron cargar los cultivos', 'error'),
    });
  }

  // Filtra los cultivos según la finca seleccionada
  filtrarCultivosPorFinca(): void {
    if (this.task.farm) {
      this.cultivosFiltrados = this.cultivos.filter(c => c.farm === this.task.farm || c.farm?._id === this.task.farm);
    } else {
      this.cultivosFiltrados = [];
    }
  }

  onSubmit(): void {
    if (this.isEditing && this.editTaskId) {
      this.taskService.updateTask(this.editTaskId, this.task).subscribe({
        next: () => {
          this.loadTasks();
          this.resetForm();
          Swal.fire('Éxito', 'Tarea actualizada', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar la tarea', 'error'),
      });
    } else {
      this.taskService.createTask(this.task).subscribe({
        next: () => {
          this.loadTasks();
          this.resetForm();
          Swal.fire('Éxito', 'Tarea creada', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo crear la tarea', 'error'),
      });
    }
  }

  // Cuando se edita una tarea, también se filtran los cultivos por finca
  editTask(task: any): void {
    this.isEditing = true;
    this.editTaskId = task._id;
    this.task = {
      title: task.title,
      description: task.description,
      date: task.date ? task.date.substring(0, 10) : '',
      status: task.status,
      farm: task.farm?._id || task.farm || '',
      cultivo: task.cultivo?._id || task.cultivo || '',
    };
    this.filtrarCultivosPorFinca();
  }

  // Al cancelar edición, limpiar cultivos filtrados
  private resetForm() {
    this.task = { title: '', description: '', date: '', status: 'pendiente', farm: '', cultivo: '' };
    this.isEditing = false;
    this.editTaskId = null;
    this.cultivosFiltrados = [];
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteTask(id: string): void {
    Swal.fire({
      title: '¿Eliminar tarea?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            this.loadTasks();
            Swal.fire('Eliminada', 'La tarea ha sido eliminada', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar la tarea', 'error'),
        });
      }
    });
  }

  getCultivoNombre(cultivoId: string): string {
    if (!cultivoId) return '-';
    const cultivo = this.cultivos.find(c => c._id === cultivoId);
    return cultivo ? cultivo.nombre : '-';
  }
}
