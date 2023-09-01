import { Component, Input } from '@angular/core';
import { Trip } from 'src/app/interfaces/trip.interface';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
})
export class ItineraryComponent {
  @Input() trip: Trip | undefined;
}
