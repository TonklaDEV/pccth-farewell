import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget, BudgetResponse } from '../pages/budget/budget.component';


@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  [x: string]: any;
  private apiUrl = '/budget';

  constructor(private http: HttpClient) { }

  getBudgets(): Observable<BudgetResponse> {
    return this.http.get<BudgetResponse>(`${this.apiUrl}/getBudget`);
  }

  createBudget(newBudget: Budget): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(`${this.apiUrl}/create`, newBudget);
  }

  searchBudget(level: string): Observable<BudgetResponse> {
    const params = new HttpParams().set('level', level);
    return this.http.get<BudgetResponse>(`${this.apiUrl}/searchBudget`, { params });
  }

  deleteBudget(budgetId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteBudget?budgetId=${budgetId}`);
  }

  updateBudget(budgetId: number, updatedBudget: Budget): Observable<any> {
    const url = `${this.apiUrl}/editBudget`;
    const params = new HttpParams()
      .set('budgetId', budgetId.toString())
      .set('level', updatedBudget.level)
      .set('opd', updatedBudget.opd.toString())
      .set('ipd', updatedBudget.ipd.toString())
      .set('room', updatedBudget.room.toString());

    return this.http.put<any>(url, null, { params });
  }

}
