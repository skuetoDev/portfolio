import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map((user) => {
      // Verifica que esté autenticado Y que sea el email admin
      const isAdmin = !!user && user.email === environment.adminEmail;

      if (isAdmin) return true;

      router.navigate(['/login']);
      return false;
    }),
  );
};
