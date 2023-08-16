import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/user/home/home.component';
import { LandingPageComponent } from './components/user/landing-page/landing-page.component';
import { LoginComponent } from './components/user/login/login.component';
import { NavComponent } from './components/user/nav/nav.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { SignupOtpComponent } from './components/user/sign-up/signup-otp/signup-otp.component';

import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminNavComponent } from './components/admin/admin-nav/admin-nav.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { ErrorComponent } from './components/error/error.component';
import { TripEditComponent, TripEditComponent } from './components/trip/trip-edit/trip-edit.component';
import { TripViewComponent, TripViewComponent } from './components/trip/trip-view/trip-view/trip-view.component';
import { CreateGuideComponent } from './components/user/create-guide/create-guide.component';
import { CreatePlanComponent } from './components/user/create-plan/create-plan.component';
import { ListGuidesComponent } from './components/user/list-guides/list-guides.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { UserGuidesComponent } from './components/user/profile/user-guides/user-guides.component';
import { UserTripPlansComponent } from './components/user/profile/user-trip-plans/user-trip-plans.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { adminLoginGuard } from './guards/admin-login.guard';
import { guestGuard } from './guards/guest.guard';
import { tripEditGuard, tripEditGuard } from './guards/trip-edit.guard';
import { userAuthGuard } from './guards/user-auth.guard';
import { TripEditResolver, TripEditResolver } from './resolvers/trip-edit.resolver';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      { path: '', component: LandingPageComponent, canActivate: [guestGuard] },
      { path: 'signup', component: SignUpComponent, canActivate: [guestGuard] },
      { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
      { path: 'home', component: HomeComponent, canActivate: [userAuthGuard] },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [userAuthGuard],
        children: [
          { path: '', redirectTo: 'trip-plans', pathMatch: 'full' },
          { path: 'trip-plans', component: UserTripPlansComponent },
          { path: 'guides', component: UserGuidesComponent },
        ],
      },
      {
        path: 'create',
        canActivate: [userAuthGuard],
        children: [
          { path: '', redirectTo: 'plan', pathMatch: 'full' },
          { path: 'plan', component: CreatePlanComponent },
          { path: 'guide', component: CreateGuideComponent },
        ],
      },
      {
        path: 'trip',
        children: [
          {
            path: 'edit/:id',
            component: TripEditComponent,
            // resolve: { trip: TripEditResolver },
            // canActivate: [tripEditGuard],
          },
          {
            path: 'view/:id',
            component: TripViewComponent,
            canActivate: [userAuthGuard],
          },
        ],
      },
      { path: 'guides', component: ListGuidesComponent },
      {
        path: 'emailVerification',
        component: SignupOtpComponent,
        canActivate: [guestGuard],
      },
    ],
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent,
    canActivate: [adminLoginGuard],
  },
  {
    path: 'admin',
    component: AdminNavComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'user-management', component: UserManagementComponent },
    ],
    canActivate: [adminAuthGuard],
  },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
