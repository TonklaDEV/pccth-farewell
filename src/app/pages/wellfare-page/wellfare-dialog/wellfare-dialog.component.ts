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
  

  save(){
    console.log(this.expenseFrom);
  }

  ngOnInit(): void {

  }
}
