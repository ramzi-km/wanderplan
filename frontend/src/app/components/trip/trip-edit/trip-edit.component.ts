import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as tripEditSelecctor from '../../../store/editingTrip/trip-edit.selectors';

@Component({
  selector: 'app-trip-edit',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.scss'],
})
export class TripEditComponent {
  constructor(private store: Store) {}

  trip$=this.store.select(tripEditSelecctor.selectEditingTrip)

}
