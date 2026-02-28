import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { WorkCardComponent } from '../../shared/components/work-card/work-card.component';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { WorksService } from '../../core/services/works.service';
import { Work } from '../../core/models';

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    WorkCardComponent,
    SectionTitleComponent,
  ],
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss'],
})
export class WorksComponent implements OnInit {
  works = signal<Work[]>([]);
  loading = signal(true);
  allTechs = signal<string[]>([]);
  activeFilter = signal<string>('all');

  constructor(private worksService: WorksService) {}

  ngOnInit(): void {
    this.worksService.getWorks().subscribe((works) => {
      const visible = works.filter((w) => w.visible);
      this.works.set(visible);

      // Extrae todas las tecnologías únicas para el filtro
      const techs = [
        ...new Set(visible.flatMap((w) => w.technologies.map((t) => t.name))),
      ].sort();
      this.allTechs.set(techs);
      this.loading.set(false);
    });
  }

  get filteredWorks(): Work[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.works();
    return this.works().filter((w) =>
      w.technologies.some((t) => t.name === filter),
    );
  }

  setFilter(tech: string): void {
    this.activeFilter.set(tech);
  }
}
