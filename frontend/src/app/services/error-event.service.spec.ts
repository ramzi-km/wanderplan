import { TestBed } from '@angular/core/testing';

import { ErrorEventService } from './error-event.service';

describe('ErrorEventService', () => {
  let service: ErrorEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
