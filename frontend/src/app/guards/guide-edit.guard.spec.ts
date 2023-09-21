import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guideEditGuard } from './guide-edit.guard';

describe('guideEditGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guideEditGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
