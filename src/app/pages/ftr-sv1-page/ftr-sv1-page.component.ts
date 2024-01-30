import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api-services/auth.service';
import { FtrSv1ServicesService } from 'src/app/api-services/ftr-sv1-services.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-ftr-sv1-page',
  templateUrl: './ftr-sv1-page.component.html',
  styleUrls: ['./ftr-sv1-page.component.scss']
})
export class FtrSv1PageComponent implements OnInit {

  // @ViewChild('yearAndDepartment', { static: false })
  // yearAndDepartment!: ElementRef;

  trainingForm: any;
  rows: Array<any> = [];
  year: any;
  department: any;
  // remark: string = '';
  total: number = 0; // เริ่มต้นค่า total เป็น 0

  readonlyYear: string | null = null;
  readonlyDepartment: string | null = null;





  constructor(
    private fb: FormBuilder, 
    private _service: FtrSv1ServicesService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.trainingForm = this.fb.group({
      year: ['', Validators.required],
      department: ['', Validators.required],
      position: ['', Validators.required],
      className: ['', Validators.required],
      no: ['', Validators.required],
      fee: ['', Validators.required],
      accommodation: ['', Validators.required],
      totalExp: ['', [Validators.required]],
      remark: ['', Validators.required]
    });

      console.log('in ftr-sv1')
      const role = this.authService.checkRole();
      if (role !== 'ROLE_VicePresident'){
        this.router.navigate(['/pccth']);
      }

  }


