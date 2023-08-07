import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTripPlansComponent } from './user-trip-plans.component';

describe('UserTripPlansComponent', () => {
  let component: UserTripPlansComponent;
  let fixture: ComponentFixture<UserTripPlansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserTripPlansComponent]
    });
    fixture = TestBed.createComponent(UserTripPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
