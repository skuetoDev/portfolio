import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent,
      ),
    children: [
      { path: '', redirectTo: 'works', pathMatch: 'full' },
      {
        path: 'works',
        loadComponent: () =>
          import('./manage-works/manage-works.component').then(
            (c) => c.ManageWorksComponent,
          ),
      },
      {
        path: 'social',
        loadComponent: () =>
          import('./manage-social/manage-social.component').then(
            (c) => c.ManageSocialComponent,
          ),
      },
      {
        path: 'cv',
        loadComponent: () =>
          import('./manage-cv/manage-cv.component').then(
            (c) => c.ManageCvComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then((c) => c.ProfileComponent),
      },
    ],
  },
];
