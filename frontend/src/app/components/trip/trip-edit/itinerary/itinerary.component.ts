import { Component, ElementRef, Input } from '@angular/core';
import { Trip } from 'src/app/interfaces/trip.interface';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
})
export class ItineraryComponent {
  @Input() trip: Trip | undefined;
  constructor(private elementRef: ElementRef) {}
  scrollToSection(sectionId: string) {
    const sectionElement = this.elementRef.nativeElement.querySelector(
      `.section-${sectionId}`,
    );
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
