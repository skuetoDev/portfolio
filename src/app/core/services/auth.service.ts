import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  user,
  User,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  isLoading = signal(true);

  constructor(
    private auth: Auth,
    private router: Router,
  ) {
    // Escucha cambios de sesión en tiempo real
    user(this.auth).subscribe((u) => {
      this.currentUser.set(u);
      this.isLoading.set(false);
    });
  }

  // ── Login ──────────────────────────────────────────
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // ── Logout ─────────────────────────────────────────
  logout(): Observable<void> {
    return from(
      signOut(this.auth).then(() => {
        this.router.navigate(['/login']);
      }),
    );
  }

  // ── ¿Está autenticado? ─────────────────────────────
  get isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  // ── ¿Es el admin autorizado? ───────────────────────
  get isAdmin(): boolean {
    return this.currentUser()?.email === environment.adminEmail;
  }

  // ── Cambiar contraseña (requiere reautenticación) ──
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const u = this.currentUser();
    if (!u || !u.email) throw new Error('No hay usuario autenticado');

    // Reautentica primero por seguridad
    const credential = EmailAuthProvider.credential(u.email, currentPassword);
    await reauthenticateWithCredential(u, credential);
    await updatePassword(u, newPassword);
  }
}
