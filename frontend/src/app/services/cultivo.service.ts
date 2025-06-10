import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Cultivo {
  _id?: string;
  nombre: string;
  tipo: string;
  fechaSiembra: string;
  farm?: string;
}

@Injectable({ providedIn: 'root' })
export class CultivoService {
  private apiUrl = '/api/cultivos';

  constructor(private http: HttpClient) {}

  crearCultivo(cultivo: Cultivo): Observable<Cultivo> {
    return this.http.post<Cultivo>(this.apiUrl, cultivo);
  }

  obtenerCultivos(): Observable<Cultivo[]> {
    return this.http.get<{ status: string, data: Cultivo[] }>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  eliminarCultivo(id: string): Observable<any> {
    return this.http.delete<{ status: string, message: string }>(`${this.apiUrl}/${id}`);
  }

  actualizarCultivo(id: string, cultivo: Cultivo): Observable<Cultivo> {
    return this.http.put<{ status: string, data: Cultivo }>(`${this.apiUrl}/${id}`, cultivo)
      .pipe(map(res => res.data));
  }

  obtenerCultivosConJoin(): Observable<any[]> {
    return this.http.get<{ status: string, data: any[] }>(`${this.apiUrl}/join`)
      .pipe(map(res => res.data));
  }

  // Aquí puedes agregar métodos para listar, editar, eliminar cultivos
} 