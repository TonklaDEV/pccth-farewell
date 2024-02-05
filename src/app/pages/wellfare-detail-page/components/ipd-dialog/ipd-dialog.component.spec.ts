import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpdDialogComponent } from './ipd-dialog.component';

describe('IpdDialogComponent', () => {
  let component: IpdDialogComponent;
  let fixture: ComponentFixture<IpdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpdDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
