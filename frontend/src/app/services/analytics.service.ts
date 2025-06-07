import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getCropStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/crop-stats`);
  }

  getFarmsWithOwners(): Observable<any> {
    return this.http.get(`${this.apiUrl}/farms-with-owners`);
  }

  getCropAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/crop-analytics`);
  }

  getUserSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-summary`);
  }
}
