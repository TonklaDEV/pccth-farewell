import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private jwtService: JwtHelperService) {}

  baseUrl = 'http://localhost:8080'; // URL ของ API Service

  checkRole(){
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Decode the JWT token
      const decodedToken = this.jwtService.decodeToken(accessToken);
      const userRoles = decodedToken.role.map(
        (role: { authority: any }) => role.authority
      );
      return userRoles[0];
    }
  }
  login(email: string, password: string): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = {
      'email': email,
      'password': password
    }
  
    return this.http.post(`${this.baseUrl}/api/v1/auth/authenticate`, body 
    //{ headers }
    );
  }
  
  private apiUrl = 'http://localhost:8080/api/v1/auth/register';
  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  logout(): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v1/auth/logout', {});
  }

}
