import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminNavComponent } from './components/admin/admin-nav/admin-nav.component';
import { HomeComponent } from './components/user/home/home.component';
import { LandingPageComponent } from './components/user/landing-page/landing-page.component';
import { LoginComponent } from './components/user/login/login.component';
import { NavComponent } from './components/user/nav/nav.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';

@NgModule({
  declarations: [AppComponent, NavComponent, AdminNavComponent, SignUpComponent, LoginComponent, LandingPageComponent, HomeComponent, ClickOutsideDirective],
  imports: [BrowserModule, AppRoutingModule,ReactiveFormsModule,FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
