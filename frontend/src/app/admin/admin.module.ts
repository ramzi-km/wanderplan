import { CommonModule } from '@angular/common';
import { NgModule, isDevMode } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { adminEffects } from './store/admin/admin.effects';
import { adminReducer } from './store/admin/admin.reducers';
import { usersEffects } from './store/users/users.effects';
import { usersReducer } from './store/users/users.reducers';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminLoginComponent,
    AdminNavComponent,
    UserManagementComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
})
export class AdminModule {}
