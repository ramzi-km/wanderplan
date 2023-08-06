import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ToastrModule } from 'ngx-toastr';
import { AppInitializerService } from './app-intializer.service';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AdminNavComponent } from './components/admin/admin-nav/admin-nav.component';
import { FooterComponent } from './components/user/footer/footer.component';
import { HomeComponent } from './components/user/home/home.component';
import { LandingPageComponent } from './components/user/landing-page/landing-page.component';
import { LoginComponent } from './components/user/login/login.component';
import { NavComponent } from './components/user/nav/nav.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { SignupOtpComponent } from './components/user/sign-up/signup-otp/signup-otp.component';

import { ClickOutsideDirective } from './directives/click-outside.directive';

import { environment } from '../../environment';

import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { ErrorComponent } from './components/error/error.component';
import { ListGuidesComponent } from './components/user/list-guides/list-guides.component';
import { adminEffects } from './store/admin/admin.effects';
import { adminReducer } from './store/admin/admin.reducers';
import { usersEffects } from './store/admin/users/users.effects';
import { usersReducer } from './store/admin/users/users.reducers';
import { userEffects } from './store/user/user.effects';
import { userReducer } from './store/user/user.reducers';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AdminNavComponent,
    SignUpComponent,
    LoginComponent,
    LandingPageComponent,
    HomeComponent,
    ClickOutsideDirective,
    SignupOtpComponent,
    FooterComponent,
    ListGuidesComponent,
    ErrorComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    UserManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    StoreModule.forRoot({
      userState: userReducer,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
