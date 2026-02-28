import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { SocialService } from '../../core/services/social.service';
import { SocialNetwork } from '../../core/models';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule, TranslateModule, SectionTitleComponent],
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
})
export class SocialComponent implements OnInit {
  networks = signal<SocialNetwork[]>([]);
  loading = signal(true);

  constructor(private socialService: SocialService) {}

  ngOnInit(): void {
    this.socialService.getNetworks().subscribe((networks) => {
      this.networks.set(networks.filter((n) => n.visible));
      this.loading.set(false);
    });
  }
}
