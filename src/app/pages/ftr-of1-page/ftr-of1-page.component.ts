import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/api-services/auth.service';
import { FtrOf1Service } from 'src/app/api-services/ftr-of1.service';
import { FtrOj1ServicesService } from 'src/app/api-services/ftr-oj1-services.service';

@Component({
  selector: 'app-ftr-of1-page',
  templateUrl: './ftr-of1-page.component.html',
  styleUrls: ['./ftr-of1-page.component.scss'],
})
export class FtrOf1PageComponent implements OnInit {
  @ViewChild('picker') picker!: ElementRef;
  @ViewChild('textInput') textInput!: ElementRef;

  updateTextInputValue() {
    const pickerValue = this.picker.nativeElement.value; // ดึงค่าจาก #picker
    this.textInput.nativeElement.value = pickerValue; // กำหนดค่าใน <input>
  }
  //company selected
  @ViewChild('pccSelected') pccSelected!: ElementRef<HTMLInputElement>;
  @ViewChild('wsSelected') wsSelected!: ElementRef<HTMLInputElement>;

  //snacknbar postion
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  sectionOne: any;
  sectionTwo: any;

  @ViewChild('fCause') fCause!: ElementRef<HTMLInputElement>;
  @ViewChild('nCause') nCause!: ElementRef<HTMLInputElement>;
  @ViewChild('etcRadio') etcRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('etcDetails') etcDetails!: ElementRef<HTMLInputElement>;
  @ViewChild('passRadio') passRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('failRadio') failRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('noResultRadio') noResultRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('trainingRadio') trainingRadio!: ElementRef<HTMLInputElement>;
  // @ViewChild('getResultRadio') getResultRadio!: ElementRef<HTMLInputElement>;
  // @ViewChild('testRadio') testRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('getCertificateRadio')
  getCertificateRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('trainingDate') trainingDate!: ElementRef<HTMLInputElement>;
  // @ViewChild('getResultDate') getResultDate!: ElementRef<HTMLInputElement>;
  // @ViewChild('testDate') testDate!: ElementRef<HTMLInputElement>;
  @ViewChild('getCertificateDate')
  getCertificateDate!: ElementRef<HTMLInputElement>;
  notPass: Boolean = false;

  startDate!: Date;
  endDate!: Date;
  showAlert: boolean = false;

  //ZONE declare data set
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

  topic_ojt!: string;
  topic_date!: string;
  topic_location!: string;
  topic_inst!: string;
  //topic dataset
  topics = [
    {
      name: 'BA Fundamental',
      ojt: 'พัฒนาศักยภาพของพนักงาน',
      date: '10/5/2023-11/1/2023',
      time: '9.00-16.30',
      location: '102/99 ถนน ณ ระนอง คลองเตย กรุงเทพฯ',
      inst: 'คุณนิทัศน์ ,คุณเงาะ ,คุณนักสู้ ,คุณชำนาญ',
    },
    {
      name: 'Introduction to Microservice รุ่น 5',
      ojt: 'พัฒนาศักยภาพของพนักงาน',
      date: '8/10/2023-8/11/2023',
      time: '9.00-16.30',
      location: 'Online ผ่าน Program Microsoft Teams',
      inst: 'คุณนิทัศน์ หวังวิบูลย์กิจ',
    },
  ];

  genDataTopic() {
    const selectedTopic = this.sectionOne.get('topic')?.value;
    const selectedTopicObject = this.topics.find(
      (topic: any) => topic.name === selectedTopic
    );

    if (selectedTopicObject) {
      this.topic_ojt = selectedTopicObject.ojt;
      this.topic_location = selectedTopicObject.location;
      this.topic_inst = selectedTopicObject.inst;
      this.topic_date = selectedTopicObject.date + " " + selectedTopicObject.time;
      this.trainDateCtrl.setValue(this.topic_date)      
    } else {
      this.topic_ojt = '';
      this.topic_location = '';
      this.topic_inst = '';
      this.topic_date = '';
    }
  }
  //employee data set
  employees: string[] = [
    'ณัฐนรี แดงสกุล',
    'จารุวรรณ ไวปัญญา',
    'ณิชธิตรา เมฆาพงศ์พันธุ์',
  ];

