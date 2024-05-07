import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./operators-grid.component').then(m => m.OperatorsGridComponent),
    data: {
      title: 'Operators Grid'
  }
  }
];

