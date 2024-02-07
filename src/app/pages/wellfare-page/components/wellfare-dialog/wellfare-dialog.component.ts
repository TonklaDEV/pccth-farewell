import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wellfare-dialog',
  templateUrl: './wellfare-dialog.component.html',
  styleUrls: ['./wellfare-dialog.component.scss']
})
export class WellfareDialogComponent implements OnInit {

  expenseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      type: [''],
      dateRange: this.fb.group({
        startDate: [],
        endDate: [],
        dateRangeInput: [''],
      }),
      numberOfDays: this.fb.group({
        numberOfDaysInput: [''],
      }),
      medicalExpenses: this.fb.group({
        medicalExpensesInput: [0],
      }),
      roomAndFoodExpenses: this.fb.group({
        roomAndFoodExpensesInput: [0],
      }),
      details: this.fb.group({
        detailsInput: [''],
      }),
    });
  }
  
  selectedDates!: Date[];

  handleDateSelection(): void {
    if (this.selectedDates && this.selectedDates.length > 0) {
      const startDate = this.selectedDates[0];
      const endDate = this.selectedDates[this.selectedDates.length - 1];

      const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      this.expenseForm.get('dateRange.startDate')?.setValue(startDate);
      this.expenseForm.get('dateRange.endDate')?.setValue(endDate);
      this.expenseForm.get('dateRange.dateRangeInput')?.setValue(`${startDate.toISOString()} - ${endDate.toISOString()}`);
      this.expenseForm.get('numberOfDays.numberOfDaysInput')?.setValue(daysDifference);
    }
  }
  
  //   get dateRange() {
  //     return this.expenseFrom.get('dateRange') as FormGroup;
  //   }

  //   get numberOfDays() {
  //     return this.expenseFrom.get('numberOfDays') as FormGroup;
  //   }

  // updateNumberOfDays(): void {
  //   const startDate = this.expenseForm.get('dateRange.start')?.value;
  //   const endDate = this.expenseForm.get('dateRange.end')?.value;

  //   if (startDate && endDate) {

  //       const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  //       const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  //       this.expenseForm.get('numberOfDays')?.setValue(diffDays);


  //       const bothDatesSelected = startDate && endDate;
  //       if (bothDatesSelected) {
  //           this.expenseForm.get('numberOfDays')?.disable();
  //       } else {
  //           this.expenseForm.get('numberOfDays')?.enable();
  //       }
  //   }
  // }

 
  onDateChange(selectedDates: Date[]): void {
    if (selectedDates && selectedDates.length > 0) {
      const startDate = selectedDates[0];
      const endDate = selectedDates[selectedDates.length - 1];

      this.expenseForm.get('dateRange.dateRangeInput')?.setValue(this.formatDate(startDate, endDate));
    }
  }

  formatDate(startDate: Date, endDate: Date): string {
    const formattedStartDate = this.formatDatePart(startDate);
    const formattedEndDate = this.formatDatePart(endDate);

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  formatDatePart(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  // onDateChange(selectedDates: any): void {
  //   this.handleDateSelection(selectedDates);
  // }

  save() {
    console.log(this.expenseForm);
    console.log(this.selectedDates);
    
  }

  ngOnInit(): void {
    // this.updateNumberOfDays();
  }

}
