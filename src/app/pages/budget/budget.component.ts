import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BudgetService } from 'src/app/api-services/budget.service';
import Swal from 'sweetalert2';

import { NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { id } from 'date-fns/locale';

export interface Budget {
  id?: number;
  level: string;
  opd: string | number;
  ipd: string | number;
  room: string | number;
}

export interface BudgetResponse {
  responseMessage: string;
  responseData: {
    result: Budget[];
  };
}

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
export class BudgetComponent implements OnInit {
  UserForm: FormGroup | undefined;
  updatedData: any;

  addBudget(): void {
    this.servicebudget.createBudget(this.budgetData).subscribe(
      (response) => {
        console.log('งบประมาณถูกสร้างเรียบร้อย:', response);
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการสร้างงบประมาณ:', error);
      }
    );
    window.location.reload();
  }

  showAddModal = false;
  showEditModal = false;
  budgetData: Budget = { id: 0, level: '', opd: '', ipd: '', room: '' };
  budgets: Budget[] = [];
  budgetId: number | null = null;
  opdValue: string = '';
  ipdValue: string = '';
  searchLevel: string = '';
  searchResults: Budget[] = [];

  constructor(
    private servicebudget: BudgetService,
    private ngZone: NgZone,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.findAllBudgets();
    // this.updateBudget();
  }

  levels: string[] = [];
  findAllBudgets(): void {
    // console.log(this.budgets);
    this.servicebudget.getBudgets().subscribe(
      (response: BudgetResponse) => {
        this.budgets = response.responseData.result;
        this.budgets.sort((a, b) => Number(a.ipd) - Number(b.ipd));
        console.log(this.budgets);
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการโหลดงบประมาณ:', error);
      }
    );
  }

  filteredBudgets: Budget[] = [];
  filterBudgets(): void {
    console.log('Search Level:', this.searchLevel);
    if (!this.searchLevel.trim()) {
      this.filteredBudgets = this.budgets;
    } else {
      this.filteredBudgets = this.budgets.filter((item) =>
        item.level.toLowerCase().includes(this.searchLevel.toLowerCase())
      );
    }
    console.log('Filtered Budgets:', this.filteredBudgets);
  }

  searchBudgetByLevel(): void {
    console.log('Search Level:', this.searchLevel);
    if (this.searchLevel.trim()) {
      this.servicebudget.searchBudget(this.searchLevel).subscribe(
        (response: BudgetResponse) => {
          console.log('Search results:', response);

          if (response.responseData.result) {
            this.searchResults = Array.isArray(response.responseData.result)
              ? response.responseData.result
              : [response.responseData.result];
          } else {
            this.searchResults = [];
          }
        },
        (error) => {
          console.error('Error searching budget:', error);
        }
      );
    } else {
      this.searchResults = this.budgets;
    }
  }

  formatNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
      value = parseInt(value).toLocaleString();
    }
    event.target.value = value;
  }

  editingMode = false;

  editBudget(budget: Budget) {
    this.editingMode = true;
    this.budgetData.id = budget.id;
    this.budgetData.level = budget.level;
    this.budgetData.opd = budget.opd;
    this.budgetData.ipd = budget.ipd;
    this.budgetData.room = budget.room;
  }

  deleteBudget(budget: Budget) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณกำลังจะลบงบประมาณนี้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.performDelete(budget);
      }
    });
  }

  private performDelete(budget: Budget) {
    if (budget.id !== undefined) {
      this.servicebudget.deleteBudget(budget.id).subscribe(
        (response: any) => {
          console.log('งบประมาณถูกลบเรียบร้อย:', response);
          Swal.fire('ลบแล้ว!', 'งบประมาณถูกลบเรียบร้อยแล้ว!', 'success');
          this.findAllBudgets();
        },
        (error: any) => {
          console.error('เกิดข้อผิดพลาดในการลบงบประมาณ:', error);
          Swal.fire('ข้อผิดพลาด!', 'เกิดข้อผิดพลาดในการลบงบประมาณ!', 'error');
        }
      );
    } else {
      console.error('ID ของงบประมาณไม่ได้ระบุ. ไม่สามารถลบได้.');
    }
  }

  // openEditModal(budget: Budget): void {
  //   this.editingMode = true;
  //   this.budgetData = { ...budget };
  //   this.showEditModal = true;
  // }

  closeEditModal(): void {
    this.editingMode = false;
    this.showEditModal = false;
    this.budgetData = { id: 0, level: '', opd: '', ipd: '', room: '' };
  }

  // updateBudget(): void {
  //   if (this.budgetData.id && this.budgetData) {
  //     this.UserForm = this.fb.group({
  //       empId: [''],
  //     });

  //     this.servicebudget.updateBudget(this.budgetData.id, this.budgetData).subscribe(
  //       (response: any) => {
  //         console.log('งบประมาณถูกอัปเดตเรียบร้อย:', response);
  //         Swal.fire('สำเร็จ!', 'งบประมาณถูกอัปเดตเรียบร้อย!', 'success');
  //         this.closeEditModal();
  //         this.findAllBudgets();
  //       },
  //       (error: any) => {
  //         console.error('เกิดข้อผิดพลาดในการอัปเดตงบประมาณ:', error);
  //         Swal.fire('ข้อผิดพลาด!', 'เกิดข้อผิดพลาดในการอัปเดตงบประมาณ!', 'error');
  //       }
  //     );
  //   } else {
  //     console.error('ข้อมูลงบประมาณไม่ถูกต้องสำหรับการอัปเดต.');
  //   }
  // }

  onEditButtonClick() {
    // if (this.UserForm && this.updatedData && this.isValidBudgetData(this.updatedData)) {
    //   this.UserForm.setValue({
    //     empId: this.updatedData.empId,
    //   });
    // } else {
    //   console.error("ข้อมูลงบประมาณไม่ถูกต้องสำหรับการอัปเดต.");
    // }
    // console.log(this.budgetData);

    Swal.fire({
      title: 'ยืนยัน',
      text: 'คุณต้องการแก้ไขข้อมูลหรือไม่',
      icon: 'warning',
      confirmButtonText: 'ยืนยัน',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicebudget
          .updateBudget(this.budgetData)
          .subscribe((res: any) => {
            Swal.fire({
              title: 'สำเร็จ',
              text: 'แก้ไขข้อมูลสำเร็จ',
              icon: 'success',
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonText: 'ยืนยัน',
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          });
      }
    });
  }

  // isValidBudgetData(data: any): boolean {
  //   return !!data.empId;
  // }

  // updateBudgetData(): void {
  //   const budgetIdToUpdate = 5;
  //   const updatedBudgetData: Budget = {
  //     level: 'newLevel',
  //     opd: 'newOPD',
  //     ipd: 'newIPD',
  //     room: 'newRoom',
  //   };

  //   this.servicebudget.updateBudget(budgetIdToUpdate, updatedBudgetData).subscribe(
  //     (response: any) => {
  //       console.log('งบประมาณถูกอัปเดตเรียบร้อย:', response);
  //     },
  //     (error: any) => {
  //       console.error('เกิดข้อผิดพลาดในการอัปเดตงบประมาณ:', error);
  //     }
  //   );
  // }
}
//
