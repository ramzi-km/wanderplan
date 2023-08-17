import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from '../components/error/error.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { adminLoginGuard } from './guards/admin-login.guard';
import { adminModuleResolver } from './resolvers/admin-module.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminNavComponent,
    resolve: {
      adminModuleResolver: adminModuleResolver,
    },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'user-management', component: UserManagementComponent },
    ],
    canActivate: [adminAuthGuard],
  },
  {
    path: 'login',
    component: AdminLoginComponent,
    canActivate: [adminLoginGuard],
  },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AdminRoutingModule {}