  getUserList() {
    this._service.Getuser().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: console.log,
    });
  }

  addSv1() {
    this._service.addSv1(this.trainingForm.value).subscribe({
      next: (res) => {
        alert('Add Successfully');
        console.log(res);
      },
      error: console.log,
    });
  }


  //สร้างฟังก์ชันสำหรับเพิ่มข้อมูล
  addSv1Btn() {
    // ดึงค่า year และ department จาก form
    const year = this.trainingForm.value.year;
    const department = this.trainingForm.value.department;

    if (this.rows.length === 0) {
      // ถ้า rows ยังไม่มีข้อมูลใด ๆ
      // คัดลอกค่า year และ department ไว้ในตัวแปร readonly
      this.readonlyYear = year;
      this.readonlyDepartment = department;
    }

    // สร้าง JSON จากค่า year และ department และข้อมูลจากฟอร์ม
    const rowData = {
      year: this.readonlyYear,
      department: this.readonlyDepartment,
      position: this.trainingForm.value.position,
      className: this.trainingForm.value.className,
      no: this.trainingForm.value.no,
      fee: this.trainingForm.value.fee,
      accommodation: this.trainingForm.value.accommodation,
      totalExp: this.trainingForm.value.totalExp,
      remark: this.trainingForm.value.remark

    };


    // เพิ่มข้อมูล JSON ลงใน this.rows
    this.rows.push(rowData);

    // เรียกใช้ calculateTotal() เมื่อมีการเปลี่ยนแปลงใน rows
    this.calculateTotal();

    // รีเซ็ตค่าใน trainingForm และตัวแปร year และ department
    this.trainingForm.reset({
      year: this.readonlyYear,
      department: this.readonlyDepartment,
    });

    //ปิดการแก้ไขช่อง input โดยตั้งค่าเป็น readonly
    this.trainingForm.get('year').disable();
    this.trainingForm.get('department').disable();

    console.log(rowData);

    this._service.addSv1(rowData).subscribe({
      next: (rowData) => {
        console.log(rowData);
      },
      error: console.log,
    });
  }



  // สร้างฟังก์ชันสำหรับรีเฟรชฟอร์ม
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

  calculateTotal() {
    this.total = 0; // เริ่มต้นค่า total เป็น 0


    // วนลูปผ่านข้อมูลใน rows เพื่อรวมค่าในคอลัมน์ totalExp
    for (const row of this.rows) {
      if (row.totalExp) {
        const numericValue = parseFloat(row.totalExp.replace(',', '')); // ลบ ',' ถ้ามี
        if (!isNaN(numericValue)) {
          this.total += numericValue;
        }
      }
    }

  }

  invalidTotalExpInput: boolean = false;
  invalidYearInput: boolean = false;
  invalidNoInput: boolean = false;
  invalidFeeInput: boolean = false;
  invalidAccommodationExpInput: boolean = false;

  //เพิ่ม .00 ออโต้
  onBlurTotal(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value.trim();

    if (inputValue !== '') {
      // Check if the input value contains a decimal point
      if (inputValue.includes('.')) {
        const parts = inputValue.split('.');
        if (parts[1].length > 2) {
          // Truncate the decimal part to 2 decimal places
          parts[1] = parts[1].substring(0, 2);
          inputValue = parts.join('.');
        }
      } else {
        // If there is no decimal point, add ".00"
        inputValue += '.00';
      }

      inputElement.value = inputValue;
      // Set the value of totalExp in the form control
      this.trainingForm.get('totalExp').setValue(inputValue);
    }
  }




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

      this.trainingForm.get('fee').setValue(inputValue);
    }
  }

  onBlurAccommodation(event: Event) {
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

      this.trainingForm.get('accommodation').setValue(inputValue);
    }
  }



  //ควบคุมการป้อนข้อมูลให้รับเฉพาะตัวเลขไม่เกิน 4 ตัวเท่านั้น
  onInputKeyPressYear(event: KeyboardEvent) {
    const inputChar = event.key;
    //const inputValue = (event.target as HTMLInputElement).value;

    // Check if the input is not a digit or if it's not exactly 4 digits
    if (!/^\d+$/.test(inputChar)) { //|| inputValue.length >= 4
      event.preventDefault();
      this.invalidYearInput = true;
    } else {
      this.invalidYearInput = false;
    }
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

  //ควบคุมการป้อนข้อมูลให้รับเฉพาะตัวเลขเท่านั้น
    onInputKeyPressTotal(event: KeyboardEvent) {
      const inputChar = event.key;
      const inputValue = (event.target as HTMLInputElement).value;

      if (inputValue.includes('.') && inputChar === '.') {
        event.preventDefault();
        this.invalidTotalExpInput = true;
      }
      // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
      else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
        event.preventDefault();
        this.invalidTotalExpInput = true;
      } else {
        this.invalidTotalExpInput = false;
      }
    }

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
  

  onInputKeyPressAccommodation(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;
  
    // ตรวจสอบว่าถ้ามีจุดอยู่แล้ว และผู้ใช้กดจุดอีกครั้ง
    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidAccommodationExpInput = true;
    }
    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidAccommodationExpInput = true;
    } else {
      this.invalidAccommodationExpInput = false;
    }
  }


  ///////ทำเล่นๆ////////
  currentYear = new Date().getFullYear();
  buddhistYear = this.currentYear + 543;
  endYear: number = this.buddhistYear + 10;
  startYear: number = 2533;

  getYearsRange(): number[] {
    const years: number[] = [];
    for (let year = this.startYear; year <= this.endYear; year++) {
      years.push(year);
    }
    return years;
  }
  /////////////////////////////

  generateReport() {
    this._service.Report().subscribe(
      (base64Pdf: string) => {
        // แปลงข้อมูล Base64 เป็นไฟล์ PDF
        const byteCharacters = atob(base64Pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
  
        // สร้าง URL สำหรับไฟล์ PDF
        const pdfUrl = URL.createObjectURL(blob);
  
        // เปิด PDF ในหน้าต่างใหม่
        window.open(pdfUrl, '_blank');
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ PDF:', error);
        // แสดงข้อความหรือกระทำอื่นในกรณีเกิดข้อผิดพลาด
      }
    );
  }


  exportexcel(): void {
    // สร้าง WorkSheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]); // สร้าง WorkSheet ที่ไม่มีข้อมูล

    // เริ่มที่แถว A3
    ws['!ref'] = 'A4';

    // เรียกใช้ฟังก์ชัน calculateTotal() เพื่อคำนวณค่า Total
    const total = this.calculateTotal();

    // ตรวจสอบว่า ws['!ref'] มีค่าหรือไม่
    if (ws['!ref']) {
      // เพิ่มค่า Total ลงในชีท ws
      ws[`G${ws['!ref'].split(':').pop()}`] = { v: total, t: 'n' };
    }

    // สร้างข้อมูลสำหรับแถวแรก (A1 ถึง G1)
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Merge A1 to G1
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }  // Merge A2 to G2
    ];
    ws['A1'] = {
      v: 'Training Needs for Year ' + this.readonlyYear, t: 's', s: {
        alignment: {
          vertical: 'center',
          horizontal: 'center'
        },
      }
    };
    ws['A2'] = { v: 'Department ' + this.readonlyDepartment, t: 's' };

    // รับข้อมูลจากตาราง 'data-table' และเพิ่มลงใน WorkSheet ที่เริ่มที่แถว A3
    let tableElement = document.getElementById('data-table');
    const tableWs: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);
    XLSX.utils.sheet_add_json(ws, XLSX.utils.sheet_to_json(tableWs), { origin: 'A4' });

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FTR-SV1');

    /* save to file */
    XLSX.writeFile(wb, 'FTR-SV1.xlsx');
  }


  // exportexcel(): void {
  //   /* pass here the table id */
  //   let element = document.getElementById('data-table');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

  //   // เรียกใช้ฟังก์ชัน calculateTotal() เพื่อคำนวณค่า Total
  //   const total = this.calculateTotal();

  //   // ตรวจสอบว่า ws['!ref'] มีค่าหรือไม่
  //   if (ws['!ref']) {
  //     // เพิ่มค่า Total ลงในชีท ws
  //     ws[`G${ws['!ref'].split(':').pop()}`] = { v: total, t: 'n' };
  //   }

  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'FTR-SV1');

  //   /* save to file */
  //   XLSX.writeFile(wb, 'FTR-SV1.xlsx');
  // }


}
