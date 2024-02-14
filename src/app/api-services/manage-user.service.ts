import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageUserService {

  constructor(private http: HttpClient) { }

  getEmployees(page: number, size: number, sort: string): Observable<any> {
    return this.http.get<any>(`/employee/getEmpsByPage?page=${page}&size=${size}&sort=${sort}`);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/employee/search/${userId}`);
  }
  
}