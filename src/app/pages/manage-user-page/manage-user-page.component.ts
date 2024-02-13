import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api-services/auth.service';
import { ManageUserService } from 'src/app/api-services/manage-user.service';


@Component({
  selector: 'app-manage-user-page',
  templateUrl: './manage-user-page.component.html',
  styleUrls: ['./manage-user-page.component.scss']
})
export class ManageUserPageComponent implements OnInit {

  UserForm: any;
  invalidNoInput: boolean = false;

  constructor(
    private Mservice: ManageUserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.UserForm = this.formBuilder.group({
      deptCode: ['', Validators.required],
      dept: ['', Validators.required],
      empId: ['', Validators.required],
      firstname: ['', Validators.required],
      prefix: ['', Validators.required],
      remark: ['', Validators.required],
      startDate: ['', Validators.required],
      surname: ['', Validators.required],
      position: ['', Validators.required],
      mail: ['', Validators.email]
    });
    console.log(this.UserForm);

    console.log('in manage-user')
    // const role = this.authService.checkRole();
    // if (role !== 'ROLE_Admin'){
    //   this.router.navigate(['/pccth']);
    // }
    this.loadEmployees();
  }

  onSubmit() {
    if (this.UserForm.valid) {
      // ทำสิ่งที่คุณต้องการเมื่อยื่นฟอร์ม
      console.log(this.UserForm.value);
    }
    this.UserForm.reset();
  }

  ///////pcc-dept
  pccDept = [
    { name: "FSI", code: "1011" },
    { name: "PBS", code: "2011" },
    { name: "MS", code: "3011" },
    { name: "SD1", code: "4011" },
    { name: "SD2", code: "4012" },
    { name: "SQA", code: "4013" },
    { name: "SE", code: "5011" },
    { name: "CS", code: "5012" },
    { name: "CE", code: "5013" },
    { name: "NS", code: "5014" },
    { name: "SM", code: "5015" },
    { name: "OSS", code: "6011" },
    { name: "PM", code: "7011" },
    { name: "DT", code: "7012" },
    { name: "HQ", code: "8011" },
    { name: "AF", code: "9011" }
  ];
  //WiseSoft Dept
  wsDept = [
    { name: "HQ,AF", code: "1000" },
    { name: "MK", code: "2000" },
    { name: "APS", code: "2100" },
    { name: "APS (BOI)", code: "2200" },
    { name: "OSS", code: "3000" },
    { name: "OSS (BOI)", code: "3100" },
    { name: "TOP", code: "4000" },
    { name: "TOP (BOI)", code: "4100" },
    { name: "SD (BOI)", code: "5000" }
  ];
  //The Middle dept array
  dept = this.pccDept
    
  //for switch option in dept selector
  company !: string
  selectCompany(company:string){
    this.company = company
    console.log(this.company);
    if (company == 'pcc') {
      this.dept = this.pccDept
      //First dept pcc select
      this.UserForm.get('dept').setValue('')
      this.UserForm.get('deptCode').setValue("")

    }
    else if (company == 'ws') {
      this.dept = this.wsDept
      //First dept ws select
      this.UserForm.get('dept').setValue('')
      this.UserForm.get('deptCode').setValue("")
    }
    
  }

  //gen dept CODE after select dept NAME
  setDept() {
    this.UserForm.get('deptCode').setValue(this.UserForm.get('dept').value[1])
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
    this.Mservice.getEmployees(0, 10, sort).subscribe(
      (data: any)  => {
        console.log(data.content);
        
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  
}
