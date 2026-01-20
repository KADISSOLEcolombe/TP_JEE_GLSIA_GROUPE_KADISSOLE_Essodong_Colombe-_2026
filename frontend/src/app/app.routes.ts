import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { LoginAdminComponent } from './components/login-admin.component';
import { RegisterAdminComponent } from './components/register-admin.component';
import { LoginClientComponent } from './components/login-client.component';
import { RegisterClientComponent } from './components/register-client.component';
import { DashboardAdminComponent } from './components/dashboard-admin.component';
import { DashboardClientComponent } from './components/dashboard-client.component';
import { adminGuard, clientGuard, noAuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login-admin', component: LoginAdminComponent, canActivate: [noAuthGuard] },
  { path: 'register-admin', component: RegisterAdminComponent, canActivate: [noAuthGuard] },
  { path: 'login-client', component: LoginClientComponent, canActivate: [noAuthGuard] },
  { path: 'register-client', component: RegisterClientComponent, canActivate: [noAuthGuard] },
  { path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [adminGuard] },
  { path: 'dashboard-client', component: DashboardClientComponent, canActivate: [clientGuard] },
  { path: '**', redirectTo: '' }
];