  empobject = [
    {
      name : 'ณัฐนรี แดงสกุล',
      id : "000001",
      postion : "SR.APPLICATION SPECIALIST"
    },
    {
      name : 'จารุวรรณ ไวปัญญา',
      id : "000002",
      postion : "APPLICATION SPECIALIST"
    },
    {
      name : 'ณิชธิตรา เมฆาพงศ์พันธุ์',
      id : "000003",
      postion : "SR.ADMIN OFFICER II"
    },
  ]

  genEmpdata(){
    console.log("gen emp ");
    
    const selectEmpName = this.empNameCtrl.value
    const empNameObj = this.empobject.find(
      (emp) => emp.name == selectEmpName
    )

    if (empNameObj) {
      this.sectionOne.get('empCode').setValue(empNameObj.id)
      this.sectionOne.get('empName').setValue(empNameObj.name)
      this.sectionOne.get('empRole').setValue(empNameObj.postion)
    }
    else{
      this.sectionOne.get('empCode').setValue("")
      this.sectionOne.get('empName').setValue("")
      this.sectionOne.get('empRole').setValue("")
    }
  }

  ceos = [
    { name: 'คุณ พัชรินทร์' },
    { name: 'คุณ วาณี' },
    { name: 'คุณ สุริยา' },
    { name: 'คุณ ประวิทย์' },
    { name: 'คุณ เสาวภา' },
    { name: 'คุณ ณัฐวรรณ' },
  ];

  filteredOptions: Observable<string[]> | undefined;

  onDateClick(typeRadio: string) {
    if (typeRadio === 'training') {
      this.trainingRadio.nativeElement.checked = true;
      this.dateSelected(typeRadio);
      this.sectionOne
        .get('actionDate')
        .setValue(this.trainingDate.nativeElement.value);
    }
    // else if (typeRadio === 'getResult') {
    //   this.getResultRadio.nativeElement.checked = true;
    //   this.dateSelected(typeRadio);
    //   this.sectionOne
    //     .get('actionDate')
    //     .setValue(this.getResultDate.nativeElement.value);
    // } else if (typeRadio === 'test') {
    //   this.testRadio.nativeElement.checked = true;
    //   this.dateSelected(typeRadio);
    //   this.sectionOne
    //     .get('actionDate')
    //     .setValue(this.testDate.nativeElement.value);
    // }
    else if (typeRadio === 'getCertificate') {
      this.getCertificateRadio.nativeElement.checked = true;
      this.dateSelected(typeRadio);
      this.sectionOne
        .get('actionDate')
        .setValue(this.getCertificateDate.nativeElement.value);
    }
  }

  dateSelected(action: String) {
    this.sectionOne.get('action').setValue(action);
    switch (action) {
      case 'training':
        this.getCertificateDate.nativeElement.value = '';
        // this.getResultDate.nativeElement.value = '';
        // this.testDate.nativeElement.value = '';
        break;
      // case 'getResult':
      //   this.getCertificateDate.nativeElement.value = '';
      //   this.trainingDate.nativeElement.value = '';
      //   this.testDate.nativeElement.value = '';
      //   break;
      // case 'test':
      //   this.getCertificateDate.nativeElement.value = '';
      //   this.trainingDate.nativeElement.value = '';
      //   this.getResultDate.nativeElement.value = '';
      //   break;
      case 'getCertificate':
        // this.getResultDate.nativeElement.value = '';
        this.trainingDate.nativeElement.value = '';
        // this.testDate.nativeElement.value = '';
        break;
    }
  }

  // sectionOne = new FormGroup({
  //   code: new FormControl('')
  // });

