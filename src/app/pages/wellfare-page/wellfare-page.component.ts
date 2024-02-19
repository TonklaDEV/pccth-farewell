import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WellfareService } from 'src/app/api-services/wellfare.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-wellfare-page',
  templateUrl: './wellfare-page.component.html',
  styleUrls: ['./wellfare-page.component.scss'],
})
export class WellfarePageComponent implements OnInit {
  @Output() userIdChanged: EventEmitter<string> = new EventEmitter<string>();
  // expenseFrom: any;
  responseData: any = {};
  displayModal: boolean = false;
  constructor(private wellfareService: WellfareService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log('UserId in WellfareDialogComponent ngOnInit:', this.userId);
    this.cdr.detectChanges();
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
    const searchTerm = this.searchInput;
    this.wellfareService.searchUserByName(searchTerm).subscribe(
      (response) => {
        this.responseData = response.responseData.result;
        this.userIdChanged.emit(response.userId);
        console.log(this.responseData);
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

}
