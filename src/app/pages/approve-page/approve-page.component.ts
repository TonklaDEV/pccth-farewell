import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api-services/auth.service';
import { FtrOj1ServicesService } from 'src/app/api-services/ftr-oj1-services.service';

@Component({
  selector: 'app-approve-page',
  templateUrl: './approve-page.component.html',
  styleUrls: ['./approve-page.component.scss']
})
export class ApprovePageComponent implements OnInit {
  isDisabled: boolean = true;
  modal: boolean = false;
  searchForm: any;
  empName: any;
  empRole: any;
  dept: any;
  parentResult: any;

  //for record save date
  saveDate!: string;

  ////Form Group val
  sectionOne!: FormGroup;
  sectionTwo!: FormGroup;

  //Action Date val
  @ViewChild('trainDate') trainDate!: ElementRef<HTMLInputElement>;
  @ViewChild('getResultDate') getResultDate!: ElementRef<HTMLInputElement>;
  @ViewChild('testDate') testDate!: ElementRef<HTMLInputElement>;
  @ViewChild('getCerDate')
  getCerDate!: ElementRef<HTMLInputElement>;

  //Budget etc
  @ViewChild('onBudegetRadio') onBudegetRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('etcDetails') etcDetails!: ElementRef<HTMLInputElement>;
  @ViewChild('etcRadio') etcRadio!: ElementRef<HTMLInputElement>;

  //result Radio
  @ViewChild('passRadio') passRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('failRadio') failRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('noResultRadio') noResultRadio!: ElementRef<HTMLInputElement>;

