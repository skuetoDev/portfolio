import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  showPass = signal(false);
  heroBg: SafeStyle;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    sanitizer: DomSanitizer,
  ) {
     this.heroBg = sanitizer.bypassSecurityTrustStyle(
       `linear-gradient(rgba(250,250,250,0.85), rgba(250,250,250,0.85)), url('./images/background.svg')`,
     );
    // Si ya está autenticado, redirige directo al admin
    if (this.auth.isAuthenticated) {
      this.router.navigate(['/admin']);
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePass(): void {
    this.showPass.update((v) => !v);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: (result) => {
        console.log('✅ Login OK:', result.user.email); // ← AÑADIDO
        this.loading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.log('❌ Error code:', err.code); // ← AÑADIDO
        console.log('❌ Error message:', err.message); // ← AÑADIDO
        this.loading.set(false);
        this.error.set(this.getFirebaseError(err.code));
      },
    });
  }

  private getFirebaseError(code: string): string {
    const errors: Record<string, string> = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Email o contraseña incorrectos',
      'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos',
      'auth/user-disabled': 'Usuario deshabilitado',
    };
    return errors[code] || 'Error al iniciar sesión. Inténtalo de nuevo';
  }
}
