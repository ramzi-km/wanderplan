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
  guides: Guide[] = [];
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
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
