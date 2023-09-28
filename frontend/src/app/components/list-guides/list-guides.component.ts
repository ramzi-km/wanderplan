import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
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
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.searchForm = fb.group({
      searchText: ['', [Validators.required]],
      filter: ['guides', [Validators.required]],
      sort: ['popularity', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((params) => {
          const querySearch = params['search'] ?? '';
          const queryPage = params['page'] ?? 0;
          const queryFilter = params['filter'] ?? 'guides';
          const querySort = params['sort'] ?? 'popularity';

          this.searchForm.patchValue({
            searchText: querySearch,
            filter: queryFilter,
            sort: querySort,
          });
          this.searchText = querySearch;
          this.filter = queryFilter;
          this.sort = querySort;

          const paramsToPass = new HttpParams()
            .set('page', queryPage.toString())
            .set('searchText', querySearch)
            .set('filter', queryFilter)
            .set('sort', querySort);

          this.loading = true;

          return this.listGuidesService.getAllGuidesAndItineraries(
            paramsToPass,
          );
        }),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.guides = res.guides ?? [];
          this.itineraries = res.itineraries ?? [];
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
    this.router.navigate(['/guides'], {
      queryParams: { search: formText, page: 0, sort: sort, filter: filter },
    });
  }
  nextPage() {
    const formText = this.searchText;
    const filter = this.filter;
    const sort = this.sort;
    this.router.navigate(['/guides'], {
      queryParams: {
        search: formText,
        page: this.page + 1,
        sort: sort,
        filter: filter,
      },
    });
  }
  prevPage() {
    const formText = this.searchText;
    const filter = this.filter;
    const sort = this.sort;
    this.router.navigate(['/guides'], {
      queryParams: {
        search: formText,
        page: this.page - 1,
        sort: sort,
        filter: filter,
      },
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
