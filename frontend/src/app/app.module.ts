import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  isDevMode,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ToastrModule } from 'ngx-toastr';
import { AppInitializerService } from './app-intializer.service';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ErrorComponent } from './components/error/error.component';
import { TripEditComponent } from './components/trip/trip-edit/trip-edit.component';
import { TripViewComponent } from './components/trip/trip-view/trip-view/trip-view.component';
import { CreateGuideComponent } from './components/user/create-guide/create-guide.component';
import { CreatePlanComponent } from './components/user/create-plan/create-plan.component';
import { FooterComponent } from './components/user/footer/footer.component';
import { HomeComponent } from './components/user/home/home.component';
import { LandingPageComponent } from './components/user/landing-page/landing-page.component';
import { ListGuidesComponent } from './components/user/list-guides/list-guides.component';
import { LoginComponent } from './components/user/login/login.component';
import { NavComponent } from './components/user/nav/nav.component';
import { ProfileModalComponent } from './components/user/profile/profile-modal/profile-modal.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { UserGuidesComponent } from './components/user/profile/user-guides/user-guides.component';
import { UserTripPlansComponent } from './components/user/profile/user-trip-plans/user-trip-plans.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { SignupOtpComponent } from './components/user/sign-up/signup-otp/signup-otp.component';

import { ClickOutsideDirective } from './directives/click-outside.directive';

import { environment } from '../../environment';

import { editTripReducer } from './store/editingTrip/trip-edit.reducers';
import { userEffects } from './store/user/user.effects';
import { userReducer } from './store/user/user.reducers';

import { adminEffects } from './admin/store/admin/admin.effects';
import { adminReducer } from './admin/store/admin/admin.reducers';
import { usersEffects } from './admin/store/users/users.effects';
import { usersReducer } from './admin/store/users/users.reducers';
import { MainInterceptor } from './interceptors/main.interceptor';
import { DateRangePipe } from './pipes/date-range.pipe';
import { DaysToPipe } from './pipes/days-to.pipe';
import { ResetForgotPasswordComponent } from './components/user/login/reset-forgot-password/reset-forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SignUpComponent,
    LoginComponent,
    LandingPageComponent,
    HomeComponent,
    ClickOutsideDirective,
    SignupOtpComponent,
    FooterComponent,
    ListGuidesComponent,
    ErrorComponent,
    ProfileComponent,
    UserTripPlansComponent,
    UserGuidesComponent,
    ProfileModalComponent,
    CreatePlanComponent,
    CreateGuideComponent,
    DateRangePipe,
    DaysToPipe,
    TripEditComponent,
    TripViewComponent,
    ResetForgotPasswordComponent,
  ],
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    BrowserModule,
    MatFormFieldModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot({
      userState: userReducer,
      editTripState: editTripReducer,
      adminState: adminReducer,
      usersState: usersReducer,
    }),
    EffectsModule.forRoot([userEffects, adminEffects, usersEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [
    AppInitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitializerService: AppInitializerService) => () =>
        appInitializerService.initializeApp(),
      deps: [AppInitializerService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
