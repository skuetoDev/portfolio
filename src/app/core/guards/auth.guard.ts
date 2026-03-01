import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, filter, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    filter((user) => user !== undefined), // ← Espera a que Firebase responda
    take(1),
    map((user) => {
      const isAdmin = !!user && user.email === environment.adminEmail;

      if (isAdmin) return true;

      router.navigate(['/login']);
      return false;
    }),
  );
};
