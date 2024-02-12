import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-wellfare-dialog',
  templateUrl: './wellfare-dialog.component.html',
  styleUrls: ['./wellfare-dialog.component.scss']
})
export class WellfareDialogComponent implements OnInit {
  expenseFrom: any;

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

  updateNumberOfDays(): void {
    const startDate = this.dateRange.get('start')?.value;
    const endDate = this.dateRange.get('end')?.value;
  
    if (startDate && endDate) {
      const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
      this.expenseFrom.get('numberOfDays')?.setValue(diffDays);
      console.log(diffDays);
  
      // ทำการตรวจสอบว่าทั้งสองวันถูกเลือกแล้วหรือไม่
      const bothDatesSelected = startDate && endDate;
      
      // ทำการเปลี่ยนค่า disabled ของ input ตามที่ตรวจสอบได้
      if (bothDatesSelected) {
        this.expenseFrom.get('numberOfDays')?.disable();
      } else {
        this.expenseFrom.get('numberOfDays')?.enable();
      }
    }

  }
  

  onDateChange(): void {
    this.updateNumberOfDays();
  }
  
  save() {
    console.log(this.expenseFrom);
  }

  ngOnInit(): void {
    this.updateNumberOfDays();
  }
}
