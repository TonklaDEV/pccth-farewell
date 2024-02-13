import { TestBed } from '@angular/core/testing';

import { WellfareService } from './wellfare.service';

describe('WellfareService', () => {
  let service: WellfareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WellfareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
