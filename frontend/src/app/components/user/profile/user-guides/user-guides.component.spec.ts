import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGuidesComponent } from './user-guides.component';

describe('UserGuidesComponent', () => {
  let component: UserGuidesComponent;
  let fixture: ComponentFixture<UserGuidesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserGuidesComponent]
    });
    fixture = TestBed.createComponent(UserGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
