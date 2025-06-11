import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common';
import { CultivoService, Cultivo } from '../../services/cultivo.service';
import { FarmService } from '../../services/farm.service';
import { ExternalService } from '../../services/external.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cultivo-crud',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './cultivo-crud.component.html',
  styleUrl: './cultivo-crud.component.scss'
})
export class CultivoCrudComponent implements OnInit {
  cultivo: Cultivo = { nombre: '', tipo: '', fechaSiembra: '', farm: '' };
  creando = false;
  cultivos: Cultivo[] = [];
  cargando = false;
  editIndex: number | null = null;
  editCultivo: Cultivo = { nombre: '', tipo: '', fechaSiembra: '' };
  cultivosJoin: any[] = [];
  fincas: any[] = [];
  mostrarModalJoin = false;
  marketPrice: any = {};
  loadingMarket: boolean = false;

  constructor(
    private cultivoService: CultivoService,
    private farmService: FarmService,
    private externalService: ExternalService
  ) {}

  ngOnInit() {
    this.cargarCultivos();
    this.cargarFincas();
  }

  cargarCultivos() {
    this.cargando = true;
    this.cultivoService.obtenerCultivos().subscribe({
      next: (res) => {
        this.cultivos = res;
        this.cargando = false;
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Error al cargar los cultivos', 'error');
        this.cargando = false;
      }
    });
  }

  cargarCultivosConJoin() {
    this.cargando = true;
    this.cultivoService.obtenerCultivosConJoin().subscribe({
      next: (res) => {
        this.cultivosJoin = res.sort((a, b) => new Date(b.fechaSiembra).getTime() - new Date(a.fechaSiembra).getTime());
        this.cargando = false;
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Error al cargar los cultivos con join', 'error');
        this.cargando = false;
      }
    });
  }

  crearCultivo() {
    this.creando = true;
    this.cultivoService.crearCultivo(this.cultivo).subscribe({
      next: (res) => {
        Swal.fire('¡Éxito!', 'Cultivo creado exitosamente', 'success');
        this.cultivo = { nombre: '', tipo: '', fechaSiembra: '', farm: '' };
        this.creando = false;
        this.cargarCultivos();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Error al crear el cultivo', 'error');
        this.creando = false;
      }
    });
  }

  startEdit(index: number, cultivo: Cultivo) {
    this.editIndex = index;
    this.editCultivo = { ...cultivo };
  }

  saveEdit(cultivo: Cultivo) {
    if (!cultivo._id) return;
    this.cultivoService.actualizarCultivo(cultivo._id, this.editCultivo).subscribe({
      next: (updated) => {
        Swal.fire('¡Éxito!', 'Cultivo actualizado exitosamente', 'success');
        this.editIndex = null;
        this.cargarCultivos();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Error al actualizar el cultivo', 'error');
      }
    });
  }

  cancelEdit() {
    this.editIndex = null;
    this.editCultivo = { nombre: '', tipo: '', fechaSiembra: '' };
  }

  eliminarCultivo(cultivo: Cultivo) {
    if (!cultivo._id) return;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cultivoService.eliminarCultivo(cultivo._id!).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El cultivo ha sido eliminado.', 'success');
            this.cargarCultivos();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.message || 'Error al eliminar el cultivo', 'error');
          }
        });
      }
    });
  }

  cargarFincas() {
    this.farmService.getFarms().subscribe({
      next: (res: any) => {
        this.fincas = res.data ? res.data : res;
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Error al cargar las fincas', 'error');
      }
    });
  }

  abrirModalJoin() {
    this.cargarCultivosConJoin();
    this.mostrarModalJoin = true;
  }

  cerrarModalJoin() {
    this.mostrarModalJoin = false;
  }

  // Obtener precio de mercado para un cultivo
  getMarketPriceForCultivo(cultivo: Cultivo) {
    const key = cultivo._id || cultivo.nombre;
    if (!cultivo.nombre) return;
    this.loadingMarket = true;
    this.externalService.getMarketPrice(cultivo.nombre).subscribe({
      next: (res) => {
        this.marketPrice[key] = res.data;
        this.loadingMarket = false;
      },
      error: () => {
        this.marketPrice[key] = null;
        this.loadingMarket = false;
      }
    });
  }
}
