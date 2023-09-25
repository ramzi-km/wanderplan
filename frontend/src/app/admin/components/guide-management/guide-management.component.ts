import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Guide } from 'src/app/interfaces/guide.interface';
import { GuideManagementService } from '../../services/guide-management.service';

@Component({
  selector: 'app-guide-management',
  templateUrl: './guide-management.component.html',
  styleUrls: ['./guide-management.component.scss'],
})
export class GuideManagementComponent implements OnInit, OnDestroy {
  constructor(
    private guideManagementService: GuideManagementService,
    fb: FormBuilder,
  ) {
    this.searchForm = fb.group({
      searchText: ['', [Validators.required]],
    });
  }

  private ngUnsubscribe$ = new Subject<void>();
  guides: Array<Guide> = [];
  loading = false;
  unlistGuideLoading = {
    value: false,
    id: '',
  };
  searchForm: FormGroup;
  searchText = '';
  page = 0;
  lastPage = 0;

  ngOnInit(): void {
    this.loading = true;
    this.guideManagementService
      .getAllGuides()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.guides = res.guides;
          this.page = res.page;
          this.lastPage = res.lastPage;
          console.log(res.lastPage);
        },
        error: (errMessage) => {
          this.loading = false;
        },
      });
  }
  toggleUnlist(guideId: string) {
    if (!this.unlistGuideLoading.value) {
      this.unlistGuideLoading = {
        value: true,
        id: guideId,
      };
    }
    this.guideManagementService
      .toggleUnlistGuide(guideId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.guides = this.guides.map((guide) => {
            if (guide._id == res.guide._id) {
              return res.guide;
            } else {
              return guide;
            }
          });
          this.unlistGuideLoading = {
            value: false,
            id: '',
          };
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.unlistGuideLoading = {
            value: false,
            id: '',
          };
        },
      });
  }

  searchGuide() {
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
      this.guideManagementService
        .getAllGuides(params)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.guides = res.guides;
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
      this.guideManagementService
        .getAllGuides(params)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.guides = res.guides;
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
      this.guideManagementService
        .getAllGuides(params)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.guides = res.guides;
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
