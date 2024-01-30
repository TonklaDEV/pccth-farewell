import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FtrSv1ServicesService {

  constructor(private http: HttpClient,) { }

  apiurl = "http://localhost:8080/ftr-sv1"

  addSv1(inputdata: any) {
    return this.http.post<any>(this.apiurl + '/saveData', inputdata)
  }


  Getuser() {
    return this.http.get(this.apiurl + "/findAll");
  }

  Report() {
    return this.http.get(this.apiurl + "/report" , { responseType: 'text' })
  }

}
