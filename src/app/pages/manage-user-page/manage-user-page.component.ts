import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Paginator } from 'primeng/paginator';
import { AuthService } from 'src/app/api-services/auth.service';
import { ManageUserService } from 'src/app/api-services/manage-user.service';

@Component({
  selector: 'app-manage-user-page',
  templateUrl: './manage-user-page.component.html',
  styleUrls: ['./manage-user-page.component.scss'],
})
export class ManageUserPageComponent implements OnInit {
  emps: any;
  UserForm: any;
  invalidNoInput: boolean = false;
  isDataSelected: boolean = false;
  isEditing: boolean = false;
  selectedUserId: number | null = null;
  userIdToUpdate: any;
  tableRows = 10;
  tablePages = 0;
  tableTotalRecord = 0;
  constructor(
    private Mservices: ManageUserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.UserForm = this.formBuilder.group({
      budget: this.formBuilder.group({
        level: ['', Validators.required],
        opd: [''],
        ipd: [''],
        room: [''],
      }),
      deptCode: ['', Validators.required],
      code: ['', Validators.required],
      dept: this.formBuilder.group({
        deptid: ['', Validators.required],
        deptcode: ['', Validators.required],
      }),
      empid: ['', Validators.required],
      tname: ['', Validators.required],
      tprefix: ['', Validators.required],
      remark: ['', Validators.required],
      startDate: ['', Validators.required],
      tsurname: ['', Validators.required],
      tposition: ['', Validators.required],
      email: ['', Validators.email],
    });

    console.log('in manage-user');
    this.loadEmployees();
  }

  onSubmit() {
    if (this.UserForm.valid) {
      // ทำสิ่งที่คุณต้องการเมื่อยื่นฟอร์ม
      console.log(this.UserForm.value);
    } else {
      this.UserForm.markAllAsTouched();
      console.log('กรุณากรอกข้อมูลให้ถูกต้อง');
    }
    this.UserForm.reset();
  }

  ///////pcc-dept
  pccDept = [
    { name: 'FSI', code: '1011' },
    { name: 'PBS', code: '2011' },
    { name: 'MS', code: '3011' },
    { name: 'SD1', code: '4011' },
    { name: 'SD2', code: '4012' },
    { name: 'SQA', code: '4013' },
    { name: 'SE', code: '5011' },
    { name: 'CS', code: '5012' },
    { name: 'CE', code: '5013' },
    { name: 'NS', code: '5014' },
    { name: 'SM', code: '5015' },
    { name: 'OSS', code: '6011' },
    { name: 'PM', code: '7011' },
    { name: 'DT', code: '7012' },
    { name: 'HQ', code: '8011' },
    { name: 'AF', code: '9011' },
  ];
  //WiseSoft Dept
  wsDept = [
    { name: 'HQ,AF', code: '1000' },
    { name: 'MK', code: '2000' },
    { name: 'APS', code: '2100' },
    { name: 'APS (BOI)', code: '2200' },
    { name: 'OSS', code: '3000' },
    { name: 'OSS (BOI)', code: '3100' },
    { name: 'TOP', code: '4000' },
    { name: 'TOP (BOI)', code: '4100' },
    { name: 'SD (BOI)', code: '5000' },
  ];
  //The Middle dept array
  dept = this.pccDept;

  //for switch option in dept selector
  company!: string;
  selectCompany(company: string) {
    this.company = company;
    console.log(this.company);
    if (company == 'pcc') {
      this.dept = this.pccDept;
      //First dept pcc select
      this.UserForm.get('dept').setValue('');
      this.UserForm.get('deptCode').setValue('');
    } else if (company == 'ws') {
      this.dept = this.wsDept;
      //First dept ws select
      this.UserForm.get('dept').setValue('');
      this.UserForm.get('deptCode').setValue('');
    }
  }

  //gen dept CODE after select dept NAME
  setDept() {
    this.UserForm.get('deptCode').setValue(this.UserForm.get('dept').value[1]);
  }

  onInputKeyPressNo(event: KeyboardEvent) {
    const inputChar = event.key;
    if (!/^\d$/.test(inputChar)) {
      event.preventDefault();
      this.invalidNoInput = true;
    } else {
      this.invalidNoInput = false;
    }
  }

