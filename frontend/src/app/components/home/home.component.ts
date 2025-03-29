import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: any; // O usa tu interfaz específica

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser(); 
  }

  logout(): void {
    this.authService.logout();
  }
}