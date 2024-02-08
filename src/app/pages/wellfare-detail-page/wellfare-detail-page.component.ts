import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OpdDialogComponent } from './components/opd-dialog/opd-dialog.component';
import { IpdDialogComponent } from './components/ipd-dialog/ipd-dialog.component';
import { WellfareDetailsService } from 'src/app/api-services/wellfare-details.service';
import { Table } from 'primeng/table';
export interface Expenses {
  empid : number
  empname : string
  dateOfAdmission : string;
  dateRange : string;
  opd :number
  ipd : number
  canWithdraw: number
  remark : number
}
@Component({
  selector: 'app-wellfare-detail-page',
  templateUrl: './wellfare-detail-page.component.html',
  styleUrls: ['./wellfare-detail-page.component.scss'],
})
export class WellfareDetailPageComponent implements OnInit {

  dataSource: Expenses[] = [];
  opdAllBudget: number = 0;

  constructor(
    public dialog: MatDialog,
    public wellfareDetailService: WellfareDetailsService
  ) {
    // this.loadExpenseData()
  }

  ngOnInit(): void {
    this.loadExpenseData();
  }
  clear(table: Table) {
    table.clear();
  }

  loadExpenseData() {
    this.wellfareDetailService.getAllExpenseInUsed().subscribe((res) => {
      const formatted = res.map((item: any) => {
        return {
          empid: item.employee.empid,
          empname:
            item.employee.tprefix +
            ' ' +
            item.employee.tname +
            ' ' +
            item.employee.tsurname,
          dateOfAdmission: new Date(item.dateOfAdmission).toLocaleDateString(
            'th-TH',
            { day: '2-digit', month: '2-digit', year: 'numeric' }
          ),
          description: item.description,
          dateRange:
            new Date(item.startDate).toLocaleDateString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }) +
            ' - ' +
            new Date(item.endDate).toLocaleDateString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }),
          opd: item.opd,
          ipd: item.ipd,
          canWithdraw: item.canWithdraw,
          remark: item.remark,
        };
      });
      this.dataSource = formatted;
    });
  }

  openOPDDialog() {
    this.dialog.open(OpdDialogComponent);
  }

  openIPDDialog() {
    this.dialog.open(IpdDialogComponent);
  }

  @ViewChild('dt1') dt1!: Table;
  onInputChange(event: any) {
    if (event && event.target && this.dt1) {
      this.dt1.filterGlobal(event.target.value, 'contains');
    }
  }
}
