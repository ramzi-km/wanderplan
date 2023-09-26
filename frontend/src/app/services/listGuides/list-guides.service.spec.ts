import { TestBed } from '@angular/core/testing';

import { ListGuidesService } from './list-guides.service';

describe('ListGuidesService', () => {
  let service: ListGuidesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListGuidesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
