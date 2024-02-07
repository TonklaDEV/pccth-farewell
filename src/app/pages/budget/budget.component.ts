import { Component, OnInit } from '@angular/core';
import { BudgetService } from 'src/app/api-services/budget.service';
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
  showAddModal = false;
  showEditModal = false;
  budgetData: Budget = {id: 0, level: '', opd: 0, ipd: 0, room: 0 };
  budgets: Budget[] = [];
  budgetId: number | null = null;
  opdValue: string = '';
  ipdValue: string = '';
  
  constructor(private servicebudget: BudgetService,) { }

  ngOnInit(): void {
    console.log(this.findAllBudgets); 
    this.findAllBudgets()
   }

   findAllBudgets(): void {
    this.servicebudget.getBudgets().subscribe(
      (response: Budget[]) => {
        this.budgets = response;
      },
      (error) => {
        console.error('Error loading budgets:', error);
      }
    );
  }
  
  addBudget(): void {
    const newId = this.budgets.length + 1; // Generate an ID for the new budget
    const newBudget: Budget = {
      level: this.budgetData.level,
      opd: this.budgetData.opd,
      ipd: this.budgetData.ipd,
      room: this.budgetData.room,
    };
    this.budgets.push(newBudget);
    this.budgetData = { level: '', opd: 0, ipd: 0, room: 0 }; // Reset the form
  }
}
