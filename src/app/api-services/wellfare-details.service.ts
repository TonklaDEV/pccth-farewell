import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
interface ResponseData {
  result: {
    id: number;
    employee: {
      userId: number;
      empid: number;
      tprefix: string;
      tname: string;
      tsurname: string;
      tposition: string;
      budget: {
        id: number;
        level: string;
        opd: string;
        ipd: string;
        room: string;
      };
      dept: {
        code: string;
        deptid: string;
        company: string;
        edivision: string;
        tdivision: string;
        divisionid: string;
        edept: string;
        tdept: string;
        deptcode: string;
        remark: string;
      };
      remark: string;
      status: string;
      email: string;
    };
    dateOfAdmission: string;
    description: string;
    opd: number;
    ipd: number;
    remark: string;
    roomService: number;
    days: number;
    startDate: string;
    endDate: string;
    canWithdraw: number;
  };
}

export interface ResponseMessage {
  responseMessage: string;
  responseData: ResponseData;
}
@Injectable({
  providedIn: 'root',
})
export class WellfareDetailsService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private domain: String | undefined;
  constructor(private http: HttpClient) {
    this.domain = environment.domain;
  }

  getAllExpenseInUsed(): Observable<any> {
    return this.http.get<any>(`${this.domain}expenses/getAllExpenseInUsed`);
  }

  getExpenseInfo(id: number): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(`${this.domain}expenses/info?id=${id}`);
  }
}
