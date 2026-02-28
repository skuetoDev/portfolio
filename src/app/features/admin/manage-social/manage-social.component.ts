import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SocialService } from '../../../core/services/social.service';
import { SocialNetwork } from '../../../core/models';

@Component({
  selector: 'app-manage-social',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-social.component.html',
  styleUrls: ['./manage-social.component.scss'],
})
export class ManageSocialComponent implements OnInit {
  networks = signal<SocialNetwork[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  form!: FormGroup;

  // Iconos predefinidos para redes conocidas
  presetIcons = [
    { name: 'GitHub', icon: 'github' },
    { name: 'LinkedIn', icon: 'linkedin' },
    { name: 'Twitter/X', icon: 'twitter' },
    { name: 'Instagram', icon: 'instagram' },
    { name: 'YouTube', icon: 'youtube' },
    { name: 'Behance', icon: 'behance' },
    { name: 'Dribbble', icon: 'dribbble' },
  ];

  constructor(
    private socialService: SocialService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.socialService.getNetworks().subscribe((networks) => {
      this.networks.set(networks);
      this.loading.set(false);
    });
    this.initForm();
  }

  private initForm(network?: SocialNetwork): void {
    this.form = this.fb.group({
      name: [network?.name || '', Validators.required],
      url: [
        network?.url || '',
        [Validators.required, Validators.pattern('https?://.+')],
      ],
      icon: [network?.icon || '', Validators.required],
      order: [network?.order ?? this.networks().length],
      visible: [network?.visible ?? true],
    });
  }

  openNew(): void {
    this.editingId.set(null);
    this.initForm();
    this.showForm.set(true);
  }

  openEdit(network: SocialNetwork): void {
    this.editingId.set(network.id!);
    this.initForm(network);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  selectPreset(preset: { name: string; icon: string }): void {
    this.form.patchValue({ name: preset.name, icon: preset.icon });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const id = this.editingId();
    const obs$ = id
      ? this.socialService.updateNetwork(id, this.form.value)
      : this.socialService.addNetwork(this.form.value);

    obs$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(network: SocialNetwork): void {
    if (!confirm(`¿Eliminar ${network.name}?`)) return;
    this.socialService.deleteNetwork(network.id!).subscribe();
  }

  toggle(network: SocialNetwork): void {
    this.socialService
      .toggleVisibility(network.id!, !network.visible)
      .subscribe();
  }
}
