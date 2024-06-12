import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./inwards.component').then(m => m.InwardsComponent),
    data: {
      title: 'Inwards'
  }
  }
];

