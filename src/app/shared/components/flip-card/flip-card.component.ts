import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flip-card.component.html',
  styleUrls: ['./flip-card.component.scss'],
})
  
export class FlipCardComponent {
  @Input() frontImage!: string; // URL imagen frontal
  @Input() backImage!: string  ; // URL imagen trasera
  @Input() altText: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
