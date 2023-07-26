import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/user/nav/nav.component';
import { AdminNavComponent } from './components/admin/admin-nav/admin-nav.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { LoginComponent } from './components/user/login/login.component';
import { LandingPageComponent } from './components/user/landing-page/landing-page.component';
import { HomeComponent } from './components/user/home/home.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';

@NgModule({
  declarations: [AppComponent, NavComponent, AdminNavComponent, SignUpComponent, LoginComponent, LandingPageComponent, HomeComponent, ClickOutsideDirective],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
