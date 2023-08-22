import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/user/home/home.component';
import { LandingPageComponent } from './components/user/landing-page/landing-page.component';
import { LoginComponent } from './components/user/login/login.component';
import { NavComponent } from './components/user/nav/nav.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { SignupOtpComponent } from './components/user/sign-up/signup-otp/signup-otp.component';

import { ErrorComponent } from './components/error/error.component';
import { TripEditComponent } from './components/trip/trip-edit/trip-edit.component';
import { TripViewComponent } from './components/trip/trip-view/trip-view/trip-view.component';
import { CreateGuideComponent } from './components/user/create-guide/create-guide.component';
import { CreatePlanComponent } from './components/user/create-plan/create-plan.component';
import { ListGuidesComponent } from './components/user/list-guides/list-guides.component';
import { ResetForgotPasswordComponent } from './components/user/login/reset-forgot-password/reset-forgot-password.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { UserGuidesComponent } from './components/user/profile/user-guides/user-guides.component';
import { UserTripPlansComponent } from './components/user/profile/user-trip-plans/user-trip-plans.component';
import { guestGuard } from './guards/guest.guard';
import { tripEditGuard } from './guards/trip-edit.guard';
import { userAuthGuard } from './guards/user-auth.guard';

const routes: Routes = [
  {
    path: 'admen',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
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
            canActivate: [tripEditGuard],
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
      {
        path: 'resetForgotPassword',
        component: ResetForgotPasswordComponent,
        canActivate: [guestGuard],
      },
      { path: '**', component: ErrorComponent },
    ],
  },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
