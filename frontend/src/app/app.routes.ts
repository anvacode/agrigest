import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'farms/new',
    loadComponent: () => import('./components/farm-crud/farm-crud.component').then(m => m.FarmCrudComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'user-profile',
    loadComponent: () => import('./components/user-profile/user-profile.component').then(m => m.ProfileComponent), // Cambiado a ProfileComponent
    canActivate: [authGuard]
  },
  { 
    path: 'cultivos/nuevo',
    loadComponent: () => import('./components/cultivo-crud/cultivo-crud.component').then(m => m.CultivoCrudComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];