import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CvService } from '../../../core/services/cv.service';
import { CvProfile, Experience } from '../../../core/models';

@Component({
  selector: 'app-manage-cv',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-cv.component.html',
  styleUrls: ['./manage-cv.component.scss'],
})
export class ManageCvComponent implements OnInit {
  profile = signal<CvProfile | null>(null);
  loading = signal(true);
  saving = signal(false);
  uploadProgress = signal(0);
  showExpForm = signal(false);
  editingExpIdx = signal<number | null>(null);
  expForm!: FormGroup;

  constructor(
    private cvService: CvService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.cvService.getProfile().subscribe((profile) => {
      this.profile.set(profile);
      this.loading.set(false);
    });
    this.initExpForm();
  }

  // ── PDF ────────────────────────────────────────────
  updateCvUrl(): void {
    const url = '/assets/cv/marioCV.pdf';
    this.cvService.updateCvUrl(url).subscribe({
      next: () => alert('✅ URL del CV actualizada'),
      error: (e) => console.error(e),
    });
  }

  // ── Experiencias ───────────────────────────────────
  private initExpForm(exp?: Experience): void {
    this.expForm = this.fb.group({
      company: [exp?.company || '', Validators.required],
      role: [exp?.role || '', Validators.required],
      roleEn: [exp?.roleI18n?.['en'] || ''],
      startDate: [
        exp?.startDate ? this.toInputDate(exp.startDate) : '',
        Validators.required,
      ],
      endDate: [exp?.endDate ? this.toInputDate(exp.endDate) : ''],
      current: [exp?.current ?? false],
      descEs: [exp?.descriptionI18n?.['es'] || '', Validators.required],
      descEn: [exp?.descriptionI18n?.['en'] || ''],
      technologies: [exp?.technologies?.join(', ') || ''],
    });

    // Si es trabajo actual, deshabilita endDate
    this.expForm.get('current')?.valueChanges.subscribe((current) => {
      const endCtrl = this.expForm.get('endDate');
      current ? endCtrl?.disable() : endCtrl?.enable();
    });
  }

  private toInputDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  openNewExp(): void {
    this.editingExpIdx.set(null);
    this.initExpForm();
    this.showExpForm.set(true);
  }

  openEditExp(exp: Experience, idx: number): void {
    this.editingExpIdx.set(idx);
    this.initExpForm(exp);
    this.showExpForm.set(true);
  }

  closeExpForm(): void {
    this.showExpForm.set(false);
  }

  saveExp(): void {
    if (this.expForm.invalid) return;
    this.saving.set(true);

    const val = this.expForm.getRawValue();
    const newExp: Experience = {
      company: val.company,
      role: val.role,
      roleI18n: { es: val.role, en: val.roleEn || val.role },
      startDate: new Date(val.startDate),
      endDate: val.current ? null : val.endDate ? new Date(val.endDate) : null,
      current: val.current,
      descriptionI18n: { es: val.descEs, en: val.descEn || val.descEs },
      technologies: val.technologies
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean),
    };

    const exps = [...(this.profile()?.experiences || [])];
    const idx = this.editingExpIdx();
    idx !== null ? exps.splice(idx, 1, newExp) : exps.push(newExp);

    this.cvService.updateExperiences(exps).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeExpForm();
      },
      error: () => this.saving.set(false),
    });
  }

  deleteExp(idx: number): void {
    if (!confirm('¿Eliminar esta experiencia?')) return;
    const exps = [...(this.profile()?.experiences || [])];
    exps.splice(idx, 1);
    this.cvService.updateExperiences(exps).subscribe();
  }
}
