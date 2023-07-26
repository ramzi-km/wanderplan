import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/user/home/home.component';
import { LandingPageComponent } from './components/user/landing-page/landing-page.component';
import { LoginComponent } from './components/user/login/login.component';
import { NavComponent } from './components/user/nav/nav.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      { path: '', component: LandingPageComponent},
      { path: 'signup', component: SignUpComponent },
      { path:'login', component: LoginComponent},
      { path:'home', component: HomeComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
