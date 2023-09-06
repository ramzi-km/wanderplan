import { TestBed } from '@angular/core/testing';

import { ItineraryManagementService } from './itinerary-management.service';

describe('ItineraryManagementService', () => {
  let service: ItineraryManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItineraryManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
