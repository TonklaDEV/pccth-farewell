import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  domain : String = ''
  constructor(private http: HttpClient, private jwtService: JwtHelperService) {
    this.domain = environment.domain
  }

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
  
    return this.http.post(`${this.domain}/api/v1/auth/authenticate`, body 
    //{ headers }
    );
  }
  
  registerUser(userData: any): Observable<any> {
    const url = `${this.domain}/api/v1/auth/register`
    const body = {
      email: userData.email,
      password: userData.password,
      firstname: userData.firstname,
      lastname: userData.lastname,
      role: "ADMIN"
    };
    return this.http.post<any>(url, body);
  }

  logout(): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v1/auth/logout', {});
  }

}
