import { CommonModule } from '@angular/common';
import { NgModule, isDevMode } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { GuideManagementComponent } from './components/guide-management/guide-management.component';
import { ItineraryManagementComponent } from './components/itinerary-management/itinerary-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminLoginComponent,
    AdminNavComponent,
    UserManagementComponent,
    CategoryManagementComponent,
    GuideManagementComponent,
    ItineraryManagementComponent,
  ],
  imports: [
    NgApexchartsModule,
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
})
export class AdminModule {}
