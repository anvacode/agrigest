import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExternalService {
  private apiUrl = `${environment.apiUrl}/external`;

  constructor(private http: HttpClient) {}

  getWeather(location: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/weather`, { params: { location } });
  }

  getMarketPrice(crop: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/market-price`, { params: { crop } });
  }
}
