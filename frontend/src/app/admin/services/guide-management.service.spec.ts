import { TestBed } from '@angular/core/testing';

import { GuideManagementService } from './guide-management.service';

describe('GuideManagementService', () => {
  let service: GuideManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuideManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