  //[fail , none] cause
  @ViewChild('fCause') fCause!: ElementRef<HTMLInputElement>;
  @ViewChild('nCause') nCause!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public ftroj1: FtrOj1ServicesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      empName: new UntypedFormControl(null, [Validators.required]),
      empRole: new UntypedFormControl(null, [Validators.required]),
      dept: new UntypedFormControl(null, [Validators.required]),
      topic: new UntypedFormControl(null, [Validators.required]),
      startDate: new UntypedFormControl(null, [Validators.required]),
      endDate: new UntypedFormControl(null, [Validators.required]),
    });
    this.sectionOne = this.fb.group({
      of1_id: [''],
      deptCode: ['', Validators.required],
      dept: ['', Validators.required],
      date: [''],
      topic: ['', Validators.required],
      objt: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      fee: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      budget: ['', Validators.required],
      empCode: ['', Validators.required],
      empName: ['', Validators.required],
      empRole: ['', Validators.required],
      action: ['', Validators.required],
      actionDate: ['', Validators.required],
    });
    this.sectionTwo = this.fb.group({
      evaluatorName: ['', Validators.required],
      evaluatorRole: ['', Validators.required],
      evaluatorDept: ['', Validators.required],
      evaluatorSector: ['', Validators.required],
      resultOne: ['', Validators.required],
      resultTwo: ['', Validators.required],
      resultThree: ['', Validators.required],
      resultFour: ['', Validators.required],
      resultFive: ['', Validators.required],
      resultSix: ['', Validators.required],
      resultSeven: ['', Validators.required],
      comment: [''],
      result: ['', Validators.required],
      cause: [''],
      plan: [''],
    });
    // this.searchForm.get('startDate').valueChanges.subscribe((startDateValue: string | number | Date) => {
    //   // ทำเช็คว่าค่า startDateValue ไม่ใช่ null และไม่ใช่ว่างเปล่า
    //   if (startDateValue) {
    //     // คำนวณวันที่สิ้นสุด
    //     const endDateValue = new Date(startDateValue);
    //     //endDateValue.setDate(endDateValue.getDate() + 7); // เช่น 7 วันหลังจากวันที่เริ่มอบรม

    //     // กำหนดค่าให้กับฟิลด์ "วันที่สิ้นสุด"
    //     this.searchForm.get('endDate').patchValue(endDateValue.toISOString().split('T')[0]);
    //   }
    // });
    this.getFindAll();

    console.log('in approve');
    const role = this.authService.checkRole();
    if (role !== 'ROLE_Approver' && role !== 'ROLE_VicePresident' && role !== 'ROLE_Personnel') {
      this.router.navigate(['/pccth']);
    }
    

  }

  modalToggle() {
    this.modal = true;
  }

  // searchBtn() {
  //   console.log('click')
  //   console.log(this.searchForm.valid)
  //   console.log(this.searchForm.value);
  //   this.empName = this.searchForm.value.empName;
  //   this.empRole = this.searchForm.value.empRole;
  //   this.dept = this.searchForm.value.dept;
  //   this.searchForm.reset();

  // }

  getFindAll() {
    console.log('click');
    this.ftroj1.getFindAll().subscribe({
      next: (result) => {
        // ทำการเรียงลำดับข้อมูลโดยใช้ sortData()
        this.parentResult = this.ftroj1.sortData(result, 'of1_id', 'asc'); // เรียงข้อมูลตามคอลัมน์ 'propertyName' ในลำดับ 'asc'
        //this.parentResult = result;
        console.log('testtt', this.parentResult);
      },
      error: console.log,
    });
  }

  deleteById(id: number) {
    console.log('delete in Post', id);
    if (confirm('Do you want to delete?')) {
      this.ftroj1.deleteId(id).subscribe({
        next: (result) => {},
        error: console.log,
      });
    }
    location.reload();
  }

  // deleteById(id: number) {
  //   console.log("delete in Post", id);
  //   if (confirm("Do you want to delete?")) {
  //     this.ftroj1.deleteId(id).subscribe(
  //       (result) => {
  //         alert('Delete Success');

  //         // รับข้อมูลใหม่จาก API โดยใช้ Observable
  //         this.ftroj1.getFindAll().subscribe(
  //           (data) => {
  //             // ส่งข้อมูลใหม่ผ่าน EventEmitter ให้คอมโพเนนต์อื่น ๆ รับข้อมูลใหม่
  //             this.onRefresh.emit(data);

  //             // ทำอะไรกับข้อมูลที่ได้รับ, เช่น การตั้งค่าตัวแปรใหม่
  //             this.data = data;
  //           },
  //           (error: any) => console.error(error) // รับข้อมูลผิดพลาด
  //         );
  //       },
  //       (error) => console.error(error) // การลบผิดพลาด
  //     );
  //   }
  // }

  refreshBtn() {
    // Use location.reload() to refresh the window
    location.reload();
    // Reset the form
    // this.trainingForm.reset();
    // // แสดงให้ year และ department สามารถกรอกข้อมูลได้
    // this.trainingForm.get('year').enable();
    // this.trainingForm.get('department').enable();

    // // เปลี่ยนค่าข้อความใน <p> เป็น "..."
    // this.yearAndDepartment.nativeElement.innerHTML = 'Training Need for year ...<br>ฝ่าย/แผนก ...';
  }

  // openDialog() {
  //   this.dialog.open(FtrOj1PageComponent, {
  //     width: '50%'

  //   }).beforeClosed().subscribe(() => {
  //     this.getFindAll();
  //     console.log("Find", this.getFindAll);

  //   })
  // }

  // getSearch(){
  //   console.log('click')
  //   this.ftroj1.getSearchEmpName( this.searchForm.value.empName).subscribe({
  //     next: (result) => {
  //       this.parentResult = result;
  //       console.log("testtt", this.parentResult);

  //     },

  //     error: console.log,

  //   })
  // }

  // getSearch() {
  //   console.log('click');

  //   const searchEmpName$ = this.ftroj1.getSearchEmpName(this.searchForm.value.empName);
  //   const searchEmpRole$ = this.ftroj1.getSearchEmpRole(this.searchForm.value.empRole);
  //   // const searchDept$ = this.ftroj1.getSearchDept(this.searchForm.value.dept);

  //   forkJoin([searchEmpName$, searchEmpRole$,]).subscribe(
  //     ([resultEmpName, resultEmpRole]) => {
  //       // ทำอะไรกับผลลัพธ์ที่ได้รับจากทุก Observable ที่เรียก API ได้ที่นี่
  //       console.log('Result from searchEmpName:', resultEmpName);
  //       console.log('Result from searchEmpRole:', resultEmpRole);
  //       // console.log('Result from searchDept:', resultDept);

  //       // สร้างออบเจ็กต์หรืออะเรย์เพื่อรวมข้อมูล
  //       const combinedResult = { resultEmpName, resultEmpRole };

  //       // กำหนดค่า this.parentResult เท่ากับ combinedResult
  //       this.parentResult = combinedResult;
  //     },
  //     (error) => {
  //       console.error('Error:', error); // จัดการข้อผิดพลาดที่เกิดขึ้น
  //     }
  //   );
  // }

  // getSearch() {
  //   const empName = this.searchForm.value.empName; // ดึงค่า empName จากฟอร์ม
  //   const empRole = this.searchForm.value.empRole;
  //   const dept = this.searchForm.value.dept;
  //   const topic = this.searchForm.value.topic;
  //   // เรียกใช้งาน Service และส่งค่า empName ไปยัง API
  //   this.ftroj1.search(empName,empRole,dept,topic).subscribe((data) => {
  //     // ทำอะไรกับข้อมูลที่ได้รับจาก API ที่นี่
  //     this.parentResult = data;
  //     console.log(data);
  //   });
  // }

  getSearch() {
    const searchParams: any = {};

    if (this.searchForm.value.empName) {
      searchParams.empName = this.searchForm.value.empName;
    }

    if (this.searchForm.value.empRole) {
      searchParams.empRole = this.searchForm.value.empRole;
    }

    if (this.searchForm.value.dept) {
      searchParams.department = this.searchForm.value.dept;
    }

    if (this.searchForm.value.topic) {
      searchParams.topic = this.searchForm.value.topic;
    }
    if (this.searchForm.value.startDate) {
      searchParams.startDate = this.searchForm.value.startDate;
    }
    if (this.searchForm.value.endDate) {
      searchParams.endDate = this.searchForm.value.endDate;
    }

    // เรียกใช้งาน Service และส่งค่า searchParams ไปยัง API
    this.ftroj1.search(searchParams).subscribe((data) => {
      // ทำอะไรกับข้อมูลที่ได้รับจาก API ที่นี่
      this.parentResult = data;
      console.log(data);
      // เคลียร์ค่าในฟอร์ม
    });
    this.searchForm.reset();
  }

  isSearchDisabled() {
    // ตรวจสอบว่าอย่างน้อยหนึ่งฟิลด์มีค่าที่ไม่ว่างเปล่า
    const formValues = this.searchForm.value;
    return Object.values(formValues).every(
      (value) => value === '' || value === null
    );
  }

  // register() {
  //   if (!this.searchForm.valid) {
  //     return;
  //   }
  //   this.authService.register(this.searchForm.value).pipe(
  //     // If registration was successfull, then navigate to login route
  //     tap(() => this.router.navigate(['../login']))
  //   ).subscribe();
  // }

  showModal = false;
  toggleModal() {
    this.showModal = !this.showModal;
  }

  createEditForm(id: number) {
    this.toggleModal();
    this.ftroj1.getDatabyId(id).subscribe((res) => {
      this.populateFormGroup(this.sectionOne, res);
      this.populateFormGroup(this.sectionTwo, res);

      this.formatDateFields(
        ['date', 'startDate', 'endDate', 'actionDate'],
        this.sectionOne
      );
      this.initActionDate(this.sectionOne.get('action')?.value);

      // ตรวจสอบค่า budget และตั้งค่า etcRadio และ etcDetails ตามค่าที่ได้
      if (this.sectionOne.get('budget')?.value != 'อยู่ในงบประมาณ') {
        this.etcRadio.nativeElement.checked = true;
        this.etcDetails.nativeElement.value =
          this.sectionOne.get('budget')?.value;
      } else if (this.sectionOne.get('budget')?.value == 'อยู่ในงบประมาณ') {
        this.onBudegetRadio.nativeElement.checked = true;
        this.etcDetails.nativeElement.value = '';
      }
      this.resultSelect(this.sectionTwo.get('result')?.value);
      this.safeSaveDate();
    });
  }

  populateFormGroup(formGroup: FormGroup, data: any) {
    const formControls = formGroup.controls;

    for (const key in data) {
      if (formControls[key]) {
        formControls[key].setValue(data[key]);
      }
    }
  }

  formatDateFields(fields: string[], formGroup: FormGroup) {
    fields.forEach((field) => {
      const control = formGroup.get(field);
      if (control) {
        control.setValue(this.formatDate(control.value));
      }
    });
  }

  formatDate(date: string) {
    const dateFormatted = date.split(' ');
    return dateFormatted[0];
    // if (date){
    //   const dateFormatted = date.split(' ');
    // return dateFormatted[0];
    // }
    // return date
  }

  setInputValues = (
    train: string,
    getResult: string,
    test: string,
    getCer: string
  ) => {
    this.trainDate.nativeElement.value = train;
    this.getResultDate.nativeElement.value = getResult;
    this.testDate.nativeElement.value = test;
    this.getCerDate.nativeElement.value = getCer;
  };

  initActionDate(action: string) {
    const actionDateControl = this.sectionOne.get('actionDate');

    if (actionDateControl) {
      switch (action) {
        case 'training':
          this.setInputValues(actionDateControl.value, '', '', '');
          break;
        case 'getResult':
          this.setInputValues('', actionDateControl.value, '', '');
          break;
        case 'test':
          this.setInputValues('', '', actionDateControl.value, '');
          break;
        case 'getCertificate':
          this.setInputValues('', '', '', actionDateControl.value);
          break;
        default:
          this.setInputValues('', '', '', '');
      }
    }
  }

  changeActionDate(action: string) {
    switch (action) {
      case 'train':
        this.sectionOne.get('action')?.setValue('training');
        this.sectionOne
          .get('actionDate')
          ?.setValue(this.trainDate.nativeElement.value);
        this.setInputValues(
          this.sectionOne.get('actionDate')?.value,
          '',
          '',
          ''
        );
        break;
      case 'getResult':
        this.sectionOne.get('action')?.setValue('getResult');
        this.sectionOne
          .get('actionDate')
          ?.setValue(this.getResultDate.nativeElement.value);
        this.setInputValues(
          '',
          this.sectionOne.get('actionDate')?.value,
          '',
          ''
        );
        break;
      case 'test':
        this.sectionOne.get('action')?.setValue('test');
        this.sectionOne
          .get('actionDate')
          ?.setValue(this.testDate.nativeElement.value);
        this.setInputValues(
          '',
          '',
          this.sectionOne.get('actionDate')?.value,
          ''
        );
        break;
      case 'getCer':
        this.sectionOne.get('action')?.setValue('getCertificate');
        this.sectionOne
          .get('actionDate')
          ?.setValue(this.getCerDate.nativeElement.value);
        this.setInputValues(
          '',
          '',
          '',
          this.sectionOne.get('actionDate')?.value
        );
        break;
    }
  }

  edit() {

    //RESULT CAUSE CHECK
    if(this.sectionTwo.get("result")?.value == 'pass'){
      this.sectionTwo.get("cause")?.setValue('')
    }
    this.sectionOne.get('date')?.setValue(this.saveDate);
    let Dataset = Object.assign(this.sectionOne.value, this.sectionTwo.value);
    console.log(this.sectionOne.value.budget);
    console.log(JSON.stringify(Dataset));

    this.ftroj1.editData(Dataset);
    alert('แก้ไขสำเร็จ');
    this.toggleModal();
    setTimeout(() => {
      window.location.reload();
    }, 500); // 1000 มิลลิวินาทีหรือ 1 วินาที
  }

  etcSelect() {
    this.etcRadio.nativeElement.checked = true;
    this.sectionOne
      .get('budget')
      ?.setValue(this.etcDetails.nativeElement.value);
  }

  onBudeget() {
    this.etcDetails.nativeElement.value = '';
    this.onBudegetRadio.nativeElement.checked = true;
  }

  calculateResult() {
    let radioLabel = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
    let pass = 0;
    for (let index = 0; index < radioLabel.length; index++) {
      if (this.sectionTwo.get('result' + radioLabel[index])?.value === 'pass') {
        pass++;
      }
    }

    if (pass >= 4) {
      return 'pass';
    } else {
      return 'fail';
    }
  }

  resultSelect(result: string) {
    if (result == 'pass') {
      this.passRadio.nativeElement.checked = true;
      this.passRadio.nativeElement.disabled = false;
      this.sectionTwo.get('result')?.setValue('pass');
      this.failRadio.nativeElement.disabled = true;
      this.noResultRadio.nativeElement.disabled = true;
      this.fCause.nativeElement.disabled = true;
      this.nCause.nativeElement.disabled = true;
      this.nCause.nativeElement.value = '';
      this.fCause.nativeElement.value = '';
      this.sectionTwo.get('plan')?.setValue('')
    } else if (result == 'fail') {
      this.passRadio.nativeElement.disabled = true;
      this.noResultRadio.nativeElement.disabled = false;
      this.failRadio.nativeElement.disabled = false;
      this.sectionTwo.get('result')?.setValue('fail');
      this.fCause.nativeElement.disabled = false;
      this.nCause.nativeElement.disabled = true;
      this.nCause.nativeElement.value = '';
      this.fCause.nativeElement.value = this.sectionTwo.get('cause')?.value;
    } else if (result == 'noResult') {
      this.passRadio.nativeElement.disabled = true;
      this.noResultRadio.nativeElement.disabled = false;
      this.failRadio.nativeElement.disabled = false;
      this.sectionTwo.get('result')?.setValue('noResult');
      this.nCause.nativeElement.disabled = false;
      this.fCause.nativeElement.disabled = true;
      this.fCause.nativeElement.value = '';
      this.nCause.nativeElement.value = this.sectionTwo.get('cause')?.value;
    }
  }

  notPassSelect(selected: string) {
    if (selected == 'fail') {
      this.nCause.nativeElement.value = '';
      this.nCause.nativeElement.disabled = true;
      this.fCause.nativeElement.disabled = false;
    } else if (selected == 'noResult') {
      this.fCause.nativeElement.value = '';
      this.fCause.nativeElement.disabled = true;
      this.nCause.nativeElement.disabled = false;
    }
  }

  safeSaveDate() {
    const setDate = this.ftroj1.getDatabyId(
      this.sectionOne.get('of1_id')?.value
    );
    setDate.subscribe((res) => {
      this.saveDate = res.date;
    });
  }

  ////
  //เพิ่ม .00 ออโต้
  onBlurFee(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value.trim();

    if (inputValue !== '') {
      if (inputValue.includes('.')) {
        const parts = inputValue.split('.');
        if (parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
          inputValue = parts.join('.');
        }
      } else {
        inputValue += '.00';
      }

      inputElement.value = inputValue;

      //this.sectionOne.get('fee').setValue(inputValue);
    }
  }

  invalidFeeInput: boolean = false;
  invaliddeptCodeInput: boolean = false;
  invalidempCodeInput: boolean = false;

  //ควบคุมการป้อนข้อมูลให้รับเฉพาะตัวเลขเท่านั้น
  onInputKeyPressFee(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    // ตรวจสอบว่าถ้ามีจุดอยู่แล้ว และผู้ใช้กดจุดอีกครั้ง
    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidFeeInput = true;
    }
    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidFeeInput = true;
    } else {
      this.invalidFeeInput = false;
    }
  }

  onInputKeyPressdeptCode(event: KeyboardEvent) {
    const inputChar = event.key;
    if (!/^\d$/.test(inputChar)) {
      event.preventDefault();
      this.invaliddeptCodeInput = true;
    } else {
      this.invaliddeptCodeInput = false;
    }
  }

  onInputKeyPressempCode(event: KeyboardEvent) {
    const inputChar = event.key;
    if (!/^\d$/.test(inputChar)) {
      event.preventDefault();
      this.invalidempCodeInput = true;
    } else {
      this.invalidempCodeInput = false;
    }
  }

}
