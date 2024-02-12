import { TestBed } from '@angular/core/testing';

import { WellfareDetailsService } from './wellfare-details.service';

describe('WellfareDetailsService', () => {
  let service: WellfareDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WellfareDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
