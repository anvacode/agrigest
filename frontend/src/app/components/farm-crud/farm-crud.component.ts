import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-farm-crud',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], 
  templateUrl: './farm-crud.component.html',
  styleUrls: ['./farm-crud.component.scss'],
})
export class FarmCrudComponent {
  // Modelo para la finca
  farm = {
    name: '',
    location: '',
    size: 0,
    crops: '',
  };

  // Variable para manejar el estado de carga
  isLoading = false;

  constructor(private router: Router, private http: HttpClient) {}

  // Método que se ejecuta al enviar el formulario
  onSubmit(): void {
    this.isLoading = true; // Mostrar indicador de carga
    const farmData = {
      ...this.farm,
      crops: this.farm.crops.split(',').map((crop) => crop.trim()), 
    };
  
    // Obtener el token de autenticación desde localStorage
    const token = localStorage.getItem('authToken');
    console.log('Token enviado:', token); // Verifica si el token es válido
  
    if (!token) {
      alert('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
      this.isLoading = false;
      return;
    }
  
    // Configurar los encabezados con el token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en el encabezado Authorization
    });
  
    // Enviar los datos al backend con los encabezados
    this.http.post('http://localhost:5000/api/farms', farmData, { headers }).subscribe({
      next: (response) => {
        console.log('Finca creada exitosamente:', response);
        this.isLoading = false; 
        this.router.navigate(['/dashboard']); 
      },
      error: (error) => {
        console.error('Error al crear la finca:', error);
        this.isLoading = false; 
        alert('Ocurrió un error al crear la finca. Inténtalo de nuevo.');
      },
    });
  }
}