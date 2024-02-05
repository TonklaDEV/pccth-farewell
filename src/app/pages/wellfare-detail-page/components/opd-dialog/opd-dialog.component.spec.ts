import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdDialogComponent } from './opd-dialog.component';

describe('OpdDialogComponent', () => {
  let component: OpdDialogComponent;
  let fixture: ComponentFixture<OpdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpdDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
