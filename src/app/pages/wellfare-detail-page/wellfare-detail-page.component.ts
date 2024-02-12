import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OpdDialogComponent } from './components/opd-dialog/opd-dialog.component';
import { IpdDialogComponent } from './components/ipd-dialog/ipd-dialog.component';
import { WellfareDetailsService } from 'src/app/api-services/wellfare-details.service';
import { Table } from 'primeng/table';
export interface Expenses {
  empid: number;
  empname: string;
  dateOfAdmission: string;
  dateRange: string;
  opd: number;
  ipd: number;
  canWithdraw: number;
  remark: number;
}

export interface ExpenseInfo {
  typeExpense: string;
  dateAdd: string;
  empName: string;
  level: string;
  tposition: string;
  company: string;
  divisionid: string;
  tdivision: string;
  deptcode: string;
  tdept: string;
  typeEmp: string;
  dateRange: string;
  days: number;
  healthCost: number;
  roomSerive: number;
  withDraw: number;
}
@Component({
  selector: 'app-wellfare-detail-page',
  templateUrl: './wellfare-detail-page.component.html',
  styleUrls: ['./wellfare-detail-page.component.scss'],
})
export class WellfareDetailPageComponent implements OnInit {
  dataSource: Expenses[] = [];
  opdAllBudget: number = 0;
  expenseInfo: ExpenseInfo = {
    typeExpense: '',
    dateAdd: '',
    empName: '',
    level: '',
    tposition: '',
    company: '',
    divisionid: '',
    tdivision: '',
    deptcode: '',
    tdept: '',
    typeEmp: '',
    dateRange: '',
    days: 0,
    healthCost: 0,
    roomSerive: 0,
    withDraw: 0,
  };

  constructor(
    public dialog: MatDialog,
    public wellfareDetailService: WellfareDetailsService
  ) {}

  ngOnInit(): void {
    this.loadExpenseData();
  }
  clear(table: Table) {
    table.clear();
  }

  loadExpenseData() {
    this.wellfareDetailService.getAllExpenseInUsed().subscribe((res) => {
      const formatted = res.responseData.result.map((item: any) => {
        return {
          emplevel: item.employee.budget.level,
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
          canWithdraw: item.canWithdraw,
          expenseId: item.id,
        };
      });
      this.dataSource = formatted;
    });
  }

  getExpense(id: number) {
    this.wellfareDetailService.getExpenseInfo(id).subscribe(
      (res) => {
        const result = res.responseData.result;
        const emp = result.employee;
        const options: object = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        };
        const expenseinfo: ExpenseInfo = {
          typeExpense: result.ipd > result.opd ? 'ใน' : 'นอก',
          dateAdd: new Date(result.dateOfAdmission).toLocaleDateString(
            'th-TH',
            options
          ),
          empName: `${emp.tprefix} ${emp.tname} ${emp.tsurname}`,
          level: emp.budget.level,
          tposition: emp.tposition,
          company: emp.dept.company,
          divisionid: emp.dept.divisionid,
          tdivision: emp.dept.tdivision,
          deptcode: emp.dept.deptcode,
          tdept: emp.dept.tdept,
          typeEmp: emp.remark,
          dateRange: `${new Date(result.startDate).toLocaleDateString(
            'th-TH',
            options
          )} - ${new Date(result.endDate).toLocaleDateString(
            'th-TH',
            options
          )}`,
          days: result.days,
          healthCost: result.ipd > result.opd ? result.ipd : result.opd,
          roomSerive: result.roomService,
          withDraw: result.canWithdraw,
        };
        console.log('Expense info :', expenseinfo);
      },
      (err) => {
        console.error(err);
      }
    );
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