  empNameCtrl = new FormControl('');
  trainDateCtrl = new FormControl('');
  
  constructor(
    private fb: FormBuilder,
    private service: FtrOf1Service,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private ojService: FtrOj1ServicesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.sectionOne = this.fb.group({
      deptCode: ['', Validators.required],
      dept: ['', Validators.required],
      date: [new Date().toLocaleDateString('en-CA')],
      topic: ['', Validators.required],
      objt: ['', Validators.required],
      startDate: [''],
      endDate: [''],
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
      evaluatorName: [''],
      evaluatorRole: [''],
      evaluatorDept: [''],
      evaluatorSector: [''],
      resultOne: [''],
      resultTwo: [''],
      resultThree: [''],
      resultFour: [''],
      resultFive: [''],
      resultSix: [''],
      resultSeven: [''],
      comment: [''],
      result: [''],
      cause: [''],
      plan: [''],
    });
  }
  ngOnInit(): void {
    console.log('in ftr-of1')
    const role = this.authService.checkRole();
    if (role !== 'ROLE_Admin'){
      this.router.navigate(['/pccth']);
    }
    this.filteredOptions = this.empNameCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.employees.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  save() {
    const trainDate = this.trainDateCtrl.value?.split(" ")[0]
    const startDate = trainDate?.split('-')[0]
    const endDate = trainDate?.split('-')[1]
    if (startDate && endDate) {
      this.sectionOne.get('startDate').setValue(new Date(startDate).toLocaleDateString('en-CA'));
      this.sectionOne.get('endDate').setValue(new Date(endDate).toLocaleDateString('en-CA'));
    } else {
      console.error('startDate or endDate is undefined');
    }
    try {
      this.sectionOne
        .get('dept')
        .setValue(this.sectionOne.get('dept').value[0]);
      let Dataset = Object.assign(this.sectionOne.value, this.sectionTwo.value);
      console.log(Dataset);
      console.log(JSON.stringify(Dataset));
      
      this.service.saveData(Dataset);
      this._snackBar.open('บันทึกข้อมูลสำเร็จ', 'ปิด', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      // เมื่อเจอ error
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
      this._snackBar.open('บันทึกข้อมูลไม่สำเร็จ', 'ปิด', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  // onSubmit(){
  //   console.log(this.sectionOne.value);
  // }

  private formatDate(date: string) {
    const parts = date.split('/');
  if (parts.length !== 3) {
    throw new Error('Invalid date format. Please use dd/mm/yyyy.');
  }

  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2];

  return `${date}/-{month}-${day}`;
  }

  onBudgetClick() {
    this.etcDetails.nativeElement.value = '';
  }

  etcSelect() {
    this.etcRadio.nativeElement.checked = true;
    this.sectionOne
      .get('budget')
      ?.setValue(this.etcDetails.nativeElement.value);
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
      this.notPass = false;
      return 'pass';
    } else {
      this.notPass = true;
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

      this.sectionOne.get('fee').setValue(inputValue);
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

  onInputKeyPressempCode(event: KeyboardEvent) {
    const inputChar = event.key;
    if (!/^\d$/.test(inputChar)) {
      event.preventDefault();
      this.invalidempCodeInput = true;
    } else {
      this.invalidempCodeInput = false;
    }
  }

  genNewDateSTR(): string {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  selectCompany(company: string) {
    this.company = company;
    console.log(this.company);
    if (company == 'pcc') {
      this.dept = this.pccDept;
      //First dept pcc select
      this.sectionOne.get('dept').setValue('');
      this.sectionOne.get('deptCode').setValue('');
    } else if (company == 'ws') {
      this.dept = this.wsDept;
      //First dept ws select
      this.sectionOne.get('dept').setValue('');
      this.sectionOne.get('deptCode').setValue('');
    }
  }

  //gen dept CODE after select dept NAME
  setDept() {
    this.sectionOne
      .get('deptCode')
      .setValue(this.sectionOne.get('dept').value[1]);
  }
}
