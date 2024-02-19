import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WellfareService } from 'src/app/api-services/wellfare.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-wellfare-page',
  templateUrl: './wellfare-page.component.html',
  styleUrls: ['./wellfare-page.component.scss'],
})
export class WellfarePageComponent implements OnInit {
  [x: string]: any;
  @Output() userIdChanged: EventEmitter<string> = new EventEmitter<string>();
  // expenseFrom: any;
  responseData: any = {};
  displayModal: boolean = false;
  constructor(private wellfareService: WellfareService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log('UserId in WellfareDialogComponent ngOnInit:', this.userId);
    this.cdr.detectChanges()
  }

  showModalDialog(userId: string): void {
    if (this.responseData) {
      this.displayModal = true;
      console.log("User ID:", userId);
      this.userId = userId;
      this.userIdChanged.emit(userId);
    }
  }

  searchInput: any;
  searchUsers(): void {
    this.userId
    const searchTerm = this.searchInput;
    this.wellfareService.searchUserByName(searchTerm).subscribe(
      (response) => {
        this.responseData = response.responseData.result;
        const userId = this.responseData[0]?.userId;
        if (userId) {
          this.userIdChanged.emit(userId);
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

  userData: any;

  searchExpensesByUserId(userId: number): void {
    this.userId
    this.wellfareService.searchExpensesByUserId(userId).subscribe(
      (response) => {
        this.userData = response.expenses;
      },
      (error) => {
        console.error('Error getting user data:', error);
      }
    );
  }
  
  expenseId: any;
  deleteById(expenseId: any) {
    this.wellfareService.deleteExpense(expenseId).subscribe((res: any) => {
      setTimeout(() => {
        location.reload();
      }, 1000);
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

}
