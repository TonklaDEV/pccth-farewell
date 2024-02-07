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

  getBudgets(): Observable<any> {
    return this.http.get<any>(`/budget/getBudget`);
  }

}
