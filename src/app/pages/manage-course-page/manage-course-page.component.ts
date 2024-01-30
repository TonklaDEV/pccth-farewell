import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api-services/auth.service';
import { FtrSv1ServicesService } from 'src/app/api-services/ftr-sv1-services.service';



@Component({
  selector: 'app-manage-course-page',
  templateUrl: './manage-course-page.component.html',
  styleUrls: ['./manage-course-page.component.scss']
})
export class ManageCoursePageComponent implements OnInit {

  constructor(
    private fb: FormBuilder, 
    private _service: FtrSv1ServicesService,
    private authService: AuthService,
    private router: Router) { }

  CourseForm: any;
  rows: Array<any> = [];
  selectedRow: any;

  selectedTime!: string; // เวลาจะเป็น string

  ngOnInit(): void {
    this.CourseForm = this.fb.group({
      course_name: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      timestart: ['', Validators.required],
      timeend: ['', Validators.required],
      note: [''],
      price: ['', Validators.required],
      priceProject: [''],
      institute: ['', Validators.required],
      place: ['', Validators.required],

    });

    console.log('in manage-course')
    const role = this.authService.checkRole();
    if (role !== 'ROLE_Admin'){
      this.router.navigate(['/pccth']);
    }

  }


  startDate!: Date;
  endDate!: Date;


  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เพิ่ม 0 ถ้าเป็นเลขเดียว
    const day = String(date.getDate()).padStart(2, '0'); // เพิ่ม 0 ถ้าเป็นเลขเดียว
    return `${year}-${month}-${day}`;
  }


  addSv1Btn() {
    this.CourseForm.patchValue({
      startDate: this.formatDateToYYYYMMDD(this.CourseForm.value.startDate),
      endDate: this.formatDateToYYYYMMDD(this.CourseForm.value.endDate),
    });

    if (this.CourseForm.valid) {
      // Get the values of timestart and timeend
      const timestartValue = this.CourseForm.get('timestart').value;
      const timeendValue = this.CourseForm.get('timeend').value;

      // Merge timestart and timeend into a single time field
      const mergedTime = `${timestartValue}-${timeendValue}`;

      // Update the CourseForm with the merged time
      this.CourseForm.patchValue({ time: mergedTime });

      // Send the form data as JSON to the backend
      const formData = {
        course_name: this.CourseForm.get('course_name').value,
        startDate: this.CourseForm.get('startDate').value,
        endDate: this.CourseForm.get('endDate').value,
        time: mergedTime,
        note: this.CourseForm.get('note').value,
        price: this.CourseForm.get('price').value,
        priceProject: this.CourseForm.get('priceProject').value,
        institute: this.CourseForm.get('institute').value,
        place: this.CourseForm.get('place').value,
      };
      console.log('Form Data:', formData);

      // Now, 'formData' contains the 'time' field in the desired format

      // เพิ่มข้อมูลในอาร์เรย์
      this.rows.push(formData);

      this.CourseForm.reset();
    }

    // this._service.addcourse(formData).subscribe({
    //   next: (formData) => {
    //     window.location.reload();
    //     console.log(formData);
    //   },
    //   error: console.log,
    // });
  }


  isEditMode = false;

  startEdit(row: any) {
    // Set the selected row
    this.selectedRow = row;
  
    // Populate the form with the selected row's data
    this.CourseForm.patchValue({
      course_name: row.course_name,
      startDate: new Date(row.startDate),
      endDate: new Date(row.endDate),
      timestart: row.time.split('-')[0],
      timeend: row.time.split('-')[1],
      note: row.note,
      price: row.price,
      priceProject: row.priceProject,
      institute: row.institute,
      place: row.place,
    });
  
    // Enable edit mode
    this.isEditMode = true;
  
    // Scroll to the form element
    const formElement = document.getElementById('course-form'); // Replace 'course-form' with the actual ID of your form element
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  

  cancelEdit() {
    // Clear the form and exit edit mode
    this.CourseForm.reset();
    this.isEditMode = false;
    this.selectedRow = null;
  }


  // Function to update data in edit mode
  updateSv1Btn() {
    this.CourseForm.patchValue({
      startDate: this.formatDateToYYYYMMDD(this.CourseForm.value.startDate),
      endDate: this.formatDateToYYYYMMDD(this.CourseForm.value.endDate),
    });
    if (this.CourseForm.valid) {
      // Get the updated values from the form
      const updatedData = {
        course_name: this.CourseForm.get('course_name').value,
        startDate: this.CourseForm.get('startDate').value,
        endDate: this.CourseForm.get('endDate').value,
        time: `${this.CourseForm.get('timestart').value}-${this.CourseForm.get('timeend').value}`,
        note: this.CourseForm.get('note').value,
        price: this.CourseForm.get('price').value,
        priceProject: this.CourseForm.get('priceProject').value,
        institute: this.CourseForm.get('institute').value,
        place: this.CourseForm.get('place').value,
      };

      // Update the selected row with the updated data
      if (this.selectedRow) {
        this.selectedRow.course_name = updatedData.course_name;
        this.selectedRow.startDate = updatedData.startDate;
        this.selectedRow.endDate = updatedData.endDate;
        this.selectedRow.time = updatedData.time;
        this.selectedRow.note = updatedData.note;
        this.selectedRow.price = updatedData.price;
        this.selectedRow.priceProject = updatedData.priceProject;
        this.selectedRow.institute = updatedData.institute;
        this.selectedRow.place = updatedData.place;
      }

      // Reset the form and exit edit mode
      this.CourseForm.reset();
      this.isEditMode = false;
      this.selectedRow = null;
    }
  }

  deleteSv1Btn(row: any) {
    const confirmation = window.confirm('ยืนยันที่จะลบข้อมูล ?');

    if (confirmation) {
      // Find the index of the selected row in the 'rows' array
      const index = this.rows.indexOf(row);

      if (index !== -1) {
        // Remove the selected row from the 'rows' array
        this.rows.splice(index, 1);

        // Clear the form
        this.CourseForm.reset();

        // Exit edit mode (if in edit mode)
        this.isEditMode = false;
      }
    }
  }





  onBlurPrice(event: Event) {
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

      this.CourseForm.get('price').setValue(inputValue);
    }
  }

  onBlurpriceProject(event: Event) {
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

      this.CourseForm.get('priceProject').setValue(inputValue);
    }
  }

  invalidPriceInput: boolean = false;
  invalidPriceProjectInput: boolean = false;

  onInputKeyPressPrice(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    // ตรวจสอบว่าถ้ามีจุดอยู่แล้ว และผู้ใช้กดจุดอีกครั้ง
    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidPriceInput = true;
    }
    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidPriceInput = true;
    } else {
      this.invalidPriceInput = false;
    }
  }


  onInputKeyPresspriceProject(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    // ตรวจสอบว่าถ้ามีจุดอยู่แล้ว และผู้ใช้กดจุดอีกครั้ง
    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidPriceProjectInput = true;
    }
    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidPriceProjectInput = true;
    } else {
      this.invalidPriceProjectInput = false;
    }
  }

}
