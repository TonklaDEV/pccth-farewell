import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget } from '../pages/budget/budget.component';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = '/budget';

  constructor(private http: HttpClient) { }

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/getBudget`);
  }

}
