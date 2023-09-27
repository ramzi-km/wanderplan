import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ShortGuideInfo } from 'src/app/interfaces/short-guide.interface';
import { ShortTripInfo } from 'src/app/interfaces/short-trip.interface';
import { ListGuidesService } from 'src/app/services/listGuides/list-guides.service';

@Component({
  selector: 'app-list-guides',
  templateUrl: './list-guides.component.html',
  styleUrls: ['./list-guides.component.scss'],
})
export class ListGuidesComponent implements OnInit, OnDestroy {
  loading = false;
  private ngUnsubscribe$ = new Subject<void>();
  searchText = '';
  page = 0;
  lastPage = 0;
  guides: ShortGuideInfo[] = [];
  itineraries: ShortTripInfo[] = [];
  searchForm: FormGroup;
  filter = 'guides';
  sort = 'popularity';

  constructor(
    fb: FormBuilder,
    private listGuidesService: ListGuidesService,
  ) {
    this.searchForm = fb.group({
      searchText: ['', [Validators.required]],
      filter: ['guides', [Validators.required]],
      sort: ['popularity', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.loading = true;
    this.listGuidesService
      .getAllGuidesAndItineraries()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.guides = res.guides ?? [];
          this.page = res.page;
          this.lastPage = res.lastPage;
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.loading = false;
        },
      });
  }

  submitSearchForm() {
    const formText = this.searchForm.value.searchText.trim();
    const filter = this.searchForm.value.filter;
    const sort = this.searchForm.value.sort;
    if (
      this.searchText == formText &&
      filter == this.filter &&
      this.sort == sort
    ) {
      return;
    }
    this.searchText = formText;
    this.filter = filter;
    this.sort = sort;
    const params = new HttpParams()
      .set('page', 0)
      .set('searchText', formText)
      .set('filter', filter)
      .set('sort', sort);
    this.loading = true;
    this.listGuidesService
      .getAllGuidesAndItineraries(params)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.guides = res.guides ?? [];
          this.itineraries = res.itineraries ?? [];
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
  nextPage() {
    const formText = this.searchText;
    const filter = this.filter;
    const sort = this.sort;
    const params = new HttpParams()
      .set('page', this.page + 1)
      .set('searchText', formText)
      .set('filter', filter)
      .set('sort', sort);
    this.loading = true;
    this.listGuidesService
      .getAllGuidesAndItineraries(params)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.guides = res.guides ?? [];
          this.itineraries = res.itineraries ?? [];
          this.loading = false;
          this.page = res.page;
          this.lastPage = res.lastPage;
          window.scrollTo(0, 0);
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.loading = false;
        },
      });
  }
  prevPage() {
    const formText = this.searchText;
    const filter = this.filter;
    const sort = this.sort;
    const params = new HttpParams()
      .set('page', this.page - 1)
      .set('searchText', formText)
      .set('filter', filter)
      .set('sort', sort);
    this.loading = true;
    this.listGuidesService
      .getAllGuidesAndItineraries(params)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.guides = res.guides ?? [];
          this.itineraries = res.itineraries ?? [];
          this.loading = false;
          this.page = res.page;
          this.lastPage = res.lastPage;
          window.scrollTo(0, 0);
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
