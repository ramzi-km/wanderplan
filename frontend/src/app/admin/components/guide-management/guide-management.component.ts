import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Guide } from 'src/app/interfaces/guide.interface';
import { GuideManagementService } from '../../services/guide-management.service';

@Component({
  selector: 'app-guide-management',
  templateUrl: './guide-management.component.html',
  styleUrls: ['./guide-management.component.scss'],
})
export class GuideManagementComponent implements OnInit, OnDestroy {
  constructor(private guideManagementService: GuideManagementService) {}

  private ngUnsubscribe$ = new Subject<void>();
  searchText = '';
  guides: Array<Guide> = [];
  loading = false;
  unlistGuideLoading = {
    value: false,
    id: '',
  };

  ngOnInit(): void {
    this.loading = true;
    this.guideManagementService
      .getAllGuides()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.guides = res.guides;
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

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
