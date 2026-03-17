import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ActiveAlarmsComponent } from './components/active-alarms/active-alarms.component';
import { SettingsComponent } from './components/settings/settings.component'; 
import { HistoryComponent } from './components/history/history.component';
import { LoginComponent } from './components/login/login'; // 1. Import Login

export const routes: Routes = [
  // 2. Redirect the empty path to login first
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  
  // 3. Add the login route
  { path: 'login', component: LoginComponent },

  // Your existing, safe routes
  { path: 'dashboard', component: DashboardComponent },
  { path: 'active-alarms', component: ActiveAlarmsComponent },
  { path: 'settings', component: SettingsComponent }, 
  { path: 'history', component: HistoryComponent },
  
  // Optional: Catch-all to send typos back to login
  { path: '**', redirectTo: 'login' }
];