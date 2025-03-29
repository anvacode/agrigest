import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    farm: {
      name: '',
      location: '',
      size: null as number | null,
      crops: [] as string[]
    }
  };
  errorMessage = '';
  isLoading = false;
  serverErrorDetails: any;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.serverErrorDetails = null;
    this.isLoading = true;

    // Validación adicional
    if (!this.validateForm()) {
      this.isLoading = false;
      return;
    }

    console.log('Enviando datos:', JSON.stringify(this.userData, null, 2));

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login'], {
          state: { registrationSuccess: true }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Error completo:', err);
        this.handleError(err);
        console.error('Detalles del error:', err.error);
      }
    });
  }

  private validateForm(): boolean {
    if (this.userData.farm.size === null || this.userData.farm.size < 0) {
      this.errorMessage = 'El tamaño de la finca debe ser un número positivo';
      return false;
    }

    if (!this.userData.email.includes('@')) {
      this.errorMessage = 'Ingrese un correo electrónico válido';
      return false;
    }

    if (this.userData.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return false;
    }

    return true;
  }

  private handleError(err: HttpErrorResponse): void {
    this.serverErrorDetails = err.error;
    
    if (err.status === 500) {
      if (err.error?.error?.includes('duplicate key')) {
        this.errorMessage = 'El correo electrónico ya está registrado';
      } else {
        this.errorMessage = 'Error en el servidor: ';
        if (err.error?.message) {
          this.errorMessage += err.error.message;
        } else {
          this.errorMessage += 'Por favor contacte al administrador';
        }
      }
    } else if (err.status === 400) {
      this.errorMessage = err.error?.msg || 'Datos de registro inválidos';
    } else {
      this.errorMessage = 'Error de conexión. Verifique su red e intente nuevamente.';
    }
  }

  resetForm(): void {
    this.userData = {
      name: '',
      email: '',
      password: '',
      role: 'farmer',
      farm: {
        name: '',
        location: '',
        size: null,
        crops: []
      }
    };
    this.errorMessage = '';
  }
}