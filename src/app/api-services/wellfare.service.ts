import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WellfareService {
  token = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}`
  });
  domain: any;

  constructor(private http: HttpClient) {
    this.domain = environment.domain;
 
  }

  // searchUserByName(searchTerm: string): Observable<any> {
  //   const url = `http://localhost:8080/employee/seacrhUser/byNames?searchTerm=${encodeURIComponent(searchTerm)}`;
  //   return this.http.get<any>(url, { headers: this.headers });
  // }

  searchUserByName(searchTerm: string): Observable<any> {  
    const url = `${this.domain}/employee/seacrhUser/byNames?searchTerm=${encodeURIComponent(searchTerm)}`;
    return this.http.get(url, { headers : this.headers }).pipe(
      tap((response) => {
      })
    );
  }

  // private apiUrl = 'http://localhost:8080/expenses/create';
  createExpense(userId: string, expenseData: any): Observable<any> {
    const url = `${this.domain}?userId=${encodeURIComponent(userId)}`;
    return this.http.post<any>(url, expenseData, { headers: this.headers });
  }

  getExpenseRemaining(userId: string): Observable<any> {
    const url = `${this.domain}/expenses/getExpenseRemaining?userId=${encodeURIComponent(
      userId
    )}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  getExpenseRemainingByYear(uid : string , year: Number) : Observable<any> {
    const url = `${this.domain}/expenses/getExpenseRemaining/${uid}/${year}`
    return this.http.get<any>(url, { headers: this.headers });
  }

  getFilterName(term: string): Observable<any> {
    return this.http.get<any>(
      `${this.domain}/employee/seacrhUser/byNames?searchTerm=${term}`
    );
  }
  searchExpensesByUserId(userId: number, year: Number): Observable<any> {
    const url = `${this.domain}/expenses/searchExpenses/${userId}?year=${year}`;
    return this.http.get<any>(url, { headers: this.headers }).pipe(
      tap((response) => {
      })
    );
  }
  // searchExpensesByUserId(userId: number): Observable<any> {
  //   const url = `http://localhost:8080/expenses/searchExpenses/${userId}`;
  //   return this.http.get(url);
  // }

  deleteExpense(expenseId: number): Observable<any> {
    const url = `${this.domain}/expenses/deleteExpenses/${expenseId}`;
    return this.http.delete<any>(url, { headers: this.headers });
  }

  updateExpense(expenseId: number, updatedExpenseData: any): Observable<any> {
    const url = `${this.domain}/expenses/update/${expenseId}`;
    return this.http.put<any>(url, updatedExpenseData, { headers: this.headers });
  }
  
  getExpenseByid(expenseId : number) {
    const url = `${this.domain}/expenses/getExpense/${expenseId}`
    return this.http.get<any>(url, { headers: this.headers })
  }

  getExpenseHistoryReportByEmployeeBase64(month: number, year: number, type: string, reportType: string, uid: number): Observable<any> {
    const url = `${this.domain}/report/expenseHistoryReportByEmployeeBase64?month=${month}&year=${year}&type=${type}&reportType=${reportType}&uid=${uid}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

}
