import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Añade Router aquí

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RouterModule] 
})
export class HomeComponent {
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router 
  ) {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
  }

  // Método adicional para debug
  navigateToProfile() {
    console.log('Intentando navegar a perfil');
    this.router.navigateByUrl('/user-profile'); 
  }
}