import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FlipCardComponent } from '../../shared/components/flip-card/flip-card.component';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { WorkCardComponent } from '../../shared/components/work-card/work-card.component';
import { WorksService } from '../../core/services/works.service';
import { Work } from '../../core/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    CommonModule,
    FlipCardComponent,
    SectionTitleComponent,
    WorkCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  featuredWorks = signal<Work[]>([]);

  // Flip Card
  frontImage = './images/flip-Card/Foto_CV.webp';
  backImage = './images/flip-Card/skuetoDev.webp';

 

  constructor(private worksService: WorksService) {

  }

  ngOnInit(): void {
    this.worksService.getWorks().subscribe((works) => {
      // Solo los 3 primeros trabajos visibles en home
      this.featuredWorks.set(works.filter((w) => w.visible).slice(0, 3));
    });
  }
}
