import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideManagementComponent } from './guide-management.component';

describe('GuideManagementComponent', () => {
  let component: GuideManagementComponent;
  let fixture: ComponentFixture<GuideManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuideManagementComponent]
    });
    fixture = TestBed.createComponent(GuideManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
