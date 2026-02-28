import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main class="main-content">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [
    `
      .main-content {
        min-height: calc(100vh - var(--navbar-height));
        padding-top: var(--navbar-height);
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // Detecta idioma del navegador o usa español por defecto
    const browserLang = this.translate.getBrowserLang();
    const lang = browserLang?.match(/es|en/) ? browserLang : 'es';
    this.translate.use(lang);
  }
}
