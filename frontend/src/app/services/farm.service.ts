import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FarmService {
  private apiUrl = `${environment.apiUrl}/farms`;

  constructor(private http: HttpClient) {}

  getFarms(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createFarm(farm: any): Observable<any> {
    return this.http.post(this.apiUrl, farm);
  }

  // Puedes agregar métodos para editar/eliminar si lo necesitas
}