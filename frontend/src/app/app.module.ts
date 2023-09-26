import {
  GoogleLoginProvider,
  GoogleSigninButtonDirective,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
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
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ToastrModule } from 'ngx-toastr';
import { AppInitializerService } from './app-intializer.service';
import { AppRoutingModule } from './app-routing.module';

import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { AppComponent } from './app.component';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { CreateGuideComponent } from './components/create-guide/create-guide.component';
import { CreatePlanComponent } from './components/create-plan/create-plan.component';
import { ErrorComponent } from './components/error/error.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ListGuidesComponent } from './components/list-guides/list-guides.component';
import { LoginComponent } from './components/login/login.component';
import { ResetForgotPasswordComponent } from './components/login/reset-forgot-password/reset-forgot-password.component';
import { NavComponent } from './components/nav/nav.component';
import { ProfileModalComponent } from './components/profile/profile-modal/profile-modal.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserGuidesComponent } from './components/profile/user-guides/user-guides.component';
import { UserTripPlansComponent } from './components/profile/user-trip-plans/user-trip-plans.component';
import { CarouselComponent } from './components/shared components/carousel/carousel.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignupOtpComponent } from './components/sign-up/signup-otp/signup-otp.component';
import { GroupChatComponent } from './components/trip/group-chat/group-chat.component';
import { BudgetComponent } from './components/trip/trip-edit/budget/budget.component';
import { ItineraryComponent } from './components/trip/trip-edit/itinerary/itinerary.component';
import { OverviewComponent } from './components/trip/trip-edit/overview/overview.component';
import { TripEditComponent } from './components/trip/trip-edit/trip-edit.component';
import { TripViewComponent } from './components/trip/trip-view/trip-view.component';

import { AutoResizeTextareaDirective } from './directives/auto-resize-textarea.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';

import { environment } from '../../environment';
import { HttpErrorInterceptor } from './interceptors/HttpErrorInterceptor.interceptor';

import { adminEffects } from './admin/store/admin/admin.effects';
import { adminReducer } from './admin/store/admin/admin.reducers';
import { usersEffects } from './admin/store/users/users.effects';
import { usersReducer } from './admin/store/users/users.reducers';
import { editGuideReducer } from './store/editingGuide/guide-edit.reducers';
import { editTripReducer } from './store/editingTrip/trip-edit.reducers';
import { userEffects } from './store/user/user.effects';
import { userReducer } from './store/user/user.reducers';

import { GuideEditComponent } from './components/guide/guide-edit/guide-edit.component';
import { GuideSectionComponent } from './components/guide/guide-edit/guide-section/guide-section.component';
import { GuideViewComponent } from './components/guide/guide-view/guide-view.component';
import { CustomDateFormatPipe } from './pipes/custom-date-format.pipe';
import { CustomDateFormat2Pipe } from './pipes/custom-date-format2.pipe';
import { DateRangePipe } from './pipes/date-range.pipe';
import { DateTimeFormatPipe } from './pipes/date-time-format.pipe';
import { DaysToPipe } from './pipes/days-to.pipe';

const config: SocketIoConfig = { url: environment.API_URL, options: {} };

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
    AttachmentComponent,
    OverviewComponent,
    ItineraryComponent,
    BudgetComponent,
    AutoResizeTextareaDirective,
    CarouselComponent,
    CustomDateFormatPipe,
    CustomDateFormat2Pipe,
    GroupChatComponent,
    DateTimeFormatPipe,
    GuideEditComponent,
    GuideViewComponent,
    GuideSectionComponent,
  ],
  imports: [
    PickerComponent,
    SocialLoginModule,
    GoogleSigninButtonModule,
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
    SocketIoModule.forRoot(config),
    ToastrModule.forRoot(),
    StoreModule.forRoot({
      userState: userReducer,
      editTripState: editTripReducer,
      adminState: adminReducer,
      usersState: usersReducer,
      editGuideState: editGuideReducer,
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
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID, {
              oneTapEnabled: true,
            }),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
