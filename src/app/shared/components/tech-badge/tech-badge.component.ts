import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Technology } from '../../../core/models/index';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-badge.component.html',
  styleUrls: ['./tech-badge.component.scss'],
})
export class TechBadgeComponent {
  @Input() technology!: Technology;
}
