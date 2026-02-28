import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

// Validador personalizado: contraseñas coinciden
function passwordsMatch(control: AbstractControl) {
  const pass = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl:'./profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  form: FormGroup;
  saving = signal(false);
  success = signal(false);
  error = signal('');

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
  ) {
    this.form = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordsMatch },
    );
  }

  get f() {
    return this.form.controls;
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.f['newPassword'].value ?? '');
  }

  hasNumber(): boolean {
    return /\d/.test(this.f['newPassword'].value ?? '');
  }

  hasSymbol(): boolean {
    return /[^A-Za-z0-9]/.test(this.f['newPassword'].value ?? '');
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.saving.set(true);
    this.error.set('');

    const { currentPassword, newPassword } = this.form.value;

    try {
      await this.auth.changePassword(currentPassword, newPassword);
      this.success.set(true);
      this.form.reset();
      setTimeout(() => this.success.set(false), 4000);
    } catch (err: any) {
      const msgs: Record<string, string> = {
        'auth/wrong-password': 'La contraseña actual es incorrecta',
        'auth/invalid-credential': 'La contraseña actual es incorrecta',
        'auth/requires-recent-login':
          'Cierra sesión y vuelve a entrar para cambiar la contraseña',
      };
      this.error.set(msgs[err.code] || 'Error al cambiar la contraseña');
    } finally {
      this.saving.set(false);
    }
  }
}
