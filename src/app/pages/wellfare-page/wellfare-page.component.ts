import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { WellfareDialogComponent } from './wellfare-dialog/wellfare-dialog.component';

@Component({
  selector: 'app-wellfare-page',
  templateUrl: './wellfare-page.component.html',
  styleUrls: ['./wellfare-page.component.scss']
})
export class WellfarePageComponent implements OnInit {
  expenseFrom:any;
  
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  search(){

  }

  openDialog() {
    const dialogRef = this.dialog.open(WellfareDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}