import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpdDialogComponent } from './components/opd-dialog/opd-dialog.component';
import { IpdDialogComponent } from './components/ipd-dialog/ipd-dialog.component';
import { WellfareDetailsService } from 'src/app/api-services/wellfare-details.service';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
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
  loading!: boolean;
  totalRecords!: number;
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
  expenseSelect!: boolean;
  filteredExpenses!: any[];
  constructor(
    public dialog: MatDialog,
    public wellfareDetailService: WellfareDetailsService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.expenseSelect = true;
    // this.loadExpenseData();
  }
  clear(table: Table) {
    table.clear();
  }

  loadExpenseData(event: LazyLoadEvent) {
    this.loading = true;
    const first = (event.first) ? event.first : 0
    const rows = (event.rows) ? event.rows : 0
    const page = first / rows
    
    this.wellfareDetailService.getExpense(page,rows).subscribe((res) => {
      const a: string[] = [];
      const formatted = res.content.map((item: any) => {
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
      this.totalRecords = res.pageable.totalElements;
      this.loading = false;
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
        this.expenseInfo = expenseinfo;
        this.expenseSelect = false;
      },
      (err) => {
        console.error(err);
      }
    );
    console.log(this.expenseSelect);
  }

  openOPDDialog() {
    this.dialog.open(OpdDialogComponent);
  }

  openIPDDialog() {
    this.dialog.open(IpdDialogComponent);
  }

  @ViewChild('dt1') dt1!: Table;
  onInputChange(event: any) {    
    this.dt1.filterGlobal(event.target.value, 'contains');
  }
}
