// wellfare-dialog.component.ts
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WellfareService } from 'src/app/api-services/wellfare.service';


@Component({
  selector: 'app-wellfare-dialog',
  templateUrl: './wellfare-dialog.component.html',
  styleUrls: ['./wellfare-dialog.component.scss'],
})
export class WellfareDialogComponent implements OnInit {
  @Input() userId: any;
  @Output() userIdChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  expenseForm!: FormGroup;
  rangeDates: Date[] = [];
  selectedDates: Date[] = [];
  responseData: any;

  startDate: Date;
  endDate: Date;
  startUTC: number;
  endUTC: number;

  constructor(private fb: FormBuilder, private createExpenseService: WellfareService) {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startUTC = 0;
    this.endUTC = 0;

  }

  ngOnInit(): void {
    console.log('userId in WellfareDialogComponent:', this.userId);
    this.initForm();
    this.expenseForm.get('numberOfDaysInput')?.disable();
    this.expenseForm.get('dateRangeInput')?.disable();

  }


  initForm(): void {
    this.expenseForm = this.fb.group({
      types: ['', Validators.required],
      dateRangeInput: [''],
      startDate: [],
      endDate: [],
      days: [''],
      ipd: [0],
      opd: [0],
      medicalExpensesInput: [0],
      roomService: [0],
      // includeRoomFood: [false], // Checkbox control
      description: ['', Validators.required],
      remark: ['', Validators.required],
      adMission: '',
    });

  }
  // includeRoomFood(): void {
  //   this.expenseForm.get('includeRoomFood')?.valueChanges.subscribe((checked) => {
  //     if (checked) {
  //       this.expenseForm.get('roomService')?.enable();
  //     } 
  //   });
  // }

  formatDateForInput(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    return `${day + 1}/${monthIndex + 1}/${year}`;
  }

  formatDateISO(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  handleDateSelection(startDate: Date, endDate: Date, startUTC: number, endUTC: number): void {
    const formattedStartDate = this.formatDatePart(startDate);
    const formattedEndDate = this.formatDatePart(endDate);
    const isoStartDate = this.formatDateISO(startDate);
    const isoEndDate = this.formatDateISO(endDate);
    const timeDifference = Math.abs(endUTC - startUTC);
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    this.expenseForm.get('startDate')?.setValue(isoStartDate);
    this.expenseForm.get('endDate')?.setValue(isoEndDate);
    this.expenseForm.get('dateRangeInput')?.setValue(`${formattedStartDate} - ${formattedEndDate}`);
    this.expenseForm.get('days')?.setValue(daysDifference);

    console.log("handleDateSelection", isoStartDate);
    console.log("handleDateSelection", isoEndDate);
    console.log(daysDifference);
  }

  formatDatePart(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  save() {
    // this.resetForm();
    console.log(this.expenseForm.value);
    console.log(this.selectedDates);
    console.log(this.rangeDates);
    if (this.expenseForm.valid) {
      this.userId
      const expenseData = this.expenseForm.value;

      this.createExpenseService.createExpense(this.userId, expenseData).subscribe(
        (response) => {
          console.log('Expense created successfully:', response);
        },
        (error) => {
          console.error('Error creating expense:', error);
        }
      );
    } else {
      console.error('Form is not valid.');
    }
    console.log(this.userId);
    this.resetForm();
  }


  getRangeDates() {
    if (this.rangeDates && this.rangeDates.length > 0) {
      this.startDate = this.rangeDates[0];
      this.endDate = this.rangeDates[this.rangeDates.length - 1];

      if (this.startDate && this.endDate) {
        this.startUTC = Date.UTC(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
        this.endUTC = Date.UTC(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate());

        const startDateString = new Date(this.startUTC).toISOString();
        const endDateString = new Date(this.endUTC).toISOString();

        console.log(startDateString, endDateString);
        this.handleDateSelection(this.startDate, this.endDate, this.startUTC, this.endUTC);
      } else {
        console.error('startDate or endDate is null');
      }
    }
  }

  insertCost() {
    const type = this.expenseForm.get("types")?.value
    const cost = this.expenseForm.get("medicalExpensesInput")?.value
    if (type == 'ipd') {
      this.expenseForm.get('ipd')?.setValue(cost);
      this.expenseForm.get('opd')?.setValue(0);
    } else {
      this.expenseForm.get('opd')?.setValue(cost);
      this.expenseForm.get('ipd')?.setValue(0);
    }
  }
  resetForm(): void {
    // ล้างค่าใน FormGroup
    this.expenseForm.reset();
    // รีเซ็ตค่าใน p-calendar
    this.rangeDates = [];
    this.expenseForm.get('numberOfDaysInput')?.disable();
    this.expenseForm.get('dateRangeInput')?.disable();
  }

  close(): void {
    this.closeDialog.emit();
  }
}