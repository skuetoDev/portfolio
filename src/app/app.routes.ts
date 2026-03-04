import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'works',
    loadComponent: () =>
      import('./features/works/works.component').then((c) => c.WorksComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then(
        (c) => c.ContactComponent,
      ),
  },
  {
    path: 'social',
    loadComponent: () =>
      import('./features/social/social.component').then(
        (c) => c.SocialComponent,
      ),
  },
  {
    path: 'cv',
    loadComponent: () =>
      import('./features/cv/cv.component').then((c) => c.CvComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/admin/login/login.component').then(
        (c) => c.LoginComponent,
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((r) => r.adminRoutes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (c) => c.NotFoundComponent,
      ),
  },
];
