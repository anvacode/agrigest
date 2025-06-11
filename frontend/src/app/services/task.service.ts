import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(params: any = {}): Observable<any> {
    return this.http.get(this.apiUrl, { params });
  }

  createTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
