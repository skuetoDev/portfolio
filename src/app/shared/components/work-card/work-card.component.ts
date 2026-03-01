import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Work } from '../../../core/models/index';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TechBadgeComponent } from '../tech-badge/tech-badge.component';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { SafeUrlPipe } from "../../pipes/safe-url.pipe";
import { TruncatePipe } from "../../pipes/truncate.pipe";

@Component({
  selector: 'app-work-card',
  standalone: true,
  imports: [CommonModule, TechBadgeComponent, SvgIconComponent, SafeUrlPipe, TruncatePipe, TranslateModule],
  templateUrl: './work-card.component.html',
  styleUrls: ['./work-card.component.scss'],
})
export class WorkCardComponent {
  @Input() work!: Work;

  isModalOpen = signal(false);
  currentLang = signal('es');

  constructor(translate: TranslateService) {
    translate.onLangChange.subscribe(({ lang }) => this.currentLang.set(lang));
  }

  get description(): string {
    return this.work.descriptionI18n?.[this.currentLang()] || this.work.description || '';
  }

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }
}
