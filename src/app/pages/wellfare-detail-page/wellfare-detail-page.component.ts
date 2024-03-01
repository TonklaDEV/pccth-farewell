import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WellfareDetailsService } from 'src/app/api-services/wellfare-details.service';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

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

export interface reportPrintForm {
  type: string;
  month: number;
  year: number;
}

@Component({
  selector: 'app-wellfare-detail-page',
  templateUrl: './wellfare-detail-page.component.html',
  styleUrls: ['./wellfare-detail-page.component.scss'],
})
export class WellfareDetailPageComponent implements OnInit {
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  years: number[] = [];
  months: { value: number; name: string }[] = [];
  dataSource: Expenses[] = [];
  opdAllBudget: number = 0;
  loading!: boolean;
  totalRecords!: number;
  selectedType: string = '';
  selectedSearchValue: string = '';
  filteredSearchValues: String[] = [];
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
  currentRows = 0;
  currentFirst = 0;
  reportPrintForm: FormGroup = this.fb.group({
    types: [''],
    years: new FormControl(this.selectedYear),
    months: new FormControl(this.selectedMonth),
  });
  reportValue: reportPrintForm = {
    type: '',
    month: 0,
    year: 0,
  };
  base64!: string;
  displayPDFModal: boolean = false;

  constructor(
    public dialog: MatDialog,
    public wellfareDetailService: WellfareDetailsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.expenseSelect = true;
    this.populateYears();
    this.populateMonths();
  }

  private populateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.years.push(currentYear - i);
    }
  }

  private populateMonths(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    this.months = [];

    for (let i = 1; i <= 12; i++) {
      if (
        currentYear === new Date(2000, i - 1, 1).getFullYear() ||
        i <= currentMonth
      ) {
        this.months.push({
          value: i,
          name: new Date(2000, i - 1, 1).toLocaleString('th-TH', {
            month: 'long',
          }),
        });
      } else if (currentYear !== new Date(2000, i - 1, 1).getFullYear()) {
        this.months.push({
          value: i,
          name: new Date(2000, i - 1, 1).toLocaleString('th-TH', {
            month: 'long',
          }),
        });
      }
    }
  }

  clear(table: Table) {
    this.selectedSearchValue = '';
    this.selectedType = '';
    table.clear();
  }
  fetchSearchData() {
    this.loadExpenseData({
      first: this.currentFirst,
      rows: this.currentRows,
    });
  }
  loadExpenseData(event: LazyLoadEvent) {
    this.loading = true;
    let filterObj = {
      type: '',
      value: '',
    };
    const first = event.first ? event.first : 0;
    const rows = event.rows ? event.rows : 0;
    const page = first / rows;
    this.currentRows = rows;
    this.currentFirst = first;
    filterObj.type = this.selectedType;
    filterObj.value = this.selectedSearchValue;

    this.wellfareDetailService
      .getExpense(page, rows, filterObj)
      .subscribe((res) => {
        const itemLength = res.totalElements;
        const formatted: any[] = res.content.map((item: any) => {
          return {
            emplevel: item?.employee?.budget?.level
              ? item?.employee?.budget?.level
              : 'ไม่มีข้อมูล',
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
        this.totalRecords = itemLength;
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
          level: emp?.budget?.level ? emp.budget.level : 'ไม่มีข้อมูล',
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

  @ViewChild('dt1') dt1!: Table;
  onInputChange(event: any) {
    this.dt1.filterGlobal(event.target.value, 'contains');
  }

  filterValue(event: any) {
    let query = event.query;
    let type = this.selectedType;
    console.log(type);

    if (type == 'name') {
      this.wellfareDetailService.getFilterName(query).subscribe(
        (res: any) => {
          let names: string[] = res.responseData?.result?.map((item: any) => {
            return `${item.tname} ${item.tsurname}`;
          });
          this.filteredSearchValues = names ? names : [];
        },
        (err) => {
          this.filteredSearchValues = [];
        }
      );
    } else {
      this.wellfareDetailService.getFilerEmpid(query).subscribe(
        (res: any) => {
          let empids: string[] = res.responseData?.result?.map((item: any) => {
            return item.empid;
          });
          this.filteredSearchValues = empids ? empids : [];
        },
        (err) => {
          this.filteredSearchValues = [];
        }
      );
    }
  }

  displayModal: boolean = false;
  showModalDialog() {
    this.displayModal = true;
  }

  pdfview() {
    console.log(this.reportPrintForm.value);
    this.displayPDFModal = true;
    const type: string = this.reportPrintForm.get('types')?.value;
    const month: number = this.reportPrintForm.get('months')?.value;
    const year: number = this.reportPrintForm.get('years')?.value;
    this.reportValue = {
      month: month,
      type: type,
      year: year,
    };
  }
}
