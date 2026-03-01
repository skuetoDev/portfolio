import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  sidebarOpen = signal(true);

  menuItems: { path: string; label: string; icon: SafeHtml }[];
  heroBg: SafeStyle;

  constructor(
    public auth: AuthService,
    sanitizer: DomSanitizer,
  ) {
    const svgStyle = 'width:20px;height:20px;stroke:currentColor;fill:none;';
    this.menuItems = [
      {
        path: '/admin/works',
        label: 'Trabajos',
        icon: sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" style="${svgStyle}" stroke-width="2">
             <rect x="2" y="3" width="20" height="14" rx="2"/>
             <path d="M8 21h8M12 17v4"/>
           </svg>`,
        ),
      },
      {
        path: '/admin/social',
        label: 'Redes sociales',
        icon: sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" style="${svgStyle}" stroke-width="2">
             <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/>
             <circle cx="18" cy="19" r="3"/>
             <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
           </svg>`,
        ),
      },
      {
        path: '/admin/cv',
        label: 'Currículum',
        icon: sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" style="${svgStyle}" stroke-width="2">
             <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
             <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
           </svg>`,
        ),
      },
      {
        path: '/admin/profile',
        label: 'Perfil',
        icon: sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" style="${svgStyle}" stroke-width="2">
             <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
             <circle cx="12" cy="7" r="4"/>
           </svg>`,
        ),
      },
    ];

    this.heroBg = sanitizer.bypassSecurityTrustStyle(
      `linear-gradient(rgba(250,250,250,0.85), rgba(250,250,250,0.85)), url('./images/background.svg')`,
    );
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  logout(): void {
    this.auth.logout().subscribe();
  }
}
