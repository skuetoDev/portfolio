import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon.component';
import { WorksService } from '../../../core/services/works.service';
import { Work } from '../../../core/models';

@Component({
  selector: 'app-manage-works',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SvgIconComponent],
  templateUrl: './manage-works.component.html',
  styleUrls: ['./manage-works.component.scss'],
})
export class ManageWorksComponent implements OnInit {
  works = signal<Work[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  editingId = signal<string | null>(null);

  form!: FormGroup;
  selectedTechs = signal<string[]>([]);

  // Iconos disponibles en public/icons/technologies/
  readonly techIcons = [
    'angular', 'css', 'docker', 'html5', 'java', 'javascript',
    'laravel', 'mariadb', 'mongodb', 'nodejs', 'php', 'scss', 'wordpress',
  ];

  constructor(
    private worksService: WorksService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loadWorks();
    this.initForm();
  }

  private loadWorks(): void {
    this.worksService.getWorks().subscribe((works) => {
      this.works.set(works);
      this.loading.set(false);
    });
  }

  private initForm(work?: Work): void {
    // Restaurar selección desde svgUrl guardado
    const selected = (work?.technologies || [])
      .map((t) => t.svgUrl?.split('/').pop()?.replace('.svg', '') ?? t.name.toLowerCase())
      .filter((name) => this.techIcons.includes(name));
    this.selectedTechs.set(selected);

    this.form = this.fb.group({
      title: [work?.title || '', [Validators.required, Validators.maxLength(100)]],
      descEs: [
        work?.descriptionI18n?.['es'] || '',
        [Validators.required, Validators.maxLength(500)],
      ],
      descEn: [work?.descriptionI18n?.['en'] || '', Validators.maxLength(500)],
      mediaUrl: [work?.mediaUrl || '', Validators.required],
      mediaType: [work?.mediaType || 'image'],
      repoUrl: [work?.repoUrl || ''],
      order: [work?.order ?? 0],
      visible: [work?.visible ?? true],
    });
  }

  toggleTech(name: string): void {
    const current = this.selectedTechs();
    if (current.includes(name)) {
      this.selectedTechs.set(current.filter((t) => t !== name));
    } else {
      this.selectedTechs.set([...current, name]);
    }
  }

  isTechSelected(name: string): boolean {
    return this.selectedTechs().includes(name);
  }

  // ── Abrir formulario ───────────────────────────────
  openNew(): void {
    this.editingId.set(null);
    this.initForm();
    this.showForm.set(true);
  }

  openEdit(work: Work): void {
    this.editingId.set(work.id!);
    this.initForm(work);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  get previewUrl(): string {
    return this.form?.get('mediaUrl')?.value || '';
  }

  // ── Guardar ────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const val = this.form.value;
    const workData: Omit<Work, 'id' | 'createdAt'> = {
      title: val.title,
      description: val.descEs,
      descriptionI18n: { es: val.descEs, en: val.descEn || val.descEs },
      mediaUrl: val.mediaUrl,
      mediaType: val.mediaType,
      repoUrl: val.repoUrl || '',
      technologies: this.selectedTechs().map((name) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        svgUrl: `icons/technologies/${name}.svg`,
      })),
      order: val.order,
      visible: val.visible,
    };

    const id = this.editingId();
    const obs$ = id
      ? this.worksService.updateWork(id, workData)
      : this.worksService.addWork({ ...workData, createdAt: new Date() });

    obs$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
      },
      error: (err) => {
        console.error(err);
        this.saving.set(false);
      },
    });
  }

  // ── Eliminar ───────────────────────────────────────
  deleteWork(work: Work): void {
    if (!confirm(`¿Eliminar "${work.title}"?`)) return;
    this.worksService.deleteWork(work.id!).subscribe();
  }

  // ── Toggle visibilidad ─────────────────────────────
  toggleVisible(work: Work): void {
    this.worksService
      .updateWork(work.id!, { visible: !work.visible })
      .subscribe();
  }
}
