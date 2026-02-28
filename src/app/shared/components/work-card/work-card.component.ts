import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Work } from '../../../core/models/index';
import { TranslateService } from '@ngx-translate/core';
import { TechBadgeComponent } from '../tech-badge/tech-badge.component';
import { SafeUrlPipe } from "../../pipes/safe-url.pipe";
import { TruncatePipe } from "../../pipes/truncate.pipe";

@Component({
  selector: 'app-work-card',
  standalone: true,
  imports: [CommonModule, TechBadgeComponent, SafeUrlPipe, TruncatePipe],
  templateUrl: './work-card.component.html',
  styleUrls: ['./work-card.component.scss'],
})
export class WorkCardComponent {
  @Input() work!: Work;

  constructor(private translate: TranslateService) {}

  get description(): string {
    const lang = this.translate.currentLang || 'es';
    return this.work.descriptionI18n?.[lang] || this.work.description || '';
  }
}
