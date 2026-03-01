import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  heroBg: SafeStyle;
  constructor(
    private translate: TranslateService,
    sanitizer: DomSanitizer,
  ) {
    this.heroBg = sanitizer.bypassSecurityTrustStyle(
      `linear-gradient(rgba(250,250,250,0.85), rgba(250,250,250,0.85)), url('./images/background.svg')`,
    );
  }

  ngOnInit(): void {
    const browserLang = this.translate.getBrowserLang();
    const lang = browserLang?.match(/es|en/) ? browserLang : 'es';
    this.translate.use(lang);
  }
}
