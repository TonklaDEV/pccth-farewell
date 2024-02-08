import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WellfareDetailsService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getAllExpenseInUsed(): Observable<any[]> {
    return this.http.get<any[]>(
      '/expenses/getAllExpenseInUsed'
    );
  }
}
