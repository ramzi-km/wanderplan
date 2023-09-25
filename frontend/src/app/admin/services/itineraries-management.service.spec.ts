import { TestBed } from '@angular/core/testing';

import { ItinerariesManagementService } from './itineraries-management.service';

describe('ItinerariesManagementService', () => {
  let service: ItinerariesManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItinerariesManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
