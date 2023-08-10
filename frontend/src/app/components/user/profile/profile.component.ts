import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as userSelectors from '../../../store/user/user.selectors';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private store: Store,
    private matDialog: MatDialog,
  ) {}
  ngOnInit(): void {}
  user$ = this.store.select(userSelectors.selectUser);

  openDialog() {
    this.matDialog.open(ProfileModalComponent, {
      width: '350px',
    });
  }
}
