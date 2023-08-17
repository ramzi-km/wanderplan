import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { adminModuleResolver } from './admin-module.resolver';

describe('adminModuleResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => adminModuleResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
