import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellfareDialogComponent } from './wellfare-dialog.component';

describe('WellfareDialogComponent', () => {
  let component: WellfareDialogComponent;
  let fixture: ComponentFixture<WellfareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellfareDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellfareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
