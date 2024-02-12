import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ipd-dialog',
  templateUrl: './ipd-dialog.component.html',
  styleUrls: ['./ipd-dialog.component.scss'],
})
export class IpdDialogComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'empid',
    'date',
    'description',
    'OPD',
    'IPD',
    'remark',
  ];

  dataSource!: MatTableDataSource<any>;
  opdAllBudget: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // input: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
