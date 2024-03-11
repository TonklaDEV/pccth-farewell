import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/api-services/auth.service';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit {

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private jwtService: JwtHelperService,) { }
  signupForm: any;
  signinForm: any;
  errorMessage: string = ''; // ใช้เพื่อแสดงข้อความข้อผิดพลาด
  showLogin = true; // Initial state

  toggleForm() {
    this.showLogin = !this.showLogin;
  }

  ngOnInit(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // เขียนฟังก์ชันที่เช็คว่าฟอร์มถูกกรอกครบหรือไม่
  isFormValid(): boolean {
    return this.signinForm.valid;
  }

  signupBtn(){
    
  }

  loginBtn(): void {
    this.authService.login(this.signinForm.value.email, this.signinForm.value.password).subscribe(
      (response) => {
        // ดำเนินการตามความต้องการเมื่อการเข้าสู่ระบบสำเร็จ
        // เช่น บันทึก token หรือไปยังหน้าหลัก
        console.log(response); // รายละเอียดการตอบสนองจาก API

        // สามารถบันทึก token ไว้ใน localStorage หรือ sessionStorage ได้
        localStorage.setItem('access_token', response.accessToken);

        // ดึงข้อมูล role จาก JWT
        const decodedToken = this.jwtService.decodeToken(response.accessToken);
        const userRoles = decodedToken.role.map((role: { authority: any; }) => role.authority) || [];

        console.log('User Roles: ', userRoles);

        // นำผู้ใช้ไปยังหน้า '/pccth'
        this.router.navigate(['/pccth']);
      },
      (error) => {
        // ดำเนินการเมื่อการเข้าสู่ระบบไม่สำเร็จ
        // เช่น แสดงข้อความข้อผิดพลาด
        console.error(error); // รายละเอียดข้อผิดพลาด
        this.errorMessage = 'เข้าสู่ระบบไม่สำเร็จ'; // กำหนดข้อความข้อผิดพลาด
      }
    );
  }


}



