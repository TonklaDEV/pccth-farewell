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
  budgetData: Budget = { id: 0, level: '', opd: 0, ipd: 0, room: 0 };
  budgets: Budget[] = [];
  budgetId: number | null = null;
  opdValue: string = '';
  ipdValue: string = '';
  searchLevel: string = '';
  searchResults: Budget[] = [];


  constructor(private servicebudget: BudgetService,) { }

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
    if (!this.searchLevel.trim()) {
      this.filteredBudgets = this.budgets;
    } else {
      this.filteredBudgets = this.budgets.filter(item =>
        item.level.toLowerCase().includes(this.searchLevel.toLowerCase())
      );
    }
  }

  addBudget(): void {
    this.servicebudget.createBudget(this.budgetData).subscribe(
      response => {
        console.log('Budget created successfully:', response);
      },
      error => {
        console.error('Error creating budget:', error);
      }
    );
    window.location.reload();
  }

  searchBudgetByLevel(): void {
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
}

