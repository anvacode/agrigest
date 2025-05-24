import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ← AGREGAR ESTA LÍNEA

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // ← AGREGAR FormsModule AQUÍ
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Datos mockeados
  farms = [
    { id: '1', name: 'La Esperanza', location: 'Ocaña', size: 18, crops: ['Café', 'Plátano'] },
    { id: '2', name: 'El Porvenir', location: 'Tibú', size: 25, crops: ['Cacao', 'Maíz'] },
    { id: '3', name: 'San Isidro', location: 'Abrego', size: 12, crops: ['Yuca', 'Fríjol'] }
  ];

  crops = [
    { _id: '1', nombre: 'Café', variedad: 'Arábica', ciclo_dias: 180, requerimientos: ['Sombra', 'Riego moderado'] },
    { _id: '2', nombre: 'Maíz', variedad: 'Híbrido', ciclo_dias: 90, requerimientos: ['Sol pleno', 'Riego frecuente'] }
  ];

  requirements: any[] = [];
  yieldData: any[] = [];
  activeTab: 'farms' | 'crops' | 'reports' = 'farms';
  selectedCrop: any = null;
  loading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generateRequirementsReport();
    this.initChart();
  }

  // Métodos existentes
  calculateTotalArea(): number {
    return this.farms.reduce((total, farm) => total + farm.size, 0);
  }

  // Métodos para CRUD de cultivos
  openCropModal(crop?: any): void {
    this.selectedCrop = crop ? { 
      ...crop, 
      requerimientosStr: crop.requerimientos.join(', ') // ← AGREGAR ESTA LÍNEA para manejar el string
    } : { 
      nombre: '', 
      variedad: '', 
      ciclo_dias: null, 
      requerimientos: [], 
      requerimientosStr: '' // ← AGREGAR ESTA PROPIEDAD
    };
  }

  deleteCrop(cropId: string): void {
    this.crops = this.crops.filter(crop => crop._id !== cropId);
  }

  saveCrop(): void {
    // Convertir string de requerimientos a array
    if (this.selectedCrop.requerimientosStr) {
      this.selectedCrop.requerimientos = this.selectedCrop.requerimientosStr
        .split(',')
        .map((req: string) => req.trim())
        .filter((req: string) => req.length > 0);
    }

    if (this.selectedCrop._id) {
      this.crops = this.crops.map(crop => 
        crop._id === this.selectedCrop._id ? this.selectedCrop : crop
      );
    } else {
      this.selectedCrop._id = Date.now().toString();
      this.crops.push(this.selectedCrop);
    }
    this.selectedCrop = null;
    this.generateRequirementsReport();
  }

  // Métodos para reportes
  generateYieldReport(): void {
    // Simulación de agregación
    this.yieldData = this.farms.map(farm => ({
      parcela: farm.name,
      rendimiento: farm.size * Math.random() * 100 // Simular cálculo
    }));
    this.initChart();
  }

  private generateRequirementsReport(): void {
    // Simulación de $unwind y $group
    const requirementsMap = new Map<string, number>();
    this.crops.forEach(crop => {
      crop.requerimientos.forEach((req: string) => {
        requirementsMap.set(req, (requirementsMap.get(req) || 0) + 1);
      });
    });
    this.requirements = Array.from(requirementsMap).map(([key, value]) => ({
      _id: key,
      total: value
    })).sort((a, b) => b.total - a.total);
  }

  private initChart(): void {
    // Implementar lógica con Chart.js
    console.log('Inicializar gráfica con datos:', this.yieldData);
  }

  // Métodos existentes
  loadFarms(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}