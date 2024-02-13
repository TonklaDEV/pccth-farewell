import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WellfareService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) { }

  searchUserByName(searchTerm: string): Observable<any> {
    return this.http.get<any>(`/employee/seacrhUser/byNames?searchTerm=${searchTerm}`);
  }

}
