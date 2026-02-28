import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isScrolled = signal(false);
  isMenuOpen = signal(false);
  currentLang = signal('es');

  navLinks = [
    { path: '/', labelKey: 'NAV.HOME' },
    { path: '/works', labelKey: 'NAV.WORKS' },
    { path: '/cv', labelKey: 'NAV.CV' },
    { path: '/social', labelKey: 'NAV.SOCIAL' },
    { path: '/contact', labelKey: 'NAV.CONTACT' },
  ];

  constructor(private translate: TranslateService) {
    this.currentLang.set(translate.currentLang || 'es');
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
  }
}
