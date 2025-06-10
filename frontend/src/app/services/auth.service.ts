import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  farms?: any[];
  bio?: string;
  avatar?: string;
  joinDate?: string;
}

interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'agrigest_token';
  private userKey = 'agrigest_user';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap(response => this.setAuth(response))
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.setAuth(response))
    );
  }

  private setAuth(response: AuthResponse): void {
    if (response.status === 'success' && response.token && response.data.user) {
      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
    } else {
      console.error('Respuesta de autenticación inválida:', response);
      throw new Error('Respuesta de autenticación inválida');
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  updateProfile(profileData: any): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}/auth/profile`, profileData).pipe(
      tap(response => {
        if (response.status === 'success' && response.data.user) {
          localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
        }
      })
    );
  }
}