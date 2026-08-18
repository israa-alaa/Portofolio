import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
// import { Home } from './components/home/home';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' }, 
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];