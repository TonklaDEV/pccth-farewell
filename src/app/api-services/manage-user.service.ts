import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageUserService {
  token = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}`
  });
  constructor(private http: HttpClient) { }

  getEmployees(page: number, size: number, sort: string): Observable<any> {
    return this.http.get<any>(`/employee/getEmpsByPage?page=${page}&size=${size}&sort=${sort}`, { headers: this.headers });
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/employee/search/${userId}`, { headers: this.headers });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/employee/deleteEmployee?userid=${userId}`, { headers: this.headers });
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`http://localhost:8080/employee/editEmployee?userid=${userId}`, userData, { headers: this.headers });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post('http://localhost:8080/employee/create', userData, { headers: this.headers });
  }

  searchUserByEmpId(empid: any): Observable<any> {
    return this.http.get(`http://localhost:8080/employee/seacrhUser/byEmpid?empid=${empid}`, { headers: this.headers });
  }





}