import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FtrOj1ServicesService {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient,) { }

  apiurl = 'http://localhost:8080/ftr-oj1'

  getFindAll(): Observable<any> {
    // ใช้ Observable ในการรับข้อมูล
    return this.http.get<any>(this.apiurl + '/findAll');
  }

  sortData(data: any[], property: string, order: 'asc' | 'desc'): any[] {
    return data.sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  // getSearch(dept: String, tRole: String, tName: String){
  //   console.log('search')
  //   return this.http.get(this.apiurl + "search?Dept=" + dept +"&tName=" + tRole + "&tRole=" + tName)
  // }

  deleteId(id: number) {
    return this.http.delete(this.apiurl + '/deleteById?id=' + id)

  }

  getDatabyId(id: number): Observable<any> {
    return this.http.get(this.apiurl + '/findById?of1_id=' + id)
      .pipe(
        tap(data => {
          console.log('Response:', data); // บันทึกค่าที่ได้รับ
        }),
        catchError(error => {
          console.error('Error:', error); // บันทึกค่าข้อผิดพลาด
          return throwError(error); // ส่งค่าข้อผิดพลาดต่อไปเพื่อการจัดการเพิ่มเติม
        })
      );
  }

  editData(data: any) {
    return this.http.post(this.apiurl + '/edit', JSON.stringify(data), { headers: this.headers, responseType: 'text' })
      .subscribe(
        (response) => {
          if (response === 'SUCCESS') {
            console.log('Data saved successfully:', response);
          } else {
            console.error('Unexpected response:', response);
          }
        },
        (error) => {
          console.error('Error while saving data:', error);
        });
  }

  // search(empName: string, empRole: string, department: string, topic: string): Observable<any> {
  //   // สร้าง URL สำหรับการเรียก API ในรูปแบบที่คุณต้องการ
  //   const url = `${this.apiurl}/search?empName=${empName}&empRole=${empRole}&department=${department}&topic=${topic}`;

  //   // ใช้ HttpClient เพื่อเรียก API
  //   return this.http.get(url);
  // }

  search(
    searchParams: any
  ): Observable<any> {
    // สร้าง URL สำหรับการเรียก API ในรูปแบบที่คุณต้องการ
    const url = `${this.apiurl}/search`;

    // ใช้ HttpClient เพื่อเรียก API
    return this.http.get<any>(url, { params: searchParams });


  }

  saveData(data : any){
    return this.http.post(this.apiurl+'/saveData',JSON.stringify(data),{ headers: this.headers, responseType: 'text' })
    .subscribe(
      (response) => {
        console.log('Data saved successfully:', response);
      },
      (error) => {
        console.error('Error while saving data:', error);
      })
  }


  // getSearchEmpName(empName: String) {
  //   console.log('search')
  //   return this.http.get('http://localhost:8080/ftr-oj1/search?empName=' + empName)
  // }

  // getSearchEmpRole(empRole: String) {
  //   console.log('search')
  //   return this.http.get('http://localhost:8080/ftr-oj1/search?empRole=' + empRole)
  // }

  // getSearchTopic(topic: String){
  //   console.log('search')
  //   return this.http.get('http://localhost:8080/ftr-oj1/search?topic=' + topic)
  // }

  // getSearchDept(dept: String){
  //   console.log('search')
  //   return this.http.get('http://localhost:8080/ftr-oj1/search?dept=' + dept)
  // }

  // getSearchDate(startDate: String){
  //   console.log('search')
  //   return this.http.get('http://localhost:8080/ftr-oj1/search?startDate=' + startDate)
  // }

}
