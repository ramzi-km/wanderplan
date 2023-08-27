import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { environment } from 'environment';
import mapboxgl from 'mapbox-gl';
import * as tripEditSelecctor from '../../../store/editingTrip/trip-edit.selectors';

@Component({
  selector: 'app-trip-edit',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.scss'],
})
export class TripEditComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  coordinates!: [number, number];
  constructor(private store: Store) {
    mapboxgl.accessToken = environment.MAPBOX_TOKEN;
  }
  ngOnInit() {
    this.trip$.subscribe({
      next: (trip) => {
        this.coordinates = trip.place?.coordinates!;
      },
    });
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.coordinates,
      zoom: 9,
    });
  }
  trip$ = this.store.select(tripEditSelecctor.selectEditingTrip);
  isDrawerOpen(): boolean {
    return this.drawer?.opened || false;
  }
}
