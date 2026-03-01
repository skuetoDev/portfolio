import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { CvService } from '../../core/services/cv.service';
import { CvProfile, Experience } from '../../core/models';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule, TranslateModule, SectionTitleComponent],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss'],
})
export class CvComponent implements OnInit {
  profile = signal<CvProfile | null>(null);
  loading = signal(true);

  safePdfUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.profile()?.cvFileUrl;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  constructor(
    private cvService: CvService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.cvService.getProfile().subscribe((profile) => {
      this.profile.set(profile);
      this.loading.set(false);
    });
  }

  getRole(exp: Experience): string {
    const lang = this.translate.currentLang || 'es';
    return exp.roleI18n?.[lang] || exp.role;
  }

  getDescription(exp: Experience): string {
    const lang = this.translate.currentLang || 'es';
    return exp.descriptionI18n?.[lang] || '';
  }

  downloadCv(): void {
    const url = this.profile()?.cvFileUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marioCV.pdf';
    a.click();
  }
}
