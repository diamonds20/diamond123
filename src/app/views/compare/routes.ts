import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./compare.component').then(m => m.CompareComponent),
    data: {
      title: 'Compare'
  }
  }
];

