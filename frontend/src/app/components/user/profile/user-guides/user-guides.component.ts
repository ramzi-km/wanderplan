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
  ngOnInit(): void {
    this.loading = true;
    this.userService
      .getAllGuides()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.userGuides = res.guides;
          this.loading = false;
        },
        error: (errMessage: string) => {
          this.loading = false;
        },
      });
  }
  navigateTo(id: string) {
    this.router.navigate(['guide/edit', id]);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
