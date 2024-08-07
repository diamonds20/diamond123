import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { LoginComponent } from '../app/views/pages/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthGuard } from 'src/utils/auth.guard';
import { AuthResolver } from 'src/utils/auth.resolver';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent), data: { title: 'Login Page' } },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: { title: 'Home' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' , resolve: { auth: AuthResolver } },
      { path: 'dashboard', loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'operators-grid', loadChildren: () => import('./views/operators-grid/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'inwards', loadChildren: () => import('./views/inwards/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'compare', loadChildren: () => import('./views/compare/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'outwards', loadChildren: () => import('./views/outwards/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'theme', loadChildren: () => import('./views/theme/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'base', loadChildren: () => import('./views/base/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'buttons', loadChildren: () => import('./views/buttons/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'forms', loadChildren: () => import('./views/forms/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'icons', loadChildren: () => import('./views/icons/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'notifications', loadChildren: () => import('./views/notifications/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'widgets', loadChildren: () => import('./views/widgets/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'charts', loadChildren: () => import('./views/charts/routes').then((m) => m.routes), resolve: { auth: AuthResolver } },
      { path: 'pages', loadChildren: () => import('./views/pages/routes').then((m) => m.routes), resolve: { auth: AuthResolver } }
    ]
  },
  // { path: '404', loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component), data: { title: 'Page 404' } },
  { path: '500', loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component), data: { title: 'Page 500' } },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: '404', loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component), data: { title: 'Page 404' } },
  { path: 'diamonds', loadComponent: () => import('./views/pages/diamonds/diamonds.component').then(m => m.DiamondsComponent), data: { title: 'Diamonds Page' } },
  { path: '**', redirectTo: '404' }
];