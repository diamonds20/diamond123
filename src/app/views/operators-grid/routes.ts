import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'operators-grid',
    loadComponent: () => import('./operators-grid.component').then(m => m.OperatorsGridComponent),
    data: {
      title: 'Operators Grid'
  }
  }
];

