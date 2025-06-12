import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { CommonModule } from '@angular/common';
import { FarmService } from '../../services/farm.service';
import { AuthService } from '../../services/auth.service';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { TaskService } from '../../services/task.service';
import { CultivoCrudComponent } from '../cultivo-crud/cultivo-crud.component';

interface Farm {
  _id: string;
  name: string;
  location: string;
  size: number;
  crops: string[];
}

interface CropAnalytic {
  crop: string;
  count: number;
  totalArea: number;
  farms: Farm[];
}

interface CropStat {
  location: string;
  totalFarms: number;
  totalArea: number;
  averageSize: number;
  uniqueCrops: number;
}

interface UserSummary {
  role: string;
  count: number;
  recentUsers: { name: string; email: string; }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AnalyticsComponent, CultivoCrudComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  farms: Farm[] = [];
  cropAnalytics: CropAnalytic[] = [];
  userSummary: UserSummary[] = [];
  cropStats: CropStat[] = [];
  activeTab: 'farms' | 'crops' | 'reports' = 'farms';
  loading = {
    farms: false,
    cropStats: false,
    cropAnalytics: false,
    userSummary: false,
    pendingTasks: false
  };
  errorMessage = '';
  pendingTasksCount = 0;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private farmService: FarmService,
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboardData();
    this.loadPendingTasks();
  }

  loadDashboardData(): void {
    this.loadFarms();
    this.loadCropStats();
    this.loadCropAnalytics();
    this.loadUserSummary();
  }

  loadFarms(): void {
    this.loading.farms = true;
    this.farmService.getFarms().subscribe({
      next: (response: any) => {
        this.farms = response.data || [];
        this.loading.farms = false;
      },
      error: (error) => {
        console.error('Error al cargar fincas:', error);
        this.errorMessage = 'Error al cargar las fincas. Por favor, intente de nuevo.';
        this.loading.farms = false;
      }
    });
  }

  loadCropStats(): void {
    this.loading.cropStats = true;
    this.analyticsService.getCropStats().subscribe({
      next: (response: any) => {
        this.cropStats = response.data || [];
        this.loading.cropStats = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas de cultivos:', error);
        this.loading.cropStats = false;
      }
    });
  }

  loadCropAnalytics(): void {
    this.loading.cropAnalytics = true;
    this.analyticsService.getCropAnalytics().subscribe({
      next: (response: any) => {
        this.cropAnalytics = response.data || [];
        this.loading.cropAnalytics = false;
      },
      error: (error) => {
        console.error('Error al cargar análisis de cultivos:', error);
        this.loading.cropAnalytics = false;
      }
    });
  }

  loadUserSummary(): void {
    this.loading.userSummary = true;
    this.analyticsService.getUserSummary().subscribe({
      next: (response: any) => {
        this.userSummary = response.data || [];
        this.loading.userSummary = false;
      },
      error: (error) => {
        console.error('Error al cargar resumen de usuarios:', error);
        this.loading.userSummary = false;
      }
    });
  }

  loadPendingTasks(): void {
    this.loading['pendingTasks'] = true;
    this.taskService.getTasks({ status: 'pendiente' }).subscribe({
      next: (tasks: any[]) => {
        this.pendingTasksCount = tasks.length;
        this.loading['pendingTasks'] = false;
      },
      error: () => {
        this.pendingTasksCount = 0;
        this.loading['pendingTasks'] = false;
      }
    });
  }

  calculateTotalArea(): number {
    return this.farms.reduce((total, farm) => total + (farm.size || 0), 0);
  }

  // Devuelve el total de cultivos para el dashboard
  getTotalCultivos(): number {
    return this.cropAnalytics.reduce((acc, c) => acc + c.count, 0);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToCreateFarm(): void {
    this.router.navigate(['/farms/new']);
  }

  goToCreateCultivo(): void {
    this.router.navigate(['/cultivos/nuevo']);
  }

  actualizarDashboard() {
    this.loadDashboardData();
    this.loadPendingTasks(); // Opcional, si quieres refrescar tareas pendientes también
  }
}