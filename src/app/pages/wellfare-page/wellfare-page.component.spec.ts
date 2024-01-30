import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellfarePageComponent } from './wellfare-page.component';

describe('WellfarePageComponent', () => {
  let component: WellfarePageComponent;
  let fixture: ComponentFixture<WellfarePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellfarePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellfarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
