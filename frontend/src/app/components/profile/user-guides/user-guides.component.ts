import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ShortGuideInfo } from 'src/app/interfaces/short-guide.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-guides',
  templateUrl: './user-guides.component.html',
  styleUrls: ['./user-guides.component.scss'],
})
export class UserGuidesComponent {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}
  private ngUnsubscribe = new Subject<void>();
  userGuides: Array<ShortGuideInfo> = [];
  loading = false;
  loadingMore = false;
  page = 0;
  lastPage = 0;
  editLoading=false

  ngOnInit(): void {
    this.loading = true;
    this.userService
      .getAllGuides()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.userGuides = res.guides;
          this.loading = false;
          this.page = res.page;
          this.lastPage = res.lastPage;
        },
        error: (errMessage: string) => {
          this.loading = false;
        },
      });
  }
  loadMoreGuides() {
    if (!this.loadingMore) {
      this.loadingMore = true;
      const page = this.page + 1;
      const params = new HttpParams().set('page', page);
      this.userService
        .getAllGuides(params)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.userGuides.push(...res.guides);
            this.loadingMore = false;
            this.page = res.page;
            this.lastPage = res.lastPage;
          },
          error: (errMessage: string) => {
            console.log(errMessage);
            this.loadingMore = false;
          },
        });
    }
  }
  navigateTo(id: string) {
    this.editLoading=true
    this.router.navigate(['guide/edit', id]);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
