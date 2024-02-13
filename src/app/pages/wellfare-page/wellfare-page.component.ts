import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wellfare-page',
  templateUrl: './wellfare-page.component.html',
  styleUrls: ['./wellfare-page.component.scss'],
})
export class WellfarePageComponent implements OnInit {
  // expenseFrom: any;
  displayModal: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  search() {}
  isHovered: boolean = false;
  showModalDialog() {
    this.displayModal = true;
}
}
