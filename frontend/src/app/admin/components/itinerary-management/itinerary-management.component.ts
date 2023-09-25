import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Trip } from 'src/app/interfaces/trip.interface';
import { ItinerariesManagementService } from '../../services/itineraries-management.service';

@Component({
  selector: 'app-itinerary-management',
  templateUrl: './itinerary-management.component.html',
  styleUrls: ['./itinerary-management.component.scss'],
})
export class ItineraryManagementComponent implements OnInit, OnDestroy {
  constructor(
    private itinerariesManagement: ItinerariesManagementService,
    fb: FormBuilder,
  ) {
    this.searchForm = fb.group({
      searchText: ['', [Validators.required]],
    });
  }

  private ngUnsubscribe$ = new Subject<void>();
  searchForm: FormGroup;
  searchText = '';
  itineraries: Array<Trip> = [];
  loading = false;
  unListItineraryLoading = {
    value: false,
    id: '',
  };
  page = 0;
  lastPage = 0;

  ngOnInit(): void {
    this.loading = true;
    this.itinerariesManagement
      .getAllItineraries()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.itineraries = res.itineraries;
          this.page = res.page;
          this.lastPage = res.lastPage;
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
      .toggleUnlistItinerary(itineraryId)
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
  searchItinerary() {
    if (!this.loading) {
      const formText = this.searchForm.value.searchText.trim();
      if (formText == this.searchText) {
        return;
      }
      this.searchText = formText;

      const params = new HttpParams()
        .set('page', 0)
        .set('searchText', this.searchText);
      this.loading = true;
      this.itinerariesManagement
        .getAllItineraries(params)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.itineraries = res.itineraries;
            this.loading = false;
            this.page = res.page;
            this.lastPage = res.lastPage;
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.loading = false;
          },
        });
    }
  }

  nextPage() {
    if (!this.loading) {
      const params = new HttpParams()
        .set('page', this.page + 1)
        .set('searchText', this.searchText);
      this.loading = true;
      this.itinerariesManagement
        .getAllItineraries(params)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.itineraries = res.itineraries;
            this.loading = false;
            this.page = res.page;
            this.lastPage = res.lastPage;
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.loading = false;
          },
        });
    }
  }
  prevPage() {
    if (!this.loading) {
      const params = new HttpParams()
        .set('page', this.page - 1)
        .set('searchText', this.searchText);
      this.loading = true;
      this.itinerariesManagement
        .getAllItineraries(params)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.itineraries = res.itineraries;
            this.loading = false;
            this.page = res.page;
            this.lastPage = res.lastPage;
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.loading = false;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
