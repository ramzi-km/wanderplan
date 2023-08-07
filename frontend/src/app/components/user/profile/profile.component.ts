import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as userSelectors from '../../../store/user/user.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(private store: Store) {}
  ngOnInit(): void {}
  user$ = this.store.select(userSelectors.selectUser);
  
}
