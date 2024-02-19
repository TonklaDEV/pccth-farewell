import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WellfareService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });


  constructor(private http: HttpClient) { }

  // searchUserByName(searchTerm: string): Observable<any> {
  //   const url = `http://localhost:8080/employee/seacrhUser/byNames?searchTerm=${encodeURIComponent(searchTerm)}`;
  //   return this.http.get<any>(url, { headers: this.headers });
  // }

  searchUserByName(searchTerm: string): Observable<any> {
    const url = `http://localhost:8080/employee/seacrhUser/byNames?searchTerm=${encodeURIComponent(searchTerm)}`;
    return this.http.get<any>(url, { headers: this.headers }).pipe(
      tap((response) => {
        console.log('API Response:', response);
      })
    );
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

  searchExpensesByUserId(userId: number): Observable<any> {
    const url = `http://localhost:8080/expenses/searchExpenses/${userId}`;
    return this.http.get<any>(url, { headers: this.headers }).pipe(
      tap((response) => {
        console.log('API Response searchExpensesByUserId:', response); // Log the entire response
      })
    );
  }
  // searchExpensesByUserId(userId: number): Observable<any> {
  //   const url = `http://localhost:8080/expenses/searchExpenses/${userId}`;
  //   return this.http.get(url);
  // }

  deleteExpense(expenseId: number): Observable<any> {
    const url = `http://localhost:8080/expenses/deleteExpenses/${expenseId}`;
    return this.http.delete<any>(url, { headers: this.headers });
  }

  updateExpense(expenseId: number, updatedExpenseData: any): Observable<any> {
    const url = `http://localhost:8080/expenses/update/${expenseId}`;
    return this.http.put<any>(url, updatedExpenseData, { headers: this.headers });
  }
  
}
