import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget, BudgetResponse } from '../pages/budget/budget.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  [x: string]: any;
  private apiUrl = '/budget';
  private domain!: String;
  token = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}`
  });

  constructor(private http: HttpClient) {
    this.domain = environment.domain;

  }

  getBudgets(): Observable<BudgetResponse> {
    return this.http.get<BudgetResponse>(`${this.domain}/budget/getBudget`, { headers: this.headers });
  }

  createBudget(newBudget: Budget): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(`${this.domain}/budget/create`, newBudget , { headers: this.headers });
  }

  searchBudget(level: string): Observable<BudgetResponse> {
    const params = new HttpParams().set('level', level);
    return this.http.get<BudgetResponse>(`${this.domain}/budget/searchBudget`, { params, headers: this.headers });
  }

  deleteBudget(budgetId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.domain}/budget/deleteBudget?budgetId=${budgetId}`, { headers: this.headers }
    );
  }

  // updateBudget(id: number, budget: Budget): Observable<any> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.put(url, budget);
  // }

  updateBudget(budget: Budget): Observable<any> {
    const url = `${this.domain}/budget/editBudget/${budget.id}`;
    const payLoad = {
      ipd: this.removeComma(String(budget.ipd)),
      opd: this.removeComma(String(budget.opd)),
      room: this.removeComma(String(budget.room)),
      level: budget.level
    }
    console.log(budget);
    return this.http.put<any>(url, payLoad , { headers: this.headers })
  }

  private removeComma(num: String): Number {
    if (num.includes(',')) {
      const numstring = num.split(',').join('')
      return Number(numstring)
    } else {
      return Number(num)
    }
  }
}
