import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./outwards.component').then(m => m.OutwardsComponent),
    data: {
      title: 'Outwards'
  }
  }
];

