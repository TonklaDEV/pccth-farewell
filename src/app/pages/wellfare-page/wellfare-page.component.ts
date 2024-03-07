import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WellfareService } from 'src/app/api-services/wellfare.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-wellfare-page',
  templateUrl: './wellfare-page.component.html',
  styleUrls: ['./wellfare-page.component.scss'],
})
export class WellfarePageComponent implements OnInit {
  [x: string]: any;
  // expenseFrom: any;
  userId: any;
  responseData: any = {};
  displayModal: boolean = false;
  filteredSearchValues: any[] = [];
  editMode: boolean = false;
  expenseId: number = 0;
  selectedYear: number | null = null;
  selectedMonth: number | null = null;
  years: number[] = [];
  months: { value: number; name: string }[] = [];
  yearSearch : Number = new Date().getFullYear()
  reportPrintForm: FormGroup = this.fb.group({
    uid: [],
    type: [''],
    reportType: '',
    year: new FormControl(this.selectedYear),
    month: new FormControl(this.selectedMonth),
  });
  constructor(
    private wellfareService: WellfareService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cdr.detectChanges();
    this.populateYears();
    this.populateMonths();
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
    console.log("responseData", this.responseData);
    const searchTerm: string = this.searchInput;
    
    this.wellfareService.searchUserByName(searchTerm).subscribe(
      (response) => {
        this.responseData = response.responseData.result;
        const userId = this.responseData[0]?.userId;
  
        if (userId) {
          console.log('User ID from response:', userId);
          this.userId = userId
          // Assuming you have a specific year to search for expenses
          
          this.searchExpensesByUserId(userId, this.yearSearch);
        } else {
          console.error('User ID is undefined.');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  showAll() {
    const searchTerm: string = this.searchInput;
    
    this.wellfareService.searchUserByName(searchTerm).subscribe(
      (response) => {
        this.responseData = response.responseData.result;
        const userId = this.responseData[0]?.userId;
  
        if (userId) {
          console.log('User ID from response:', userId);
  
          // Assuming you have a specific year to search for expenses
          
          this.searchExpensesByUserId(userId, 0);
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
  searchButtonClicked: boolean = false;
  
  searchExpensesByUserId(userId: number, year: Number): void {
    this.wellfareService.searchExpensesByUserId(userId, year).subscribe(
      (response) => {
        this.userData = response.expenses;
        this.searchButtonClicked = true;
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
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.saveExpense()
      } else {
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

  onSearchInputChange(): void {
    this['isSearchInputFilled'] = this.searchInput.trim().length > 0;
  }

  printModal: boolean = false;
  isSearchInputFilled: boolean = false;

  showModalPrintDialog(): void {
    console.log("userIdPrint", this.userId);
    this.reportPrintForm.get('type')!.setValue('');
    this.reportPrintForm.get('month')!.setValue('');
    this.reportPrintForm.get('year')!.setValue('');
    this.reportPrintForm.get('reportType')!.setValue('');
    if (this.searchButtonClicked) {
      this.printModal = true;

    } else {
    }
  }

  private populateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.years.push(currentYear - i);
    }
  }

  private populateMonths(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    this.months = [];

    for (let i = 1; i <= 12; i++) {
      if (
        currentYear === new Date(2000, i - 1, 1).getFullYear() ||
        i <= currentMonth
      ) {
        this.months.push({
          value: i,
          name: new Date(2000, i - 1, 1).toLocaleString('th-TH', {
            month: 'long',
          }),
        });
      } else if (currentYear !== new Date(2000, i - 1, 1).getFullYear()) {
        this.months.push({
          value: i,
          name: new Date(2000, i - 1, 1).toLocaleString('th-TH', {
            month: 'long',
          }),
        });
      }
    }

    // Set initial values to null for the selectedYear and selectedMonth
    this.selectedYear = null;
    this.selectedMonth = null;
  }

  pdfview(): void {
    this.reportPrintForm.get('uid')!.setValue(this.userId);

    this.wellfareService.getExpenseHistoryReportByEmployeeBase64(
      this.reportPrintForm.get('month')!.value,
      this.reportPrintForm.get('year')!.value,
      this.reportPrintForm.get('type')!.value,
      this.reportPrintForm.get('reportType')!.value,
      this.userId
    ).subscribe(
      (response) => {
        if (response && response.responseData && response.responseData.result) {
          this.openPdfPreview(response.responseData.result);
          
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  openPdfPreview(base64Data: string): void {
    const blob = this.base64toBlob(base64Data, 'application/pdf');
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  base64toBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

}