import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageUserService {
  token = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}`
  });
  domain : String = ""
  constructor(private http: HttpClient) {
    this.domain = environment.domain
   }

  getEmployees(page: number, size: number, sort: string): Observable<any> {
    return this.http.get<any>(`${this.domain}/employee/getEmpsByPage?page=${page}&size=${size}&sort=${sort}`, { headers: this.headers });
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.domain}/employee/search/${userId}`, { headers: this.headers });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.domain}/employee/deleteEmployee?userid=${userId}`, { headers: this.headers });
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.domain}/employee/editEmployee?userid=${userId}`, userData, { headers: this.headers });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.domain}/employee/create`, userData, { headers: this.headers });
  }

  searchUserByEmpId(empid: any): Observable<any> {
    return this.http.get(`${this.domain}/employee/seacrhUser/byEmpid?empid=${empid}`, { headers: this.headers });
  }





}