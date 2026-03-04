import { Component, Input, OnChanges, ViewEncapsulation, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  imports: [SafeHtmlPipe],
  template: `<span [innerHTML]="svgContent | safeHtml"></span>`,
  styles: [`
    app-svg-icon        { display: contents; }
    app-svg-icon span   { display: contents; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class SvgIconComponent implements OnChanges {
  @Input() src = '';

  svgContent = '';

  private http = inject(HttpClient);

  ngOnChanges(): void {
    if (!this.src) return;
    this.http.get(this.src, { responseType: 'text' }).subscribe({
      next: (svg) => (this.svgContent = svg),
    });
  }
}
