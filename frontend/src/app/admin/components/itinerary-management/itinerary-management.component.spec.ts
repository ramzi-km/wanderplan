import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryManagementComponent } from './itinerary-management.component';

describe('ItineraryManagementComponent', () => {
  let component: ItineraryManagementComponent;
  let fixture: ComponentFixture<ItineraryManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryManagementComponent],
    });
    fixture = TestBed.createComponent(ItineraryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
