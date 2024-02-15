import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BudgetService } from 'src/app/api-services/budget.service';
import Swal from 'sweetalert2';
import { NgZone } from '@angular/core';

// budget.model.ts

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
    


 addBudget(): void {
    this.servicebudget.createBudget(this.budgetData).subscribe(
      (response) => {
        console.log('Budget created successfully:', response);
      },
      (error) => {
        console.error('Error creating budget:', error);
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
      private ngZone: NgZone) { }

  ngOnInit(): void {
    this.findAllBudgets()
  }
  

  levels: string[] = [];
  findAllBudgets(): void {
    console.log(this.budgets);
    this.servicebudget.getBudgets().subscribe(
      (response: BudgetResponse) => {
        this.budgets = response.responseData.result;
        console.log(this.budgets);
      },
      (error) => {
        console.error('Error loading budgets:', error);
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
  }
  

  formatNumber(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // ลบทุกตัวที่ไม่ใช่ตัวเลขออกจากค่าที่ป้อน
    if (value.length >= 3) {
      value = parseInt(value).toLocaleString(); // จัดรูปแบบตัวเลขใหม่โดยใช้ toLocaleString()
    }
    event.target.value = value; // กำหนดค่าใหม่กลับไปยังอิลิเมนต์ input
  }
  
  editingMode = false;

  editBudget(budget: Budget) {
    this.editingMode = true; // เปลี่ยนสถานะเป็น true เมื่อกดปุ่ม "แก้ไขข้อมูล"
    this.budgetData.level = budget.level;
    this.budgetData.opd = budget.opd;
    this.budgetData.ipd = budget.ipd;
    this.budgetData.room = budget.room;
  }

  

  deleteBudget(budget: Budget) {
    // แสดงแจ้งเตือนก่อนการลบ
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this budget!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // ถ้าผู้ใช้กด "Yes"
        this.performDelete(budget);
      }
    });
  }

  

  private performDelete(budget: Budget) {
    // ทำการลบข้อมูล
    if (budget.id !== undefined) {
      this.servicebudget.deleteBudget(budget.id).subscribe(
        (response: any) => {
          console.log('Budget deleted successfully:', response);
          Swal.fire('Deleted!', 'Budget has been deleted successfully!', 'success');
          this.findAllBudgets(); // โหลดข้อมูลใหม่
        },
        (error: any) => {
          console.error('Error deleting budget:', error);
          Swal.fire('Error!', 'Error deleting budget!', 'error');
        }
      );
    } else {
      console.error('Budget ID is undefined. Cannot delete.');
    }
  }


  openEditModal(budget: Budget): void {
    this.editingMode = true; // เปิดโหมดแก้ไข
    this.budgetData = { ...budget };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.editingMode = false; // ปิดโหมดแก้ไข
    this.showEditModal = false;
    this.budgetData = { id: 0, level: '', opd: '', ipd: '', room: '' };
  }


// budget.component.ts

updateBudget(): void {
  if (this.budgetData.id && this.budgetData) {
    this.servicebudget.updateBudget(this.budgetData.id, this.budgetData).subscribe(
      (response: any) => {
        console.log('Budget updated successfully:', response);
        Swal.fire('Success!', 'Budget updated successfully!', 'success');
        this.closeEditModal(); // ปิด Modal หลังจากการแก้ไขเสร็จสิ้น
        this.findAllBudgets(); // โหลดข้อมูลใหม่
      },
      (error: any) => {
        console.error('Error updating budget:', error);
        Swal.fire('Error!', 'Error updating budget!', 'error');
      }
    );
  } else {
    console.error('Invalid budget data for update.');
  }
}


currentPage: number = 1;
itemsPerPage: number = 5;

get totalPages(): number {
  return Math.ceil(this.budgets.length / this.itemsPerPage);
}

get displayedBudgets(): Budget[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.budgets.slice(startIndex, endIndex);
}

// ... โค้ดอื่น ๆ ...

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}



}


  
  




