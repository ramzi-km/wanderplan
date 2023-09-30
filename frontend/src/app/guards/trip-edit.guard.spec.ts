import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { tripEditGuard } from './trip-edit.guard';

describe('tripEditGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => tripEditGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
