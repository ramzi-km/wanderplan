import { TestBed } from '@angular/core/testing';

import { HttpErrorInterceptor } from './HttpErrorInterceptor.interceptor';

describe('MainInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [HttpErrorInterceptor],
    }),
  );

  it('should be created', () => {
    const interceptor: HttpErrorInterceptor =
      TestBed.inject(HttpErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
