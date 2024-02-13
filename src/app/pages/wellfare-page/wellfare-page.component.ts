import { Component, OnInit } from '@angular/core';
import { WellfareService } from 'src/app/api-services/wellfare.service';

@Component({
  selector: 'app-wellfare-page',
  templateUrl: './wellfare-page.component.html',
  styleUrls: ['./wellfare-page.component.scss'],
})
export class WellfarePageComponent implements OnInit {
  // expenseFrom: any;
  displayModal: boolean = false;
  constructor(private wellfareService: WellfareService,) { }

  ngOnInit(): void { }

  search() { }

  showModalDialog() {
    this.displayModal = true;
  }

  searchInput: string = '';
  searchUsers(): void {
    const searchTerm = this.searchInput;
    console.log(searchTerm);
    console.log(this.searchInput);
    this.wellfareService.searchUserByName(searchTerm).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
