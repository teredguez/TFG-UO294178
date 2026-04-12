import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { FormComponent } from './modules/form/form.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './modules/auth/register/register.component';
import { AdminComponent } from './modules/admin/admin.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { HistoryComponent } from './modules/history/history.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent},

  { path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard]
  },

  { path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  { path: 'form',
    component: FormComponent,
    canActivate: [authGuard]
  },

  { path: 'history',
    component: HistoryComponent,
    canActivate: [authGuard]
  },

  //Por defecto ir al login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  //Redirigir cualquier ruta desconocida al login
  {path: '**', redirectTo: '/login' }
];

