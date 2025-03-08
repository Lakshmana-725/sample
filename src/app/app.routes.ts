import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/sample/sample.component').then(
        (m) => m.SampleComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
];
