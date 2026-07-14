import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  currentLang = signal('es');
  

  constructor(
    private cvService: CvService,
    translate: TranslateService,
  ) {
    this.currentLang.set(translate.getCurrentLang() || 'es');
    translate.onLangChange.subscribe(({ lang }) => this.currentLang.set(lang));
  }
  

  ngOnInit(): void {
    this.cvService.getProfile().subscribe((profile) => {
      this.profile.set(profile);
      this.loading.set(false);
    });
  }

  getRole(exp: Experience): string {
    return exp.roleI18n?.[this.currentLang()] || exp.role;
  }

  getDescription(exp: Experience): string {
    return exp.descriptionI18n?.[this.currentLang()] || '';
  }

  downloadCv(): void {
    const url = this.profile()?.cvFileUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marioGarciaCV.pdf';
    a.click();
  }
  
  sortedExperiences = computed(() =>
    [...(this.profile()?.experiences ?? [])].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
  );
}
