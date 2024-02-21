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
import Swal from 'sweetalert2';





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
  tableRows = 5;
  tablePages = 0;
  tableTotalRecord = 0;
  constructor(
    private Mservices: ManageUserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.UserForm = this.formBuilder.group({
      company: [''],
      level: ['', Validators.required],
      deptid: ['', Validators.required],
      deptCode: ['', Validators.required],
      empId: ['', Validators.required],
      tname: ['', Validators.required],
      tprefix: ['', Validators.required],
      remark: ['', Validators.required],
      startDate: ['', Validators.required],
      tsurname: ['', Validators.required],
      tposition: ['', Validators.required],
      email: ['', Validators.email],
      dept: ['', Validators.required]
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
    { name: 'SQA', code: '4013' },
    { name: 'SM', code: '5015' },
    { name: 'SE', code: '5011' },
    { name: 'SD1', code: '4012' },
    { name: 'SD2', code: '4011' },
    { name: 'PM', code: '7011' },
    { name: 'NS', code: '5014' },
    { name: 'MS', code: '3011' },
    { name: 'HQ', code: '8011' },
    { name: 'FSI', code: '1011' },
    { name: 'FM', code: '6011' },
    { name: 'DT', code: '7012' },
    { name: 'CS',code: '5012' },
    { name: 'CE', code: '5013' },
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
  dept = this.pccDept

  //for switch option in dept selector
  company !: string
  selectCompany(company: string) {
    this.company = company
    console.log(this.company);
    if (company == 'pcc' ||  company == 'PCC') {
      this.dept = this.pccDept;
      //First dept pcc select
      this.UserForm.get('dept').setValue('');
      this.UserForm.get('deptCode').setValue('');
      this.UserForm.get('company').setValue('pcc')
    } else if (company == 'ws' || company == 'WiseSoft') {
      this.dept = this.wsDept;
      //First dept ws select
      this.UserForm.get('dept').setValue('');
      this.UserForm.get('deptCode').setValue('');
      this.UserForm.get('company').setValue('ws')
    }

  }

  //gen dept CODE after select dept NAME
  setDept() {
    const deptName = this.UserForm.get('dept').value
    const deptCode = this.dept.find((item: any) => item.name === deptName)?.code || '';
    this.UserForm.get('deptCode').setValue(deptCode)
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
         console.log(data.content);
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

        const selectedDeptName = data.dept[0]; // เลือกตำแหน่งที่ 0 จาก Array นี้
        this.UserForm.get('dept').setValue(selectedDeptName);

        this.UserForm.patchValue(data); // ใช้ patchValue เพื่อกำหนดค่าข้อมูลในฟอร์ม

        // แสดงข้อมูลฝ่าย/แผนกใน div
        this.selectCompany(data.dept.company)
        this.UserForm.get('deptid').setValue(data.dept.deptid);
        this.UserForm.get('level').setValue(data.budget.level);
        this.UserForm.get('dept').setValue(data.dept.deptcode);
        this.UserForm.get('deptCode').setValue(data.dept.code);
        this.UserForm.get('empId').setValue(data.empid);

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
    console.log(this.UserForm.value);

    if (this.userIdToUpdate !== undefined && this.userIdToUpdate !== null) {
      const userData = this.UserForm.value;

      // ตรวจสอบว่ามีค่าใน deptCode และ budget.level


      // ดำเนินการอัปเดตข้อมูล
      this.Mservices.updateUser(this.userIdToUpdate, userData).subscribe(
        response => {
          console.log('อัปเดตข้อมูลสำเร็จ', response);
          // ทำบางอย่างหลังจากอัปเดตสำเร็จ (เช่น รีเฟรชหน้าหรือปรับปรุงข้อมูล)
        },
        error => {
          console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล', error);
        }
      );


    } else {
      console.error('Invalid userId: undefined');
    }
    // window.location.reload();
  }



  onCreateButtonClick(): void {

    const userData = this.UserForm.value;
    this.Mservices.createUser(userData).subscribe(
      response => {
        console.log('User created successfully', response);
        // ทำบางอย่างหลังจากสร้างข้อมูลสำเร็จ
      },
      error => {
        console.error('Error creating user', error);

        // // ตรวจสอบ Validation Errors จาก API
        // if (error.error && error.error.details && error.error.details.length > 0) {
        //   console.log('Validation Errors:', error.error.details);
        // }

        // ทำอย่างอื่นตามต้องการหากเกิดข้อผิดพลาด
      }
    );
  }


  onCancelUpdateButtonClick() {
    // ทำการยกเลิกการเลือกข้อมูล
    // ...

    // เปลี่ยนค่า isDataSelected เป็น false เพื่อซ่อนปุ่ม
    this.isDataSelected = false;
    this.isEditing = false;
  }

  onDeleteButtonClick(userId: number): void {
    if (userId) {
      Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณกำลังจะลบผู้ใช้นี้!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          this.Mservices.deleteUser(userId).subscribe(
            (response: any) => {
              console.log('User deleted successfully:', response);
              Swal.fire('ลบแล้ว!', 'ผู้ใช้ถูกลบเรียบร้อยแล้ว!', 'success');
              // ทำอย่างอื่นตามต้องการหลังจากลบข้อมูลเรียบร้อย
            },
            (error: any) => {
              console.error('เกิดข้อผิดพลาดในการลบผู้ใช้:', error);
              Swal.fire('ข้อผิดพลาด!', 'เกิดข้อผิดพลาดในการลบผู้ใช้!', 'error');
              // ทำอย่างอื่นตามต้องการหากเกิดข้อผิดพลาด
            }
          );
        } else {
          console.log('การลบผู้ใช้ถูกยกเลิก');
        }
      });
    } else {
      console.error('ID ของผู้ใช้ไม่ได้ระบุ. ไม่สามารถลบได้.');
    }
  }

  paginate(event : any) {
    this.tableRows = event.rows
    this.tablePages = event.page
    this.loadEmployees()
    }

}