  loadEmployees(): void {
    const sort = 'userId,asc';
    this.Mservices.getEmployees(this.tablePages, this.tableRows, sort).subscribe(
      (data: any) => {
        this.emps = data.content;
        this.tableTotalRecord = data.totalElements;
        //เพื่อดูตัวแปล
        // console.log(data.content);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  onEditButtonClick(userId: number): void {
    this.isDataSelected = true;
    this.isEditing = true;
    this.selectedUserId = userId;
    this.userIdToUpdate = userId; // เพิ่มบรรทัดนี้

    this.Mservices.getUserById(userId).subscribe(
      (data: any) => {
        // ทำการแปลงรูปแบบวันที่จาก API
        data.startDate = new Date(data.startDate).toISOString().split('T')[0];

        const budgetData = data.budget;
        if (budgetData) {
          this.UserForm.get('budget.level').setValue(budgetData.level);
          console.log('Level from API:', budgetData.level);
        }

        this.UserForm.patchValue(data); // ใช้ patchValue เพื่อกำหนดค่าข้อมูลในฟอร์ม

        // แสดงข้อมูลฝ่าย/แผนกใน div
        this.UserForm.get('deptCode').setValue(data.dept.deptcode);
        this.UserForm.get('code').setValue(data.dept.code);

        // ตรวจสอบและกำหนดค่า level เดิม
        if (this.userIdToUpdate !== undefined && this.userIdToUpdate !== null) {
          this.Mservices.getUserById(this.userIdToUpdate).subscribe(
            (previousData: any) => {
              const previousLevel = previousData.budget.level;
              if (previousLevel) {
                // กำหนดค่า level เดิม
                this.UserForm.get('budget.level').setValue(previousLevel);
              }
            },
            (error: any) => {
              console.error('Error getting previous data:', error);
            }
          );
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  onUpdateButtonClick(): void {
    if (this.userIdToUpdate !== undefined && this.userIdToUpdate !== null) {
      if (this.UserForm.valid) {
        const userData = this.UserForm.value;

        // ตรวจสอบว่ามีค่าใน deptCode และ budget.level
        if (userData.deptCode && userData.budget && userData.budget.level) {
          // ดำเนินการอัปเดตข้อมูลเฉพาะ level และ code
          const updatedData = {
            budget: {
              level: userData.budget.level,
            },
            dept: {
              code: userData.dept.code,
            },
            // แนบฟิลด์อื่นๆที่คุณไม่ต้องการให้อัพเดท
            remark: userData.remark,
            email: userData.email,
            tprefix: userData.tprefix,
            tsurname: userData.tsurname,
            tposition: userData.tposition,
            tname: userData.tname,
          };

          // ดำเนินการอัปเดตข้อมูล
          this.Mservices.updateUser(this.userIdToUpdate, updatedData).subscribe(
            (response) => {
              console.log('อัปเดตข้อมูลสำเร็จ', response);
              // ทำบางอย่างหลังจากอัปเดตสำเร็จ (เช่น รีเฟรชหน้าหรือปรับปรุงข้อมูล)
            },
            (error) => {
              console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล', error);
            }
          );
        } else {
          console.log('กรุณากรอกข้อมูลให้ครบถ้วน');
        }
      } else {
        // กรณี Form ไม่ถูกต้อง
        console.log('กรุณากรอกข้อมูลให้ถูกต้อง');

        // ดูว่าฟิลด์ไหนทำให้ฟอร์มไม่ผ่านการตรวจสอบความถูกต้อง
        Object.keys(this.UserForm.controls).forEach((field) => {
          const control = this.UserForm.get(field);
          if (control instanceof FormControl && !control.valid) {
            console.log(`Field ${field} is INVALID`);
            // แสดงข้อความเกี่ยวกับข้อผิดพลาดที่ไม่ผ่านการตรวจสอบความถูกต้อง
          }
        });
      }
    } else {
      console.error('Invalid userId: undefined');
    }
  }

  onCancelUpdateButtonClick() {
    // ทำการยกเลิกการเลือกข้อมูล
    // ...

    // เปลี่ยนค่า isDataSelected เป็น false เพื่อซ่อนปุ่ม
    this.isDataSelected = false;
    this.isEditing = false;
  }

  onDeleteButtonClick(userId: number): void {
    this.Mservices.deleteUser(userId).subscribe(
      (response) => {
        console.log('User deleted successfully', response);
        // ทำอย่างอื่นตามต้องการหลังจากลบข้อมูลเรียบร้อย
      },
      (error) => {
        console.error('Error deleting user', error);
        // ทำอย่างอื่นตามต้องการหากเกิดข้อผิดพลาด
      }
    );
  }

  paginate(event : any) {
    this.tableRows = event.rows
    this.tablePages = event.page    
    this.loadEmployees()
    }
}
