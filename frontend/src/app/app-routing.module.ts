import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateGuideComponent } from './components/create-guide/create-guide.component';
import { CreatePlanComponent } from './components/create-plan/create-plan.component';
import { ErrorComponent } from './components/error/error.component';
import { GuideEditComponent } from './components/guide/guide-edit/guide-edit.component';
import { GuideViewComponent } from './components/guide/guide-view/guide-view.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ListGuidesComponent } from './components/list-guides/list-guides.component';
import { LoginComponent } from './components/login/login.component';
import { ResetForgotPasswordComponent } from './components/login/reset-forgot-password/reset-forgot-password.component';
import { NavComponent } from './components/nav/nav.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserGuidesComponent } from './components/profile/user-guides/user-guides.component';
import { UserTripPlansComponent } from './components/profile/user-trip-plans/user-trip-plans.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignupOtpComponent } from './components/sign-up/signup-otp/signup-otp.component';
import { TripEditComponent } from './components/trip/trip-edit/trip-edit.component';
import { TripViewComponent } from './components/trip/trip-view/trip-view.component';

import { guestGuard } from './guards/guest.guard';
import { guideEditGuard } from './guards/guide-edit.guard';
import { tripEditGuard } from './guards/trip-edit.guard';
import { userAuthGuard } from './guards/user-auth.guard';

const routes: Routes = [
  {
    path: 'admin',
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
      {
        path: 'guide',
        children: [
          {
            path: 'edit/:id',
            component: GuideEditComponent,
            canActivate: [guideEditGuard],
          },
          {
            path: 'view/:id',
            component: GuideViewComponent,
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
