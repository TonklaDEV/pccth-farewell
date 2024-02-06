import { Component, OnInit } from '@angular/core';
export interface Budget {
  level: string;
  opd: number;
  ipd: number;
  roomFood: number;
}

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
export class BudgetComponent implements OnInit {
  showAddModal = false;
  showEditModal = false;
  budgetData: Budget = { level: '', opd: 0, ipd: 0, roomFood: 0 }; // Use the Budget model for type safety
  budgets: Budget[] = [];
  budgetId: number | null = null;
  opdValue: string = '';
  ipdValue: string = '';

  constructor() {}

  ngOnInit(): void {}

  addBudget(): void {
    const newId = this.budgets.length + 1; // Generate an ID for the new budget
    const newBudget: Budget = {
      level: this.budgetData.level,
      opd: this.budgetData.opd,
      ipd: this.budgetData.ipd,
      roomFood: this.budgetData.roomFood,
    };
    this.budgets.push(newBudget);
    this.budgetData = { level: '', opd: 0, ipd: 0, roomFood: 0 }; // Reset the form
  }
}
