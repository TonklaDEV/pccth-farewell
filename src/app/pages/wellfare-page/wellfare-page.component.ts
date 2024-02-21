import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WellfareService } from 'src/app/api-services/wellfare.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-wellfare-page',
  templateUrl: './wellfare-page.component.html',
  styleUrls: ['./wellfare-page.component.scss'],
})
export class WellfarePageComponent implements OnInit {
  [x: string]: any;
  // expenseFrom: any;
  responseData: any = {};
  displayModal: boolean = false;
  filteredSearchValues: any[] = [];
  editMode: boolean = false;
  expenseId: number = 0;
  constructor(
    private wellfareService: WellfareService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // console.log('UserId in WellfareDialogComponent ngOnInit:', this.responseData.length);
    this.cdr.detectChanges();
  }

  showModalDialog(id: any, mode: string): void {
    if (mode == 'create') {
      if (this.responseData) {
        this.displayModal = true;
        // console.log('User ID:', userId);
        this.expenseId = 0;
        this.editMode = false;
        this.userId = id;
      }
    } else if (mode == 'edit') {
      this.displayModal = true;
      this.editMode = true;
      this.expenseId = id;
    }
  }

  searchInput: any;
  searchUsers(): void {
    this.userId;
    const searchTerm = this.searchInput;
    this.wellfareService.searchUserByName(searchTerm).subscribe(
      (response) => {
        this.responseData = response.responseData.result;
        const userId = this.responseData[0]?.userId;
        this.userId = userId;
        if (userId) {
          console.log('User ID from response:', userId);
          this.searchExpensesByUserId(userId);
        } else {
          console.error('User ID is undefined.');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  isHovered: boolean = false;
  userId: any;
  handleUserIdChanged(userId: any): void {
    console.log('UserId changed in WellfarePageComponent:', userId);
    this.userId = userId;
  }

  closeModal(): void {
    this.displayModal = false;
  }

  filterValue(event: any) {
    let query = event.query;
    this.wellfareService.getFilterName(query).subscribe(
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
  }
  userData: any;

  searchExpensesByUserId(userId: number): void {
    this.userId;
    this.wellfareService.searchExpensesByUserId(userId).subscribe(
      (response) => {
        this.userData = response.expenses;
      },
      (error) => {
        console.error('Error getting user data:', error);
      }
    );
  }

  deleteById(expenseId: any) {
    Swal.fire({
      title: 'ลบข้อมูล',
      icon: 'warning',
      text: 'ต้องการลบข้อมูลนี้หรือไม่',
      confirmButtonText: 'ยืนยัน',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.wellfareService.deleteExpense(expenseId).subscribe((res: any) => {
          this.searchUsers();
        });
      }
    });
  }

  editExpense(expenseId: number, updatedExpenseData: any) {
    this.wellfareService.updateExpense(expenseId, updatedExpenseData).subscribe(
      (response) => {
        console.log('Expense updated successfully:', response);
      },
      (error) => {
        console.error('Error updating expense:', error);
      }
    );
  }

  createForm: any;
  getCreateForm(data: any) {
    this.createForm = data;
  }

  ConfirmSaveAndEdit() {
    this.displayModal = false;
    const text = this.editMode
      ? 'ต้องแก้ไขการเบิกนี้หรือไม่'
      : 'ยืนยันการเบิกค่ารักษาพยาบาล';
    Swal.fire({
      title: 'ยืนยัน',
      text: text,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'ยืนยัน',
      icon : 'warning',
      showCancelButton: true
    }).then(result => {
      if(result.isConfirmed){
        this.saveExpense()
      }else{
        this.displayModal = false;
      }
    })
  }

  saveExpense() {
    console.log(this.createForm);
    console.log(this.userId);
    if (this.editMode) {
      this.wellfareService
        .updateExpense(this.expenseId, this.createForm)
        .subscribe((res) => {
          Swal.fire({
            title: 'สำเร็จ',
            icon: 'success',
            text: res.responseMessage,
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: 'ยืนยัน',
          }).then((result) => {
            if (result.isConfirmed) {
              this.searchUsers();
            }
          });
        });
    } else {
      this.wellfareService
        .createExpense(this.userId, this.createForm)
        .subscribe((res) => {
          Swal.fire({
            title: 'สำเร็จ',
            icon: 'success',
            text: res.responseMessage,
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: 'ยืนยัน',
          }).then((result) => {
            if (result.isConfirmed) {
              this.searchUsers();
            }
          });
        });
    }
    this.displayModal = false;
  }
}
