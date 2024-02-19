import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WellfareService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

  searchUserByName(searchTerm: string): Observable<any> {
    const url = `http://localhost:8080/employee/seacrhUser/byNames?searchTerm=${encodeURIComponent(searchTerm)}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  private apiUrl = 'http://localhost:8080/expenses/create';
  createExpense(userId: string, expenseData: any): Observable<any> {
    const url = `${this.apiUrl}?userId=${encodeURIComponent(userId)}`;
    return this.http.post<any>(url, expenseData, { headers: this.headers });
  }

  getExpenseRemaining(userId: string): Observable<any> {
    const url = `http://localhost:8080/expenses/getExpenseRemaining?userId=${encodeURIComponent(userId)}`;
    return this.http.get<any>(url, { headers: this.headers });
  }
}
