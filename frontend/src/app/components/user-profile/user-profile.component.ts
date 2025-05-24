import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileForm') profileForm!: NgForm;
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Estados del componente
  isEditing = false;
  isSubmitting = false;
  originalUserData: any;
  formErrors = {
    name: '',
    email: '',
    bio: ''
  };

  // Datos del usuario
  user = {
    name: 'Andres Vacca',
    email: 'vaccadarwin@gmail.com',
    bio: 'Desarrollador frontend con experiencia en Angular y diseño responsive.',
    avatar: '',
    joinDate: '24 Mayo 2025'
  };

  // Estadísticas del usuario (estructura optimizada para el template)
  statsArray = [
    { id: 'posts', label: 'Publicaciones', value: 8 },
    { id: 'followers', label: 'Seguidores', value: 301 },
    { id: 'following', label: 'Seguidos', value: 89 },
    { id: 'lastActive', label: 'Última actividad', value: 'Hace 2 horas' }
  ];

  ngOnInit(): void {
    this.originalUserData = { ...this.user };
  }

  // Activa el modo edición
  enableEditMode(): void {
    this.isEditing = true;
    setTimeout(() => {
      this.validateForm();
    });
  }

  // Valida el formulario
  validateForm(): void {
    this.formErrors = {
      name: !this.user.name ? 'El nombre es requerido' : '',
      email: !this.user.email 
        ? 'El email es requerido' 
        : !this.validateEmail(this.user.email) 
          ? 'Ingrese un email válido' 
          : '',
      bio: ''
    };
  }

  // Validación simple de email
  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Maneja el cambio de avatar
  handleAvatarUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.match('image.*')) {
        alert('Solo se permiten imágenes');
        return;
      }
      
      if (file.size > 2097152) {
        alert('La imagen no debe exceder 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatar = e.target.result;
        // Actualizar última actividad
        this.statsArray[3].value = 'Recién ahora'; // Actualiza "Última actividad"
      };
      reader.readAsDataURL(file);
    }
  }

  // Dispara el input file
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  // Guarda el perfil
  saveProfile(): void {
    this.validateForm();
    
    const hasErrors = Object.values(this.formErrors).some(error => error !== '');
    
    if (hasErrors) {
      alert('Por favor corrija los errores antes de guardar');
      return;
    }

    this.isSubmitting = true;
    
    // Simulación de llamada a API
    setTimeout(() => {
      console.log('Perfil actualizado:', this.user);
      this.isEditing = false;
      this.isSubmitting = false;
      this.originalUserData = { ...this.user };
      this.statsArray[3].value = 'Recién ahora'; // Actualiza "Última actividad"
    }, 1500);
  }

  // Cancela la edición
  cancelEdit(): void {
    this.user = { ...this.originalUserData };
    this.isEditing = false;
    this.formErrors = { name: '', email: '', bio: '' };
  }

  // Helper para deshabilitar botón de guardar
  get isSaveDisabled(): boolean {
    return this.isSubmitting || 
           !this.user.name || 
           !this.user.email || 
           !this.validateEmail(this.user.email);
  }
}