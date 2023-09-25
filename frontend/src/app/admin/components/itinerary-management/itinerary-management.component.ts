import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Guide } from 'src/app/interfaces/guide.interface';
import { Trip } from 'src/app/interfaces/trip.interface';
import { ItinerariesManagementService } from '../../services/itineraries-management.service';

@Component({
  selector: 'app-itinerary-management',
  templateUrl: './itinerary-management.component.html',
  styleUrls: ['./itinerary-management.component.scss'],
})
export class ItineraryManagementComponent implements OnInit, OnDestroy {
  constructor(private itinerariesManagement: ItinerariesManagementService) {}

  private ngUnsubscribe$ = new Subject<void>();
  searchText = '';
  itineraries: Array<Trip> = [];
  loading = false;
  unListItineraryLoading = {
    value: false,
    id: '',
  };

  ngOnInit(): void {
    this.loading = true;
    this.itinerariesManagement
      .getAllGuides()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.itineraries = res.itineraries;
        },
        error: (errMessage) => {
          this.loading = false;
        },
      });
  }
  toggleUnlist(itineraryId: string) {
    if (!this.unListItineraryLoading.value) {
      this.unListItineraryLoading = {
        value: true,
        id: itineraryId,
      };
    }
    this.itinerariesManagement
      .toggleUnlistGuide(itineraryId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.itineraries = this.itineraries.map((itinerary) => {
            if (itinerary._id == res.itinerary._id) {
              return res.itinerary;
            } else {
              return itinerary;
            }
          });
          this.unListItineraryLoading = {
            value: false,
            id: '',
          };
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.unListItineraryLoading = {
            value: false,
            id: '',
          };
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
