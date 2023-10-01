import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { AdminDashboardService } from '../../services/admin-dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  series2: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
};

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: ChartComponent;
  public usersChartOptions!: Partial<ChartOptions>;
  public expensesChartOptions!: Partial<ChartOptions>;
  public destinationsChartOptions!: Partial<ChartOptions>;

  private ngUnsubscribe$ = new Subject<void>();

  totalUsers: number = 0;
  totalTrips: number = 0;
  totalGuides: number = 0;
  totalUnvervifiedUsers: number = 0;
  loading = 4;
  categoryNames: string[] = [];
  categoryAmount: number[] = [];

  placeData: {
    x: string;
    y: number;
  }[] = [];

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.dashboardService
      .getGeneralDetails()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.totalUsers = res.totalUsers;
          this.totalGuides = res.totalGuides;
          this.totalTrips = res.totalTrips;
          this.totalUnvervifiedUsers = res.totalUnverifiedUsers;
          this.loading--;
        },
        error: (errMessage) => {
          this.loading--;
          console.log(errMessage);
        },
      });
    this.dashboardService
      .getMonthlyUsers()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.usersChartOptions = {
            series: [
              {
                name: 'users',
                data: res.monthlyUsers,
              },
            ],
            chart: {
              height: 250,
              type: 'line',
            },
            xaxis: {
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
            },
          };
          this.loading--;
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.loading--;
        },
      });

    this.dashboardService
      .getCategoryWiseExpenditure()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          res.categoryWiseExpenditure.forEach((category) => {
            this.categoryNames.push(category._id);
            this.categoryAmount.push(category.totalAmount);
          });
          this.expensesChartOptions = {
            series2: [...this.categoryAmount],
            chart: {
              width: 400,
              type: 'pie',
            },
            labels: [...this.categoryNames],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: 'bottom',
                  },
                },
              },
            ],
          };
          this.loading--;
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.loading--;
        },
      });

    this.dashboardService
      .getPopularDestinations()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          res.popularDestinations.forEach((destination) => {
            this.placeData.push({
              x: destination._id,
              y: destination.totalTrips,
            });
          });

          this.destinationsChartOptions = {
            series: [
              {
                data: [...this.placeData],
              },
            ],

            chart: {
              height: 300,
              type: 'treemap',
            },
          };
          this.loading--;
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.loading--;
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
