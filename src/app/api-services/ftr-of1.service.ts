import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FtrOf1Service {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private apiServerUrl = "http://localhost:8080/ftr-of1";

  constructor(private http:HttpClient) { }

  saveData(data : any){
    return this.http.post(this.apiServerUrl+'/save',JSON.stringify(data),{ headers: this.headers, responseType: 'text' })
    .subscribe(
      (response) => {
        console.log('Data saved successfully:', response);
      },
      (error) => {
        console.error('Error while saving data:', error);
      })
  }

}
