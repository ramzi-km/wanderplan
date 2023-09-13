import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from '../components/error/error.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { adminLoginGuard } from './guards/admin-login.guard';

const routes: Routes = [
  {
    path: 'login',
    component: AdminLoginComponent,
    canActivate: [adminLoginGuard],
  },
  {
    path: '',
    component: AdminNavComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'userManagement', component: UserManagementComponent },
      { path: 'categoryManagement', component: CategoryManagementComponent },
      { path: '**', component: ErrorComponent },
    ],
    canActivate: [adminAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AdminRoutingModule {}
