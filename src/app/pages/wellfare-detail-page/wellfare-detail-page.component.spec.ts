import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellfareDetailPageComponent } from './wellfare-detail-page.component';

describe('WellfareDetailPageComponent', () => {
  let component: WellfareDetailPageComponent;
  let fixture: ComponentFixture<WellfareDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellfareDetailPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellfareDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
