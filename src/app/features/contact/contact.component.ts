import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    SectionTitleComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  form: FormGroup;
  submitted = signal(false);
  success = signal(false);
  sending = signal(false);

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private contactService: ContactService,
  ) {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(60),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      subject: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100),
        ],
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(2000),
        ],
      ],
    });
  }

  // Acceso rápido a los campos
  get f() {
    return this.form.controls;
  }

  getError(field: string): string | null {
    const control = this.form.get(field);
    if (
      !control ||
      !control.invalid ||
      (!this.submitted() && !control.touched)
    ) {
      return null;
    }
    if (control.hasError('required'))
      return this.translate.instant('CONTACT.ERRORS.REQUIRED');
    if (control.hasError('email'))
      return this.translate.instant('CONTACT.ERRORS.EMAIL_INVALID');
    if (control.hasError('minlength')) {
      const min = control.errors?.['minlength'].requiredLength;
      return this.translate.instant('CONTACT.ERRORS.MIN_LENGTH', { min });
    }
    if (control.hasError('maxlength')) {
      const max = control.errors?.['maxlength'].requiredLength;
      return this.translate.instant('CONTACT.ERRORS.MAX_LENGTH', { max });
    }
    return null;
  }

  get messageLength(): number {
    return this.form.get('message')?.value?.length || 0;
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.sending.set(true);

    try {
      await this.contactService.send(this.form.value);
      this.success.set(true);
      this.form.reset();
      this.submitted.set(false);
      setTimeout(() => this.success.set(false), 5000);
    } catch {
      // error de red — el envío no llegó
    } finally {
      this.sending.set(false);
    }
  }
}
