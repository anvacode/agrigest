import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset, ChartData } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  // Configuración de la gráfica de barras
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Cantidad de cultivos por tipo' }
    }
  };
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Cantidad de cultivos' }
    ]
  };
  barChartType: 'bar' = 'bar';
  cargando = false;

  // Configuración de la gráfica de torta (pie)
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: { display: true, text: 'Distribución de cultivos por tipo' }
    }
  };
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Distribución de cultivos' }
    ]
  };
  pieChartType: 'pie' = 'pie';

  chartView: 'bar' | 'pie' = 'bar';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.http.get<any>('/api/analytics/crop-analytics').subscribe({
      next: (res) => {
        const datos = res.data || [];
        // Barras
        this.barChartData.labels = datos.map((d: any) => d.crop);
        this.barChartData.datasets[0].data = datos.map((d: any) => d.count);
        // Pie
        // Asegura que los datos sean solo números y no null ni arrays
        this.pieChartData.labels = this.barChartData.labels;
        this.pieChartData.datasets[0].data = (this.barChartData.datasets[0].data as number[]).map(x => (typeof x === 'number' ? x : 0));
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        alert('Error al cargar datos de analíticas');
      }
    });
  }
}
