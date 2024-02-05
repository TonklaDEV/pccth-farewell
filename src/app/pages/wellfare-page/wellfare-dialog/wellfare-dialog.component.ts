import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-wellfare-dialog',
  templateUrl: './wellfare-dialog.component.html',
  styleUrls: ['./wellfare-dialog.component.scss']
})
export class WellfareDialogComponent implements OnInit {
  expenseFrom: any;

  // range = new FormGroup({
  //   start: new FormControl(),
  //   end: new FormControl(),
  // });

  constructor(
    public dialogRef: MatDialogRef<WellfareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) {
    this.expenseFrom = this.fb.group({
      type: ['', Validators.required],
      dateRange: this.fb.group({
        start: [null, Validators.required],
        end: [null, Validators.required],
      }),
      numberOfDays: [null, Validators.required],
      medicalExpenses: [null, Validators.required],
      roomAndFoodExpenses: [null, Validators.required],
      details: [null, Validators.required],
    });
  }

  get dateRange() {
    return this.expenseFrom.get('dateRange') as FormGroup;
  }

  get numberOfDays() {
    return this.expenseFrom.get('numberOfDays') as FormGroup;
  }

  updateNumberOfDays(): void {
    console.log('Updating number of days...');
    const dateRangeFormGroup = this.expenseFrom.get('dateRange');
    const startDate = dateRangeFormGroup?.get('start')?.value;
    const endDate = dateRangeFormGroup?.get('end')?.value;

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    if (startDate && endDate) {
        const startTimestamp = new Date(startDate).getTime();
        const endTimestamp = new Date(endDate).getTime();

        const timeDiff = Math.abs(endTimestamp - startTimestamp);
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        console.log('Calculated Diff Days:', diffDays);

        const diffDaysString = diffDays.toString();
        this.expenseFrom.get('numberOfDays')?.setValue(diffDaysString);
        console.log('Updated numberOfDays:', diffDaysString);

        // Convert timestamps to ISO strings in UTC timezone
        const selectedRange = {
            start: new Date(startTimestamp).toISOString(),
            end: new Date(endTimestamp).toISOString(),
        };
        console.log('Selected range:', selectedRange);
    }
}



  save() {
    console.log(this.expenseFrom);
  }

  ngOnInit(): void {
  this.updateNumberOfDays();
  }
  
}
