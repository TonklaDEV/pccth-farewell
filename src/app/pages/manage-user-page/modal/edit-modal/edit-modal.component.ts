import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {
UserForm: any;
formBuilder: any;

  constructor() { }

  ngOnInit(): void {
    this.UserForm = this.formBuilder.group({
      
      dept: ['', Validators.required],

      email: ['', Validators.email],
      empId: ['', Validators.required],
      remark: ['', Validators.required],
      status: ['', Validators.required],
      tname: ['', Validators.required],
      prefix: ['', Validators.required],
      tposition: ['', Validators.required],
      tprefix: ['', Validators.required],
      tsurname: ['', Validators.required],
      
      startDate: ['', Validators.required],
      deptCode: ['', Validators.required]
      
      
      
    });
  }

}
