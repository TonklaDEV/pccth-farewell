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
<<<<<<< HEAD
import Swal from 'sweetalert2';




=======
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f

@Component({
  selector: 'app-manage-user-page',
  templateUrl: './manage-user-page.component.html',
  styleUrls: ['./manage-user-page.component.scss'],
})
export class ManageUserPageComponent implements OnInit {
<<<<<<< HEAD


=======
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
  emps: any;
  UserForm: any;
  invalidNoInput: boolean = false;
  isDataSelected: boolean = false;
  isEditing: boolean = false;
  selectedUserId: number | null = null;
  userIdToUpdate: any;
<<<<<<< HEAD




  constructor(

=======
  tableRows = 10;
  tablePages = 0;
  tableTotalRecord = 0;
  constructor(
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
    private Mservices: ManageUserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

<<<<<<< HEAD


  ngOnInit(): void {
    this.UserForm = this.formBuilder.group({
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

=======
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

>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
    console.log('in manage-user');
    this.loadEmployees();
  }

<<<<<<< HEAD





=======
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
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
<<<<<<< HEAD

=======
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f

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
<<<<<<< HEAD
  dept = this.pccDept

  //for switch option in dept selector
  company !: string
  selectCompany(company: string) {
    this.company = company
=======
  dept = this.pccDept;

  //for switch option in dept selector
  company!: string;
  selectCompany(company: string) {
    this.company = company;
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
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
<<<<<<< HEAD

  }

  //gen dept CODE after select dept NAME
  setDept() { 
    this.UserForm.get('deptCode').setValue(this.UserForm.get('dept').value[1])
  
=======
  }

  //gen dept CODE after select dept NAME
  setDept() {
    this.UserForm.get('deptCode').setValue(this.UserForm.get('dept').value[1]);
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
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
<<<<<<< HEAD
    this.Mservices.getEmployees(0, 5, sort).subscribe(
      (data: any) => {
        this.emps = (data.content);

        //เพื่อดูตัวแปล
        console.log(data.content);

=======
    this.Mservices.getEmployees(this.tablePages, this.tableRows, sort).subscribe(
      (data: any) => {
        this.emps = data.content;
        this.tableTotalRecord = data.totalElements;
        //เพื่อดูตัวแปล
        // console.log(data.content);
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

<<<<<<< HEAD


=======
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
  onEditButtonClick(userId: number): void {
    this.isDataSelected = true;
    this.isEditing = true;
    this.selectedUserId = userId;
    this.userIdToUpdate = userId; // เพิ่มบรรทัดนี้

    this.Mservices.getUserById(userId).subscribe(
      (data: any) => {
        // ทำการแปลงรูปแบบวันที่จาก API
        data.startDate = new Date(data.startDate).toISOString().split('T')[0];

<<<<<<< HEAD
        // const budgetData = data.budget;
        // if (budgetData) {
        //   this.UserForm.get('level').setValue(budgetData.level);
        //   console.log('Level from API:', budgetData.level);
        // }
        const selectedDeptName = data.dept[0]; // เลือกตำแหน่งที่ 0 จาก Array นี้
    this.UserForm.get('dept').setValue(selectedDeptName);
=======
        const budgetData = data.budget;
        if (budgetData) {
          this.UserForm.get('budget.level').setValue(budgetData.level);
          console.log('Level from API:', budgetData.level);
        }
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f

        this.UserForm.patchValue(data); // ใช้ patchValue เพื่อกำหนดค่าข้อมูลในฟอร์ม

        // แสดงข้อมูลฝ่าย/แผนกใน div
<<<<<<< HEAD
        this.UserForm.get('deptid').setValue(data.dept.deptid);
        this.UserForm.get('level').setValue(data.budget.level);
        // this.UserForm.get('dept').setValue(data.dept.deptcode);
        this.UserForm.get('deptCode').setValue(data.dept.code);
        this.UserForm.get('empId').setValue(data.empid);
=======
        this.UserForm.get('deptCode').setValue(data.dept.deptcode);
        this.UserForm.get('code').setValue(data.dept.code);
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f

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

<<<<<<< HEAD

=======
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
  onUpdateButtonClick(): void {
    console.log(this.UserForm.value);

    if (this.userIdToUpdate !== undefined && this.userIdToUpdate !== null) {
<<<<<<< HEAD
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


=======
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
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
    } else {
      console.error('Invalid userId: undefined');
    }
    // window.location.reload();
  }
<<<<<<< HEAD



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

=======
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f

  onCancelUpdateButtonClick() {
    // ทำการยกเลิกการเลือกข้อมูล
    // ...

    // เปลี่ยนค่า isDataSelected เป็น false เพื่อซ่อนปุ่ม
    this.isDataSelected = false;
    this.isEditing = false;
  }

  onDeleteButtonClick(userId: number): void {
<<<<<<< HEAD
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

=======
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
>>>>>>> 33f1f54549b1d000f83765ab8a04488b08115e2f
}
