// === TRABAJO / PROJECT ===
export interface Work {
  id?: string;
  title: string;
  description: string; // Soportará i18n con objeto {es, en}
  descriptionI18n: { [lang: string]: string };
  mediaUrl: string; // URL imagen o video en Firebase Storage
  mediaType: 'image' | 'video';
  technologies: Technology[];
  order: number;
  visible: boolean;
  createdAt: Date;
  repoUrl?: string;
}

// === TECNOLOGÍA ===
export interface Technology {
  name: string;
  svgUrl: string; // URL del SVG en Storage o assets local
}

// === RED SOCIAL ===
export interface SocialNetwork {
  id?: string;
  name: string; // 'GitHub', 'LinkedIn', etc.
  url: string;
  icon: string; // Nombre del SVG icon
  visible: boolean;
  order: number;
}

// === EXPERIENCIA PROFESIONAL ===
export interface Experience {
  id?: string;
  company: string;
  role: string;
  roleI18n: { [lang: string]: string };
  startDate: Date;
  endDate?: Date | null ; 
  current: boolean;
  descriptionI18n: { [lang: string]: string };
  technologies: string[];
}

// === PERFIL CV ===
export interface CvProfile {
  cvFileUrl: string; // URL del PDF en Firebase Storage
  lastUpdated: Date;
  experiences: Experience[];
}
